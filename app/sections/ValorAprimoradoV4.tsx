'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Calculator, Home, Clock, Mail, Phone, Check, CalendarDays, FileText, Calendar, Sparkles, TrendingUp, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

// Extend Window interface for analytics
declare global {
    interface Window {
        __officeImageInteraction?: { startTime: number };
        dataLayer?: Array<Record<string, unknown>>;
    }
}

// TypeScript interfaces for better type safety
type ServiceKey = 'compra' | 'venda' | 'gestao';

interface ServiceInfo {
    title: string;
    description: string;
    points: string[];
    icon: React.ReactNode;
}

interface ServicesData {
    compra: ServiceInfo;
    venda: ServiceInfo;
    gestao: ServiceInfo;
}

interface FaqItem {
    question: string;
    answer: string;
}

interface LeadFormState {
    name: string;
    email: string;
    interest: ServiceKey;
}

export default function ValorAprimoradoModerno() {
    const [activeService, setActiveService] = useState<ServiceKey>('compra');
    const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
    const [leadForm, setLeadForm] = useState<LeadFormState>({
        name: '',
        email: '',
        interest: 'compra'
    });
    const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
    const [showMetrics, setShowMetrics] = useState(false);

    const handleLeadSubmit = () => {
        if (!leadForm.name.trim() || !leadForm.email.trim()) {
            alert('Por favor, preencha seu nome e e-mail.');
            return;
        }
        alert(`Obrigado, ${leadForm.name}! Entraremos em contato pelo e-mail ${leadForm.email} em breve.`);
        setLeadForm({ name: '', email: '', interest: 'compra' });
    };

    const services: ServicesData = {
        compra: {
            title: "Encontrar Imóvel",
            description: "Auxiliamos você a encontrar o imóvel ideal em Guararema",
            icon: <Home className="w-5 h-5" />,
            points: [
                "Análise das suas necessidades específicas",
                "Seleção de imóveis que atendem seu perfil",
                "Acompanhamento em visitas e negociação",
                "Orientação sobre documentação e financiamento"
            ]
        },
        venda: {
            title: "Vender Imóvel",
            description: "Estratégia personalizada para venda do seu imóvel",
            icon: <Calculator className="w-5 h-5" />,
            points: [
                "Avaliação profissional baseada no mercado atual",
                "Divulgação nos principais canais de venda",
                "Qualificação e acompanhamento de interessados",
                "Assessoria completa até o fechamento"
            ]
        },
        gestao: {
            title: "Gestão de Aluguel",
            description: "Administração completa do seu imóvel para aluguel",
            icon: <CalendarDays className="w-5 h-5" />,
            points: [
                "Seleção criteriosa de inquilinos qualificados",
                "Gestão de contratos e recebimentos",
                "Acompanhamento de manutenções necessárias",
                "Relatórios periódicos de rentabilidade"
            ]
        }
    };

    const faqItems: FaqItem[] = [
        {
            question: "Quais são os principais custos ao vender um imóvel?",
            answer: "Os custos mais comuns incluem a comissão de corretagem (geralmente entre 5% e 6% do valor de venda), despesas com documentação, certidões e registro de escritura. Dependendo da situação, pode haver incidência de imposto de renda sobre o ganho de capital. Para imóveis que intermediamos, fornecemos estimativa detalhada dos custos envolvidos."
        },
        {
            question: "Quanto tempo leva para vender um imóvel em Guararema?",
            answer: "O prazo médio varia bastante dependendo do tipo de imóvel, localização e condições de mercado. Imóveis bem precificados e com boa apresentação tendem a vender mais rapidamente. Fatores como documentação em ordem e marketing adequado também influenciam bastante no tempo de venda. Nossa equipe trabalha para otimizar cada etapa e agilizar o processo ao máximo."
        },
        {
            question: "Vale a pena contratar administração de imóveis?",
            answer: "A administração profissional oferece diversos benefícios como seleção criteriosa de inquilinos, gestão de manutenções, cobrança de aluguéis e resolução de questões do dia a dia. Para proprietários que não têm tempo ou experiência para gerir seus imóveis, costuma ser uma opção interessante. Nossa equipe cuida de toda a parte operacional, permitindo que você tenha tranquilidade e tempo livre."
        },
        {
            question: "Vocês trabalham com financiamento imobiliário?",
            answer: "Sim, temos parcerias com instituições financeiras da região. Para clientes em negociações conosco, auxiliamos com orientações sobre documentação, processo de aprovação e avaliação do imóvel. Nossa experiência ajuda a tornar o processo de financiamento mais fluido."
        },
        {
            question: "Como é feita a avaliação e precificação de um imóvel?",
            answer: "Realizamos uma análise completa considerando diversos fatores: localização, estado de conservação, tamanho, características do imóvel e valores praticados na região. Também levamos em conta o momento do mercado e tendências atuais. Nosso objetivo é encontrar um preço competitivo que atraia compradores qualificados e garanta uma boa negociação para você."
        },
        {
            question: "Quais documentos são necessários para vender meu imóvel?",
            answer: "Documentação essencial: escritura ou registro de imóvel, certidões negativas (federal, estadual, municipal), IPTU quitado, declaração de confrontantes, planta baixa aprovada, habite-se (quando aplicável) e documentos pessoais. Para imóveis anunciados conosco, auxiliamos na verificação documental e orientamos sobre regularizações quando necessário."
        },
        {
            question: "Como é calculada a comissão de corretagem?",
            answer: "Nossa comissão é negociada individualmente, considerando fatores como valor do imóvel, complexidade da transação, prazo para venda e serviços inclusos. Trabalhamos com percentuais competitivos no mercado e transparência total sobre todos os custos envolvidos."
        },
        {
            question: "Vocês oferecem consultoria para investidores?",
            answer: "Sim, atendemos investidores interessados no mercado imobiliário de Guararema e região. Compartilhamos nossa expertise local sobre potencial de valorização, características do mercado e oportunidades disponíveis. Nosso conhecimento da região ajuda investidores a tomar decisões mais informadas."
        },
        {
            question: "Como garantem a segurança jurídica das transações?",
            answer: "Orientamos sobre todas as verificações documentais importantes e acompanhamos o processo de perto. Para transações intermediadas por nós, auxiliamos na identificação de possíveis pendências, sempre trabalhando com transparência e atenção aos detalhes para sua segurança."
        },
        {
            question: "Atendem imóveis em outras cidades da região?",
            answer: "Atendemos Guararema e região metropolitana, incluindo Mogi das Cruzes, Jacareí, Santa Isabel e São José dos Campos. Nossa expertise local nos permite oferecer assessoria qualificada sobre as particularidades de cada mercado regional."
        },
        {
            question: "Qual o suporte oferecido pós-venda?",
            answer: "Mantemos relacionamento de longo prazo com nossos clientes. Oferecemos orientações sobre o processo de escrituração, esclarecimentos sobre documentação quando necessário e indicação de profissionais qualificados da região. Estamos disponíveis para futuras consultorias imobiliárias."
        },
        {
            question: "Como funciona a avaliação do meu imóvel?",
            answer: "Para imóveis anunciados conosco, oferecemos avaliação completa incluindo análise de mercado e precificação estratégica. Nossa consultoria ajuda a posicionar seu imóvel de forma competitiva, considerando características, localização e momento do mercado regional."
        }
    ];

    return (
        <div className="bg-white">
            {/* Services Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-full text-sm font-semibold mb-4">
                                <Sparkles className="w-4 h-4 text-amber-700" />
                                <span className="text-amber-800">SERVIÇOS ESPECIALIZADOS</span>
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Como Podemos <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Ajudar Você</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Consultoria especializada em todas as etapas do processo imobiliário em Guararema
                            </p>
                        </motion.div>

                        {/* Service Navigation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex flex-wrap justify-center gap-3 mb-12"
                        >
                            {Object.entries(services).map(([key, service], index) => (
                                <motion.button
                                    key={key}
                                    onClick={() => setActiveService(key as ServiceKey)}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={cn(
                                        "px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                                        activeService === key
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:shadow-md'
                                    )}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className={cn(
                                            "transition-colors duration-200",
                                            activeService === key ? 'text-white' : 'text-gray-500'
                                        )}>
                                            {service.icon}
                                        </div>
                                        {service.title}
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>

                        {/* Service Content */}                        <div
                            key={activeService}
                            className="bg-gradient-to-b from-white to-gray-50 rounded-lg p-8 shadow-md border border-gray-100"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 border-b border-gray-200 pb-6">
                                <div className="p-3.5 rounded-md bg-amber-100/80 text-amber-700 shadow-sm">
                                    <div
                                        className="w-7 h-7">
                                        {services[activeService].icon}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-medium text-gray-800 mb-2">
                                        {services[activeService].title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {services[activeService].description}
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {services[activeService].points.map((point, index) => (<div
                                    key={index}
                                    className="flex items-start space-x-3"
                                >
                                    <div className="flex-shrink-0 rounded-full p-1.5 bg-amber-100 text-amber-700 mt-0.5 shadow-sm">
                                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-gray-700 leading-relaxed">{point}</span>
                                </div>
                                ))}
                            </div>                            <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                                <button
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow hover:scale-[1.03] active:scale-[0.97]"
                                >
                                    Saiba mais sobre este serviço
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                                        <path d="M1.16669 7H12.8334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7 1.16663L12.8333 6.99996L7 12.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Section - Strategic Implementation */}
            <section className="py-12 md:py-20 lg:py-24 bg-white relative overflow-hidden isolate">
                {/* Advanced Background System */}
                <div className="absolute inset-0 -z-10">
                    {/* Gradient mesh */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.08)_0%,transparent_40%),radial-gradient(ellipse_at_bottom_left,rgba(203,213,225,0.15)_0%,transparent_50%)]" />
                    {/* Noise texture overlay */}
                    <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
                </div>
                
                <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
                    <div className="max-w-7xl mx-auto">
                        {/* Grid with aspect ratio preservation */}
                        <div className="grid lg:grid-cols-12 gap-8 md:gap-10 lg:gap-14 items-center">
                            {/* Image Container - 7 columns */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-120px" }}
                                transition={{ 
                                    duration: 0.9, 
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                    opacity: { duration: 0.7 }
                                }}
                                className="lg:col-span-7 relative group/container"
                                onMouseEnter={() => {
                                    if (typeof window !== 'undefined') {
                                        const startTime = Date.now();
                                        window.__officeImageInteraction = { startTime };
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (typeof window !== 'undefined' && window.__officeImageInteraction) {
                                        const duration = Date.now() - window.__officeImageInteraction.startTime;
                                        window.dataLayer = window.dataLayer || [];
                                        window.dataLayer.push({
                                            event: 'office_image_interaction',
                                            section: 'nossa_estrutura',
                                            interaction_type: 'hover',
                                            duration_ms: duration,
                                            engagement_level: duration > 2000 ? 'high' : duration > 800 ? 'medium' : 'low'
                                        });
                                        delete window.__officeImageInteraction;
                                    }
                                }}
                            >
                                {/* Decorative frame system */}
                                <div className="absolute -inset-4 bg-gradient-to-br from-amber-100/20 via-transparent to-slate-100/20 rounded-2xl blur-2xl opacity-0 group-hover/container:opacity-100 transition-opacity duration-700" />
                                
                                <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover/container:shadow-[0_20px_60px_rgb(0,0,0,0.08)] transition-shadow duration-500">
                                    {/* Image with parallax effect */}
                                    <motion.div
                                        className="relative aspect-[4/3] overflow-hidden bg-slate-100"
                                        whileHover={{ scale: 1.03 }}
                                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    >
                                        <img
                                            src="/images/escritorio.jpg"
                                            alt="Escritório Nova Ipê - Atendimento Presencial em Guararema"
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        
                                        {/* Progressive overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 via-slate-900/10 to-transparent opacity-0 group-hover/container:opacity-100 transition-opacity duration-500" />
                                        
                                        {/* Scan line effect */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-0 group-hover/container:opacity-100"
                                            animate={{
                                                y: ['-100%', '100%']
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "linear",
                                                repeatDelay: 1
                                            }}
                                        />
                                    </motion.div>
                                    
                                    {/* Info badges with stagger animation */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-transparent backdrop-blur-sm">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.5, duration: 0.6 }}
                                            className="space-y-3"
                                        >
                                            {/* Location badge */}
                                            <div className="flex items-center gap-2.5 text-white/95">
                                                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md">
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">Centro de Guararema</p>
                                                    <p className="text-xs text-white/70">Praça 9 de Julho, 65 - Centro</p>
                                                </div>
                                            </div>
                                            
                                            {/* Operating hours indicator */}
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.7, duration: 0.5 }}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30"
                                            >
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                <span className="text-xs font-medium text-emerald-100">Atendimento presencial disponível</span>
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </div>
                                
                                {/* Floating accent element */}
                                <motion.div
                                    className="absolute -top-3 -right-3 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-2xl"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0.5, 0.3]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </motion.div>

                            {/* Content Container - 5 columns */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-120px" }}
                                transition={{ 
                                    duration: 0.9, 
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                    delay: 0.15
                                }}
                                className="lg:col-span-5 space-y-6 md:space-y-8"
                            >
                                {/* Eyebrow with icon */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.35, duration: 0.5 }}
                                    className="inline-flex items-center gap-2 md:gap-2.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-amber-50 border border-amber-200/50"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    <span className="text-xs font-semibold text-amber-900 tracking-wider uppercase">Infraestrutura Local</span>
                                </motion.div>

                                {/* Title with gradient */}
                                <div className="space-y-3 md:space-y-4">
                                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-[1.15] tracking-tight">
                                        Escritório no coração de{' '}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                                            Guararema
                                        </span>
                                    </h2>
                                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                                        Visite nosso escritório no centro de Guararema para atendimento presencial 
                                        com consultores especializados no mercado imobiliário local.
                                    </p>
                                </div>

                                {/* Enhanced metrics grid - Collapsible on Mobile */}
                                <div className="hidden md:grid grid-cols-2 gap-5 pt-2">
                                    {[
                                        {
                                            id: 'experience',
                                            icon: <Calendar className="w-5 h-5" />,
                                            value: "15",
                                            unit: "anos",
                                            label: "De atuação local",
                                            gradient: "from-blue-500 to-cyan-500",
                                            hoverGradient: "from-blue-600 to-cyan-600"
                                        },
                                        {
                                            id: 'focus',
                                            icon: <MapPin className="w-5 h-5" />,
                                            value: "Guararema",
                                            unit: "",
                                            label: "Foco regional",
                                            gradient: "from-amber-500 to-orange-500",
                                            hoverGradient: "from-amber-600 to-orange-600"
                                        }
                                    ].map((metric, index) => (
                                        <motion.div
                                            key={metric.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ 
                                                delay: 0.5 + index * 0.08, 
                                                duration: 0.6,
                                                ease: [0.25, 0.46, 0.45, 0.94]
                                            }}
                                            whileHover={{ y: -4, scale: 1.02 }}
                                            onHoverStart={() => {
                                                setHoveredMetric(metric.id);
                                                if (typeof window !== 'undefined') {
                                                    window.dataLayer = window.dataLayer || [];
                                                    window.dataLayer.push({
                                                        event: 'metric_interaction',
                                                        metric_id: metric.id,
                                                        metric_value: metric.value,
                                                        section: 'nossa_estrutura',
                                                        interaction_type: 'hover'
                                                    });
                                                }
                                            }}
                                            onHoverEnd={() => setHoveredMetric(null)}
                                            className="group/metric relative cursor-pointer"
                                        >
                                            {/* Card background with gradient border */}
                                            <div className="relative p-5 rounded-xl bg-white border-2 border-slate-100 group-hover/metric:border-transparent transition-colors duration-300 shadow-sm group-hover/metric:shadow-lg">
                                                {/* Gradient border on hover */}
                                                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${hoveredMetric === metric.id ? metric.hoverGradient : metric.gradient} opacity-0 group-hover/metric:opacity-100 transition-opacity duration-300 -z-10`} 
                                                     style={{ padding: '2px' }}>
                                                    <div className="w-full h-full bg-white rounded-[10px]" />
                                                </div>
                                                    
                                                    {/* Icon container */}
                                                    <motion.div
                                                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${metric.gradient} text-white flex items-center justify-center mb-4 shadow-sm`}
                                                        whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                                                        transition={{ duration: 0.5 }}
                                                    >
                                                        {metric.icon}
                                                    </motion.div>
                                                    
                                                    {/* Value */}
                                                    <div className="flex items-baseline gap-1 mb-1">
                                                        <span className="text-2xl font-bold text-slate-900 tracking-tight">
                                                            {metric.value}
                                                        </span>
                                                        {metric.unit && (
                                                            <span className="text-sm font-medium text-slate-500">
                                                                {metric.unit}
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Label */}
                                                    <p className="text-xs font-medium text-slate-600 leading-tight">
                                                        {metric.label}
                                                    </p>
                                                    
                                                    {/* Hover indicator */}
                                                    <motion.div
                                                        className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 group-hover/metric:opacity-100"
                                                        animate={hoveredMetric === metric.id ? { scale: [1, 1.3, 1] } : {}}
                                                        transition={{ duration: 0.8, repeat: Infinity }}
                                                    />
                                                </div>
                                            </motion.div>
                                        )
                                    )}
                                </div>

                                {/* Mobile Collapsible Metrics */}
                                <div className="md:hidden">
                                    <button
                                        onClick={() => setShowMetrics(!showMetrics)}
                                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl hover:border-amber-300 transition-all duration-300 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                                                <TrendingUp className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-slate-900">Indicadores</p>
                                                <p className="text-xs text-slate-600">Toque para ver detalhes</p>
                                            </div>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: showMetrics ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown className="w-5 h-5 text-amber-600" />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence>
                                        {showMetrics && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
                                                className="overflow-hidden"
                                            >
                                                <div className="grid grid-cols-2 gap-3 pt-4">
                                                    {[
                                                        {
                                                            id: 'experience',
                                                            icon: <Calendar className="w-4 h-4" />,
                                                            value: "15",
                                                            unit: "anos",
                                                            label: "De atuação local",
                                                            gradient: "from-blue-500 to-cyan-500"
                                                        },
                                                        {
                                                            id: 'focus',
                                                            icon: <MapPin className="w-4 h-4" />,
                                                            value: "Guararema",
                                                            unit: "",
                                                            label: "Foco regional",
                                                            gradient: "from-amber-500 to-orange-500"
                                                        }
                                                    ].map((metric, index) => (
                                                        <motion.div
                                                            key={metric.id}
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className="relative"
                                                        >
                                                            <div className="relative p-4 rounded-xl bg-white border-2 border-slate-100 shadow-sm">
                                                                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${metric.gradient} text-white flex items-center justify-center mb-3`}>
                                                                    {metric.icon}
                                                                </div>
                                                                <div className="flex items-baseline gap-1 mb-1">
                                                                    <span className="text-xl font-bold text-slate-900 tracking-tight">
                                                                        {metric.value}
                                                                    </span>
                                                                    {metric.unit && (
                                                                        <span className="text-xs font-medium text-slate-500">
                                                                            {metric.unit}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs font-medium text-slate-600 leading-tight">
                                                                    {metric.label}
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Enhanced CTA */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                    className="pt-2 md:pt-4 flex items-center gap-3 md:gap-4"
                                >
                                    <a
                                        href="/contato"
                                        className="group/cta inline-flex items-center gap-2 md:gap-2.5 px-5 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-sm shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
                                        onClick={() => {
                                            if (typeof window !== 'undefined') {
                                                window.dataLayer = window.dataLayer || [];
                                                window.dataLayer.push({
                                                    event: 'cta_click',
                                                    cta_type: 'primary',
                                                    cta_text: 'agendar_visita',
                                                    section: 'nossa_estrutura',
                                                    destination: '/contato'
                                                });
                                            }
                                        }}
                                    >
                                        Agendar visita
                                        <motion.div
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
                                                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </motion.div>
                                    </a>
                                    
                                    {/* Secondary CTA */}
                                    <a
                                        href="tel:+5511981845016"
                                        className="group/phone inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors duration-300"
                                        onClick={() => {
                                            if (typeof window !== 'undefined') {
                                                window.dataLayer = window.dataLayer || [];
                                                window.dataLayer.push({
                                                    event: 'cta_click',
                                                    cta_type: 'secondary',
                                                    cta_text: 'phone',
                                                    section: 'nossa_estrutura',
                                                    destination: 'tel:+5511981845016'
                                                });
                                            }
                                        }}
                                    >
                                        <Phone className="w-4 h-4" />
                                        <span className="border-b border-slate-300 group-hover/phone:border-amber-600 transition-colors">
                                            Ligar agora
                                        </span>
                                    </a>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section - Modern Grid Layout */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-amber-50/20 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
                
                <div className="container mx-auto px-4 md:px-6 relative">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="text-center mb-12 md:mb-16"
                        >
                            {/* Professional Badge */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="inline-flex items-center gap-2 md:gap-2.5 px-4 md:px-6 py-2 md:py-3 mb-6 md:mb-8 bg-white border-2 border-slate-200 rounded-full shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300 group"
                            >
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse" />
                                <Shield className="w-4 h-4 md:w-4.5 md:h-4.5 text-slate-700 group-hover:text-amber-600 transition-colors" />
                                <span className="text-xs md:text-sm font-semibold text-slate-700 tracking-wide uppercase">
                                    Dúvidas Frequentes
                                </span>
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse" />
                            </motion.div>

                            {/* Main Title */}
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 md:mb-6 leading-[1.1] tracking-tight px-4">
                                Orientações
                                <span className="block mt-1 md:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                                    Especializadas
                                </span>
                            </h2>

                            {/* Subtitle with Institutional Tone */}
                            <p className="text-base md:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light px-4">
                                Informações precisas e transparentes para suas decisões imobiliárias
                                <span className="hidden md:block mt-2 md:mt-3 text-sm md:text-base">
                                    Expertise consolidada de <strong className="font-semibold text-slate-800">15 anos</strong> em Guararema e região
                                </span>
                            </p>
                        </motion.div>

                        {/* Modern Masonry Grid - 2 columns on desktop, 1 on mobile */}
                        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                            {faqItems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.03 }}
                                    className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:border-amber-300 transition-all duration-300 overflow-hidden group"
                                >
                                    <button
                                        className="flex justify-between items-start w-full p-4 md:p-6 text-left hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/30 transition-all duration-300"
                                        onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                                    >
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                                <span className="text-amber-700 font-bold text-sm md:text-base">{index + 1}</span>
                                            </div>
                                            <span className="font-bold text-gray-900 text-sm md:text-base lg:text-lg leading-snug md:leading-relaxed group-hover:text-amber-700 transition-colors duration-300">
                                                {item.question}
                                            </span>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: activeQuestion === index ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex-shrink-0 ml-3"
                                        >
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg md:rounded-xl flex items-center justify-center group-hover:from-amber-200 group-hover:to-orange-200 transition-colors duration-300">
                                                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-amber-700" />
                                            </div>
                                        </motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {activeQuestion === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-4 md:px-6 pb-4 md:pb-6">
                                                    <div className="ml-0 md:ml-13 border-t border-amber-200 pt-4">
                                                        <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                                                            {item.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>

                        {/* Call to action - Mobile Optimized */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="text-center mt-8 md:mt-12"
                        >
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl md:rounded-2xl p-6 md:p-8 text-white">
                                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                                    Não encontrou sua resposta?
                                </h3>
                                <p className="text-amber-50 mb-5 md:mb-6 text-sm md:text-lg">
                                    Nossa equipe está pronta para esclarecer todas as suas dúvidas
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                                    <a
                                        href="tel:+5511981845016"
                                        className="inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 bg-white text-amber-700 font-semibold rounded-lg hover:bg-amber-50 transition-all duration-200 shadow-lg hover:scale-[1.05] active:scale-[0.95] text-sm md:text-base"
                                    >
                                        <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                                        Ligar Agora
                                    </a>
                                    <a
                                        href="/contato"
                                        className="inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-all duration-200 shadow-lg border-2 border-white/20 hover:scale-[1.05] active:scale-[0.95] text-sm md:text-base"
                                    >
                                        <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                                        Enviar Mensagem
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
