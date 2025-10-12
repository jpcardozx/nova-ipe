/**
 * Hooks Customizados para Monitoramento de Performance
 * Use estes hooks dentro de componentes existentes para adicionar monitoring
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { monitorComponent } from '../utils/performance-monitor';
import { componentDebugger } from '../utils/component-debugger';

/**
 * Hook para monitorar renders de um componente
 * Adicione no topo do seu componente: useRenderMonitor('NomeDoComponente')
 */
export function useRenderMonitor(componentName: string, props?: any) {
    const renderCount = useRef(0);
    const mountTime = useRef(0);
    
    useEffect(() => {
        mountTime.current = performance.now();
        renderCount.current = 0;
    }, []);

    useEffect(() => {
        renderCount.current++;
        const startTime = performance.now();
        const renderType = renderCount.current === 1 ? 'mount' : 'update';

        // Cleanup para medir o tempo de render
        requestAnimationFrame(() => {
            const renderTime = performance.now() - startTime;
            
            if (process.env.NODE_ENV === 'development') {
                monitorComponent(componentName, startTime, renderType);
                
                if (renderTime > 50) {
                    console.warn(
                        `⚠️ ${componentName} render lento: ${renderTime.toFixed(2)}ms`,
                        renderType === 'mount' ? '(Mount)' : '(Update #' + renderCount.current + ')'
                    );
                }
            }
        });
    });

    return {
        renderCount: renderCount.current,
        timeSinceMount: mountTime.current ? performance.now() - mountTime.current : 0,
    };
}

/**
 * Hook para monitorar mudanças de state
 * Use: const [state, setState] = useMonitoredState(initialValue, 'stateName', 'ComponentName')
 */
export function useMonitoredState<T>(
    initialValue: T,
    stateName: string,
    componentName: string
): [T, (value: T | ((prev: T) => T)) => void] {
    const [state, setStateInternal] = useState<T>(initialValue);
    const prevStateRef = useRef<T>(initialValue);

    const setState = useCallback(
        (value: T | ((prev: T) => T)) => {
            setStateInternal((prevState) => {
                const newState = typeof value === 'function' 
                    ? (value as (prev: T) => T)(prevState) 
                    : value;

                if (process.env.NODE_ENV === 'development' && prevState !== newState) {
                    componentDebugger.logStateChange(
                        componentName,
                        stateName,
                        prevState,
                        newState
                    );
                }

                prevStateRef.current = newState;
                return newState;
            });
        },
        [componentName, stateName]
    );

    return [state, setState];
}

/**
 * Hook para monitorar effects
 * Use no lugar de useEffect quando quiser ver quando effects são executados
 */
export function useMonitoredEffect(
    effect: () => void | (() => void),
    deps: any[],
    effectName: string,
    componentName: string
) {
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            componentDebugger.logEffect(componentName, effectName, deps);
        }

        return effect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

/**
 * Hook para medir tempo de operações assíncronas
 * const measureAsync = useAsyncPerformance('ComponentName');
 * await measureAsync('fetchData', async () => { ... });
 */
export function useAsyncPerformance(componentName: string) {
    return useCallback(
        async <T,>(operationName: string, operation: () => Promise<T>): Promise<T> => {
            const startTime = performance.now();
            
            try {
                const result = await operation();
                const duration = performance.now() - startTime;

                if (process.env.NODE_ENV === 'development') {
                    console.log(
                        `⏱️ [${componentName}] ${operationName}: ${duration.toFixed(2)}ms`
                    );

                    if (duration > 1000) {
                        console.warn(
                            `⚠️ [${componentName}] Operação lenta: ${operationName} (${duration.toFixed(0)}ms)`
                        );
                    }
                }

                return result;
            } catch (error) {
                const duration = performance.now() - startTime;
                console.error(
                    `❌ [${componentName}] ${operationName} falhou após ${duration.toFixed(2)}ms:`,
                    error
                );
                throw error;
            }
        },
        [componentName]
    );
}

/**
 * Hook para detectar re-renders desnecessários
 * Compara props/state anteriores e mostra o que mudou
 */
export function useWhyDidYouUpdate(name: string, props: any) {
    const previousProps = useRef<any>();

    useEffect(() => {
        if (previousProps.current) {
            const allKeys = Object.keys({ ...previousProps.current, ...props });
            const changedProps: any = {};

            allKeys.forEach((key) => {
                if (previousProps.current[key] !== props[key]) {
                    changedProps[key] = {
                        from: previousProps.current[key],
                        to: props[key],
                    };
                }
            });

            if (Object.keys(changedProps).length > 0 && process.env.NODE_ENV === 'development') {
                console.log('[why-did-you-update]', name, changedProps);
            }
        }

        previousProps.current = props;
    });
}

/**
 * Hook para análise de performance de renderização
 * Retorna métricas detalhadas sobre o componente
 */
export function usePerformanceAnalysis(componentName: string) {
    const renderTimes = useRef<number[]>([]);
    const renderCount = useRef(0);

    useEffect(() => {
        const startTime = performance.now();
        renderCount.current++;

        return () => {
            const renderTime = performance.now() - startTime;
            renderTimes.current.push(renderTime);

            // Mantém apenas últimos 20 renders
            if (renderTimes.current.length > 20) {
                renderTimes.current.shift();
            }
        };
    });

    const getAnalysis = useCallback(() => {
        if (renderTimes.current.length === 0) return null;

        const times = renderTimes.current;
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        const max = Math.max(...times);
        const min = Math.min(...times);

        return {
            componentName,
            totalRenders: renderCount.current,
            averageTime: avg,
            maxTime: max,
            minTime: min,
            recentTimes: times.slice(-5),
        };
    }, [componentName]);

    return { getAnalysis, renderCount: renderCount.current };
}

/**
 * Hook para marcar seções de código (profiling)
 */
export function usePerformanceMark() {
    return useCallback((markName: string) => {
        if (typeof window !== 'undefined' && window.performance) {
            performance.mark(markName);
        }
    }, []);
}

/**
 * Hook para medir entre duas marcas
 */
export function usePerformanceMeasure() {
    return useCallback((measureName: string, startMark: string, endMark: string) => {
        if (typeof window !== 'undefined' && window.performance) {
            try {
                performance.measure(measureName, startMark, endMark);
                const measure = performance.getEntriesByName(measureName)[0];
                
                if (process.env.NODE_ENV === 'development') {
                    console.log(
                        `📏 [Performance Measure] ${measureName}: ${measure.duration.toFixed(2)}ms`
                    );
                }

                return measure.duration;
            } catch (e) {
                console.error('Error measuring performance:', e);
                return null;
            }
        }
        return null;
    }, []);
}

export default {
    useRenderMonitor,
    useMonitoredState,
    useMonitoredEffect,
    useAsyncPerformance,
    useWhyDidYouUpdate,
    usePerformanceAnalysis,
    usePerformanceMark,
    usePerformanceMeasure,
};
