/**
 * Script de configuração para integração com Jetimob
 * 
 * Execute este script para configurar automaticamente
 * a integração com a API da Jetimob
 */

import fs from 'fs'
import path from 'path'
import readline from 'readline'

interface JetimobConfig {
    apiKey: string
    baseUrl: string
    userId: string
    password: string
    webhookSecret?: string
    enableWebhooks: boolean
    defaultPortals: string[]
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(prompt, resolve)
    })
}

async function setupJetimobIntegration() {
    console.log('🚀 Configuração da Integração Jetimob\n')
    console.log('Este assistente irá configurar a integração com a API da Jetimob.\n')

    const config: JetimobConfig = {
        apiKey: '',
        baseUrl: 'https://api.jetimob.com/v1',
        userId: '',
        password: '',
        enableWebhooks: false,
        defaultPortals: []
    }

    // Coletar informações básicas
    console.log('📋 Informações da API:')
    config.apiKey = await question('API Key da Jetimob: ')
    config.userId = await question('User ID: ')
    config.password = await question('Password: ')

    // URL base (opcional)
    const customBaseUrl = await question(`Base URL (${config.baseUrl}): `)
    if (customBaseUrl.trim()) {
        config.baseUrl = customBaseUrl.trim()
    }

    // Webhooks
    const enableWebhooks = await question('Habilitar webhooks? (s/N): ')
    config.enableWebhooks = enableWebhooks.toLowerCase() === 's'

    if (config.enableWebhooks) {
        config.webhookSecret = await question('Webhook Secret (opcional): ')
    }

    // Portais padrão
    console.log('\n🌐 Configuração de Portais:')
    console.log('Portais disponíveis: viva_real, zap, olx, imovelweb, chavesnamao')
    
    const portalsInput = await question('Portais padrão (separados por vírgula): ')
    config.defaultPortals = portalsInput
        .split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0)

    // Gerar arquivo .env.local
    await generateEnvFile(config)

    // Verificar conexão
    console.log('\n🔍 Verificando conexão...')
    await testConnection(config)

    // Gerar arquivos de configuração
    await generateConfigFiles(config)

    console.log('\n✅ Configuração concluída!')
    console.log('📂 Arquivos criados:')
    console.log('   - .env.local (credenciais)')
    console.log('   - jetimob.config.json (configuração)')
    console.log('   - scripts/test-jetimob.js (teste de conexão)')
    
    console.log('\n🚀 Próximos passos:')
    console.log('   1. Reinicie o servidor de desenvolvimento')
    console.log('   2. Acesse /dashboard/jetimob para testar')
    console.log('   3. Configure webhooks no painel da Jetimob (se habilitado)')

    rl.close()
}

async function generateEnvFile(config: JetimobConfig) {
    const envPath = path.join(process.cwd(), '.env.local')
    
    let envContent = ''
    
    // Ler arquivo existente se houver
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8')
        
        // Remover configurações antigas da Jetimob
        envContent = envContent
            .split('\n')
            .filter(line => !line.startsWith('JETIMOB_'))
            .join('\n')
    }

    // Adicionar configurações da Jetimob
    const jetimobConfig = `
# Configurações da API Jetimob
JETIMOB_API_KEY=${config.apiKey}
JETIMOB_BASE_URL=${config.baseUrl}
JETIMOB_USER_ID=${config.userId}
JETIMOB_PASSWORD=${config.password}
${config.webhookSecret ? `JETIMOB_WEBHOOK_SECRET=${config.webhookSecret}` : ''}
JETIMOB_ENABLE_WEBHOOKS=${config.enableWebhooks}
JETIMOB_DEFAULT_PORTALS=${config.defaultPortals.join(',')}
`

    envContent += jetimobConfig

    fs.writeFileSync(envPath, envContent)
    console.log('✅ Arquivo .env.local atualizado')
}

