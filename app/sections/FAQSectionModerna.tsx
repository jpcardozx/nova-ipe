/**
 * FAQ Section Melhorada - UI/UX Moderna
 * 
 * Melhorias:
 * - Busca e filtros
 * - Layout em grid (2 colunas)
 * - Modal para respostas completas
 * - Categorização visual
 * - CTA contextual
 * - Microinterações
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
    Search,
    X,
    ChevronDown,
    ChevronUp,
    Calculator,
    TrendingUp,
    CalendarDays,
    Home,
    FileText,
    Shield,
    Users,
    Phone,
    Mail,
    MessageCircle,
    MapPin,
    Star,
    Check,
    ArrowRight,
    ChevronRight,
    Clock,
    Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FaqItem {
    question: string;
    answer: string;
    category: 'Compra' | 'Venda' | 'Documentação' | 'Custos' | 'Gestão' | 'Geral';
    icon: React.ReactNode;
}

interface ServiceInfo {
    title: string;
    description: string;
    icon: React.ReactNode;
    points: string[];
    color: string;
}

export default function FAQSectionModerna() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
    const [selectedFaq, setSelectedFaq] = useState<FaqItem | null>(null);

    const categories = ['Todos', 'Compra', 'Venda', 'Documentação', 'Custos', 'Gestão'];

    const faqItems: FaqItem[] = [
        // Perguntas sobre PROCESSO DE COMPRA (lead qualification)
        {
            question: "Como funciona o processo de compra de um imóvel?",
            answer: "O processo geralmente envolve algumas etapas: busca e seleção do imóvel, negociação de valores, análise documental, elaboração de contrato e assinatura. Em Guararema, muitos compradores vêm de outras regiões buscando melhor qualidade de vida. É importante visitar pessoalmente os imóveis e conhecer a infraestrutura local antes de decidir.",
            category: 'Compra',
            icon: <Home className="w-5 h-5" />
        },
        {
            question: "Posso comprar um imóvel morando em outra cidade?",
            answer: "Sim, é perfeitamente possível. Muitos clientes realizam a busca inicial online e depois agendam visitas concentradas em um ou dois dias. Alguns processos podem ser feitos remotamente através de procuração, mas recomendamos ao menos uma visita presencial para conhecer o imóvel e o bairro onde pretende morar.",
            category: 'Compra',
            icon: <Home className="w-5 h-5" />
        },
        
        // Perguntas sobre VENDA (intent tracking)
        {
            question: "Quanto tempo leva para vender um imóvel em Guararema?",
            answer: "O prazo varia bastante conforme localização, preço e condições do imóvel. Em média, observamos que imóveis bem documentados e com preço alinhado ao mercado local encontram compradores entre 2 a 6 meses. Localizações mais centrais ou próximas à rodovia tendem a ter maior procura.",
            category: 'Venda',
            icon: <TrendingUp className="w-5 h-5" />
        },
        {
            question: "Como saber se meu imóvel está com preço adequado?",
            answer: "O valor ideal considera diversos fatores: localização, metragem, estado de conservação, infraestrutura do bairro e comparação com imóveis similares vendidos recentemente na região. Uma avaliação presencial ajuda a identificar diferenciais que podem agregar ou reduzir valor. O mercado imobiliário local tem suas particularidades que influenciam a precificação.",
            category: 'Venda',
            icon: <Calculator className="w-5 h-5" />
        },
        
        // Perguntas sobre DOCUMENTAÇÃO (pain points)
        {
            question: "Quais documentos preciso ter em mãos para vender?",
            answer: "Os documentos básicos incluem: matrícula atualizada do imóvel, IPTU em dia, certidões negativas de débitos, documentos pessoais do proprietário e comprovante de estado civil. Dependendo do imóvel, pode ser necessário habite-se, planta aprovada ou regularização junto à prefeitura. Cada situação é única e merece análise específica.",
            category: 'Documentação',
            icon: <FileText className="w-5 h-5" />
        },
        {
            question: "O que fazer se a documentação do imóvel está irregular?",
            answer: "Irregularidades documentais são mais comuns do que parecem, especialmente em imóveis antigos. O primeiro passo é identificar exatamente qual o problema: pode ser falta de averbação, construção sem habite-se, divergência de metragem, entre outros. Cada caso tem uma solução específica, que pode envolver regularização junto à prefeitura, retificação de área ou outros procedimentos.",
            category: 'Documentação',
            icon: <Shield className="w-5 h-5" />
        },
        
        // Perguntas sobre CUSTOS (transparency)
        {
            question: "Quais são os custos aproximados de uma transação?",
            answer: "Os principais custos variam conforme o tipo de operação. Na compra, há ITBI (normalmente 2% do valor), registro em cartório, custas cartorárias e eventual comissão de corretagem. Na venda, além da possível comissão, podem existir custos com documentação e certidões. É importante considerar esses valores no planejamento financeiro da transação.",
            category: 'Custos',
            icon: <Calculator className="w-5 h-5" />
        },
        
        // Perguntas sobre REGIÃO (geo tracking)
        {
            question: "Quais são os bairros mais procurados em Guararema?",
            answer: "A procura varia conforme o perfil do comprador. Famílias geralmente buscam bairros com escolas e comércio próximos. Quem vem da capital costuma se interessar por áreas mais tranquilas com terrenos maiores. O centro oferece mais infraestrutura, enquanto bairros afastados proporcionam mais sossego. Vale conhecer diferentes regiões antes de decidir.",
            category: 'Geral',
            icon: <MapPin className="w-5 h-5" />
        },
        
        // Perguntas sobre SERVIÇOS (service awareness)
        {
            question: "Qual a diferença entre uma imobiliária e um corretor autônomo?",
            answer: "Ambos podem auxiliar em transações imobiliárias, mas imobiliárias geralmente oferecem uma estrutura mais ampla: equipe jurídica, marketing profissional, maior rede de contatos e processos mais estruturados. Corretores autônomos podem ter maior flexibilidade. O mais importante é trabalhar com profissionais devidamente registrados no CRECI e que conheçam bem o mercado local.",
            category: 'Geral',
            icon: <Users className="w-5 h-5" />
        },
        
        // Perguntas sobre LOCAÇÃO (service extension)
        {
            question: "Como funciona a administração de imóveis para aluguel?",
            answer: "A administração de locação envolve divulgação do imóvel, seleção de inquilinos, elaboração de contratos, recebimento de aluguéis, repasse ao proprietário e intermediação de questões de manutenção. Alguns proprietários preferem fazer isso sozinhos para economizar, enquanto outros optam por delegar para ter mais tranquilidade. Cada modelo tem seus prós e contras.",
            category: 'Gestão',
            icon: <CalendarDays className="w-5 h-5" />
        },
        
        // Perguntas sobre FINANCIAMENTO (lead qualification)
        {
            question: "É possível financiar imóveis usados em Guararema?",
            answer: "Sim, bancos e instituições financeiras financiam imóveis usados, desde que atendam requisitos mínimos de documentação e avaliação. O imóvel precisa ter matrícula regular, estar em bom estado de conservação e o valor da avaliação bancária precisa cobrir o financiamento solicitado. As condições e taxas variam entre instituições.",
            category: 'Compra',
            icon: <Home className="w-5 h-5" />
        },
        
        // Perguntas sobre AVALIAÇÃO (lead generation)
        {
            question: "Como é feita a avaliação de um imóvel?",
            answer: "A avaliação considera aspectos como localização, metragem do terreno e construção, estado de conservação, padrão de acabamento, idade da construção e características especiais (piscina, edícula, etc.). Também são analisados valores de imóveis similares vendidos recentemente na região. Uma vistoria presencial é fundamental para uma avaliação precisa.",
            category: 'Venda',
            icon: <Calculator className="w-5 h-5" />
        }
    ];

    const services: ServiceInfo[] = [
        {
            title: "Encontrar Imóvel",
            description: "Auxiliamos você a encontrar o imóvel ideal em Guararema",
            icon: <Home className="w-6 h-6" />,
            color: "from-blue-500 to-cyan-500",
            points: [
                "Análise das suas necessidades",
                "Seleção de imóveis qualificados",
                "Acompanhamento em visitas"
            ]
        },
        {
            title: "Vender Imóvel",
            description: "Estratégia personalizada para venda do seu imóvel",
            icon: <Calculator className="w-6 h-6" />,
            color: "from-amber-500 to-orange-500",
            points: [
                "Avaliação profissional",
                "Divulgação estratégica",
                "Assessoria completa"
            ]
        },
        {
            title: "Gestão de Aluguel",
            description: "Administração completa do seu imóvel para aluguel",
            icon: <CalendarDays className="w-6 h-6" />,
            color: "from-green-500 to-emerald-500",
            points: [
                "Seleção de inquilinos",
                "Gestão de contratos",
                "Relatórios de rentabilidade"
            ]
        }
    ];

    // Filtrar FAQs
    const filteredFaqs = useMemo(() => {
        let filtered = faqItems;

        // Filtro de categoria
        if (selectedCategory !== 'Todos') {
            filtered = filtered.filter(faq => faq.category === selectedCategory);
        }

        // Filtro de busca
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(faq =>
                faq.question.toLowerCase().includes(query) ||
                faq.answer.toLowerCase().includes(query) ||
                faq.category.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [selectedCategory, searchQuery]);

    return (
        <div className="bg-white">
            {/* Seção de Serviços */}
            <section className="py-20 bg-white relative overflow-hidden">
                {/* Background decorativo */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

                <div className="container mx-auto px-6 relative">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-6">
                                <Star className="w-4 h-4" />
                                SERVIÇOS
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Como podemos ajudar você
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Suporte especializado em todas as etapas do processo imobiliário
                            </p>
                        </div>

                        {/* Grid de Serviços */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-white rounded-2xl p-8 border-2 border-gray-100
                                             hover:border-amber-200 hover:shadow-2xl transition-all duration-500
                                             overflow-hidden cursor-pointer"
                                >
                                    {/* Background decorativo */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 
                                                  rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                                    
                                    {/* Ícone */}
                                    <div className="relative mb-6">
                                        <div className={cn(
                                            "w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center",
                                            "group-hover:scale-110 group-hover:rotate-6 transition-all duration-300",
                                            service.color
                                        )}>
                                            <div className="text-white">
                                                {service.icon}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Conteúdo */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {service.description}
                                    </p>
                                    
                                    {/* Lista de benefícios */}
                                    <ul className="space-y-2 mb-6">
                                        {service.points.map((point, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                <Check className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    {/* CTA */}
                                    <button className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white
                                                     rounded-xl font-semibold group-hover:shadow-lg
                                                     transition-all flex items-center justify-center gap-2">
                                        Saber Mais
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Seção FAQ */}
            <section className="py-20 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 
                                          border border-amber-200 text-amber-800 rounded-full text-sm font-semibold mb-6">
                                <FileText className="w-4 h-4" />
                                DÚVIDAS FREQUENTES
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Informações Essenciais
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Respostas rápidas para as questões mais importantes sobre imóveis
                            </p>
                        </div>

                        {/* Busca e Filtros */}
                        <div className="mb-12">
                            {/* Busca */}
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar dúvidas sobre compra, venda, documentação..."
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200
                                             focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10
                                             text-lg transition-all outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            
                            {/* Filtros por categoria */}
                            <div className="flex flex-wrap gap-3 justify-center">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={cn(
                                            "px-6 py-2.5 rounded-full font-medium transition-all",
                                            selectedCategory === cat
                                                ? "bg-amber-500 text-white shadow-lg scale-105"
                                                : "bg-white border-2 border-gray-200 text-gray-700 hover:border-amber-300 hover:scale-102"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Grid de FAQs */}
                        {filteredFaqs.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6 mb-12">
                                {filteredFaqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedFaq(faq)}
                                        className="bg-white border-2 border-gray-100 rounded-2xl p-6
                                                 hover:border-amber-200 hover:shadow-xl transition-all
                                                 cursor-pointer group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 
                                                          rounded-xl flex items-center justify-center flex-shrink-0
                                                          group-hover:scale-110 transition-transform">
                                                <div className="text-amber-700">
                                                    {faq.icon}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                                        {faq.category}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors">
                                                    {faq.question}
                                                </h4>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                                    {faq.answer}
                                                </p>
                                                <button className="text-amber-600 text-sm font-semibold 
                                                                 flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    Ver resposta completa
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Nenhuma dúvida encontrada
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Tente ajustar sua busca ou entre em contato diretamente
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('Todos');
                                    }}
                                    className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold
                                             hover:bg-amber-700 transition-all"
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        )}

                        {/* CTA Final */}
                        <div className="relative">
                            {/* Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl" />
                            <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-10 rounded-3xl" />
                            
                            <div className="relative px-8 py-12 text-center text-white">
                                <div className="max-w-3xl mx-auto">
                                    {/* Badge */}
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 
                                                  backdrop-blur-sm rounded-full mb-6">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm font-semibold">Resposta em até 2 horas</span>
                                    </div>
                                    
                                    <h3 className="text-3xl md:text-4xl font-bold mb-4">
                                        Não encontrou sua resposta?
                                    </h3>
                                    <p className="text-xl text-amber-50 mb-8">
                                        Nossa equipe de especialistas está pronta para atender você
                                    </p>
                                    
                                    {/* Grid de contatos */}
                                    <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                                        <a href="tel:+5511981845016" 
                                           className="flex flex-col items-center gap-2 p-6 bg-white/10 
                                                    backdrop-blur-sm border border-white/20 rounded-xl
                                                    hover:bg-white/20 hover:scale-105 transition-all">
                                            <Phone className="w-6 h-6" />
                                            <span className="font-semibold">Ligar</span>
                                            <span className="text-sm text-amber-50">Imediato</span>
                                        </a>
                                        
                                        <a href="https://wa.me/5511981845016" 
                                           className="flex flex-col items-center gap-2 p-6 bg-white 
                                                    text-amber-700 rounded-xl hover:scale-105 transition-all shadow-xl">
                                            <MessageCircle className="w-6 h-6" />
                                            <span className="font-semibold">WhatsApp</span>
                                            <span className="text-sm text-amber-600">Mais popular</span>
                                        </a>
                                        
                                        <a href="/contato" 
                                           className="flex flex-col items-center gap-2 p-6 bg-white/10 
                                                    backdrop-blur-sm border border-white/20 rounded-xl
                                                    hover:bg-white/20 hover:scale-105 transition-all">
                                            <Mail className="w-6 h-6" />
                                            <span className="font-semibold">E-mail</span>
                                            <span className="text-sm text-amber-50">Detalhado</span>
                                        </a>
                                    </div>
                                    
                                    {/* Social proof */}
                                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            <span className="text-amber-50">+500 famílias atendidas</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="text-amber-50">4.9/5 de satisfação</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal de Resposta Completa */}
            {selectedFaq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                     onClick={() => setSelectedFaq(null)}>
                    <div className="bg-white rounded-2xl max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
                         onClick={(e) => e.stopPropagation()}>
                        <div className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 
                                              rounded-xl flex items-center justify-center flex-shrink-0">
                                    <div className="text-white">
                                        {selectedFaq.icon}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Tag className="w-4 h-4 text-amber-600" />
                                        <span className="text-sm font-semibold text-amber-600">
                                            {selectedFaq.category}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {selectedFaq.question}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setSelectedFaq(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            
                            <div className="prose prose-lg max-w-none mb-8">
                                <p className="text-gray-700 leading-relaxed">
                                    {selectedFaq.answer}
                                </p>
                            </div>
                            
                            {/* CTA contextual */}
                            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                                <p className="text-gray-900 font-semibold mb-4">
                                    Ainda tem dúvidas sobre {selectedFaq.category}?
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <a href="/contato" 
                                       className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white 
                                                rounded-xl font-semibold transition-all flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4" />
                                        Falar com Especialista
                                    </a>
                                    <a href={`https://wa.me/5511981845016?text=Tenho dúvidas sobre ${selectedFaq.question}`} 
                                       className="px-6 py-3 border-2 border-gray-300 hover:border-amber-600 
                                                rounded-xl font-semibold transition-all flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
