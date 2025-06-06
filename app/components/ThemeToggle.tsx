"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 dark:bg-black/10 dark:border-white/10">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary-300 to-primary-500 animate-pulse" />
            </div>
        );
    }

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
        } else if (theme === "dark") {
            setTheme("system");
        } else {
            setTheme("light");
        }
    };

    const getIcon = () => {
        switch (theme) {
            case "light":
                return <Sun className="h-5 w-5 text-amber-500" />;
            case "dark":
                return <Moon className="h-5 w-5 text-blue-400" />;
            default:
                return <Monitor className="h-5 w-5 text-gray-500" />;
        }
    };

    const getTooltip = () => {
        switch (theme) {
            case "light":
                return "Switch to dark mode";
            case "dark":
                return "Switch to system mode";
            default:
                return "Switch to light mode";
        }
    };

    return (
        <button
            onClick={toggleTheme}
            title={getTooltip()}
            className="group relative flex items-center justify-center w-10 h-10 rounded-lg 
                 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 
                 dark:bg-black/10 dark:hover:bg-black/20 dark:border-white/10
                 transition-all duration-300 ease-out
                 hover:scale-105 active:scale-95
                 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label={getTooltip()}
        >
            <div className="transition-transform duration-300 ease-out group-hover:rotate-12">
                {getIcon()}
            </div>

            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-400/20 to-primary-600/20 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

            {/* Theme indicator dots */}
            <div className="absolute -bottom-1 -right-1 flex space-x-0.5">
                <div className={`w-1 h-1 rounded-full transition-all duration-200 ${theme === "light" ? "bg-amber-400" : "bg-gray-300/30"
                    }`} />
                <div className={`w-1 h-1 rounded-full transition-all duration-200 ${theme === "dark" ? "bg-blue-400" : "bg-gray-300/30"
                    }`} />
                <div className={`w-1 h-1 rounded-full transition-all duration-200 ${theme === "system" ? "bg-gray-400" : "bg-gray-300/30"
                    }`} />
            </div>
        </button>
    );
}
