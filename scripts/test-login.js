/**
 * Script para testar a funcionalidade de login com Supabase
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function testLogin() {
  console.log('🔐 Testando funcionalidade de login...\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Variáveis de ambiente não encontradas!');
    return false;
  }

  console.log('✅ Variáveis de ambiente configuradas');
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Test 1: Check tables exist
  console.log('\n🗄️  Verificando tabelas necessárias...');
  
  const requiredTables = ['access_requests', 'login_attempts'];
  let tablesOk = true;

  for (const table of requiredTables) {
    try {
      const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      
      if (error && error.code === '42P01') {
        console.log(`❌ Tabela "${table}" não existe`);
        tablesOk = false;
      } else if (error) {
        console.log(`⚠️  Tabela "${table}" existe mas tem problemas de permissão:`, error.message);
      } else {
        console.log(`✅ Tabela "${table}" existe e está acessível`);
      }
    } catch (error) {
      console.log(`❌ Erro ao verificar tabela "${table}":`, error.message);
      tablesOk = false;
    }
  }

  if (!tablesOk) {
    console.log('\n❌ Algumas tabelas estão faltando. Execute o SQL schema primeiro.');
    return false;
  }

  // Test 2: Check user_profiles table (optional)
  console.log('\n🔍 Verificando tabela user_profiles (opcional)...');
  try {
    const { error } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true });
    
    if (error && error.code === '42P01') {
      console.log('⚠️  Tabela "user_profiles" não existe (usando access_requests como fallback)');
    } else if (error) {
      console.log('⚠️  Tabela "user_profiles" existe mas tem problemas:', error.message);
    } else {
      console.log('✅ Tabela "user_profiles" existe e está acessível');
    }
  } catch (error) {
    console.log('⚠️  Erro ao verificar user_profiles:', error.message);
  }

  // Test 3: Test access request creation (signup simulation)
  console.log('\n📝 Testando criação de solicitação de acesso...');
  
  const testEmail = `test.${Date.now()}@example.com`;
  
  try {
    const { data: newRequest, error: requestError } = await supabase
      .from('access_requests')
      .insert([{
        email: testEmail,
        full_name: 'Usuário Teste',
        phone: '(11) 99999-9999',
        department: 'vendas',
        justification: 'Teste de funcionalidade',
        status: 'pending'
      }])
      .select()
      .single();

    if (requestError) {
      console.log('❌ Erro ao criar solicitação:', requestError.message);
      return false;
    }

    console.log('✅ Solicitação criada com sucesso:', newRequest.id);

    // Clean up - remove test request
    await supabase
      .from('access_requests')
      .delete()
      .eq('id', newRequest.id);

    console.log('🗑️  Solicitação de teste removida');

  } catch (error) {
    console.log('❌ Erro no teste de criação:', error.message);
    return false;
  }

  // Test 4: Test login attempt logging
  console.log('\n📊 Testando log de tentativas de login...');
  
  try {
    const { data: logData, error: logError } = await supabase
      .from('login_attempts')
      .insert([{
        email: testEmail,
        success: false,
        attempted_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (logError) {
      console.log('❌ Erro ao criar log:', logError.message);
      return false;
    }

    console.log('✅ Log de tentativa criado com sucesso');

    // Clean up
    await supabase
      .from('login_attempts')
      .delete()
      .eq('id', logData.id);

    console.log('🗑️  Log de teste removido');

  } catch (error) {
    console.log('❌ Erro no teste de log:', error.message);
    return false;
  }

  console.log('\n🎉 Todos os testes passaram!');
  console.log('\n📋 Resumo da funcionalidade de login:');
  console.log('  ✅ Variáveis de ambiente configuradas');
  console.log('  ✅ Tabelas necessárias existem');
  console.log('  ✅ Criação de solicitações funciona');
  console.log('  ✅ Log de tentativas funciona');
  console.log('\n🚀 A página /login deve funcionar corretamente!');
  
  return true;
}

// Run the test
if (require.main === module) {
  testLogin()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Teste falhou:', error);
      process.exit(1);
    });
}

module.exports = { testLogin };
