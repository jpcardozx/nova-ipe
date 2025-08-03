'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@/components/ui/toast';
import { NextContextProvider } from '@/lib/next-context-polyfills';

interface ClientLayoutProps {
    children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    return (
        <NextContextProvider>
            <ThemeProvider>
                {children}
                <Toaster />
            </ThemeProvider>
        </NextContextProvider>
    );
}
