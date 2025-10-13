import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, MapPin, Clock, Calculator, Home, DollarSign, BarChart3, AlertCircle, Calendar, ChevronRight, Target, Globe, Check, ArrowRight, Sparkles, Award, Shield, Zap, Users, Building2, PieChart, LineChart, Activity, Star, Timer, TrendingDown, Eye, MessageCircle, Database, TrendingUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type ServiceKey = 'comprador' | 'vendedor' | 'investidor';

interface MarketStats {
    vendas_mes: number;
    tempo_medio_venda: string;
    variacao_preco: string;
    roi_medio: string;
    liquidez: 'alta' | 'média' | 'baixa';
    tendencia: 'alta' | 'estável' | 'baixa';
}

interface RegionData {
    nome: string;
    preco_m2: number;
    variacao_anual: number;
    tempo_venda: string;
    roi_aluguel: number;
    demanda: 'alta' | 'média' | 'baixa';
    oferta: 'alta' | 'média' | 'baixa';
    score_investimento: number;
    tendencia_6m: 'crescimento' | 'estável' | 'declínio';
    caracteristicas: string[];
    publico_alvo: string;
    destaque: boolean;
}

interface InsightData {
    titulo: string;
    descricao: string;
    impacto: 'alto' | 'médio' | 'baixo';
    prazo: 'curto' | 'médio' | 'longo';
    categoria: 'mercado' | 'financeiro' | 'regional' | 'oportunidade';
    icone: React.ReactNode;
    relevancia: { [K in ServiceKey]: 'alta' | 'média' | 'baixa' };
    dados_suporte: string;
}

