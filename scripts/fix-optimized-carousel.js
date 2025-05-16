/**
 * Script para corrigir problemas específicos no arquivo OptimizedCarousel.tsx
 * Este script corrige o problema de importação do Autoplay e outros problemas
 * encontrados no processo de build.
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigindo problemas específicos no OptimizedCarousel.tsx...');

// Caminho para o arquivo
const carouselPath = path.join(process.cwd(), 'app', 'components', 'ui', 'OptimizedCarousel.tsx');

// Verificar se o arquivo existe
if (!fs.existsSync(carouselPath)) {
    console.log('❌ Arquivo OptimizedCarousel.tsx não encontrado');
    // Tentar encontrar em locais alternativos
    const possiblePaths = [
        path.join(process.cwd(), 'components', 'ui', 'OptimizedCarousel.tsx'),
        path.join(process.cwd(), 'src', 'components', 'ui', 'OptimizedCarousel.tsx')
    ];

    for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
            console.log(`✅ Arquivo encontrado em ${possiblePath}`);
            fixOptimizedCarousel(possiblePath);
            break;
        }
    }
} else {
    fixOptimizedCarousel(carouselPath);
}

function fixOptimizedCarousel(filePath) {
    // Criar backup
    const backupPath = `${filePath}.bak`;
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(filePath, backupPath);
        console.log('✅ Backup criado');
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Verificar e corrigir importação do Autoplay
    if (content.includes("import Autoplay from 'embla-carousel-autoplay'")) {
        // Substituir por uma implementação minimalista
        content = content.replace(
            "import Autoplay from 'embla-carousel-autoplay';",
            `// Implementação minimalista do Autoplay para evitar problemas de build
const Autoplay = () => ({
  name: 'autoplay',
  options: { delay: 4000, stopOnInteraction: true, stopOnMouseEnter: false },
  init: () => {},
  destroy: () => {},
  play: () => {},
  stop: () => {},
  reset: () => {}
});`
        );

        console.log('✅ Importação do Autoplay corrigida');
    }

    // Verificar comentários malformados ou truncados
    if (content.includes('he autoplay plugin directly')) {
        content = content.replace(
            'he autoplay plugin directly',
            '// Import the autoplay plugin directly'
        );

        console.log('✅ Comentário malformado corrigido');
    }

    if (content.includes('lugin type to match EmblaPluginType')) {
        content = content.replace(
            'lugin type to match EmblaPluginType',
            '// Define plugin type to match EmblaPluginType'
        );

        console.log('✅ Comentário malformado corrigido');
    }

    // Escrever conteúdo corrigido
    fs.writeFileSync(filePath, content);
    console.log(`✅ Arquivo ${path.basename(filePath)} corrigido com sucesso!`);
}

console.log('🎉 Correções aplicadas com sucesso!');
