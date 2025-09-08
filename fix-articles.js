const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigindo arquivos de artigos com problemas de parsing...');

const articlesDir = './app/data/articles/';
const files = [
    'otimizacao-anuncios-portais.ts',
    'whatsapp-para-corretores.ts', 
    'google-para-corretores.ts',
    'facebook-para-corretores.ts'
];

files.forEach(filename => {
    const filePath = path.join(articlesDir, filename);
    
    if (fs.existsSync(filePath)) {
        console.log(`\n📝 Processando: ${filename}`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Substituir blocos de código que causam erro de parsing
        // Remover ``` que estão dentro de template strings
        content = content.replace(/```[\s\S]*?```/g, (match) => {
            // Converter blocos de código em texto simples com indentação
            const codeContent = match.replace(/```.*?\n/, '').replace(/\n```/, '');
            return '**Código:**\n' + codeContent.split('\n').map(line => '    ' + line).join('\n');
        });
        
        // Corrigir problemas específicos de sintaxe
        content = content.replace(/Score = \(/g, 'Score = (');
        content = content.replace(/`\s*$/m, '`');
        
        // Escrever arquivo corrigido
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${filename} corrigido!`);
    } else {
        console.log(`❌ Arquivo não encontrado: ${filename}`);
    }
});

console.log('\n🎉 Correção concluída!');
