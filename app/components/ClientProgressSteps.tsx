'use client'

import React, { useState } from 'react'
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
    Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
}

interface ProcessoGuararemaProps {
    etapaAtual?: number
    mostrarDetalhes?: boolean
}

// Processo específico para Guararema
const etapasGuararema: EtapaProcesso[] = [
    {
        id: "encontro-inicial",
        fase: "1º Momento",
        titulo: "Café na Ipê",
        descricao: "Conversamos sobre seus planos em nosso escritório no Centro",
        detalhesLocais: [
            "Análise do seu perfil e demandas",
            "Explicação sobre bairros de Guararema",
            "Tendências específicas do mercado local",
            "Documentação necessária em SP e Guararema"
        ],
        tempoMedio: "1-2 horas",
        localAtendimento: "Rua Dona Laurinda, 82 - Centro",
        icon: <Coffee className="w-6 h-6" />,
        dica: "Traga suas dúvidas sobre a vida em cidade pequena"
    },
    {
        id: "exploracao-cidade",
        fase: "2º Momento",
        titulo: "Tour por Guararema",
        descricao: "Conhecendo os bairros e entendendo a dinâmica da cidade",
        detalhesLocais: [
            "Visita aos principais bairros (Centro, Nogueira, Itaoca)",
            "Parada na estação CPTM (Linha 11-Coral)",
            "Apresentação de escolas, comércio e serviços",
            "Conversa com moradores locais"
        ],
        tempoMedio: "Meio período",
        icon: <MapPin className="w-6 h-6" />,
        dica: "Ideal fazer no fim de semana para ver o movimento turístico"
    },
    {
        id: "selecao-imoveis",
        fase: "3º Momento",
        titulo: "Curadoria Personalizada",
        descricao: "Seleção criteriosa baseada no que você viu e gostou",
        detalhesLocais: [
            "Máximo 5 imóveis que realmente fazem sentido",
            "Ficha técnica com histórico de cada imóvel",
            "Comparativo de valores por m² em cada bairro",
            "Análise de potencial de valorização"
        ],
        tempoMedio: "3-5 dias",
        icon: <Home className="w-6 h-6" />,
        dica: "Incluímos imóveis que ainda não estão no mercado"
    },
    {
        id: "visitas-tecnicas",
        fase: "4º Momento",
        titulo: "Visitas Detalhadas",
        descricao: "Análise minuciosa com olhar técnico e estratégico",
        detalhesLocais: [
            "Checklist de 47 pontos de verificação",
            "Avaliação estrutural e de manutenção",
            "Simulação de rotina (trabalho em SP, escola, lazer)",
            "Conversa com vizinhos quando possível"
        ],
        tempoMedio: "1-2 semanas",
        icon: <Eye className="w-6 h-6" />,
        dica: "Levamos arquiteto parceiro se necessário"
    },
    {
        id: "negociacao",
        fase: "5º Momento",
        titulo: "Negociação Local",
        descricao: "Mediação respeitosa entre as partes",
        detalhesLocais: [
            "Conhecemos pessoalmente 80% dos vendedores",
            "Histórico de negociações no bairro",
            "Argumentação baseada em dados locais",
            "Condições especiais para pagamento à vista"
        ],
        tempoMedio: "5-10 dias",
        icon: <HandshakeIcon className="w-6 h-6" />,
        dica: "Em Guararema, a palavra ainda vale muito"
    },
    {
        id: "documentacao",
        fase: "6º Momento",
        titulo: "Segurança Jurídica",
        descricao: "Verificação completa com cartórios locais",
        detalhesLocais: [
            "Certidões do 1º e 2º Ofício de Guararema",
            "Verificação na Prefeitura (IPTU, habite-se)",
            "Análise de contratos por advogados parceiros",
            "Registro no Cartório de Notas local"
        ],
        tempoMedio: "15-20 dias",
        icon: <FileText className="w-6 h-6" />,
        dica: "Processos mais rápidos que na capital"
    },
    {
        id: "mudanca",
        fase: "7º Momento",
        titulo: "Boas-vindas a Guararema",
        descricao: "Apoio na adaptação à nova vida",
        detalhesLocais: [
            "Lista de prestadores de serviço confiáveis",
            "Apresentação aos vizinhos e comércio local",
            "Dicas de restaurantes, trilhas e passeios",
            "Grupo WhatsApp de novos moradores"
        ],
        tempoMedio: "Contínuo",
        localAtendimento: "Sua nova casa",
        icon: <Users className="w-6 h-6" />,
        dica: "Você vira parte da família Nova Ipê"
    }
]

// Estatísticas reais
const estatisticasProcesso = [
    { label: "Tempo médio total", value: "45-60 dias", icon: <Clock className="w-4 h-4" /> },
    { label: "Taxa de sucesso", value: "94%", icon: <TrendingUp className="w-4 h-4" /> },
    { label: "Novos Clientes de SP (2025)", value: "+ 50%", icon: <Train className="w-4 h-4" /> },
    { label: "Indicações Individualizadas (Compra & Venda)", value: "Conexões", icon: <Users className="w-4 h-4" /> }
]

