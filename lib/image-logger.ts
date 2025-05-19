/**
 * Utility para monitoramento e logging de imagens
 * Centraliza todo o logging relacionado a imagens para diagnóstico
 * Data: Maio 2025
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface ImageLogData {
    source?: string;
    imageId?: string;
    propertyId?: string;
    url?: string;
    error?: any;
    details?: Record<string, any>;
}

/**
 * Logger especializado para diagnóstico de problemas com imagens
 */
export class ImageLogger {
    // Flag para ativar/desativar logging
    private static enabled = process.env.NODE_ENV !== 'production' || process.env.DEBUG_IMAGES === 'true';

    // Prefixo para logs
    private static readonly prefix = '[ImageLoader]';

    // Coleção de problemas para análise posterior
    private static readonly issues: Record<string, number> = {};

    /**
     * Configura o sistema de logging
     */
    static configure(options: { enabled?: boolean } = {}) {
        if (typeof options.enabled !== 'undefined') {
            this.enabled = options.enabled;
        }
    }

    /**
     * Log detalhado para problemas com imagens 
     */
    static log(level: LogLevel, message: string, data?: ImageLogData) {
        if (!this.enabled && level !== 'error') return;

        // Formatação da mensagem com prefixo
        const formattedMessage = `${this.prefix} ${message}`;

        // Contabilizar problemas por tipo
        if (level === 'warn' || level === 'error') {
            const issueType = message.split(':')[0] || 'unknown';
            this.issues[issueType] = (this.issues[issueType] || 0) + 1;
        }

        // Usar console.group para melhor organização em desenvolvimento
        if (typeof window !== 'undefined' && (level === 'warn' || level === 'error')) {
            // No cliente (browser)
            console.group(formattedMessage);

            if (data) {
                if (data.propertyId) console.log('Property ID:', data.propertyId);
                if (data.imageId) console.log('Image ID:', data.imageId);
                if (data.url) console.log('URL:', data.url);
                if (data.details) console.log('Details:', data.details);
                if (data.error) console.log('Error:', data.error);
            }

            console.groupEnd();
        } else {
            // No servidor ou log simples
            switch (level) {
                case 'debug':
                    console.debug(formattedMessage, data || '');
                    break;
                case 'info':
                    console.log(formattedMessage, data || '');
                    break;
                case 'warn':
                    console.warn(formattedMessage, data || '');
                    break;
                case 'error':
                    console.error(formattedMessage, data || '');
                    break;
            }
        }

        // Em produção, podemos enviar para serviço de monitoramento
        if (process.env.NODE_ENV === 'production' && level === 'error') {
            this.reportToMonitoring(message, data);
        }
    }

    // Aliases para diferentes níveis de log
    static debug(message: string, data?: ImageLogData) {
        this.log('debug', message, data);
    }

    static info(message: string, data?: ImageLogData) {
        this.log('info', message, data);
    }

    static warn(message: string, data?: ImageLogData) {
        this.log('warn', message, data);
    }

    static error(message: string, data?: ImageLogData) {
        this.log('error', message, data);
    }

    /**
     * Reporta para serviço de monitoramento externo
     */
    private static reportToMonitoring(message: string, data?: ImageLogData) {
        // Implementar integração com Sentry, LogRocket, etc
        try {
            // Exemplo: Sentry.captureException(...)
            // ou enviar para API própria:
            if (typeof window !== 'undefined' && 'navigator' in window) {
                const payload = JSON.stringify({
                    timestamp: new Date().toISOString(),
                    message,
                    ...data
                });
                // Usar sendBeacon para não bloquear navegação ou desmonte do componente
                if ('sendBeacon' in navigator) {
                    (navigator as any).sendBeacon('/api/log/image-error', payload);
                }
            }
        } catch (e: unknown) {
            // Não fazer nada se falhar
        }
    }

    /**
     * Obtém resumo estatístico dos problemas encontrados
     */
    static getIssuesSummary() {
        return {
            total: Object.values(this.issues).reduce((sum, count) => sum + count, 0),
            byType: { ...this.issues }
        };
    }
}

// Interface simplificada para uso em componentes
export const imageLog = {
    debug: ImageLogger.debug.bind(ImageLogger),
    info: ImageLogger.info.bind(ImageLogger),
    warn: ImageLogger.warn.bind(ImageLogger),
    error: ImageLogger.error.bind(ImageLogger)
};

// Exportar aliases para uso conveniente
export const logImageDebug = ImageLogger.debug.bind(ImageLogger);
export const logImageInfo = ImageLogger.info.bind(ImageLogger);
export const logImageWarning = ImageLogger.warn.bind(ImageLogger);
export const logImageError = ImageLogger.error.bind(ImageLogger);
