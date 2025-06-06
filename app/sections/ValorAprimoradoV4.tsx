'use client';

import React, { useState } from 'react';
import { ChevronDown, MapPin, Calculator, Home, Clock, Mail, Phone, Check, CalendarDays, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

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
            question: "Quais são os custos para vender um imóvel?",
            answer: "Os principais custos incluem documentação, ITBI e nossa comissão. Fornecemos uma estimativa detalhada sem compromisso para que você possa avaliar."
        },
        {
            question: "Qual o tempo médio para venda em Guararema?",
            answer: "O tempo varia conforme localização, preço e condições do imóvel. Imóveis bem posicionados no mercado costumam ser vendidos entre 60 a 120 dias."
        },
        {
            question: "Como funciona a administração de aluguel?",
            answer: "Cuidamos de toda a gestão: desde a busca do inquilino até a manutenção do imóvel, garantindo que você receba sua renda sem preocupações."
        }
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-gray-50 to-amber-50 py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="grid lg:grid-cols-2 gap-14 items-center"
                        >
                            {/* Content */}
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="space-y-4"
                                >                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium shadow-sm">
                                        <span className="font-semibold">IPÊ IMÓVEIS</span>
                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                        <span className="font-semibold">CRECI 29.159-J</span>
                                    </div>

                                    <h1 className="text-4xl lg:text-5xl font-light text-gray-800 leading-tight">
                                        Seu investimento imobiliário em
                                        <span className="block text-amber-700 font-medium mt-2">Guararema</span>
                                    </h1>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        Assessoria especializada com conhecimento local para compra,
                                        venda e administração de imóveis desde 2009.
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="grid grid-cols-3 gap-8"
                                >
                                    <div className="rounded-lg bg-white p-4 border border-gray-100 shadow-sm">
                                        <div className="text-2xl font-medium text-amber-600 mb-1">2009</div>
                                        <div className="text-sm text-gray-600">Fundação</div>
                                    </div>
                                    <div className="rounded-lg bg-white p-4 border border-gray-100 shadow-sm">
                                        <div className="text-2xl font-medium text-amber-600 mb-1">300+</div>
                                        <div className="text-sm text-gray-600">Propriedades</div>
                                    </div>
                                    <div className="rounded-lg bg-white p-4 border border-gray-100 shadow-sm">
                                        <div className="text-2xl font-medium text-amber-600 mb-1">15+</div>
                                        <div className="text-sm text-gray-600">Anos</div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Lead Form */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                className="bg-white rounded-lg p-8 shadow-sm border border-gray-200"
                            >
                                <div className="mb-7">
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                                        Agendar consulta personalizada
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Análise detalhada conforme suas necessidades específicas
                                    </p>
                                </div>

                                <div className="space-y-5">                                <div className="space-y-1">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1">Seu nome</label>
                                    <div className="relative">
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Nome completo"
                                            value={leadForm.name}
                                            onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 outline-none transition-all bg-white shadow-sm"
                                        />
                                    </div>
                                </div>

                                    <div className="space-y-1">
                                        <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">Seu e-mail</label>
                                        <div className="relative">
                                            <input
                                                id="email"
                                                type="email"
                                                placeholder="email@exemplo.com"
                                                value={leadForm.email}
                                                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 outline-none transition-all bg-white shadow-sm"
                                            />
                                        </div>
                                    </div>                                    <div className="space-y-1">
                                        <label htmlFor="interest" className="text-sm font-medium text-gray-700 block mb-1">Tipo de serviço</label>
                                        <div className="relative">
                                            <select
                                                id="interest"
                                                value={leadForm.interest}
                                                onChange={(e) => setLeadForm({ ...leadForm, interest: e.target.value as ServiceKey })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 outline-none transition-all bg-white shadow-sm appearance-none pr-10"
                                            >
                                                <option value="compra">Compra de imóvel</option>
                                                <option value="venda">Venda de imóvel</option>
                                                <option value="gestao">Administração de aluguel</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleLeadSubmit}
                                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-md transition-all duration-200 mt-2 shadow-sm hover:shadow"
                                    >
                                        Solicitar atendimento
                                    </motion.button>
                                </div>

                                <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5 mt-6">
                                    <Clock className="w-3 h-3" />
                                    Retornamos em até 24 horas úteis
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100/80 text-amber-700 rounded-full text-xs font-medium mb-3 shadow-sm">
                                <span className="font-semibold">SERVIÇOS</span>
                            </div>
                            <h2 className="text-3xl font-medium text-gray-800 mb-4">
                                Como podemos ajudar você
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Suporte especializado em todas as etapas do processo imobiliário em Guararema
                            </p>
                        </motion.div>

                        {/* Service Navigation */}                            <div className="flex flex-wrap justify-center gap-3 mb-12">
                            {Object.entries(services).map(([key, service], index) => (
                                <motion.button
                                    key={key}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveService(key as ServiceKey)}
                                    className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${activeService === key
                                        ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-md'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className={`${activeService === key ? 'text-amber-700' : 'text-gray-500'} transition-colors duration-200`}>
                                            {service.icon}
                                        </div>
                                        {service.title}
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        {/* Service Content */}                        <motion.div
                            key={activeService}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-gradient-to-b from-white to-gray-50 rounded-lg p-8 shadow-md border border-gray-100"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 border-b border-gray-200 pb-6">
                                <div className="p-3.5 rounded-md bg-amber-100/80 text-amber-700 shadow-sm">
                                    <motion.div
                                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="w-7 h-7">
                                        {services[activeService].icon}
                                    </motion.div>
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
                                {services[activeService].points.map((point, index) => (<motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                    className="flex items-start space-x-3"
                                >
                                    <div className="flex-shrink-0 rounded-full p-1.5 bg-amber-100 text-amber-700 mt-0.5 shadow-sm">
                                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-gray-700 leading-relaxed">{point}</span>
                                </motion.div>
                                ))}
                            </div>                            <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow"
                                >
                                    Saiba mais sobre este serviço
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                                        <path d="M1.16669 7H12.8334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7 1.16663L12.8333 6.99996L7 12.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100/80 text-amber-700 rounded-full text-xs font-medium mb-3 shadow-sm">
                                <span className="font-semibold">INFORMAÇÕES</span>
                            </div>
                            <h2 className="text-3xl font-medium text-gray-800 mb-4">
                                Perguntas frequentes
                            </h2>
                            <p className="text-gray-600">
                                Esclarecemos as principais dúvidas sobre processos imobiliários
                            </p>
                        </motion.div>

                        <div className="space-y-4">
                            {faqItems.map((item, index) => (<motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                            >
                                <button
                                    className="flex justify-between items-center w-full p-5 text-left hover:bg-gray-50 transition-colors duration-200"
                                    onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                                >
                                    <span className="font-medium text-gray-800 text-base">{item.question}</span>
                                    <motion.div
                                        animate={{ rotate: activeQuestion === index ? 180 : 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </motion.div>
                                </button>
                                {activeQuestion === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="px-5 pb-5"
                                    >
                                        <div className="border-t border-gray-100 pt-4 text-gray-600 text-sm leading-relaxed">
                                            {item.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}            <section className="py-16 bg-gradient-to-br from-amber-600 to-amber-700">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 text-white/90 rounded-full text-xs font-medium mb-4 shadow-sm backdrop-blur-sm">
                                <span className="font-semibold">CONTATO</span>
                            </div>

                            <h2 className="text-3xl font-medium text-white mb-6">
                                Vamos conversar sobre seus objetivos
                            </h2>
                            <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
                                Entre em contato com nossa equipe para esclarecer dúvidas ou agendar uma consulta personalizada
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.a
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    href="tel:+5511981845016"
                                    className="inline-flex items-center px-6 py-3 bg-white text-amber-700 font-medium rounded-md hover:bg-gray-50 transition-all duration-200 shadow-md"
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    (11) 98184-5016
                                </motion.a>
                                <motion.a
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    href="mailto:contato@ipeimoveis.com"
                                    className="inline-flex items-center px-6 py-3 bg-amber-800 text-white font-medium rounded-md hover:bg-amber-900 transition-all duration-200 shadow-md"
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    contato@ipeimoveis.com
                                </motion.a>
                            </div>

                            <p className="text-amber-200/80 text-xs mt-8">
                                Atendimento de segunda a sexta, das 9h às 18h, e sábados das 9h às 13h
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
