/**
 * Script para testar conectividade com Supabase
 * Uso: node test-supabase-connection.js
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ifhfpaehnjpdwdocdzwd.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaGZwYWVobmpwZHdkb2NkendkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMDMxMzIsImV4cCI6MjA3MjU3OTEzMn0.-YL0e3oE6mRqL0K432iP3dlbTRPz8G07QJLOI0Ulcyk'

console.log('🔍 Testando conectividade com Supabase...')
console.log('📍 URL:', supabaseUrl)
console.log('🔑 Key (primeiros 20 chars):', supabaseAnonKey.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testConnection() {
  try {
    console.log('\n1. 🌐 Testando conectividade básica...')
    
    // Test 1: Ping básico
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    console.log('✅ Conectividade básica OK')
    
    console.log('\n2. 📊 Testando acesso a dados...')
    
    // Test 2: Query simples
    const { data, error } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1)
    
    if (error && error.code !== 'PGRST116') {
      throw error
    }
    
    console.log('✅ Acesso a dados OK')
    
    console.log('\n3. 🔐 Testando autenticação...')
    
    // Test 3: Auth endpoint
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: {
        'apikey': supabaseAnonKey
      }
    })
    
    if (!authResponse.ok) {
      throw new Error(`Auth endpoint error: ${authResponse.status}`)
    }
    
    const authData = await authResponse.json()
    console.log('✅ Endpoint de autenticação OK')
    console.log('📋 Configurações de auth:', {
      external_email_enabled: authData.external?.email?.enabled,
      external_phone_enabled: authData.external?.phone?.enabled,
      disable_signup: authData.disable_signup,
      mailer_autoconfirm: authData.mailer_autoconfirm
    })
    
    console.log('\n🎉 Todos os testes passaram com sucesso!')
    
  } catch (error) {
    console.error('\n❌ Erro no teste de conectividade:')
    console.error('📝 Tipo:', error.constructor.name)
    console.error('💬 Mensagem:', error.message)
    
    if (error.cause) {
      console.error('🔍 Causa:', error.cause)
    }
    
    if (error.code) {
      console.error('🏷️ Código:', error.code)
    }
    
    // Dicas de troubleshooting
    console.log('\n🔧 Dicas de troubleshooting:')
    
    if (error.message.includes('fetch')) {
      console.log('• Problema de rede - verifique conectividade')
      console.log('• Se estiver na Vercel, verifique as variáveis de ambiente')
      console.log('• Teste com curl: curl -I ' + supabaseUrl)
    }
    
    if (error.message.includes('CORS')) {
      console.log('• Problema de CORS - verifique "Allowed origins" no Supabase')
      console.log('• Adicione seu domínio no Dashboard do Supabase')
    }
    
    if (error.code === 'PGRST116') {
      console.log('• Tabela não encontrada - normal se o banco estiver vazio')
    }
    
    process.exit(1)
  }
}

// Executar teste
testConnection()
