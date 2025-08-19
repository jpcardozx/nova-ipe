// lib/diagnostics/sanity-diagnostics.ts

export function diagnoseSanityConfiguration() {
    const diagnostics = {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'MISSING',
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'MISSING', 
        apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || 'MISSING',
        hasToken: !!process.env.SANITY_API_TOKEN,
        tokenLength: process.env.SANITY_API_TOKEN?.length || 0,
        environment: process.env.NODE_ENV || 'unknown'
    };

    console.log('🔍 Diagnóstico Sanity Configuration:', diagnostics);

    const issues = [];
    
    if (!diagnostics.projectId || diagnostics.projectId === 'MISSING') {
        issues.push('NEXT_PUBLIC_SANITY_PROJECT_ID não está definido');
    }
    
    if (!diagnostics.dataset || diagnostics.dataset === 'MISSING') {
        issues.push('NEXT_PUBLIC_SANITY_DATASET não está definido');
    }
    
    if (!diagnostics.apiVersion || diagnostics.apiVersion === 'MISSING') {
        issues.push('NEXT_PUBLIC_SANITY_API_VERSION não está definido');
    }
    
    if (!diagnostics.hasToken) {
        issues.push('SANITY_API_TOKEN não está definido');
    } else if (diagnostics.tokenLength < 50) {
        issues.push('SANITY_API_TOKEN parece estar incompleto (muito curto)');
    }

    if (issues.length > 0) {
        console.error('❌ Problemas encontrados na configuração do Sanity:', issues);
        return { isValid: false, issues, diagnostics };
    } else {
        console.log('✅ Configuração do Sanity parece estar correta');
        return { isValid: true, issues: [], diagnostics };
    }
}

export function testSanityConnection() {
    const config = diagnoseSanityConfiguration();
    
    if (!config.isValid) {
        throw new Error(`Configuração do Sanity inválida: ${config.issues.join(', ')}`);
    }
    
    return config;
}
