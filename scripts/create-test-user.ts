#!/usr/bin/env npx tsx
/**
 * Script para criar usuário de teste no Supabase Auth
 * Uso: npx tsx scripts/create-test-user.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as readline from 'node:readline'
import process from 'node:process'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function main() {
  console.log('🔐 === CRIAR USUÁRIO DE TESTE NO SUPABASE AUTH ===\n')

  // Verificar variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Erro: Variáveis de ambiente não configuradas!')
    console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
    console.error('\n💡 Configure no arquivo .env.local')
    process.exit(1)
  }

  console.log('✅ Variáveis de ambiente configuradas')
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`)

  // Criar cliente Supabase com service role
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Solicitar dados do usuário
  const email = await question('📧 Email: ')
  const password = await question('🔒 Senha: ')
  const fullName = await question('👤 Nome completo (opcional): ')

  console.log('\n🔄 Criando usuário...')

  try {
    // Criar usuário usando Admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        full_name: fullName || undefined
      }
    })

    if (error) {
      console.error('❌ Erro ao criar usuário:', error.message)
      process.exit(1)
    }

    console.log('\n✅ Usuário criado com sucesso!')
    console.log('📋 Detalhes:')
    console.log('   ID:', data.user.id)
    console.log('   Email:', data.user.email)
    console.log('   Email confirmado:', data.user.email_confirmed_at ? '✅' : '❌')
    console.log('   Criado em:', data.user.created_at)

    // Verificar se user_profile foi criado automaticamente
    console.log('\n🔍 Verificando user_profile...')
    
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.warn('⚠️ User profile não criado automaticamente')
      console.warn('   Isso é esperado se a migration ainda não foi aplicada')
      console.warn('   Execute: APLICAR_MIGRATION_DASHBOARD.sql')
    } else {
      console.log('✅ User profile criado automaticamente!')
      console.log('   Email:', profile.email)
      console.log('   Nome:', profile.full_name || '(não informado)')
      console.log('   Role:', profile.role)
    }

    console.log('\n🎉 Pronto! Você pode fazer login com:')
    console.log(`   Email: ${email}`)
    console.log(`   Senha: ${password}`)
    console.log('\n🔗 Teste em: http://localhost:3000/login')

  } catch (error) {
    console.error('❌ Erro inesperado:', error)
    process.exit(1)
  } finally {
    rl.close()
  }
}

main()
