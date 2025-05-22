"use client";
import { useEffect } from "react";

export default function FontOptimizer() {
    useEffect(() => {
        // Skip if not in browser
        if (typeof window === "undefined") return;

        const root = window.document.documentElement;

        async function loadFont(family: string, url: string, weight: string) {
            if (!("FontFace" in window)) return false;

            try {
                const font = new window.FontFace(family, `url(${url})`, {
                    weight,
                    display: "swap",
                });

                const loadedFont = await font.load();
                (window.document.fonts as any).add(loadedFont);
                return true;
            } catch (error) {
                console.warn(`Failed to load font: ${family} ${weight}`, error);
                return false;
            }
        }

        async function loadAllFonts() {
            try {
                const results = await Promise.all([
                    loadFont("Roboto", "/fonts/Roboto-Regular.woff2", "400"),
                    loadFont("Roboto", "/fonts/Roboto-Medium.woff2", "500"),
                    loadFont("Playfair Display", "/fonts/PlayfairDisplay-Regular.woff2", "400"),
                    loadFont("Playfair Display", "/fonts/PlayfairDisplay-Medium.woff2", "500"),
                ]);

                if (results.some(success => success)) {
                    root.classList.add("fonts-loaded");
                }
            } catch {
                root.classList.add("fonts-loaded");
            }
        }

        if ("fonts" in window.document) {
            loadAllFonts().catch(() => {
                root.classList.add("fonts-loaded");
            });
        } else {
            root.classList.add("fonts-loaded");
        }

        const timeout = setTimeout(() => {
            if (!root.classList.contains("fonts-loaded")) {
                root.classList.add("fonts-loaded");
            }
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);

    return null;
}
