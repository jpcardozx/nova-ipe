/**
 * HOC (Higher Order Component) para Monitoramento de Performance
 * Envolve componentes para tracking automático sem modificar código existente
 */

import { ComponentType, useEffect, useRef, memo } from 'react';
import { monitorComponent } from './performance-monitor';
import { componentDebugger } from './component-debugger';

interface MonitorConfig {
    trackPerformance?: boolean;
    trackRenders?: boolean;
    trackProps?: boolean;
    warnThreshold?: number; // ms
}

const DEFAULT_CONFIG: MonitorConfig = {
    trackPerformance: true,
    trackRenders: true,
    trackProps: false,
    warnThreshold: 50,
};

/**
 * HOC que adiciona monitoramento de performance a qualquer componente
 * Uso: export default withPerformanceMonitor(MeuComponente, { config })
 */
export function withPerformanceMonitor<P extends object>(
    Component: ComponentType<P>,
    config: MonitorConfig = {}
) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    const componentName = Component.displayName || Component.name || 'UnknownComponent';

    const MonitoredComponent = (props: P) => {
        const renderCount = useRef(0);
        const mountTime = useRef<number>(0);
        const prevPropsRef = useRef<P>(props);

        // Track mount
        useEffect(() => {
            mountTime.current = performance.now();
            renderCount.current = 0;

            if (finalConfig.trackPerformance) {
                const startTime = performance.now();
                return () => {
                    // Track unmount
                    monitorComponent(componentName, startTime, 'unmount');
                };
            }
        }, []);

        // Track renders
        useEffect(() => {
            renderCount.current++;

            const renderType = renderCount.current === 1 ? 'mount' : 'update';
            const startTime = performance.now();

            if (finalConfig.trackPerformance) {
                // Calculate props size if tracking props
                const propsSize = finalConfig.trackProps 
                    ? JSON.stringify(props).length 
                    : undefined;

                monitorComponent(componentName, startTime, renderType, propsSize);
            }

            if (finalConfig.trackRenders) {
                componentDebugger.logRender(componentName, props, {
                    logRenders: process.env.NODE_ENV === 'development',
                    trackReRenders: true,
                });
            }

            if (finalConfig.trackProps && renderCount.current > 1) {
                componentDebugger.logPropsChange(
                    componentName,
                    prevPropsRef.current,
                    props
                );
            }

            prevPropsRef.current = props;
        });

        return <Component {...props} />;
    };

    MonitoredComponent.displayName = `withPerformanceMonitor(${componentName})`;

    // Use memo to prevent unnecessary re-renders
    return memo(MonitoredComponent);
}

/**
 * HOC simplificado apenas para tracking de performance
 */
export function withPerformanceTracking<P extends object>(
    Component: ComponentType<P>
) {
    return withPerformanceMonitor(Component, {
        trackPerformance: true,
        trackRenders: false,
        trackProps: false,
    });
}

/**
 * HOC para debug completo (apenas em desenvolvimento)
 */
export function withDebug<P extends object>(
    Component: ComponentType<P>
) {
    if (process.env.NODE_ENV !== 'development') {
        return Component;
    }

    return withPerformanceMonitor(Component, {
        trackPerformance: true,
        trackRenders: true,
        trackProps: true,
    });
}

export default withPerformanceMonitor;
