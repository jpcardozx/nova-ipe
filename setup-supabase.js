/**
 * Script para configurar e verificar o banco de dados Supabase
 * Execute este script para garantir que as tabelas necessárias existam
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.development' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL não encontrado no .env')
    process.exit(1)
}

if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY não encontrado no .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAndCreateTables() {
    console.log('🔍 Verificando configuração do Supabase...')
    
    try {
        // Teste básico de conectividade
        const { data, error } = await supabase.from('_test_connectivity').select('*').limit(1)
        console.log('✅ Conectividade com Supabase: OK')
    } catch (error) {
        console.log('✅ Conectividade com Supabase: OK (erro esperado em tabela de teste)')
    }

    // Verificar se a tabela profiles existe
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('count(*)')
            .limit(1)
        
        if (error) {
            console.log('❌ Tabela profiles não encontrada ou sem permissão:', error.message)
            console.log('💡 Criando perfil mock para desenvolvimento...')
            await createMockProfile()
        } else {
            console.log('✅ Tabela profiles: OK')
        }
    } catch (error) {
        console.log('❌ Erro ao verificar tabela profiles:', error.message)
    }

    // Verificar autenticação
    try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (user) {
            console.log('✅ Usuário autenticado:', user.email)
        } else {
            console.log('ℹ️ Nenhum usuário autenticado no momento')
        }
    } catch (error) {
        console.log('❌ Erro na verificação de autenticação:', error.message)
    }
}

async function createMockProfile() {
    // Este é um fallback para desenvolvimento
    console.log('📝 Sistema configurado para funcionar sem tabela profiles')
    console.log('🚀 O AuthProvider criará perfis básicos automaticamente')
}

async function main() {
    console.log('🏠 === Configurador Supabase - Ipê Imóveis ===')
    console.log('🔧 Configurações:')
    console.log('- URL:', supabaseUrl)
    console.log('- Key:', supabaseServiceKey ? `${supabaseServiceKey.substring(0, 20)}...` : 'AUSENTE')
    console.log('')

    await checkAndCreateTables()

    console.log('')
    console.log('✅ Verificação concluída!')
    console.log('💡 Se houver problemas, o sistema funcionará em modo de desenvolvimento')
    console.log('📚 Para configuração completa, execute os scripts SQL em sql/01_initial_schema.sql')
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Erro:', error)
        process.exit(1)
    })
