'use client'

import { useState, useEffect, useCallback } from 'react'
import { CRMService, Lead, Document, DocumentTask } from '@/lib/supabase/integrated-service'
import { toast } from 'react-hot-toast'

interface UseIntegratedCRMProps {
    leadId?: string
    autoRefresh?: boolean
    refreshInterval?: number
}

interface CRMData {
    lead: Lead | null
    documents: Document[]
    tasks: DocumentTask[]
    activities: any[]
    stats: any
}

export function useIntegratedCRM({ 
    leadId, 
    autoRefresh = false, 
    refreshInterval = 30000 
}: UseIntegratedCRMProps = {}) {
    const [data, setData] = useState<CRMData>({
        lead: null,
        documents: [],
        tasks: [],
        activities: [],
        stats: null
    })
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Carregamento de dados
    const loadData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const promises: Promise<any>[] = []

            // Lead específico
            if (leadId) {
                promises.push(CRMService.getLeadById(leadId))
                promises.push(CRMService.getDocuments({ lead_id: leadId }))
                promises.push(CRMService.getLeadActivities(leadId))
            }

            // Dados gerais
            promises.push(CRMService.getUserTasks(undefined, ['pending', 'in_progress']))
            promises.push(CRMService.getDashboardStats())

            const results = await Promise.all(promises)

            let leadData = null
            let documentsData = []
            let activitiesData = []
            let tasksData = []
            let statsData = null

            if (leadId) {
                const [leadResult, documentsResult, activitiesResult, tasksResult, statsResult] = results
                leadData = leadResult.lead
                documentsData = documentsResult.documents
                activitiesData = activitiesResult.activities
                tasksData = tasksResult.tasks
                statsData = statsResult.stats
            } else {
                const [tasksResult, statsResult] = results
                tasksData = tasksResult.tasks
                statsData = statsResult.stats
            }

            setData({
                lead: leadData,
                documents: documentsData,
                tasks: tasksData,
                activities: activitiesData,
                stats: statsData
            })

        } catch (err) {
            console.error('Erro ao carregar dados CRM:', err)
            setError('Erro ao carregar dados')
        } finally {
            setLoading(false)
        }
    }, [leadId])

    // Auto refresh
    useEffect(() => {
        loadData()

        if (autoRefresh) {
            const interval = setInterval(loadData, refreshInterval)
            return () => clearInterval(interval)
        }
    }, [loadData, autoRefresh, refreshInterval])

    // ==================== ACTIONS - LEADS ====================

    const createLead = useCallback(async (leadData: Partial<Lead>) => {
        try {
            const { lead, error } = await CRMService.createLead(leadData)
            
            if (error) throw error
            
            toast.success('Lead criado com sucesso')
            await loadData()
            
            return lead
        } catch (error) {
            console.error('Erro ao criar lead:', error)
            toast.error('Erro ao criar lead')
            return null
        }
    }, [loadData])

    const updateLead = useCallback(async (leadId: string, updates: Partial<Lead>) => {
        try {
            const { lead, error } = await CRMService.updateLead(leadId, updates)
            
            if (error) throw error
            
            toast.success('Lead atualizado')
            await loadData()
            
            return lead
        } catch (error) {
            console.error('Erro ao atualizar lead:', error)
            toast.error('Erro ao atualizar lead')
            return null
        }
    }, [loadData])

    const updateLeadStatus = useCallback(async (leadId: string, status: string) => {
        return updateLead(leadId, { status } as Partial<Lead>)
    }, [updateLead])

    // ==================== ACTIONS - ATIVIDADES ====================

    const addActivity = useCallback(async (activityData: {
        lead_id?: string
        activity_type: string
        subject: string
        description?: string
        outcome?: string
    }) => {
        try {
            const { activity, error } = await CRMService.createActivity(activityData)
            
            if (error) throw error
            
            toast.success('Atividade registrada')
            await loadData()
            
            return activity
        } catch (error) {
            console.error('Erro ao registrar atividade:', error)
            toast.error('Erro ao registrar atividade')
            return null
        }
    }, [loadData])

    const logCall = useCallback(async (leadId: string, outcome: string, notes?: string) => {
        return addActivity({
            lead_id: leadId,
            activity_type: 'call',
            subject: 'Ligação realizada',
            description: notes,
            outcome
        })
    }, [addActivity])

    const logEmail = useCallback(async (leadId: string, subject: string, content?: string) => {
        return addActivity({
            lead_id: leadId,
            activity_type: 'email',
            subject: `Email: ${subject}`,
            description: content
        })
    }, [addActivity])

    const logWhatsApp = useCallback(async (leadId: string, message: string) => {
        return addActivity({
            lead_id: leadId,
            activity_type: 'whatsapp',
            subject: 'Mensagem WhatsApp',
            description: message
        })
    }, [addActivity])

    const logMeeting = useCallback(async (leadId: string, meetingType: string, outcome?: string) => {
        return addActivity({
            lead_id: leadId,
            activity_type: 'meeting',
            subject: `Reunião: ${meetingType}`,
            outcome
        })
    }, [addActivity])

    // ==================== ACTIONS - TAREFAS ====================

    const createTask = useCallback(async (taskData: {
        lead_id?: string
        document_id?: string
        title: string
        description?: string
        task_type: string
        assigned_to?: string
        priority?: string
        due_date?: string
    }) => {
        try {
            const { task, error } = await CRMService.createTask(taskData)
            
            if (error) throw error
            
            toast.success('Tarefa criada')
            await loadData()
            
            return task
        } catch (error) {
            console.error('Erro ao criar tarefa:', error)
            toast.error('Erro ao criar tarefa')
            return null
        }
    }, [loadData])

    const updateTaskStatus = useCallback(async (taskId: string, status: string, notes?: string) => {
        try {
            const { task, error } = await CRMService.updateTaskStatus(taskId, status, notes)
            
            if (error) throw error
            
            toast.success('Tarefa atualizada')
            await loadData()
            
            return task
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error)
            toast.error('Erro ao atualizar tarefa')
            return null
        }
    }, [loadData])

    const completeTask = useCallback(async (taskId: string, notes?: string) => {
        return updateTaskStatus(taskId, 'completed', notes)
    }, [updateTaskStatus])

    // ==================== ACTIONS - DOCUMENTOS ====================

    const uploadDocument = useCallback(async (file: File, metadata: {
        title?: string
        description?: string
        lead_id?: string
        property_id?: string
        contract_id?: string
        document_type_id?: string
        requires_signature?: boolean
    }) => {
        try {
            // Upload do arquivo
            const { path, error: uploadError } = await CRMService.uploadFile(file)
            
            if (uploadError) throw uploadError

            // Criar registro do documento
            const { document, error } = await CRMService.createDocument({
                title: metadata.title || file.name.replace(/\.[^/.]+$/, ''),
                description: metadata.description,
                file_name: file.name,
                original_file_name: file.name,
                file_size: file.size,
                file_type: file.type,
                file_path: path,
                lead_id: metadata.lead_id || leadId,
                property_id: metadata.property_id,
                contract_id: metadata.contract_id,
                document_type_id: metadata.document_type_id,
                requires_signature: metadata.requires_signature || false,
                status: 'draft'
            })

            if (error) throw error

            toast.success('Documento enviado com sucesso')
            await loadData()

            return document
        } catch (error) {
            console.error('Erro ao enviar documento:', error)
            toast.error('Erro ao enviar documento')
            return null
        }
    }, [leadId, loadData])

    const updateDocumentStatus = useCallback(async (documentId: string, status: string) => {
        try {
            const { document, error } = await CRMService.updateDocumentStatus(documentId, status)
            
            if (error) throw error
            
            toast.success('Status do documento atualizado')
            await loadData()
            
            return document
        } catch (error) {
            console.error('Erro ao atualizar documento:', error)
            toast.error('Erro ao atualizar documento')
            return null
        }
    }, [loadData])

    const downloadDocument = useCallback(async (document: Document) => {
        try {
            if (!document.file_path) {
                toast.error('Arquivo não encontrado')
                return
            }

            const { data, error } = await CRMService.downloadFile(document.file_path)
            
            if (error) throw error

            const url = URL.createObjectURL(data)
            const a = window.document.createElement('a')
            a.href = url
            a.download = document.file_name || document.title
            a.click()
            URL.revokeObjectURL(url)

            // Registrar atividade de download
            if (document.lead_id) {
                await addActivity({
                    lead_id: document.lead_id,
                    activity_type: 'document',
                    subject: 'Download de documento',
                    description: `Documento "${document.title}" foi baixado`
                })
            }

        } catch (error) {
            console.error('Erro no download:', error)
            toast.error('Erro ao baixar documento')
        }
    }, [addActivity])

    // ==================== AUTOMAÇÕES ====================

    const scheduleFollowUp = useCallback(async (leadId: string, date: Date, notes?: string) => {
        try {
            // Atualizar lead com próximo follow-up
            await updateLead(leadId, { 
                next_follow_up: date.toISOString() 
            } as Partial<Lead>)

            // Criar tarefa de follow-up
            await createTask({
                lead_id: leadId,
                title: 'Follow-up agendado',
                description: notes,
                task_type: 'follow-up',
                due_date: date.toISOString(),
                priority: 'medium'
            })

            toast.success('Follow-up agendado')
        } catch (error) {
            console.error('Erro ao agendar follow-up:', error)
            toast.error('Erro ao agendar follow-up')
        }
    }, [updateLead, createTask])

    const createDocumentTask = useCallback(async (documentId: string, taskType: string, assignedTo?: string) => {
        const taskTitles = {
            'review': 'Revisar documento',
            'approve': 'Aprovar documento',
            'sign': 'Assinar documento',
            'collect': 'Coletar documento',
            'send': 'Enviar documento'
        }

        return createTask({
            document_id: documentId,
            title: taskTitles[taskType as keyof typeof taskTitles] || 'Tarefa do documento',
            task_type: taskType,
            assigned_to: assignedTo,
            priority: taskType === 'sign' ? 'high' : 'medium'
        })
    }, [createTask])

    // ==================== WORKFLOWS ====================

    const moveLeadToNextStage = useCallback(async (leadId: string) => {
        const statusFlow = {
            'new': 'contacted',
            'contacted': 'qualified',
            'qualified': 'viewing',
            'viewing': 'proposal',
            'proposal': 'negotiating',
            'negotiating': 'closed'
        }

        const currentLead = data.lead
        if (!currentLead) return

        const nextStatus = statusFlow[currentLead.status as keyof typeof statusFlow]
        if (nextStatus) {
            await updateLeadStatus(leadId, nextStatus)
            
            // Adicionar atividade automática
            await addActivity({
                lead_id: leadId,
                activity_type: 'task',
                subject: 'Status atualizado',
                description: `Lead movido de ${currentLead.status} para ${nextStatus}`
            })
        }
    }, [data.lead, updateLeadStatus, addActivity])

    return {
        // Dados
        data,
        loading,
        error,
        
        // Ações básicas
        refresh: loadData,
        
        // Leads
        createLead,
        updateLead,
        updateLeadStatus,
        moveLeadToNextStage,
        
        // Atividades
        addActivity,
        logCall,
        logEmail,
        logWhatsApp,
        logMeeting,
        
        // Tarefas
        createTask,
        updateTaskStatus,
        completeTask,
        createDocumentTask,
        
        // Documentos
        uploadDocument,
        updateDocumentStatus,
        downloadDocument,
        
        // Automações
        scheduleFollowUp
    }
}
