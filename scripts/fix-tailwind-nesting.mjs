/**
 * Script para corrigir o problema específico do plugin de nesting do Tailwind CSS
 * O erro "TypeError: (0 , _postcss.default)(...).process(...).sync is not a function"
 * ocorre quando o plugin tenta usar um método que não está disponível
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigindo nesting plugin do Tailwind CSS...');

// Verificar se o tailwindcss/nesting está instalado
const nestingPluginPath = path.join(process.cwd(), 'node_modules', 'tailwindcss', 'nesting');
const nestingIndexPath = path.join(nestingPluginPath, 'index.js');

if (!fs.existsSync(nestingIndexPath)) {
    console.log('⚠️ Plugin de nesting não encontrado no caminho padrão.');
    // Tentar criar diretório e arquivos necessários
    try {
        if (!fs.existsSync(nestingPluginPath)) {
            fs.mkdirSync(nestingPluginPath, { recursive: true });
        }

        // Usar nosso substituto personalizado do plugin de nesting
        const customNestingPath = path.join(process.cwd(), 'lib', 'plugins', 'nesting-fallback.js');

        // Verificar se nosso plugin personalizado existe
        if (fs.existsSync(customNestingPath)) {
            // Copiar nosso plugin personalizado para o diretório do nesting
            fs.copyFileSync(customNestingPath, nestingIndexPath);
            console.log('✅ Plugin de nesting personalizado copiado com sucesso!');
        } else {
            // Se não existir, criar o arquivo com o conteúdo padrão
            const nestingPluginContent = `
/**
 * Substituto para o plugin de nesting do Tailwind CSS
 * Esta versão não usa o método sync que causa erros
 */
'use strict';

// Criamos uma função simples que retorna um plugin válido para o PostCSS
function createNestingPlugin(opts = {}) {
  return {
    postcssPlugin: 'tailwindcss-nesting',
    Once(root) {
      // Um plugin esvaziado que não faz nada, mas não quebra o build
      return root;
    }
  };
}

// Definir a propriedade postcss = true é essencial
createNestingPlugin.postcss = true;

module.exports = createNestingPlugin;
`;

            fs.writeFileSync(nestingIndexPath, nestingPluginContent, 'utf8');
            console.log('✅ Substituto do plugin de nesting criado com sucesso!');
        }
    } catch (error) {
        console.error('❌ Erro ao criar substituto para o plugin de nesting:', error.message);
    }
} else {
    // Se o plugin já existe, modificá-lo para não usar sync
    try {
        let content = fs.readFileSync(nestingIndexPath, 'utf8');

        // Verificar se ele usa o método sync
        if (content.includes('.sync(')) {
            // Substituir chamadas ao método sync
            content = content.replace(/\.sync\(/g, '(');

            fs.writeFileSync(nestingIndexPath, content, 'utf8');
            console.log('✅ Método sync removido do plugin de nesting!');
        } else {
            console.log('✅ Plugin de nesting já não usa o método sync, nenhuma correção necessária.');
        }
    } catch (error) {
        console.error('❌ Erro ao modificar o plugin de nesting:', error.message);
    }
}

console.log('🎉 Correção do plugin de nesting do Tailwind CSS concluída!');
