'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Coffee,
    MapPin,
    FileText,
    Train,
    Building,
    HandshakeIcon,
    Shield,
    Clock,
    Users,
    Calendar,
    Home,
    CheckCircle,
    TrendingUp,
    Eye,
    ArrowRight,
    Laptop,
    PiggyBank,
    ChevronDown,
    Info,
    X,
    ArrowUpRight,
    Zap,
    ExternalLink,
    ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

// TIPOS E INTERFACES
export interface EtapaProcesso {
    id: string
    fase: string
    titulo: string
    descricao: string
    detalhesLocais: string[]
    tempoMedio: string
    localAtendimento?: string
    icon: React.ReactNode
    dica?: string
    acaoTitulo?: string
    acaoUrl?: string
}

interface ProcessoGuararemaProps {
    etapaAtual?: number
}

// COMPONENTE PRINCIPAL
const ProcessoGuararema: React.FC<ProcessoGuararemaProps> = ({
    etapaAtual = 2
}) => {
    // ESTADOS
    const [perfilSelecionado, setPerfilSelecionado] = useState('familia')
    const [etapaSelecionada, setEtapaSelecionada] = useState<string | null>(null)
    const [mostrarComparativo, setMostrarComparativo] = useState(false)
    const [visualizacaoSelecionada, setVisualizacaoSelecionada] = useState('processo')

    // PERFIS
    const perfis = {
        familia: {
            titulo: "Famílias",
            icon: <Users className="w-5 h-5" />
        },
        remoto: {
            titulo: "Profissionais remotos",
            icon: <Laptop className="w-5 h-5" />
        },
        investidor: {
            titulo: "Investidores",
            icon: <PiggyBank className="w-5 h-5" />
        }
    }

    // ETAPAS DO PROCESSO
    const etapasGuararema: EtapaProcesso[] = [
        {
            id: "encontro-inicial",
            fase: "1",
            titulo: "Café consultivo",
            descricao: "Conversa para entender necessidades e apresentar dados do mercado local",
            detalhesLocais: [
                "Análise de objetivos e requisitos específicos",
                perfilSelecionado === 'familia' ? "Informações sobre escolas e infraestrutura familiar" :
                    perfilSelecionado === 'remoto' ? "Dados sobre conectividade e espaços de trabalho" :
                        "Análise de retorno em diferentes modelos de investimento",
                "Mapeamento de bairros com características específicas por perfil",
                "Comparativo objetivo: custo e qualidade de vida vs. São Paulo"
            ],
            tempoMedio: "1h",
            localAtendimento: "Escritório central ou videoconferência",
            icon: <Coffee className="w-6 h-6" />,
            dica: "Traga suas dúvidas sobre distância, transporte e adaptação à cidade pequena",
            acaoTitulo: "Agendar conversa",
            acaoUrl: "/agendar"
        },
        {
            id: "exploracao-cidade",
            fase: "2",
            titulo: "Tour guiado",
            descricao: "Visita presencial aos bairros mais adequados ao seu perfil",
            detalhesLocais: [
                perfilSelecionado === 'familia' ? "Roteiro incluindo escolas, parques e áreas residenciais" :
                    perfilSelecionado === 'remoto' ? "Teste de internet nos bairros e visita aos coworkings" :
                        "Visita a áreas com maior potencial de valorização e retorno",
                "Parada na estação de trem para entender a logística diária",
                "Visita a comércios e serviços essenciais",
                "Apresentação a moradores com perfil similar (mediante disponibilidade)"
            ],
            tempoMedio: "4h",
            icon: <MapPin className="w-6 h-6" />,
            dica: "Realizado em dias úteis para vivenciar a rotina real da cidade",
            acaoTitulo: "Ver roteiro",
            acaoUrl: "/roteiro-tour"
        },
        {
            id: "selecao-imoveis",
            fase: "3",
            titulo: "Seleção personalizada",
            descricao: "Curadoria de imóveis que atendem aos requisitos identificados",
            detalhesLocais: [
                "Lista focada em 3-5 propriedades que atendem aos critérios essenciais",
                "Ficha técnica detalhada de cada propriedade",
                "Análise comparativa de preço por m² entre bairros similares",
                perfilSelecionado === 'familia' ? "Informações sobre vizinhança e segurança" :
                    perfilSelecionado === 'remoto' ? "Dados sobre conectividade e infraestrutura" :
                        "Projeção de valorização com base em dados históricos"
            ],
            tempoMedio: "3-5 dias",
            icon: <Home className="w-6 h-6" />,
            dica: "Inclui propriedades recém-disponíveis e pré-lançamentos selecionados",
            acaoTitulo: "Ver exemplo de curadoria",
            acaoUrl: "/exemplo-selecao"
        },
        {
            id: "visitas-tecnicas",
            fase: "4",
            titulo: "Visitas detalhadas",
            descricao: "Inspeção minuciosa das propriedades selecionadas",
            detalhesLocais: [
                "Verificação técnica estrutural e de conservação",
                "Teste de rotina: deslocamento ao trabalho/escola, compras, lazer",
                perfilSelecionado === 'familia' ? "Avaliação de espaços para crianças e acessibilidade" :
                    perfilSelecionado === 'remoto' ? "Teste de velocidade de internet no local" :
                        "Avaliação de potencial para aluguel e reforma estratégica",
                "Verificação de documentação preliminar do imóvel"
            ],
            tempoMedio: "1-2 dias por imóvel",
            icon: <Eye className="w-6 h-6" />,
            dica: "Acompanhamento opcional de arquiteto parceiro para avaliação especializada",
            acaoTitulo: "Ver checklist de inspeção",
            acaoUrl: "/checklist"
        },
        {
            id: "negociacao",
            fase: "5",
            titulo: "Negociação",
            descricao: "Mediação equilibrada entre comprador e vendedor",
            detalhesLocais: [
                "Estratégia de proposta baseada em dados de mercado",
                "Verificação de flexibilidade para inclusão de itens e equipamentos",
                "Mediação de condições, prazos e forma de pagamento",
                "Elaboração de proposta formal com proteções contratuais"
            ],
            tempoMedio: "5-10 dias",
            icon: <HandshakeIcon className="w-6 h-6" />,
            dica: "Conhecimento do mercado local permite identificar condições justas para ambas as partes",
            acaoTitulo: "Entender o processo",
            acaoUrl: "/negociacao"
        },
        {
            id: "documentacao",
            fase: "6",
            titulo: "Segurança jurídica",
            descricao: "Verificação completa de documentação e regularidade",
            detalhesLocais: [
                "Análise de certidões e documentos em cartórios locais",
                "Verificação de regularidade junto à Prefeitura",
                "Assessoria jurídica para revisão contratual",
                "Acompanhamento no processo de registro e transferência"
            ],
            tempoMedio: "15-20 dias",
            icon: <Shield className="w-6 h-6" />,
            dica: "Processos geralmente mais ágeis que na capital devido ao menor volume",
            acaoTitulo: "Ver documentos necessários",
            acaoUrl: "/documentacao"
        },
        {
            id: "mudanca",
            fase: "7",
            titulo: "Transição",
            descricao: "Suporte prático na mudança e adaptação inicial",
            detalhesLocais: [
                "Indicação de prestadores de serviço verificados para mudança",
                "Orientações sobre serviços essenciais (água, luz, internet)",
                "Guia de integração com comércio e serviços locais",
                perfilSelecionado === 'familia' ? "Suporte na transição escolar e atividades para crianças" :
                    perfilSelecionado === 'remoto' ? "Configuração de espaço de trabalho adequado" :
                        "Orientações para gestão do imóvel para aluguel ou investimento"
            ],
            tempoMedio: "Contínuo",
            icon: <Building className="w-6 h-6" />,
            dica: "Comunidade de novos moradores disponível para troca de experiências",
            acaoTitulo: "Ver guia de adaptação",
            acaoUrl: "/guia-adaptacao"
        }
    ]

    // DADOS DO COMPARATIVO
    const dadosComparativos = {
        // DADOS GERAIS
        familias_atendidas: 87,
        tempo_medio_processo: "45-60 dias",
        economia_media_familiar: "R$ 2.800/mês",
        area_media_adicional: "65m²",

        // FAMÍLIA
        familia: {
            titulo: "Apartamento em SP vs. Casa em Guararema",
            sp: {
                tipo: "Apartamento Vila Mariana",
                preco: "R$ 950.000",
                area: "85m²",
                iptu: "R$ 3.800/ano",
                condominio: "R$ 950/mês",
                tempo_centro: "40-50 min (metrô)",
                aluguel_estimado: "R$ 4.200/mês"
            },
            guararema: {
                tipo: "Casa Guararema (Nogueira)",
                preco: "R$ 680.000",
                area: "150m² + jardim",
                iptu: "R$ 950/ano",
                condominio: "Sem condomínio",
                tempo_centro: "45 min (CPTM)",
                aluguel_estimado: "R$ 3.100/mês"
            }
        },

        // PROFISSIONAL REMOTO
        remoto: {
            titulo: "Apartamento em SP vs. Casa em Guararema",
            sp: {
                tipo: "Apartamento Pinheiros",
                preco: "R$ 1.050.000",
                area: "75m²",
                iptu: "R$ 4.200/ano",
                condominio: "R$ 1.100/mês",
                internet: "300 Mbps",
                custo_vida: "Base comparativa"
            },
            guararema: {
                tipo: "Casa Guararema (Centro)",
                preco: "R$ 720.000",
                area: "160m² + área externa",
                iptu: "R$ 1.100/ano",
                condominio: "Sem condomínio",
                internet: "500 Mbps",
                custo_vida: "-35% em média"
            }
        },

        // INVESTIDOR
        investidor: {
            titulo: "Investimento em SP vs. Guararema",
            sp: {
                tipo: "Apartamento Moema",
                preco: "R$ 950.000",
                valorizacao: "4-6% a.a.",
                rentabilidade: "0.4% a.m. (locação)",
                ticket_medio: "R$ 950.000",
                tempo_venda: "8-10 meses",
                roi_5anos: "22-25%"
            },
            guararema: {
                tipo: "Casa Guararema (Centro)",
                preco: "R$ 680.000",
                valorizacao: "8-12% a.a.",
                rentabilidade: "0.7% a.m. (trad) / 1.1% (temp)",
                ticket_medio: "R$ 680.000",
                tempo_venda: "3-4 meses",
                roi_5anos: "40-45%"
            }
        }
    }

    // FORMATAR VALOR ANUAL (usado no comparativo)
    const calcularValorAnual = (valor: string) => {
        const numero = parseFloat(valor.replace(/[^0-9]/g, ''))
        return isNaN(numero) ? "0" : `R$ ${(numero * 12).toLocaleString('pt-BR')}`
    }

    // DEPOIMENTOS REAIS (APENAS 3 FOCADOS)
    const depoimentos = [
        {
            nome: "Roberto e Carla",
            foto: "/fotos/roberto-carla.jpg",
            texto: "Nos mudamos da Vila Mariana em dezembro de 2023. A economia mensal nos permitiu matricular os dois filhos em escola particular aqui, algo impensável em SP.",
            perfil: "familia"
        },
        {
            nome: "Daniel Silva",
            foto: "/fotos/daniel.jpg",
            texto: "Como desenvolvedor, temia problemas com internet. A fibra aqui é excelente e trabalho com vista para a serra. Vou a SP apenas para reuniões mensais.",
            perfil: "remoto"
        },
        {
            nome: "Ana Luiza",
            foto: "/fotos/ana.jpg",
            texto: "Comprei uma casa para temporada em 2021 por R$490 mil. O ROI tem sido consistentemente melhor que meus outros investimentos imobiliários em SP.",
            perfil: "investidor"
        }
    ]

    const depoimentosFiltrados = depoimentos.filter(d => d.perfil === perfilSelecionado)

    return (
        <section className="py-16 bg-white">
            {/* CABEÇALHO E NAVEGAÇÃO */}
            <div className="container mx-auto px-4 mb-16">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full mb-6 text-sm font-medium">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        Guararema: 45 min de São Paulo (CPTM)
                    </div>                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Protocolo estruturado de análise imobiliária
                    </h1>

                    <p className="text-lg text-gray-600 mb-10">
                        Metodologia exclusiva de assessoria para aquisição e investimento em propriedades
                        na região de Guararema, com atendimento personalizado por perfil de cliente.
                    </p>

                    {/* SELETOR DE PERFIL (SIMPLIFICADO E FOCADO) */}
                    <div className="bg-gray-50 rounded-lg p-1.5 inline-flex mb-8">
                        {Object.entries(perfis).map(([id, perfil]) => (
                            <button
                                key={id}
                                onClick={() => setPerfilSelecionado(id)}
                                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition ${perfilSelecionado === id
                                    ? 'bg-white shadow-sm text-amber-700'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <span className={`mr-1.5 ${perfilSelecionado === id ? 'text-amber-600' : 'text-gray-400'}`}>
                                    {perfil.icon}
                                </span>
                                {perfil.titulo}
                            </button>
                        ))}
                    </div>

                    {/* TOGGLE VISUALIZAÇÃO */}
                    <div className="max-w-md mx-auto mb-10">
                        <div className="bg-gray-100 rounded-lg p-1.5 grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setVisualizacaoSelecionada('processo')}
                                className={`px-4 py-2 rounded text-sm font-medium transition ${visualizacaoSelecionada === 'processo'
                                    ? 'bg-white shadow-sm text-gray-900'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Processo
                            </button>
                            <button
                                onClick={() => setVisualizacaoSelecionada('comparativo')}
                                className={`px-4 py-2 rounded text-sm font-medium transition ${visualizacaoSelecionada === 'comparativo'
                                    ? 'bg-white shadow-sm text-gray-900'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Comparativo SP vs Guararema
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTEÚDO PRINCIPAL - ALTERNANDO ENTRE VISUALIZAÇÕES */}
            <div className="container mx-auto px-4">
                {visualizacaoSelecionada === 'processo' ? (
                    <>
                        {/* ESTATÍSTICAS OBJETIVAS */}
                        <div className="max-w-5xl mx-auto mb-16">
                            <div className="grid md:grid-cols-4 gap-6">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {dadosComparativos.familias_atendidas}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Mudanças realizadas nos últimos 24 meses
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {dadosComparativos.economia_media_familiar}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Economia média mensal para famílias
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {dadosComparativos.area_media_adicional}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Área média adicional em relação a SP
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {dadosComparativos.tempo_medio_processo}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Tempo médio do processo completo
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* DEPOIMENTO DESTACADO */}
                        {depoimentosFiltrados.length > 0 && (
                            <div className="max-w-3xl mx-auto mb-16">
                                <div className="bg-gray-50 rounded-xl p-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                                            {/* Placeholder para foto */}
                                            <div className="w-full h-full bg-amber-100 flex items-center justify-center text-amber-700">
                                                <Users className="w-8 h-8" />
                                            </div>
                                        </div>

                                        <div>
                                            <blockquote className="text-lg text-gray-700 mb-4">
                                                "{depoimentosFiltrados[0].texto}"
                                            </blockquote>

                                            <div className="text-sm text-gray-500">
                                                <span className="font-medium text-gray-900">{depoimentosFiltrados[0].nome}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PROCESSO COM TIMELINE VERTICAL */}
                        <div className="max-w-3xl mx-auto mb-16">
                            <div className="relative">
                                {/* Linha conectora */}
                                <div className="absolute top-0 bottom-0 left-10 md:left-16 w-0.5 bg-gray-200 hidden md:block" />

                                {/* Etapas do processo */}
                                {etapasGuararema.map((etapa, index) => (
                                    <div
                                        key={etapa.id}
                                        className="mb-10"
                                        id={etapa.id}
                                    >
                                        <div className="flex items-start">
                                            {/* Indicador numérico */}
                                            <div className="flex-shrink-0 w-20 md:w-32 flex justify-center">
                                                <div
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold relative z-10 ${index < etapaAtual
                                                        ? 'bg-green-500 text-white'
                                                        : index === etapaAtual
                                                            ? 'bg-amber-500 text-white'
                                                            : 'bg-gray-100 text-gray-600'
                                                        }`}
                                                >
                                                    {index < etapaAtual ? (
                                                        <CheckCircle className="w-5 h-5" />
                                                    ) : (
                                                        etapa.fase
                                                    )}
                                                </div>
                                            </div>

                                            {/* Conteúdo da etapa */}
                                            <div
                                                className={`flex-grow cursor-pointer rounded-lg border p-6 ${etapaSelecionada === etapa.id
                                                    ? 'bg-white shadow-lg border-amber-200'
                                                    : 'bg-white border-gray-200 hover:border-amber-200 hover:shadow transition-all'
                                                    }`}
                                                onClick={() => setEtapaSelecionada(etapa.id === etapaSelecionada ? null : etapa.id)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
                                                            {etapa.titulo}
                                                            {index === etapaAtual && (
                                                                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                                                    Etapa atual
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <p className="text-gray-600 mb-2">
                                                            {etapa.descricao}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        <span>{etapa.tempoMedio}</span>
                                                    </div>
                                                </div>

                                                {/* Detalhes expandidos */}
                                                <AnimatePresence>
                                                    {etapaSelecionada === etapa.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden"
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <div className="pt-4 mt-4 border-t border-gray-100">
                                                                <div className="space-y-4">
                                                                    {/* Lista de detalhes */}
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-900 mb-2">
                                                                            O que acontece nesta etapa:
                                                                        </h4>
                                                                        <ul className="space-y-1.5">
                                                                            {etapa.detalhesLocais.map((detalhe, idx) => (
                                                                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                                                    <span>{detalhe}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>

                                                                    {/* Local de atendimento (se disponível) */}
                                                                    {etapa.localAtendimento && (
                                                                        <div className="text-sm text-gray-600">
                                                                            <strong className="font-medium">Local:</strong> {etapa.localAtendimento}
                                                                        </div>
                                                                    )}

                                                                    {/* Dica (se disponível) */}
                                                                    {etapa.dica && (
                                                                        <div className="bg-blue-50 rounded-md p-3 text-sm text-blue-800">
                                                                            <div className="flex gap-2">
                                                                                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                                                <span>{etapa.dica}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Link de ação */}
                                                                    {etapa.acaoTitulo && (
                                                                        <div className="mt-4">
                                                                            <a
                                                                                href={etapa.acaoUrl}
                                                                                className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-800"
                                                                            >
                                                                                {etapa.acaoTitulo}
                                                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                                                            </a>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* VISUALIZAÇÃO COMPARATIVA SP VS GUARAREMA */}
                        <div className="max-w-5xl mx-auto mb-16">
                            <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {perfilSelecionado === 'familia'
                                            ? dadosComparativos.familia.titulo
                                            : perfilSelecionado === 'remoto'
                                                ? dadosComparativos.remoto.titulo
                                                : dadosComparativos.investidor.titulo}
                                    </h2>
                                </div>

                                <div className="grid md:grid-cols-2">
                                    {/* Coluna São Paulo */}
                                    <div className="p-6 border-r border-gray-200">
                                        <h3 className="font-medium text-lg text-gray-900 mb-4">São Paulo</h3>

                                        <div className="space-y-4">
                                            {perfilSelecionado === 'familia' && (
                                                <>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Tipo de imóvel</div>
                                                        <div className="font-medium">{dadosComparativos.familia.sp.tipo}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Preço médio</div>
                                                        <div className="font-medium">{dadosComparativos.familia.sp.preco}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Área útil</div>
                                                        <div className="font-medium">{dadosComparativos.familia.sp.area}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">IPTU anual</div>
                                                        <div className="font-medium">{dadosComparativos.familia.sp.iptu}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Condomínio</div>
                                                        <div className="font-medium">{dadosComparativos.familia.sp.condominio}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Tempo até centro de SP</div>
                                                        <div className="font-medium">{dadosComparativos.familia.sp.tempo_centro}</div>
                                                    </div>
                                                    <div className="pt-4 border-t border-gray-100">
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Custo anual (IPTU + Condomínio)</div>
                                                        <div className="font-bold text-gray-900">
                                                            {calcularValorAnual(dadosComparativos.familia.sp.condominio)}
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {perfilSelecionado === 'remoto' && (
                                                <>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Tipo de imóvel</div>
                                                        <div className="font-medium">{dadosComparativos.remoto.sp.tipo}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Preço médio</div>
                                                        <div className="font-medium">{dadosComparativos.remoto.sp.preco}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Área útil</div>
                                                        <div className="font-medium">{dadosComparativos.remoto.sp.area}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">IPTU anual</div>
                                                        <div className="font-medium">{dadosComparativos.remoto.sp.iptu}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Condomínio</div>
                                                        <div className="font-medium">{dadosComparativos.remoto.sp.condominio}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Internet</div>
                                                        <div className="font-medium">{dadosComparativos.remoto.sp.internet}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Custo de vida</div>
                                                        <div className="font-medium">{dadosComparativos.remoto.sp.custo_vida}</div>
                                                    </div>
                                                </>
                                            )}

                                            {perfilSelecionado === 'investidor' && (
                                                <>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Tipo de imóvel</div>
                                                        <div className="font-medium">{dadosComparativos.investidor.sp.tipo}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Ticket médio</div>
                                                        <div className="font-medium">{dadosComparativos.investidor.sp.preco}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Valorização anual</div>
                                                        <div className="font-medium">{dadosComparativos.investidor.sp.valorizacao}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Rentabilidade</div>
                                                        <div className="font-medium">{dadosComparativos.investidor.sp.rentabilidade}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500 mb-1">Tempo médio de venda</div>
                                                        <div className="font-medium">{dadosComparativos.investidor.sp.tempo_venda}</div>
                                                    </div>
                                                    <div className="pt-4 border-t border-gray-100">
                                                        <div className="text-sm font-medium text-gray-500 mb-1">ROI estimado em 5 anos</div>
                                                        <div className="font-bold text-gray-900">{dadosComparativos.investidor.sp.roi_5anos}</div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Coluna Guararema */}
                                    <div className="p-6 bg-amber-50">
                                        <h3 className="font-medium text-lg text-amber-800 mb-4">Guararema</h3>

                                        <div className="space-y-4">
                                            {perfilSelecionado === 'familia' && (
                                                <>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Tipo de imóvel</div>
                                                        <div className="font-medium">{dadosComparativos.familia.guararema.tipo}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Preço médio</div>
                                                        <div className="font-medium">{dadosComparativos.familia.guararema.preco}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Área útil</div>
                                                        <div className="font-medium">{dadosComparativos.familia.guararema.area}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">IPTU anual</div>
                                                        <div className="font-medium">{dadosComparativos.familia.guararema.iptu}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Condomínio</div>
                                                        <div className="font-medium">{dadosComparativos.familia.guararema.condominio}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Tempo até centro de SP</div>
                                                        <div className="font-medium">{dadosComparativos.familia.guararema.tempo_centro}</div>
                                                    </div>
                                                    <div className="pt-4 border-t border-amber-100">
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Custo anual (IPTU + Condomínio)</div>
                                                        <div className="font-bold text-amber-900">
                                                            {dadosComparativos.familia.guararema.iptu}
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {perfilSelecionado === 'remoto' && (
                                                <>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Tipo de imóvel</div>
                                                        <div className="font-medium">{dadosComparativos.remoto.guararema.tipo}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Preço médio</div>
                                                        <div className="font-medium">{dadosComparativos.remoto.guararema.preco}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Área útil</div>
                                                        <div className="font-medium">{dadosComparativos.remoto.guararema.area}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">IPTU anual</div>
                                                        <div className="font-medium">{dadosComparativos.remoto.guararema.iptu}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Condomínio</div>
                                                        <div className="font-medium">{dadosComparativos.remoto.guararema.condominio}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Internet</div>
                                                        <div className="font-medium">{dadosComparativos.remoto.guararema.internet}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Custo de vida</div>
                                                        <div className="font-medium">{dadosComparativos.remoto.guararema.custo_vida}</div>
                                                    </div>
                                                </>
                                            )}

                                            {perfilSelecionado === 'investidor' && (
                                                <>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Tipo de imóvel</div>
                                                        <div className="font-medium">{dadosComparativos.investidor.guararema.tipo}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Ticket médio</div>
                                                        <div className="font-medium">{dadosComparativos.investidor.guararema.preco}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Valorização anual</div>
                                                        <div className="font-medium">{dadosComparativos.investidor.guararema.valorizacao}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Rentabilidade</div>
                                                        <div className="font-medium">{dadosComparativos.investidor.guararema.rentabilidade}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-amber-700 mb-1">Tempo médio de venda</div>
                                                        <div className="font-medium">{dadosComparativos.investidor.guararema.tempo_venda}</div>
                                                    </div>
                                                    <div className="pt-4 border-t border-amber-100">
                                                        <div className="text-sm font-medium text-amber-700 mb-1">ROI estimado em 5 anos</div>
                                                        <div className="font-bold text-amber-900">{dadosComparativos.investidor.guararema.roi_5anos}</div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Resumo comparativo */}
                                <div className="p-6 border-t border-gray-200 bg-gray-50">
                                    <h3 className="font-medium text-gray-900 mb-4">Principais diferenciais em Guararema</h3>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        {perfilSelecionado === 'familia' && (
                                            <>
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                                                        <Home className="w-4 h-4 text-amber-600" />
                                                        Espaço adicional
                                                    </h4>
                                                    <p className="text-gray-600 text-sm">
                                                        Em média 65m² a mais, com áreas externas e jardins privativos.
                                                    </p>
                                                </div>

                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                                                        <PiggyBank className="w-4 h-4 text-amber-600" />
                                                        Economia mensal
                                                    </h4>
                                                    <p className="text-gray-600 text-sm">
                                                        Redução significativa em IPTU, condomínio e custo de vida geral.
                                                    </p>
                                                </div>

                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                                                        <Train className="w-4 h-4 text-amber-600" />
                                                        Conexão com SP
                                                    </h4>
                                                    <p className="text-gray-600 text-sm">
                                                        45 min de trem até a Estação da Luz, integrada ao metrô de SP.
                                                    </p>
                                                </div>
                                            </>
                                        )}

                                        {perfilSelecionado === 'remoto' && (
                                            <>
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                                                        <Laptop className="w-4 h-4 text-amber-600" />
                                                        Infraestrutura digital
                                                    </h4>
                                                    <p className="text-gray-600 text-sm">
                                                        Fibra ótica de alta velocidade disponível em todos os bairros.
                                                    </p>
                                                </div>

                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                                                        <Home className="w-4 h-4 text-amber-600" />
                                                        Espaço de trabalho
                                                    </h4>
                                                    <p className="text-gray-600 text-sm">
                                                        Casas com espaço para home office dedicado e co-working local.
                                                    </p>
                                                </div>

                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                                                        <Train className="w-4 h-4 text-amber-600" />
                                                        Acesso a São Paulo
                                                    </h4>
                                                    <p className="text-gray-600 text-sm">
                                                        Conexão por trem ou rodovia para reuniões presenciais quando necessário.
                                                    </p>
                                                </div>
                                            </>
                                        )}

                                        {perfilSelecionado === 'investidor' && (
                                            <>
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                                                        <TrendingUp className="w-4 h-4 text-amber-600" />
                                                        Valorização superior
                                                    </h4>
                                                    <p className="text-gray-600 text-sm">
                                                        Taxa de valorização aproximadamente 2x maior que imóveis similares em SP.
                                                    </p>
                                                </div>

                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                                                        <PiggyBank className="w-4 h-4 text-amber-600" />
                                                        Rendimento locação
                                                    </h4>
                                                    <p className="text-gray-600 text-sm">
                                                        Opções de locação tradicional ou por temporada (yield até 70% maior).
                                                    </p>
                                                </div>

                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                                                        <Zap className="w-4 h-4 text-amber-600" />
                                                        Liquidez
                                                    </h4>
                                                    <p className="text-gray-600 text-sm">
                                                        Tempo médio de venda significativamente menor que em capitais.
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* CTA FINAL - LIMPO E OBJETIVO */}
                <div className="max-w-3xl mx-auto mt-16 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-8 md:flex items-center justify-between">
                            <div className="mb-6 md:mb-0">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Conheça mais sobre o processo
                                </h3>
                                <p className="text-gray-600 max-w-xl">
                                    Agende uma conversa para entender em detalhes cada etapa e como podemos adaptar o processo às suas necessidades específicas.
                                </p>
                            </div>

                            <div className="flex-shrink-0">
                                <a
                                    href="/agendar"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Agendar conversa
                                </a>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <MapPin className="w-4 h-4" />
                                    <span>Guararema - SP</span>
                                </div>

                                <a
                                    href="/mais-informacoes"
                                    className="text-sm font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1"
                                >
                                    Saiba mais
                                    <ChevronRight className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProcessoGuararema

const StepCard = ({ etapa, isSelected, onClick }: { etapa: EtapaProcesso; isSelected: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full text-left p-6 rounded-xl transition-all duration-300",
            "border border-neutral-100 bg-white",
            isSelected ? "shadow-lg ring-2 ring-primary-200" : "shadow-sm hover:shadow-md"
        )}
    >
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
                <div className={cn(
                    "p-3 rounded-lg",
                    isSelected ? "bg-primary-50 text-primary-600" : "bg-neutral-50 text-neutral-400"
                )}>
                    {etapa.icon}
                </div>
                <div>
                    <span className="text-body-2 text-neutral-500 block mb-1">Fase {etapa.fase}</span>
                    <h3 className="text-heading-3 text-neutral-900 font-medium mb-2">
                        {etapa.titulo}
                    </h3>
                    <p className="text-body-2 text-neutral-600 mb-3">
                        {etapa.descricao}
                    </p>
                    <div className="flex items-center gap-2 text-body-2 text-neutral-500">
                        <Clock className="w-4 h-4" />
                        <span>{etapa.tempoMedio}</span>
                    </div>
                </div>
            </div>
            <ChevronRight className={cn(
                "w-5 h-5 transition-transform",
                isSelected ? "rotate-90 text-primary-600" : "text-neutral-400"
            )} />
        </div>
    </button>
);

const StepDetails = ({ etapa }: { etapa: EtapaProcesso }) => (
    <div className="bg-neutral-50 p-6 rounded-xl">
        <div className="space-y-6">
            <div>
                <h4 className="text-heading-4 text-neutral-900 mb-3">O que acontece nesta etapa?</h4>
                <ul className="space-y-3">
                    {etapa.detalhesLocais.map((detalhe, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                            <span className="text-body-2 text-neutral-700">{detalhe}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {etapa.localAtendimento && (
                <div>
                    <h4 className="text-heading-4 text-neutral-900 mb-3">Local de atendimento</h4>
                    <div className="flex items-center gap-2 text-body-2 text-neutral-700">
                        <MapPin className="w-4 h-4 text-neutral-500" />
                        <span>{etapa.localAtendimento}</span>
                    </div>
                </div>
            )}

            {etapa.dica && (
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-heading-4 text-blue-900 mb-1">Dica útil</h4>
                            <p className="text-body-2 text-blue-700">{etapa.dica}</p>
                        </div>
                    </div>
                </div>
            )}

            {etapa.acaoTitulo && etapa.acaoUrl && (
                <a
                    href={etapa.acaoUrl}
                    className={cn(
                        "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
                        "bg-primary-600 text-white text-body-2 font-medium",
                        "hover:bg-primary-700 transition-colors"
                    )}
                >
                    {etapa.acaoTitulo}
                    <ArrowRight className="w-4 h-4" />
                </a>
            )}
        </div>
    </div>
);