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

async function executeSQL() {
    console.log('🚀 Executando SQL do CRM no Supabase...\n')

    try {
        // Executar SQL individual para cada tabela
        const sqlCommands = [
            // 1. Criar tabela de clientes
            `CREATE TABLE IF NOT EXISTS crm_clients (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE,
                phone VARCHAR(20),
                cpf_cnpj VARCHAR(20),
                address TEXT,
                city VARCHAR(100),
                state VARCHAR(2),
                zip_code VARCHAR(10),
                notes TEXT,
                status VARCHAR(20) DEFAULT 'active',
                lead_source VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );`,

            // 2. Criar tabela de propriedades
            `CREATE TABLE IF NOT EXISTS crm_properties (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                property_type VARCHAR(50),
                price DECIMAL(15,2),
                address TEXT NOT NULL,
                city VARCHAR(100),
                state VARCHAR(2),
                zip_code VARCHAR(10),
                bedrooms INTEGER,
                bathrooms INTEGER,
                area DECIMAL(10,2),
                status VARCHAR(20) DEFAULT 'available',
                owner_id UUID REFERENCES crm_clients(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );`,

            // 3. Criar tabela de atividades
            `CREATE TABLE IF NOT EXISTS crm_activities (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                activity_type VARCHAR(50),
                status VARCHAR(20) DEFAULT 'pending',
                due_date TIMESTAMP WITH TIME ZONE,
                client_id UUID REFERENCES crm_clients(id),
                property_id UUID REFERENCES crm_properties(id),
                created_by VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );`,

            // 4. Criar tabela de documentos
            `CREATE TABLE IF NOT EXISTS crm_documents (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                file_name VARCHAR(255) NOT NULL,
                file_path TEXT NOT NULL,
                file_size INTEGER,
                mime_type VARCHAR(100),
                document_type VARCHAR(50),
                client_id UUID REFERENCES crm_clients(id),
                property_id UUID REFERENCES crm_properties(id),
                uploaded_by VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );`,

            // 5. Criar tabela de negócios
            `CREATE TABLE IF NOT EXISTS crm_deals (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                value DECIMAL(15,2),
                status VARCHAR(20) DEFAULT 'pending',
                stage VARCHAR(50),
                client_id UUID REFERENCES crm_clients(id),
                property_id UUID REFERENCES crm_properties(id),
                close_date DATE,
                commission DECIMAL(5,2),
                notes TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );`
        ]

        // Executar cada comando SQL
        for (let i = 0; i < sqlCommands.length; i++) {
            const tableName = ['crm_clients', 'crm_properties', 'crm_activities', 'crm_documents', 'crm_deals'][i]
            console.log(`${i + 1}. Criando tabela ${tableName}...`)
            
            const { error } = await supabase.rpc('exec_sql', { query: sqlCommands[i] })
            
            if (error) {
                console.log(`❌ Erro ao criar ${tableName}:`, error.message)
                // Tentar método alternativo com .from() apenas para verificar se existe
                const { error: testError } = await supabase.from(tableName).select('count').limit(1)
                if (testError && testError.code === '42P01') {
                    console.log(`⚠️  Execute manualmente no Supabase SQL Editor:\n${sqlCommands[i]}\n`)
                } else {
                    console.log(`✅ Tabela ${tableName} já existe ou foi criada`)
                }
            } else {
                console.log(`✅ Tabela ${tableName} criada com sucesso`)
            }
        }

        console.log('\n🎉 Processo concluído!')
        console.log('\n📋 Próximos passos:')
        console.log('1. Execute: pnpm test-crm para verificar')
        console.log('2. Se alguma tabela falhou, execute o SQL manualmente no Supabase')

    } catch (error) {
        console.error('❌ Erro durante a execução:', error.message)
        console.log('\n🔧 Solução alternativa:')
        console.log('1. Acesse o Supabase Dashboard')
        console.log('2. Vá em SQL Editor')
        console.log('3. Execute o arquivo sql/setup-crm-tables.sql')
    }
}

executeSQL()
