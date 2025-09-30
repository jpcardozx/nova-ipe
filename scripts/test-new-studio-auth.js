// Test script for the new Zoho-based Studio authentication
// Run this with: node scripts/test-new-studio-auth.js

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

const testZohoStudioAuth = async () => {
    console.log('🧪 Testando Nova Arquitetura: Zoho Auth para Studio\n');
    
    try {
        // 1. Test session status (should be unauthenticated)
        console.log('1. Verificando status da sessão inicial...');
        const sessionCheck1 = await fetch(`${BASE_URL}/api/studio/session`);
        const sessionData1 = await sessionCheck1.json();
        console.log('   Status:', sessionData1.authenticated ? '✅ Autenticado' : '❌ Não autenticado');
        
        // 2. Test creating a session (simulating successful Zoho auth)
        console.log('\n2. Criando sessão após "autenticação Zoho"...');
        const userData = {
            email: 'admin@imobiliariaipe.com.br',
            name: 'Administrador',
            organization: 'Ipê Imóveis',
            provider: 'zoho_mail360'
        };
        
        const createSession = await fetch(`${BASE_URL}/api/studio/session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userData })
        });
        
        const createResult = await createSession.json();
        console.log('   Resultado:', createResult.success ? '✅ Sessão criada' : '❌ Falhou');
        
        // 3. Test session status again (should be authenticated now)
        console.log('\n3. Verificando status após criação da sessão...');
        const sessionCheck2 = await fetch(`${BASE_URL}/api/studio/session`, {
            headers: {
                'Cookie': createSession.headers.get('set-cookie') || ''
            }
        });
        const sessionData2 = await sessionCheck2.json();
        console.log('   Status:', sessionData2.authenticated ? '✅ Autenticado' : '❌ Não autenticado');
        if (sessionData2.authenticated) {
            console.log('   Usuário:', sessionData2.user.email);
        }
        
        // 4. Test session deletion (logout)
        console.log('\n4. Testando logout (remoção da sessão)...');
        const deleteSession = await fetch(`${BASE_URL}/api/studio/session`, {
            method: 'DELETE',
            headers: {
                'Cookie': createSession.headers.get('set-cookie') || ''
            }
        });
        
        const deleteResult = await deleteSession.json();
        console.log('   Resultado:', deleteResult.success ? '✅ Sessão removida' : '❌ Falhou');
        
        // 5. Final session check (should be unauthenticated)
        console.log('\n5. Verificação final da sessão...');
        const sessionCheck3 = await fetch(`${BASE_URL}/api/studio/session`);
        const sessionData3 = await sessionCheck3.json();
        console.log('   Status:', sessionData3.authenticated ? '❌ Ainda autenticado' : '✅ Não autenticado');
        
        console.log('\n🎉 Teste da nova arquitetura concluído!');
        
    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
    }
};

testZohoStudioAuth();