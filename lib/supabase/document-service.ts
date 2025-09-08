import { supabase } from '@/lib/supabase'

export interface DocumentType {
    id: string
    name: string
    category: 'client' | 'property' | 'contract' | 'legal' | 'financial'
    required_fields: string[]
    workflow_stages: string[]
    retention_days: number
    is_required: boolean
    created_at: string
    updated_at: string
}

export interface Document {
    id: string
    document_type_id: string
    title: string
    description?: string
    
    // Relacionamentos
    client_id?: string
    property_id?: string
    contract_id?: string
    lead_id?: string
    
    // Arquivo
    file_name?: string
    file_size?: number
    file_type?: string
    file_path?: string
    file_hash?: string
    
    // Controle de versão
    version: number
    parent_document_id?: string
    is_latest_version: boolean
    
    // Status e workflow
    status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'expired' | 'archived'
    current_stage?: string
    workflow_data: any
    
    // Controle de acesso
    visibility: 'private' | 'team' | 'public'
    access_level: 'read' | 'write' | 'admin'
    
    // Assinaturas
    requires_signature: boolean
    signature_data: any
    approved_by?: string
    approved_at?: string
    
    // Datas
    expiry_date?: string
    reminder_date?: string
    
    // Auditoria
    created_by: string
    updated_by?: string
    created_at: string
    updated_at: string
    deleted_at?: string

    // Relacionamentos populados
    document_type?: DocumentType
}

export interface DocumentTask {
    id: string
    document_id: string
    title: string
    description?: string
    task_type: 'review' | 'approve' | 'sign' | 'collect' | 'send'
    assigned_to?: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    due_date?: string
    completed_at?: string
    created_by: string
    created_at: string
    updated_at: string
}

export interface DocumentComment {
    id: string
    document_id: string
    user_id: string
    comment: string
    is_internal: boolean
    created_at: string
}

export interface DocumentActivity {
    id: string
    document_id: string
    user_id: string
    activity_type: 'created' | 'updated' | 'viewed' | 'downloaded' | 'shared' | 'approved' | 'rejected'
    activity_data: any
    ip_address?: string
    user_agent?: string
    created_at: string
}

export class DocumentManagementService {
    
    /**
     * Lista tipos de documentos
     */
    static async getDocumentTypes(category?: string): Promise<DocumentType[]> {
        try {
            let query = supabase
                .from('document_types')
                .select('*')
                .order('name')

            if (category) {
                query = query.eq('category', category)
            }

            const { data, error } = await query

            if (error) throw error
            return data || []
        } catch (error) {
            console.error('Erro ao buscar tipos de documento:', error)
            return []
        }
    }

    /**
     * Cria novo documento
     */
    static async createDocument(documentData: Partial<Document>, file?: File): Promise<Document | null> {
        try {
            let fileData = {}
            
            // Upload do arquivo se fornecido
            if (file) {
                const uploadResult = await this.uploadFile(file, documentData.client_id)
                if (uploadResult) {
                    fileData = {
                        file_name: file.name,
                        file_size: file.size,
                        file_type: file.type,
                        file_path: uploadResult.path,
                        file_hash: await this.calculateFileHash(file)
                    }
                }
            }

            const { data, error } = await supabase
                .from('documents')
                .insert({
                    ...documentData,
                    ...fileData,
                    status: 'draft',
                    workflow_data: {},
                    signature_data: {}
                })
                .select('*, document_type:document_types(*)')
                .single()

            if (error) throw error

            // Registra atividade
            await this.logActivity(data.id, documentData.created_by!, 'created', {
                document_title: documentData.title
            })

            // Cria tarefas automáticas baseado no workflow
            await this.createWorkflowTasks(data)

            return data
        } catch (error) {
            console.error('Erro ao criar documento:', error)
            return null
        }
    }

