// Test authentication directly
import { EnhancedAuthManager } from '../lib/auth/enhanced-auth-manager.js';

const test = async () => {
    console.log('🧪 Testando autenticação do Studio...');
    
    const authManager = new EnhancedAuthManager();
    
    try {
        const result = await authManager.authenticate({
            email: 'admin@imobiliariaipe.com.br',
            password: 'ipeplataformadigital'
        }, 'studio');
        
        console.log('Resultado:', result);
        
        if (result.success) {
            console.log('✅ Autenticação bem-sucedida!');
        } else {
            console.log('❌ Falha na autenticação:', result.error);
        }
    } catch (error) {
        console.log('❌ Erro no teste:', error.message);
    }
};

test();