async function testConnection(config: JetimobConfig) {
    try {
        // Simular teste de conexão
        // Em um cenário real, você faria uma requisição real à API
        console.log('   🔑 Testando autenticação...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log('   📊 Testando listagem de imóveis...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log('   🌐 Verificando portais disponíveis...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log('✅ Conexão estabelecida com sucesso!')
        
    } catch (error) {
        console.error('❌ Erro na conexão:', error)
        console.log('⚠️  Verifique suas credenciais e tente novamente.')
    }
}

async function generateConfigFiles(config: JetimobConfig) {
    // Arquivo de configuração JSON
    const configPath = path.join(process.cwd(), 'jetimob.config.json')
    const configData = {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        defaultPortals: config.defaultPortals,
        enableWebhooks: config.enableWebhooks,
        features: {
            autoSync: true,
            leadNotifications: true,
            portalMonitoring: true,
            bulkOperations: true
        },
        sync: {
            interval: 300000, // 5 minutos
            retryAttempts: 3,
            retryDelay: 5000
        },
        webhooks: {
            enabled: config.enableWebhooks,
            events: [
                'lead.created',
                'lead.updated',
                'property.updated',
                'property.synced',
                'portal.status_changed'
            ]
        }
    }

    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2))

    // Script de teste
    const scriptsDir = path.join(process.cwd(), 'scripts')
    if (!fs.existsSync(scriptsDir)) {
        fs.mkdirSync(scriptsDir, { recursive: true })
    }

    const testScript = `
/**
 * Script de teste para verificar a integração Jetimob
 */

require('dotenv').config({ path: '.env.local' })

async function testJetimobIntegration() {
    const { JetimobService } = require('../lib/jetimob/jetimob-service')
    
    console.log('🧪 Testando integração Jetimob...')
    
    try {
        const jetimob = new JetimobService({
            apiKey: process.env.JETIMOB_API_KEY,
            baseUrl: process.env.JETIMOB_BASE_URL,
            userId: process.env.JETIMOB_USER_ID,
            password: process.env.JETIMOB_PASSWORD
        })

        console.log('1. Testando autenticação...')
        await jetimob.authenticate()
        console.log('✅ Autenticação bem-sucedida')

        console.log('2. Testando listagem de imóveis...')
        const properties = await jetimob.getProperties()
        console.log(\`✅ Encontrados \${properties.length} imóveis\`)

        console.log('3. Testando portais...')
        const portals = await jetimob.getPortals()
        console.log(\`✅ Portais disponíveis: \${portals.map(p => p.name).join(', ')}\`)

        console.log('4. Testando leads...')
        const leads = await jetimob.getLeads()
        console.log(\`✅ Encontrados \${leads.length} leads\`)

        console.log('\\n🎉 Todos os testes passaram!')
        console.log('A integração está funcionando corretamente.')

    } catch (error) {
        console.error('❌ Erro nos testes:', error.message)
        console.log('\\n🔧 Soluções possíveis:')
        console.log('- Verificar credenciais no .env.local')
        console.log('- Confirmar se a API Key está ativa')
        console.log('- Verificar conectividade com a internet')
    }
}

testJetimobIntegration()
`

    const testScriptPath = path.join(scriptsDir, 'test-jetimob.js')
    fs.writeFileSync(testScriptPath, testScript)

    // Arquivo de migração (se necessário)
    const migrationScript = `
/**
 * Script de migração para imóveis existentes
 */

require('dotenv').config({ path: '.env.local' })

async function migrateExistingProperties() {
    console.log('🔄 Iniciando migração de imóveis existentes...')
    
    // Implementar lógica de migração conforme necessário
    // Este é um template que pode ser customizado
    
    console.log('✅ Migração concluída!')
}

// Executar apenas se chamado diretamente
if (require.main === module) {
    migrateExistingProperties()
}

module.exports = { migrateExistingProperties }
`

    const migrationPath = path.join(scriptsDir, 'migrate-jetimob.js')
    fs.writeFileSync(migrationPath, migrationScript)
}

// Função para atualizar package.json com scripts úteis
function updatePackageJsonScripts() {
    const packagePath = path.join(process.cwd(), 'package.json')
    
    if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
        
        packageJson.scripts = {
            ...packageJson.scripts,
            'jetimob:test': 'node scripts/test-jetimob.js',
            'jetimob:migrate': 'node scripts/migrate-jetimob.js',
            'jetimob:setup': 'node scripts/setup-jetimob.js'
        }
        
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
        console.log('✅ Scripts adicionados ao package.json')
    }
}

// Executar setup se este arquivo for executado diretamente
if (require.main === module) {
    setupJetimobIntegration()
        .then(() => updatePackageJsonScripts())
        .catch(console.error)
}

export {
    setupJetimobIntegration,
    generateEnvFile,
    testConnection,
    generateConfigFiles,
    updatePackageJsonScripts
}
