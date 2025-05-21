'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useContext, ReactNode, memo } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

// Lazy load do componente SentryInit com tratamento de erro
const SentryInitClient = dynamic(
    () => import('../../instrumentation-client')
        .then(mod => ({ default: mod.SentryInit }))
        .catch(err => {
            console.warn('Failed to load Sentry initialization:', err);
            return { default: () => null };
        }),
    { ssr: false, loading: () => null }
);

// Dynamic import for debug tools com tratamento de erro
const DebugPanelClient = dynamic(
    () => import('./debug-tools')
        .then(mod => ({ default: mod.DebugPanel }))
        .catch(err => {
            console.warn('Failed to load debug panel:', err);
            return { default: () => null };
        }),
    { ssr: false, loading: () => null }
);

export function ClientOnly({ children }: { children: React.ReactNode }) {
    // Usando React.ErrorBoundary para capturar erros em componentes filhos
    return (
        <React.Suspense fallback={null}>
            <ErrorBoundary>
                <SentryInitClient />
                {process.env.NODE_ENV === 'development' ? <DebugPanelClient /> : null}
                {children}
            </ErrorBoundary>
        </React.Suspense>
    );
}

// Componente de boundary de erro para garantir que falhas não quebrem toda a UI
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        console.error('Client component error:', error);
    }

    render() {
        if (this.state.hasError) {
            return null; // Falhar silenciosamente para não travar a UI
        }

        return this.props.children;
    }
}

// Tipo básico para propriedades no formato esperado pelos componentes de UI
interface PropertyData {
    id: string;
    title: string;
    slug: string;
    location: string;
    city?: string;
    price: number;
    propertyType: 'rent' | 'sale';
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    mainImage: {
        url: string;
        alt: string;
    };
    isNew?: boolean;
    isHighlight?: boolean;
    isPremium?: boolean;
    status?: 'available' | 'sold' | 'rented' | 'pending';
}

// Criando contexto para propriedades
interface PropertiesContextType {
    destaques: PropertyData[];
    aluguel: PropertyData[];
    favoritos: string[];
    addFavorito: (id: string) => void;
    removeFavorito: (id: string) => void;
    isFavorito: (id: string) => boolean;
}

const PropertiesContext = createContext<PropertiesContextType>({
    destaques: [],
    aluguel: [],
    favoritos: [],
    addFavorito: () => { },
    removeFavorito: () => { },
    isFavorito: () => false,
});

export function useProperties() {
    return useContext(PropertiesContext);
}

interface ClientSidePropertiesProviderProps {
    destaques: PropertyData[];
    aluguel: PropertyData[];
    children?: ReactNode;
}

// Provider de propriedades para o lado do cliente
export default function ClientSidePropertiesProvider({
    destaques = [],
    aluguel = [],
    children,
}: ClientSidePropertiesProviderProps) {
    // Estado para favoritos (persistido no localStorage)
    const [favoritos, setFavoritos] = React.useState<string[]>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                const saved = window.localStorage.getItem('favoritos-imoveis');
                return saved ? JSON.parse(saved) : [];
            } catch (e) {
                console.error('Erro ao carregar favoritos:', e);
                return [];
            }
        }
        return [];
    });

    // Manipulação de favoritos
    const addFavorito = React.useCallback((id: string) => {
        setFavoritos((prev) => {
            const updated = [...prev, id];
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem('favoritos-imoveis', JSON.stringify(updated));
            }
            return updated;
        });
    }, []);

    const removeFavorito = React.useCallback((id: string) => {
        setFavoritos((prev) => {
            const updated = prev.filter((favId) => favId !== id);
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem('favoritos-imoveis', JSON.stringify(updated));
            }
            return updated;
        });
    }, []);

    const isFavorito = React.useCallback(
        (id: string) => favoritos.includes(id),
        [favoritos]
    );

    // Memorizar o valor do contexto para evitar renderizações desnecessárias
    const contextValue = React.useMemo(
        () => ({
            destaques,
            aluguel,
            favoritos,
            addFavorito,
            removeFavorito,
            isFavorito,
        }),
        [destaques, aluguel, favoritos, addFavorito, removeFavorito, isFavorito]
    );

    return (
        <PropertiesContext.Provider value={contextValue}>
            {children}
        </PropertiesContext.Provider>
    );
}

