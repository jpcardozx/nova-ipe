'use client';

import { useState, useEffect } from 'react';

/**
 * Debug panel component for live performance monitoring
 * Only visible when debug mode is enabled via query param ?debug=true
 */
export function DebugPanel() {
    const [isVisible, setIsVisible] = useState(false);
    const [stats, setStats] = useState({
        fps: 0,
        memory: 0,
        loadTime: 0,
        domNodes: 0
    });

    useEffect(() => {
        // Only activate in development or when explicitly enabled
        const debugMode = new URLSearchParams(window.location.search).get('debug') === 'true';
        if (process.env.NODE_ENV !== 'development' && !debugMode) return;

        setIsVisible(true);

        let frameCount = 0;
        let lastTime = performance.now();
        let frameId: number;

        const updateStats = () => {
            const now = performance.now();
            frameCount++;

            // Update once per second
            if (now - lastTime >= 1000) {
                const memoryInfo = (performance as any).memory
                    ? Math.round(((performance as any).memory.usedJSHeapSize / 1048576))
                    : 0;

                setStats({
                    fps: Math.round(frameCount * 1000 / (now - lastTime)),
                    memory: memoryInfo,
                    loadTime: Math.round(performance.now() - performance.timeOrigin),
                    domNodes: document.querySelectorAll('*').length
                });

                frameCount = 0;
                lastTime = now;
            }

            frameId = requestAnimationFrame(updateStats);
        };

        frameId = requestAnimationFrame(updateStats);

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 z-50 bg-black/80 text-white p-2 font-mono text-xs w-full md:w-auto">
            <div className="flex flex-wrap gap-4">
                <div>FPS: <span className={stats.fps < 30 ? 'text-red-400' : 'text-green-400'}>{stats.fps}</span></div>
                {stats.memory > 0 && <div>Mem: <span>{stats.memory}MB</span></div>}
                <div>Load: <span>{stats.loadTime}ms</span></div>
                <div>DOM: <span className={stats.domNodes > 1000 ? 'text-yellow-400' : 'text-green-400'}>{stats.domNodes}</span></div>
                <button
                    onClick={() => document.documentElement.classList.toggle('debug-layout')}
                    className="px-2 py-0.5 bg-blue-700 rounded hover:bg-blue-600"
                >
                    Toggle Outlines
                </button>
            </div>
        </div>
    );
}

/**
 * Component that shows layout boundaries for visual debugging
 * Use in any component with <LayoutDebug /> to visualize its structure
 */
export function LayoutDebug() {
    return (
        <style>{`
      .debug-layout * {
        outline: 1px solid rgba(255, 0, 0, 0.2);
      }
    `}</style>
    );
}

// Add default export to fix "options.factory is not a function" webpack error
export default DebugPanel;
