import React, { useState } from 'react';
import { ChevronDown, MapPin, Calculator, Home, Clock, Mail, Phone, Check, CalendarDays, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

// TypeScript interfaces for better type safety
type ServiceKey = 'compra' | 'venda' | 'gestao' | 'avaliacao';

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
    avaliacao: ServiceInfo;
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

export default function ImobiliariaElegante() {
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
    }; const services: ServicesData = {
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
        },
        avaliacao: {
            title: "Avaliação de Imóvel",
            description: "Avaliação técnica profissional do seu imóvel",
            icon: <FileText className="w-5 h-5" />,
            points: [
                "Análise técnica completa da propriedade",
                "Comparativo com mercado local atualizado",
                "Relatório detalhado com valor de mercado",
                "Orientação sobre potencial de valorização"
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
            <section className="bg-gradient-to-br from-yellow-50 to-orange-50 py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Content */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h1 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
                                        Seu próximo passo
                                        <span className="block font-medium text-yellow-600">no mercado imobiliário</span>
                                    </h1>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        Especialistas em Guararema há mais de 10 anos, oferecemos assessoria personalizada
                                        para compra, venda e gestão de imóveis na região.
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-6 py-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-semibold text-yellow-600">10+</div>
                                        <div className="text-sm text-gray-500">Anos de experiência</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-semibold text-yellow-600">300+</div>
                                        <div className="text-sm text-gray-500">Transações realizadas</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-semibold text-yellow-600">95%</div>
                                        <div className="text-sm text-gray-500">Clientes satisfeitos</div>
                                    </div>
                                </div>
                            </div>

                            {/* Lead Form */}
                            <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-100">
                                <div className="mb-6">
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                                        Conversar com um especialista
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Receba orientação personalizada para sua situação
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Seu nome"
                                        value={leadForm.name}
                                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Seu e-mail"
                                        value={leadForm.email}
                                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    />                                    <select
                                        value={leadForm.interest}
                                        onChange={(e) => setLeadForm({ ...leadForm, interest: e.target.value as ServiceKey })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    >
                                        <option value="compra">Tenho interesse em comprar</option>
                                        <option value="venda">Preciso vender meu imóvel</option>
                                        <option value="gestao">Quero alugar meu imóvel</option>
                                        <option value="avaliacao">Quero avaliar meu imóvel</option>
                                    </select>
                                    <button
                                        onClick={handleLeadSubmit}
                                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Solicitar contato
                                    </button>
                                </div>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Retorno em até 24 horas úteis
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-light text-gray-900 mb-4">
                                Como podemos ajudar você
                            </h2>
                            <p className="text-gray-600">
                                Oferecemos suporte completo em todas as etapas do processo imobiliário
                            </p>
                        </div>

                        {/* Service Navigation */}
                        <div className="flex flex-wrap justify-center gap-2 mb-10">                            {Object.entries(services).map(([key, service]) => (
                            <button
                                key={key}
                                onClick={() => setActiveService(key as ServiceKey)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeService === key
                                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                                    }`}
                            >
                                {service.title}
                            </button>
                        ))}
                        </div>

                        {/* Service Content */}
                        <div className="bg-gray-50 rounded-lg p-8">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-medium text-gray-900 mb-3">
                                    {services[activeService].title}
                                </h3>
                                <p className="text-gray-600">
                                    {services[activeService].description}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {services[activeService].points.map((point, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        </div>
                                        <span className="text-gray-700">{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-light text-gray-900 mb-4">
                                Perguntas frequentes
                            </h2>
                            <p className="text-gray-600">
                                Esclarecemos as dúvidas mais comuns sobre processos imobiliários
                            </p>
                        </div>

                        <div className="space-y-4">
                            {faqItems.map((item, index) => (
                                <div key={index} className="bg-white rounded-lg border border-gray-200">
                                    <button
                                        className="flex justify-between items-center w-full p-6 text-left"
                                        onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                                    >
                                        <span className="font-medium text-gray-900">{item.question}</span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-400 transition-transform ${activeQuestion === index ? 'transform rotate-180' : ''
                                                }`}
                                        />
                                    </button>
                                    {activeQuestion === index && (
                                        <div className="px-6 pb-6">
                                            <div className="border-t border-gray-100 pt-4 text-gray-600">
                                                {item.answer}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-yellow-600">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-light text-white mb-6">
                            Vamos conversar sobre seus objetivos
                        </h2>
                        <p className="text-yellow-100 text-lg mb-8">
                            Nossa equipe está pronta para oferecer o suporte que você precisa
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+5511999999999"
                                className="inline-flex items-center px-6 py-3 bg-white text-yellow-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Phone className="w-4 h-4 mr-2" />
                                (11) 98184-5016
                            </a>
                            <a
                                href="mailto:contato@example.com"
                                className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-yellow-700 transition-colors"
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                contato@ipeimoveis.com -e-mail profissional pendente-
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}