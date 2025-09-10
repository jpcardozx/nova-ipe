// Test script para verificar se o Supabase está funcionando
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Carregar variáveis de ambiente
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testando conexão com Supabase...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? 'Configurada' : 'Não configurada')

if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Variáveis de ambiente não configuradas')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    try {
        console.log('📡 Testando conexão básica...')
        
        // Test 1: Simple connection test
        console.log('🔍 Tentando tabela "clients"...')
        const { data: clientsData, error: clientsError } = await supabase.from('clients').select('*').limit(1)
        
        if (clientsError) {
            console.log('⚠️  Tabela "clients" não encontrada:', clientsError.message)
            
            // Try alternative table name
            console.log('🔍 Tentando tabela "crm_clients"...')
            const { data: crmData, error: crmError } = await supabase.from('crm_clients').select('*').limit(1)
            
            if (crmError) {
                console.log('❌ Nenhuma tabela CRM encontrada:', crmError.message)
                console.log('📝 Execute o script em sql/setup-crm-tables.sql no Supabase Dashboard')
                return false
            } else {
                console.log('✅ Encontrada tabela "crm_clients"!')
                console.log('📊 Dados encontrados:', crmData?.length || 0, 'registros')
                console.log('💡 Sugestão: Ajustar CRM service para usar "crm_clients"')
                return true
            }
        }
        
        console.log('✅ Conexão com Supabase funcionando!')
        console.log('📊 Dados encontrados:', clientsData?.length || 0, 'registros')
        return true
        
    } catch (error) {
        console.log('❌ Erro de conexão:', error)
        return false
    }
}

testConnection().then(success => {
    if (success) {
        console.log('🎉 Supabase está configurado e funcionando!')
    } else {
        console.log('🔧 Execute o setup das tabelas: sql/setup-crm-tables.sql')
    }
})
