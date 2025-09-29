const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ifhfpaehnjpdwdocdzwd.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
    try {
        console.log('🔍 Verificando tabelas existentes no Supabase...\n')
        
        // Query para listar todas as tabelas
        const { data: tables, error } = await supabase
            .from('information_schema.tables')
            .select('table_name, table_type')
            .eq('table_schema', 'public')
            .order('table_name')

        if (error) {
            console.error('❌ Erro ao buscar tabelas:', error)
            
            // Tentar uma abordagem alternativa - verificar tabelas conhecidas
            console.log('\n🔄 Tentando verificação alternativa...\n')
            
            const knownTables = [
                'crm_clients',
                'tasks', 
                'notifications',
                'calendar_events',
                'properties',
                'visits',
                'documents',
                'contracts',
                'payments',
                'leads',
                'users',
                'profiles'
            ]
            
            for (const tableName of knownTables) {
                try {
                    const { data, error: tableError } = await supabase
                        .from(tableName)
                        .select('*')
                        .limit(1)
                    
                    if (tableError) {
                        if (tableError.code === 'PGRST116' || tableError.message.includes('does not exist')) {
                            console.log(`❌ ${tableName} - NÃO EXISTE`)
                        } else {
                            console.log(`⚠️  ${tableName} - ERRO: ${tableError.message}`)
                        }
                    } else {
                        console.log(`✅ ${tableName} - EXISTE`)
                    }
                } catch (e) {
                    console.log(`❌ ${tableName} - NÃO EXISTE (${e.message})`)
                }
            }
            return
        }

        if (tables && tables.length > 0) {
            console.log('✅ Tabelas encontradas:')
            tables.forEach(table => {
                console.log(`  📋 ${table.table_name} (${table.table_type})`)
            })
            
            console.log(`\n📊 Total: ${tables.length} tabelas\n`)
            
            // Verificar estrutura das tabelas principais
            const mainTables = ['crm_clients', 'tasks', 'notifications', 'calendar_events']
            
            for (const tableName of mainTables) {
                const tableExists = tables.find(t => t.table_name === tableName)
                if (tableExists) {
                    console.log(`\n🔍 Verificando estrutura da tabela '${tableName}':`)
                    
                    try {
                        const { data: columns, error: colError } = await supabase
                            .from('information_schema.columns')
                            .select('column_name, data_type, is_nullable, column_default')
                            .eq('table_schema', 'public')
                            .eq('table_name', tableName)
                            .order('ordinal_position')
                        
                        if (colError) {
                            // Tentar obter uma linha de exemplo
                            const { data: sample } = await supabase
                                .from(tableName)
                                .select('*')
                                .limit(1)
                            
                            if (sample && sample.length > 0) {
                                console.log('  📝 Campos encontrados (baseado em dados):')
                                Object.keys(sample[0]).forEach(col => {
                                    console.log(`    - ${col}`)
                                })
                            }
                        } else if (columns) {
                            console.log('  📝 Estrutura:')
                            columns.forEach(col => {
                                console.log(`    - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(NULLABLE)'}`)
                            })
                        }
                    } catch (e) {
                        console.log(`  ⚠️  Não foi possível obter estrutura: ${e.message}`)
                    }
                }
            }
            
        } else {
            console.log('❌ Nenhuma tabela encontrada no schema public')
        }
        
    } catch (error) {
        console.error('❌ Erro geral:', error)
    }
}

// Verificar tabelas necessárias para o dashboard
function checkRequiredTables() {
    console.log('\n📋 TABELAS NECESSÁRIAS PARA DASHBOARD COMPLETO DE IMOBILIÁRIA:\n')
    
    const requiredTables = {
        '👥 CRM & Clientes': [
            'crm_clients - clientes e leads',
            'client_contacts - contatos dos clientes',
            'client_history - histórico de interações'
        ],
        '📋 Gestão de Tarefas': [
            'tasks - tarefas e demandas',
            'notifications - notificações e lembretes',
            'calendar_events - eventos do calendário'
        ],
        '🏠 Imóveis': [
            'properties - cadastro de imóveis',
            'property_images - fotos dos imóveis',
            'property_features - características dos imóveis',
            'property_visits - agendamento de visitas'
        ],
        '📄 Documentos & Contratos': [
            'documents - documentos digitais',
            'contracts - contratos e propostas',
            'contract_signatures - assinaturas digitais'
        ],
        '💰 Financeiro': [
            'payments - pagamentos e comissões',
            'invoices - faturas e recibos',
            'financial_reports - relatórios financeiros'
        ],
        '👤 Usuários & Permissões': [
            'users - usuários do sistema',
            'profiles - perfis e dados pessoais',
            'user_permissions - permissões e roles'
        ],
        '📊 Analytics & Reports': [
            'analytics_events - eventos para analytics',
            'dashboard_metrics - métricas do dashboard',
            'reports - relatórios personalizados'
        ]
    }
    
    Object.entries(requiredTables).forEach(([category, tables]) => {
        console.log(`${category}:`)
        tables.forEach(table => {
            console.log(`  • ${table}`)
        })
        console.log('')
    })
}

// Executar verificações
checkTables().then(() => {
    checkRequiredTables()
}).catch(console.error)
