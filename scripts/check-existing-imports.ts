#!/usr/bin/env tsx
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkExisting() {
  console.log('🔍 Verificando registros existentes no Supabase...\n')
  
  // Tenta contar
  const { count, error } = await supabase
    .from('wordpress_properties')
    .select('*', { count: 'exact', head: true })
  
  if (error) {
    console.log('❌ Erro ao contar:', error.message)
    console.log('\n💡 A tabela provavelmente não existe ainda.')
    return
  }
  
  console.log(`✅ Total registros na tabela: ${count}`)
  
  // Se tem registros, lista alguns
  if (count && count > 0) {
    const { data: props, error: listError } = await supabase
      .from('wordpress_properties')
      .select('wpl_id, status, photo_count, created_at')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (!listError && props && props.length > 0) {
      console.log('\n📋 Últimas 10 importações:\n')
      props.forEach((p: any, idx: number) => {
        const date = new Date(p.created_at).toLocaleString('pt-BR')
        console.log(`   ${idx + 1}. WP #${p.wpl_id} - Status: ${p.status} - ${p.photo_count} fotos - ${date}`)
      })
    }
  } else {
    console.log('\n💡 Tabela existe mas está vazia. Execute:')
    console.log('   npx tsx scripts/import-to-supabase-correct.ts')
  }
}

checkExisting()
