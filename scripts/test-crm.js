#!/usr/bin/env node

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variáveis de ambiente do Supabase não encontradas')
    console.log('\nCertifique-se de ter no .env.local:')
    console.log('NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui')
    console.log('SUPABASE_SERVICE_ROLE_KEY=sua_service_key_aqui (opcional)\n')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCRMSetup() {
    console.log('🔍 Testando configuração do CRM...\n')

    const tests = [
        {
            name: 'Conexão com Supabase',
            test: async () => {
                const { data, error } = await supabase.from('crm_clients').select('count').limit(1)
                return { success: !error, error: error?.message }
            }
        },
        {
            name: 'Tabela de Clientes',
            test: async () => {
                const { data, error } = await supabase.from('crm_clients').select('*').limit(1)
                return { success: !error, error: error?.message, hasData: data && data.length > 0 }
            }
        },
        {
            name: 'Tabela de Imóveis',
            test: async () => {
                const { data, error } = await supabase.from('crm_properties').select('*').limit(1)
                return { success: !error, error: error?.message, hasData: data && data.length > 0 }
            }
        },
        {
            name: 'Tabela de Atividades',
            test: async () => {
                const { data, error } = await supabase.from('crm_activities').select('*').limit(1)
                return { success: !error, error: error?.message, hasData: data && data.length > 0 }
            }
        },
        {
            name: 'Tabela de Documentos',
            test: async () => {
                const { data, error } = await supabase.from('crm_documents').select('*').limit(1)
                return { success: !error, error: error?.message, hasData: data && data.length > 0 }
            }
        },
        {
            name: 'Tabela de Negócios',
            test: async () => {
                const { data, error } = await supabase.from('crm_deals').select('*').limit(1)
                return { success: !error, error: error?.message, hasData: data && data.length > 0 }
            }
        },
        {
            name: 'Storage - Bucket documents',
            test: async () => {
                const { data, error } = await supabase.storage.from('documents').list('', { limit: 1 })
                return { success: !error, error: error?.message }
            }
        },
        {
            name: 'Storage - Bucket property-images',
            test: async () => {
                const { data, error } = await supabase.storage.from('property-images').list('', { limit: 1 })
                return { success: !error, error: error?.message }
            }
        },
        {
            name: 'Storage - Bucket client-files',
            test: async () => {
                const { data, error } = await supabase.storage.from('client-files').list('', { limit: 1 })
                return { success: !error, error: error?.message }
            }
        }
    ]

    let passedTests = 0
    let failedTests = 0

    for (const testCase of tests) {
        try {
            const result = await testCase.test()
            
            if (result.success) {
                console.log(`✅ ${testCase.name}`)
                if (result.hasData) {
                    console.log(`   📊 Dados encontrados`)
                }
                passedTests++
            } else {
                console.log(`❌ ${testCase.name}`)
                console.log(`   Erro: ${result.error}`)
                failedTests++
            }
        } catch (error) {
            console.log(`❌ ${testCase.name}`)
            console.log(`   Erro: ${error.message}`)
            failedTests++
        }
    }

    console.log(`\n📊 Resultado: ${passedTests} passou(m), ${failedTests} falhou(aram)`)

    if (failedTests > 0) {
        console.log('\n🔧 Para corrigir os problemas:')
        console.log('1. Execute o SQL em sql/setup-crm-tables.sql no Supabase SQL Editor')
        console.log('2. Execute: pnpm setup-crm para criar os buckets')
        console.log('3. Configure as variáveis de ambiente corretamente')
    } else {
        console.log('\n🎉 CRM configurado com sucesso!')
        console.log('Agora você pode usar todas as funcionalidades do sistema.')
    }

    // Estatísticas adicionais se tudo estiver funcionando
    if (failedTests === 0) {
        console.log('\n📈 Estatísticas do CRM:')
        try {
            const [clients, properties, activities, documents, deals] = await Promise.all([
                supabase.from('crm_clients').select('id', { count: 'exact' }),
                supabase.from('crm_properties').select('id', { count: 'exact' }),
                supabase.from('crm_activities').select('id', { count: 'exact' }),
                supabase.from('crm_documents').select('id', { count: 'exact' }),
                supabase.from('crm_deals').select('id', { count: 'exact' })
            ])

            console.log(`👥 Clientes: ${clients.count || 0}`)
            console.log(`🏠 Imóveis: ${properties.count || 0}`)
            console.log(`📅 Atividades: ${activities.count || 0}`)
            console.log(`📄 Documentos: ${documents.count || 0}`)
            console.log(`💼 Negócios: ${deals.count || 0}`)

        } catch (error) {
            console.log('❌ Erro ao carregar estatísticas:', error.message)
        }
    }
}

// Executar teste
testCRMSetup().catch(console.error)
