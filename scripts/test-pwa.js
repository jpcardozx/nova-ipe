/**
 * Script para testar a implementação PWA com Lighthouse em modo CLI
 * 
 * Este script usa o Lighthouse para realizar uma auditoria completa da PWA,
 * verificando aspectos como:
 * - MIME types corretos
 * - Manifest válido
 * - Service Worker funcional
 * - Comportamento offline
 * - Instalabilidade
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Cores para console
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

// Verifica se o Lighthouse está instalado
const checkLighthouse = () => {
    return new Promise((resolve) => {
        exec('npx lighthouse --version', (error) => {
            if (error) {
                console.log(`${colors.yellow}▶ Lighthouse não encontrado. Instalando...${colors.reset}`);
                exec('npm install -g lighthouse', (installError) => {
                    if (installError) {
                        console.log(`${colors.red}✗ Falha ao instalar o Lighthouse: ${installError.message}${colors.reset}`);
                        resolve(false);
                    } else {
                        console.log(`${colors.green}✓ Lighthouse instalado com sucesso${colors.reset}`);
                        resolve(true);
                    }
                });
            } else {
                console.log(`${colors.green}✓ Lighthouse já está instalado${colors.reset}`);
                resolve(true);
            }
        });
    });
};

// Inicia o servidor Next.js em modo de produção
const startServer = () => {
    console.log(`${colors.yellow}▶ Iniciando servidor Next.js em modo de produção...${colors.reset}`);

    // Usamos spawn para manter o servidor em execução enquanto executamos os testes
    const server = exec('npm start');

    // Aguarda o servidor iniciar (detecção simplificada)
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`${colors.green}✓ Servidor Next.js iniciado na porta 3000${colors.reset}`);
            resolve(server);
        }, 5000);
    });
};

// Executa o Lighthouse
const runLighthouse = () => {
    const reportPath = path.join(process.cwd(), 'lighthouse-pwa-report.html');

    console.log(`${colors.yellow}▶ Executando auditoria Lighthouse para PWA...${colors.reset}`);
    console.log(`${colors.blue}▶ Isso pode levar alguns minutos. Por favor, aguarde...${colors.reset}`);

    return new Promise((resolve, reject) => {
        exec(`npx lighthouse http://localhost:3000 --only-categories=pwa --view --output=html --output-path=${reportPath}`,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`${colors.red}✗ Erro ao executar o Lighthouse: ${error.message}${colors.reset}`);
                    reject(error);
                } else {
                    console.log(`${colors.green}✓ Auditoria Lighthouse concluída${colors.reset}`);
                    console.log(`${colors.blue}▶ Relatório salvo em: ${reportPath}${colors.reset}`);

                    // Extrair e mostrar as principais métricas
                    const lines = stdout.split('\n');
                    const pwaScore = lines.find(line => line.includes('Progressive Web App:'));

                    if (pwaScore) {
                        console.log(`${colors.magenta}▶ ${pwaScore.trim()}${colors.reset}`);
                    }

                    resolve();
                }
            });
    });
};

// Função principal
const main = async () => {
    console.log(`${colors.blue}=====================================================${colors.reset}`);
    console.log(`${colors.blue}       TESTE DE PWA PARA NOVA IPÊ IMOBILIÁRIA        ${colors.reset}`);
    console.log(`${colors.blue}=====================================================${colors.reset}`);

    // Verificar pré-requisitos
    const hasLighthouse = await checkLighthouse();

    if (!hasLighthouse) {
        console.log(`${colors.red}✗ Não foi possível continuar sem o Lighthouse${colors.reset}`);
        return;
    }

    // Perguntar ao usuário se deseja iniciar o servidor
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(`${colors.cyan}O servidor Next.js já está rodando em http://localhost:3000? (S/n) ${colors.reset}`, async (answer) => {
        let server;

        if (answer.toLowerCase() === 'n') {
            try {
                server = await startServer();
            } catch (error) {
                console.error(`${colors.red}✗ Erro ao iniciar o servidor: ${error.message}${colors.reset}`);
                rl.close();
                return;
            }
        }

        try {
            await runLighthouse();
        } catch (error) {
            console.error(`${colors.red}✗ Falha na auditoria: ${error.message}${colors.reset}`);
        } finally {
            if (server) {
                server.kill();
                console.log(`${colors.yellow}▶ Servidor Next.js encerrado${colors.reset}`);
            }

            console.log(`${colors.blue}=====================================================${colors.reset}`);
            console.log(`${colors.green}✓ Teste de PWA concluído${colors.reset}`);
            console.log(`${colors.yellow}▶ Para resolver problemas, acesse: /diagnostico${colors.reset}`);
            rl.close();
        }
    });
};

// Executar o script
main().catch((error) => {
    console.error(`${colors.red}✗ Erro não tratado: ${error.message}${colors.reset}`);
    process.exit(1);
});
