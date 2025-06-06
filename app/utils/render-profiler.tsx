'use client';

import React, { useRef, useEffect } from 'react';

interface RenderProfilerProps {
    id: string;
    children: React.ReactNode;
    onRender?: (id: string, phase: string, actualDuration: number) => void;
}

/**
 * RenderProfiler - Component to track and optimize component render performance
 * 
 * This helps identify slow-rendering components that might be causing performance issues
 */
export function RenderProfiler({ id, children, onRender }: RenderProfilerProps) {
    // Skip in production unless explicitly enabled
    if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_PROFILER) {
        return <>{children}</>;
    }

    return (
        <React.Profiler
            id={id}
            onRender={(
                id,
                phase,
                actualDuration,
                baseDuration,
                startTime,
                commitTime
            ) => {
                // Only log slow renders (> 16ms)
                if (actualDuration > 16) {
                    console.warn(`[Performance] Slow render: ${id} (${Math.round(actualDuration)}ms)`);
                }

                if (onRender) {
                    onRender(id, phase, actualDuration);
                }
            }}
        >
            {children}
        </React.Profiler>
    );
}

/**
 * useRenderTracking - Hook to track component render performance
 * 
 * Helps identify components that render too frequently or take too long to render
 */
export function useRenderTracking(componentName: string) {
    const renderCount = useRef(0);
    const lastRenderTime = useRef(performance.now());
    const enabled = process.env.NODE_ENV !== 'production' || process.env.ENABLE_PROFILER;

    useEffect(() => {
        if (!enabled) return;

        const now = performance.now();
        const timeSinceLastRender = now - lastRenderTime.current;
        renderCount.current += 1;

        // Log every 5th render or if renders are happening too frequently
        if (renderCount.current % 5 === 0 || timeSinceLastRender < 100) {
            console.log(
                `[Render Tracking] ${componentName} rendered ${renderCount.current} times. ` +
                `Last render: ${Math.round(timeSinceLastRender)}ms ago`
            );
        }

        lastRenderTime.current = now;
    }, [componentName, enabled]); // Add componentName and enabled as dependencies since they're used in the effect
}
