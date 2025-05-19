/**
 * fix-sourcemaps.js
 * 
 * Script para resolver problemas com source maps no build do Next.js
 * Deve ser executado antes do build para remover source maps problemáticos
 * Funciona tanto em desenvolvimento local quanto em ambientes CI/CD
 * 
 * @version 1.1.0
 * @date 19/05/2025
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Detectar ambiente de execução
const isCI = process.env.CI === 'true' || process.env.VERCEL === '1';
const isVercel = process.env.VERCEL === '1';
const useEmoji = !isCI; // Emojis podem não funcionar bem em alguns ambientes CI

// Função auxiliar para logging compatível com CI
function log(message, type = 'info') {
    const prefix = useEmoji
        ? { info: '🔍 ', success: '✅ ', error: '❌ ', warning: '⚠️ ' }[type]
        : `[${type.toUpperCase()}] `;

    console.log(`${prefix}${message}`);
}

// Encontrar e remover arquivos de source map problemáticos
function removeSourceMaps() {
    log('Iniciando processo de limpeza de source maps...');

    // Verificar existência do diretório
    const lucidePath = path.join(process.cwd(), 'node_modules/lucide-react');
    if (!fs.existsSync(lucidePath)) {
        log('Diretório lucide-react não encontrado, pulando limpeza', 'warning');
        return;
    }

    // Localizar os arquivos .map do lucide-react
    const sourceMapFiles = glob.sync('node_modules/lucide-react/**/*.map');

    // Contar quantos foram encontrados
    log(`Encontrados ${sourceMapFiles.length} arquivos de source map para processar`);    // Remover cada arquivo
    let removedCount = 0;
    sourceMapFiles.forEach(file => {
        try {
            // Remove o arquivo .map
            fs.unlinkSync(file);

            // Cria um arquivo .map vazio para evitar erros de leitura
            fs.writeFileSync(file, '{}');

            removedCount++;
            log(`Tratado: ${file}`, 'success');
        } catch (err) {
            log(`Erro ao processar ${file}: ${err.message}`, 'error');
        }
    });

    console.log(`\n🎉 Processo concluído! ${removedCount} arquivos de source map removidos.\n`);
}

// Executar a limpeza
removeSourceMaps();
