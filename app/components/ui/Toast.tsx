'use client';

import React from 'react';

// Simple toast hook implementation
export const useToast = () => {
    const addToast = React.useCallback(({
        type = 'default',
        title = '',
        message = '',
        duration = 5000
    }: {
        type?: 'default' | 'success' | 'error' | 'warning';
        title?: string;
        message?: string;
        duration?: number;
    }) => {
        // Simplified toast implementation
        console.log(`Toast: ${type} - ${title} - ${message}`);
        // In a real app, this would show a toast notification
    }, []);

    // Adiciona um componente ToastContainer vazio para compatibilidade
    const ToastContainer = React.useMemo(() => () => <div id="toast-container" />, []);

    return { addToast, ToastContainer };
};

// Export Toaster component for compatibility
export const Toaster = () => {
    return <div id="toast-container" />;
};

export default { useToast, Toaster };