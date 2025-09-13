require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Configurações do Supabase não encontradas!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
    console.log('🔍 Verificando tabelas do Supabase...\n');
    
    try {
        // Verificar tabela leads
        const { data: leadsData, error: leadsError } = await supabase
            .from('leads')
            .select('*')
            .limit(1);
        
        console.log('📊 Tabela leads:', leadsError ? '❌ NÃO EXISTE' : '✅ EXISTS');
        if (leadsError) console.log('   Erro:', leadsError.message);
        
        // Verificar tabela tasks  
        const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .limit(1);
            
        console.log('📋 Tabela tasks:', tasksError ? '❌ NÃO EXISTE' : '✅ EXISTS');
        if (tasksError) console.log('   Erro:', tasksError.message);
        
        // Verificar tabela clients
        const { data: clientsData, error: clientsError } = await supabase
            .from('clients')
            .select('*')
            .limit(1);
            
        console.log('👥 Tabela clients:', clientsError ? '❌ NÃO EXISTE' : '✅ EXISTS');
        if (clientsError) console.log('   Erro:', clientsError.message);
        
        // Verificar tabela properties
        const { data: propertiesData, error: propertiesError } = await supabase
            .from('properties')
            .select('*')
            .limit(1);
            
        console.log('🏠 Tabela properties:', propertiesError ? '❌ NÃO EXISTE' : '✅ EXISTS');
        if (propertiesError) console.log('   Erro:', propertiesError.message);
        
    } catch (err) {
        console.error('❌ Erro ao verificar tabelas:', err.message);
    }
}

checkTables();
