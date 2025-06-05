'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

interface ThemeContextType {
    setTheme: (theme: string) => void;
    theme: string;
}

const ThemeContext = createContext<ThemeContextType>({
    setTheme: () => { },
    theme: "light"
});

export const useTheme = () => {
    return useContext(ThemeContext);
};

interface Props extends Omit<ThemeProviderProps, 'children'> {
    children: ReactNode;
}

export function ThemeProvider({ children, ...props }: Props): JSX.Element {
    const [theme, setTheme] = useState<string>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Sync with system theme on mount
        if (typeof window !== "undefined") {
            const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(isDark ? "dark" : "light");
        }
    }, []);

    // Prevent hydration mismatch by not rendering theme-sensitive content until mounted
    if (!mounted) {
        return (
            <ThemeContext.Provider value={{ theme, setTheme }}>
                <div suppressHydrationWarning>
                    {children}
                </div>
            </ThemeContext.Provider>
        );
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <NextThemesProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                {...props}
            >
                {children}
            </NextThemesProvider>
        </ThemeContext.Provider>
    );
}
