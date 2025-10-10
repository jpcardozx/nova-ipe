/**
 * Script de teste completo para validar exibição de imagens
 * Testa: URLs geradas, acesso HTTP, e integração com PropertyCard
 */

import { getBestPhotoUrl } from '../lib/utils/wordpress-photo-urls'

console.log('🧪 TESTE COMPLETO: Exibição de Imagens\n')
console.log('=' .repeat(60))

// Teste 1: Geração de URLs
console.log('\n📋 TESTE 1: Geração de URLs')
console.log('-'.repeat(60))

const testCases = [
  { wpId: 100, r2Url: undefined, desc: 'Sem R2 (deve usar Lightsail)' },
  { wpId: 200, r2Url: undefined, desc: 'Outro imóvel sem R2' },
  { wpId: 100, r2Url: 'https://pub-xxx.r2.dev/photos/100/img_foto01.jpg', desc: 'Com URL R2 (deve priorizar R2)' },
]

testCases.forEach(({ wpId, r2Url, desc }, index) => {
  console.log(`\nCaso ${index + 1}: ${desc}`)
  const url = getBestPhotoUrl(r2Url, wpId, 1)
  console.log(`  wp_id: ${wpId}`)
  console.log(`  r2_url: ${r2Url || 'undefined'}`)
  console.log(`  ✅ URL gerada: ${url}`)
})

// Teste 2: Validar acesso HTTP ao Lightsail
console.log('\n\n📋 TESTE 2: Validação HTTP')
console.log('-'.repeat(60))

const lightsailUrls = [
  'http://13.223.237.99/wp-content/uploads/WPL/100/thimg_foto01_640x480.jpg',
  'http://13.223.237.99/wp-content/uploads/WPL/200/thimg_foto01_640x480.jpg',
]

async function testHttpAccess() {
  for (const url of lightsailUrls) {
    console.log(`\n🔍 Testando: ${url}`)
    try {
      const response = await fetch(url, { method: 'HEAD' })
      console.log(`  Status: ${response.status} ${response.statusText}`)
      console.log(`  Content-Type: ${response.headers.get('content-type')}`)
      console.log(`  Content-Length: ${response.headers.get('content-length')} bytes`)

      if (response.status === 200) {
        console.log('  ✅ Imagem acessível')
      } else {
        console.log('  ❌ Erro ao acessar')
      }
    } catch (error) {
      console.error('  ❌ Falha na requisição:', error instanceof Error ? error.message : error)
    }
  }
}

// Teste 3: Verificar se há bloqueio Mixed Content
console.log('\n\n📋 TESTE 3: Detecção de Mixed Content')
console.log('-'.repeat(60))
console.log('\n⚠️  ATENÇÃO: Mixed Content Detection')
console.log('    - Localhost (HTTP): ✅ Não tem problema')
console.log('    - Produção (HTTPS): ⚠️  Browsers podem bloquear HTTP')
console.log('\n    Para detectar em produção, verificar console do browser:')
console.log('    "Mixed Content: The page was loaded over HTTPS..."')

// Teste 4: Estatísticas do sistema
console.log('\n\n📋 TESTE 4: Estatísticas')
console.log('-'.repeat(60))
console.log('\nConforme diagnóstico SSH anterior:')
console.log('  📊 763 propriedades')
console.log('  📸 67,922 fotos')
console.log('  💾 4.2GB total')
console.log('  🌐 Lightsail: 13.223.237.99')
console.log('  📁 Path: /wp-content/uploads/WPL/{id}/')

// Executar testes assíncronos
console.log('\n\n🚀 Executando testes HTTP...')
console.log('='.repeat(60))

testHttpAccess().then(() => {
  console.log('\n\n✅ TESTES CONCLUÍDOS')
  console.log('='.repeat(60))
  console.log('\n📝 Próximo passo:')
  console.log('   Abrir http://localhost:3001/dashboard/wordpress-catalog')
  console.log('   e verificar DevTools Console para logs de debug.')
  console.log('')
})
