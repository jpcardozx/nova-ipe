// Exemplo de integração da gestão de chaves com o fluxo de leads

// ========================================
// 1. REGISTRAR ENTREGA QUANDO LEAD FOR FECHADO
// ========================================

// Em: app/dashboard/leads/page.tsx ou modal de atualização de lead
async function handleLeadWon(leadId: string, propertyData: any) {
    // Atualizar lead para status 'won'
    await updateLeadStatus(leadId, 'won')

    // Registrar entrega de chaves automaticamente
    const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            lead_id: leadId,
            property_id: propertyData.id,
            property_title: propertyData.title,
            property_address: propertyData.address,
            scheduled_date: propertyData.scheduled_date, // Data de vistoria/entrega
            keys_count: propertyData.keys_count || 2,
            notes: 'Entrega agendada automaticamente após fechamento',
            broker_name: currentUser.name
        })
    })

    if (response.ok) {
        toast.success('Lead fechado! Entrega de chaves registrada.')
    }
}

// ========================================
// 2. MODAL DE REGISTRO DE ENTREGA
// ========================================

// Componente: KeyDeliveryModal.tsx
'use client'

import { useState } from 'react'
import { Calendar, Key } from 'lucide-react'

interface KeyDeliveryModalProps {
    isOpen: boolean
    onClose: () => void
    lead: any
    property: any
}

export function KeyDeliveryModal({ isOpen, onClose, lead, property }: KeyDeliveryModalProps) {
    const [formData, setFormData] = useState({
        scheduled_date: '',
        keys_count: 2,
        notes: '',
        deposit_amount: 0
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const response = await fetch('/api/keys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lead_id: lead.id,
                property_id: property.id,
                property_title: property.title,
                property_address: property.address,
                ...formData
            })
        })

        if (response.ok) {
            toast.success('Entrega de chaves registrada!')
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center">
                        <Key className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Registrar Entrega</h2>
                        <p className="text-sm text-gray-600">Lead: {lead.name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Data de Entrega Agendada
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.scheduled_date}
                            onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantidade de Chaves
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={formData.keys_count}
                            onChange={(e) => setFormData({ ...formData, keys_count: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Valor do Caução (Opcional)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.deposit_amount}
                            onChange={(e) => setFormData({ ...formData, deposit_amount: parseFloat(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="R$ 0,00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Observações
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Ex: Cliente solicitou entrega após às 14h"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700"
                        >
                            Registrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ========================================
// 3. ATUALIZAR STATUS DA ENTREGA
// ========================================

async function markAsDelivered(leadId: string) {
    const response = await fetch('/api/keys', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            lead_id: leadId,
            status: 'delivered',
            date: new Date().toISOString()
        })
    })

    if (response.ok) {
        toast.success('Chaves marcadas como entregues!')
    }
}

async function markAsReturned(leadId: string) {
    const response = await fetch('/api/keys', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            lead_id: leadId,
            status: 'returned'
        })
    })

    if (response.ok) {
        toast.success('Chaves devolvidas registradas!')
    }
}

// ========================================
// 4. BOTÃO NA PÁGINA DE LEADS
// ========================================

// Em: app/dashboard/leads/page.tsx
function LeadCard({ lead }: { lead: any }) {
    const [showKeyModal, setShowKeyModal] = useState(false)

    return (
        <>
            <div className="bg-white rounded-xl p-6 border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        lead.status === 'won' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        {lead.status === 'won' ? 'Convertido' : 'Em Andamento'}
                    </span>
                </div>

                {/* Botão de entrega de chaves (aparece apenas quando status = 'won') */}
                {lead.status === 'won' && !lead.custom_fields?.key_delivery && (
                    <button
                        onClick={() => setShowKeyModal(true)}
                        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700"
                    >
                        <Key className="h-4 w-4" />
                        Registrar Entrega de Chaves
                    </button>
                )}

                {/* Status da entrega (aparece se já foi registrada) */}
                {lead.custom_fields?.key_delivery && (
                    <div className="mt-4 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Key className="h-4 w-4 text-cyan-600" />
                            <span className="text-sm font-medium text-cyan-900">
                                Entrega: {lead.custom_fields.key_delivery.status}
                            </span>
                        </div>
                        {lead.custom_fields.key_delivery.scheduled_date && (
                            <p className="text-xs text-cyan-700">
                                Agendada para: {new Date(lead.custom_fields.key_delivery.scheduled_date).toLocaleDateString('pt-BR')}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Modal de registro */}
            <KeyDeliveryModal
                isOpen={showKeyModal}
                onClose={() => setShowKeyModal(false)}
                lead={lead}
                property={lead.property}
            />
        </>
    )
}

// ========================================
// 5. QUERY PARA BUSCAR LEADS COM ENTREGA
// ========================================

async function getLeadsWithKeyDelivery() {
    const response = await fetch('/api/keys')
    const data = await response.json()
    
    // Retorna apenas leads que já têm entrega registrada
    return data.deliveries
}

async function getLeadsPendingKeyDelivery() {
    // Buscar leads com status 'won' mas sem key_delivery registrado
    const { data } = await supabase
        .from('document_management_leads')
        .select('*')
        .eq('status', 'won')
        .is('custom_fields->key_delivery', null)
    
    return data
}

// ========================================
// 6. HOOK PERSONALIZADO
// ========================================

import { useState, useEffect } from 'react'

export function useKeyDeliveries() {
    const [deliveries, setDeliveries] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        total: 0,
        scheduled: 0,
        delivered: 0,
        pending: 0
    })

    useEffect(() => {
        loadDeliveries()
    }, [])

    async function loadDeliveries() {
        setLoading(true)
        try {
            const response = await fetch('/api/keys')
            const data = await response.json()
            setDeliveries(data.deliveries)
            setStats(data.stats)
        } catch (error) {
            console.error('Error loading deliveries:', error)
        } finally {
            setLoading(false)
        }
    }

    async function registerDelivery(deliveryData: any) {
        const response = await fetch('/api/keys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deliveryData)
        })

        if (response.ok) {
            await loadDeliveries() // Recarregar lista
            return { success: true }
        }

        const error = await response.json()
        return { success: false, error }
    }

    async function updateStatus(leadId: string, status: string) {
        const response = await fetch('/api/keys', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lead_id: leadId, status })
        })

        if (response.ok) {
            await loadDeliveries() // Recarregar lista
            return { success: true }
        }

        return { success: false }
    }

    return {
        deliveries,
        stats,
        loading,
        registerDelivery,
        updateStatus,
        refresh: loadDeliveries
    }
}

// ========================================
// 7. EXEMPLO DE USO DO HOOK
// ========================================

function KeyManagementPage() {
    const { deliveries, stats, loading, updateStatus } = useKeyDeliveries()

    if (loading) return <div>Carregando...</div>

    return (
        <div>
            <h1>Gestão de Chaves</h1>
            
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold">{stats.scheduled}</div>
                    <div className="text-sm">Agendadas</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold">{stats.delivered}</div>
                    <div className="text-sm">Entregues</div>
                </div>
            </div>

            {/* List */}
            {deliveries.map((delivery: any) => (
                <div key={delivery.id} className="p-4 bg-white rounded-lg border mb-4">
                    <h3>{delivery.client_name}</h3>
                    <p>{delivery.property_title}</p>
                    
                    {delivery.delivery_status === 'scheduled' && (
                        <button
                            onClick={() => updateStatus(delivery.id, 'delivered')}
                            className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
                        >
                            Marcar como Entregue
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}
