'use client';

import React from 'react';
import { Montserrat, Italiana } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    ArrowRight, Calendar, Check, ChevronRight, Clock,
    Compass, Eye, FileCheck, Home, MapPin, MessageSquare,
    Shield, Star, TrendingUp, Building2, Lock
} from 'lucide-react';

// Componentes e providers
import OptimizationProvider from '../components/OptimizationProvider';
import WhatsAppButton from '../components/WhatsAppButton';
import SkipToContent from '../components/SkipToContent';
import SectionHeader from '../components/ui/SectionHeader';
import NavbarResponsive from "../components/NavbarResponsive";
import Footer from "../sections/Footer";

// Configuração das fontes
const montSerrat = Montserrat({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
    variable: '--font-montserrat',
});

const italiana = Italiana({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
    variable: '--font-italiana',
});

export default function VisitaPage() {
    return (
        <OptimizationProvider>
            <div className={`${montSerrat.variable} ${italiana.variable} font-sans min-h-screen flex flex-col`}>
                <SkipToContent />
                <NavbarResponsive />

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
                                    <span className="text-neutral-300 font-light tracking-widest uppercase text-xs">Serviço Premium</span>
                                    <div className="h-px w-8 bg-accent-yellow"></div>
                                </div>

                                <h1 className="font-italiana text-5xl md:text-6xl lg:text-7xl text-white font-light leading-tight tracking-tight mb-8 mx-auto max-w-5xl">
                                    Consultoria imobiliária <span className="text-accent-yellow">personalizada</span> em Guararema
                                </h1>

                                <p className="text-neutral-300 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed mb-12">
                                    Acesso exclusivo às propriedades mais desejadas da região, com análise detalhada de investimento e acompanhamento por especialistas de mercado.
                                </p>

                                <div className="flex flex-wrap justify-center gap-4 mb-16">
                                    <Link
                                        href="#agendar"
                                        className="bg-accent-yellow hover:bg-accent-yellow/90 transition-all text-brand-dark font-medium px-8 py-4 rounded-md inline-flex items-center justify-center shadow-lg shadow-accent-yellow/20 hover:shadow-accent-yellow/30"
                                    >
                                        Agendar consultoria
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="/portfolio"
                                        className="bg-transparent border border-neutral-600 hover:border-neutral-400 text-white hover:bg-white/5 transition-all font-medium px-8 py-4 rounded-md inline-flex items-center justify-center"
                                    >
                                        Portfólio de imóveis
                                        <ChevronRight className="ml-1 h-5 w-5" />
                                    </Link>
                                </div>

                                {/* Benefícios principais em cards elegantes */}
                                <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
                                    {[
                                        {
                                            icon: <Building2 className="h-6 w-6 text-accent-yellow" />,
                                            title: "Acesso exclusivo",
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
                                    ].map((feature, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
                                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 hover:border-white/20 transition-all"
                                        >
                                            <div className="bg-brand-dark/60 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                                                {feature.icon}
                                            </div>
                                            <h3 className="text-white font-medium text-lg mb-2">{feature.title}</h3>
                                            <p className="text-neutral-300 text-sm">{feature.desc}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Imagem premium em tamanho grande */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="bg-accent-yellow/90 text-brand-dark text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded">Residencial premium</div>
                                                <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded flex items-center">
                                                    <Lock className="h-3 w-3 mr-1" /> Acesso exclusivo
                                                </div>
                                            </div>
                                            <p className="text-white text-xl font-semibold">Condomínio Reserva dos Lagos</p>
                                            <p className="text-neutral-200 flex items-center gap-2">
                                                <MapPin className="h-4 w-4" /> Guararema, SP
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-1 text-sm text-white mb-2">
                                                Alto potencial de valorização
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="h-4 w-4 text-accent-yellow" />
                                                <span className="text-accent-yellow font-medium">12% a.a.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Seção 2: Nossa abordagem consultiva */}
                <section id="abordagem" className="py-24 bg-white">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="max-w-screen-xl mx-auto">
                            <div className="mb-16 max-w-3xl mx-auto text-center">
                                <h2 className="text-3xl md:text-4xl font-italiana text-brand-dark mb-6">
                                    Consultoria Imobiliária de Alto Valor
                                </h2>
                                <p className="text-neutral-600">
                                    Nossa abordagem vai muito além de uma simples visita. Oferecemos um processo consultivo completo para orientar suas decisões de investimento imobiliário com precisão e segurança.
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
                                    {[
                                        {
                                            number: "01",
                                            title: "Análise de perfil e objetivos",
                                            description: "Realizamos uma avaliação detalhada do seu perfil de investidor, objetivos financeiros e necessidades específicas para direcionar nossa busca com precisão.",
                                        },
                                        {
                                            number: "02",
                                            title: "Seleção estratégica de ativos",
                                            description: "Apresentamos um portfólio exclusivo de propriedades alinhadas ao seu perfil, incluindo oportunidades off-market com alto potencial de valorização.",
                                        },
                                        {
                                            number: "03",
                                            title: "Due diligence completa",
                                            description: "Oferecemos análise documentacional detalhada, avaliação de riscos, estudo de valorização e projeções de retorno sobre investimento.",
                                        },
                                    ].map((step, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                                            className="flex gap-6"
                                        >
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand-green font-semibold">
                                                {step.number}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-brand-dark mb-3">{step.title}</h3>
                                                <p className="text-neutral-600">{step.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Pilares da consultoria */}
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    {
                                        icon: <Eye className="h-6 w-6 text-brand-green" />,
                                        title: "Conhecimento especializado",
                                        description: "Nossa equipe possui expertise em avaliação imobiliária, tendências de mercado e análise de oportunidades de investimento em Guararema."
                                    },
                                    {
                                        icon: <TrendingUp className="h-6 w-6 text-brand-green" />,
                                        title: "Inteligência de mercado",
                                        description: "Fornecemos dados exclusivos sobre valorização, desenvolvimento urbano e projeções de retorno sobre investimento na região."
                                    },
                                    {
                                        icon: <Shield className="h-6 w-6 text-brand-green" />,
                                        title: "Proteção ao investimento",
                                        description: "Análise minuciosa de riscos, validação jurídica e implementação de estratégias para maximizar a segurança e o potencial do seu investimento."
                                    },
                                ].map((card, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                        className="bg-brand-light border border-neutral-200 rounded-lg p-8 hover:shadow-lg transition-all"
                                    >
                                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm border border-neutral-100">
                                            {card.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-brand-dark mb-4">{card.title}</h3>
                                        <p className="text-neutral-600">{card.description}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-16 text-center">
                                <Link
                                    href="#agendar"
                                    className="inline-flex items-center gap-2 text-brand-green hover:text-brand-dark transition-colors font-medium"
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
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="max-w-3xl mx-auto mb-16"
                            >
                                <h2 className="text-3xl md:text-4xl font-italiana text-brand-dark mb-6">
                                    Vantagens exclusivas de investir em Guararema
                                </h2>
                                <p className="text-neutral-600">
                                    Descubra por que a região é considerada estratégica para investidores que buscam
                                    valorização superior à média do mercado, com qualidade de vida e infraestrutura premium.
                                </p>
                            </motion.div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
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
                                ].map((metric, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                                    >
                                        <div className={`bg-gradient-to-r ${metric.color} h-2`}></div>
                                        <div className="p-8">
                                            <div className="text-4xl font-semibold text-brand-dark mb-1">{metric.value}</div>
                                            <div className="text-neutral-600 font-medium mb-4 uppercase text-sm tracking-wider">{metric.label}</div>
                                            <p className="text-neutral-500 text-sm">{metric.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="mt-16 bg-white p-8 rounded-xl shadow-lg border border-neutral-100"
                            >
                                <div className="flex items-center gap-3 mb-6 justify-center">
                                    <Shield className="h-5 w-5 text-brand-green" />
                                    <span className="text-brand-dark font-semibold">Análise de mercado verificada</span>
                                </div>
                                <p className="text-neutral-600 mb-6">
                                    Todos os dados apresentados são verificados e atualizados trimestralmente por nossa
                                    equipe de análise imobiliária, em parceria com institutos de pesquisa de mercado.
                                </p>
                                <Link
                                    href="/analise-mercado"
                                    className="text-brand-green hover:text-brand-dark transition-colors inline-flex items-center gap-2 font-medium"
                                >
                                    Solicitar relatório completo
                                    <ChevronRight className="h-5 w-5" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Seção 3: Formulário de Agendamento */}
                <section id="agendar" className="py-24 bg-brand-dark">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                            {/* Textos explicativos */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="space-y-10 text-white"
                            >
                                <div>
                                    <div className="inline-flex items-center gap-2 mb-6 opacity-80">
                                        <div className="h-px w-8 bg-accent-yellow"></div>
                                        <span className="text-accent-yellow font-light tracking-widest uppercase text-xs">Atendimento Exclusivo</span>
                                    </div>

                                    <h2 className="text-3xl md:text-4xl xl:text-5xl font-italiana leading-tight text-white mb-6">
                                        Consultoria imobiliária <span className="text-accent-yellow">personalizada</span>
                                    </h2>
                                    <p className="text-neutral-300 max-w-xl text-lg leading-relaxed">
                                        Nossos consultores de investimento imobiliário estão disponíveis para uma análise detalhada
                                        das melhores oportunidades em Guararema, adequadas ao seu perfil e objetivos financeiros.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    {[
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
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-start">
                                            <div className="h-6 w-6 rounded-full bg-accent-yellow/20 text-accent-yellow flex items-center justify-center flex-shrink-0 mt-1">
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                                                <p className="text-neutral-300">{item.desc}</p>
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
                                    <p className="text-white italic leading-relaxed mb-6">
                                        "A consultoria da Ipê foi fundamental para nossa decisão de investimento. A análise de mercado aprofundada e o acesso a propriedades exclusivas nos permitiram adquirir um ativo com excelente potencial de valorização."
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-neutral-200"></div>
                                        <div>
                                            <p className="text-white font-medium">Roberto Mendes</p>
                                            <p className="text-neutral-400 text-sm">CEO, Mendes Investimentos</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Formulário */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="bg-white rounded-xl overflow-hidden shadow-2xl"
                            >
                                <div className="p-1 bg-gradient-to-r from-brand-green to-brand-dark">
                                    <div className="bg-white p-8 rounded-t-lg">
                                        <h3 className="text-2xl font-semibold text-brand-dark mb-2">Agendar consultoria</h3>
                                        <p className="text-neutral-600 text-sm">
                                            Preencha o formulário para solicitar uma reunião com nossa equipe de consultores.
                                            Responderemos em até 4 horas úteis.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <form className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="nome" className="block text-sm font-medium text-neutral-700 mb-1">Nome completo</label>
                                                <input
                                                    type="text"
                                                    id="nome"
                                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent"
                                                    placeholder="Seu nome completo"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="telefone" className="block text-sm font-medium text-neutral-700 mb-1">Telefone/WhatsApp</label>
                                                <input
                                                    type="tel"
                                                    id="telefone"
                                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent"
                                                    placeholder="(11) 99999-9999"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">E-mail</label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent"
                                                placeholder="seuemail@exemplo.com"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="perfil" className="block text-sm font-medium text-neutral-700 mb-1">Perfil de investimento</label>
                                                <select
                                                    id="perfil"
                                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent"
                                                >
                                                    <option value="">Selecione seu perfil</option>
                                                    <option value="moradia">Busco imóvel para moradia</option>
                                                    <option value="investimento">Busco imóvel para investimento</option>
                                                    <option value="ambos">Ambos os objetivos</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="investimento" className="block text-sm font-medium text-neutral-700 mb-1">Faixa de investimento</label>
                                                <select
                                                    id="investimento"
                                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent"
                                                >
                                                    <option value="">Selecione a faixa</option>
                                                    <option value="500k-1m">R$ 500 mil - 1 milhão</option>
                                                    <option value="1m-2m">R$ 1 - 2 milhões</option>
                                                    <option value="2m-5m">R$ 2 - 5 milhões</option>
                                                    <option value="5m+">Acima de R$ 5 milhões</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="mensagem" className="block text-sm font-medium text-neutral-700 mb-1">Objetivos específicos</label>
                                            <textarea
                                                id="mensagem"
                                                rows={3}
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent"
                                                placeholder="Descreva brevemente seus objetivos de investimento e/ou características desejadas do imóvel..."
                                            ></textarea>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <input type="checkbox" id="termos" className="mt-1" />
                                            <label htmlFor="termos" className="text-sm text-neutral-600">
                                                Autorizo o contato da Ipê Imobiliária e concordo com a <Link href="/privacidade" className="text-brand-green hover:underline">Política de Privacidade</Link>.
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-brand-green to-brand-dark hover:from-brand-dark hover:to-brand-dark transition-all shadow-lg shadow-brand-dark/20 text-white font-medium py-4 px-6 rounded-md"
                                        >
                                            Solicitar consultoria especializada
                                        </button>
                                    </form>

                                    <div className="flex items-center justify-center gap-3 mt-8 text-neutral-500 text-sm">
                                        <Lock className="h-4 w-4" />
                                        <p>Seus dados estão protegidos e são confidenciais</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* CTA Final - Seção de Contato Rápido */}
                <section className="py-24 relative overflow-hidden bg-gradient-to-br from-brand-dark via-[#0d3042] to-brand-dark">
                    {/* Elementos decorativos */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-yellow/5 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-brand-green/5 rounded-full blur-3xl"></div>

                        {/* Linhas geométricas sutis */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </div>

                    <div className="container mx-auto px-6 lg:px-8 relative z-10">
                        <div className="max-w-screen-xl mx-auto">
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <div className="inline-flex items-center gap-2 mb-6">
                                        <div className="h-px w-8 bg-accent-yellow"></div>
                                        <span className="text-accent-yellow font-light tracking-widest uppercase text-xs">Expertise Imobiliária</span>
                                    </div>

                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-italiana text-white mb-6 leading-tight">
                                        Maximize o retorno do seu <span className="text-accent-yellow">investimento imobiliário</span>
                                    </h2>

                                    <p className="text-neutral-300 text-lg mb-8 leading-relaxed">
                                        Nossa equipe está preparada para apresentar as melhores oportunidades em Guararema, com análise detalhada de valorização e potencial de retorno para cada propriedade.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link
                                            href="#agendar"
                                            className="bg-accent-yellow hover:bg-accent-yellow/90 transition-all text-brand-dark font-medium px-8 py-4 rounded-md inline-flex items-center justify-center shadow-lg shadow-accent-yellow/10"
                                        >
                                            Solicitar consultoria
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                        <Link
                                            href="/portfolio"
                                            className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white font-medium px-8 py-4 rounded-md inline-flex items-center justify-center"
                                        >
                                            Portfólio premium
                                            <ChevronRight className="ml-1 h-5 w-5" />
                                        </Link>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="bg-brand-dark/60 backdrop-blur-md border border-white/5 rounded-xl p-8 relative"
                                >
                                    <div className="absolute -top-4 -right-4">
                                        <div className="bg-accent-yellow text-brand-dark text-xs font-semibold uppercase tracking-wider px-4 py-1 rounded flex items-center shadow-lg">
                                            <Clock className="h-3.5 w-3.5 mr-1.5" /> Resposta em 4 horas
                                        </div>
                                    </div>

                                    <h3 className="text-white text-xl font-semibold mb-4">Contato rápido</h3>

                                    <form className="space-y-4">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Nome"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:ring-2 focus:ring-accent-yellow focus:border-transparent text-white"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="tel"
                                                placeholder="Telefone"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:ring-2 focus:ring-accent-yellow focus:border-transparent text-white"
                                            />
                                            <input
                                                type="email"
                                                placeholder="E-mail"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:ring-2 focus:ring-accent-yellow focus:border-transparent text-white"
                                            />
                                        </div>
                                        <div>
                                            <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:ring-2 focus:ring-accent-yellow focus:border-transparent text-white">
                                                <option value="" className="bg-brand-dark text-white">Tipo de imóvel de interesse</option>
                                                <option value="residencial" className="bg-brand-dark text-white">Imóvel Residencial</option>
                                                <option value="comercial" className="bg-brand-dark text-white">Imóvel Comercial</option>
                                                <option value="terreno" className="bg-brand-dark text-white">Terreno/Lote</option>
                                            </select>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-accent-yellow hover:bg-accent-yellow/90 transition-all text-brand-dark font-medium py-3 px-6 rounded-md shadow-lg shadow-accent-yellow/10"
                                        >
                                            Entrar em contato
                                        </button>
                                    </form>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>                {/* WhatsApp Button e Footer */}
                <WhatsAppButton phoneNumber="11999999999" />
                <Footer />
            </div>
        </OptimizationProvider>
    );
}
