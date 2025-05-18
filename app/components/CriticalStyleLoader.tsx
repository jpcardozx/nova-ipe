'use client';

/**
 * CriticalStyleLoader.tsx
 * 
 * Componente cliente para gerenciar o carregamento otimizado de estilos CSS
 * Resolve o problema de event handlers em Server Components
 *
 * @version 1.0.0
 * @date 18/05/2025
 */

import { useEffect } from 'react';

interface StyleLoaderProps {
    href: string;
}

export default function CriticalStyleLoader({ href }: StyleLoaderProps) {
    useEffect(() => {
        // Função para aplicar o estilo quando for carregado
        const applyStyle = () => {
            const styleSheet = document.querySelector(`link[href="${href}"]`);
            if (styleSheet) {
                (styleSheet as HTMLLinkElement).media = 'all';
            }
        };

        // Verifica se o link já existe
        const existingLink = document.querySelector(`link[href="${href}"]`);

        if (existingLink) {
            // Se já existe, apenas aplica o estilo
            applyStyle();
        } else {
            // Se não existe, cria o link e configura o evento onload
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.media = 'print'; // Começa como print para não bloquear renderização

            link.onload = applyStyle;

            // Adiciona ao head
            document.head.appendChild(link);
        }

        // Fallback para garantir que o estilo seja aplicado em todos os casos
        setTimeout(applyStyle, 2000);
    }, [href]);

    return null; // Componente não renderiza nada
}
