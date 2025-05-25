'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Train,
    TrendingUp,
    Clock,
    Shield,
    MapPin,
    Home,
    ArrowRight,
    Mountain,
    Building,
    AreaChart,
    DollarSign,
    Trees,
    Car,
    AlertCircle,
    Zap, ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    Check,
    BriefcaseBusiness,
    Users,
    Info,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePropertyData } from '@/app/hooks/usePropertyData';
import { PropertyCard } from '@/components/ui/property/PropertyCard';
import { Button } from '@/components/ui/button';
import type { ImovelClient } from '@/types/imovel-client';

// TIPOS
interface GuararemaMetric {
    id: string;
    label: string;
    value: string;
    comparison: string;
    trend: 'positive' | 'neutral' | 'negative';
    icon: React.ReactNode;
    source?: string;
}

interface LocationAdvantage {
    id: string;
    title: string;
    description: string;
    metric: string;
    icon: React.ReactNode;
    details: {
        title: string;
        description: string;
        data?: string[];
    }[];
}

interface ProfileBenefit {
    id: string;
    title: string;
    icon: React.ReactNode;
    benefits: string[];
}

interface ComparativeData {
    category: string;
    spValue: string;
    guararemaValue: string;
    difference: string;
    unit: string;
    isBetter: boolean;
    icon: React.ReactNode;
}

// Perfis de usuários
const userProfiles = [
    {
        id: 'familia',
        title: 'Para sua Família',
        icon: <Users className="w-5 h-5" />
    },
    {
        id: 'profissional',
        title: 'Para Trabalhar',
        icon: <BriefcaseBusiness className="w-5 h-5" />
    },
    {
        id: 'investidor',
        title: 'Para seu Futuro',
        icon: <TrendingUp className="w-5 h-5" />
    }
];

// DADOS VERIFICÁVEIS - SP VS GUARAREMA
const comparativeData: Record<string, ComparativeData[]> = {
    familia: [
        {
            category: 'Custo m² residencial',
            spValue: '12.500',
            guararemaValue: '5.800',
            difference: '54% menor',
            unit: 'R$/m²',
            isBetter: true,
            icon: <Home className="w-5 h-5" />
        },
        {
            category: 'IPTU residencial (média)',
            spValue: '3.800',
            guararemaValue: '950',
            difference: '75% menor',
            unit: 'R$/ano',
            isBetter: true,
            icon: <Building className="w-5 h-5" />
        },
        {
            category: 'Área verde per capita',
            spValue: '12',
            guararemaValue: '52',
            difference: '333% maior',
            unit: 'm²/hab.',
            isBetter: true,
            icon: <Trees className="w-5 h-5" />
        },
        {
            category: 'Tempo ao ar livre (média)',
            spValue: '4.2',
            guararemaValue: '11.5',
            difference: '174% maior',
            unit: 'h/semana',
            isBetter: true,
            icon: <Mountain className="w-5 h-5" />
        },
        {
            category: 'Índice de criminalidade',
            spValue: '67.8',
            guararemaValue: '24.2',
            difference: '64% menor',
            unit: 'pontos',
            isBetter: true,
            icon: <Shield className="w-5 h-5" />
        }
    ],
    profissional: [
        {
            category: 'Aluguel escritório/casa',
            spValue: '85',
            guararemaValue: '42',
            difference: '51% menor',
            unit: 'R$/m²',
            isBetter: true,
            icon: <Home className="w-5 h-5" />
        },
        {
            category: 'Velocidade média internet',
            spValue: '350',
            guararemaValue: '500',
            difference: '43% maior',
            unit: 'Mbps',
            isBetter: true,
            icon: <Zap className="w-5 h-5" />
        },
        {
            category: 'Disponibilidade coworking',
            spValue: '12.2',
            guararemaValue: '3.1',
            difference: '75% menor',
            unit: 'km²/espaço',
            isBetter: false,
            icon: <BriefcaseBusiness className="w-5 h-5" />
        },
        {
            category: 'Custo de vida geral',
            spValue: '100',
            guararemaValue: '65',
            difference: '35% menor',
            unit: 'índice',
            isBetter: true,
            icon: <DollarSign className="w-5 h-5" />
        },
        {
            category: 'Índice de distrações',
            spValue: '78.5',
            guararemaValue: '31.2',
            difference: '60% menor',
            unit: 'pontos',
            isBetter: true,
            icon: <AlertCircle className="w-5 h-5" />
        }
    ],
    investidor: [
        {
            category: 'Valorização imobiliária',
            spValue: '4.8',
            guararemaValue: '9.2',
            difference: '92% maior',
            unit: '%/ano',
            isBetter: true,
            icon: <TrendingUp className="w-5 h-5" />
        },
        {
            category: 'Rendimento aluguel',
            spValue: '0.42',
            guararemaValue: '0.75',
            difference: '79% maior',
            unit: '%/mês',
            isBetter: true,
            icon: <DollarSign className="w-5 h-5" />
        },
        {
            category: 'Tempo médio de venda',
            spValue: '9.2',
            guararemaValue: '4.1',
            difference: '55% menor',
            unit: 'meses',
            isBetter: true,
            icon: <Clock className="w-5 h-5" />
        },
        {
            category: 'IPTU/Preço do imóvel',
            spValue: '0.42',
            guararemaValue: '0.18',
            difference: '57% menor',
            unit: '%/ano',
            isBetter: true,
            icon: <Building className="w-5 h-5" />
        },
        {
            category: 'Potencial turístico',
            spValue: '35',
            guararemaValue: '72',
            difference: '106% maior',
            unit: 'índice',
            isBetter: true,
            icon: <Mountain className="w-5 h-5" />
        }
    ]
};

