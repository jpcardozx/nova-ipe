'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import {
    Star,
    Plus,
    Search,
    Filter,
    Eye,
    MessageSquare,
    Reply,
    Flag,
    User,
    Calendar,
    Building2,
    ThumbsUp,
    ThumbsDown,
    TrendingUp,
    Users,
    Award,
    AlertTriangle,
    CheckCircle,
    Clock,
    ExternalLink
} from 'lucide-react'

interface Review {
    id: string
    client_name: string
    client_email: string
    client_avatar?: string
    property_id?: string
    property_title?: string
    rating: number
    title: string
    content: string
    pros: string[]
    cons: string[]
    status: 'pending' | 'approved' | 'rejected' | 'flagged'
    is_verified: boolean
    helpful_votes: number
    unhelpful_votes: number
    admin_response?: string
    admin_response_date?: string
    created_at: string
    updated_at: string
    source: 'website' | 'google' | 'facebook' | 'email' | 'phone'
}

interface ReviewStats {
    total: number
    average_rating: number
    pending_approval: number
    verified_reviews: number
    rating_distribution: {
        1: number
        2: number
        3: number
        4: number
        5: number
    }
}

export default function ReviewsPage() {
    const { user } = useCurrentUser()
    const [reviews, setReviews] = useState<Review[]>([])
    const [stats, setStats] = useState<ReviewStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | Review['status']>('all')
    const [ratingFilter, setRatingFilter] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all')
    const [selectedReview, setSelectedReview] = useState<Review | null>(null)
    const [responseText, setResponseText] = useState('')

    useEffect(() => {
        loadReviews()
        loadStats()
    }, [])

    const loadReviews = async () => {
        try {
            // Simulando dados de avaliações
            const mockReviews: Review[] = [
                {
                    id: '1',
                    client_name: 'Maria Santos',
                    client_email: 'maria.santos@email.com',
                    client_avatar: '/avatars/maria.jpg',
                    property_id: 'prop-123',
                    property_title: 'Apartamento 3 quartos - Itaim Bibi',
                    rating: 5,
                    title: 'Excelente atendimento e imóvel perfeito!',
                    content: 'Fui muito bem atendida desde o primeiro contato. O corretor foi muito profissional e me ajudou a encontrar exatamente o que eu procurava. O apartamento superou minhas expectativas!',
                    pros: ['Localização excelente', 'Atendimento profissional', 'Processo rápido'],
                    cons: [],
                    status: 'approved',
                    is_verified: true,
                    helpful_votes: 8,
                    unhelpful_votes: 0,
                    admin_response: 'Muito obrigado pela avaliação, Maria! Ficamos felizes em ter ajudado você a encontrar seu novo lar.',
                    admin_response_date: '2025-01-14T10:30:00.000Z',
                    created_at: '2025-01-13T14:22:00.000Z',
                    updated_at: '2025-01-14T10:30:00.000Z',
                    source: 'website'
                },
                {
                    id: '2',
                    client_name: 'João Silva',
                    client_email: 'joao.silva@email.com',
                    property_id: 'prop-456',
                    property_title: 'Casa 4 quartos - Vila Madalena',
                    rating: 4,
                    title: 'Boa experiência, mas pode melhorar',
                    content: 'No geral foi uma boa experiência. O corretor foi atencioso e a casa estava em ótimo estado. Só achei que o processo de documentação demorou um pouco mais do que esperado.',
                    pros: ['Corretor atencioso', 'Casa em ótimo estado', 'Preço justo'],
                    cons: ['Documentação demorada'],
                    status: 'approved',
                    is_verified: true,
                    helpful_votes: 5,
                    unhelpful_votes: 1,
                    created_at: '2025-01-12T09:15:00.000Z',
                    updated_at: '2025-01-12T09:15:00.000Z',
                    source: 'google'
                },
                {
                    id: '3',
                    client_name: 'Ana Costa',
                    client_email: 'ana.costa@email.com',
                    rating: 3,
                    title: 'Experiência mediana',
                    content: 'O atendimento foi ok, mas senti que poderia ter sido mais personalizado. O imóvel visitado não estava nas melhores condições de limpeza.',
                    pros: ['Localização boa'],
                    cons: ['Falta de personalização', 'Limpeza do imóvel'],
                    status: 'pending',
                    is_verified: false,
                    helpful_votes: 0,
                    unhelpful_votes: 0,
                    created_at: '2025-01-15T16:45:00.000Z',
                    updated_at: '2025-01-15T16:45:00.000Z',
                    source: 'email'
                },
                {
                    id: '4',
                    client_name: 'Carlos Mendes',
                    client_email: 'carlos.mendes@email.com',
                    property_id: 'prop-789',
                    property_title: 'Cobertura - Moema',
                    rating: 5,
                    title: 'Superou todas as expectativas!',
                    content: 'Desde o primeiro contato até a entrega das chaves, tudo foi perfeito. Equipe muito profissional e atenciosa. Recomendo para todos!',
                    pros: ['Equipe profissional', 'Processo transparente', 'Imóvel excepcional'],
                    cons: [],
                    status: 'approved',
                    is_verified: true,
                    helpful_votes: 12,
                    unhelpful_votes: 0,
                    admin_response: 'Obrigado Carlos! Sua satisfação é nossa maior recompensa.',
                    admin_response_date: '2025-01-11T11:20:00.000Z',
                    created_at: '2025-01-10T13:30:00.000Z',
                    updated_at: '2025-01-11T11:20:00.000Z',
                    source: 'website'
                }
            ]

            setReviews(mockReviews)
        } catch (error) {
            console.error('Error loading reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadStats = async () => {
        try {
            const mockStats: ReviewStats = {
                total: 127,
                average_rating: 4.3,
                pending_approval: 8,
                verified_reviews: 89,
                rating_distribution: {
                    1: 3,
                    2: 5,
                    3: 18,
                    4: 42,
                    5: 59
                }
            }
            setStats(mockStats)
        } catch (error) {
            console.error('Error loading stats:', error)
        }
    }

    const getStatusBadge = (status: Review['status']) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            flagged: 'bg-orange-100 text-orange-800'
        }

        const labels = {
            pending: 'Pendente',
            approved: 'Aprovada',
            rejected: 'Rejeitada',
            flagged: 'Sinalizada'
        }

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
                {labels[status]}
            </span>
        )
    }

    const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
        const sizeClasses = {
            sm: 'h-3 w-3',
            md: 'h-4 w-4',
            lg: 'h-5 w-5'
        }

        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${sizeClasses[size]} ${star <= rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        )
    }

    const handleStatusUpdate = async (reviewId: string, newStatus: Review['status']) => {
        setReviews(reviews.map(review =>
            review.id === reviewId
                ? { ...review, status: newStatus, updated_at: new Date().toISOString() }
                : review
        ))
    }

    const handleResponse = async (reviewId: string) => {
        if (!responseText.trim()) return

        setReviews(reviews.map(review =>
            review.id === reviewId
                ? {
                    ...review,
                    admin_response: responseText,
                    admin_response_date: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
                : review
        ))

        setSelectedReview(null)
        setResponseText('')
    }

    const filteredReviews = reviews.filter(review => {
        const matchesSearch =
            review.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.content.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'all' || review.status === statusFilter
        const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter

        return matchesSearch && matchesStatus && matchesRating
    })

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Carregando avaliações...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <Star className="h-7 w-7 text-yellow-500" />
                            Avaliações de Clientes
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Gerencie feedback e avaliações dos clientes
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                            <Plus className="h-4 w-4" />
                            Solicitar Avaliação
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Star className="h-8 w-8 text-yellow-500" />
                            <span className="text-xs text-yellow-600 font-medium">Total</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {stats?.total}
                        </div>
                        <div className="text-sm text-gray-600">Avaliações</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <TrendingUp className="h-8 w-8 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Média</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                            {stats?.average_rating}
                            {renderStars(Math.round(stats?.average_rating || 0), 'sm')}
                        </div>
                        <div className="text-sm text-gray-600">Nota Geral</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Clock className="h-8 w-8 text-yellow-600" />
                            <span className="text-xs text-yellow-600 font-medium">Pendente</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {stats?.pending_approval}
                        </div>
                        <div className="text-sm text-gray-600">Aguardando</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <CheckCircle className="h-8 w-8 text-blue-600" />
                            <span className="text-xs text-blue-600 font-medium">Verificadas</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {stats?.verified_reviews}
                        </div>
                        <div className="text-sm text-gray-600">Confirmadas</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Award className="h-8 w-8 text-purple-600" />
                            <span className="text-xs text-purple-600 font-medium">5 Estrelas</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {stats?.rating_distribution[5]}
                        </div>
                        <div className="text-sm text-gray-600">Excelentes</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Buscar por cliente, título ou conteúdo..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as 'all' | Review['status'])}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="pending">Pendente</option>
                            <option value="approved">Aprovada</option>
                            <option value="rejected">Rejeitada</option>
                            <option value="flagged">Sinalizada</option>
                        </select>

                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value as 'all' | '1' | '2' | '3' | '4' | '5')}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                            <option value="all">Todas as Notas</option>
                            <option value="5">5 Estrelas</option>
                            <option value="4">4 Estrelas</option>
                            <option value="3">3 Estrelas</option>
                            <option value="2">2 Estrelas</option>
                            <option value="1">1 Estrela</option>
                        </select>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {filteredReviews.map((review) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                        {review.client_avatar ? (
                                            <img
                                                src={review.client_avatar}
                                                alt={review.client_name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-6 w-6 text-gray-500" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-semibold text-gray-900">
                                                {review.client_name}
                                            </h3>
                                            {review.is_verified && (
                                                <CheckCircle className="h-4 w-4 text-blue-500" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mb-2">
                                            {renderStars(review.rating)}
                                            <span className="text-sm text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                        {review.property_title && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                <Building2 className="h-4 w-4" />
                                                {review.property_title}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {getStatusBadge(review.status)}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                                <p className="text-gray-700 mb-3">{review.content}</p>

                                {(review.pros.length > 0 || review.cons.length > 0) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                        {review.pros.length > 0 && (
                                            <div>
                                                <h5 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                                                    <ThumbsUp className="h-4 w-4" />
                                                    Pontos Positivos
                                                </h5>
                                                <ul className="space-y-1">
                                                    {review.pros.map((pro, index) => (
                                                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                            {pro}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {review.cons.length > 0 && (
                                            <div>
                                                <h5 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                                                    <ThumbsDown className="h-4 w-4" />
                                                    Pontos a Melhorar
                                                </h5>
                                                <ul className="space-y-1">
                                                    {review.cons.map((con, index) => (
                                                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                                            {con}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Admin Response */}
                            {review.admin_response && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Reply className="h-4 w-4 text-amber-600" />
                                        <span className="font-medium text-amber-800">Resposta da Empresa</span>
                                        <span className="text-xs text-amber-600">
                                            {new Date(review.admin_response_date!).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <p className="text-amber-700">{review.admin_response}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <ThumbsUp className="h-4 w-4" />
                                        {review.helpful_votes}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <ThumbsDown className="h-4 w-4" />
                                        {review.unhelpful_votes}
                                    </div>
                                    <span className="text-xs text-gray-400 capitalize">
                                        via {review.source}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {review.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(review.id, 'approved')}
                                                className="text-green-600 hover:text-green-700 p-1"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(review.id, 'rejected')}
                                                className="text-red-600 hover:text-red-700 p-1"
                                            >
                                                <Flag className="h-4 w-4" />
                                            </button>
                                        </>
                                    )}

                                    {!review.admin_response && review.status === 'approved' && (
                                        <button
                                            onClick={() => setSelectedReview(review)}
                                            className="text-blue-600 hover:text-blue-700 p-1"
                                        >
                                            <Reply className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Response Modal */}
                {selectedReview && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-lg w-full p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Responder avaliação de {selectedReview.client_name}
                            </h3>

                            <textarea
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                placeholder="Digite sua resposta..."
                                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />

                            <div className="flex items-center justify-end gap-3 mt-4">
                                <button
                                    onClick={() => {
                                        setSelectedReview(null)
                                        setResponseText('')
                                    }}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleResponse(selectedReview.id)}
                                    disabled={!responseText.trim()}
                                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                                >
                                    Enviar Resposta
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
