'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import ImprovedPropertiesGrid from './ImprovedPropertiesGrid';
import { useFavoriteProperties } from '../hooks/useFavoriteProperties';

/**
 * Componente que adiciona funcionalidade de favoritos ao grid de propriedades
 */
export default function FavoritesEnabledGrid(props: React.ComponentProps<typeof ImprovedPropertiesGrid>) {
    // Use o hook de favoritos
    const { toggleFavorite, isFavorite, favorites } = useFavoriteProperties();
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

    // Filtre as propriedades com base na opção de mostrar apenas favoritos
    const filteredProperties = showOnlyFavorites
        ? props.properties.filter(property => isFavorite(property.id))
        : props.properties;

    // Adicione a função de favoritos a cada propriedade
    const propertiesWithFavorites = filteredProperties.map(property => ({
        ...property,
        isFavorite: isFavorite(property.id)
    }));

    const handleFavoriteToggle = (id: string) => {
        toggleFavorite(id);
    };

    // Verificar se existem favoritos
    const hasFavorites = favorites && favorites.length > 0;

    return (
        <>
            {hasFavorites && (
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                            showOnlyFavorites
                                ? "bg-red-500 text-white"
                                : "bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:bg-red-50"
                        )}
                    >
                        <Heart className={cn("w-4 h-4", showOnlyFavorites ? "fill-white" : "")} />
                        {showOnlyFavorites ? "Mostrar todos" : "Mostrar favoritos"}
                    </button>
                </div>
            )}

            <ImprovedPropertiesGrid
                {...props}
                properties={propertiesWithFavorites}
                onFavoriteToggle={handleFavoriteToggle}
            />
        </>
    );
}
