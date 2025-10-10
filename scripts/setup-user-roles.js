const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const usersConfig = [
  { email: 'jpcardozo@imobiliariaipe.com.br', role: 'admin', name: 'JP Cardozo' },
  { email: 'julia@imobiliariaipe.com.br', role: 'realtor', name: 'Julia Mello' },
  { email: 'leonardo@imobiliariaipe.com.br', role: 'realtor', name: 'Leonardo Fernandes' },
  { email: 'jlpaula@imobiliariaipe.com.br', role: 'realtor', name: 'Julia Paula' }
]

async function setupUserRoles() {
  console.log('\n🔧 CONFIGURANDO ROLES DOS USUÁRIOS\n')
  console.log('━'.repeat(70))
  
  try {
    // 1. Verificar se tabela profiles existe
    console.log('\n📋 Verificando tabela profiles...')
    const { error: tableError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (tableError && tableError.code === '42P01') {
      console.log('⚠️  Tabela profiles não existe! Criando...\n')
      
      // Criar tabela profiles
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT NOT NULL,
            full_name TEXT,
            phone TEXT,
            department TEXT,
            role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'realtor', 'client')),
            status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            last_login TIMESTAMP,
            avatar_url TEXT
          );
          
          -- RLS Policies
          ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
          
          -- Usuários podem ler seu próprio perfil
          CREATE POLICY IF NOT EXISTS "Users can read own profile"
            ON public.profiles FOR SELECT
            USING (auth.uid() = id);
          
          -- Admins podem ler todos os perfis
          CREATE POLICY IF NOT EXISTS "Admins can read all profiles"
            ON public.profiles FOR SELECT
            USING (
              EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND role = 'admin'
              )
            );
            
          -- Service role pode fazer tudo
          CREATE POLICY IF NOT EXISTS "Service role full access"
            ON public.profiles FOR ALL
            USING (auth.jwt() ->> 'role' = 'service_role');
        `
      })
      
      if (createError) {
        console.error('❌ Erro ao criar tabela:', createError.message)
        console.log('\n💡 Crie manualmente no Supabase Dashboard → SQL Editor:')
        console.log('   Use o SQL acima\n')
      } else {
        console.log('✅ Tabela profiles criada com sucesso!\n')
      }
    } else {
      console.log('✅ Tabela profiles já existe\n')
    }
    
    // 2. Listar usuários do Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Erro ao listar usuários:', listError)
      return
    }
    
    console.log(`📊 Encontrados ${users.length} usuários no Auth\n`)
    
    // 3. Configurar roles
    for (const userConfig of usersConfig) {
      const authUser = users.find(u => u.email === userConfig.email)
      
      if (!authUser) {
        console.log(`⚠️  ${userConfig.email} não encontrado no Auth, pulando...\n`)
        continue
      }
      
      console.log(`\n👤 Configurando: ${userConfig.name}`)
      console.log(`   Email: ${userConfig.email}`)
      console.log(`   Role: ${userConfig.role}`)
      console.log(`   ID: ${authUser.id}`)
      
      // Upsert profile
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: authUser.id,
          email: userConfig.email,
          full_name: userConfig.name,
          role: userConfig.role,
          is_active: true,
          is_approved: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
      
      if (upsertError) {
        console.log(`   ❌ Erro: ${upsertError.message}`)
      } else {
        console.log(`   ✅ Profile criado/atualizado!`)
      }
      
      console.log('   ' + '─'.repeat(66))
    }
    
    // 4. Verificar configuração final
    console.log('\n━'.repeat(70))
    console.log('\n📊 CONFIGURAÇÃO FINAL:\n')
    
    const { data: profiles, error: queryError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, is_active, is_approved')
      .in('email', usersConfig.map(u => u.email))
    
    if (queryError) {
      console.error('❌ Erro ao verificar profiles:', queryError.message)
    } else {
      profiles.forEach(profile => {
        const icon = profile.role === 'admin' ? '👑' : '👥'
        const statusIcon = (profile.is_active && profile.is_approved) ? '✅' : '⚠️'
        console.log(`${icon} ${profile.full_name || profile.email} ${statusIcon}`)
        console.log(`   Email: ${profile.email}`)
        console.log(`   Role: ${profile.role}`)
        console.log(`   Active: ${profile.is_active ? 'Yes' : 'No'}`)
        console.log(`   Approved: ${profile.is_approved ? 'Yes' : 'No'}`)
        console.log('')
      })
    }
    
    console.log('━'.repeat(70))
    console.log('\n✅ CONFIGURAÇÃO CONCLUÍDA!\n')
    console.log('🧪 Próximos passos:')
    console.log('   1. Fazer login em /login com as credenciais')
    console.log('   2. Acessar /dashboard/wordpress-catalog')
    console.log('   3. Dashboard agora exige autenticação via Supabase\n')
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message)
    if (error.stack) console.error(error.stack)
  }
}

setupUserRoles()
