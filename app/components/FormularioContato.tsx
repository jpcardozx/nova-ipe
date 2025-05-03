'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MapPin,
    Sparkles,
    ArrowRight,
    Clock,
    X,
    CheckCircle,
    ChevronDown,
    Lock,
    Star,
    TrendingUp,
    Search,
    UserCheck,
    Gift,
    Zap
} from 'lucide-react'

// Tipos
interface PropriedadeExclusiva {
    id: string;
    titulo: string;
    bairro: string;
    preco: string;
    desconto: string;
    destaque: string;
    imagem: string;
    disponivel: boolean;
}

type PropriedadeRastreamento = {
    id: string;
    status: 'pendente' | 'encontrada' | 'nenhuma';
}

export default function FormularioContatoAprimorado() {
    // Estados para controlar a experiência
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [activeTab, setActiveTab] = useState<'exclusivo' | 'rastreador'>('exclusivo')
    const [isTracking, setIsTracking] = useState(false)
    const [trackingCriteria, setTrackingCriteria] = useState({
        tipo: 'apartamento',
        bairro: '',
        minQuartos: 2,
        minPreco: 0,
        maxPreco: 1000000,
    })
    const [propriedadeRastreada, setPropriedadeRastreada] = useState<PropriedadeRastreamento | null>(null)
    const [countdown, setCountdown] = useState({ minutes: 30, seconds: 0 })
    const [showSuccess, setShowSuccess] = useState(false)
    const [selectedPropriedade, setSelectedPropriedade] = useState<string | null>(null)
    const [emailError, setEmailError] = useState(false)

    // Feedback visual de pessoas que se cadastraram recentemente
    const [recentSignups, setRecentSignups] = useState([
        { nome: 'Marina S.', tempo: '3 min atrás', bairro: 'Jardins' },
        { nome: 'Carlos A.', tempo: '7 min atrás', bairro: 'Pinheiros' },
        { nome: 'Roberto P.', tempo: '12 min atrás', bairro: 'Vila Mariana' }
    ])

    // Oportunidades exclusivas (seriam carregadas de uma API)
    const [propriedadesExclusivas, setPropriedadesExclusivas] = useState<PropriedadeExclusiva[]>([
        {
            id: 'p001',
            titulo: 'Apartamento de luxo com vista panorâmica',
            bairro: 'Jardins',
            preco: 'R$ 1.290.000',
            desconto: '13% abaixo do mercado',
            destaque: 'EXCLUSIVO - 48h restantes',
            imagem: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            disponivel: true
        },
        {
            id: 'p002',
            titulo: 'Cobertura duplex com terraço gourmet',
            bairro: 'Itaim Bibi',
            preco: 'R$ 2.470.000',
            desconto: '8% abaixo do mercado',
            destaque: 'EXCLUSIVO - Sem entrada',
            imagem: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            disponivel: true
        },
        {
            id: 'p003',
            titulo: 'Studio moderno próximo ao metrô',
            bairro: 'Vila Madalena',
            preco: 'R$ 650.000',
            desconto: '11% abaixo do mercado',
            destaque: 'EXCLUSIVO - Mobiliado',
            imagem: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            disponivel: true
        }
    ])

    // Contador regressivo
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 }
                } else if (prev.minutes > 0) {
                    return { minutes: prev.minutes - 1, seconds: 59 }
                } else {
                    clearInterval(timer)
                    return { minutes: 0, seconds: 0 }
                }
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // Simular rastreamento de propriedade
    const iniciarRastreamento = () => {
        if (!trackingCriteria.bairro || !email) {
            setEmailError(!email)
            return
        }

        setIsTracking(true)
        setPropriedadeRastreada({
            id: 'track' + Math.floor(Math.random() * 1000),
            status: 'pendente'
        })

        setTimeout(() => {
            // Simular resultado de pesquisa
            const random = Math.random()
            if (random > 0.3) {
                setPropriedadeRastreada(prev =>
                    prev ? { ...prev, status: 'encontrada' } : null
                )
            } else {
                setPropriedadeRastreada(prev =>
                    prev ? { ...prev, status: 'nenhuma' } : null
                )
            }
        }, 3500)
    }

    // Validar e abrir o modal
    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            setEmailError(true)
            return
        }

        setShowModal(true)
    }

    // Selecionar propriedade e mostrar sucesso
    const handlePropriedadeSelect = (id: string) => {
        setSelectedPropriedade(id)
        setTimeout(() => {
            setShowSuccess(true)
            setShowModal(false)
        }, 1000)
    }

    // Atualizar os cadastros recentes (simulado)
    useEffect(() => {
        const interval = setInterval(() => {
            const nomes = ['João', 'Pedro', 'Ana', 'Lucas', 'Rafael', 'Mariana', 'Fernando', 'Bianca']
            const sobrenomes = ['S.', 'C.', 'R.', 'B.', 'M.', 'T.', 'L.', 'P.']
            const bairros = ['Pinheiros', 'Vila Olímpia', 'Jardins', 'Vila Mariana', 'Moema', 'Itaim Bibi']
            const tempos = ['agora mesmo', '1 min atrás', '2 min atrás']

            const novoSignup = {
                nome: `${nomes[Math.floor(Math.random() * nomes.length)]} ${sobrenomes[Math.floor(Math.random() * sobrenomes.length)]}`,
                tempo: tempos[Math.floor(Math.random() * tempos.length)],
                bairro: bairros[Math.floor(Math.random() * bairros.length)]
            }

            setRecentSignups(prev => [novoSignup, ...prev.slice(0, 2)])
        }, 25000)

        return () => clearInterval(interval)
    }, [])

    // Variantes para animações
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 25 }
        },
        hover: {
            y: -8,
            boxShadow: "0px 20px 40px rgba(0,0,0,0.1)",
            transition: { type: "spring", stiffness: 300, damping: 25 }
        },
        selected: {
            scale: 1.03,
            boxShadow: "0px 25px 50px rgba(0,0,0,0.18)",
            borderColor: "#FF9800",
            transition: { type: "spring", stiffness: 400, damping: 15 }
        }
    }

    // Formatar tempo restante
    const formattedTime = `${countdown.minutes}:${countdown.seconds < 10 ? '0' + countdown.seconds : countdown.seconds}`

    return (
        <section className="py-16 md:py-24 relative bg-gradient-to-br from-stone-50 via-white to-amber-50 overflow-hidden">
            {/* Padrão decorativo */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-full bg-grid-pattern opacity-50" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            {/* Efeito de brilho animado */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-400 opacity-10 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600 opacity-10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Badge superior */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg mb-4">
                        <Sparkles size={14} className="mr-2" />
                        OPORTUNIDADES PRÉ-LANÇAMENTO
                    </span>

                    {/* Headline principal */}
                    <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 tracking-tight leading-tight">
                        Desbloqueie imóveis <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600">exclusivos</span> antes<br className="hidden md:block" /> que cheguem ao mercado
                    </h2>

                    {/* Subtexto com contador regressivo */}
                    <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-6">
                        Cadastre-se para ter acesso imediato a propriedades com até <span className="font-semibold text-amber-700">15% de desconto</span> que não estão disponíveis nos portais convencionais.
                    </p>

                    {/* Contador regressivo */}
                    <div className="inline-flex items-center bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-8">
                        <Clock className="text-amber-700 mr-2" size={18} />
                        <span className="text-amber-800 font-medium">
                            Ofertas disponíveis por mais: <span className="font-bold">{formattedTime}</span>
                        </span>
                    </div>

                    {/* Métricas sociais de prova */}
                    <div className="flex flex-wrap justify-center gap-8 mb-12">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-stone-900 mb-1">97%</span>
                            <span className="text-sm text-stone-600">das oportunidades exclusivas<br />vendidas em menos de 30 dias</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-stone-900 mb-1">642</span>
                            <span className="text-sm text-stone-600">pessoas aproveitaram<br />ofertas exclusivas em 2024</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-stone-900 mb-1">R$ 87.522</span>
                            <span className="text-sm text-stone-600">economia média por<br />comprador em 2024</span>
                        </div>
                    </div>

                    {/* Formulário simplificado */}
                    <div className="max-w-lg mx-auto">
                        <form onSubmit={handleEmailSubmit} className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="email"
                                    placeholder="Digite seu email para acesso imediato"
                                    className={`w-full px-5 py-4 rounded-lg text-base border ${emailError ? 'border-red-300 bg-red-50' : 'border-stone-300'} focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm`}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setEmailError(false)
                                    }}
                                    value={email}
                                />
                                {emailError && (
                                    <p className="absolute -bottom-6 left-0 text-red-600 text-sm">Email é obrigatório</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-4 rounded-lg font-medium bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg hover:from-amber-700 hover:to-amber-600 transform transition-all duration-200 flex-shrink-0 flex items-center justify-center gap-2"
                            >
                                Acessar agora
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>

                    {/* Social proof feed ao vivo */}
                    <div className="mt-12 flex justify-center">
                        <div className="flex items-center space-x-4 bg-white bg-opacity-80 backdrop-blur-sm rounded-full py-2 px-4 shadow-sm">
                            <div className="flex -space-x-2">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                                        {recentSignups[i]?.nome.charAt(0)}
                                    </div>
                                ))}
                            </div>
                            <div className="text-left">
                                <p className="text-sm text-stone-700">
                                    <span className="font-medium">{recentSignups[0]?.nome}</span> e <span className="font-medium">outros na região</span> acabaram de desbloquear o acesso
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Benefícios principais */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
                    <motion.div
                        className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-amber-500 flex"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="mr-5">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                <TrendingUp size={22} className="text-amber-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-stone-900 text-lg mb-2">Preços pré-lançamento</h3>
                            <p className="text-stone-600 text-sm">Acesso a propriedades com até 15% de desconto antes de serem listadas publicamente.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-amber-500 flex"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="mr-5">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                <Search size={22} className="text-amber-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-stone-900 text-lg mb-2">Rastreador de imóveis</h3>
                            <p className="text-stone-600 text-sm">Nossa IA encontra propriedades que correspondem exatamente às suas necessidades em tempo real.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-amber-500 flex"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="mr-5">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                <UserCheck size={22} className="text-amber-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-stone-900 text-lg mb-2">Consultores dedicados</h3>
                            <p className="text-stone-600 text-sm">Atendimento prioritário com especialistas no mercado de alto padrão da sua região.</p>
                        </div>
                    </motion.div>
                </div>

                {/* Depoimentos */}
                <div className="mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div
                            className="bg-white rounded-xl p-6 shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-semibold mr-3">
                                    RS
                                </div>
                                <div>
                                    <h4 className="font-medium text-stone-900">Ricardo Silva</h4>
                                    <div className="flex text-amber-500">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={12} fill="#f59e0b" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-stone-600 text-sm">
                                "Economizei R$78 mil em um apartamento no Itaim através do acesso exclusivo. Nenhum outro portal tinha essa oferta."
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-xl p-6 shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-semibold mr-3">
                                    CP
                                </div>
                                <div>
                                    <h4 className="font-medium text-stone-900">Carla Pereira</h4>
                                    <div className="flex text-amber-500">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={12} fill="#f59e0b" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-stone-600 text-sm">
                                "O rastreador de imóveis encontrou exatamente o que eu procurava em 48h, depois de meses buscando em outros portais sem sucesso."
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-xl p-6 shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-semibold mr-3">
                                    ML
                                </div>
                                <div>
                                    <h4 className="font-medium text-stone-900">Marcos Lima</h4>
                                    <div className="flex text-amber-500">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={12} fill="#f59e0b" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-stone-600 text-sm">
                                "Consegui condições especiais de financiamento pelo consultor dedicado. Fechei o negócio no mesmo dia que a propriedade foi liberada."
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Modal para acesso exclusivo */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header do modal */}
                            <div className="px-6 py-5 border-b border-stone-200 flex justify-between items-center sticky top-0 bg-white z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-stone-900">Oportunidades exclusivas</h3>
                                    <p className="text-stone-600 text-sm">Disponíveis apenas por {formattedTime}</p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-stone-500 hover:text-stone-700 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-stone-200 sticky top-[73px] bg-white z-10">
                                <button
                                    className={`flex-1 py-4 font-medium text-center relative ${activeTab === 'exclusivo' ? 'text-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
                                    onClick={() => setActiveTab('exclusivo')}
                                >
                                    Propriedades exclusivas
                                    {activeTab === 'exclusivo' && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                                            layoutId="activeTab"
                                        />
                                    )}
                                </button>
                                <button
                                    className={`flex-1 py-4 font-medium text-center relative ${activeTab === 'rastreador' ? 'text-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
                                    onClick={() => setActiveTab('rastreador')}
                                >
                                    Rastreador de imóveis
                                    {activeTab === 'rastreador' && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                                            layoutId="activeTab"
                                        />
                                    )}
                                </button>
                            </div>

                            {/* Conteúdo do Modal */}
                            <div className="p-6">
                                {/* Tab de Propriedades Exclusivas */}
                                {activeTab === 'exclusivo' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="mb-6 flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                                <Gift size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-stone-900">Aproveite nossos descontos exclusivos</h4>
                                                <p className="text-stone-600 text-sm">Selecione uma propriedade para obter acesso prioritário</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {propriedadesExclusivas.map((propriedade) => (
                                                <motion.div
                                                    key={propriedade.id}
                                                    className={`bg-white border rounded-xl overflow-hidden flex flex-col md:flex-row cursor-pointer ${selectedPropriedade === propriedade.id ? 'border-amber-500 ring-2 ring-amber-200' : 'border-stone-200 hover:border-amber-200'}`}
                                                    variants={cardVariants}
                                                    initial="hidden"
                                                    animate={selectedPropriedade === propriedade.id ? "selected" : "visible"}
                                                    whileHover={selectedPropriedade ? {} : "hover"}
                                                    onClick={() => handlePropriedadeSelect(propriedade.id)}
                                                >
                                                    {/* Imagem */}
                                                    <div className="md:w-1/3 h-60 md:h-auto relative">
                                                        <img
                                                            src={propriedade.imagem}
                                                            alt={propriedade.titulo}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                            {propriedade.destaque}
                                                        </div>
                                                    </div>

                                                    {/* Detalhes */}
                                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex items-center mb-3">
                                                                <MapPin size={16} className="text-amber-600 mr-1.5" />
                                                                <span className="text-stone-600 text-sm">{propriedade.bairro}</span>
                                                            </div>
                                                            <h3 className="font-bold text-stone-900 text-lg mb-2">{propriedade.titulo}</h3>
                                                            <div className="flex items-baseline mb-3">
                                                                <span className="text-xl font-bold text-stone-900 mr-2">{propriedade.preco}</span>
                                                                <span className="text-sm font-medium text-green-600">{propriedade.desconto}</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mb-4">
                                                                <span className="bg-stone-100 text-stone-800 px-3 py-1 text-xs rounded-full">3 quartos</span>
                                                                <span className="bg-stone-100 text-stone-800 px-3 py-1 text-xs rounded-full">2 vagas</span>
                                                                <span className="bg-stone-100 text-stone-800 px-3 py-1 text-xs rounded-full">110m²</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center">
                                                            <div className="flex-1">
                                                                <div className="text-xs text-stone-500">Exclusividade expira em</div>
                                                                <div className="font-medium">{formattedTime}</div>
                                                            </div>
                                                            <button
                                                                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-1.5 ${selectedPropriedade === propriedade.id ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700'}`}
                                                            >
                                                                {selectedPropriedade === propriedade.id ? (
                                                                    <>
                                                                        <CheckCircle size={16} />
                                                                        Selecionado
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        Quero esta
                                                                        <ArrowRight size={16} />
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Tab do Rastreador de Imóveis */}
                                {activeTab === 'rastreador' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative"
                                    >
                                        <div className="mb-6 flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                                <Zap size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-stone-900">Rastreador de imóveis por IA</h4>
                                                <p className="text-stone-600 text-sm">Nossa tecnologia encontra imóveis exatamente como você precisa</p>
                                            </div>
                                        </div>

                                        {!isTracking ? (
                                            <div className="bg-white border border-stone-200 rounded-xl p-6">
                                                <div className="mb-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                                                Tipo de imóvel
                                                            </label>
                                                            <select
                                                                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                                value={trackingCriteria.tipo}
                                                                onChange={(e) => setTrackingCriteria(prev => ({ ...prev, tipo: e.target.value }))}
                                                            >
                                                                <option value="apartamento">Apartamento</option>
                                                                <option value="casa">Casa</option>
                                                                <option value="comercial">Comercial</option>
                                                                <option value="terreno">Terreno</option>
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                                                Bairro de interesse *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className={`w-full px-4 py-3 rounded-lg border ${!trackingCriteria.bairro && !email ? 'border-red-300 bg-red-50' : 'border-stone-300'} focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
                                                                placeholder="Ex: Jardins, Pinheiros..."
                                                                value={trackingCriteria.bairro}
                                                                onChange={(e) => setTrackingCriteria(prev => ({ ...prev, bairro: e.target.value }))}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                                                Mínimo de quartos
                                                            </label>
                                                            <select
                                                                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                                value={trackingCriteria.minQuartos}
                                                                onChange={(e) => setTrackingCriteria(prev => ({ ...prev, minQuartos: Number(e.target.value) }))}
                                                            >
                                                                <option value="1">1+</option>
                                                                <option value="2">2+</option>
                                                                <option value="3">3+</option>
                                                                <option value="4">4+</option>
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                                                Faixa de preço
                                                            </label>
                                                            <select
                                                                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                                value={trackingCriteria.maxPreco}
                                                                onChange={(e) => setTrackingCriteria(prev => ({ ...prev, maxPreco: Number(e.target.value) }))}
                                                            >
                                                                <option value="500000">Até R$ 500 mil</option>
                                                                <option value="1000000">Até R$ 1 milhão</option>
                                                                <option value="2000000">Até R$ 2 milhões</option>
                                                                <option value="5000000">Até R$ 5 milhões</option>
                                                                <option value="10000000">Acima de R$ 5 milhões</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* Campo para preenchimento de telefone */}
                                                    <div className="mb-6">
                                                        <label className="block text-sm font-medium text-stone-700 mb-1">
                                                            Seu telefone (para alertas imediatos)
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                            placeholder="(00) 00000-0000"
                                                            value={telefone}
                                                            onChange={(e) => setTelefone(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-end">
                                                    <button
                                                        className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow hover:from-amber-700 hover:to-amber-600 transition-all duration-200 flex items-center gap-2"
                                                        onClick={iniciarRastreamento}
                                                    >
                                                        Iniciar rastreamento
                                                        <Search size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-white border border-stone-200 rounded-xl p-8 text-center">
                                                {propriedadeRastreada?.status === 'pendente' && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="py-10"
                                                    >
                                                        {/* Animação de busca */}
                                                        <div className="w-20 h-20 mx-auto mb-6 relative">
                                                            <div className="absolute inset-0 rounded-full border-4 border-amber-200 opacity-25"></div>
                                                            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                                                            <div className="absolute inset-0 flex items-center justify-center text-amber-600">
                                                                <Search size={24} />
                                                            </div>
                                                        </div>

                                                        <h3 className="text-xl font-bold text-stone-900 mb-3">
                                                            Buscando imóveis que correspondem às suas necessidades
                                                        </h3>
                                                        <p className="text-stone-600 mb-6 max-w-md mx-auto">
                                                            Nossa IA está analisando nossa base de dados exclusiva para encontrar as propriedades ideais para você em {trackingCriteria.bairro}.
                                                        </p>
                                                    </motion.div>
                                                )}

                                                {propriedadeRastreada?.status === 'encontrada' && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="py-6"
                                                    >
                                                        {/* Resultado de sucesso */}
                                                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                                                            <CheckCircle className="text-green-600 w-10 h-10" />
                                                        </div>

                                                        <h3 className="text-xl font-bold text-stone-900 mb-3">
                                                            Encontramos 3 imóveis que correspondem exatamente ao que você procura!
                                                        </h3>
                                                        <p className="text-stone-600 mb-8 max-w-lg mx-auto">
                                                            Um de nossos consultores entrará em contato nas próximas horas com informações detalhadas e condições exclusivas para você.
                                                        </p>

                                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-6 max-w-lg mx-auto">
                                                            <div className="flex items-start">
                                                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3 flex-shrink-0">
                                                                    <Sparkles size={18} />
                                                                </div>
                                                                <div className="text-left">
                                                                    <h4 className="font-medium text-amber-800 mb-1">Bônus exclusivo ativado!</h4>
                                                                    <p className="text-amber-700 text-sm">
                                                                        Você receberá uma avaliação gratuita de financiamento e um desconto especial de 2% na taxa de corretagem ao fechar negócio.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <button
                                                            className="px-6 py-3 mt-4 rounded-lg font-medium bg-amber-600 text-white shadow hover:bg-amber-700 transition-all duration-200"
                                                            onClick={() => setShowModal(false)}
                                                        >
                                                            Entendi, aguardarei o contato
                                                        </button>
                                                    </motion.div>
                                                )}

                                                {propriedadeRastreada?.status === 'nenhuma' && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="py-6"
                                                    >
                                                        {/* Resultado sem imóveis */}
                                                        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                                                            <Search className="text-amber-600 w-10 h-10" />
                                                        </div>

                                                        <h3 className="text-xl font-bold text-stone-900 mb-3">
                                                            Ainda não temos imóveis disponíveis com esse perfil
                                                        </h3>
                                                        <p className="text-stone-600 mb-8 max-w-lg mx-auto">
                                                            Mas não se preocupe! Nosso sistema continuará monitorando o mercado 24h por dia e você será o primeiro a saber quando um imóvel com essas características aparecer.
                                                        </p>

                                                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                                                            <button
                                                                className="px-6 py-3 rounded-lg font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all duration-200"
                                                                onClick={() => {
                                                                    setIsTracking(false)
                                                                    setPropriedadeRastreada(null)
                                                                }}
                                                            >
                                                                Tentar outros critérios
                                                            </button>

                                                            <button
                                                                className="px-6 py-3 rounded-lg font-medium bg-amber-600 text-white shadow hover:bg-amber-700 transition-all duration-200"
                                                                onClick={() => setActiveTab('exclusivo')}
                                                            >
                                                                Ver propriedades exclusivas
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>

                            {/* Rodapé do modal */}
                            <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between sticky bottom-0">
                                <div className="flex items-center text-sm text-stone-600">
                                    <Lock size={14} className="mr-1.5" />
                                    Seus dados estão protegidos e não serão compartilhados
                                </div>

                                {activeTab === 'exclusivo' && !selectedPropriedade && (
                                    <button
                                        className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center"
                                        onClick={() => setActiveTab('rastreador')}
                                    >
                                        Preferir o rastreador de imóveis?
                                        <ChevronDown size={16} className="ml-1" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mensagem de sucesso */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        className="fixed bottom-4 right-4 bg-white rounded-xl p-4 shadow-xl border border-green-200 flex items-start max-w-md z-50"
                        initial={{ opacity: 0, y: 50, x: 20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ type: "spring", damping: 25 }}
                    >
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-stone-900 mb-1">Solicitação enviada com sucesso!</h4>
                            <p className="text-stone-600 text-sm mb-3">
                                Um de nossos consultores entrará em contato em breve com mais informações sobre a propriedade selecionada.
                            </p>
                            <button
                                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                                onClick={() => setShowSuccess(false)}
                            >
                                Fechar
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CSS para animações personalizadas */}
            <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -15px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(15px, 25px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 15s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </section>
    )
}