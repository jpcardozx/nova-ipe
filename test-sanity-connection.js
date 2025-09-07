/**
 * Teste de conectividade com Sanity
 */

const { createClient } = require('next-sanity')
require('dotenv').config({ path: '.env.development' })

const sanityConfig = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
}

console.log('🔧 Configurações Sanity:')
console.log('- Project ID:', sanityConfig.projectId)
console.log('- Dataset:', sanityConfig.dataset)
console.log('- API Version:', sanityConfig.apiVersion)
console.log('- Token:', sanityConfig.token ? `${sanityConfig.token.substring(0, 20)}...` : 'AUSENTE')

const sanityClient = createClient(sanityConfig)

async function testSanityConnection() {
    try {
        console.log('\n🚀 Testando conexão com Sanity...')
        
        // Teste básico de conectividade
        const testQuery = `*[_type == "imovel"][0..2] {
            _id,
            titulo,
            preco,
            imagem {
                asset-> {
                    _id,
                    url
                }
            }
        }`
        
        const result = await sanityClient.fetch(testQuery)
        
        console.log('✅ Conexão com Sanity bem-sucedida!')
        console.log('📊 Dados retornados:', result.length, 'imóveis')
        console.log('🖼️ Primeira imagem:', result[0]?.imagem?.asset?.url || 'Não encontrada')
        
        return result
        
    } catch (error) {
        console.error('❌ Erro na conexão com Sanity:')
        console.error('- Mensagem:', error.message)
        console.error('- Código:', error.statusCode || error.code)
        throw error
    }
}

testSanityConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