export default function MarketAnalysisSection() {
    const [segmentoAtivo, setSegmentoAtivo] = useState<ServiceKey>('comprador');
    const [regiaoFoco, setRegiaoFoco] = useState<string>('');
    const [insightSelecionado, setInsightSelecionado] = useState<number>(0);
    const [leadForm, setLeadForm] = useState({ nome: '', email: '', telefone: '', interesse: 'analise-completa' });
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Dados de mercado atualizados e realistas
    const statsGerais: MarketStats = {
        vendas_mes: 147,
        tempo_medio_venda: '45 dias',
        variacao_preco: '+14.8%',
        roi_medio: '9.8%',
        liquidez: 'alta',
        tendencia: 'alta'
    };

    const regioes: RegionData[] = [
        {
            nome: 'Centro Histórico',
            preco_m2: 3850,
            variacao_anual: 15.2,
            tempo_venda: '38 dias',
            roi_aluguel: 8.5,
            demanda: 'alta',
            oferta: 'média',
            score_investimento: 92,
            tendencia_6m: 'crescimento',
            caracteristicas: ['Maior Liquidez', 'Infraestrutura Premium', 'Alto Padrão'],
            publico_alvo: 'Executivos, Profissionais liberais, Investidores',
            destaque: true
        },
        {
            nome: 'Itapema Residencial',
            preco_m2: 2650,
            variacao_anual: 28.7,
            tempo_venda: '52 dias',
            roi_aluguel: 11.2,
            demanda: 'alta',
            oferta: 'baixa',
            score_investimento: 88,
            tendencia_6m: 'crescimento',
            caracteristicas: ['Maior Valorização 5 anos', 'Público Premium SP', 'ROI Excepcional'],
            publico_alvo: 'Famílias de SP, Executivos em home office',
            destaque: false
        },
        {
            nome: 'Portal das Colinas',
            preco_m2: 2150,
            variacao_anual: 8.9,
            tempo_venda: '78 dias',
            roi_aluguel: 7.8,
            demanda: 'média',
            oferta: 'alta',
            score_investimento: 76,
            tendencia_6m: 'estável',
            caracteristicas: ['Condomínios seguros', 'Área de lazer', 'Público consolidado'],
            publico_alvo: 'Famílias estabelecidas',
            destaque: false
        }
    ];

    const insights: InsightData[] = [
        {
            titulo: 'Crescimento da Busca por Imóveis na Região',
            descricao: 'A tendência de trabalho remoto tem aumentado o interesse por cidades do interior. Guararema tem recebido famílias vindas da capital em busca de mais qualidade de vida, tranquilidade e contato com a natureza, sem abrir mão da proximidade com São Paulo. O perfil inclui executivos, profissionais liberais e famílias jovens.',
            impacto: 'alto',
            prazo: 'curto',
            categoria: 'mercado',
            icone: <Users className="w-5 h-5" />,
            relevancia: { comprador: 'alta', vendedor: 'alta', investidor: 'alta' },
            dados_suporte: 'Aumento na procura por imóveis residenciais'
        },
        {
            titulo: 'Condições Favoráveis de Financiamento',
            descricao: 'As taxas de juros para financiamento imobiliário estão em patamares atrativos, facilitando o acesso à casa própria. Bancos e instituições financeiras têm oferecido boas condições para compradores qualificados. Este é um bom momento para quem está considerando adquirir um imóvel na região.',
            impacto: 'alto',
            prazo: 'médio',
            categoria: 'financeiro',
            icone: <TrendingDown className="w-5 h-5" />,
            relevancia: { comprador: 'alta', vendedor: 'média', investidor: 'baixa' },
            dados_suporte: 'Taxas competitivas e condições facilitadas'
        },
        {
            titulo: 'Melhorias em Infraestrutura e Acesso',
            descricao: 'A região tem recebido investimentos em infraestrutura que melhoram a qualidade de vida e facilitam o acesso à capital. Obras na Rodovia dos Tamoios e outras melhorias urbanas estão em andamento, beneficiando moradores e valorizando os imóveis da região. A conectividade com São Paulo continua sendo um diferencial importante.',
            impacto: 'médio',
            prazo: 'longo',
            categoria: 'regional',
            icone: <Activity className="w-5 h-5" />,
            relevancia: { comprador: 'média', vendedor: 'alta', investidor: 'alta' },
            dados_suporte: 'Investimentos em infraestrutura viária e urbana'
        },
        {
            titulo: 'Demanda por Imóveis para Locação',
            descricao: 'A procura por imóveis para alugar tem se mantido aquecida na região, especialmente em boas localizações. A baixa disponibilidade de imóveis para locação cria oportunidades interessantes para investidores. O mercado de locação em Guararema tem se mostrado estável e com bom potencial de rentabilidade.',
            impacto: 'alto',
            prazo: 'curto',
            categoria: 'oportunidade',
            icone: <PieChart className="w-5 h-5" />,
            relevancia: { comprador: 'baixa', vendedor: 'média', investidor: 'alta' },
            dados_suporte: 'Mercado de locação aquecido na região'
        }
    ];

    const configuracaoSegmento = {
        comprador: {
            titulo: 'Informações para Compradores',
            subtitulo: 'Análise de oportunidades e cenário atual',
            cor: 'slate',
            icone: <Home className="w-6 h-6" />,
            insights_relevantes: insights.filter(i => i.relevancia.comprador !== 'baixa'),
            pergunta_chave: 'Onde encontrar o melhor custo-benefício?'
        },
        vendedor: {
            titulo: 'Informações para Vendedores',
            subtitulo: 'Orientações para venda eficiente',
            cor: 'slate',
            icone: <TrendingUp className="w-6 h-6" />,
            insights_relevantes: insights.filter(i => i.relevancia.vendedor !== 'baixa'),
            pergunta_chave: 'Como vender pelo melhor preço?'
        },
        investidor: {
            titulo: 'Informações para Investidores',
            subtitulo: 'Análise de rentabilidade e potencial',
            cor: 'slate',
            icone: <LineChart className="w-6 h-6" />,
            insights_relevantes: insights.filter(i => i.relevancia.investidor !== 'baixa'),
            pergunta_chave: 'Onde está o melhor potencial de retorno?'
        }
    };

    const handleFormSubmit = () => {
        if (!leadForm.nome.trim() || !leadForm.email.trim()) {
            alert('Por favor, preencha nome e e-mail.');
            return;
        }

        console.log('Lead capturado:', leadForm);
        alert(`${leadForm.nome}, você receberá sua análise personalizada em até 2 horas!`);
        setLeadForm({ nome: '', email: '', telefone: '', interesse: 'analise-completa' });
    };

    const segmentoConfig = configuracaoSegmento[segmentoAtivo];

    return (
        <section
            ref={sectionRef}
            className="py-24 bg-gradient-to-br from-slate-50 via-white to-amber-50/20 relative overflow-hidden"
        >
            {/* Professional Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            
            {/* Subtle Radial Accents */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.03),transparent)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,146,60,0.03),transparent)] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6">
                {/* Professional Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-20"
                >
                    {/* Premium Badge with Database Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center gap-3 px-7 py-3.5 mb-10 bg-white border-2 border-slate-200 rounded-full shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300 group"
                    >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse" />
                        <Database className="w-5 h-5 text-slate-700 group-hover:text-amber-600 transition-colors" />
                        <span className="text-sm font-semibold text-slate-700 tracking-wider uppercase">
                            Dados de Mercado
                        </span>
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse" />
                    </motion.div>

                    {/* Refined Title with Typography Hierarchy */}
                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
                        Panorama do
                        <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                            Mercado Imobiliário
                        </span>
                    </h2>

                    {/* Consultative Subtitle with Two-Line Structure */}
                    <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                        Informações sobre preços e características dos imóveis em Guararema.
                        <span className="block mt-4 text-base">
                            Dados baseados em <strong className="font-semibold text-slate-800">15 anos</strong> de atuação no mercado regional
                        </span>
                    </p>

                    {/* Elegant Decorative Divider */}
                    <div className="flex items-center justify-center gap-3 mt-10">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                    </div>
                </motion.div>

                {/* Premium Segment Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="flex justify-center mb-20"
                >
                    <div className="bg-white rounded-2xl p-2.5 shadow-xl border-2 border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {Object.entries(configuracaoSegmento).map(([key, config]) => (
                                <motion.button
                                    key={key}
                                    onClick={() => setSegmentoAtivo(key as ServiceKey)}
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={cn(
                                        "px-7 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 relative overflow-hidden group",
                                        segmentoAtivo === key
                                            ? "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-lg shadow-amber-500/30"
                                            : "text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-amber-50/50 hover:text-slate-800"
                                    )}
                                >
                                    {/* Shimmer effect on active */}
                                    {segmentoAtivo === key && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                    )}
                                    
                                    <div className={cn(
                                        "relative z-10 transition-transform group-hover:scale-110",
                                        segmentoAtivo === key ? 'text-white' : 'text-slate-500 group-hover:text-amber-600'
                                    )}>
                                        {config.icone}
                                    </div>
                                    <span className="relative z-10 text-base">
                                        {key === 'comprador' ? 'Comprar' : key === 'vendedor' ? 'Vender' : 'Investir'}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Conteúdo Principal */}
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Análise de Regiões */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header da Seção */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-slate-100 rounded-xl">
                                    <div className="text-slate-700">
                                        {segmentoConfig.icone}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                                        {segmentoConfig.titulo}
                                    </h3>
                                    <p className="text-slate-600">
                                        {segmentoConfig.subtitulo}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    {segmentoConfig.pergunta_chave}
                                </h4>
                                <p className="text-slate-600 text-sm">
                                    Análise baseada em dados de transações registradas em 2024
                                </p>
                            </div>
                        </div>

                        {/* Cards de Regiões */}
                        <div className="space-y-6">
                            {regioes.map((regiao, index) => (
                                <div
                                    key={index}
                                    className={`group relative bg-white rounded-3xl p-8 shadow-lg border transition-all duration-300 hover:shadow-xl cursor-pointer ${regiao.destaque
                                        ? 'border-amber-300 bg-gradient-to-br from-amber-50/50 to-white ring-2 ring-amber-200/50'
                                        : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                    onClick={() => setRegiaoFoco(regiao.nome)}
                                >
                                    {regiao.destaque && (
                                        <div className="absolute -top-3 left-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                            <Star className="w-4 h-4" />
                                            Recomendado
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 rounded-2xl ${regiao.destaque ? 'bg-amber-100' : 'bg-slate-100'} group-hover:scale-110 transition-transform duration-300`}>
                                                <Home className={`w-6 h-6 ${regiao.destaque ? 'text-amber-600' : 'text-slate-600'}`} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-slate-900 mb-1">{regiao.nome}</h4>
                                                <div className="flex items-center gap-4 text-sm text-slate-600">
                                                    <span className="font-bold text-lg">R$ {regiao.preco_m2.toLocaleString()}/m²</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${regiao.variacao_anual > 15 ? 'bg-green-100 text-green-700' : regiao.variacao_anual > 8 ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        +{regiao.variacao_anual}% ao ano
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300" />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm text-slate-600">Tempo médio: <strong>{regiao.tempo_venda}</strong></span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <PieChart className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm text-slate-600">ROI aluguel: <strong>{regiao.roi_aluguel}% a.a.</strong></span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <BarChart3 className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm text-slate-600">Score: <strong>{regiao.score_investimento}/100</strong></span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="text-sm">
                                                <span className="text-slate-600 font-medium">Público-alvo:</span>
                                                <p className="text-slate-700">{regiao.publico_alvo}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {regiao.caracteristicas.slice(0, 2).map((caracteristica, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                                        {caracteristica}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Premium Insights Section */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="bg-white rounded-3xl p-8 shadow-xl border-2 border-slate-200 hover:border-amber-200 transition-colors relative overflow-hidden"
                        >
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-50 to-transparent rounded-bl-full opacity-50" />
                            
                            <div className="relative z-10">
                                <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3 flex-wrap">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                                            <LineChart className="w-5 h-5 text-amber-700" />
                                        </div>
                                        <span>Insights Estratégicos</span>
                                    </div>
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm",
                                        segmentoConfig.cor === 'emerald' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                                        segmentoConfig.cor === 'amber' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                                        'bg-amber-100 text-amber-700 border border-amber-200'
                                    )}>
                                        {segmentoAtivo === 'comprador' ? 'Compradores' : segmentoAtivo === 'vendedor' ? 'Vendedores' : 'Investidores'}
                                    </span>
                                </h4>

                                <div className="grid gap-5">
                                    {segmentoConfig.insights_relevantes.map((insight, index) => (
                                        <motion.div 
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            className="group flex items-start gap-5 p-6 rounded-2xl border-2 border-slate-100 hover:border-amber-200 bg-gradient-to-br from-white to-slate-50/30 hover:from-amber-50/30 hover:to-orange-50/20 transition-all duration-300 cursor-pointer hover:shadow-lg"
                                        >
                                            <div className={cn(
                                                "flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md",
                                                insight.categoria === 'mercado' ? 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700' : 
                                                insight.categoria === 'financeiro' ? 'bg-gradient-to-br from-green-100 to-emerald-200 text-green-700' : 
                                                insight.categoria === 'regional' ? 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700' : 
                                                'bg-gradient-to-br from-amber-100 to-orange-200 text-amber-700'
                                            )}>
                                                {insight.icone}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold text-slate-900 mb-2 group-hover:text-amber-700 transition-colors leading-snug">
                                                    {insight.titulo}
                                                </h5>
                                                <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                                                    {insight.descricao}
                                                </p>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <span className={cn(
                                                        "px-3 py-1.5 rounded-full text-xs font-semibold border",
                                                        insight.relevancia[segmentoAtivo] === 'alta' 
                                                            ? 'bg-green-50 text-green-700 border-green-200' 
                                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    )}>
                                                        {insight.relevancia[segmentoAtivo] === 'alta' ? '★ Alta Prioridade' : '◆ Relevante'}
                                                    </span>
                                                    <span className="text-xs text-slate-500 font-medium">
                                                        {insight.dados_suporte}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                            <div className="p-6">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <Calculator className="w-8 h-8 text-slate-600" />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-2">
                                        Análise Personalizada
                                    </h4>
                                    <p className="text-slate-600 mb-4">
                                        Receba informações específicas baseadas no seu perfil e região de interesse
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                                            <Check className="w-4 h-4 text-slate-600" />
                                            <span className="font-medium text-slate-700">Gratuito</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                                            <Clock className="w-4 h-4 text-slate-600" />
                                            <span className="font-medium text-slate-700">Resposta rápida</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Seu nome completo"
                                        value={leadForm.nome}
                                        onChange={(e) => setLeadForm({ ...leadForm, nome: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-white"
                                        required
                                    />

                                    <input
                                        type="email"
                                        placeholder="Seu e-mail"
                                        value={leadForm.email}
                                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-white"
                                        required
                                    />

                                    <input
                                        type="tel"
                                        placeholder="WhatsApp (opcional)"
                                        value={leadForm.telefone}
                                        onChange={(e) => setLeadForm({ ...leadForm, telefone: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-white"
                                    />

                                    <select
                                        value={leadForm.interesse}
                                        onChange={(e) => setLeadForm({ ...leadForm, interesse: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-white"
                                    >
                                        <option value="analise-completa">Análise completa do mercado</option>
                                        <option value="regiao-especifica">Região específica</option>
                                        <option value="precificacao">Precificação de imóvel</option>
                                        <option value="investimento">Oportunidades de investimento</option>
                                    </select>

                                    <button
                                        onClick={handleFormSubmit}
                                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <Calculator className="w-5 h-5" />
                                        Solicitar Análise
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-200">
                                    <div className="text-center text-sm text-slate-600">
                                        <p className="mb-2 font-medium">
                                            Atendimento direto:
                                        </p>
                                        <div className="flex items-center justify-center gap-4">
                                            <a href="tel:+5511981845016" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
                                                <MessageCircle className="w-4 h-4" />
                                                (11) 98184-5016
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}