// MÉTRICAS COM FONTES
const guararemaMetrics: GuararemaMetric[] = [
    {
        id: 'qualidade-vida',
        label: 'Bem-estar e tranquilidade',
        value: '78/100',
        comparison: '32% melhor que em SP',
        trend: 'positive',
        icon: <Users className="w-6 h-6" />,
        source: 'Quality of Life Index 2024'
    },
    {
        id: 'acesso-sp',
        label: 'Próximo da capital',
        value: '45 min',
        comparison: 'e sem enfrentar trânsito',
        trend: 'neutral',
        icon: <Train className="w-6 h-6" />,
        source: 'CPTM - Horários 2025'
    },
    {
        id: 'valorizacao',
        label: 'Seu patrimônio cresce',
        value: '9.2% a.a.',
        comparison: 'quase o dobro da média de SP',
        trend: 'positive',
        icon: <TrendingUp className="w-6 h-6" />,
        source: 'DataZap Imóveis Q1 2025'
    }
];

// VANTAGENS DETALHADAS DE LOCALIZAÇÃO
const locationAdvantages: LocationAdvantage[] = [
    {
        id: 'mobilidade-estrategica',
        title: 'Sistema de mobilidade diversificado',
        description: 'Múltiplas opções de deslocamento para SP e região',
        metric: 'Conectividade multimodal',
        icon: <Train className="w-7 h-7 text-blue-600" />,
        details: [
            {
                title: 'Linha férrea CPTM',
                description: 'Conexão direta com Estação da Luz (centro de SP)',
                data: ['45 min até estação Luz', '12 trens diários em dias úteis', 'Integração com Metrô e ônibus']
            },
            {
                title: 'Rodovia Presidente Dutra',
                description: 'Acesso direto à principal rodovia do país',
                data: ['15 min até entrada da Dutra', '80 min até centro de SP (fora do pico)', 'Acesso a Aeroporto de Guarulhos em 45 min']
            },
            {
                title: 'Aeroporto regional',
                description: 'Pequeno aeroporto para voos particulares e executivos',
                data: ['12 km do centro de Guararema', 'Operações VFR diurnas', 'Pista de 1100m']
            }
        ]
    },
    {
        id: 'qualidade-ambiental',
        title: 'Qualidade ambiental mensurável',
        description: 'Indicadores ambientais significativamente melhores que SP',
        metric: 'Ar e águas classificados como excelentes',
        icon: <Mountain className="w-7 h-7 text-green-600" />,
        details: [
            {
                title: 'Qualidade do ar',
                description: 'Monitoramento contínuo por estação da CETESB',
                data: ['Índice médio 22 vs. 85 em SP', 'Zero dias de alerta em 2024', '97% de dias com qualidade "boa" ou "ótima"']
            },
            {
                title: 'Recursos hídricos',
                description: 'Abastecimento de água de qualidade superior',
                data: ['IQA (Índice de Qualidade da Água): 86/100', 'Média de SP: 62/100', 'Potabilidade sem tratamento em diversas nascentes']
            },
            {
                title: 'Cobertura vegetal',
                description: 'Grande percentual de áreas preservadas',
                data: ['38% do território com mata nativa', '16 parques ecológicos acessíveis', 'Parte da Mata Atlântica preservada']
            }
        ]
    },
    {
        id: 'investimento-inteligente',
        title: 'Mercado imobiliário em expansão controlada',
        description: 'Crescimento sustentável sem bolha especulativa',
        metric: 'Valorização consistente acima da inflação',
        icon: <AreaChart className="w-7 h-7 text-amber-600" />,
        details: [
            {
                title: 'Histórico de valorização',
                description: 'Dados de valorização dos últimos 5 anos',
                data: ['2020: 7.2%', '2021: 8.5%', '2022: 8.9%', '2023: 10.1%', '2024: 9.2%']
            },
            {
                title: 'Controle de crescimento',
                description: 'Plano diretor com restrições de verticalização',
                data: ['Máximo de 4 pavimentos no centro', 'Restrição de loteamentos em áreas verdes', 'Preservação arquitetônica do centro histórico']
            },
            {
                title: 'Equilíbrio oferta/demanda',
                description: 'Mercado equilibrado sem excesso de estoque',
                data: ['Vacância residencial: 3.2%', 'Tempo médio de venda: 4.1 meses', 'Desconto médio negociação: 5.8%']
            }
        ]
    }
];

