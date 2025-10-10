#!/usr/bin/env tsx
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkCount() {
  console.log('\n📊 Supabase Database Status\n')
  console.log('─'.repeat(50))
  
  try {
    // Primeiro tenta query simples
    const { data: testData, error: testError } = await supabase
      .from('wordpress_properties')
      .select('wpl_id')
      .limit(1)
    
    if (testError) {
      console.log('❌ Tabela wordpress_properties não acessível')
      console.log('   Error:', testError.message || JSON.stringify(testError))
      return
    }
    
    console.log('✅ Conexão OK - tabela acessível')
    
    // Agora conta
    const { count: propsCount, error: countError } = await supabase
      .from('wordpress_properties')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.log('❌ Erro ao contar:', countError.message)
      return
    }
    
    console.log(`📊 Total properties: ${propsCount}`)
    console.log('─'.repeat(50))
    
    // Se tem properties, mostrar alguns detalhes
    if (propsCount && propsCount > 0) {
      const { data, error } = await supabase
        .from('wordpress_properties')
        .select('wpl_id, mls_id, location2_name, location3_name, property_type, price')
        .order('wpl_id', { ascending: false })
        .limit(5)
      
      if (!error && data && data.length > 0) {
        console.log('\n🏠 Últimas 5 properties importadas:\n')
        data.forEach((p: any) => {
          console.log(`   #${p.wpl_id} - REF${p.mls_id} - ${p.property_type} em ${p.location3_name}/${p.location2_name} - R$ ${p.price?.toLocaleString('pt-BR')}`)
        })
      }
    }
    
    console.log('')
  } catch (err: any) {
    console.error('❌ Erro inesperado:', err.message || err)
  }
}

checkCount()
