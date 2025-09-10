// app/dashboard/components/modules/leads/LeadsPipeline.tsx
'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DropResult } from '@hello-pangea/dnd'
import { User, Phone, Mail, Calendar, DollarSign, Eye, Edit, Trash2 } from 'lucide-react'

interface Lead {
    id: string
    name: string
    email?: string
    phone?: string
    status: 'novo' | 'contato' | 'qualificado' | 'proposta' | 'fechado' | 'perdido'
    source: string
    budget_min?: number
    budget_max?: number
    interest: 'buy' | 'sell' | 'rent'
    property_type?: string
    created_at: string
    last_contact?: string
    notes?: string
}

interface LeadsPipelineProps {
    leads: Lead[]
    onUpdateLead: (leadId: string, status: Lead['status']) => Promise<void>
    onViewLead: (lead: Lead) => void
    onEditLead: (lead: Lead) => void
    onDeleteLead: (leadId: string) => Promise<void>
}

const PIPELINE_STAGES = [
    { id: 'novo', name: 'Novos Leads', color: 'bg-gray-100', count: 0 },
    { id: 'contato', name: 'Primeiro Contato', color: 'bg-blue-100', count: 0 },
    { id: 'qualificado', name: 'Qualificados', color: 'bg-yellow-100', count: 0 },
    { id: 'proposta', name: 'Proposta Enviada', color: 'bg-orange-100', count: 0 },
    { id: 'fechado', name: 'Fechados', color: 'bg-green-100', count: 0 },
    { id: 'perdido', name: 'Perdidos', color: 'bg-red-100', count: 0 }
]

export function LeadsPipeline({ leads, onUpdateLead, onViewLead, onEditLead, onDeleteLead }: LeadsPipelineProps) {
    const [stages, setStages] = useState(PIPELINE_STAGES)

    useEffect(() => {
        const updatedStages = PIPELINE_STAGES.map(stage => ({
            ...stage,
            count: leads.filter(lead => lead.status === stage.id).length
        }))
        setStages(updatedStages)
    }, [leads])

    const handleDragEnd = async (result: any) => {
        if (!result.destination) return

        const { draggableId, destination } = result
        const newStatus = destination.droppableId as Lead['status']

        try {
            await onUpdateLead(draggableId, newStatus)
        } catch (error) {
            console.error('Erro ao atualizar status do lead:', error)
        }
    }

    const getStageLeads = (stageId: string) => {
        return leads.filter(lead => lead.status === stageId)
    }

    const formatBudget = (min?: number, max?: number) => {
        if (!min && !max) return null
        if (min && max) return `R$ ${min.toLocaleString()} - R$ ${max.toLocaleString()}`
        if (min) return `A partir de R$ ${min.toLocaleString()}`
        if (max) return `Até R$ ${max.toLocaleString()}`
        return null
    }

    const getInterestIcon = (interest: string) => {
        switch (interest) {
            case 'buy': return '🏠'
            case 'sell': return '💰'
            case 'rent': return '🔑'
            default: return '📋'
        }
    }

    const getDaysAgo = (date: string) => {
        const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
        if (days === 0) return 'Hoje'
        if (days === 1) return '1 dia'
        return `${days} dias`
    }

    return (
        <div className="space-y-6">
            {/* Header com Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {stages.map((stage) => (
                    <div key={stage.id} className={`${stage.color} rounded-lg p-4 text-center`}>
                        <div className="text-2xl font-bold text-gray-800">{stage.count}</div>
                        <div className="text-sm text-gray-600">{stage.name}</div>
                    </div>
                ))}
            </div>

            {/* Pipeline Board */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto">
                    {stages.map((stage) => (
                        <div key={stage.id} className="min-h-[500px]">
                            <div className={`${stage.color} rounded-t-lg p-3 border-b-2 border-gray-300`}>
                                <h3 className="font-semibold text-gray-800 text-sm">
                                    {stage.name} ({stage.count})
                                </h3>
                            </div>

                            <Droppable droppableId={stage.id}>
                                {(provided: DroppableProvided, snapshot: any) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`min-h-[450px] p-2 space-y-2 ${snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
                                            } rounded-b-lg`}
                                    >
                                        {getStageLeads(stage.id).map((lead, index) => (
                                            <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                                {(provided: DraggableProvided, snapshot: any) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`bg-white p-3 rounded-lg shadow-sm border cursor-move hover:shadow-md transition-shadow ${snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                                                            }`}
                                                    >
                                                        {/* Lead Header */}
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <User className="w-4 h-4 text-gray-500" />
                                                                <span className="font-medium text-sm text-gray-800 truncate">
                                                                    {lead.name}
                                                                </span>
                                                            </div>
                                                            <span className="text-lg">{getInterestIcon(lead.interest)}</span>
                                                        </div>

                                                        {/* Contact Info */}
                                                        <div className="space-y-1 mb-3">
                                                            {lead.email && (
                                                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                                                    <Mail className="w-3 h-3" />
                                                                    <span className="truncate">{lead.email}</span>
                                                                </div>
                                                            )}
                                                            {lead.phone && (
                                                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                                                    <Phone className="w-3 h-3" />
                                                                    <span>{lead.phone}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Budget */}
                                                        {formatBudget(lead.budget_min, lead.budget_max) && (
                                                            <div className="flex items-center gap-1 text-xs text-green-600 mb-2">
                                                                <DollarSign className="w-3 h-3" />
                                                                <span className="truncate">
                                                                    {formatBudget(lead.budget_min, lead.budget_max)}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Property Type */}
                                                        {lead.property_type && (
                                                            <div className="text-xs text-gray-500 mb-2">
                                                                {lead.property_type}
                                                            </div>
                                                        )}

                                                        {/* Time & Source */}
                                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                                            <span>{getDaysAgo(lead.created_at)} atrás</span>
                                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                                {lead.source}
                                                            </span>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    onViewLead(lead)
                                                                }}
                                                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                                title="Ver detalhes"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>

                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    onEditLead(lead)
                                                                }}
                                                                className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                                                                title="Editar"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>

                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    if (confirm('Deseja realmente excluir este lead?')) {
                                                                        onDeleteLead(lead.id)
                                                                    }
                                                                }}
                                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                                title="Excluir"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    )
}
