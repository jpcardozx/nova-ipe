"use client";
import { useEffect } from "react";
export default function FontOptimizer() {
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (window.document && "fonts" in window.document) {
            const montserratMedium = new FontFace(
                "Montserrat",
                `url('/fonts/Montserrat-Medium.ttf') format('truetype')`,
                { weight: "500", style: "normal", display: "swap" }
            );
            const montserratBold = new FontFace(
                "Montserrat",
                `url('/fonts/Montserrat-Bold.ttf') format('truetype')`,
                { weight: "700", style: "normal", display: "swap" }
            );
            Promise.all([
                montserratMedium.load(),
                montserratBold.load()
            ]).then(loadedFonts => {
                loadedFonts.forEach(font => {
                    if (window.document.fonts) {
                        window.document.fonts.add(font);
                    }
                });
                window.document.documentElement.classList.add("fonts-loaded");
            }).catch(() => { });
        }
        // Fallback: always add fonts-loaded after 2s
        setTimeout(() => {
            if (!window.document.documentElement.classList.contains("fonts-loaded")) {
                window.document.documentElement.classList.add("fonts-loaded");
            }
        }, 2000);
    }, []);
    return null;
}
