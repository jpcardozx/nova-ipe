'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { UnifiedLoading } from './components/ui/UnifiedComponents';
import ScrollAnimations from './components/ScrollAnimations';
import OptimizationProvider from './components/OptimizationProvider';
import ClientOnlyNavbar from './components/ClientOnlyNavbar';
import WhatsAppButton from './components/WhatsAppButton';
import NotificacaoBanner from './components/NotificacaoBanner';
import { FeedbackBanner } from './components/FeedbackBanner';

// Importação do Novo Hero Premium
import PremiumHero from './components/PremiumHero';

// Dynamic imports com loading states otimizados
const ValorAprimorado = dynamic(() => import('./sections/ValorAprimorado'), {
    loading: () => <UnifiedLoading height="500px" title="Carregando..." />,
});

const Referencias = dynamic(() => import('./sections/Referencias'), {
    loading: () => <UnifiedLoading height="600px" title="Carregando referências..." />,
});

const BlocoExploracaoGuararema = dynamic(() => import('./components/BlocoExploracaoSimbolica'), {
    loading: () => <UnifiedLoading height="500px" title="Carregando..." />,
});

const MarketAnalysisSection = dynamic(() => import('./components/MarketAnalysisSection'), {
    loading: () => <UnifiedLoading height="500px" title="Carregando análise..." />,
});

const ClientProgressSteps = dynamic(() => import('./components/ClientProgressSteps'), {
    loading: () => <UnifiedLoading height="500px" title="Carregando..." />,
});

    loading: () => <UnifiedLoading height="400px" title="Carregando formulário..." />,
});

interface HomePageClientProps {
    propertiesForSale: any[];
    propertiesForRent: any[];
    featuredProperties: any[];
}

