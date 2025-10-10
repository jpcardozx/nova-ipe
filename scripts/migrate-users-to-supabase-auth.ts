/**
 * Script para migrar usuários existentes para Supabase Auth
 * 
 * Uso:
 * 1. Configurar variáveis de ambiente
 * 2. npx tsx scripts/migrate-users-to-supabase-auth.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as readline from 'readline'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

interface UserProfile {
  id: string
  email: string
  full_name: string
  phone?: string
  department?: string
}

async function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(question + ' (yes/no): ', (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y')
    })
  })
}

async function migrateUsers(dryRun = true) {
  console.log('🔍 Buscando usuários existentes...\n')

  // 1. Buscar todos os perfis de usuários
  const { data: profiles, error: fetchError } = await supabase
    .from('user_profiles')
    .select('id, email, full_name, phone, department')
    .order('created_at', { ascending: true })

  if (fetchError) {
    console.error('❌ Erro ao buscar perfis:', fetchError)
    process.exit(1)
  }

  if (!profiles || profiles.length === 0) {
    console.log('⚠️  Nenhum perfil encontrado')
    return
  }

  console.log(`📊 Encontrados ${profiles.length} perfis\n`)

  // Estatísticas
  let migrated = 0
  let skipped = 0
  let errors = 0

  for (const profile of profiles as UserProfile[]) {
    console.log(`\n📧 Processando: ${profile.email}`)

    if (dryRun) {
      console.log('   🔸 [DRY RUN] Usuário seria criado')
      migrated++
      continue
    }

    try {
      // Verificar se usuário já existe em auth.users
      const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers()

      if (checkError) {
        console.error('   ❌ Erro ao verificar usuário existente:', checkError.message)
        errors++
        continue
      }

      const userExists = existingUsers?.users?.some((u: any) => u.email === profile.email)

      if (userExists) {
        console.log('   ⏭️  Usuário já existe no auth.users')
        skipped++
        continue
      }

      // Criar usuário em auth.users
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: profile.email,
        email_confirm: false, // Usuário precisará confirmar email
        user_metadata: {
          full_name: profile.full_name,
          phone: profile.phone,
          department: profile.department,
          migrated_from: 'zoho_mail360',
          migration_date: new Date().toISOString(),
        },
      })

      if (createError) {
        console.error('   ❌ Erro ao criar usuário:', createError.message)
        errors++
        continue
      }

      // Atualizar user_profiles com auth_user_id
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ auth_user_id: newUser.user?.id })
        .eq('id', profile.id)

      if (updateError) {
        console.error('   ⚠️  Usuário criado mas erro ao atualizar profile:', updateError.message)
      }

      console.log('   ✅ Usuário migrado com sucesso')
      migrated++

    } catch (error) {
      console.error('   ❌ Erro inesperado:', error)
      errors++
    }
  }

  // Relatório final
  console.log('\n' + '='.repeat(50))
  console.log('📊 RELATÓRIO FINAL')
  console.log('='.repeat(50))
  console.log(`✅ Migrados: ${migrated}`)
  console.log(`⏭️  Já existentes: ${skipped}`)
  console.log(`❌ Erros: ${errors}`)
  console.log(`📧 Total processado: ${profiles.length}`)
  console.log('='.repeat(50))

  if (!dryRun && migrated > 0) {
    console.log('\n📬 Próximo passo: Enviar emails de definição de senha')
    console.log('   Execute: npx tsx scripts/send-password-reset-emails.ts')
  }
}

async function sendPasswordResetEmails() {
  console.log('📧 Enviando emails de redefinição de senha...\n')

  const { data: profiles, error } = await supabase
    .from('user_profiles')
    .select('email')
    .not('auth_user_id', 'is', null)

  if (error) {
    console.error('❌ Erro ao buscar perfis:', error)
    process.exit(1)
  }

  if (!profiles || profiles.length === 0) {
    console.log('⚠️  Nenhum perfil encontrado')
    return
  }

  let sent = 0
  let failed = 0

  for (const profile of profiles as { email: string }[]) {
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(profile.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`,
      })

      if (resetError) {
        console.error(`❌ ${profile.email}: ${resetError.message}`)
        failed++
      } else {
        console.log(`✅ ${profile.email}`)
        sent++
      }
    } catch (error) {
      console.error(`❌ ${profile.email}: Erro inesperado`)
      failed++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 EMAILS ENVIADOS')
  console.log('='.repeat(50))
  console.log(`✅ Enviados: ${sent}`)
  console.log(`❌ Falhas: ${failed}`)
  console.log('='.repeat(50))
}

// Main execution
async function main() {
  console.log('🚀 Script de Migração Zoho → Supabase Auth\n')

  const args = process.argv.slice(2)
  const isDryRun = !args.includes('--execute')
  const sendEmails = args.includes('--send-emails')

  if (sendEmails) {
    const confirm = await askConfirmation('Enviar emails de redefinição de senha para todos os usuários?')
    if (confirm) {
      await sendPasswordResetEmails()
    } else {
      console.log('❌ Operação cancelada')
    }
    return
  }

  if (isDryRun) {
    console.log('🔸 MODO DRY RUN (simulação)')
    console.log('   Para executar de verdade: npx tsx scripts/migrate-users-to-supabase-auth.ts --execute\n')
  } else {
    console.log('⚠️  MODO EXECUÇÃO REAL')
    const confirm = await askConfirmation('Tem certeza que deseja migrar os usuários?')
    if (!confirm) {
      console.log('❌ Operação cancelada')
      return
    }
    console.log('')
  }

  await migrateUsers(isDryRun)
}

main()
  .then(() => {
    console.log('\n✅ Script concluído')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error)
    process.exit(1)
  })
