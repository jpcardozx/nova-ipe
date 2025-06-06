// Fix para problemas de resolução de módulos com componentes React
const path = require('path');
const fs = require('fs');

// Cria um wrapper dinâmico para ImovelDetalhes que força a resolução correta
function createComponentWrapper() {
    const componentPath = path.join(__dirname, 'ImovelDetalhes.tsx');

    if (!fs.existsSync(componentPath)) {
        console.error('❌ ImovelDetalhes.tsx não encontrado em:', componentPath);
        return null;
    }

    try {
        // Força re-importação do módulo
        delete require.cache[require.resolve('./ImovelDetalhes')];
        delete require.cache[require.resolve('./ImovelDetalhes.tsx')];

        const component = require('./ImovelDetalhes');

        if (component && component.default) {
            console.log('✅ ImovelDetalhes carregado com sucesso via wrapper');
            return component.default;
        } else {
            console.warn('⚠️ ImovelDetalhes carregado mas sem export default');
            return component;
        }
    } catch (error) {
        console.error('❌ Erro ao carregar ImovelDetalhes via wrapper:', error);
        return null;
    }
}

module.exports = {
    createComponentWrapper,
    ImovelDetalhesWrapper: createComponentWrapper()
};
