'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    Shield,
    Award,
    Clock,
    Heart,
    Building2,
    CheckCircle,
    Users,
    FileCheck,
    Home,
    Star,
    Phone,
    MessageSquare,
    ThumbsUp,
    BadgeCheck,
    Handshake,
    Key,
    Calendar,
    HeartHandshake,
    MapPin,
    TreePine,
    Coffee,
    Mountain,
    Camera,
    Zap,
    Timer,
    UserCheck,
    ArrowRight,
    Search,
    FileText,
    Banknote,
    UserX,
    Target,
    Eye,
    TrendingUp,
    ClipboardCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Interfaces
interface GuararemasDistrict {
    id: string;
    name: string;
    description: string;
    averagePrice: string;
    highlights: string[];
    growth: string;
    marketTrend: string;
}

interface ProcessStep {
    id: string;
    step: number;
    title: string;
    description: string;
    duration: string;
    icon: React.ReactNode;
    details: string[];
}

interface ServiceSpecialty {
    id: string;
    title: string;
    description: string;
    features: string[];
    icon: React.ReactNode;
    timeline: string;
    outcome: string;
}

interface MarketInsight {
    id: string;
    metric: string;
    value: string;
    context: string;
    icon: React.ReactNode;
    trend: 'up' | 'stable' | 'down';
}

interface ClientTestimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    location: string;
    propertyType: string;
    transactionYear: string;
    resultAchieved: string;
}

export interface ValorAprimoradoProps {
    properties?: any[];
    title?: string;
    description?: string;
    ctaLink?: string;
    ctaText?: string;
    badge?: string;
}

// Dados das regiões com análise de mercado
const guararemasRegions: GuararemasDistrict[] = [
    {
        id: "centro-historico",
        name: "Centro Histórico",
        description: "Localização estratégica com infraestrutura consolidada e valorização constante devido ao patrimônio preservado e proximidade aos serviços essenciais.",
        averagePrice: "R$ 420.000",
        growth: "+8% ao ano",
        marketTrend: "Valorização estável",
        highlights: ["Patrimônio tombado", "Comércio estabelecido", "Transporte público", "Infraestrutura completa"]
    },
    {
        id: "zona-rural",
        name: "Propriedades Rurais",
        description: "Segmento premium com crescente demanda urbana, oferecendo qualidade de vida diferenciada e potencial de valorização acima da média regional.",
        averagePrice: "R$ 680.000",
        growth: "+12% ao ano",
        marketTrend: "Alta demanda",
        highlights: ["Grandes terrenos", "Natureza preservada", "Privacidade total", "Investimento sólido"]
    },
    {
        id: "novos-desenvolvimentos",
        name: "Novos Loteamentos",
        description: "Áreas de expansão planejada com excelente custo-benefício e infraestrutura moderna, ideais para investidores e primeiros compradores.",
        averagePrice: "R$ 320.000",
        growth: "+15% ao ano",
        marketTrend: "Crescimento acelerado",
        highlights: ["Infraestrutura nova", "Financiamento facilitado", "Potencial de valorização", "Segurança planejada"]
    }
];

