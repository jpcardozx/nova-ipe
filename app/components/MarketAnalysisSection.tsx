import React, { useState } from 'react';
import { TrendingUp, MapPin, Clock, Calculator, Home, DollarSign, BarChart3, AlertCircle, Calendar } from 'lucide-react';

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

export default function InsightsPersonalizados() {
    const [tipoLead, setTipoLead] = useState<ServiceKey>('comprador'); // comprador, vendedor, investidor
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
            titulo: "Melhores meses para negociar",
            conteudo: "Março a junho: 23% mais vendas. Setembro a novembro: melhores preços para compradores.",
            icone: <Calendar className="w-5 h-5" />,
            relevancia: { comprador: "alta", vendedor: "alta", investidor: "média" }
        },
        {
            titulo: "Impacto da nova rodovia",
            conteudo: "Duplicação prevista para 2026 pode valorizar Itapema em até 40%. Oportunidade de entrada agora.",
            icone: <TrendingUp className="w-5 h-5" />,
            relevancia: { comprador: "alta", vendedor: "média", investidor: "alta" }
        },
        {
            titulo: "Financiamento vs pagamento à vista",
            conteudo: "Desconto médio de 12% para pagamento à vista. Financiamento: entrada de 20% é suficiente.",
            icone: <Calculator className="w-5 h-5" />,
            relevancia: { comprador: "alta", vendedor: "baixa", investidor: "média" }
        }
    ];

    const insightsRelevantes = insights.filter(insight =>
        insight.relevancia[tipoLead] === "alta" || insight.relevancia[tipoLead] === "média"
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header com seletor de público */}
            <section className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-light text-gray-900 mb-4">
                                Insights do mercado imobiliário
                            </h1>
                            <p className="text-gray-600">
                                Informações atualizadas para orientar sua decisão
                            </p>
                        </div>

                        {/* Seletor de público */}
                        <div className="flex justify-center">
                            <div className="inline-flex bg-gray-100 rounded-lg p-1">
                                {Object.entries(configuracoes).map(([key, config]) => (
                                    <button
                                        key={key}
                                        onClick={() => setTipoLead(key as ServiceKey)}
                                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${tipoLead === key
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {config.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Conteúdo principal */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-3 gap-12">
                            {/* Coluna principal */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Pergunta principal */}
                                <div className="bg-white rounded-lg p-8 border border-gray-200">
                                    <h2 className="text-2xl font-medium text-gray-900 mb-6">
                                        {configuracoes[tipoLead].titulo}
                                    </h2>
                                    <p className="text-lg text-gray-600 mb-8">
                                        {configuracoes[tipoLead].subtitulo}
                                    </p>

                                    {/* Análise por região */}
                                    <div className="space-y-4">
                                        <h3 className="font-medium text-gray-900 mb-4">
                                            {configuracoes[tipoLead].pergunta}
                                        </h3>

                                        {regioes.map((regiao, index) => (
                                            <div
                                                key={index}
                                                className={`p-6 rounded-lg border-2 transition-all hover:shadow-md ${regiao.destaque
                                                    ? 'border-yellow-300 bg-yellow-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{regiao.nome}</h4>
                                                        <p className="text-sm text-gray-600">{regiao.valor} • {regiao.tempo} para venda</p>
                                                    </div>
                                                    {regiao.destaque && (
                                                        <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-medium rounded">
                                                            Recomendado
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-700 mb-2">{regiao.tendencia}</p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Para você:</span> {regiao.oportunidade[tipoLead]}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Insights relevantes */}
                                <div className="bg-white rounded-lg p-8 border border-gray-200">
                                    <h3 className="text-xl font-medium text-gray-900 mb-6">
                                        Informações importantes para sua decisão
                                    </h3>

                                    <div className="space-y-6">
                                        {insightsRelevantes.map((insight, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() => setInsightAtivo(index)}
                                            >
                                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                                    {insight.icone}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 mb-1">{insight.titulo}</h4>
                                                    <p className="text-sm text-gray-600 leading-relaxed">{insight.conteudo}</p>
                                                </div>
                                                <div className={`px-2 py-1 rounded text-xs font-medium ${insight.relevancia[tipoLead] === 'alta'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {insight.relevancia[tipoLead] === 'alta' ? 'Importante' : 'Útil'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar com captura */}
                            <div className="space-y-6">
                                {/* Formulário principal */}
                                <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Quer uma análise específica?
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-6">
                                        Enviaremos dados detalhados da região que te interessa
                                    </p>

                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Seu nome"
                                            value={leadForm.name}
                                            onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />

                                        <input
                                            type="email"
                                            placeholder="Seu e-mail"
                                            value={leadForm.email}
                                            onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />

                                        <select
                                            value={leadForm.regiao}
                                            onChange={(e) => setLeadForm({ ...leadForm, regiao: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="centro">Centro</option>
                                            <option value="itapema">Itapema</option>
                                            <option value="portal">Portal das Colinas</option>
                                            <option value="todas">Todas as regiões</option>
                                        </select>

                                        <button
                                            onClick={handleSubmit}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                        >
                                            {configuracoes[tipoLead].cta}
                                        </button>
                                    </div>

                                    <p className="text-xs text-gray-500 mt-4 text-center">
                                        Análise gratuita • Resposta em 24 horas
                                    </p>
                                </div>

                                {/* Contato direto */}
                                <div className="bg-gray-100 rounded-lg p-6">
                                    <h4 className="font-medium text-gray-900 mb-3">
                                        Prefere conversar diretamente?
                                    </h4>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div>(11) 99999-9999</div>
                                        <div>contato@ipeimóveis.com.br</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}