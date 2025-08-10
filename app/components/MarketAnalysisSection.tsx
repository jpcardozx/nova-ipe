import React, { useState } from 'react';
import { TrendingUp, MapPin, Clock, Calculator, Home, DollarSign, BarChart3, AlertCircle, Calendar, ChevronRight, Target, Globe, Check, ArrowRight } from 'lucide-react';
import SectionWrapper from './ui/SectionWrapper';

// Define TypeScript types for our data structures
type ServiceKey = 'comprador' | 'vendedor' | 'investidor';

interface ServiceConfig {
    label: string;
    titulo: string;
    subtitulo: string;
    pergunta: string;
    cta: string;
}

interface RelevanciaType {
    comprador: string;
    vendedor: string;
    investidor: string;
}

interface RegionOpportunity {
    comprador: string;
    vendedor: string;
    investidor: string;
}

interface Region {
    nome: string;
    valor: string;
    tendencia: string;
    oportunidade: RegionOpportunity;
    tempo: string;
    destaque: boolean;
}

interface Insight {
    titulo: string;
    conteudo: string;
    icone: React.ReactNode;
    relevancia: RelevanciaType;
}

export default function MarketAnalysisSection() {
    const [tipoLead, setTipoLead] = useState<ServiceKey>('comprador');
    const [leadForm, setLeadForm] = useState({ name: '', email: '', regiao: 'centro' });
    const [insightAtivo, setInsightAtivo] = useState(0);

    const handleSubmit = () => {
        if (!leadForm.name.trim() || !leadForm.email.trim()) {
            alert('Por favor, preencha nome e e-mail.');
            return;
        }
        alert(`${leadForm.name}, você receberá análise específica para ${configuracoes[tipoLead].label.toLowerCase()} em ${leadForm.regiao} no e-mail ${leadForm.email}.`);
        setLeadForm({ name: '', email: '', regiao: 'centro' });
    };

    const configuracoes: Record<ServiceKey, ServiceConfig> = {
        comprador: {
            label: "Compradores",
            titulo: "É um bom momento para comprar?",
            subtitulo: "Análise do cenário atual e oportunidades em cada região",
            pergunta: "Onde posso encontrar o melhor custo-benefício?",
            cta: "Ver oportunidades agora"
        },
        vendedor: {
            label: "Vendedores",
            titulo: "Quanto vale meu imóvel hoje?",
            subtitulo: "Cenário de vendas e estratégias para maximizar resultado",
            pergunta: "Qual o melhor momento e preço para vender?",
            cta: "Avaliar meu imóvel"
        },
        investidor: {
            label: "Investidores",
            titulo: "Onde estão as melhores oportunidades?",
            subtitulo: "Análise de rentabilidade e potencial de valorização",
            pergunta: "Qual região oferece melhor retorno?",
            cta: "Ver análise de ROI"
        }
    };

    const regioes: Region[] = [
        {
            nome: "Centro",
            valor: "R$ 3.400/m²",
            tendencia: "Estável com liquidez alta",
            oportunidade: {
                comprador: "Imóveis prontos para morar, infraestrutura completa",
                vendedor: "Venda rápida, procura constante por localização",
                investidor: "Aluguel garantido, valorização de 8% ao ano"
            },
            tempo: "45 dias",
            destaque: true
        },
        {
            nome: "Itapema",
            valor: "R$ 2.600/m²",
            tendencia: "Alta valorização (+28% em 2024)",
            oportunidade: {
                comprador: "Região em expansão, casas novas com bom preço",
                vendedor: "Momento ideal, alta demanda de famílias de SP",
                investidor: "Maior potencial de ganho, entrada ainda acessível"
            },
            tempo: "72 dias",
            destaque: false
        },
        {
            nome: "Portal das Colinas",
            valor: "R$ 2.100/m²",
            tendencia: "Crescimento constante",
            oportunidade: {
                comprador: "Condomínios consolidados, segurança e lazer",
                vendedor: "Mercado específico, compradores qualificados",
                investidor: "Estabilidade, público cativo de famílias"
            },
            tempo: "89 dias",
            destaque: false
        }
    ];

    const insights: Insight[] = [
        {
            titulo: "Momento ideal para investir",
            conteudo: "Crescimento de 18% no último ano com perspectivas positivas. Mercado aquecido favorece negociações rápidas.",
            icone: <TrendingUp className="w-5 h-5" />,
            relevancia: { comprador: "alta", vendedor: "alta", investidor: "alta" }
        },
        {
            titulo: "Infraestrutura em expansão",
            conteudo: "Novos investimentos em mobilidade urbana e equipamentos públicos aumentam atratividade da região.",
            icone: <Globe className="w-5 h-5" />,
            relevancia: { comprador: "alta", vendedor: "média", investidor: "alta" }
        },
        {
            titulo: "Oportunidades de financiamento",
            conteudo: "Taxas competitivas e facilidades de crédito com parcerias bancárias exclusivas.",
            icone: <Calculator className="w-5 h-5" />,
            relevancia: { comprador: "alta", vendedor: "baixa", investidor: "média" }
        }
    ];

    const insightsRelevantes = insights.filter(insight =>
        insight.relevancia[tipoLead] === "alta" || insight.relevancia[tipoLead] === "média"
    );

    return (
        <SectionWrapper
            title="Análise do Mercado Imobiliário"
            subtitle="Insights estratégicos para sua decisão de investimento em Guararema"
            badge="Compra & Venda"
            background="amber"
            id="analise-mercado"
        >
            {/* Seletor de público - Melhorado */}
            <div className="flex justify-center mb-12">
                <div className="inline-flex bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-amber-200/50">
                    {Object.entries(configuracoes).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setTipoLead(key as ServiceKey)}
                            className={`px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-300 relative ${tipoLead === key
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg transform scale-105'
                                : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50/50'
                                }`}
                        >
                            {tipoLead === key && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                            )}
                            {config.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Coluna principal - Análise Melhorada */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Pergunta principal - UI melhorada */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-start gap-4 mb-8">
                            <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    {configuracoes[tipoLead].titulo}
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {configuracoes[tipoLead].subtitulo}
                                </p>
                                <div className="flex items-center gap-2 mt-3 text-sm text-amber-700">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                    <span className="font-medium">Dados atualizados em tempo real</span>
                                </div>
                            </div>
                        </div>

                        {/* Análise por região - UI melhorada */}
                        <div className="space-y-6">
                            <h3 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-3">
                                <MapPin className="w-6 h-6 text-amber-600" />
                                {configuracoes[tipoLead].pergunta}
                                <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-sm font-medium rounded-full border border-green-200">
                                    {regioes.length} regiões analisadas
                                </span>
                            </h3>

                            {regioes.map((regiao, index) => (
                                <div
                                    key={index}
                                    className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl cursor-pointer relative overflow-hidden ${regiao.destaque
                                        ? 'border-amber-300 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-lg hover:shadow-2xl'
                                        : 'border-gray-200 hover:border-amber-300 bg-white hover:bg-gradient-to-br hover:from-amber-25 hover:to-orange-25 hover:scale-[1.02]'
                                        }`}
                                >
                                    {/* Efeito visual de destaque */}
                                    {regiao.destaque && (
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
                                    )}

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl transition-all duration-300 ${regiao.destaque ? 'bg-amber-200 shadow-md' : 'bg-gray-100 group-hover:bg-amber-100'}`}>
                                                <Home className="w-6 h-6 text-gray-700" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg">{regiao.nome}</h4>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                    <span className="font-semibold text-amber-700">{regiao.valor}</span>
                                                    <span>•</span>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{regiao.tempo}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {regiao.destaque && (
                                                <span className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                                                    <span>⭐</span>
                                                    <span>Top Choice</span>
                                                </span>
                                            )}
                                            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-amber-600 group-hover:scale-110 transition-all duration-300" />
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-700 mb-4 font-medium flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                        {regiao.tendencia}
                                    </p>

                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                                                <Check className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-amber-700 mb-1">Oportunidade para {configuracoes[tipoLead].label.toLowerCase()}:</p>
                                                <p className="text-sm text-gray-700 leading-relaxed">{regiao.oportunidade[tipoLead]}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Insights relevantes - UI melhorada */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/50 shadow-xl">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <BarChart3 className="w-7 h-7 text-amber-600" />
                            Insights Estratégicos
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                                Relevantes para você
                            </span>
                        </h3>

                        <div className="grid gap-6">
                            {insightsRelevantes.map((insight, index) => (
                                <div
                                    key={index}
                                    className="group flex items-start gap-6 p-6 rounded-2xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-amber-200 hover:shadow-lg"
                                    onClick={() => setInsightAtivo(index)}
                                >
                                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-200 shadow-md group-hover:scale-110 transition-transform duration-300">
                                        {insight.icone}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-amber-800 transition-colors">{insight.titulo}</h4>
                                        <p className="text-gray-600 leading-relaxed mb-3">{insight.conteudo}</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${insight.relevancia[tipoLead] === 'alta'
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                                                }`}>
                                                {insight.relevancia[tipoLead] === 'alta' ? (
                                                    <>
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                        <span>Alta Prioridade</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                                        <span>Relevante</span>
                                                    </>
                                                )}
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all duration-300" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>            {/* Sidebar com captura */}
                <div className="space-y-6">
                    {/* Formulário principal */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 sticky top-6">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Calculator className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Análise Personalizada
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Receba dados detalhados e insights exclusivos da região que te interessa
                            </p>
                            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-amber-700">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-medium">100% gratuito</span>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <input
                                type="text"
                                placeholder="Seu nome completo"
                                value={leadForm.name}
                                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md text-gray-900 placeholder-gray-500"
                                required
                            />

                            <input
                                type="email"
                                placeholder="Seu melhor e-mail"
                                value={leadForm.email}
                                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md text-gray-900 placeholder-gray-500"
                                required
                            />

                            <select
                                value={leadForm.regiao}
                                onChange={(e) => setLeadForm({ ...leadForm, regiao: e.target.value })}
                                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md text-gray-900"
                            >
                                <option value="centro">Centro - Região consolidada</option>
                                <option value="itapema">Itapema - Em expansão</option>
                                <option value="portal">Portal das Colinas - Residencial</option>
                                <option value="todas">Todas as regiões - Análise completa</option>
                            </select>

                            <button
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3"
                            >
                                <Calculator className="w-5 h-5" />
                                {configuracoes[tipoLead].cta}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                            <div className="flex items-center justify-center gap-8 text-sm">
                                <div className="flex items-center gap-2 text-green-700">
                                    <Check className="w-4 h-4" />
                                    <span className="font-medium">Análise gratuita</span>
                                </div>
                                <div className="flex items-center gap-2 text-green-700">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-medium">Resposta em 24h</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contato direto */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                            Atendimento Direto
                        </h4>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <a href="tel:+5521990051961" className="hover:text-green-600 transition-colors">
                                    (11) 98184-5016
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                <a href="mailto:contato@ipeimoveis.com.br" className="hover:text-amber-600 transition-colors">
                                    contato@ipeimoveis.com.br
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper >
    );
}