// Processo de atendimento estruturado
const onboardingProcess: ProcessStep[] = [
    {
        id: "consulta-inicial",
        step: 1,
        title: "Consulta Estratégica",
        description: "Análise completa do seu perfil, objetivos e capacidade de investimento para definir a estratégia mais adequada.",
        duration: "45-60 minutos",
        icon: <Search className="w-6 h-6" />,
        details: [
            "Entrevista detalhada sobre necessidades",
            "Análise de capacidade financeira",
            "Definição de critérios de busca",
            "Orientação sobre documentação necessária"
        ]
    },
    {
        id: "curadoria-imoveis",
        step: 2,
        title: "Curadoria Especializada",
        description: "Seleção criteriosa de imóveis que atendem seus requisitos, com análise técnica e de mercado de cada oportunidade.",
        duration: "2-5 dias úteis",
        icon: <Target className="w-6 h-6" />,
        details: [
            "Pesquisa ativa no mercado local",
            "Verificação de documentação",
            "Análise de precificação",
            "Preparação de relatório detalhado"
        ]
    },
    {
        id: "visitas-acompanhadas",
        step: 3,
        title: "Visitas Técnicas",
        description: "Acompanhamento personalizado nas visitas com orientação técnica sobre aspectos estruturais, legais e de investimento.",
        duration: "Conforme agenda",
        icon: <Eye className="w-6 h-6" />,
        details: [
            "Inspeção técnica do imóvel",
            "Análise da localização",
            "Verificação de documentos in loco",
            "Orientação sobre pontos de atenção"
        ]
    },
    {
        id: "negociacao-especializaca",
        step: 4,
        title: "Negociação Profissional",
        description: "Estruturação e condução da negociação com foco em obter as melhores condições comerciais e contratuais.",
        duration: "3-7 dias úteis",
        icon: <Handshake className="w-6 h-6" />,
        details: [
            "Análise de proposta comercial",
            "Negociação de preço e condições",
            "Estruturação do financiamento",
            "Elaboração de contrato preliminar"
        ]
    },
    {
        id: "finalizacao-suporte",
        step: 5,
        title: "Finalização e Entrega",
        description: "Acompanhamento completo do processo até a escrituração, garantindo segurança jurídica e transparência total.",
        duration: "15-30 dias",
        icon: <ClipboardCheck className="w-6 h-6" />,
        details: [
            "Acompanhamento da documentação",
            "Coordenação com cartório",
            "Suporte no financiamento",
            "Entrega das chaves"
        ]
    }
];

// Especialidades da imobiliária
const coreServices: ServiceSpecialty[] = [
    {
        id: "aquisicao-residencial",
        title: "Aquisição Residencial",
        description: "Consultoria completa para compra de imóvel residencial com foco em análise de investimento e adequação familiar.",
        timeline: "30-60 dias",
        outcome: "Imóvel adequado ao orçamento e necessidades",
        features: [
            "Análise de capacidade de pagamento",
            "Pesquisa de mercado direcionada",
            "Suporte em financiamento imobiliário",
            "Acompanhamento pós-compra"
        ],
        icon: <Home className="w-6 h-6" />
    },
    {
        id: "comercializacao-imoveis",
        title: "Comercialização Estratégica",
        description: "Venda de imóveis com estratégia de marketing direcionado e precificação baseada em análise comparativa de mercado.",
        timeline: "22-45 dias",
        outcome: "Venda pelo melhor preço de mercado",
        features: [
            "Avaliação técnica precisa",
            "Marketing digital especializado",
            "Qualificação rigorosa de compradores",
            "Negociação profissional"
        ],
        icon: <Key className="w-6 h-6" />
    },
    {
        id: "consultoria-investimento",
        title: "Consultoria em Investimentos",
        description: "Orientação especializada para investidores em análise de oportunidades e estratégias de rentabilidade no mercado local.",
        timeline: "Ongoing",
        outcome: "Portfolio imobiliário otimizado",
        features: [
            "Análise de potencial de valorização",
            "Estudos de viabilidade",
            "Diversificação de portfolio",
            "Acompanhamento de performance"
        ],
        icon: <TrendingUp className="w-6 h-6" />
    }
];

// Insights de mercado
const marketInsights: MarketInsight[] = [
    {
        id: "time-market",
        metric: "Tempo Médio de Venda",
        value: "22 dias",
        context: "vs. 45-60 dias média regional",
        icon: <Clock className="w-7 h-7" />,
        trend: "up"
    },
    {
        id: "client-economy",
        metric: "Economia Média",
        value: "R$ 28.000",
        context: "em custos de transação otimizados",
        icon: <Banknote className="w-7 h-7" />,
        trend: "up"
    },
    {
        id: "market-coverage",
        metric: "Cobertura de Mercado",
        value: "85%",
        context: "dos imóveis disponíveis em Guararema",
        icon: <Shield className="w-7 h-7" />,
        trend: "stable"
    },
    {
        id: "satisfaction-rate",
        metric: "Índice de Satisfação",
        value: "4.8/5.0",
        context: "baseado em 180+ avaliações",
        icon: <Award className="w-7 h-7" />,
        trend: "up"
    }
];

