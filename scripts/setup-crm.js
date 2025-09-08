#!/usr/bin/env node

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variáveis de ambiente do Supabase não encontradas')
    console.log('Certifique-se de ter NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupCRM() {
    console.log('🚀 Configurando CRM no Supabase...\n')

    try {
        // 1. Verificar conexão
        console.log('1. Verificando conexão com Supabase...')
        const { data, error } = await supabase.from('crm_clients').select('count').limit(1)
        
        if (error && error.code === '42P01') {
            console.log('⚠️  Tabelas CRM não encontradas. Executando SQL...')
            
            // Ler e executar o SQL
            const sqlPath = path.join(__dirname, '..', 'sql', 'setup-crm-tables.sql')
            const sqlContent = fs.readFileSync(sqlPath, 'utf8')
            
            console.log('📝 Executando script SQL...')
            console.log('⚠️  ATENÇÃO: Execute este SQL manualmente no Supabase SQL Editor:')
            console.log('-------------------------------------------------------------------')
            console.log(sqlContent)
            console.log('-------------------------------------------------------------------\n')
            
        } else if (error) {
            throw error
        } else {
            console.log('✅ Conexão estabelecida!')
        }

        // 2. Verificar storage buckets
        console.log('2. Verificando buckets de storage...')
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
        
        if (bucketsError) {
            console.error('❌ Erro ao listar buckets:', bucketsError.message)
        } else {
            const requiredBuckets = ['documents', 'property-images', 'client-files']
            
            for (const bucketName of requiredBuckets) {
                const bucketExists = buckets.find(b => b.name === bucketName)
                
                if (!bucketExists) {
                    console.log(`📁 Criando bucket '${bucketName}'...`)
                    const { error: createError } = await supabase.storage.createBucket(bucketName, {
                        public: false,
                        allowedMimeTypes: [
                            'image/*',
                            'application/pdf',
                            'text/*',
                            'application/msword',
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'application/vnd.ms-excel',
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        ],
                        fileSizeLimit: 100 * 1024 * 1024 // 100MB
                    })
                    
                    if (createError) {
                        console.error(`❌ Erro ao criar bucket '${bucketName}':`, createError.message)
                    } else {
                        console.log(`✅ Bucket '${bucketName}' criado com sucesso!`)
                    }
                } else {
                    console.log(`✅ Bucket '${bucketName}' já existe`)
                }
            }
        }

        // 3. Inserir dados de exemplo (opcional)
        console.log('\n3. Configuração de dados de exemplo...')
        const setupSampleData = process.argv.includes('--sample-data')
        
        if (setupSampleData) {
            console.log('📝 Inserindo dados de exemplo...')
            await insertSampleData()
        } else {
            console.log('ℹ️  Para inserir dados de exemplo, execute: node setup-crm.js --sample-data')
        }

        console.log('\n🎉 Configuração do CRM concluída!')
        console.log('\n📋 Próximos passos:')
        console.log('1. Execute o SQL fornecido acima no Supabase SQL Editor')
        console.log('2. Configure as políticas RLS conforme necessário')
        console.log('3. Teste a aplicação CRM')
        
    } catch (error) {
        console.error('❌ Erro durante a configuração:', error.message)
        process.exit(1)
    }
}

async function insertSampleData() {
    try {
        // Cliente de exemplo
        const { data: client, error: clientError } = await supabase
            .from('crm_clients')
            .insert([{
                name: 'João Silva',
                email: 'joao.silva@email.com',
                phone: '(11) 99999-9999',
                cpf_cnpj: '123.456.789-00',
                address: {
                    street: 'Rua das Flores, 123',
                    city: 'São Paulo',
                    state: 'SP',
                    zipCode: '01234-567'
                },
                lead_source: 'Website',
                notes: 'Cliente interessado em apartamento na zona sul'
            }])
            .select()

        if (clientError) throw clientError

        // Imóvel de exemplo
        const { data: property, error: propertyError } = await supabase
            .from('crm_properties')
            .insert([{
                title: 'Apartamento 3 quartos - Vila Olímpia',
                description: 'Belo apartamento com 3 quartos, 2 banheiros, sala ampla e varanda.',
                property_type: 'Apartamento',
                price: 650000.00,
                address: {
                    street: 'Rua Olimpíadas, 500',
                    neighborhood: 'Vila Olímpia',
                    city: 'São Paulo',
                    state: 'SP',
                    zipCode: '04551-000'
                },
                features: {
                    bedrooms: 3,
                    bathrooms: 2,
                    area: 85,
                    parking: 1,
                    elevator: true,
                    balcony: true
                }
            }])
            .select()

        if (propertyError) throw propertyError

        console.log('✅ Dados de exemplo inseridos com sucesso!')

    } catch (error) {
        console.error('❌ Erro ao inserir dados de exemplo:', error.message)
    }
}

// Executar configuração
setupCRM()
