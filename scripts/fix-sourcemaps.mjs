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

import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

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

    // Localizar os arquivos .map em vários pacotes problemáticos
    const problemPackages = ['lucide-react', '@sentry/nextjs', 'next-sanity'];
    let sourceMapFiles = [];

    problemPackages.forEach(pkg => {
        const pkgMaps = glob.sync(`node_modules/${pkg}/**/*.map`);
        sourceMapFiles = [...sourceMapFiles, ...pkgMaps];
        log(`Encontrados ${pkgMaps.length} arquivos de source map em ${pkg}`);
    });

    // Contar quantos foram encontrados no total
    log(`Encontrados ${sourceMapFiles.length} arquivos de source map para processar no total`);    // Remover source maps e também modificar arquivos JS para remover referências
    let removedCount = 0;
    let jsModifiedCount = 0;

    // Tratamento especial para corrigir o problema dos ícones do lucide-react
    try {
        const lucideIconsDir = path.join(process.cwd(), 'node_modules/lucide-react/dist/esm/icons');

        if (fs.existsSync(lucideIconsDir)) {
            log(`Tratando diretório de ícones lucide-react: ${lucideIconsDir}`, 'info');

            // Encontra todos os arquivos JS de ícones
            const iconFiles = glob.sync(`${lucideIconsDir}/*.js`);
            log(`Encontrados ${iconFiles.length} arquivos de ícones para processar`, 'info');

            // Processa cada arquivo de ícone
            iconFiles.forEach(iconFile => {
                try {
                    // Ler o conteúdo
                    const iconContent = fs.readFileSync(iconFile, 'utf8');

                    // Remover referências a source maps
                    const cleanedContent = iconContent.replace(/\/\/# sourceMappingURL=.*\.map/g,
                        '// sourcemap reference removed for stability');

                    // Salvar o arquivo modificado
                    fs.writeFileSync(iconFile, cleanedContent);

                    // Também criar um arquivo .map vazio correspondente para evitar erros
                    const mapFile = `${iconFile}.map`;
                    fs.writeFileSync(mapFile, '{}');

                    jsModifiedCount++;
                } catch (iconErr) {
                    log(`Erro ao processar ícone ${iconFile}: ${iconErr.message}`, 'warning');
                }
            });

            log(`Processados ${jsModifiedCount} arquivos de ícones lucide-react`, 'success');
        }
    } catch (lucideErr) {
        log(`Erro ao tratar diretório lucide-react: ${lucideErr.message}`, 'error');
    }

    // Processa os arquivos .map identificados anteriormente
    sourceMapFiles.forEach(file => {
        try {
            // Remove o arquivo .map
            fs.unlinkSync(file);
            // Cria um arquivo .map vazio para evitar erros de leitura
            fs.writeFileSync(file, '{}');

            removedCount++;
            log(`Tratado: ${file}`, 'success');

            // Localizar o arquivo JS correspondente
            const jsFilePath = file.replace('.map', '');
            if (fs.existsSync(jsFilePath)) {
                try {
                    // Ler o arquivo JS
                    const jsContent = fs.readFileSync(jsFilePath, 'utf8');
                    // Remover a referência ao source map
                    const modifiedContent = jsContent.replace(/\/\/# sourceMappingURL=.*\.map/g,
                        '// sourcemap removed by build process');

                    // Escrever o arquivo modificado
                    fs.writeFileSync(jsFilePath, modifiedContent);
                    jsModifiedCount++;
                } catch (jsErr) {
                    log(`Erro ao modificar referência em ${jsFilePath}: ${jsErr.message}`, 'warning');
                }
            }
        } catch (err) {
            log(`Erro ao processar ${file}: ${err.message}`, 'error');
        }
    });

    console.log(`\n🎉 Processo concluído! ${removedCount} arquivos de source map removidos.\n`);
}

// Executar a limpeza
removeSourceMaps();