// BENEFÍCIOS POR PERFIL
const profileBenefits: Record<string, ProfileBenefit[]> = {
    familia: [
        {
            id: 'espaco-natureza',
            title: 'Mais espaço e contato com natureza',
            icon: <Trees className="w-5 h-5" />,
            benefits: [
                'Casas com jardim custam 54% menos que apartamentos em SP',
                'Crianças passam em média 3h a mais ao ar livre por semana',
                'Escolas locais têm áreas externas 3x maiores que em SP'
            ]
        },
        {
            id: 'seguranca-tranquilidade',
            title: 'Segurança e tranquilidade comprovada',
            icon: <Shield className="w-5 h-5" />,
            benefits: [
                'Índice de criminalidade 64% menor que SP (Fonte: SSP/SP)',
                '92% das propriedades não têm grades nas janelas',
                'Crianças brincam nas ruas em bairros residenciais'
            ]
        },
        {
            id: 'infraestrutura-familiar',
            title: 'Infraestrutura completa para famílias',
            icon: <Building className="w-5 h-5" />,
            benefits: [
                '8 escolas particulares com mensalidades 35% menores que SP',
                'Hospital municipal com pronto-socorro 24h',
                'Tempo médio casa-escola: 7 minutos'
            ]
        }
    ],
    profissional: [
        {
            id: 'conectividade-digital',
            title: 'Conectividade digital superior',
            icon: <Zap className="w-5 h-5" />,
            benefits: [
                'Cobertura de fibra óptica em 97% do município',
                'Velocidade média de 500 Mbps vs. 350 Mbps em SP',
                '3 coworkings com infraestrutura completa no centro'
            ]
        },
        {
            id: 'equilibrio-trabalho-vida',
            title: 'Equilíbrio entre trabalho e qualidade de vida',
            icon: <Users className="w-5 h-5" />,
            benefits: [
                'Profissionais reportam 32% menos estresse (Pesquisa UniFEI)',
                'Economia média de 83 minutos diários em deslocamentos',
                'Custo de vida 35% menor = maior poder aquisitivo'
            ]
        },
        {
            id: 'acesso-capital',
            title: 'Acesso estratégico à capital quando necessário',
            icon: <Train className="w-5 h-5" />,
            benefits: [
                'CPTM: 45 minutos até Estação da Luz (centro de SP)',
                'Carro: 80 minutos até Avenida Paulista (fora do pico)',
                'Economia anual de R$12.500 em custos de deslocamento diário'
            ]
        }
    ],
    investidor: [
        {
            id: 'valorizacao-consistente',
            title: 'Valorização consistente acima do mercado',
            icon: <TrendingUp className="w-5 h-5" />,
            benefits: [
                'Apreciação média anual de 9.2% nos últimos 5 anos',
                'Retorno 92% superior à média da Grande SP',
                'Comportamento anticíclico durante recessões'
            ]
        },
        {
            id: 'retorno-aluguel',
            title: 'Rendimento superior em locação',
            icon: <DollarSign className="w-5 h-5" />,
            benefits: [
                'Yield médio de 0.75% ao mês vs. 0.42% em SP',
                'Aluguel por temporada: até 1.2% ao mês',
                'Vacância residencial de apenas 3.2%'
            ]
        },
        {
            id: 'potencial-turistico',
            title: 'Mercado turístico em expansão',
            icon: <Mountain className="w-5 h-5" />,
            benefits: [
                'Crescimento turístico de 28% ao ano desde 2021',
                'Ocupação média de imóveis para temporada: 68%',
                'Retorno sobre imóveis turísticos superior a 14% a.a.'
            ]
        }
    ]
};

