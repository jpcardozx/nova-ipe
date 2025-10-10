/**
 * Debug: Verifica estado da tabela wordpress_properties
 */

const { config } = require('dotenv')
const { resolve } = require('path')
config({ path: resolve(process.cwd(), '.env.local') })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Verificando configuração Supabase...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? '✅ Presente' : '❌ Ausente')

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugWordPressData() {
  console.log('\n' + '='.repeat(70))
  console.log('🔍 DEBUG: WORDPRESS PROPERTIES TABLE')
  console.log('='.repeat(70) + '\n')

  // 1. Contar total
  console.log('1️⃣ Contando total de registros...')
  const { count: totalCount, error: countError } = await supabase
    .from('wordpress_properties')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    console.error('❌ ERRO ao contar:', countError.message)
    console.error('Detalhes:', countError)
    return
  }

  console.log(`   ✅ Total: ${totalCount} registros\n`)

  // 2. Contar por status
  console.log('2️⃣ Contando por status...')
  const { data: allData, error: allError } = await supabase
    .from('wordpress_properties')
    .select('status, photo_count, thumbnail_url')

  if (allError) {
    console.error('❌ ERRO ao buscar:', allError.message)
    return
  }

  const byStatus = {}
  let withPhotos = 0
  let withThumbnail = 0

  allData.forEach(item => {
    byStatus[item.status] = (byStatus[item.status] || 0) + 1
    if (item.photo_count > 0) withPhotos++
    if (item.thumbnail_url) withThumbnail++
  })

  console.log('   Status breakdown:')
  Object.entries(byStatus).forEach(([status, count]) => {
    console.log(`   - ${status}: ${count}`)
  })
  console.log(`   - Com fotos: ${withPhotos}`)
  console.log(`   - Com thumbnail: ${withThumbnail}\n`)

  // 3. Sample de 3 registros
  console.log('3️⃣ Sample de 3 registros...')
  const { data: sample, error: sampleError } = await supabase
    .from('wordpress_properties')
    .select('id, wp_id, status, photo_count, thumbnail_url, data')
    .limit(3)

  if (sampleError) {
    console.error('❌ ERRO:', sampleError.message)
  } else {
    sample.forEach((item, idx) => {
      console.log(`\n   📄 Registro ${idx + 1}:`)
      console.log(`      - ID: ${item.id}`)
      console.log(`      - WP_ID: ${item.wp_id}`)
      console.log(`      - Status: ${item.status}`)
      console.log(`      - Fotos: ${item.photo_count}`)
      console.log(`      - Thumbnail: ${item.thumbnail_url ? '✅' : '❌'}`)
      console.log(`      - Título: ${item.data?.field_313 || item.data?.field_312 || 'N/A'}`)
    })
  }

  // 4. Testar query que o dashboard usa
  console.log('\n\n4️⃣ Testando query do dashboard...')
  const { data: dashboardData, error: dashboardError, count: dashboardCount } = await supabase
    .from('wordpress_properties')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(0, 29) // Primeiras 30

  if (dashboardError) {
    console.error('❌ ERRO na query do dashboard:', dashboardError.message)
    console.error('Detalhes:', JSON.stringify(dashboardError, null, 2))
  } else {
    console.log(`   ✅ Query OK: retornou ${dashboardData.length} de ${dashboardCount} registros`)
  }

  // 5. Verificar RLS
  console.log('\n5️⃣ Verificando RLS (Row Level Security)...')
  const { data: rlsCheck, error: rlsError } = await supabase
    .from('wordpress_properties')
    .select('id')
    .limit(1)

  if (rlsError) {
    console.error('❌ RLS pode estar bloqueando:', rlsError.message)
    console.log('   💡 Solução: Desabilitar RLS temporariamente ou criar policy para anon')
  } else {
    console.log('   ✅ RLS OK (ou desabilitado)')
  }

  console.log('\n' + '='.repeat(70))
  console.log('✅ DEBUG COMPLETO')
  console.log('='.repeat(70) + '\n')

  // RESULTADO
  if (totalCount === 0) {
    console.log('⚠️  PROBLEMA: Tabela está VAZIA!')
    console.log('   Solução: Rodar o script de importação')
  } else if (!dashboardData || dashboardData.length === 0) {
    console.log('⚠️  PROBLEMA: Dados existem mas query do dashboard falha')
    console.log('   Possíveis causas:')
    console.log('   1. RLS bloqueando')
    console.log('   2. Problema com índices')
    console.log('   3. Estrutura da query')
  } else {
    console.log('✅ TUDO OK! Dashboard deveria estar funcionando')
    console.log(`   Total: ${totalCount} | Acessíveis: ${dashboardData.length}`)
  }
}

debugWordPressData().catch(console.error)
