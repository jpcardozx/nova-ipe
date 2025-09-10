import { supabase } from '../lib/supabase.ts'

async function checkCRMTables() {
    console.log('🔍 Verificando tabelas do CRM...')
    
    try {
        // Verificar se a tabela 'clients' existe
        const { data: clientsData, error: clientsError } = await supabase
            .from('clients')
            .select('count', { count: 'exact' })
            .limit(1)

        if (clientsError) {
            console.log('❌ Tabela "clients" não encontrada:', clientsError.message)
            console.log('   Talvez seja necessário criar a tabela')
        } else {
            console.log('✅ Tabela "clients" encontrada')
            console.log(`   Total de clientes: ${clientsData.length || 0}`)
        }

        // Verificar se a tabela 'profiles' existe
        const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('count', { count: 'exact' })
            .limit(1)

        if (profilesError) {
            console.log('❌ Tabela "profiles" não encontrada:', profilesError.message)
        } else {
            console.log('✅ Tabela "profiles" encontrada')
        }

        // Listar todas as tabelas disponíveis
        const { data: tablesData, error: tablesError } = await supabase
            .rpc('get_schema_tables', { schema_name: 'public' })

        if (tablesError) {
            console.log('⚠️  Não foi possível listar as tabelas:', tablesError.message)
        } else if (tablesData) {
            console.log('\n📋 Tabelas disponíveis no schema public:')
            tablesData.forEach(table => {
                console.log(`   - ${table.table_name}`)
            })
        }

        // Tentar operação simples de insert para verificar se as tabelas estão funcionais
        console.log('\n🧪 Testando operações básicas...')
        
        // Teste de leitura de user atual
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError) {
            console.log('❌ Erro ao obter usuário atual:', userError.message)
        } else {
            console.log('✅ Usuário autenticado:', userData?.user?.email || 'Não autenticado')
        }

    } catch (error) {
        console.error('❌ Erro geral:', error)
    }
}

// Executar verificação
checkCRMTables()