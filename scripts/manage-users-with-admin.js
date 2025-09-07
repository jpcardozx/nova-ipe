const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' })

console.log('🔧 Gerenciador de Usuários Supabase\n')

// Para usar este script, você precisa do SERVICE_ROLE_KEY
// Encontre em: https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd/settings/api
// Cole na linha abaixo:
const SERVICE_ROLE_KEY = 'COLE_SEU_SERVICE_ROLE_KEY_AQUI'

if (SERVICE_ROLE_KEY === 'COLE_SEU_SERVICE_ROLE_KEY_AQUI') {
  console.log('❌ Configure seu SERVICE_ROLE_KEY primeiro!')
  console.log('\n📋 Para pegar o Service Role Key:')
  console.log('1. Acesse: https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd/settings/api')
  console.log('2. Copie o "service_role" key (secret)')
  console.log('3. Cole na variável SERVICE_ROLE_KEY neste arquivo')
  console.log('4. Execute novamente: node scripts/manage-users-with-admin.js')
  process.exit(1)
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAdmin = createClient(supabaseUrl, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createUser() {
  const email = 'teste@ipe.com.br'
  const password = '123456'
  
  console.log('🔄 Criando usuário via Service Role...')
  
  try {
    // Criar usuário como admin
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Já confirma o email
      user_metadata: {
        full_name: 'Usuário de Teste'
      }
    })
    
    if (userError) {
      console.error('❌ Erro ao criar usuário:', userError.message)
      return
    }
    
    console.log('✅ Usuário criado:', userData.user.id)
    
    // Criar profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([{
        id: userData.user.id,
        email: email,
        full_name: 'Usuário de Teste',
        role: 'user',
        is_active: true,
        is_approved: true
      }])
      .select()
      .single()
    
    if (profileError) {
      console.warn('⚠️  Erro ao criar profile:', profileError.message)
    } else {
      console.log('✅ Profile criado:', profileData.id)
    }
    
    console.log('\n🎉 Usuário criado com sucesso!')
    console.log('📧 Email:', email)
    console.log('🔑 Senha:', password)
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

async function listUsers() {
  console.log('👥 Listando usuários...')
  
  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
    
    if (error) {
      console.error('❌ Erro:', error.message)
      return
    }
    
    console.log(`\n✅ Encontrados ${users.length} usuários:`)
    users.forEach((user, i) => {
      console.log(`${i + 1}. ${user.email} (${user.id.substring(0, 8)}...)`)
      console.log(`   Confirmado: ${user.email_confirmed_at ? '✅' : '❌'}`)
      console.log(`   Criado em: ${new Date(user.created_at).toLocaleDateString('pt-BR')}`)
      console.log()
    })
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

async function disableRLS() {
  console.log('🔓 Desabilitando RLS temporariamente...')
  
  try {
    // Desabilitar RLS nas tabelas principais
    const queries = [
      'ALTER TABLE access_requests DISABLE ROW LEVEL SECURITY',
      'ALTER TABLE profiles DISABLE ROW LEVEL SECURITY',
      'ALTER TABLE login_attempts DISABLE ROW LEVEL SECURITY'
    ]
    
    for (const query of queries) {
      const { error } = await supabaseAdmin.rpc('exec_sql', { sql: query })
      if (error) {
        console.warn('⚠️', query, ':', error.message)
      } else {
        console.log('✅', query.split(' ')[2]) // Nome da tabela
      }
    }
    
    console.log('\n✅ RLS desabilitado! Agora você pode usar o signup form.')
    console.log('⚠️  IMPORTANTE: Reabilite depois com enableRLS()')
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

// Menu interativo
const args = process.argv.slice(2)
const command = args[0]

switch (command) {
  case 'create':
    createUser()
    break
  case 'list':
    listUsers()
    break
  case 'disable-rls':
    disableRLS()
    break
  default:
    console.log('📖 Comandos disponíveis:')
    console.log('  node scripts/manage-users-with-admin.js create      - Criar usuário de teste')
    console.log('  node scripts/manage-users-with-admin.js list        - Listar usuários')
    console.log('  node scripts/manage-users-with-admin.js disable-rls - Desabilitar RLS')
    console.log('\n💡 Primeiro, configure seu SERVICE_ROLE_KEY no arquivo!')
    break
}