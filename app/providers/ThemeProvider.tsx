"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
// Fix for the import path - using direct React props instead of the package types
import { ReactNode } from "react";

// Define our own props interface to avoid import issues
interface SafeThemeProviderProps {
    children: ReactNode;
    [key: string]: any; // Allow any other props to be passed through
}

export function ThemeProvider({ children, ...props }: SafeThemeProviderProps) {
    // Enhanced wrapper with safer initialization
    return (
        <NextThemesProvider
            defaultTheme="system"
            enableSystem
            attribute="class"
            disableTransitionOnChange
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
}
