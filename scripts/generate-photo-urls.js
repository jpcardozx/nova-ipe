/**
 * Gera URLs das fotos baseado no pic_numb do WordPress
 * 
 * Padrão WordPress WPL:
 * https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/{ID}/{numero}.jpg
 */

const { config } = require('dotenv')
const { resolve } = require('path')
config({ path: resolve(process.cwd(), '.env.local') })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const WORDPRESS_BASE_URL = 'https://wpl-imoveis.com/wp-content/uploads/wplpro/properties'

async function generatePhotoUrls() {
  console.log('🔄 Gerando URLs de fotos para properties...\n')

  // Busca todas as properties
  const { data: properties, error } = await supabase
    .from('wordpress_properties')
    .select('id, wp_id, data')

  if (error) {
    console.error('❌ Erro ao buscar properties:', error)
    return
  }

  console.log(`📊 ${properties.length} properties encontradas\n`)

  let updated = 0
  let skipped = 0
  let errors = 0

  for (const property of properties) {
    const wpId = property.data.ID || property.wp_id
    const picNumb = parseInt(property.data.pic_numb || '0')

    if (picNumb === 0) {
      skipped++
      continue
    }

    try {
      // Gera URLs baseado no pic_numb
      const photoUrls = Array.from({ length: picNumb }, (_, i) => 
        `${WORDPRESS_BASE_URL}/${wpId}/${i + 1}.jpg`
      )

      // Thumbnail é a primeira foto (capa)
      const thumbnailUrl = photoUrls[0]

      // Atualiza no Supabase
      const { error: updateError } = await supabase
        .from('wordpress_properties')
        .update({
          photo_count: picNumb,
          photo_urls: photoUrls,
          thumbnail_url: thumbnailUrl
        })
        .eq('id', property.id)

      if (updateError) {
        console.error(`❌ Property ${wpId}: ${updateError.message}`)
        errors++
      } else {
        updated++
        if (updated % 50 === 0) {
          console.log(`✅ ${updated} properties atualizadas...`)
        }
      }
    } catch (error) {
      console.error(`❌ Property ${wpId}: ${error}`)
      errors++
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('📊 RESULTADO FINAL:')
  console.log(`   ✅ Atualizadas: ${updated}`)
  console.log(`   ⏭️  Sem fotos: ${skipped}`)
  console.log(`   ❌ Erros: ${errors}`)
  console.log('='.repeat(80))
}

generatePhotoUrls()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Erro fatal:', error)
    process.exit(1)
  })