    /**
     * Upload de arquivo para Supabase Storage
     */
    static async uploadFile(file: File, clientId?: string): Promise<{ path: string } | null> {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
            const folder = clientId ? `clients/${clientId}` : 'general'
            const filePath = `documents/${folder}/${fileName}`

            const { data, error } = await supabase.storage
                .from('documents')
                .upload(filePath, file)

            if (error) throw error
            return { path: filePath }
        } catch (error) {
            console.error('Erro no upload:', error)
            return null
        }
    }

    /**
     * Calcula hash do arquivo
     */
    static async calculateFileHash(file: File): Promise<string> {
        const buffer = await file.arrayBuffer()
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    }

    /**
     * Busca documentos com filtros
     */
    static async getDocuments(filters: {
        client_id?: string
        property_id?: string
        lead_id?: string
        status?: string[]
        document_type?: string
        search?: string
        page?: number
        limit?: number
    } = {}): Promise<{ documents: Document[], total: number }> {
        try {
            let query = supabase
                .from('documents')
                .select(`
                    *,
                    document_type:document_types(*)
                `, { count: 'exact' })
                .is('deleted_at', null)
                .eq('is_latest_version', true)
                .order('created_at', { ascending: false })

            // Aplicar filtros
            if (filters.client_id) {
                query = query.eq('client_id', filters.client_id)
            }

            if (filters.property_id) {
                query = query.eq('property_id', filters.property_id)
            }

            if (filters.lead_id) {
                query = query.eq('lead_id', filters.lead_id)
            }

            if (filters.status && filters.status.length > 0) {
                query = query.in('status', filters.status)
            }

            if (filters.document_type) {
                query = query.eq('document_type_id', filters.document_type)
            }

            if (filters.search) {
                query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
            }

            // Paginação
            const page = filters.page || 1
            const limit = filters.limit || 20
            const offset = (page - 1) * limit

            query = query.range(offset, offset + limit - 1)

            const { data, error, count } = await query

            if (error) throw error

            return {
                documents: data || [],
                total: count || 0
            }
        } catch (error) {
            console.error('Erro ao buscar documentos:', error)
            return { documents: [], total: 0 }
        }
    }

    /**
     * Busca documento por ID
     */
    static async getDocument(documentId: string): Promise<Document | null> {
        try {
            const { data, error } = await supabase
                .from('documents')
                .select(`
                    *,
                    document_type:document_types(*),
                    tasks:document_tasks(*),
                    comments:document_comments(*),
                    activities:document_activities(*)
                `)
                .eq('id', documentId)
                .single()

            if (error) throw error

            // Registra visualização
            await this.logActivity(documentId, 'current_user', 'viewed', {})

            return data
        } catch (error) {
            console.error('Erro ao buscar documento:', error)
            return null
        }
    }

    /**
     * Atualiza status do documento
     */
    static async updateDocumentStatus(
        documentId: string, 
        status: Document['status'], 
        userId: string,
        comment?: string
    ): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('documents')
                .update({
                    status,
                    updated_by: userId,
                    ...(status === 'approved' && { approved_by: userId, approved_at: new Date().toISOString() })
                })
                .eq('id', documentId)

            if (error) throw error

            // Registra atividade
            await this.logActivity(documentId, userId, status === 'approved' ? 'approved' : 'updated', {
                new_status: status,
                comment
            })

            // Adiciona comentário se fornecido
            if (comment) {
                await this.addComment(documentId, userId, comment, true)
            }

            return true
        } catch (error) {
            console.error('Erro ao atualizar status:', error)
            return false
        }
    }

    /**
     * Cria nova versão do documento
     */
    static async createDocumentVersion(
        originalDocumentId: string,
        file: File,
        userId: string,
        comment?: string
    ): Promise<Document | null> {
        try {
            // Upload do novo arquivo
            const uploadResult = await this.uploadFile(file)
            if (!uploadResult) throw new Error('Falha no upload')

            const fileHash = await this.calculateFileHash(file)

            // Chama função do banco para criar versão
            const { data, error } = await supabase.rpc('create_document_version', {
                original_doc_id: originalDocumentId,
                new_file_path: uploadResult.path,
                new_file_size: file.size,
                new_file_hash: fileHash,
                updated_by_user: userId
            })

            if (error) throw error

            // Registra atividade
            await this.logActivity(data, userId, 'updated', {
                action: 'new_version',
                comment,
                file_name: file.name
            })

            return await this.getDocument(data)
        } catch (error) {
            console.error('Erro ao criar versão:', error)
            return null
        }
    }

    /**
     * Adiciona comentário
     */
    static async addComment(
        documentId: string, 
        userId: string, 
        comment: string, 
        isInternal: boolean = true
    ): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('document_comments')
                .insert({
                    document_id: documentId,
                    user_id: userId,
                    comment,
                    is_internal: isInternal
                })

            if (error) throw error
            return true
        } catch (error) {
            console.error('Erro ao adicionar comentário:', error)
            return false
        }
    }

    /**
     * Cria tarefa relacionada ao documento
     */
    static async createTask(taskData: Partial<DocumentTask>): Promise<DocumentTask | null> {
        try {
            const { data, error } = await supabase
                .from('document_tasks')
                .insert(taskData)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Erro ao criar tarefa:', error)
            return null
        }
    }

    /**
     * Busca tarefas pendentes do usuário
     */
    static async getUserPendingTasks(userId: string): Promise<DocumentTask[]> {
        try {
            const { data, error } = await supabase
                .from('document_tasks')
                .select(`
                    *,
                    document:documents(title, status)
                `)
                .eq('assigned_to', userId)
                .in('status', ['pending', 'in_progress'])
                .order('due_date', { ascending: true, nullsFirst: false })

            if (error) throw error
            return data || []
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error)
            return []
        }
    }

    /**
     * Busca documentos próximos do vencimento
     */
    static async getExpiringDocuments(days: number = 30): Promise<Document[]> {
        try {
            const futureDate = new Date()
            futureDate.setDate(futureDate.getDate() + days)

            const { data, error } = await supabase
                .from('documents')
                .select(`
                    *,
                    document_type:document_types(*)
                `)
                .not('expiry_date', 'is', null)
                .lte('expiry_date', futureDate.toISOString())
                .gte('expiry_date', new Date().toISOString())
                .eq('is_latest_version', true)
                .is('deleted_at', null)
                .order('expiry_date')

            if (error) throw error
            return data || []
        } catch (error) {
            console.error('Erro ao buscar documentos expirando:', error)
            return []
        }
    }

    /**
     * Registra atividade no documento
     */
    static async logActivity(
        documentId: string,
        userId: string,
        activityType: DocumentActivity['activity_type'],
        activityData: any
    ): Promise<void> {
        try {
            await supabase
                .from('document_activities')
                .insert({
                    document_id: documentId,
                    user_id: userId,
                    activity_type: activityType,
                    activity_data: activityData
                })
        } catch (error) {
            console.error('Erro ao registrar atividade:', error)
        }
    }

    /**
     * Cria tarefas automáticas baseado no workflow
     */
    static async createWorkflowTasks(document: Document): Promise<void> {
        try {
            if (!document.document_type?.workflow_stages) return

            const stages = document.document_type.workflow_stages
            const firstStage = stages[0]

            if (firstStage) {
                await this.createTask({
                    document_id: document.id,
                    title: `${firstStage} - ${document.title}`,
                    description: `Documento precisa passar pela etapa: ${firstStage}`,
                    task_type: 'review',
                    priority: 'medium',
                    created_by: document.created_by
                })
            }
        } catch (error) {
            console.error('Erro ao criar tarefas do workflow:', error)
        }
    }

    /**
     * Busca estatísticas dos documentos
     */
    static async getDocumentStats(): Promise<{
        total: number
        by_status: Record<string, number>
        by_type: Record<string, number>
        pending_tasks: number
        expiring_soon: number
    }> {
        try {
            // Total de documentos
            const { count: total } = await supabase
                .from('documents')
                .select('*', { count: 'exact', head: true })
                .eq('is_latest_version', true)
                .is('deleted_at', null)

            // Por status
            const { data: statusData } = await supabase
                .from('documents')
                .select('status')
                .eq('is_latest_version', true)
                .is('deleted_at', null)

            const by_status = (statusData || []).reduce((acc, doc) => {
                acc[doc.status] = (acc[doc.status] || 0) + 1
                return acc
            }, {} as Record<string, number>)

            // Por tipo
            const { data: typeData } = await supabase
                .from('documents')
                .select(`
                    document_type:document_types(name)
                `)
                .eq('is_latest_version', true)
                .is('deleted_at', null)

            const by_type = (typeData || []).reduce((acc, doc) => {
                const typeName = (doc.document_type as any)?.name || 'Sem tipo'
                acc[typeName] = (acc[typeName] || 0) + 1
                return acc
            }, {} as Record<string, number>)

            // Tarefas pendentes
            const { count: pending_tasks } = await supabase
                .from('document_tasks')
                .select('*', { count: 'exact', head: true })
                .in('status', ['pending', 'in_progress'])

            // Documentos expirando em 30 dias
            const expiringDocs = await this.getExpiringDocuments(30)

            return {
                total: total || 0,
                by_status,
                by_type,
                pending_tasks: pending_tasks || 0,
                expiring_soon: expiringDocs.length
            }
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error)
            return {
                total: 0,
                by_status: {},
                by_type: {},
                pending_tasks: 0,
                expiring_soon: 0
            }
        }
    }

    /**
     * Download de arquivo
     */
    static async downloadFile(document: Document): Promise<string | null> {
        try {
            if (!document.file_path) return null

            const { data, error } = await supabase.storage
                .from('documents')
                .createSignedUrl(document.file_path, 3600) // 1 hora

            if (error) throw error

            // Registra download
            await this.logActivity(document.id, 'current_user', 'downloaded', {
                file_name: document.file_name
            })

            return data.signedUrl
        } catch (error) {
            console.error('Erro ao gerar URL de download:', error)
            return null
        }
    }

    /**
     * Busca documentos faltantes para um cliente
     */
    static async getMissingDocuments(clientId: string): Promise<DocumentType[]> {
        try {
            // Busca todos os tipos obrigatórios
            const { data: requiredTypes } = await supabase
                .from('document_types')
                .select('*')
                .eq('is_required', true)
                .eq('category', 'client')

            // Busca documentos existentes do cliente
            const { data: existingDocs } = await supabase
                .from('documents')
                .select('document_type_id')
                .eq('client_id', clientId)
                .eq('is_latest_version', true)
                .is('deleted_at', null)
                .in('status', ['approved', 'pending_review'])

            const existingTypeIds = new Set(existingDocs?.map(doc => doc.document_type_id) || [])
            
            return (requiredTypes || []).filter(type => !existingTypeIds.has(type.id))
        } catch (error) {
            console.error('Erro ao buscar documentos faltantes:', error)
            return []
        }
    }
}
