// Utilitário para carregamento otimizado de recursos

/**
 * Interface para configuração de carregamento de recursos
 */
interface ResourceConfig {
    path: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    type: 'script' | 'style' | 'image' | 'font';
}

// Manter track dos recursos carregados
const loadedResources = new Set<string>();

/**
 * Carrega um recurso de forma otimizada, respeitando prioridades
 */
export function loadResource(config: ResourceConfig): Promise<void> {
    // Se já foi carregado, retorna imediatamente
    if (loadedResources.has(config.path)) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        try {
            switch (config.type) {
                case 'script':
                    loadScript(config, resolve);
                    break;
                case 'style':
                    loadStyle(config, resolve);
                    break;
                case 'image':
                    loadImage(config, resolve);
                    break;
                case 'font':
                    loadFont(config, resolve);
                    break;
                default:
                    resolve();
            }
        } catch (err) {
            console.error(`Error loading resource ${config.path}:`, err);
            reject(err);
        }
    });
}

/**
 * Carrega um script com a prioridade correta
 */
function loadScript(config: ResourceConfig, callback: () => void): void {
    const script = document.createElement('script');
    script.src = config.path;

    // Definir prioridades
    if (config.priority === 'critical') {
        script.setAttribute('fetchpriority', 'high');
        script.setAttribute('async', 'false');
    } else {
        script.setAttribute('async', 'true');
        script.defer = config.priority === 'low';
    }

    script.onload = () => {
        loadedResources.add(config.path);
        callback();
    };

    document.head.appendChild(script);
}

/**
 * Carrega uma folha de estilo com a prioridade correta
 */
function loadStyle(config: ResourceConfig, callback: () => void): void {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = config.path;

    if (config.priority === 'critical') {
        link.setAttribute('fetchpriority', 'high');
    }

    link.onload = () => {
        loadedResources.add(config.path);
        callback();
    };

    document.head.appendChild(link);
}

/**
 * Pré-carrega uma imagem com a prioridade correta
 */
function loadImage(config: ResourceConfig, callback: () => void): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = config.path;

    if (config.priority === 'critical') {
        link.setAttribute('fetchpriority', 'high');
    }

    link.onload = () => {
        loadedResources.add(config.path);
        callback();
    };

    document.head.appendChild(link);
}

/**
 * Carrega uma fonte com a prioridade correta
 */
function loadFont(config: ResourceConfig, callback: () => void): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = config.path;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';

    link.onload = () => {
        // Após preload, carregar a fonte normalmente
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'CustomFont';
                src: url(${config.path}) format('woff2');
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
        loadedResources.add(config.path);
        callback();
    };

    document.head.appendChild(link);
}
