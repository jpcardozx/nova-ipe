/**
 * Script para atualizar componentes de cartões de imóveis para usar PropertyImage
 * Data: Maio 2025
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configurações
const CONFIG = {
    rootDir: process.cwd(),
    componentsToUpdate: [
        'PropertyCard',
        'ImovelCard',
        'CardImovel',
        'OptimizedPropertyCard'
    ],
    patterns: [
        // Padrão para <img> simples
        {
            search: /<img\s+src=\{([^}]+)\}\s+alt=\{([^}]+)\}([^>]*?)\/>/g,
            replace: (_, src, alt, attrs) => {
                return `<PropertyImage src={${src}} alt={${alt}}${attrs}/>`;
            }
        },
        // Padrão para <img> com fechamento
        {
            search: /<img\s+src=\{([^}]+)\}\s+alt=\{([^}]+)\}([^>]*?)>\s*<\/img>/g,
            replace: (_, src, alt, attrs) => {
                return `<PropertyImage src={${src}} alt={${alt}}${attrs}></PropertyImage>`;
            }
        },
        // Padrão para next/image <Image>
        {
            search: /<Image\s+src=\{([^}]+)\}\s+alt=\{([^}]+)\}([^>]*?)\/>/g,
            replace: (_, src, alt, attrs) => {
                return `<PropertyImage src={${src}} alt={${alt}}${attrs}/>`;
            }
        }
    ],
    importPattern: /import\s+([^;]+)\s+from\s+['"]([^'"]+)['"]/g,
    propertyImageImport: `import PropertyImage from '../components/PropertyImage';`,
    relativePropertyImageImport: `import PropertyImage from './PropertyImage';`,
    pathIsExcluded: (filePath) => filePath.includes('node_modules') || filePath.includes('.next'),
    backupDir: './backups/auto-update'
};

// Certifica-se de que o diretório de backup existe
function ensureBackupDir() {
    const dir = path.join(CONFIG.rootDir, CONFIG.backupDir);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
}

// Faz backup de um arquivo antes de modificá-lo
function backupFile(filePath) {
    const backupDir = ensureBackupDir();
    const relativePath = path.relative(CONFIG.rootDir, filePath);
    const backupPath = path.join(backupDir, `${relativePath.replace(/[\\/]/g, '-')}.bak`);

    fs.copyFileSync(filePath, backupPath);
    return backupPath;
}

// Verifica se o arquivo já importa PropertyImage
function hasPropertyImageImport(content) {
    return content.includes('PropertyImage');
}

// Adiciona import do PropertyImage se não existir
function addPropertyImageImport(content, filePath) {
    // Se já tem o import, não faz nada
    if (hasPropertyImageImport(content)) {
        return content;
    }

    // Determina qual import usar baseado no caminho do arquivo
    const importStatement = filePath.includes('/components/') || filePath.includes('\\components\\')
        ? CONFIG.relativePropertyImageImport
        : CONFIG.propertyImageImport;

    // Encontra o último import no arquivo
    const imports = [...content.matchAll(CONFIG.importPattern)];
    if (imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const lastImportEnd = lastImport.index + lastImport[0].length;

        // Insere depois do último import
        return content.slice(0, lastImportEnd) + ';\n' + importStatement + content.slice(lastImportEnd);
    }

    // Se não encontrar imports, adiciona no início do arquivo
    return importStatement + ';\n\n' + content;
}

// Atualiza o conteúdo do arquivo
function updateFileContent(filePath, content) {
    // Fazer backup do arquivo
    const backupPath = backupFile(filePath);

    // Primeiro adicionar o import necessário
    let updatedContent = addPropertyImageImport(content, filePath);

    // Então substituir os padrões
    let replacementsMade = false;
    for (const pattern of CONFIG.patterns) {
        const originalContent = updatedContent;
        updatedContent = updatedContent.replace(pattern.search, pattern.replace);

        if (originalContent !== updatedContent) {
            replacementsMade = true;
        }
    }

    // Salvar o arquivo se houve alterações
    if (replacementsMade) {
        fs.writeFileSync(filePath, updatedContent);
        console.log(`✅ Atualizado: ${filePath} (Backup: ${backupPath})`);
        return true;
    }

    console.log(`⏭️ Sem alterações necessárias: ${filePath}`);
    return false;
}

// Encontra e atualiza todos os arquivos relevantes
async function updateComponents() {
    // Criar strings para padrões de busca
    const componentPatterns = CONFIG.componentsToUpdate.map(comp => `**/*${comp}*.{tsx,jsx,js}`);
    const allPatterns = [...componentPatterns, '**/*Card*.{tsx,jsx,js}'];

    // Encontrar todos os arquivos que correspondem aos padrões
    const files = glob.sync(allPatterns, { cwd: CONFIG.rootDir });

    console.log(`Encontrados ${files.length} arquivos potenciais para atualização.`);

    let updatedCount = 0;

    // Processar cada arquivo
    for (const file of files) {
        const filePath = path.join(CONFIG.rootDir, file);

        // Pular arquivos excluídos
        if (CONFIG.pathIsExcluded(filePath)) {
            continue;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // Verificar se o arquivo contém tags de imagem
            const hasImageTags = content.includes('<img') || content.includes('<Image');

            if (hasImageTags) {
                if (updateFileContent(filePath, content)) {
                    updatedCount++;
                }
            }
        } catch (error) {
            console.error(`❌ Erro ao processar ${filePath}:`, error.message);
        }
    }

    console.log(`\n🎉 Atualização concluída! ${updatedCount} arquivos foram modificados.`);
}

// Executa o script
console.log('🔄 Iniciando atualização dos componentes de cartões de imóveis...');
updateComponents()
    .then(() => console.log('✨ Processo finalizado com sucesso!'))
    .catch(error => console.error('❌ Erro durante o processo:', error));
