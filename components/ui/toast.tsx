'use client';

import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                },
                duration: 5000,
            }}
            theme={theme as "light" | "dark" | "system"}
            {...props}
        />
    );
};

export { Toaster };

// Custom hook para uso do Toast
export const useToast = () => {
    const addToast = React.useCallback(({ type = 'default', title = '', message = '', duration = 5000 }) => {
        const toast = require('sonner').toast;

        if (type === 'success') {
            toast.success(title, { description: message, duration });
        } else if (type === 'error') {
            toast.error(title, { description: message, duration });
        } else if (type === 'warning') {
            toast.warning(title, { description: message, duration });
        } else {
            toast(title, { description: message, duration });
        }
    }, []);

    const ToastContainer = Toaster;

    return { addToast, ToastContainer };
};