const ProcessoGuararema: React.FC<ProcessoGuararemaProps> = ({
    etapaAtual = 4,
    mostrarDetalhes = true
}) => {
    const [etapaSelecionada, setEtapaSelecionada] = useState<string | null>(null)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background pattern sutil */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,0.05) 35px, rgba(0,0,0,0.05) 70px)',
                    }}
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header contextualizado */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full mb-6">
                            <Building className="w-5 h-5" />
                            <span className="text-sm font-semibold">
                                Atendimento Ipê
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Mudando para Guararema:
                            <span className="block text-amber-600 mt-2">
                                um processo planejado em detalhes
                            </span>
                        </h2>

                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Nosso fluxo foi desenvolvido especialmente para famílias
                            e investidores que buscam qualidade de vida sem abrir mão
                            da conexão com os grandes centros.
                        </p>
                    </motion.div>
                </div>

                {/* Timeline visual */}
                <div className="relative mb-20">
                    {/* Linha de conexão */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 hidden lg:block transform -translate-y-1/2" />

                    {/* Etapas */}
                    <div className="grid lg:grid-cols-7 gap-8 relative">
                        {etapasGuararema.map((etapa, index) => (
                            <motion.div
                                key={etapa.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/* Card da etapa */}
                                <div className={cn(
                                    "bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300",
                                    index < etapaAtual
                                        ? "border-green-400 shadow-md"
                                        : index === etapaAtual
                                            ? "border-amber-500 shadow-xl transform scale-105"
                                            : "border-gray-200 opacity-80",
                                    hoveredIndex === index && "transform -translate-y-2 shadow-xl"
                                )}
                                    onClick={() => setEtapaSelecionada(etapa.id === etapaSelecionada ? null : etapa.id)}
                                >
                                    {/* Número da fase */}
                                    <div className={cn(
                                        "absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                                        index < etapaAtual
                                            ? "bg-green-500 text-white"
                                            : index === etapaAtual
                                                ? "bg-amber-500 text-white"
                                                : "bg-gray-300 text-gray-600"
                                    )}>
                                        {index < etapaAtual ? <CheckCircle className="w-5 h-5" /> : index + 1}
                                    </div>

                                    {/* Ícone e título */}
                                    <div className={cn(
                                        "w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto",
                                        index <= etapaAtual
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-gray-100 text-gray-400"
                                    )}>
                                        {etapa.icon}
                                    </div>

                                    <h3 className="font-bold text-gray-900 text-center mb-2">
                                        {etapa.titulo}
                                    </h3>

                                    <p className="text-sm text-gray-600 text-center mb-3">
                                        {etapa.descricao}
                                    </p>

                                    {/* Tempo médio */}
                                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                                        <Calendar className="w-3 h-3" />
                                        <span>{etapa.tempoMedio}</span>
                                    </div>
                                </div>

                                {/* Detalhes expandidos */}
                                <AnimatePresence>
                                    {etapaSelecionada === etapa.id && mostrarDetalhes && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="absolute top-full mt-4 left-0 right-0 z-20"
                                        >
                                            <div className="bg-white rounded-xl shadow-2xl border border-amber-200 p-6">
                                                <h4 className="font-bold text-gray-900 mb-4">
                                                    O que acontece nesta etapa:
                                                </h4>

                                                <ul className="space-y-2 mb-4">
                                                    {etapa.detalhesLocais.map((detalhe, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                            <span>{detalhe}</span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                {etapa.localAtendimento && (
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        <MapPin className="w-4 h-4 inline mr-1 text-amber-600" />
                                                        Local: {etapa.localAtendimento}
                                                    </p>
                                                )}

                                                {etapa.dica && (
                                                    <div className="bg-amber-50 rounded-lg p-3">
                                                        <p className="text-sm text-amber-800">
                                                            <strong>Dica:</strong> {etapa.dica}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Estatísticas e garantias */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Estatísticas */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            Números que demonstram eficiência
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            {estatisticasProcesso.map((stat) => (
                                <div key={stat.label} className="bg-white rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        {stat.icon}
                                        <span className="text-2xl font-bold text-gray-900">
                                            {stat.value}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Diferenciais */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            O diferencial Guararema
                        </h3>

                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                                <div>
                                    <strong className="text-gray-900">Conhecimento hiperlocal:</strong>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Sabemos qual rua não tem sinal de celular, onde o ônibus
                                        escolar passa, qual padaria abre domingo.
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                                <div>
                                    <strong className="text-gray-900">Rede de apoio:</strong>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Conectamos você com outros profissionais que mudaram de SP,
                                        criando uma comunidade de apoio.
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Train className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                                <div>
                                    <strong className="text-gray-900">Logística SP-Guararema:</strong>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Orientação sobre melhores horários de trem, estacionamentos
                                        na estação, alternativas em dias de manutenção.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* CTA contextualizado */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-10 text-white lg:max-w-2xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                            Pronto para começar sua jornada?
                        </h3>

                        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                            O primeiro passo é sempre o mais importante. Vamos conversar sobre
                            seus planos e como Guararema pode fazer parte do seu futuro.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/agendar-cafe"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                            >
                                <Coffee className="w-5 h-5" />
                                Agendar atendimento
                            </a>
                            <a
                                href="/guia-mudanca"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors border border-white/20"
                            >
                                Baixar guia de mudança
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default ProcessoGuararema