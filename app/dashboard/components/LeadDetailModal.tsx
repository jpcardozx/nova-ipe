'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    X,
    User,
    Mail,
    Phone,
    Calendar,
    MessageCircle,
    Tag,
    Star,
    Clock,
    MapPin,
    DollarSign,
    Building2,
    Edit,
    Trash2,
    Plus,
    Send,
    ExternalLink
} from 'lucide-react'
import { LeadsService } from '@/lib/supabase/leads-service'
import type { Lead } from '@/app/types/database'

interface LeadDetailModalProps {
    lead: Lead
    isOpen: boolean
    onClose: () => void
    onUpdate: (updatedLead: Lead) => void
}

export default function LeadDetailModal({ lead, isOpen, onClose, onUpdate }: LeadDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [newNote, setNewNote] = useState('')
    const [timeline, setTimeline] = useState<any[]>([])
    const [editData, setEditData] = useState(lead)

    useEffect(() => {
        if (isOpen && lead) {
            setEditData(lead)
            loadTimeline()
        }
    }, [isOpen, lead])

    const loadTimeline = async () => {
        // Simular timeline de atividades
        const mockTimeline = [
            {
                id: 1,
                type: 'created',
                title: 'Lead criado',
                description: `Lead criado via ${lead.source}`,
                timestamp: lead.created_at,
                icon: User
            },
            {
                id: 2,
                type: 'contact',
                title: 'Primeiro contato',
                description: 'Tentativa de contato por telefone',
                timestamp: lead.last_contact || lead.created_at,
                icon: Phone
            }
        ]
        setTimeline(mockTimeline)
    }

    const handleSave = async () => {
        try {
            await LeadsService.updateLead(lead.id, editData)
            onUpdate(editData)
            setIsEditing(false)
        } catch (error) {
            console.error('Erro ao atualizar lead:', error)
        }
    }

    const handleAddNote = async () => {
        if (!newNote.trim()) return

        try {
            // Atualizar o lead com a nova nota
            const timestamp = new Date().toLocaleString('pt-BR')
            const updatedNotes = (lead.notes || '') + `\n[${timestamp}] ${newNote}`

            await LeadsService.updateLead(lead.id, { notes: updatedNotes })
            setNewNote('')

            // Atualizar o lead local
            const updatedLead = { ...lead, notes: updatedNotes }
            onUpdate(updatedLead)
        } catch (error) {
            console.error('Erro ao adicionar nota:', error)
        }
    }

    const openWhatsApp = () => {
        if (lead.phone) {
            const phone = lead.phone.replace(/\D/g, '')
            const message = `Olá ${lead.name}, sou da Nova IPÊ Imóveis. Tenho algumas opções interessantes para você!`
            window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`)
        }
    }

    const makeCall = () => {
        if (lead.phone) {
            window.open(`tel:${lead.phone}`)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                <User className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{lead.name}</h2>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${lead.status === 'new' ? 'bg-green-500/20 text-green-100' :
                                        lead.status === 'contacted' ? 'bg-blue-500/20 text-blue-100' :
                                            lead.status === 'qualified' ? 'bg-yellow-500/20 text-yellow-100' :
                                                lead.status === 'won' ? 'bg-emerald-500/20 text-emerald-100' :
                                                    'bg-red-500/20 text-red-100'
                                        }`}>
                                        {lead.status === 'new' ? 'Novo' :
                                            lead.status === 'contacted' ? 'Contatado' :
                                                lead.status === 'qualified' ? 'Qualificado' :
                                                    lead.status === 'won' ? 'Convertido' : 'Perdido'}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-300" />
                                        <span className="text-sm">{lead.score}/100</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Edit className="h-5 w-5" />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex h-[calc(90vh-200px)]">
                    {/* Left Panel - Informações */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="space-y-6">
                            {/* Ações Rápidas */}
                            <div className="flex gap-3">
                                <button
                                    onClick={openWhatsApp}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    WhatsApp
                                </button>
                                <button
                                    onClick={makeCall}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Phone className="h-4 w-4" />
                                    Ligar
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </button>
                            </div>

                            {/* Informações Pessoais */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="font-semibold text-gray-900 mb-4">Informações de Contato</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <span className="text-gray-900">{lead.email || 'Não informado'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                        <span className="text-gray-900">{lead.phone || 'Não informado'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                        <span className="text-gray-900">{lead.location_interest || 'Não informado'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Building2 className="h-5 w-5 text-gray-400" />
                                        <span className="text-gray-900">{lead.property_interest || 'Não informado'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Orçamento */}
                            {(lead.budget_min || lead.budget_max) && (
                                <div className="bg-green-50 rounded-xl p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4">Orçamento</h3>
                                    <div className="flex items-center gap-3">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                        <span className="text-gray-900">
                                            {lead.budget_min && lead.budget_max
                                                ? `R$ ${lead.budget_min.toLocaleString()} - R$ ${lead.budget_max.toLocaleString()}`
                                                : lead.budget_min
                                                    ? `A partir de R$ ${lead.budget_min.toLocaleString()}`
                                                    : `Até R$ ${lead.budget_max?.toLocaleString()}`
                                            }
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Notas */}
                            <div className="bg-blue-50 rounded-xl p-4">
                                <h3 className="font-semibold text-gray-900 mb-4">Notas</h3>
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
                                            placeholder="Adicionar nova nota..."
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            onClick={handleAddNote}
                                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Send className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {lead.notes && (
                                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                                            <pre className="text-sm text-gray-600 whitespace-pre-wrap">{lead.notes}</pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Timeline */}
                    <div className="w-80 bg-gray-50 p-6 overflow-y-auto border-l border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4">Linha do Tempo</h3>
                        <div className="space-y-4">
                            {timeline.map((item, index) => {
                                const Icon = item.icon
                                return (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Icon className="h-4 w-4 text-blue-600" />
                                            </div>
                                            {index < timeline.length - 1 && (
                                                <div className="w-px h-8 bg-gray-300 mt-2" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                                            <p className="text-sm text-gray-600">{item.description}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(item.timestamp).toLocaleString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
