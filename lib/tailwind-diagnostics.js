/**
 * Tailwind CSS + Next.js Diagnostics
 * 
 * Este módulo fornece funções de diagnóstico para avaliar a integração
 * entre Tailwind CSS e Next.js, identificando problemas comuns
 * e oferecendo sugestões de correção.
 */

// Função para verificar versões instaladas
export async function checkInstalledVersions() {
    try {
        const versions = {};

        // Verificar o Tailwind
        try {
            const tailwind = await import('tailwindcss/package.json');
            versions.tailwind = {
                version: tailwind.version,
                isV4: tailwind.version.startsWith('4'),
                path: require.resolve('tailwindcss')
            };
        } catch (e) {
            versions.tailwind = { error: e.message };
        }

        // Verificar o PostCSS
        try {
            const postcss = await import('postcss/package.json');
            versions.postcss = {
                version: postcss.version,
                path: require.resolve('postcss')
            };
        } catch (e) {
            versions.postcss = { error: e.message };
        }

        // Verificar o Autoprefixer
        try {
            const autoprefixer = await import('autoprefixer/package.json');
            versions.autoprefixer = {
                version: autoprefixer.version,
                path: require.resolve('autoprefixer')
            };
        } catch (e) {
            versions.autoprefixer = { error: e.message };
        }

        // Verificar o Next.js
        try {
            const next = await import('next/package.json');
            versions.next = {
                version: next.version,
                path: require.resolve('next')
            };
        } catch (e) {
            versions.next = { error: e.message };
        }

        return {
            success: true,
            versions
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Função para verificar configuração do Tailwind
export async function checkTailwindConfig() {
    try {
        const fs = await import('fs/promises');
        const path = await import('path');

        // Verificar se os arquivos de configuração existem
        const configFiles = {
            tailwind: './tailwind.config.js',
            postcss: './postcss.config.js',
            globals: './app/globals.css',
            next: './next.config.js'
        };

        const results = {};

        // Verificar cada arquivo
        for (const [key, filePath] of Object.entries(configFiles)) {
            try {
                const content = await fs.readFile(filePath, 'utf-8');
                const issues = [];

                // Verificar problemas específicos
                if (key === 'tailwind') {
                    if (!content.includes('content:')) {
                        issues.push('Content array não encontrado - necessário para funcionar');
                    }
                    if (content.includes('preflight: false')) {
                        issues.push('Preflight desativado - pode causar problemas de consistência');
                    }
                }

                if (key === 'postcss') {
                    if (!content.includes('tailwindcss')) {
                        issues.push('Plugin do Tailwind não encontrado');
                    }
                    if (!content.includes('autoprefixer')) {
                        issues.push('Autoprefixer não encontrado');
                    }
                }

                if (key === 'globals') {
                    const usingV4Syntax = content.includes('tailwindcss/preflight');
                    const usingOldSyntax = content.includes('@tailwind base');

                    if (usingV4Syntax && usingOldSyntax) {
                        issues.push('Mistura de sintaxes v3 e v4 - pode causar conflitos');
                    } else if (!usingV4Syntax && !usingOldSyntax) {
                        issues.push('Sem importação correta do preflight - estilos base podem estar ausentes');
                    }
                }

                results[key] = {
                    exists: true,
                    size: content.length,
                    issues: issues.length > 0 ? issues : null
                };
            } catch (e) {
                results[key] = {
                    exists: false,
                    error: e.message
                };
            }
        }

        return {
            success: true,
            results
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Função para testar se classes do Tailwind são compiladas corretamente
export function testTailwindClasses() {
    // Lista de classes a testar
    const testClasses = [
        'bg-blue-500',
        'text-red-500',
        'p-4',
        'grid',
        'flex',
        'rounded-lg',
        'shadow-md',
        'hover:bg-green-500',
        'dark:bg-gray-800',
        'sm:grid-cols-2'
    ];

    if (typeof window !== 'undefined') {
        // Cliente: testar se as classes são aplicadas visivelmente
        const results = testClasses.map(className => {
            const testElement = document.createElement('div');
            testElement.className = className;
            document.body.appendChild(testElement);

            // Obter os estilos computados
            const styles = window.getComputedStyle(testElement);
            const hasEffect = (
                styles.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
                styles.color !== 'rgb(0, 0, 0)' ||
                styles.padding !== '0px' ||
                styles.display !== 'block' ||
                styles.borderRadius !== '0px' ||
                styles.boxShadow !== 'none'
            );

            document.body.removeChild(testElement);

            return {
                class: className,
                applied: hasEffect
            };
        });

        return {
            success: true,
            environment: 'client',
            results,
            working: results.some(r => r.applied)
        };
    } else {
        // Servidor: não podemos testar visualmente
        return {
            success: true,
            environment: 'server',
            message: 'Teste visual de classes só pode ser executado no cliente'
        };
    }
}

// Exportar um objeto com todas as ferramentas de diagnóstico
export const TailwindDiagnostics = {
    checkInstalledVersions,
    checkTailwindConfig,
    testTailwindClasses
};

export default TailwindDiagnostics;
