'use client';

/**
 * Next.js 14 Dev Mode Diagnostics
 * 
 * A diagnostic tool that monitors for common Next.js errors and provides
 * detailed debug information to help resolve them.
 * 
 * This is development-only and will not affect production builds.
 */

import { useEffect, useState } from 'react';

// Types for diagnostic information
interface DiagnosticInfo {
    name: string;
    status: 'ok' | 'warning' | 'error';
    message: string;
}

export function NextDevDiagnostics() {
    const [diagnostics, setDiagnostics] = useState<DiagnosticInfo[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only run in development mode
        if (process.env.NODE_ENV !== 'development') {
            return;
        }

        // Function to collect diagnostic information
        const collectDiagnostics = () => {
            const results: DiagnosticInfo[] = [];

            // Check navigator
            if (typeof navigator !== 'undefined') {
                results.push({
                    name: 'Navigator',
                    status: navigator.userAgent ? 'ok' : 'warning',
                    message: navigator.userAgent
                        ? `UserAgent: ${navigator.userAgent.substring(0, 50)}...`
                        : 'UserAgent missing - polyfill required'
                });
            } else {
                results.push({
                    name: 'Navigator',
                    status: 'error',
                    message: 'Navigator not defined'
                });
            }

            // Check for Next.js ActionQueue context availability
            if (typeof window !== 'undefined') {
                const hasNextRouter = !!(window as any).next?.router;
                results.push({
                    name: 'Next.js Router',
                    status: hasNextRouter ? 'ok' : 'warning',
                    message: hasNextRouter
                        ? 'Router available'
                        : 'Router missing - potential ActionQueueContext issues'
                });
            }

            // Check document elements needed by dev overlay
            if (typeof document !== 'undefined') {
                const hasDocumentElement = !!document.documentElement;
                results.push({
                    name: 'Document API',
                    status: hasDocumentElement ? 'ok' : 'warning',
                    message: hasDocumentElement
                        ? 'Document elements available'
                        : 'Document elements missing - potential dev overlay issues'
                });
            }

            return results;
        };

        // Run diagnostics and update state
        setDiagnostics(collectDiagnostics());

        // Set up a keyboard shortcut (Ctrl+Alt+D) to toggle diagnostics
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.altKey && e.key === 'd') {
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Don't render anything in production or if not visible
    if (process.env.NODE_ENV !== 'development' || !isVisible) {
        return null;
    }

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '15px',
                borderRadius: '5px',
                fontSize: '12px',
                maxWidth: '400px',
                maxHeight: '80vh',
                overflow: 'auto'
            }}
        >
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Next.js Dev Diagnostics</h4>
            <p style={{ margin: '0 0 10px 0', fontSize: '10px' }}>Press Ctrl+Alt+D to hide</p>

            <div>
                {diagnostics.map((diag, i) => (
                    <div key={i} style={{ marginBottom: '8px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{diag.name}</span>
                            <span style={{
                                color: diag.status === 'ok' ? '#4caf50' : diag.status === 'warning' ? '#ff9800' : '#f44336',
                                fontWeight: 'bold'
                            }}>
                                {diag.status.toUpperCase()}
                            </span>
                        </div>
                        <div style={{ fontSize: '10px', color: '#aaa', marginTop: '4px' }}>
                            {diag.message}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NextDevDiagnostics;
