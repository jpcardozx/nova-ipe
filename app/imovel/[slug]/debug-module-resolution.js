// Módulo para debug e diagnóstico de importações
export function debugModuleResolution() {
    const moduleInfo = {
        timestamp: new Date().toISOString(),
        platform: typeof window === 'undefined' ? 'server' : 'client',
        nodeVersion: process.version,
        environment: process.env.NODE_ENV,
        isNextJs: !!process.env.NEXT_RUNTIME,
        modules: {}
    };

    // Tenta importar ImovelDetalhes de diferentes maneiras
    try {
        const direct = require('./ImovelDetalhes');
        moduleInfo.modules.directRequire = {
            success: true,
            type: typeof direct,
            default: typeof direct.default,
            hasDefault: 'default' in direct
        };
    } catch (error) {
        moduleInfo.modules.directRequire = {
            success: false,
            error: error.message
        };
    }

    try {
        const defaultImport = require('./ImovelDetalhes').default;
        moduleInfo.modules.defaultImport = {
            success: true,
            type: typeof defaultImport,
            isFunction: typeof defaultImport === 'function',
            isComponent: typeof defaultImport === 'function' && defaultImport.prototype
        };
    } catch (error) {
        moduleInfo.modules.defaultImport = {
            success: false,
            error: error.message
        };
    }

    console.log('🔍 Module Resolution Debug:', JSON.stringify(moduleInfo, null, 2));
    return moduleInfo;
}

// Auto-run no servidor
if (typeof window === 'undefined') {
    debugModuleResolution();
}
