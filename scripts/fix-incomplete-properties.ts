#!/usr/bin/env tsx
/**
 * Completa properties incompletas com photo_urls e thumbnail_url
 * Extrai URLs das fotos do campo gallery_image_ids
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const LIGHTSAIL_BASE_URL = 'https://wpl-imoveis.com.wp2.com.br/wp-content/uploads/wplpro'

async function fixIncompleteProperties() {
  console.log('🔧 COMPLETANDO PROPERTIES INCOMPLETAS')
  console.log('═'.repeat(60))
  console.log()

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  // 1. Buscar properties sem photo_urls ou thumbnail_url
  console.log('📊 Buscando properties incompletas...')
  const { data: properties, error } = await supabase
    .from('wordpress_properties')
    .select('id, wp_id, data, photo_count, photo_urls, thumbnail_url')
    .or('photo_urls.is.null,thumbnail_url.is.null')

  if (error) {
    console.error('❌ Erro:', error)
    process.exit(1)
  }

  console.log(`   ✓ ${properties.length} properties encontradas`)
  console.log()

  // 2. Processar cada property
  let updated = 0
  let skipped = 0

  console.log('🔄 Processando...')
  console.log('─'.repeat(60))

  for (const prop of properties) {
    const data = prop.data as any

    // Extrair photo_urls do gallery_image_ids
    let photoUrls: string[] = []
    let thumbnailUrl: string | null = null

    try {
      // gallery_image_ids pode ser string JSON ou array
      let imageIds: string[] = []

      if (data.gallery_image_ids) {
        if (typeof data.gallery_image_ids === 'string') {
          try {
            imageIds = JSON.parse(data.gallery_image_ids)
          } catch {
            // Pode ser uma string separada por vírgula
            imageIds = data.gallery_image_ids.split(',').filter(Boolean)
          }
        } else if (Array.isArray(data.gallery_image_ids)) {
          imageIds = data.gallery_image_ids
        }
      }

      // Construir URLs
      if (imageIds.length > 0) {
        photoUrls = imageIds.map((id: string) => {
          const cleanId = id.trim()
          // URLs seguem padrão: /wplpro/properties/{property_id}/{image_id}.jpg
          return `${LIGHTSAIL_BASE_URL}/properties/${prop.wp_id}/${cleanId}.jpg`
        })

        thumbnailUrl = photoUrls[0] || null
      }

      // Se ainda não tem thumbnail, tentar post_image_url
      if (!thumbnailUrl && data.post_image_url) {
        thumbnailUrl = data.post_image_url
      }

      // Atualizar no Supabase
      if (photoUrls.length > 0 || thumbnailUrl) {
        const { error: updateError } = await supabase
          .from('wordpress_properties')
          .update({
            photo_urls: photoUrls.length > 0 ? photoUrls : prop.photo_urls,
            thumbnail_url: thumbnailUrl || prop.thumbnail_url,
            photo_count: photoUrls.length > 0 ? photoUrls.length : prop.photo_count,
          })
          .eq('id', prop.id)

        if (updateError) {
          console.log(`   ❌ wp_id ${prop.wp_id}: ${updateError.message}`)
        } else {
          updated++
          process.stdout.write('.')
        }
      } else {
        skipped++
        process.stdout.write('S')
      }
    } catch (error: any) {
      console.log(`   ❌ wp_id ${prop.wp_id}: ${error.message}`)
      skipped++
    }
  }

  console.log('\n')
  console.log('─'.repeat(60))
  console.log('✅ Completado!')
  console.log()
  console.log(`📊 Resultados:`)
  console.log(`   ✓ Atualizadas: ${updated}`)
  console.log(`   ⊗ Ignoradas:   ${skipped}`)
  console.log()
}

fixIncompleteProperties().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