export default function HomePageClient({
    propertiesForSale,
    propertiesForRent,
    featuredProperties
}: HomePageClientProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <OptimizationProvider>
            {/* Mensagens e notificações */}
            <NotificacaoBanner
                text="Novas propriedades premium disponíveis em Guararema. Confira!"
                linkText="Ver Destaques"
                linkHref="#featured-properties"
                variant="default"
                autoHideAfter={10000}
                dismissible={true}
            />
            <FeedbackBanner />{/* Navbar e Hero */}
            <ClientOnlyNavbar transparent={true} />
            <PremiumHero />

            {/* Conteúdo principal com animações de scroll */}
            <ScrollAnimations>
                {/* Bloco Exploração Guararema - Movido para logo após o Hero */}
                <BlocoExploracaoGuararema />

                <ClientProgressSteps />
                <MarketAnalysisSection />

                {/* Seção de Propriedades Destacadas */}
                <section id="featured-properties" className="py-20 bg-neutral-50">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center mb-4 text-amber-900">
                            Propriedades Selecionadas
                        </h2>
                        <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
                            Nossa curadoria exclusiva de imóveis premium em Guararema, selecionados por especialistas para oferecer o melhor em localização, estrutura e potencial de valorização.
                        </p>

                        {featuredProperties.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredProperties.slice(0, 6).map((property) => (
                                    <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
                                        <div className="relative h-64">
                                            {property.mainImage?.url && (
                                                <img
                                                    src={property.mainImage.url}
                                                    alt={property.mainImage.alt || property.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                            {property.isPremium && (
                                                <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    Premium
                                                </div>
                                            )}
                                            {property.isNew && (
                                                <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    Novo
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                                            <p className="text-gray-600 mb-4">{property.location}, {property.city}</p>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-amber-800 font-bold text-lg">
                                                    {new Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                        maximumFractionDigits: 0
                                                    }).format(property.price)}
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                    {property.area && `${property.area} m²`}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                {property.bedrooms && (
                                                    <div className="flex items-center">
                                                        <span className="mr-1">{property.bedrooms}</span>
                                                        <span>Dorm.</span>
                                                    </div>
                                                )}
                                                {property.bathrooms && (
                                                    <div className="flex items-center">
                                                        <span className="mr-1">{property.bathrooms}</span>
                                                        <span>Banh.</span>
                                                    </div>
                                                )}
                                                {property.parkingSpots && (
                                                    <div className="flex items-center">
                                                        <span className="mr-1">{property.parkingSpots}</span>
                                                        <span>Vagas</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-500">Carregando propriedades...</p>
                            </div>
                        )}

                        <div className="mt-12 text-center">
                            <a
                                href="/propriedades"
                                className="inline-block px-8 py-3 bg-amber-800 hover:bg-amber-700 text-white font-medium rounded-full transition-colors"
                            >
                                Ver Todas as Propriedades
                            </a>
                        </div>
                    </div>
                </section>

                {/* Seção de Imóveis à Venda */}
                {propertiesForSale.length > 0 && (
                    <section id="sale-properties" className="py-20 bg-white">
                        <div className="container mx-auto px-6">
                            <h2 className="text-4xl font-bold text-center mb-4 text-amber-900">
                                Imóveis à Venda em Destaque
                            </h2>
                            <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
                                Explore nossa seleção de imóveis residenciais e comerciais à venda em Guararema, perfeitos para morar ou investir.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {propertiesForSale.slice(0, 6).map((property) => (
                                    <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl border border-gray-200">
                                        <div className="relative h-64">
                                            {property.mainImage?.url && (
                                                <img
                                                    src={property.mainImage.url}
                                                    alt={property.mainImage.alt || property.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                            {property.isPremium && (
                                                <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    Premium
                                                </div>
                                            )}
                                            {property.isNew && (
                                                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    À Venda
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                                            <p className="text-gray-600 mb-4">{property.location}, {property.city}</p>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-amber-800 font-bold text-lg">
                                                    {new Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                        maximumFractionDigits: 0
                                                    }).format(property.price)}
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                    {property.area && `${property.area} m²`}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                {property.bedrooms && (
                                                    <div className="flex items-center">
                                                        <span className="mr-1">{property.bedrooms}</span>
                                                        <span>Dorm.</span>
                                                    </div>
                                                )}
                                                {property.bathrooms && (
                                                    <div className="flex items-center">
                                                        <span className="mr-1">{property.bathrooms}</span>
                                                        <span>Banh.</span>
                                                    </div>
                                                )}
                                                {property.parkingSpots && (
                                                    <div className="flex items-center">
                                                        <span className="mr-1">{property.parkingSpots}</span>
                                                        <span>Vagas</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 text-center">
                                <a
                                    href="/comprar" // Link para a página de imóveis à venda
                                    className="inline-block px-8 py-3 bg-amber-800 hover:bg-amber-700 text-white font-medium rounded-full transition-colors"
                                >
                                    Ver Todos os Imóveis à Venda
                                </a>
                            </div>
                        </div>
                    </section>
                )}

                {/* Seção de Imóveis para Alugar */}
                {propertiesForRent.length > 0 && (
                    <section id="rent-properties" className="py-20 bg-neutral-50">
                        <div className="container mx-auto px-6">
                            <h2 className="text-4xl font-bold text-center mb-4 text-amber-900">
                                Excelentes Opções para Aluguel
                            </h2>
                            <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
                                Encontre o imóvel ideal para alugar em Guararema. Opções que combinam conforto, localização e o estilo de vida que você procura.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {propertiesForRent.slice(0, 6).map((property) => (
                                    <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl border border-gray-200">
                                        <div className="relative h-64">
                                            {property.mainImage?.url && (
                                                <img
                                                    src={property.mainImage.url}
                                                    alt={property.mainImage.alt || property.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                            {property.isPremium && (
                                                <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    Premium
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4 bg-sky-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                Para Alugar
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                                            <p className="text-gray-600 mb-4">{property.location}, {property.city}</p>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-amber-800 font-bold text-lg">
                                                    {new Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                        maximumFractionDigits: 0
                                                    }).format(property.price)} <span className="text-sm text-gray-500 font-normal">/mês</span>
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                    {property.area && `${property.area} m²`}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                {property.bedrooms && (
                                                    <div className="flex items-center">
                                                        <span className="mr-1">{property.bedrooms}</span>
                                                        <span>Dorm.</span>
                                                    </div>
                                                )}
                                                {property.bathrooms && (
                                                    <div className="flex items-center">
                                                        <span className="mr-1">{property.bathrooms}</span>
                                                        <span>Banh.</span>
                                                    </div>
                                                )}
                                                {property.parkingSpots && (
                                                    <div className="flex items-center">
                                                        <span className="mr-1">{property.parkingSpots}</span>
                                                        <span>Vagas</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 text-center">
                                <a
                                    href="/alugar" // Link para a página de imóveis para alugar
                                    className="inline-block px-8 py-3 bg-amber-800 hover:bg-amber-700 text-white font-medium rounded-full transition-colors"
                                >
                                    Ver Todas as Opções de Aluguel
                                </a>
                            </div>
                        </div>
                    </section>
                )}

                <ValorAprimorado />
                <Referencias />
            </ScrollAnimations>

            <WhatsAppButton phoneNumber="5511981845016" message="Olá! Gostaria de informações sobre os imóveis da Nova Ipê." />
        </OptimizationProvider>
    );
}