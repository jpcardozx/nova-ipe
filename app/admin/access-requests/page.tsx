'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { Button } from '@/components/ui/button'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
    CheckCircle,
    XCircle,
    Clock,
    User,
    Mail,
    Calendar,
    Phone,
    Building2,
    Shield,
    ExternalLink,
    RefreshCw,
    AlertCircle,
    Search,
    FileText
} from 'lucide-react'

interface AccessRequest {
    id: string
    email: string
    full_name: string
    phone: string
    department: string
    justification: string
    status: 'pending' | 'approved' | 'rejected'
    processed_by?: string
    processed_at?: string
    notes?: string
    created_at: string
    updated_at: string
}

function AccessRequestsContent() {
    const { user } = useCurrentUser()
    const [requests, setRequests] = useState<AccessRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [reviewNotes, setReviewNotes] = useState<{ [key: string]: string }>({})
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadRequests()
    }, [])

    const loadRequests = async () => {
        setLoading(true)
        setError(null)
        try {
            const { data, error: fetchError } = await supabase
                .from('access_requests')
                .select('*')
                .order('created_at', { ascending: false })

            if (fetchError) {
                console.error('Error loading requests:', fetchError)
                setError('Erro ao carregar solicitações')
                return
            }

            setRequests(data || [])
        } catch (error) {
            console.error('Error in loadRequests:', error)
            setError('Erro interno')
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (requestId: string) => {
        if (!user) return

        setProcessingId(requestId)

        try {
            const notes = reviewNotes[requestId] || 'Solicitação aprovada pelo administrador'

            const { error: updateError } = await supabase
                .from('access_requests')
                .update({
                    status: 'approved',
                    processed_by: user?.id || 'system',
                    processed_at: new Date().toISOString(),
                    notes: notes
                })
                .eq('id', requestId)

            if (updateError) {
                console.error('Error approving request:', updateError)
                setError('Erro ao aprovar solicitação')
                return
            }

            // Log activity
            await supabase.rpc('log_activity', {
                p_action: 'access_request_approved',
                p_entity_type: 'access_request',
                p_entity_id: requestId,
                p_details: { notes, processed_by: user?.email || 'system' }
            })

            alert('Solicitação aprovada! O usuário deve ser criado no Supabase Dashboard.')
            loadRequests()
            setReviewNotes(prev => ({ ...prev, [requestId]: '' }))
        } catch (error) {
            console.error('Error approving request:', error)
            setError('Erro interno ao aprovar solicitação')
        } finally {
            setProcessingId(null)
        }
    }

    const handleReject = async (requestId: string) => {
        if (!user) return

        setProcessingId(requestId)

        try {
            const notes = reviewNotes[requestId] || 'Solicitação rejeitada pelo administrador'

            const { error: updateError } = await supabase
                .from('access_requests')
                .update({
                    status: 'rejected',
                    processed_by: user?.id || 'system',
                    processed_at: new Date().toISOString(),
                    notes: notes
                })
                .eq('id', requestId)

            if (updateError) {
                console.error('Error rejecting request:', updateError)
                setError('Erro ao rejeitar solicitação')
                return
            }

            // Log activity
            await supabase.rpc('log_activity', {
                p_action: 'access_request_rejected',
                p_entity_type: 'access_request',
                p_entity_id: requestId,
                p_details: { notes, processed_by: user?.email || 'system' }
            })

            alert('Solicitação rejeitada.')
            loadRequests()
            setReviewNotes(prev => ({ ...prev, [requestId]: '' }))
        } catch (error) {
            console.error('Error rejecting request:', error)
            setError('Erro interno ao rejeitar solicitação')
        } finally {
            setProcessingId(null)
        }
    }

    const filteredRequests = requests.filter(request => {
        const matchesFilter = filter === 'all' || request.status === filter
        const matchesSearch = searchTerm === '' || 
            request.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.department.toLowerCase().includes(searchTerm.toLowerCase())
        
        return matchesFilter && matchesSearch
    })

    const getStatusBadge = (status: string) => {
        const configs = {
            pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
            approved: { label: 'Aprovada', className: 'bg-green-100 text-green-800' },
            rejected: { label: 'Rejeitada', className: 'bg-red-100 text-red-800' }
        }

        const config = configs[status as keyof typeof configs] || configs.pending

        return (
            <Badge className={config.className}>
                {config.label}
            </Badge>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando solicitações...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="h-8 w-8 text-amber-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Solicitações de Acesso
                            </h1>
                            <p className="text-gray-600">
                                Gerencie solicitações de acesso ao sistema
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Pendentes</p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                            {requests.filter(r => r.status === 'pending').length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Aprovadas</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {requests.filter(r => r.status === 'approved').length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Rejeitadas</p>
                                        <p className="text-2xl font-bold text-red-600">
                                            {requests.filter(r => r.status === 'rejected').length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-2">
                            {[
                                { key: 'all', label: 'Todas', count: requests.length },
                                { key: 'pending', label: 'Pendentes', count: requests.filter(r => r.status === 'pending').length },
                                { key: 'approved', label: 'Aprovadas', count: requests.filter(r => r.status === 'approved').length },
                                { key: 'rejected', label: 'Rejeitadas', count: requests.filter(r => r.status === 'rejected').length }
                            ].map(({ key, label, count }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key as any)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        filter === key
                                            ? 'bg-amber-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {label} ({count})
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nome, email ou departamento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 w-80"
                            />
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <span className="text-red-700">{error}</span>
                        </div>
                    </div>
                )}

                {/* Requests List */}
                {filteredRequests.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Nenhuma solicitação encontrada
                            </h3>
                            <p className="text-gray-600">
                                Não há solicitações no momento.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {filteredRequests.map((request, index) => (
                            <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5 text-amber-600" />
                                            {request.full_name}
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(request.status)}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail className="h-4 w-4" />
                                                <span>{request.email}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Phone className="h-4 w-4" />
                                                <span>{request.phone}</span>
                                            </div>


                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Building2 className="h-4 w-4" />
                                                <span>{request.department}</span>
                                            </div>

                                            {request.created_at && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {new Date(request.created_at).toLocaleDateString('pt-BR', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-900 mb-2">Justificativa:</h4>
                                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                                            {request.justification}
                                        </p>
                                    </div>

                                    {request.status === 'pending' && (
                                        <div className="space-y-4 pt-4 border-t">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Observações (opcional)
                                                </label>
                                                <Textarea
                                                    value={reviewNotes[request.id!] || ''}
                                                    onChange={(e) => setReviewNotes(prev => ({
                                                        ...prev,
                                                        [request.id!]: e.target.value
                                                    }))}
                                                    placeholder="Adicione observações sobre esta solicitação..."
                                                    rows={2}
                                                />
                                            </div>

                                            <div className="flex gap-3">
                                                <Button
                                                    onClick={() => handleApprove(request.id!)}
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                    disabled={processingId === request.id}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    {processingId === request.id ? 'Processando...' : 'Aprovar'}
                                                </Button>

                                                <Button
                                                    onClick={() => handleReject(request.id!)}
                                                    variant="outline"
                                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                                    disabled={processingId === request.id}
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Rejeitar
                                                </Button>

                                                <Button
                                                    onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                                                    variant="outline"
                                                    className="ml-auto"
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    Supabase Dashboard
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {request.status !== 'pending' && request.notes && (
                                        <div className="pt-4 border-t">
                                            <h4 className="font-semibold text-gray-900 mb-2">Observações da revisão:</h4>
                                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                                                {request.notes}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function AccessRequestsPage() {
    return <AccessRequestsContent />
}