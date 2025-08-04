import React, { useState } from 'react';
import { TrendingUp, MapPin, Clock, Calculator, Home, DollarSign, BarChart3, AlertCircle, Calendar, ChevronRight, Target, Globe } from 'lucide-react';
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
            {/* Seletor de público */}
            <div className="flex justify-center mb-12">
                <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-amber-200">
                    {Object.entries(configuracoes).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setTipoLead(key as ServiceKey)}
                            className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${tipoLead === key
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105'
                                : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                                }`}
                        >
                            {config.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Coluna principal - Análise */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Pergunta principal */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-amber-200 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {configuracoes[tipoLead].titulo}
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    {configuracoes[tipoLead].subtitulo}
                                </p>
                            </div>
                        </div>

                        {/* Análise por região */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-amber-600" />
                                {configuracoes[tipoLead].pergunta}
                            </h3>

                            {regioes.map((regiao, index) => (
                                <div
                                    key={index}
                                    className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg cursor-pointer group ${regiao.destaque
                                        ? 'border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 shadow-md'
                                        : 'border-gray-200 hover:border-amber-200 bg-white/50 hover:scale-[1.02]'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${regiao.destaque ? 'bg-amber-200' : 'bg-gray-100'}`}>
                                                <Home className="w-5 h-5 text-gray-700" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{regiao.nome}</h4>
                                                <p className="text-sm text-gray-600">{regiao.valor} • {regiao.tempo}</p>
                                            </div>
                                        </div>
                                        {regiao.destaque && (
                                            <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-semibold rounded-full">
                                                ⭐ Destaque
                                            </span>
                                        )}
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
                                    </div>
                                    <p className="text-sm text-gray-700 mb-3 font-medium">{regiao.tendencia}</p>
                                    <div className="bg-white/60 rounded-lg p-3 border border-gray-100">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold text-amber-700">Oportunidade:</span> {regiao.oportunidade[tipoLead]}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Insights relevantes */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-amber-200 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-amber-600" />
                            Insights Estratégicos
                        </h3>

                        <div className="space-y-4">
                            {insightsRelevantes.map((insight, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-4 p-5 rounded-xl hover:bg-amber-50/50 transition-all duration-200 cursor-pointer border border-transparent hover:border-amber-200 hover:scale-[1.01]"
                                    onClick={() => setInsightAtivo(index)}
                                >
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-amber-600 border border-amber-200">
                                        {insight.icone}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 mb-2">{insight.titulo}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{insight.conteudo}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${insight.relevancia[tipoLead] === 'alta'
                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                                        }`}>
                                        {insight.relevancia[tipoLead] === 'alta' ? 'Prioridade' : 'Relevante'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar com captura */}
                <div className="space-y-6">
                    {/* Formulário principal */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-lg sticky top-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Calculator className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Análise Personalizada
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Receba dados detalhados da região que te interessa
                            </p>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Seu nome"
                                value={leadForm.name}
                                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/80 backdrop-blur-sm"
                                required
                            />

                            <input
                                type="email"
                                placeholder="Seu e-mail"
                                value={leadForm.email}
                                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/80 backdrop-blur-sm"
                                required
                            />

                            <select
                                value={leadForm.regiao}
                                onChange={(e) => setLeadForm({ ...leadForm, regiao: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/80 backdrop-blur-sm"
                            >
                                <option value="centro">Centro</option>
                                <option value="itapema">Itapema</option>
                                <option value="portal">Portal das Colinas</option>
                                <option value="todas">Todas as regiões</option>
                            </select>

                            <button
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:scale-105 hover:shadow-xl"
                            >
                                {configuracoes[tipoLead].cta}
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-4 text-center">
                            📊 Análise gratuita • ⚡ Resposta em 24 horas
                        </p>
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
                                <a href="tel:+5511981845016" className="hover:text-green-600 transition-colors">
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
        </SectionWrapper>
    );
}