// Casos de estudo
const clientCases: ClientTestimonial[] = [
    {
        id: "executivo-relocation",
        name: "Marcus Vinícius S.",
        role: "Executivo",
        content: "A mudança de São Paulo para Guararema exigia análise criteriosa do mercado local. A Ipê forneceu dados precisos sobre valorização e me orientou na escolha de uma propriedade com excelente potencial de investimento. O processo foi conduzido com total profissionalismo.",
        rating: 5,
        location: "Centro Histórico",
        propertyType: "Casa histórica 280m²",
        transactionYear: "2024",
        resultAchieved: "Economia de 15% no valor inicialmente proposto"
    },
    {
        id: "investidor-portfolio",
        name: "Patricia M. Lima",
        role: "Investidora",
        content: "Como investidora, preciso de dados consistentes e análise técnica rigorosa. A consultoria da Ipê me ajudou a identificar uma oportunidade em área de expansão que já valorizou 18% em 8 meses. Recomendo para quem busca seriedade no mercado imobiliário.",
        rating: 5,
        location: "Novos Loteamentos",
        propertyType: "Terreno 1.200m²",
        transactionYear: "2024",
        resultAchieved: "ROI de 18% em 8 meses"
    },
    {
        id: "familia-primeiro-imovel",
        name: "Roberto & Carla F.",
        role: "Primeiros Compradores",
        content: "Nossa primeira compra imobiliária foi conduzida com total transparência e orientação detalhada sobre cada etapa. A Ipê nos ajudou a estruturar o financiamento nas melhores condições e encontrar um imóvel que atendesse nossas necessidades familiares dentro do orçamento.",
        rating: 5,
        location: "Zona Residencial",
        propertyType: "Casa 3 dormitórios",
        transactionYear: "2023",
        resultAchieved: "Financiamento 0,5% abaixo da taxa média"
    }
];

