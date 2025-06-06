/**
 * SSR Static Data Provider
 * Fornece dados estáticos no servidor para melhor performance
 */

import { Suspense } from 'react';

// === TIPOS PARA DADOS ESTÁTICOS ===
export interface SectionMetadata {
    id: string;
    title: string;
    description: string;
    priority: number;
    spacing: 'sm' | 'md' | 'lg' | 'xl';
    background: 'white' | 'amber' | 'gradient' | 'dark';
}

export interface StaticPageData {
    sections: SectionMetadata[];
    seo: {
        title: string;
        description: string;
        keywords: string[];
    };
    layout: {
        containerMaxWidth: string;
        sectionSpacing: string;
        mobileOptimized: boolean;
    };
}

// === DADOS ESTÁTICOS DA PÁGINA ===
export const staticPageData: StaticPageData = {
    sections: [
        {
            id: 'hero',
            title: 'Hero Institucional',
            description: 'Apresentação principal da empresa',
            priority: 1,
            spacing: 'xl',
            background: 'gradient'
        },
        {
            id: 'exploration',
            title: 'Exploração Guararema',
            description: 'Contextualização premium da cidade',
            priority: 2,
            spacing: 'lg',
            background: 'white'
        },
        {
            id: 'sales',
            title: 'Vendas Premium',
            description: 'Imóveis de destaque para venda',
            priority: 3,
            spacing: 'xl',
            background: 'amber'
        },
        {
            id: 'value',
            title: 'Valor e Mercado',
            description: 'Análise de valor aprimorada',
            priority: 4,
            spacing: 'md',
            background: 'gradient'
        },
        {
            id: 'market-analysis',
            title: 'Análise de Mercado',
            description: 'Insights do mercado imobiliário',
            priority: 5,
            spacing: 'lg',
            background: 'white'
        },
        {
            id: 'process',
            title: 'Processo de Trabalho',
            description: 'Etapas do nosso processo',
            priority: 6,
            spacing: 'lg',
            background: 'gradient'
        },
        {
            id: 'stories',
            title: 'Histórias de Família',
            description: 'Depoimentos e casos de sucesso',
            priority: 7,
            spacing: 'md',
            background: 'amber'
        },
        {
            id: 'rentals',
            title: 'Aluguéis Estratégicos',
            description: 'Imóveis premium para locação',
            priority: 8,
            spacing: 'xl',
            background: 'amber'
        },
        {
            id: 'references',
            title: 'Referências',
            description: 'Credibilidade e parcerias',
            priority: 9,
            spacing: 'md',
            background: 'white'
        },
        {
            id: 'contact',
            title: 'Contato Sutil',
            description: 'Formulário de contato discreto',
            priority: 10,
            spacing: 'lg',
            background: 'gradient'
        },
        {
            id: 'footer',
            title: 'Footer Aprimorado',
            description: 'Rodapé com informações completas',
            priority: 11,
            spacing: 'sm',
            background: 'dark'
        }
    ],
    seo: {
        title: 'Ipê Imóveis - Seu parceiro em Guararema',
        description: 'Encontre sua nova casa ou invista com segurança em Guararema. Especialistas em vendas e aluguéis com mais de 15 anos de experiência.',
        keywords: [
            'imóveis Guararema',
            'casas para venda',
            'apartamentos aluguel',
            'investimento imobiliário',
            'corretor Guararema'
        ]
    },
    layout: {
        containerMaxWidth: 'max-w-7xl',
        sectionSpacing: 'space-y-0',
        mobileOptimized: true
    }
};

// === CONFIGURAÇÕES DE ESPAÇAMENTO PADRONIZADO ===
export const spacingConfig = {
    sections: {
        sm: 'py-12',
        md: 'py-16',
        lg: 'py-20',
        xl: 'py-24'
    },
    containers: {
        default: 'container mx-auto px-6 lg:px-8',
        wide: 'max-w-7xl mx-auto px-6 lg:px-8',
        narrow: 'max-w-4xl mx-auto px-6 lg:px-8'
    },
    backgrounds: {
        white: 'bg-white',
        amber: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50',
        gradient: 'bg-gradient-to-br from-slate-50 via-white to-amber-50/30',
        dark: 'bg-gray-900'
    }
};

// === LOADING STATES PADRONIZADOS ===
export const LoadingStates = {
    hero: () => (
        <div className="min-h-screen bg-gradient-to-br from-amber-900/20 to-orange-900/20 animate-pulse">
            <div className="container mx-auto px-6 pt-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
                    <div className="space-y-6">
                        <div className="h-4 bg-amber-200 rounded w-1/3"></div>
                        <div className="h-16 bg-amber-300 rounded w-4/5"></div>
                        <div className="h-6 bg-amber-200 rounded w-3/4"></div>
                        <div className="h-12 bg-amber-400 rounded w-1/2"></div>
                    </div>
                    <div className="h-96 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl"></div>
                </div>
            </div>
        </div>
    ),

    section: (height = 'h-80') => (
        <div className={`${height} bg-gradient-to-br from-amber-100 to-orange-100 animate-pulse rounded-2xl`}>
            <div className="container mx-auto px-6 py-12">
                <div className="text-center space-y-4 mb-8">
                    <div className="h-6 bg-amber-200 rounded w-1/4 mx-auto"></div>
                    <div className="h-10 bg-amber-300 rounded w-1/2 mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-amber-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        </div>
    ),

    property: () => (
        <div className="min-h-[800px] bg-gradient-to-br from-amber-50 to-orange-50 animate-pulse">
            <div className="container mx-auto px-6 py-20">
                <div className="text-center mb-16 space-y-4">
                    <div className="h-8 bg-amber-200 rounded w-1/3 mx-auto"></div>
                    <div className="h-12 bg-amber-300 rounded w-1/2 mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-20 bg-amber-200 rounded-xl"></div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-16 bg-gradient-to-r from-amber-200 to-orange-200 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="h-96 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-80 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        </div>
    )
};

// === COMPONENTE WRAPPER PARA DADOS ESTÁTICOS ===
interface StaticDataProviderProps {
    children: React.ReactNode;
}

export function StaticDataProvider({ children }: StaticDataProviderProps) {
    return (
        <div className="min-h-screen bg-white">
            {children}
        </div>
    );
}

// === UTILITÁRIOS PARA SEÇÕES ===
export function getSectionConfig(sectionId: string) {
    return staticPageData.sections.find(section => section.id === sectionId);
}

export function getSectionSpacing(spacing: 'sm' | 'md' | 'lg' | 'xl') {
    return spacingConfig.sections[spacing];
}

export function getSectionBackground(background: 'white' | 'amber' | 'gradient' | 'dark') {
    return spacingConfig.backgrounds[background];
}

export default StaticDataProvider;
