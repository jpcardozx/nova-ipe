import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'R2_ENDPOINT',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_URL'
]

const missing = requiredEnvVars.filter(v => !process.env[v])
if (missing.length > 0) {
  console.error('❌ Variáveis de ambiente faltando:', missing.join(', '))
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!

interface PropertyPhotos {
  wpId: string
  photos: string[]
}

async function updateR2Urls() {
  console.log('🔄 ATUALIZANDO URLs DO BANCO PARA R2')
  console.log('=' .repeat(60))
  
  try {
    // 1. Listar todas as fotos no R2
    console.log('\n📦 Listando fotos no R2...')
    const r2Photos = new Map<string, string[]>()
    
    let continuationToken: string | undefined
    let pageCount = 0
    
    do {
      pageCount++
      process.stdout.write(`\r   Página ${pageCount}... `)
      
      const command = new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME!,
        MaxKeys: 1000,
        ContinuationToken: continuationToken,
        Prefix: 'wordpress-photos/'
      })
      
      const response = await s3Client.send(command)
      
      if (response.Contents) {
        for (const obj of response.Contents) {
          if (!obj.Key) continue
          
          // Extrair wp_id do path (wordpress-photos/{wp_id}/img_foto*.jpg)
          const match = obj.Key.match(/wordpress-photos\/(\d+)\/(.+)/)
          if (match) {
            const wpId = match[1]
            const filename = match[2]
            
            if (!r2Photos.has(wpId)) {
              r2Photos.set(wpId, [])
            }
            
            // URL pública do R2
            const publicUrl = `${R2_PUBLIC_URL}/wordpress-photos/${wpId}/${filename}`
            r2Photos.get(wpId)!.push(publicUrl)
          }
        }
      }
      
      continuationToken = response.NextContinuationToken
    } while (continuationToken)
    
    console.log(`\n✅ Encontradas ${r2Photos.size} propriedades com fotos no R2`)
    
    // 2. Buscar propriedades do banco que precisam atualização
    console.log('\n🔍 Buscando propriedades no banco...')
    const { data: properties, error: fetchError } = await supabase
      .from('wordpress_properties')
      .select('wp_id, photo_urls, thumbnail_url')
      .in('wp_id', Array.from(r2Photos.keys()).map(id => parseInt(id)))
    
    if (fetchError) {
      console.error('❌ Erro ao buscar propriedades:', fetchError.message)
      return
    }
    
    console.log(`✅ Encontradas ${properties.length} propriedades no banco`)
    
    // 3. Atualizar URLs
    console.log('\n📝 Atualizando URLs...')
    let updated = 0
    let skipped = 0
    let errors = 0
    
    for (const prop of properties) {
      const wpId = prop.wp_id.toString()
      const r2PhotoUrls = r2Photos.get(wpId)
      
      if (!r2PhotoUrls || r2PhotoUrls.length === 0) {
        skipped++
        continue
      }
      
      // Verificar se já está com URLs do R2
      const currentUrls = Array.isArray(prop.photo_urls) ? prop.photo_urls : []
      const alreadyHasR2 = currentUrls.some((url: string) => 
        url.includes('r2.cloudflarestorage.com')
      )
      
      if (alreadyHasR2) {
        process.stdout.write(`\r   ⏭️  wp_id ${wpId}: Já tem URLs do R2, pulando...`)
        skipped++
        continue
      }
      
      // Ordenar URLs (img_foto01.jpg, img_foto02.jpg, ...)
      const sortedUrls = r2PhotoUrls.sort((a, b) => {
        const numA = parseInt(a.match(/img_foto(\d+)/)?.[1] || '0')
        const numB = parseInt(b.match(/img_foto(\d+)/)?.[1] || '0')
        return numA - numB
      })
      
      // Primeira foto como thumbnail
      const thumbnailUrl = sortedUrls[0]
      
      // Atualizar no banco
      const { error: updateError } = await supabase
        .from('wordpress_properties')
        .update({
          photo_urls: sortedUrls,
          thumbnail_url: thumbnailUrl
        })
        .eq('wp_id', prop.wp_id)
      
      if (updateError) {
        console.error(`\n   ❌ Erro ao atualizar wp_id ${wpId}:`, updateError.message)
        errors++
      } else {
        process.stdout.write(`\r   ✅ wp_id ${wpId}: ${sortedUrls.length} URLs atualizadas`)
        updated++
      }
      
      // Pequeno delay para não sobrecarregar o banco
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log('\n\n📊 RESULTADO DA ATUALIZAÇÃO')
    console.log('=' .repeat(60))
    console.log(`✅ Atualizadas: ${updated}`)
    console.log(`⏭️  Puladas: ${skipped}`)
    console.log(`❌ Erros: ${errors}`)
    
    if (updated > 0) {
      console.log('\n🎉 URLs atualizadas com sucesso!')
      console.log('   As fotos agora apontam para o R2 e devem aparecer no dashboard.')
    }
    
  } catch (error: any) {
    console.error('\n❌ ERRO:', error.message)
    if (error.$metadata) {
      console.error('Detalhes:', JSON.stringify(error.$metadata, null, 2))
    }
    process.exit(1)
  }
}

updateR2Urls()
