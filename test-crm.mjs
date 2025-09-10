import { createClient } from '@supabase/supabase-js'

// Carregar variáveis de ambiente
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔧 Configuração Supabase:')
console.log(`URL: ${supabaseUrl ? '✅ Configurada' : '❌ Não configurada'}`)
console.log(`Key: ${supabaseKey ? '✅ Configurada' : '❌ Não configurada'}`)

if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Variáveis de ambiente não configuradas!')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCRMTables() {
    console.log('\n🔍 Testando conexão com Supabase...')
    
    try {
        // Test 1: Verificar se podemos fazer uma query simples
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
            console.log('❌ Erro de autenticação:', error.message)
        } else {
            console.log('✅ Conexão com Supabase estabelecida')
        }

        // Test 2: Tentar acessar a tabela clients
        console.log('\n🔍 Verificando tabela "clients"...')
        const { data: clientsTest, error: clientsError } = await supabase
            .from('clients')
            .select('*')
            .limit(1)

        if (clientsError) {
            console.log('❌ Erro ao acessar tabela "clients":', clientsError.message)
            console.log('   Código:', clientsError.code)
            console.log('   Detalhes:', clientsError.details)
            console.log('   Dica:', clientsError.hint)
        } else {
            console.log('✅ Tabela "clients" acessível')
            console.log(`   Dados: ${JSON.stringify(clientsTest, null, 2)}`)
        }

        // Test 3: Verificar tabela profiles
        console.log('\n🔍 Verificando tabela "profiles"...')
        const { data: profilesTest, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .limit(1)

        if (profilesError) {
            console.log('❌ Erro ao acessar tabela "profiles":', profilesError.message)
        } else {
            console.log('✅ Tabela "profiles" acessível')
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message)
    }
}

testCRMTables()