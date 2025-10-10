const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkPhotos() {
  const { data, error } = await supabase
    .from('wordpress_properties')
    .select('id, wp_id, status, thumbnail_url, photo_count, photo_urls')
    .limit(10)
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log('\n📸 VERIFICAÇÃO DE FOTOS (10 primeiras properties)\n')
  console.log('='.repeat(80))
  
  let withThumbs = 0
  let withPhotoUrls = 0
  
  data.forEach((p, i) => {
    console.log(`\n${i+1}. Property WP_ID: ${p.wp_id} | Status: ${p.status}`)
    console.log(`   Photo Count: ${p.photo_count}`)
    console.log(`   Thumbnail URL: ${p.thumbnail_url ? '✅ ' + p.thumbnail_url.substring(0, 60) + '...' : '❌ NULL'}`)
    console.log(`   Photo URLs: ${p.photo_urls ? `✅ ${p.photo_urls.length} URLs` : '❌ NULL'}`)
    
    if (p.thumbnail_url) withThumbs++
    if (p.photo_urls && p.photo_urls.length > 0) withPhotoUrls++
  })
  
  console.log('\n' + '='.repeat(80))
  console.log(`\n📊 RESUMO:`)
  console.log(`   Properties com thumbnail_url: ${withThumbs}/10`)
  console.log(`   Properties com photo_urls: ${withPhotoUrls}/10`)
}

checkPhotos().then(() => process.exit(0))