// Componente otimizado para exibir estado de filtros
export const FilterTagsDisplay = memo(
    ({ filters }: { filters: Record<string, any> }) => {
        // Verificar se há filtros ativos
        const hasActiveFilters = Object.values(filters).some(
            (v) => v !== undefined && v !== '' && v !== false
        );

        if (!hasActiveFilters) return null;

        return (
            <div className="flex flex-wrap gap-2 mt-4 animate-fade-in">
                {Object.entries(filters).map(
                    ([key, value]) =>
                        value !== undefined &&
                        value !== '' &&
                        value !== false && (
                            <div
                                key={key}
                                className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full 
                           text-sm font-medium flex items-center gap-1.5"
                            >
                                <span>
                                    {key === 'minPrice'
                                        ? `Mín: R$ ${Number(value).toLocaleString('pt-BR')}`
                                        : key === 'maxPrice'
                                            ? `Máx: R$ ${Number(value).toLocaleString('pt-BR')}`
                                            : key === 'propertyType'
                                                ? `Tipo: ${value}`
                                                : key === 'bedrooms'
                                                    ? `${value}+ quartos`
                                                    : key === 'location'
                                                        ? `Local: ${value}`
                                                        : value}
                                </span>
                                <button
                                    className="h-4 w-4 rounded-full bg-primary-100 hover:bg-primary-200 
                             flex items-center justify-center transition-colors"
                                >
                                    <span className="sr-only">Remover filtro</span>×
                                </button>
                            </div>
                        )
                )}

                {hasActiveFilters && (
                    <button
                        className="px-3 py-1.5 text-primary-700 hover:bg-primary-50 rounded-full 
                     text-sm font-medium transition-colors"
                    >
                        Limpar tudo
                    </button>
                )}
            </div>
        );
    }
);

FilterTagsDisplay.displayName = 'FilterTagsDisplay';

// Componente de busca rápida para propriedades
export const QuickPropertySearch = memo(() => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const { destaques, aluguel } = useProperties();

    // Combinar todas as propriedades para busca
    const allProperties = React.useMemo(
        () => [...destaques, ...aluguel],
        [destaques, aluguel]
    );

    // Filtrar propriedades baseado no termo de busca
    const filteredProperties = React.useMemo(() => {
        if (!searchTerm.trim()) return [];

        const term = searchTerm.toLowerCase().trim();
        return allProperties.filter(
            (prop) =>
                prop.title.toLowerCase().includes(term) ||
                prop.location.toLowerCase().includes(term) ||
                (prop.city && prop.city.toLowerCase().includes(term))
        );
    }, [searchTerm, allProperties]);

    return (
        <div className="relative">
            <div className="flex items-center">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar imóveis..."
                        className="w-full py-2 pl-10 pr-4 rounded-lg border border-neutral-200 
                     focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     transition-shadow duration-300"
                    />
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                        size={18}
                    />
                </div>
            </div>

            {searchTerm.trim() !== '' && (
                <div
                    className="absolute mt-2 w-full bg-white shadow-xl rounded-lg 
                   border border-neutral-100 z-50 overflow-hidden max-h-80 overflow-y-auto"
                >
                    {filteredProperties.length === 0 ? (
                        <div className="p-4 text-center text-neutral-500">
                            Nenhum imóvel encontrado para "{searchTerm}"
                        </div>
                    ) : (
                        <ul>
                            {filteredProperties.slice(0, 5).map((property) => (
                                <li key={property.id}>
                                    <Link
                                        href={`/imovel/${property.slug}`}
                                        className="flex items-center p-3 hover:bg-neutral-50 transition-colors"
                                    >
                                        <div
                                            className="h-12 w-12 rounded-md bg-center bg-cover mr-3 flex-shrink-0"
                                            style={{
                                                backgroundImage: `url(${property.mainImage.url})`,
                                            }}
                                        />
                                        <div className="flex-grow">
                                            <h4 className="font-medium text-neutral-900 line-clamp-1">
                                                {property.title}
                                            </h4>
                                            <p className="text-sm text-neutral-500">
                                                {property.location}
                                                {property.city ? `, ${property.city}` : ''}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-primary-600">
                                                {property.propertyType === 'rent'
                                                    ? `R$ ${property.price.toLocaleString('pt-BR')}/mês`
                                                    : `R$ ${property.price.toLocaleString('pt-BR')}`}
                                            </p>
                                            <p className="text-xs text-neutral-400">
                                                {property.propertyType === 'rent' ? 'Aluguel' : 'Venda'}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                            {filteredProperties.length > 5 && (
                                <li className="p-3 text-center border-t border-neutral-100">
                                    <Link
                                        href={`/busca?q=${encodeURIComponent(searchTerm)}`}
                                        className="text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Ver todos os {filteredProperties.length} resultados
                                    </Link>
                                </li>
                            )}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
});

QuickPropertySearch.displayName = 'QuickPropertySearch';