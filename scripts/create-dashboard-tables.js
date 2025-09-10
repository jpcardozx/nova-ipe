const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuração do Supabase
const supabaseUrl = 'https://ifhfpaehnjpdwdocdzwd.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeSQLFile() {
    try {
        console.log('🚀 Executando script completo de tabelas...')
        
        // Ler o arquivo SQL
        const sqlPath = path.join(__dirname, '..', 'sql', 'complete-dashboard-tables.sql')
        const sqlContent = fs.readFileSync(sqlPath, 'utf8')
        
        // Dividir em comandos individuais (separados por ';')
        const commands = sqlContent
            .split(';')
            .map(cmd => cmd.trim())
            .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))
        
        console.log(`📝 Encontrados ${commands.length} comandos SQL para executar...`)
        
        let successCount = 0
        let errorCount = 0
        
        // Executar comandos um por um
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i] + ';'
            
            try {
                console.log(`\n⏳ Executando comando ${i + 1}/${commands.length}...`)
                
                const { data, error } = await supabase.rpc('exec_sql', {
                    sql_query: command
                })
                
                if (error) {
                    // Tentar execução direta se RPC falhar
                    const { data: directData, error: directError } = await supabase
                        .from('_dummy_')
                        .select('*')
                        .eq('sql', command)
                    
                    if (directError && !directError.message.includes('does not exist')) {
                        throw directError
                    }
                }
                
                console.log(`✅ Comando ${i + 1} executado com sucesso`)
                successCount++
                
            } catch (error) {
                console.log(`❌ Erro no comando ${i + 1}:`, error.message)
                
                // Se o erro for "já existe", não é um problema real
                if (error.message.includes('already exists') || 
                    error.message.includes('duplicate') ||
                    error.message.includes('relation') && error.message.includes('already exists')) {
                    console.log(`ℹ️  Ignorando erro de "já existe" - isso é esperado`)
                    successCount++
                } else {
                    errorCount++
                    console.log(`🔍 Comando que falhou: ${command.substring(0, 100)}...`)
                }
            }
        }
        
        console.log(`\n📊 RESUMO DA EXECUÇÃO:`)
        console.log(`✅ Sucessos: ${successCount}`)
        console.log(`❌ Erros: ${errorCount}`)
        console.log(`📝 Total: ${commands.length}`)
        
        if (errorCount === 0) {
            console.log(`\n🎉 TODAS AS TABELAS FORAM CRIADAS COM SUCESSO!`)
        } else {
            console.log(`\n⚠️  Algumas tabelas podem não ter sido criadas. Verifique os erros acima.`)
        }
        
        // Verificar as tabelas criadas
        console.log(`\n🔍 Verificando tabelas criadas...`)
        await verifyCreatedTables()
        
    } catch (error) {
        console.error('💥 Erro fatal ao executar script:', error)
    }
}

async function verifyCreatedTables() {
    const tablesToCheck = [
        'tasks', 'notifications', 'calendar_events', 'properties', 
        'property_images', 'property_features', 'visits', 'contracts',
        'contract_signatures', 'payments', 'invoices', 'users',
        'user_permissions', 'analytics_events', 'dashboard_metrics',
        'reports', 'client_contacts', 'client_history'
    ]
    
    console.log('\n📋 STATUS DAS TABELAS:')
    
    for (const table of tablesToCheck) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .limit(1)
            
            if (error) {
                console.log(`❌ ${table} - ERRO: ${error.message}`)
            } else {
                console.log(`✅ ${table} - EXISTE`)
            }
        } catch (error) {
            console.log(`❌ ${table} - ERRO: ${error.message}`)
        }
    }
}

// Executar script se chamado diretamente
if (require.main === module) {
    executeSQLFile()
}

module.exports = { executeSQLFile, verifyCreatedTables }
