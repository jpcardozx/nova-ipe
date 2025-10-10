/**
 * Script de teste para validar URLs de fotos do WordPress Catalog
 */

import { getBestPhotoUrl, getPhotoUrls } from '../lib/utils/wordpress-photo-urls'

console.log('🔍 Testando geração de URLs de fotos...\n')

// Teste 1: Propriedade sem R2 (deve gerar URL Lightsail)
console.log('📋 Teste 1: Propriedade sem R2')
console.log('wp_id: 100')
const url1 = getBestPhotoUrl(undefined, 100, 1)
console.log('URL gerada:', url1)
console.log('Esperado: http://13.223.237.99/wp-content/uploads/WPL/100/thimg_foto01_640x480.jpg')
console.log('Match:', url1 === 'http://13.223.237.99/wp-content/uploads/WPL/100/thimg_foto01_640x480.jpg' ? '✅' : '❌')
console.log('')

// Teste 2: Propriedade com URL R2
console.log('📋 Teste 2: Propriedade com R2')
const r2Url = 'https://pub-xxx.r2.cloudflarestorage.com/wordpress-photos/100/img_foto01.jpg'
const url2 = getBestPhotoUrl(r2Url, 100, 1)
console.log('URL gerada:', url2)
console.log('Esperado:', r2Url)
console.log('Match:', url2 === r2Url ? '✅' : '❌')
console.log('')

// Teste 3: Todas as URLs de uma foto
console.log('📋 Teste 3: Todas as variações de tamanho')
const allUrls = getPhotoUrls(123, 5)
console.log('wp_id: 123, foto: 05')
console.log('Original:', allUrls.original)
console.log('Thumbnail:', allUrls.thumbnail)
console.log('Small:', allUrls.small)
console.log('Tiny:', allUrls.tiny)
console.log('')

// Teste 4: Validar URLs via HTTP
console.log('📋 Teste 4: Validar acesso HTTP')
console.log('Testando:', url1)

fetch(url1)
  .then(res => {
    console.log('Status:', res.status)
    console.log('Content-Type:', res.headers.get('content-type'))
    console.log('Match:', res.status === 200 && res.headers.get('content-type')?.includes('image') ? '✅ Imagem acessível' : '❌ Erro')
  })
  .catch(err => {
    console.error('❌ Erro ao acessar imagem:', err.message)
  })
