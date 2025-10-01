/**
 * Hook para gerenciar favoritos de forma persistente
 * Armazena no localStorage e sincroniza estado
 */

'use client';

import { useState, useEffect } from 'react';

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Carrega favoritos do localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        try {
            const saved = localStorage.getItem('nova-ipe-favorites');
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        } catch (error) {
            console.warn('Erro ao carregar favoritos:', error);
        }
        setIsLoaded(true);
    }, []);

    // Salva favoritos no localStorage
    useEffect(() => {
        if (typeof window === 'undefined' || !isLoaded) return;
        
        try {
            localStorage.setItem('nova-ipe-favorites', JSON.stringify(favorites));
        } catch (error) {
            console.warn('Erro ao salvar favoritos:', error);
        }
    }, [favorites, isLoaded]);

    const toggleFavorite = (propertyId: string) => {
        setFavorites(prev => 
            prev.includes(propertyId) 
                ? prev.filter(id => id !== propertyId)
                : [...prev, propertyId]
        );
    };

    const isFavorite = (propertyId: string) => favorites.includes(propertyId);

    const clearFavorites = () => setFavorites([]);

    return {
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        isLoaded
    };
}