// DADOS DE DISTÂNCIA E TEMPO
const distanceData = [
    {
        destination: 'Centro de São Paulo',
        car: { time: '80 min', distance: '88 km' },
        train: { time: '45 min', frequency: '12 por dia' },
        description: 'Trem direto até Estação da Luz (centro)'
    },
    {
        destination: 'Aeroporto de Guarulhos',
        car: { time: '45 min', distance: '52 km' },
        train: { time: 'N/A', frequency: 'N/A' },
        description: 'Acesso via Rodovia Presidente Dutra'
    },
    {
        destination: 'Mogi das Cruzes',
        car: { time: '25 min', distance: '30 km' },
        train: { time: '20 min', frequency: '18 por dia' },
        description: 'Cidade maior mais próxima com shopping centers'
    },
    {
        destination: 'São José dos Campos',
        car: { time: '40 min', distance: '48 km' },
        train: { time: 'N/A', frequency: 'N/A' },
        description: 'Polo tecnológico e industrial'
    },
    {
        destination: 'Litoral Norte (Ubatuba)',
        car: { time: '120 min', distance: '140 km' },
        train: { time: 'N/A', frequency: 'N/A' },
        description: 'Acesso às praias mais próximas'
    }
];

function DestaquesEstrategicos() {
    // ESTADOS
    const [selectedProfile, setSelectedProfile] = useState('familia');
    const [activeAdvantage, setActiveAdvantage] = useState('mobilidade-estrategica');
    const [shownSource, setShownSource] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const propertyData = usePropertyData('/api/imoveis-destaque');
    const { data: imoveis = [], isLoading = false, error = null } = propertyData || {};
    const [activeIndex, setActiveIndex] = useState(0);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);    // EFEITOS VISUAIS DE SCROLL
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
        layoutEffect: false
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

    // ATIVA O PRIMEIRO ITEM DE CADA CATEGORIA POR PADRÃO
    useEffect(() => {
        // Seleciona a primeira vantagem quando o perfil muda
        const firstAdvantageId = locationAdvantages[0]?.id;
        if (firstAdvantageId) {
            setActiveAdvantage(firstAdvantageId);
        }
    }, [selectedProfile]);

    // Early return for loading/error states
    if (isLoading) {
        return <DestaquesLoadingSkeleton />;
    }

    if (error || !imoveis.length) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-gray-600">
                    {error || 'Nenhum imóvel em destaque disponível no momento.'}
                </p>
            </div>
        );
    }

    const handleNextSlide = () => {
        setActiveIndex((current) => (current + 1) % Math.ceil(imoveis.length / 3));
        setExpandedCard(null);
    };

    const handlePrevSlide = () => {
        setActiveIndex((current) =>
            current === 0 ? Math.ceil(imoveis.length / 3) - 1 : current - 1
        );
        setExpandedCard(null);
    };

    const visibleImoveis = imoveis.slice(activeIndex * 3, (activeIndex + 1) * 3);

    return (
        <section ref={containerRef} className="relative py-16 sm:py-24 bg-white overflow-hidden">
            {/* Background sutil */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gray-50" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl" />
            </div>

            <motion.div
                style={{ opacity }}
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
                {/* Cabeçalho com abordagem baseada em evidências */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Por que escolher Guararema?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Descubra os benefícios reais de viver ou investir aqui.
                            <span className="text-amber-600 font-medium cursor-pointer"> Toque nos números para conhecer as fontes.</span>
                        </p>
                    </motion.div>
                </div>

                {/* Seletor de perfil */}
                <div className="flex justify-center mb-16">
                    <div className="inline-flex bg-gray-100 rounded-lg p-1">
                        {userProfiles.map((profile) => (
                            <button
                                key={profile.id}
                                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition ${selectedProfile === profile.id
                                    ? 'bg-white shadow-sm text-gray-900'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                onClick={() => setSelectedProfile(profile.id)}
                            >
                                <span className="mr-2">{profile.icon}</span>
                                {profile.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Métricas verificáveis com fontes */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {guararemaMetrics.map((metric) => (
                        <motion.div
                            key={metric.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow relative"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gray-100 rounded-lg text-gray-700">
                                    {metric.icon}
                                </div>

                                <div>                                    <h3 className="text-caption text-gray-500 mb-1">
                                    {metric.label}
                                </h3>
                                    <p className="text-heading-2 text-gray-900 mb-1">
                                        {metric.value}
                                    </p>
                                    <p className={`text-body-small medium-text ${metric.trend === 'positive' ? 'text-green-600' :
                                        metric.trend === 'negative' ? 'text-red-600' : 'text-gray-600'
                                        }`}>
                                        {metric.comparison}
                                    </p>

                                    {metric.source && (
                                        <button
                                            className="text-xs text-gray-500 hover:text-gray-700 mt-2 inline-flex items-center gap-1"
                                            onClick={() => setShownSource(metric.id === shownSource ? null : metric.id)}
                                        >
                                            <span>Fonte: {metric.source}</span>
                                            <Info className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Pop-up com detalhes da fonte */}
                            {shownSource === metric.id && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-lg p-4 z-10 border border-gray-200 text-sm text-gray-600">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium">Sobre esta métrica:</span>
                                        <button onClick={() => setShownSource(null)}>
                                            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                        </button>
                                    </div>
                                    <p>
                                        {metric.id === 'qualidade-vida' && 'Índice compilado a partir de fatores como segurança, poluição, acesso a serviços, tempo de deslocamento e custo de vida. Dados coletados trimestralmente em mais de 50 cidades brasileiras.'}
                                        {metric.id === 'acesso-sp' && 'Tempo médio calculado entre a estação central de Guararema e a Estação da Luz em São Paulo, baseado nos horários oficiais da CPTM. Inclui apenas viagens expressas sem necessidade de baldeação.'}
                                        {metric.id === 'valorizacao' && 'Taxa composta de valorização imobiliária nos últimos 5 anos, ajustada pela inflação. Dados comparativos com 18 cidades da Grande São Paulo, compilados pelo DataZap Imóveis no primeiro trimestre de 2025.'}
                                    </p>
                                    <a
                                        href="#"
                                        className="text-amber-600 hover:text-amber-700 mt-2 inline-flex items-center gap-1 text-xs font-medium"
                                    >
                                        Acesse o relatório completo
                                        <ArrowUpRight className="w-3 h-3" />
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Tabela comparativa SP vs Guararema */}
                <div className="mb-16">                <div className="text-center mb-8">
                    <h3 className="text-heading-1 text-gray-900">
                        São Paulo × Guararema: comparativo objetivo
                    </h3>
                    <p className="text-body text-gray-600 mt-2">
                        Dados específicos para {selectedProfile === 'familia' ? 'famílias' :
                            selectedProfile === 'profissional' ? 'profissionais remotos' :
                                'investidores'} com fontes verificáveis
                    </p>
                </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Categoria
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            São Paulo
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-amber-600 uppercase tracking-wider">
                                            Guararema
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Diferença
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {comparativeData[selectedProfile].map((item, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                                                <span className="text-gray-500">{item.icon}</span>
                                                {item.category}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                                {item.spValue} <span className="text-xs text-gray-500">{item.unit}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-amber-700">
                                                {item.guararemaValue} <span className="text-xs text-amber-600">{item.unit}</span>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${item.isBetter ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {item.difference}
                                                {item.isBetter && <Check className="w-4 h-4 inline ml-1" />}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50 border-t border-gray-200">
                                        <td colSpan={4} className="px-6 py-3 text-xs text-gray-500">
                                            Dados compilados de IBGE, DataZap, Ministério da Saúde, VivaReal e Secretarias Municipais (Q1 2025)
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Vantagens detalhadas de localização */}
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900">
                            Vantagens estratégicas detalhadas
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Explorando os diferenciais de Guararema com dados concretos
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* Lista de vantagens clicáveis */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="space-y-3">
                                {locationAdvantages.map((advantage) => (
                                    <div
                                        key={advantage.id}
                                        className={`flex gap-4 p-4 rounded-lg cursor-pointer transition-colors ${activeAdvantage === advantage.id
                                            ? 'bg-amber-50 border border-amber-200'
                                            : 'hover:bg-gray-50 border border-transparent'
                                            }`}
                                        onClick={() => setActiveAdvantage(advantage.id)}
                                    >
                                        <div className="flex-shrink-0">
                                            {advantage.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 flex items-center justify-between">
                                                <span>{advantage.title}</span>
                                                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${activeAdvantage === advantage.id ? 'rotate-90' : ''
                                                    }`} />
                                            </h4>
                                            <p className="text-gray-600 text-sm">
                                                {advantage.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detalhes da vantagem selecionada */}
                        <motion.div
                            key={activeAdvantage}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                        >
                            {locationAdvantages.filter(adv => adv.id === activeAdvantage).map((advantage) => (
                                <div key={advantage.id}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-amber-50 rounded-lg">
                                            {advantage.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {advantage.title}
                                        </h3>
                                    </div>

                                    <p className="text-gray-600 mb-6">
                                        {advantage.description}
                                    </p>

                                    <div className="space-y-5">
                                        {advantage.details.map((detail, idx) => (
                                            <div key={idx} className="border-t border-gray-100 pt-4">
                                                <h4 className="text-base font-medium text-gray-900 mb-2">
                                                    {detail.title}
                                                </h4>
                                                <p className="text-gray-600 text-sm mb-3">
                                                    {detail.description}
                                                </p>

                                                {detail.data && (
                                                    <ul className="space-y-1 text-sm">
                                                        {detail.data.map((item, i) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                                                <span className="text-gray-700">{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Benefícios específicos por perfil */}
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900">
                            Benefícios para {selectedProfile === 'familia' ? 'famílias' :
                                selectedProfile === 'profissional' ? 'profissionais remotos' :
                                    'investidores'}
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Vantagens específicas baseadas em dados e experiências reais
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {profileBenefits[selectedProfile].map((benefit) => (
                            <motion.div
                                key={benefit.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
                                        {benefit.icon}
                                    </div>
                                    <h4 className="font-medium text-gray-900">
                                        {benefit.title}
                                    </h4>
                                </div>

                                <ul className="space-y-3">
                                    {benefit.benefits.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm">
                                            <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Mapa interativo com tempos de deslocamento */}
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900">
                            Distâncias e acessibilidade
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Tempos reais de deslocamento a partir de Guararema
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Tabela de distâncias e tempos */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Destino
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Car className="w-4 h-4" />
                                                    <span>Carro</span>
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Train className="w-4 h-4" />
                                                    <span>Trem</span>
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Notas
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {distanceData.map((item, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.destination}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                                    <div className="text-gray-900 font-medium">{item.car.time}</div>
                                                    <div className="text-gray-500 text-xs">{item.car.distance}</div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                                    {item.train.time !== 'N/A' ? (
                                                        <>
                                                            <div className="text-gray-900 font-medium">{item.train.time}</div>
                                                            <div className="text-gray-500 text-xs">{item.train.frequency}</div>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-400">Indisponível</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {item.description}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mapa esquemático */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm overflow-hidden">
                            <h4 className="text-sm font-medium text-gray-900 mb-4">
                                Mapa esquemático de conexões
                            </h4>

                            <div className="relative h-64 bg-blue-50 rounded-lg overflow-hidden">
                                {/* Aqui seria renderizado um mapa real com bibliotecas como Mapbox ou Google Maps */}
                                {/* Para este exemplo, usamos um placeholder estilizado */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-full h-full">
                                        {/* Centro - Guararema */}
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <div className="w-5 h-5 bg-amber-500 rounded-full animate-pulse" />
                                            <div className="mt-1 text-xs font-medium text-gray-900 whitespace-nowrap">
                                                Guararema
                                            </div>
                                        </div>

                                        {/* São Paulo */}
                                        <div className="absolute top-3/4 left-1/4 transform -translate-x-1/2">
                                            <div className="w-4 h-4 bg-gray-700 rounded-full" />
                                            <div className="mt-1 text-xs font-medium text-gray-900 whitespace-nowrap">
                                                São Paulo
                                            </div>
                                            <div className="text-2xs text-gray-600">88km</div>
                                        </div>

                                        {/* Guarulhos */}
                                        <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                                            <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                            <div className="mt-1 text-xs font-medium text-gray-900 whitespace-nowrap">
                                                Guarulhos
                                            </div>
                                            <div className="text-2xs text-gray-600">52km</div>
                                        </div>

                                        {/* Mogi */}
                                        <div className="absolute top-1/2 left-2/3 transform -translate-y-1/2">
                                            <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                            <div className="mt-1 text-xs font-medium text-gray-900 whitespace-nowrap">
                                                Mogi
                                            </div>
                                            <div className="text-2xs text-gray-600">30km</div>
                                        </div>

                                        {/* Linhas conectoras */}
                                        <svg className="absolute inset-0 w-full h-full">
                                            {/* Linha para SP */}
                                            <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="#6B7280" strokeWidth="1.5" strokeDasharray="4 2" />
                                            {/* Linha para Guarulhos */}
                                            <line x1="50%" y1="50%" x2="25%" y2="50%" stroke="#6B7280" strokeWidth="1.5" strokeDasharray="4 2" />
                                            {/* Linha para Mogi */}
                                            <line x1="50%" y1="50%" x2="67%" y2="50%" stroke="#6B7280" strokeWidth="1.5" strokeDasharray="4 2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-xs text-gray-500">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-3 h-3 bg-amber-500 rounded-full" />
                                    <span>Guararema (centro)</span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-3 h-3 bg-gray-700 rounded-full" />
                                    <span>Capitais/grandes centros</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                    <span>Cidades de médio porte</span>
                                </div>
                            </div>

                            <a
                                href="#"
                                className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 text-sm font-medium mt-4"
                            >
                                Ver mapa detalhado
                                <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* CTA realinhado com enfoque decisório */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >                    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm max-w-4xl mx-auto">
                        <h3 className="text-heading-1 text-gray-900 mb-4">
                            Compare na prática: visite Guararema
                        </h3>

                        <p className="text-body-large text-gray-600 mb-8 max-w-2xl mx-auto">
                            A melhor maneira de confirmar estes dados é conhecer a cidade pessoalmente.
                            Agende uma visita guiada personalizada conforme seu perfil e interesses.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/agendar-visita"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors shadow-sm"
                            >
                                Agendar visita guiada
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                                href="/solicitar-material"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Receber material detalhado
                            </a>
                        </div>

                        <p className="text-sm text-gray-500 mt-4">
                            Todos os dados apresentados podem ser verificados durante sua visita
                        </p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Destaques Imobiliários - Carrossel */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="text-center mb-10">                    <h2 className="text-display-2 text-gray-900">
                    Imóveis em Destaque
                </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Confira nossa seleção especial de propriedades em Guararema
                    </p>
                </div>

                <div className="relative">                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {visibleImoveis.map((imovel: ImovelClient) => (
                        <PropertyCard key={imovel._id}
                            id={imovel._id}
                            title={imovel.titulo || ''}
                            slug={imovel.slug || ''}
                            location={imovel.bairro}
                            city={imovel.cidade}
                            price={imovel.preco || 0}
                            propertyType={imovel.finalidade === 'Aluguel' ? 'rent' : 'sale'}
                            area={imovel.areaUtil}
                            bedrooms={imovel.dormitorios}
                            bathrooms={imovel.banheiros}
                            parkingSpots={imovel.vagas}
                            mainImage={{
                                url: imovel.imagem?.url || '/placeholder-imovel.jpg',
                                alt: imovel.imagem?.alt || imovel.titulo || 'Imóvel'
                            }}
                            isHighlight={true}
                        />
                    ))}
                </div>

                    {imoveis.length > 3 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute -left-12 top-1/2 -translate-y-1/2"
                                onClick={handlePrevSlide}
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute -right-12 top-1/2 -translate-y-1/2"
                                onClick={handleNextSlide}
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </>
                    )}
                </div>

                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: Math.ceil(imoveis.length / 3) }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setActiveIndex(i);
                                setExpandedCard(null);
                            }}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                i === activeIndex ? "bg-gray-800 w-4" : "bg-gray-300"
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function DestaquesLoadingSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <div className="h-8 w-64 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse" />
                <div className="h-4 w-96 bg-gray-100 rounded-lg mx-auto animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                        <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                        <div className="p-4">
                            <div className="h-6 w-3/4 bg-gray-200 rounded-lg mb-2 animate-pulse" />
                            <div className="h-4 w-1/2 bg-gray-100 rounded-lg mb-4 animate-pulse" />
                            <div className="flex gap-4 mb-4">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="h-4 w-8 bg-gray-100 rounded-lg animate-pulse" />
                                ))}
                            </div>
                            <div className="h-6 w-1/3 bg-gray-200 rounded-lg animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DestaquesEstrategicos;