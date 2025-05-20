/**
 * lib/tailwind-diagnostics.ts
 * 
 * Utilitários para diagnóstico do Tailwind CSS
 * Funções para verificar a instalação, a configuração e testar
 * a funcionalidade do Tailwind CSS
 *
 * @version 1.0.0
 * @date 18/05/2025
 */

// Interfaces de tipos para os resultados de diagnóstico
export interface TailwindVersion {
    name: string;
    version: string;
    expected: string;
    compatible: boolean;
    path?: string;
    error?: string;
    isV4?: boolean;
}

export interface TailwindVersionsResult {
    success: boolean;
    versions: TailwindVersion[];
    message?: string;
    error?: string;
}

export interface TailwindConfigInfo {
    key: string;
    value: string | number | boolean | object;
    status: 'ok' | 'warning' | 'error';
    message?: string;
    exists?: boolean;
    size?: number;
    issues?: string[];
}

export interface TailwindConfigResult {
    success: boolean;
    message?: string;
    error?: string;
    results: Record<string, TailwindConfigInfo>;
}

export interface TailwindEnvironmentInfo {
    working: boolean;
    nextVersion: string;
    nodeVersion: string;
    mode: 'development' | 'production';
}

export interface ClassTestResult {
    className: string;
    rendered: boolean;
    expected: string;
    actual: string;
    match: boolean;
    cssProperty: string;
}

export interface TailwindTestResult {
    success: boolean;
    classesFound: number;
    classesTotal: number;
    failedClasses: ClassTestResult[];
    working?: boolean;
    environment?: string;
    message?: string;
    results?: Array<{
        class: string;
        applied: boolean;
    }>;
}

// Funções de diagnóstico
export async function checkInstalledVersions(): Promise<TailwindVersionsResult> {
    try {
        // Esta implementação seria substituída por código real
        // que verificaria as versões instaladas
        const mockVersions: TailwindVersion[] = [
            {
                name: 'tailwindcss',
                version: '3.3.2',
                expected: '>=3.0.0',
                compatible: true
            },
            {
                name: 'postcss',
                version: '8.4.24',
                expected: '>=8.0.0',
                compatible: true
            },
            {
                name: 'autoprefixer',
                version: '10.4.14',
                expected: '>=10.0.0',
                compatible: true
            }
        ];

        return {
            success: true,
            versions: mockVersions
        };
    } catch (error) {
        return {
            success: false,
            versions: [],
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        };
    }
}

export async function checkTailwindConfig(): Promise<{
    success: boolean;
    results: Record<string, TailwindConfigInfo>;
    environment: TailwindEnvironmentInfo;
}> {
    try {
        // Simulação de verificação da configuração
        const configResults: Record<string, TailwindConfigInfo> = {
            'content': {
                key: 'content',
                value: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
                status: 'ok'
            },
            'theme': {
                key: 'theme',
                value: {
                    extend: {
                        colors: {
                            primary: {
                                '50': '#f0fdfa',
                                '500': '#14b8a6'
                            }
                        }
                    }
                },
                status: 'ok'
            },
            'plugins': {
                key: 'plugins',
                value: ['@tailwindcss/forms', '@tailwindcss/typography'],
                status: 'ok'
            }
        };

        const environment: TailwindEnvironmentInfo = {
            working: true,
            nextVersion: '13.4.19',
            nodeVersion: '18.17.1',
            mode: 'development'
        };

        return {
            success: true,
            results: configResults,
            environment
        };
    } catch (_error) {
        return {
            success: false,
            results: {},
            environment: {
                working: false,
                nextVersion: 'unknown',
                nodeVersion: 'unknown',
                mode: 'development'
            }
        };
    }
}

export async function testTailwindClasses(): Promise<TailwindTestResult> {
    try {
        // Simulação de testes de classes
        const failedClasses: ClassTestResult[] = [];        // Em uma implementação real, estas classes seriam realmente testadas
        // aplicando-as a elementos e verificando os estilos calculados
        const passedClassCount: number = 42;
        const totalClassCount: number = 45;

        // Exemplo de falhas
        failedClasses.push({
            className: 'custom-bg-primary',
            rendered: false,
            expected: 'rgb(20, 184, 166)',
            actual: '',
            match: false,
            cssProperty: 'backgroundColor'
        }); return {
            success: passedClassCount === totalClassCount,
            classesFound: passedClassCount,
            classesTotal: totalClassCount,
            failedClasses,
            working: passedClassCount > 0,
            results: [
                { class: 'bg-blue-500', applied: true },
                { class: 'text-white', applied: true },
                { class: 'p-4', applied: true }
            ]
        };
    } catch (_error) {
        return {
            success: false,
            classesFound: 0,
            classesTotal: 0,
            failedClasses: []
        };
    }
}
