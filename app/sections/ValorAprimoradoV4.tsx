'use client';

import React, { useState } from 'react';
import { ChevronDown, MapPin, Calculator, Home, Clock, Mail, Phone, Check, CalendarDays, FileText, Calendar } from 'lucide-react';
// Removido framer-motion para evitar problemas de animação em cascata

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
            question: "Quais são os custos envolvidos na venda de um imóvel?",
            answer: "Os custos de venda incluem: nossa comissão de corretagem (negociada conforme o imóvel), documentação cartorial, ITBI (pago pelo comprador), certidões atualizadas e eventual regularização documental. Fornecemos um relatório detalhado de custos antes de iniciarmos o processo de venda."
        },
        {
            question: "Qual o prazo médio para comercialização de imóveis em Guararema?",
            answer: "Com base em nosso histórico de 15 anos no mercado local, imóveis com precificação adequada e em boas condições são comercializados entre 45 a 90 dias. Fatores como localização, documentação regular e estratégia de marketing influenciam diretamente no prazo de venda."
        },
        {
            question: "Como funciona o serviço de administração predial?",
            answer: "Nossa administração predial inclui: seleção criteriosa de locatários com análise de crédito, elaboração de contratos, cobrança de aluguéis, gestão de manutenções preventivas e corretivas, relatórios mensais de rentabilidade e assessoria jurídica especializada."
        },
        {
            question: "Vocês trabalham com financiamento imobiliário?",
            answer: "Sim, temos parcerias com as principais instituições financeiras da região. Auxiliamos nossos clientes em todo processo: pré-aprovação de crédito, documentação necessária, acompanhamento na avaliação do imóvel e liberação dos recursos. Nossa equipe especializada orienta sobre as melhores condições disponíveis no mercado."
        },
        {
            question: "Qual a diferença entre avaliar e precificar um imóvel?",
            answer: "A avaliação técnica considera aspectos estruturais, localização, metragem e estado de conservação para determinar o valor real do imóvel. A precificação é estratégica, considerando a dinâmica do mercado local, concorrência e objetivos do proprietário para definir o preço de venda mais eficaz."
        },
        {
            question: "Quais documentos são necessários para vender meu imóvel?",
            answer: "Documentação essencial: escritura ou registro de imóvel, certidões negativas (federal, estadual, municipal), IPTU quitado, declaração de confrontantes, planta baixa aprovada, habite-se (quando aplicável) e documentos pessoais. Nossa equipe jurídica verifica toda documentação e orienta sobre eventuais regularizações necessárias."
        },
        {
            question: "Como é calculada a comissão de corretagem?",
            answer: "Nossa comissão é negociada individualmente, considerando fatores como valor do imóvel, complexidade da transação, prazo para venda e serviços inclusos. Trabalhamos com percentuais competitivos no mercado e transparência total sobre todos os custos envolvidos."
        },
        {
            question: "Vocês oferecem consultoria para investidores?",
            answer: "Sim, oferecemos consultoria especializada para investidores imobiliários, incluindo: análise de potencial de valorização, estudo de rentabilidade, identificação de oportunidades no mercado local, orientação sobre estratégias de investimento e acompanhamento pós-compra."
        },
        {
            question: "Como garantem a segurança jurídica das transações?",
            answer: "Mantemos parceria com escritório jurídico especializado em direito imobiliário, realizamos due diligence completa da documentação, verificamos registros cartoriais, analisamos ônus e gravames, e acompanhamos todo processo até a escrituração final, garantindo máxima segurança jurídica."
        },
        {
            question: "Atendem imóveis em outras cidades da região?",
            answer: "Atendemos Guararema e região metropolitana, incluindo Mogi das Cruzes, Jacareí, Santa Isabel e São José dos Campos. Nossa expertise local nos permite oferecer assessoria qualificada sobre as particularidades de cada mercado regional."
        },
        {
            question: "Qual o suporte oferecido pós-venda?",
            answer: "Nosso relacionamento não termina com a venda. Oferecemos suporte contínuo incluindo: orientações sobre escrituração, acompanhamento em cartório, esclarecimento sobre documentação, indicação de profissionais especializados (advogados, engenheiros, arquitetos) e assessoria para futuras transações imobiliárias."
        },
        {
            question: "Como funciona a avaliação gratuita do meu imóvel?",
            answer: "Nossa avaliação gratuita inclui: visita técnica presencial, análise comparativa de mercado, verificação documental prévia, relatório detalhado com precificação sugerida e apresentação de estratégia de marketing personalizada. O processo é realizado por corretor qualificado e sem compromisso de exclusividade."
        }
    ];

    return (
        <div className="bg-white">
            {/* Services Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div
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
                        </div>

                        {/* Service Navigation */}                            <div className="flex flex-wrap justify-center gap-3 mb-12">
                            {Object.entries(services).map(([key, service], index) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveService(key as ServiceKey)}
                                    className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${activeService === key
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
                                </button>
                            ))}
                        </div>

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
            </section>            {/* FAQ Section */}
            <section className="py-20 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div
                            className="text-center mb-16"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 text-amber-800 rounded-full text-sm font-medium mb-6 shadow-sm">
                                <FileText className="w-4 h-4" />
                                <span className="font-semibold">DÚVIDAS FREQUENTES</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Informações Essenciais
                                <span className="block text-amber-700">para Sua Transação Imobiliária</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Respondemos às questões mais importantes sobre compra, venda e locação de imóveis em Guararema e região, com base em nossa experiência de 15 anos no mercado local
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {faqItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                >
                                    <button
                                        className="flex justify-between items-start w-full p-6 lg:p-8 text-left hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/30 transition-all duration-300"
                                        onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-8 h-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                <span className="text-amber-700 font-bold text-sm">{index + 1}</span>
                                            </div>
                                            <span className="font-semibold text-gray-900 text-lg leading-relaxed group-hover:text-amber-800 transition-colors duration-300">
                                                {item.question}
                                            </span>
                                        </div>
                                        <div
                                            className={`flex-shrink-0 ml-4 transition-transform duration-300 ${activeQuestion === index ? 'rotate-180' : ''}`}
                                        >
                                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 transition-colors duration-300">
                                                <ChevronDown className="w-4 h-4 text-amber-700" />
                                            </div>
                                        </div>
                                    </button>
                                    {activeQuestion === index && (
                                        <div
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                                                <div className="ml-12 border-t border-amber-100 pt-6">
                                                    <p className="text-gray-700 text-base leading-relaxed">
                                                        {item.answer}
                                                    </p>
                                                    <div className="mt-4 flex items-center gap-2 text-amber-700">
                                                        <Clock className="w-4 h-4" />
                                                        <span className="text-sm font-medium">
                                                            Ainda tem dúvidas? Fale conosco
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Call to action para mais informações */}
                        <div
                            className="text-center mt-12"
                        >
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
                                <h3 className="text-2xl font-bold mb-4">
                                    Não encontrou sua resposta?
                                </h3>
                                <p className="text-amber-100 mb-6 text-lg">
                                    Nossa equipe está pronta para esclarecer todas as suas dúvidas
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a
                                        href="tel:+5511981845016"
                                        className="inline-flex items-center px-6 py-3 bg-white text-amber-700 font-semibold rounded-lg hover:bg-amber-50 transition-all duration-200 shadow-lg hover:scale-[1.05] active:scale-[0.95]"
                                    >
                                        <Phone className="w-5 h-5 mr-2" />
                                        Ligar Agora
                                    </a>
                                    <a
                                        href="/contato"
                                        className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-all duration-200 shadow-lg border-2 border-white/20 hover:scale-[1.05] active:scale-[0.95]"
                                    >
                                        <Mail className="w-5 h-5 mr-2" />
                                        Enviar Mensagem
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
