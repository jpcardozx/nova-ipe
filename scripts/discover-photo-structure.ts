#!/usr/bin/env tsx
/**
 * Script de descoberta de estrutura de URLs das fotos
 * Testa várias possibilidades para encontrar onde as fotos estão hospedadas
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Possíveis padrões de URL
const URL_PATTERNS = [
  // Padrão WPL comum
  (wpId: number, imageNum: number) =>
    `https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/${wpId}/${imageNum}.jpg`,
  (wpId: number, imageNum: number) =>
    `https://wpl-imoveis.com.wp2.com.br/wp-content/uploads/wplpro/properties/${wpId}/${imageNum}.jpg`,
  
  // Com prefixo image_
  (wpId: number, imageNum: number) =>
    `https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/${wpId}/image_${imageNum}.jpg`,
  (wpId: number, imageNum: number) =>
    `https://wpl-imoveis.com.wp2.com.br/wp-content/uploads/wplpro/properties/${wpId}/image_${imageNum}.jpg`,
  
  // Com prefixo IMG_
  (wpId: number, imageNum: number) =>
    `https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/${wpId}/IMG_${imageNum}.jpg`,
  (wpId: number, imageNum: number) =>
    `https://wpl-imoveis.com.wp2.com.br/wp-content/uploads/wplpro/properties/${wpId}/IMG_${imageNum}.jpg`,
  
  // Diretório uploads direto
  (wpId: number, imageNum: number) =>
    `https://wpl-imoveis.com/wp-content/uploads/${wpId}/${imageNum}.jpg`,
  (wpId: number, imageNum: number) =>
    `https://wpl-imoveis.com.wp2.com.br/wp-content/uploads/${wpId}/${imageNum}.jpg`,
  
  // Com hash/timestamp (precisaria descobrir)
  (wpId: number, imageNum: number) =>
    `https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/${wpId}/${wpId}_${imageNum}.jpg`,
]

async function testUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
    return response.ok
  } catch {
    return false
  }
}

async function discoverPhotoStructure(sampleSize = 5) {
  console.log('🔍 DESCOBERTA DE ESTRUTURA DE URLs DAS FOTOS')
  console.log('═'.repeat(70))
  console.log()

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  // 1. Buscar properties com fotos
  console.log(`📊 Buscando ${sampleSize} properties com fotos...`)
  const { data: properties } = await supabase
    .from('wordpress_properties')
    .select('wp_id, data')
    .filter('data->>pic_numb', 'gt', '0')
    .limit(sampleSize)

  if (!properties || properties.length === 0) {
    console.error('❌ Nenhuma property com fotos encontrada')
    return
  }

  console.log(`   ✓ ${properties.length} properties encontradas`)
  console.log()

  // 2. Testar padrões para cada property
  console.log('🔍 Testando padrões de URL...')
  console.log('─'.repeat(70))

  const results: Array<{
    wpId: number
    picNumb: number
    workingPattern: string | null
    sampleUrl: string | null
  }> = []

  for (const property of properties) {
    const wpId = property.wp_id
    const picNumb = property.data.pic_numb || 0

    console.log(`\n📋 Property ${wpId} (${picNumb} fotos)`)

    let workingPattern: string | null = null
    let sampleUrl: string | null = null

    // Testar primeiro cada padrão
    for (let i = 0; i < URL_PATTERNS.length && !workingPattern; i++) {
      const pattern = URL_PATTERNS[i]
      
      // Testar imagem 1, 0, 01
      for (const imageNum of [1, 0, '01']) {
        const url = pattern(wpId, imageNum as number)
        process.stdout.write('.')
        
        const exists = await testUrl(url)
        if (exists) {
          workingPattern = `Pattern ${i + 1}`
          sampleUrl = url
          console.log(`\n   ✅ ENCONTRADO: ${url}`)
          break
        }
      }
    }

    if (!workingPattern) {
      console.log('\n   ❌ Nenhum padrão funcionou')
    }

    results.push({
      wpId,
      picNumb,
      workingPattern,
      sampleUrl,
    })
  }

  console.log()
  console.log('═'.repeat(70))
  console.log('📊 RESULTADOS:')
  console.log('─'.repeat(70))
  console.log()

  // Análise dos resultados
  const successful = results.filter((r) => r.workingPattern !== null)
  const failed = results.filter((r) => r.workingPattern === null)

  console.log(`✅ Sucesso: ${successful.length}/${results.length}`)
  console.log(`❌ Falhou:  ${failed.length}/${results.length}`)
  console.log()

  if (successful.length > 0) {
    console.log('✅ PADRÕES ENCONTRADOS:')
    const patternCounts = successful.reduce((acc, r) => {
      const pattern = r.workingPattern!
      acc[pattern] = (acc[pattern] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(patternCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([pattern, count]) => {
        console.log(`   ${pattern}: ${count} properties`)
        const example = successful.find((r) => r.workingPattern === pattern)
        if (example?.sampleUrl) {
          console.log(`   └─ Exemplo: ${example.sampleUrl}`)
        }
      })
    console.log()

    // Recomendar padrão
    const mostCommonPattern = Object.entries(patternCounts).sort(
      (a, b) => b[1] - a[1]
    )[0][0]

    const patternIndex = parseInt(mostCommonPattern.replace('Pattern ', '')) - 1
    const patternFunc = URL_PATTERNS[patternIndex]

    console.log('🎯 PADRÃO RECOMENDADO:')
    console.log(`   ${mostCommonPattern}`)
    console.log(`   Usado por ${patternCounts[mostCommonPattern]} de ${successful.length} properties`)
    console.log()
    console.log('   Função JavaScript:')
    console.log(`   ${patternFunc.toString()}`)
    console.log()

    // Próximo passo
    console.log('═'.repeat(70))
    console.log('🚀 PRÓXIMO PASSO:')
    console.log('─'.repeat(70))
    console.log()
    console.log('Execute o script de migração em massa:')
    console.log('   npx tsx scripts/migrate-photos-to-r2.ts')
    console.log()
    console.log('Isso vai:')
    console.log('   1. Baixar todas as fotos do Lightsail')
    console.log('   2. Upload para R2 (batches de 30)')
    console.log('   3. Atualizar photo_urls no Supabase')
    console.log()
  } else {
    console.log('❌ NENHUM PADRÃO FUNCIONOU')
    console.log()
    console.log('Possíveis causas:')
    console.log('   1. URLs diferentes do esperado')
    console.log('   2. Servidor inacessível')
    console.log('   3. Fotos em outro lugar (ex: base64 no SQL)')
    console.log()
    console.log('Recomendações:')
    console.log('   1. Verificar servidor Lightsail manualmente')
    console.log('   2. Buscar gallery_image_ids no SQL')
    console.log('   3. Verificar tabela wp_posts ou wp_postmeta')
    console.log()
  }

  // Salvar resultados
  const reportPath = 'docs/PHOTO_URL_DISCOVERY_REPORT.json'
  const { writeFileSync } = await import('fs')
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        sampleSize,
        successful: successful.length,
        failed: failed.length,
        results,
        patterns: URL_PATTERNS.map((p, i) => ({
          id: i + 1,
          code: p.toString(),
        })),
      },
      null,
      2
    )
  )

  console.log(`💾 Relatório salvo em: ${reportPath}`)
  console.log()
}

// Parse args
const args = process.argv.slice(2)
const sampleSizeArg = args.find((a) => a.startsWith('--sample'))
const sampleSize = sampleSizeArg
  ? parseInt(sampleSizeArg.split('=')[1] || '5')
  : 5

discoverPhotoStructure(sampleSize).catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
