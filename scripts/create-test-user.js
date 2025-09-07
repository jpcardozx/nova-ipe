/**
 * Script para criar um usuário de teste e verificar se o login está funcionando
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function createTestUser() {
  console.log('🧪 Criando usuário de teste para login...\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Variáveis de ambiente não encontradas!');
    return false;
  }

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  const testEmail = 'teste@ipe-imoveis.com';
  const testPassword = 'teste123456';

  try {
    console.log('1. Verificando se usuário já existe...');
    
    // Check if access request already exists
    const { data: existingRequest } = await supabase
      .from('access_requests')
      .select('*')
      .eq('email', testEmail)
      .single();

    if (existingRequest) {
      console.log('✅ Solicitação de acesso já existe:', existingRequest.status);
      
      if (existingRequest.status !== 'approved') {
        console.log('🔄 Aprovando solicitação...');
        await supabase
          .from('access_requests')
          .update({ status: 'approved', reviewed_at: new Date().toISOString() })
          .eq('email', testEmail);
        console.log('✅ Solicitação aprovada!');
      }
    } else {
      console.log('📝 Criando nova solicitação de acesso...');
      
      const { data: newRequest, error: requestError } = await supabase
        .from('access_requests')
        .insert([{
          email: testEmail,
          full_name: 'Usuário Teste',
          phone: '(11) 99999-9999',
          department: 'vendas',
          requested_role: 'agent',
          justification: 'Usuário de teste para verificar login',
          status: 'approved',
          reviewed_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (requestError) {
        console.error('❌ Erro ao criar solicitação:', requestError.message);
        return false;
      }

      console.log('✅ Solicitação criada e aprovada:', newRequest.id);
    }

    console.log('\n2. Verificando usuário no Auth...');

    // Check if user exists in Supabase Auth
    const { data: authUser, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError && signInError.message.includes('Invalid login credentials')) {
      console.log('👤 Usuário não existe no Auth, criando...');
      
      // Create user in Supabase Auth
      const { data: newUser, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: 'Usuário Teste',
            department: 'vendas'
          }
        }
      });

      if (signUpError) {
        console.error('❌ Erro ao criar usuário:', signUpError.message);
        return false;
      }

      console.log('✅ Usuário criado no Auth:', newUser.user?.id);
      
      // Note: In a real scenario, you might need to confirm the email
      // For testing, we'll assume auto-confirmation is enabled
      
    } else if (authUser.user) {
      console.log('✅ Usuário já existe no Auth:', authUser.user.id);
      
      // Sign out after verification
      await supabase.auth.signOut();
    } else if (signInError) {
      console.error('❌ Erro inesperado:', signInError.message);
      return false;
    }

    console.log('\n3. Testando fluxo de login completo...');

    // Test the complete login flow
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (loginError) {
      console.error('❌ Erro no login:', loginError.message);
      return false;
    }

    // Verify access request
    const { data: verifyRequest, error: verifyError } = await supabase
      .from('access_requests')
      .select('*')
      .eq('email', testEmail)
      .eq('status', 'approved')
      .single();

    if (verifyError || !verifyRequest) {
      console.error('❌ Erro na verificação:', verifyError?.message);
      return false;
    }

    console.log('✅ Login completo funcionando!');
    console.log('👤 Usuário:', verifyRequest.full_name);
    console.log('🏢 Departamento:', verifyRequest.department);

    // Sign out
    await supabase.auth.signOut();

    console.log('\n🎉 Teste concluído com sucesso!');
    console.log('\n📋 Credenciais de teste:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Senha: ${testPassword}`);
    console.log('\n🚀 Agora você pode testar o login em /login');

    return true;

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return false;
  }
}

// Run the test
if (require.main === module) {
  createTestUser()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Teste falhou:', error);
      process.exit(1);
    });
}

module.exports = { createTestUser };
