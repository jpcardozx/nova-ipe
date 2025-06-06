/**
 * Wrapper seguro para o servidor dos diagnósticos do Tailwind CSS
 * 
 * Este arquivo garante que as funções que dependem de módulos Node.js
 * só sejam executadas no ambiente do servidor.
 */

// Importação dinâmica para evitar bundling no cliente
import { draftMode } from 'next/headers';

// Tipos importados do módulo de diagnósticos
import type {
    // Prefixado com _ para seguir convenções de variáveis não utilizadas
    TailwindVersionsResult as DiagnosticVersionsResult,
    TailwindEnvironmentInfo
} from './tailwind-diagnostics';

// Tipos de retorno expostos para clientes
export interface TailwindVersionInfo {
    version?: string;
    isV4?: boolean;
    path?: string;
    error?: string;
}

export interface TailwindVersionsResult {
    success: boolean;
    versions?: {
        tailwind?: TailwindVersionInfo;
        postcss?: TailwindVersionInfo;
        autoprefixer?: TailwindVersionInfo;
        next?: TailwindVersionInfo;
    };
    error?: string;
}

export interface TailwindConfigInfo {
    exists: boolean;
    content?: string;
    issues?: string[];
    error?: string;
}

export interface TailwindConfigResult {
    success: boolean;
    results?: Record<string, TailwindConfigInfo>;
    environment?: TailwindEnvironmentInfo;
    error?: string;
}

export interface TailwindTestResult {
    success: boolean;
    results?: unknown;
    error?: string;
}

/**
 * Converte o formato interno de versões para o formato exposto para clientes
 */
function formatVersionsForClient(result: DiagnosticVersionsResult): TailwindVersionsResult {
    if (!result.success) {
        return {
            success: false,
            error: result.error || "Erro desconhecido ao verificar versões"
        };
    }

    // Mapear versões para o formato do cliente
    const clientVersions: TailwindVersionsResult['versions'] = {};

    for (const version of result.versions) {
        if (version.name === 'tailwindcss') {
            clientVersions.tailwind = {
                version: version.version,
                isV4: version.isV4,
                path: version.path,
                error: version.error
            };
        } else if (version.name === 'postcss') {
            clientVersions.postcss = {
                version: version.version,
                path: version.path,
                error: version.error
            };
        } else if (version.name === 'autoprefixer') {
            clientVersions.autoprefixer = {
                version: version.version,
                path: version.path,
                error: version.error
            };
        } else if (version.name === 'next') {
            clientVersions.next = {
                version: version.version,
                path: version.path,
                error: version.error
            };
        }
    }

    return {
        success: true,
        versions: clientVersions
    };
}

/**
 * Verifica versões instaladas dos pacotes relacionados ao Tailwind
 * Esta função só deve ser executada no servidor
 */
export async function checkInstalledVersions(): Promise<TailwindVersionsResult> {
    // Verificar se estamos no servidor
    try {
        // Isso falhará no cliente, mas funcionará no servidor
        draftMode();

        // Importação dinâmica para evitar bundling no cliente
        const { checkInstalledVersions: serverCheck } = await import('./tailwind-diagnostics');
        const result = await serverCheck();

        // Converter para o formato do cliente
        return formatVersionsForClient(result);
    } catch (_error) {
        // Se não conseguirmos importar ou ocorrer um erro, provavelmente estamos no cliente
        return {
            success: false,
            error: "Esta função só pode ser executada no servidor"
        };
    }
}

/**
 * Verifica a configuração do Tailwind
 * Esta função só deve ser executada no servidor
 */
export async function checkTailwindConfig(): Promise<TailwindConfigResult> {
    // Verificar se estamos no servidor
    try {
        // Isso falhará no cliente, mas funcionará no servidor
        draftMode();

        // Importação dinâmica para evitar bundling no cliente
        const { checkTailwindConfig: serverCheck } = await import('./tailwind-diagnostics');
        const result = await serverCheck();        // Converter para o formato do cliente
        return {
            success: result.success,
            results: result.results as Record<string, TailwindConfigInfo>,
            environment: result.environment
        };
    } catch (_error) {
        // Se não conseguirmos importar ou ocorrer um erro, provavelmente estamos no cliente
        return {
            success: false,
            error: "Esta função só pode ser executada no servidor"
        };
    }
}

/**
 * Testa classes do Tailwind
 * Esta função pode ser executada no cliente ou no servidor
 */
export async function testTailwindClasses(): Promise<TailwindTestResult> {
    // Isso é seguro para o cliente
    return {
        success: true,
        results: {
            message: "Teste de classes visual disponível no cliente"
        }
    };
}
