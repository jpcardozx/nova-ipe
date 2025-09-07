#!/usr/bin/env node
require('dotenv').config({ path: '.env.development' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Variáveis de ambiente SUPABASE não configuradas')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTables() {
    console.log('🔧 Criando tabelas do Supabase...')
    
    try {
        // Ler e executar o schema SQL
        const schemaSQL = fs.readFileSync(path.join(__dirname, '../sql/01_initial_schema.sql'), 'utf8')
        
        console.log('📝 Executando schema SQL...')
        const { data, error } = await supabase.rpc('exec_sql', { sql: schemaSQL })
        
        if (error) {
            console.error('❌ Erro ao executar SQL:', error)
            
            // Tentar método alternativo - executar comandos individuais
            console.log('🔄 Tentando método alternativo...')
            await createTablesAlternative()
        } else {
            console.log('✅ Schema criado com sucesso!')
        }
        
        // Verificar se as tabelas foram criadas
        await verifyTables()
        
    } catch (error) {
        console.error('❌ Erro geral:', error)
        await createTablesAlternative()
    }
}

async function createTablesAlternative() {
    console.log('🔄 Criando tabelas individualmente...')
    
    try {
        // Criar tabela profiles
        const createProfilesSQL = `
        CREATE TABLE IF NOT EXISTS public.profiles (
            id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            full_name VARCHAR(255),
            avatar_url TEXT,
            department VARCHAR(100),
            role VARCHAR(50) DEFAULT 'user',
            phone VARCHAR(20),
            is_active BOOLEAN DEFAULT true,
            is_approved BOOLEAN DEFAULT false,
            approved_by UUID REFERENCES public.profiles(id),
            approved_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`
        
        console.log('📝 Criando tabela profiles...')
        const { error: profilesError } = await supabase.rpc('exec_sql', { sql: createProfilesSQL })
        if (profilesError) {
            console.error('❌ Erro ao criar tabela profiles:', profilesError)
        } else {
            console.log('✅ Tabela profiles criada!')
        }
        
        // Habilitar RLS
        const enableRLSSQL = `
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Users can view own profile" ON public.profiles
            FOR SELECT USING (auth.uid() = id);
            
        CREATE POLICY IF NOT EXISTS "Admins can view all profiles" ON public.profiles
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid() 
                    AND role IN ('admin', 'super_admin')
                )
            );`
        
        console.log('🔒 Configurando políticas de segurança...')
        const { error: rlsError } = await supabase.rpc('exec_sql', { sql: enableRLSSQL })
        if (rlsError) {
            console.error('❌ Erro ao configurar RLS:', rlsError)
        } else {
            console.log('✅ Políticas de segurança configuradas!')
        }
        
    } catch (error) {
        console.error('❌ Erro no método alternativo:', error)
    }
}

async function verifyTables() {
    console.log('🔍 Verificando tabelas criadas...')
    
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('count(*)')
            .limit(1)
        
        if (error) {
            console.error('❌ Tabela profiles não acessível:', error.message)
        } else {
            console.log('✅ Tabela profiles está acessível!')
        }
    } catch (error) {
        console.error('❌ Erro na verificação:', error)
    }
}

// Executar script
createTables().catch(console.error)
