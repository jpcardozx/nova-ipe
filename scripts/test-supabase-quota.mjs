import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testando quota do Supabase...\n')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Teste 1: Tentativa de autenticação simples
console.log('📝 Teste 1: Tentativa de autenticação...')
try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'teste@teste.com',
    password: '123456'
  })

  if (error) {
    if (error.message.includes('quota')) {
      console.log('❌ QUOTA EXCEEDED detectado')
      console.log('   Mensagem:', error.message)
      console.log('   Status:', error.status)
    } else {
      console.log('✅ Quota OK (erro de credenciais esperado)')
      console.log('   Erro:', error.message)
    }
  } else {
    console.log('✅ Login bem-sucedido (inesperado)')
  }
} catch (e) {
  console.log('❌ Erro:', e.message)
}

console.log('\n⏰ Aguardando 2 segundos...\n')
await new Promise(resolve => setTimeout(resolve, 2000))

// Teste 2: Segunda tentativa
console.log('📝 Teste 2: Segunda tentativa...')
try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'teste2@teste.com',
    password: '123456'
  })

  if (error) {
    if (error.message.includes('quota')) {
      console.log('❌ AINDA bloqueado por quota')
      console.log('\n⚠️  DIAGNÓSTICO:')
      console.log('   O IP está bloqueado no servidor Supabase')
      console.log('   Tempo de bloqueio: Normalmente 1 hora')
      console.log('   Solução: Aguardar ou usar VPN/proxy')
    } else {
      console.log('✅ Quota liberado!')
      console.log('   Sistema pode tentar login novamente')
    }
  }
} catch (e) {
  console.log('❌ Erro:', e.message)
}

console.log('\n📊 Resumo:')
console.log('   Hora do teste:', new Date().toISOString())
console.log('   URL Supabase:', supabaseUrl)
