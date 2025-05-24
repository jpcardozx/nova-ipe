// app/manifest.ts
import { MetadataRoute } from "next";

/**
 * Web App Manifest para suporte PWA (Progressive Web App)
 * 
 * Esta configuração permite que o site seja instalado como um app
 * e funcione offline, melhorando significativamente a experiência do usuário
 * e a performance percebida.
 */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Nova IPE - Imobiliária",
        short_name: "Nova IPE",
        description: "Encontre imóveis para comprar ou alugar em Guararema e região",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#13854E",
        categories: ["real estate", "business"],
        icons: [
            {
                src: "/icons/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "/icons/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "/icons/icon-maskable-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable"
            },
            {
                src: "/icons/icon-maskable-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable"
            }
        ],
        screenshots: [
            {
                src: "/screenshots/home-screenshot.png",
                type: "image/png",
                sizes: "1080x1920"
            },
            {
                src: "/screenshots/property-screenshot.png",
                type: "image/png",
                sizes: "1920x1080"
            }
        ],
        orientation: "portrait",
        prefer_related_applications: false,
    };
}
