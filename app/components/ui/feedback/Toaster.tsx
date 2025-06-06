'use client';

import * as React from 'react';
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
    type ToastProps,
} from './Toast';

// Simple toast context without external dependencies
type ToastActionType = {
    altText?: string;
    onClick: () => void;
    label: string;
};

export interface ToasterToast extends Pick<ToastProps, 'id' | 'variant' | 'className'> {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionType;
    duration?: number;
    dismissible?: boolean;
    icon?: React.ReactNode;
}

// Simplified toast implementation for the build to succeed
const ToastContext = React.createContext<{
    toasts: ToasterToast[];
}>({
    toasts: [],
});

export function useToast() {
    return React.useContext(ToastContext);
}

export function Toaster() {
    // Return empty toast provider for now
    return (
        <ToastProvider>
            {/* We'll render toasts here when the full implementation is ready */}
            <ToastViewport />
        </ToastProvider>
    );
}
