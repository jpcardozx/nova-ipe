'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'nova-ipe-favorite-properties';

/**
 * Custom hook para gerenciar imóveis favoritos do usuário
 * com persistência no localStorage
 */
export function useFavoriteProperties() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Carregar favoritos do localStorage na inicialização
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const storedFavorites = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Salvar favoritos no localStorage quando mudarem
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (isLoaded) {
            try {
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
                }
            } catch (error) {
                console.error('Erro ao salvar favoritos:', error);
            }
        }
    }, [favorites, isLoaded]);

    /**
     * Adiciona ou remove um imóvel dos favoritos
     * @param propertyId ID do imóvel
     */
    const toggleFavorite = (propertyId: string) => {
        setFavorites(prev => {
            if (prev.includes(propertyId)) {
                return prev.filter(id => id !== propertyId);
            } else {
                return [...prev, propertyId];
            }
        });
    };

    /**
     * Verifica se um imóvel está nos favoritos
     * @param propertyId ID do imóvel
     */
    const isFavorite = (propertyId: string) => {
        return favorites.includes(propertyId);
    };

    /**
     * Remove todos os favoritos
     */
    const clearFavorites = () => {
        setFavorites([]);
    };

    return {
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        isLoaded
    };
}
