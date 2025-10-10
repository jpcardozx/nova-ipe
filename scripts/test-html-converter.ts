/**
 * Testa o conversor HTML → Portable Text
 * 
 * Pega 5 properties do Supabase e testa conversão do field_308
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { convertHtmlToPortableText } from '../lib/utils/html-to-portable-text'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function testConverter() {
  console.log('🧪 Testando HTML → Portable Text Converter\n')

  // Busca 5 properties com field_308 preenchido
  const { data, error } = await supabase
    .from('wordpress_properties')
    .select('id, wp_id, data')
    .not('data->field_308', 'is', null)
    .neq('data->field_308', '0')
    .limit(5)

  if (error) {
    console.error('❌ Erro ao buscar properties:', error)
    return
  }

  if (!data || data.length === 0) {
    console.log('⚠️  Nenhuma property encontrada')
    return
  }

  console.log(`✅ ${data.length} properties encontradas\n`)

  for (const property of data) {
    const htmlDescription = property.data.field_308
    const wpId = property.data.ID || property.wp_id

    console.log(`\n${'='.repeat(80)}`)
    console.log(`📄 Property WP ID: ${wpId}`)
    console.log(`${'='.repeat(80)}`)

    console.log('\n📝 HTML Original:')
    console.log(htmlDescription.substring(0, 300) + (htmlDescription.length > 300 ? '...' : ''))

    try {
      const portableText = convertHtmlToPortableText(htmlDescription)
      
      console.log('\n✅ Portable Text Convertido:')
      console.log(JSON.stringify(portableText, null, 2).substring(0, 500) + '...')
      
      // Estatísticas
      console.log('\n📊 Estatísticas:')
      console.log(`   - HTML Length: ${htmlDescription.length} chars`)
      console.log(`   - Blocks: ${portableText.length}`)
      console.log(`   - Primeiro block: ${portableText[0]?.children?.[0]?.text?.substring(0, 100) || 'N/A'}...`)
      
    } catch (error) {
      console.error('\n❌ Erro na conversão:', error)
    }
  }

  console.log('\n\n✅ Teste finalizado!')
}

testConverter()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Erro fatal:', error)
    process.exit(1)
  })
