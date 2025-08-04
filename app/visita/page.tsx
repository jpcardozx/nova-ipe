'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Removido framer-motion para evitar problemas de animação em cascata
import {
    ArrowRight, Calendar, Check, ChevronRight, Clock,
    Compass, Eye, FileCheck, Home, MapPin, MessageSquare,
    Shield, Star, TrendingUp, Building2, Lock
} from 'lucide-react';

// Componentes e providers
import OptimizationProvider from '../components/OptimizationProvider';
import WhatsAppButton from '../components/WhatsAppButton';
import SkipToContent from '../components/SkipToContent';
import SectionHeader from '@/components/verified/SectionHeader';
import ClientOnlyNavbar from "../components/ClientOnlyNavbar";
import Footer from "../sections/Footer";

export default function VisitaPage() {
    const heroFeatures = [
        {
            icon: <Building2 className="h-6 w-6 text-accent-yellow" />,
            title: "Acesso especializado",
            desc: "Propriedades não disponíveis no mercado aberto"
        },
        {
            icon: <Shield className="h-6 w-6 text-accent-yellow" />,
            title: "Análise especializada",
            desc: "Avaliação detalhada do potencial de investimento"
        },
        {
            icon: <FileCheck className="h-6 w-6 text-accent-yellow" />,
            title: "Transparência total",
            desc: "Due diligence completa e suporte jurídico"
        }
    ]; const abordagemSteps = [
        {
            number: "01",
            title: "Entendemos suas necessidades",
            description: "Conversamos sobre o que você procura: tamanho da casa, localização preferida, orçamento disponível e o que é mais importante para sua família.",
        },
        {
            number: "02",
            title: "Selecionamos as melhores opções",
            description: "Com base no que você nos contou, preparamos uma lista personalizada dos imóveis que mais fazem sentido para seu perfil e necessidades.",
        },
        {
            number: "03",
            title: "Acompanhamos você nas visitas",
            description: "Nossa equipe vai com você conhecer os imóveis, explicando todos os detalhes e respondendo suas dúvidas sobre a propriedade e a região.",
        }
    ]; const pilaresConsultoria = [
        {
            icon: <Eye className="h-6 w-6 text-brand-green" />,
            title: "Conhecimento da região",
            description: "Nossa equipe conhece muito bem Guararema: os melhores bairros, escolas próximas, comércio local e tudo que importa para o dia a dia das famílias."
        },
        {
            icon: <TrendingUp className="h-6 w-6 text-brand-green" />,
            title: "Informações práticas",
            description: "Compartilhamos dados reais sobre a região: desde valores de mercado até informações sobre infraestrutura, transporte e qualidade de vida."
        },
        {
            icon: <Shield className="h-6 w-6 text-brand-green" />,
            title: "Compra segura",
            description: "Verificamos toda a documentação do imóvel e orientamos você em cada etapa do processo para que tudo seja feito com total segurança."
        }
    ];

    const vantagensMetrics = [
        {
            value: "12%",
            label: "valorização anual",
            description: "Média dos últimos 5 anos, superando em 4x a média da região metropolitana de São Paulo.",
            color: "from-[#1a6f5c] to-[#1a8f70]"
        },
        {
            value: "80km",
            label: "de São Paulo",
            description: "Proximidade estratégica com acesso direto pela Rodovia Presidente Dutra e linha ferroviária.",
            color: "from-[#0D1F2D] to-[#194068]"
        },
        {
            value: "TOP 3",
            label: "em qualidade de vida",
            description: "Ranqueada entre as três melhores cidades para se viver no Estado de São Paulo.",
            color: "from-[#ffcc00] to-[#e6ae00]"
        },
        {
            value: "400%",
            label: "crescimento turístico",
            description: "Expansão expressiva do setor turístico nos últimos 10 anos, impulsionando o mercado imobiliário.",
            color: "from-[#1a6f5c] to-[#1a8f70]"
        }
    ];

    const agendamentoItems = [
        {
            title: "Avaliação de perfil de investidor",
            desc: "Análise personalizada para identificar as melhores oportunidades conforme seus objetivos patrimoniais e financeiros."
        },
        {
            title: "Portfolio de ativos exclusivos",
            desc: "Acesso a propriedades premium não disponíveis no mercado aberto, com potencial de valorização acima da média."
        },
        {
            title: "Análise financeira detalhada",
            desc: "Projeções de valorização, análise de custos e estimativa de retorno sobre investimento para cada propriedade."
        }
    ];

    return (
        <OptimizationProvider>
            <div className={`font-body min-h-screen flex flex-col`}>
                <SkipToContent />
                <ClientOnlyNavbar />

                {/* Hero Section - Seção 1: Cabeçalho de Impacto */}
                <section id="visita-hero" className="relative py-20 lg:py-28 bg-gradient-to-br from-[#0b1c28] via-[#132f41] to-[#0a1922] overflow-hidden">
                    {/* Background Elements sofisticados */}
                    <div className="absolute inset-0">
                        <div className="absolute top-[15%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-[#1a6f5c]/20 blur-[100px] opacity-30"></div>
                        <div className="absolute bottom-[10%] right-[8%] w-[40rem] h-[40rem] rounded-full bg-[#ffcc00]/10 blur-[120px] opacity-20"></div>
                        <div className="absolute top-[40%] right-[25%] w-[25rem] h-[25rem] rounded-full bg-[#f8f4e3]/10 blur-[80px] opacity-10"></div>
                        {/* Linhas geométricas sutis */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-700/30 to-transparent"></div>
                    </div>

                    <div className="container mx-auto px-6 lg:px-8 relative z-10">
                        <div className="max-w-screen-xl mx-auto">
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center gap-2 mb-6">
                                    <div className="h-px w-8 bg-accent-yellow"></div>
                                    <span className="text-neutral-300 tracking-widest uppercase text-caption font-body">Serviço Premium</span>
                                    <div className="h-px w-8 bg-accent-yellow"></div>
                                </div>                                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white font-light leading-tight tracking-tight mb-8 mx-auto max-w-5xl">
                                    Consultoria imobiliária <span className="text-accent-yellow">personalizada</span> em Guararema
                                </h1>

                                <p className="text-neutral-300 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed mb-12 font-body text-body-large md:text-lead">
                                    Acesso especializado às propriedades mais desejadas da região, com análise detalhada de investimento e acompanhamento por especialistas de mercado.
                                </p>

                                <div className="flex flex-wrap justify-center gap-4 mb-16">
                                    <Link
                                        href="#agendar"
                                        className="bg-accent-yellow hover:bg-accent-yellow/90 transition-all text-brand-dark px-8 py-4 rounded-md inline-flex items-center justify-center shadow-lg shadow-accent-yellow/20 hover:shadow-accent-yellow/30 text-button font-body medium-text"
                                    >
                                        Agendar consultoria
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="/portfolio"
                                        className="bg-transparent border border-neutral-600 hover:border-neutral-400 text-white hover:bg-white/5 transition-all px-8 py-4 rounded-md inline-flex items-center justify-center text-button font-body medium-text"
                                    >
                                        Portfólio de imóveis
                                        <ChevronRight className="ml-1 h-5 w-5" />
                                    </Link>
                                </div>

                                {/* Benefícios principais em cards elegantes */}
                                <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
                                    {heroFeatures.map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 hover:border-white/20 transition-all"
                                        >
                                            <div className="bg-brand-dark/60 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                                                {feature.icon}
                                            </div>
                                            <h3 className="text-white medium-text text-body mb-2 font-body">{feature.title}</h3>
                                            <p className="text-neutral-300 text-body-small font-body">{feature.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Imagem premium em tamanho grande */}
                            <div
                                className="relative aspect-[21/9] rounded-xl overflow-hidden shadow-2xl"
                            >
                                <Image
                                    src="/bg3.jpg"
                                    alt="Residência de alto padrão em Guararema"
                                    fill
                                    priority
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 100vw"
                                    quality={90}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 via-amber-800/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="bg-accent-yellow/90 text-brand-dark text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded text-caption font-body">Residencial premium</div>
                                                <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded flex items-center text-caption font-body">
                                                    <Lock className="h-3 w-3 mr-1" /> Acesso especializado
                                                </div>
                                            </div>
                                            <p className="text-white text-xl font-semibold font-body text-heading-4">Condomínio Reserva dos Lagos</p>
                                            <p className="text-neutral-200 flex items-center gap-2 font-body text-body-small">
                                                <MapPin className="h-4 w-4" /> Guararema, SP
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-1 text-sm text-white mb-2 text-caption font-body">
                                                Alto potencial de valorização
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="h-4 w-4 text-accent-yellow" />
                                                <span className="text-accent-yellow medium-text font-body">12% a.a.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Seção 2: Nossa abordagem consultiva */}
                <section id="abordagem" className="py-24 bg-white">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="max-w-screen-xl mx-auto">
                            <div className="mb-16 max-w-3xl mx-auto text-center">                <h2 className="font-display text-3xl md:text-4xl text-brand-dark mb-6 text-heading-2">
                                Acompanhamento Personalizado na Sua Visita
                            </h2>
                                <p className="text-neutral-600 font-body text-body-large">
                                    Nossa equipe acompanha você pessoalmente em cada visita, explicando as características do imóvel, da região e ajudando você a tomar a melhor decisão para sua família.
                                </p>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                                <div>
                                    <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                                        <Image
                                            src="/bg3.jpg"
                                            alt="Consultoria imobiliária especializada"
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    {abordagemSteps.map((step, idx) => (
                                        <div
                                            key={idx}
                                            className="flex gap-6"
                                        >
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand-green semibold-text font-body">
                                                {step.number}
                                            </div>
                                            <div>
                                                <h3 className="text-xl semibold-text text-brand-dark mb-3 font-body text-heading-5">{step.title}</h3>
                                                <p className="text-neutral-600 font-body text-body">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pilares da consultoria */}
                            <div className="grid md:grid-cols-3 gap-8">
                                {pilaresConsultoria.map((card, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-brand-light border border-neutral-200 rounded-lg p-8 hover:shadow-lg transition-all"
                                    >
                                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm border border-neutral-100">
                                            {card.icon}
                                        </div>
                                        <h3 className="text-xl semibold-text text-brand-dark mb-4 font-body text-heading-5">{card.title}</h3>
                                        <p className="text-neutral-600 font-body text-body">{card.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-16 text-center">
                                <Link
                                    href="#agendar"
                                    className="inline-flex items-center gap-2 text-brand-green hover:text-brand-dark transition-colors medium-text font-body text-button"
                                >
                                    Agende sua consultoria personalizada
                                    <ChevronRight className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Nova seção: Vantagens Estratégicas */}
                <section id="vantagens" className="py-24 bg-brand-light/50">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="max-w-screen-xl mx-auto text-center">
                            <div
                                className="max-w-3xl mx-auto mb-16"
                            >                                <h2 className="font-display text-3xl md:text-4xl text-brand-dark mb-6 text-heading-2">
                                    Vantagens exclusivas de investir em Guararema
                                </h2>
                                <p className="text-neutral-600 font-body text-body-large">
                                    Descubra por que a região é considerada estratégica para investidores que buscam
                                    valorização superior à média do mercado, com qualidade de vida e infraestrutura premium.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {vantagensMetrics.map((metric, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                                    >
                                        <div className={`bg-gradient-to-r ${metric.color} h-2`}></div>
                                        <div className="p-8">
                                            <div className="text-4xl semibold-text text-brand-dark mb-1 font-body text-display-3">{metric.value}</div>
                                            <div className="text-neutral-600 medium-text mb-4 uppercase text-sm tracking-wider font-body text-caption">{metric.label}</div>
                                            <p className="text-neutral-500 text-sm font-body text-body-small">{metric.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div
                                className="mt-16 bg-white p-8 rounded-xl shadow-lg border border-neutral-100"
                            >
                                <div className="flex items-center gap-3 mb-6 justify-center">
                                    <Shield className="h-5 w-5 text-brand-green" />
                                    <span className="text-brand-dark semibold-text font-body">Análise de mercado verificada</span>
                                </div>
                                <p className="text-neutral-600 mb-6 font-body text-body">
                                    Todos os dados apresentados são verificados e atualizados trimestralmente por nossa
                                    equipe de análise imobiliária, em parceria com institutos de pesquisa de mercado.
                                </p>
                                <Link
                                    href="/analise-mercado"
                                    className="text-brand-green hover:text-brand-dark transition-colors inline-flex items-center gap-2 medium-text font-body text-button"
                                >
                                    Solicitar relatório completo
                                    <ChevronRight className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Seção 3: Formulário de Agendamento */}
                <section id="agendar" className="py-24 bg-brand-dark">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                            {/* Textos explicativos */}
                            <div
                                className="space-y-10 text-white"
                            >
                                <div>
                                    <div className="inline-flex items-center gap-2 mb-6 opacity-80">
                                        <div className="h-px w-8 bg-accent-yellow"></div>
                                        <span className="text-accent-yellow tracking-widest uppercase text-xs font-body text-caption">Atendimento Exclusivo</span>
                                        <div className="h-px w-8 bg-accent-yellow"></div>
                                    </div>                                    <h2 className="font-display text-3xl md:text-4xl xl:text-5xl leading-tight text-white mb-6 text-heading-2">
                                        Consultoria imobiliária <span className="text-accent-yellow">personalizada</span>
                                    </h2>
                                    <p className="text-neutral-300 max-w-xl text-lg leading-relaxed font-body text-body-large">
                                        Nossos consultores de investimento imobiliário estão disponíveis para uma análise detalhada
                                        das melhores oportunidades em Guararema, adequadas ao seu perfil e objetivos financeiros.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    {agendamentoItems.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-start">
                                            <div className="h-6 w-6 rounded-full bg-accent-yellow/20 text-accent-yellow flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl semibold-text text-white mb-2 font-body text-heading-5">{item.title}</h3>
                                                <p className="text-neutral-300 font-body text-body">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 text-accent-yellow" fill="#ffcc00" />
                                        ))}
                                    </div>
                                    <p className="text-white italic leading-relaxed mb-6 font-body text-body">
                                        "A consultoria da Ipê foi fundamental para nossa decisão de investimento. A análise de mercado aprofundada e o acesso a propriedades exclusivas nos permitiram adquirir um ativo com excelente potencial de valorização."
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-neutral-200"></div>
                                        <div>
                                            <p className="text-white medium-text font-body">Roberto Mendes</p>
                                            <p className="text-neutral-400 text-sm font-body text-caption">CEO, Mendes Investimentos</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Formulário */}
                            <div
                                className="bg-white rounded-xl overflow-hidden shadow-2xl"
                            >
                                <div className="p-1 bg-gradient-to-r from-brand-green to-brand-dark">
                                    <div className="bg-white p-8 rounded-t-lg">
                                        <h3 className="text-2xl semibold-text text-brand-dark mb-2 font-body text-heading-3">Agendar consultoria</h3>
                                        <p className="text-neutral-600 text-sm font-body text-body-small">
                                            Preencha o formulário para solicitar uma reunião com nossa equipe de consultores.
                                            Responderemos em até 4 horas úteis.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <form className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="nome" className="block text-sm medium-text text-neutral-700 mb-1 font-body text-form-label">Nome completo</label>
                                                <input
                                                    type="text"
                                                    id="nome"
                                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent font-body text-form-input"
                                                    placeholder="Seu nome completo"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="telefone" className="block text-sm medium-text text-neutral-700 mb-1 font-body text-form-label">Telefone/WhatsApp</label>
                                                <input
                                                    type="tel"
                                                    id="telefone"
                                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent font-body text-form-input"
                                                    placeholder="(11) 99999-9999"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm medium-text text-neutral-700 mb-1 font-body text-form-label">E-mail</label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent font-body text-form-input"
                                                placeholder="seuemail@exemplo.com"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="tipo-imovel" className="block text-sm medium-text text-neutral-700 mb-1 font-body text-form-label">Tipo de imóvel de interesse</label>
                                                <select
                                                    id="tipo-imovel"
                                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent font-body text-form-input"
                                                >
                                                    <option>Casa em Condomínio</option>
                                                    <option>Apartamento</option>
                                                    <option>Terreno</option>
                                                    <option>Chácara</option>
                                                    <option>Comercial</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="orcamento" className="block text-sm medium-text text-neutral-700 mb-1 font-body text-form-label">Orçamento estimado</label>
                                                <input
                                                    type="text"
                                                    id="orcamento"
                                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent font-body text-form-input"
                                                    placeholder="Ex: R$ 500.000 - R$ 800.000"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="mensagem" className="block text-sm medium-text text-neutral-700 mb-1 font-body text-form-label">Mensagem</label>
                                            <textarea
                                                id="mensagem"
                                                rows={4}
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent font-body text-form-input"
                                                placeholder="Descreva suas necessidades ou dúvidas."
                                            ></textarea>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-neutral-500 font-body text-caption">
                                                <Lock className="inline h-3 w-3 mr-1" /> Seus dados estão seguros.
                                            </div>
                                            <button
                                                type="submit"
                                                className="bg-brand-green hover:bg-brand-green/90 transition-all text-white px-8 py-3 rounded-md inline-flex items-center justify-center shadow-lg shadow-brand-green/20 hover:shadow-brand-green/30 text-button font-body medium-text"
                                            >
                                                Enviar Solicitação
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />

                <WhatsAppButton
                    phoneNumber="5511981845016"
                    message="Olá! Gostaria de agendar uma consultoria imobiliária em Guararema (via página de visita)."
                    pulseAnimation={true}
                    showAfterScroll={true}
                />
            </div>
        </OptimizationProvider>
    );
}