// Componentes especializados
const RegionCard = ({ region }: { region: GuararemasDistrict }) => {
    const trendColors = {
        "Valorização estável": "text-blue-600 bg-blue-50",
        "Alta demanda": "text-amber-600 bg-amber-50",
        "Crescimento acelerado": "text-green-600 bg-green-50"
    };

    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 relative group"
        >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />

            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{region.name}</h3>
                    <p className="text-amber-600 font-semibold text-lg">{region.averagePrice}</p>
                </div>
                <div className="text-right">
                    <div className="text-green-600 font-semibold text-sm">{region.growth}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${trendColors[region.marketTrend as keyof typeof trendColors]}`}>
                        {region.marketTrend}
                    </span>
                </div>
            </div>

            <p className="text-gray-600 mb-6 text-sm leading-relaxed">{region.description}</p>

            <div className="grid grid-cols-2 gap-2">
                {region.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-700">
                        <CheckCircle className="w-3 h-3 mr-1 text-amber-500" />
                        {highlight}
                    </div>
                ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </motion.div>
    );
};

const ProcessStepCard = ({ step, isActive, onClick }: { step: ProcessStep; isActive: boolean; onClick: () => void }) => {
    return (
        <motion.div
            className={cn(
                "cursor-pointer rounded-2xl p-6 transition-all duration-300 border-2",
                isActive
                    ? "bg-amber-50 border-amber-300 shadow-lg"
                    : "bg-white border-gray-200 hover:border-amber-200 hover:shadow-md"
            )}
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-center gap-4 mb-4">
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                    isActive ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600"
                )}>
                    {step.step}
                </div>
                <div className={cn(
                    "p-3 rounded-lg",
                    isActive ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-600"
                )}>
                    {step.icon}
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{step.description}</p>
            <div className="text-amber-600 text-xs font-semibold">{step.duration}</div>

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-amber-200"
                    >
                        <ul className="space-y-2">
                            {step.details.map((detail, index) => (
                                <li key={index} className="flex items-center text-xs text-gray-700">
                                    <CheckCircle className="w-3 h-3 mr-2 text-amber-500" />
                                    {detail}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const ServiceSpecialtyCard = ({ service }: { service: ServiceSpecialty }) => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative group"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                    {service.icon}
                </div>
                <div className="text-right">
                    <div className="text-amber-600 font-semibold text-sm">{service.timeline}</div>
                    <div className="text-gray-500 text-xs">Prazo médio</div>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="text-green-800 font-semibold text-xs mb-1">Resultado Esperado:</div>
                <div className="text-green-700 text-sm">{service.outcome}</div>
            </div>

            <div className="space-y-2">
                {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-3 h-3 mr-2 text-amber-500 flex-shrink-0" />
                        {feature}
                    </div>
                ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </motion.div>
    );
};

const MarketInsightCard = ({ insight }: { insight: MarketInsight }) => {
    const trendColors = {
        up: "text-green-600 bg-green-50",
        stable: "text-blue-600 bg-blue-50",
        down: "text-red-600 bg-red-50"
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center"
        >
            <div className={cn("inline-flex p-3 rounded-xl mb-4", trendColors[insight.trend])}>
                {insight.icon}
            </div>
            <h3 className="text-2xl font-bold mb-1 text-gray-900">{insight.value}</h3>
            <p className="text-gray-800 font-semibold text-sm mb-2">{insight.metric}</p>
            <p className="text-gray-500 text-xs">{insight.context}</p>
        </motion.div>
    );
};

const TestimonialCard = ({ testimonial }: { testimonial: ClientTestimonial }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 relative"
        >
            <div className="absolute top-4 right-4">
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {testimonial.transactionYear}
                </span>
            </div>

            <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={i < testimonial.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                    />
                ))}
            </div>

            <p className="text-gray-700 mb-4 italic text-sm leading-relaxed">"{testimonial.content}"</p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="text-green-800 font-semibold text-xs mb-1">Resultado Obtido:</div>
                <div className="text-green-700 text-xs">{testimonial.resultAchieved}</div>
            </div>

            <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                        <p className="text-xs text-gray-600">{testimonial.role}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-medium text-gray-800">{testimonial.propertyType}</p>
                        <p className="text-xs text-gray-500 flex items-center justify-end">
                            <MapPin size={8} className="mr-1" />
                            {testimonial.location}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Componente principal
const ValorAprimoradoComponent: React.FC<ValorAprimoradoProps> = ({
    properties = [],
    title,
    description,
    ctaLink,
    ctaText,
    badge
}) => {
    const [activeProcessStep, setActiveProcessStep] = useState(0);

    // Auto-rotação do processo
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveProcessStep((prev) => (prev + 1) % onboardingProcess.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                {/* Header institucional */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto"
                    >
                        <span className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold mb-6">
                            <Building2 className="w-4 h-4 mr-2" />
                            Expertise consolidada em Guararema há 15 anos
                        </span>

                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                            Consultoria Imobiliária
                            <span className="block text-amber-600 mt-2">Especializada</span>
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed mb-12 max-w-4xl mx-auto">
                            Oferecemos consultoria técnica especializada para <strong>aquisição</strong>, <strong>comercialização</strong> e
                            <strong> investimento imobiliário</strong> em Guararema, com metodologia estruturada e
                            resultados mensuráveis para cada cliente.
                        </p>
                    </motion.div>
                </div>

                {/* Métricas de performance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
                >
                    {marketInsights.map((insight) => (
                        <MarketInsightCard key={insight.id} insight={insight} />
                    ))}
                </motion.div>

                {/* Seção principal com imagem */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                    {/* Conteúdo explicativo */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                Metodologia Comprovada de Resultados
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                Nossa abordagem estruturada combina <strong>análise técnica de mercado</strong>,
                                <strong> expertise local</strong> e <strong>acompanhamento personalizado</strong> para
                                garantir que cada transação seja conduzida com máxima eficiência e segurança.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Due Diligence Completa</h3>
                                    <p className="text-gray-600">Análise jurídica, técnica e de mercado de cada oportunidade para minimizar riscos e maximizar retorno.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Target className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Estratégia Direcionada</h3>
                                    <p className="text-gray-600">Curadoria especializada baseada no seu perfil e objetivos, com foco em resultados mensuráveis.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Otimização de Tempo</h3>
                                    <p className="text-gray-600">Processos estruturados que reduzem o tempo de transação sem comprometer a qualidade da análise.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Imagem institucional */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-amber-500 p-1">
                            <div className="bg-white rounded-xl overflow-hidden">
                                <Image
                                    src="/images/predioIpe.png"
                                    alt="Sede da Imobiliária Ipê em Guararema - Consultoria imobiliária especializada"
                                    width={600}
                                    height={800}
                                    className="w-full aspect-[3/4] object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Badge de credibilidade */}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                            <div className="bg-white text-gray-900 px-6 py-4 rounded-2xl shadow-xl border border-amber-200">
                                <div className="flex items-center space-x-3">
                                    <Award className="w-6 h-6 text-amber-600" />
                                    <div className="text-left">
                                        <div className="font-bold text-sm">Sede em Guararema</div>
                                        <div className="text-xs text-gray-600">15 anos de atuação local</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Processo de atendimento interativo */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Como Funciona Nossa Consultoria
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Processo estruturado em 5 etapas para garantir <strong>análise completa</strong>,
                            <strong> negociação otimizada</strong> e <strong>resultados superiores</strong> em sua transação imobiliária.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {onboardingProcess.map((step, index) => (
                            <ProcessStepCard
                                key={step.id}
                                step={step}
                                isActive={activeProcessStep === index}
                                onClick={() => setActiveProcessStep(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Especialidades de serviço */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Áreas de Especialização
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Serviços especializados com metodologia própria e resultados documentados para cada segmento de atuação.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {coreServices.map((service) => (
                            <ServiceSpecialtyCard key={service.id} service={service} />
                        ))}
                    </div>
                </div>

                {/* Análise regional */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Análise de Mercado Regional
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Análise técnica das principais regiões de Guararema com dados de <strong>valorização histórica</strong>,
                            <strong> tendências de mercado</strong> e <strong>potencial de investimento</strong>.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {guararemasRegions.map((region) => (
                            <RegionCard key={region.id} region={region} />
                        ))}
                    </div>
                </div>

                {/* Cases de sucesso */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Casos de Sucesso
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Resultados mensuráveis obtidos através de nossa metodologia especializada em diferentes perfis de cliente e tipo de transação.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {clientCases.map((testimonial) => (
                            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                        ))}
                    </div>
                </div>

                {/* CTA institucional */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gray-900 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <Building2 className="w-16 h-16 text-amber-400 mx-auto mb-6" />

                        <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                            Consultoria Inicial
                        </h3>

                        <p className="text-xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Agende uma <strong>análise técnica gratuita</strong> da sua demanda imobiliária.
                            Receba orientação especializada sobre <strong>oportunidades de mercado</strong>,
                            <strong> estratégias de investimento</strong> e <strong>estruturação financeira</strong> adequada ao seu perfil.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Link
                                href="/contato"
                                className="inline-flex items-center justify-center px-8 py-4 bg-amber-500 text-gray-900 rounded-xl font-bold hover:bg-amber-400 transition-all shadow-lg transform hover:scale-105"
                            >
                                <MessageSquare className="w-5 h-5 mr-2" />
                                Agendar Consultoria
                            </Link>
                            <Link
                                href="https://wa.me/5511981845016"
                                target="_blank"
                                className="inline-flex items-center justify-center px-8 py-4 bg-stone-700 text-white rounded-xl font-semibold hover:bg-stone-600 transition-all shadow-lg transform hover:scale-105"
                            >
                                <Phone className="w-5 h-5 mr-2" />
                                WhatsApp Direto
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                            <div className="text-center">
                                <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                                <div className="text-sm font-semibold">Resposta em 24h</div>
                            </div>
                            <div className="text-center">
                                <Shield className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                                <div className="text-sm font-semibold">Análise técnica gratuita</div>
                            </div>
                            <div className="text-center">
                                <UserCheck className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                                <div className="text-sm font-semibold">Atendimento personalizado</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default ValorAprimoradoComponent;