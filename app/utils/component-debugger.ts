/**
 * Sistema de Debug para Componentes React
 * Rastreia re-renders, mudanças de props e estados
 * Apenas ativo em desenvolvimento
 */

type DebugConfig = {
    logRenders?: boolean;
    logProps?: boolean;
    logState?: boolean;
    logEffects?: boolean;
    trackReRenders?: boolean;
};

type RenderInfo = {
    timestamp: number;
    props?: any;
    reason?: string;
};

class ComponentDebugger {
    private isDevelopment = process.env.NODE_ENV === 'development';
    private renderCounts: Map<string, number> = new Map();
    private renderHistory: Map<string, RenderInfo[]> = new Map();
    private propChanges: Map<string, Map<string, any>> = new Map();

    /**
     * Registra um render do componente
     */
    logRender(
        componentName: string,
        props?: any,
        config: DebugConfig = {}
    ): void {
        if (!this.isDevelopment) return;

        const currentCount = (this.renderCounts.get(componentName) || 0) + 1;
        this.renderCounts.set(componentName, currentCount);

        if (config.logRenders) {
            console.log(
                `🔄 [${componentName}] Render #${currentCount}`,
                props && config.logProps ? { props } : ''
            );
        }

        // Armazena histórico de renders
        if (config.trackReRenders) {
            if (!this.renderHistory.has(componentName)) {
                this.renderHistory.set(componentName, []);
            }
            this.renderHistory.get(componentName)!.push({
                timestamp: Date.now(),
                props: this.shallowClone(props),
            });

            // Mantém apenas últimos 50 renders
            const history = this.renderHistory.get(componentName)!;
            if (history.length > 50) {
                history.shift();
            }
        }

        // Detecta re-renders excessivos
        if (currentCount > 10 && currentCount % 5 === 0) {
            console.warn(
                `⚠️ [${componentName}] Renderizou ${currentCount} vezes! Possível problema de performance.`
            );
        }
    }

    /**
     * Compara props antigas com novas e loga mudanças
     */
    logPropsChange(
        componentName: string,
        prevProps: any,
        nextProps: any
    ): void {
        if (!this.isDevelopment) return;

        const changes = this.findPropChanges(prevProps, nextProps);
        
        if (changes.length > 0) {
            console.group(`📝 [${componentName}] Props alteradas:`);
            changes.forEach(({ key, prev, next }) => {
                console.log(`  ${key}:`, { de: prev, para: next });
            });
            console.groupEnd();

            // Armazena mudanças
            if (!this.propChanges.has(componentName)) {
                this.propChanges.set(componentName, new Map());
            }
            changes.forEach(({ key, next }) => {
                this.propChanges.get(componentName)!.set(key, next);
            });
        }
    }

    /**
     * Loga mudanças de estado
     */
    logStateChange(
        componentName: string,
        stateName: string,
        prevValue: any,
        nextValue: any
    ): void {
        if (!this.isDevelopment) return;

        if (prevValue !== nextValue) {
            console.log(
                `🔄 [${componentName}] Estado "${stateName}" alterado:`,
                { de: prevValue, para: nextValue }
            );
        }
    }

    /**
     * Loga execução de effects
     */
    logEffect(
        componentName: string,
        effectName: string,
        dependencies?: any[]
    ): void {
        if (!this.isDevelopment) return;

        console.log(
            `⚡ [${componentName}] Effect "${effectName}" executado`,
            dependencies ? { deps: dependencies } : ''
        );
    }

    /**
     * Identifica props que causaram re-render
     */
    private findPropChanges(
        prevProps: any,
        nextProps: any
    ): Array<{ key: string; prev: any; next: any }> {
        const changes: Array<{ key: string; prev: any; next: any }> = [];

        if (!prevProps || !nextProps) return changes;

        const allKeys = new Set([
            ...Object.keys(prevProps),
            ...Object.keys(nextProps),
        ]);

        for (const key of allKeys) {
            if (prevProps[key] !== nextProps[key]) {
                changes.push({
                    key,
                    prev: prevProps[key],
                    next: nextProps[key],
                });
            }
        }

        return changes;
    }

    /**
     * Cria uma cópia rasa de um objeto
     */
    private shallowClone(obj: any): any {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return [...obj];
        return { ...obj };
    }

    /**
     * Retorna estatísticas de renders de um componente
     */
    getRenderStats(componentName: string) {
        return {
            totalRenders: this.renderCounts.get(componentName) || 0,
            history: this.renderHistory.get(componentName) || [],
            propChanges: this.propChanges.get(componentName) || new Map(),
        };
    }

    /**
     * Retorna componentes com mais re-renders
     */
    getMostRenderedComponents(limit: number = 10) {
        return Array.from(this.renderCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([name, count]) => ({ name, count }));
    }

    /**
     * Imprime relatório de debug
     */
    printReport(): void {
        if (!this.isDevelopment) return;

        console.group('🐛 Relatório de Debug');
        
        const topComponents = this.getMostRenderedComponents(5);
        
        if (topComponents.length === 0) {
            console.log('ℹ️ Nenhum componente monitorado ainda.');
        } else {
            console.log('🏆 Top 5 componentes com mais renders:');
            console.table(topComponents);
        }

        console.groupEnd();
    }

    /**
     * Limpa todos os dados de debug
     */
    clear(): void {
        this.renderCounts.clear();
        this.renderHistory.clear();
        this.propChanges.clear();
    }
}

// Singleton instance
export const componentDebugger = new ComponentDebugger();

// Expor globalmente em desenvolvimento
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).__componentDebugger = componentDebugger;
    console.log('🔧 Component Debugger disponível em: window.__componentDebugger');
}

/**
 * Hook para debug de componentes React
 */
export function useComponentDebug(
    componentName: string,
    props?: any,
    config: DebugConfig = {}
) {
    if (process.env.NODE_ENV !== 'development') {
        return {
            logRender: () => {},
            logStateChange: () => {},
            logEffect: () => {},
        };
    }

    componentDebugger.logRender(componentName, props, config);

    return {
        logRender: () => componentDebugger.logRender(componentName, props, config),
        logStateChange: (stateName: string, prevValue: any, nextValue: any) =>
            componentDebugger.logStateChange(componentName, stateName, prevValue, nextValue),
        logEffect: (effectName: string, dependencies?: any[]) =>
            componentDebugger.logEffect(componentName, effectName, dependencies),
    };
}

export default componentDebugger;
