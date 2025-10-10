import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Validando conexão com Supabase...\n')

// 1. Verificar variáveis de ambiente
console.log('📋 Variáveis de ambiente:')
console.log('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌')
console.log('  SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
console.log()

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente faltando!')
  process.exit(1)
}

// 2. Criar clientes
const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

console.log('🔗 Testando conectividade...\n')

// 3. Testar conexão básica (anon client)
try {
  const { data, error } = await supabase.from('properties').select('count', { count: 'exact', head: true })

  if (error) {
    console.log('⚠️  Cliente Anon:', error.message)
  } else {
    console.log('✅ Cliente Anon: Conectado com sucesso')
  }
} catch (error) {
  console.error('❌ Cliente Anon: Falha na conexão:', error.message)
}

// 4. Testar conexão admin (service role)
if (supabaseAdmin) {
  try {
    const { data, error } = await supabaseAdmin.from('properties').select('count', { count: 'exact', head: true })

    if (error) {
      console.log('⚠️  Cliente Admin:', error.message)
    } else {
      console.log('✅ Cliente Admin: Conectado com sucesso')
    }
  } catch (error) {
    console.error('❌ Cliente Admin: Falha na conexão:', error.message)
  }
} else {
  console.log('⚠️  Cliente Admin: Service key não configurada')
}

console.log()

// 5. Testar autenticação
console.log('🔐 Testando autenticação...\n')
try {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.log('ℹ️  Nenhum usuário autenticado (esperado para teste)')
  } else if (user) {
    console.log('✅ Usuário autenticado:', user.email)
  }
} catch (error) {
  console.error('❌ Erro ao verificar autenticação:', error.message)
}

// 6. Listar tabelas disponíveis
console.log('\n📊 Verificando tabelas...\n')
const tables = [
  'properties',
  'users',
  'profiles',
  'wordpress_catalog',
  'aliquotas',
  'messages',
  'contacts'
]

for (const table of tables) {
  try {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.log(`  ${table}: ⚠️  ${error.message}`)
    } else {
      console.log(`  ${table}: ✅ ${count || 0} registros`)
    }
  } catch (error) {
    console.log(`  ${table}: ❌ ${error.message}`)
  }
}

console.log('\n✅ Validação completa!')
