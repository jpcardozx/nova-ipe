import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface CRMClient {
    id: string
    name: string
    email: string
    phone: string
    cpf_cnpj?: string
    address?: any
    status: 'active' | 'inactive' | 'lead' | 'client'
    lead_source?: string
    assigned_to?: string
    notes?: string
    created_at: string
    updated_at: string
}

export interface CRMProperty {
    id: string
    title: string
    description?: string
    property_type: string
    status: 'available' | 'sold' | 'rented' | 'reserved'
    price: number
    address?: any
    features?: any
    images?: any
    owner_id?: string
    created_at: string
    updated_at: string
}

export interface CRMActivity {
    id: string
    client_id?: string
    property_id?: string
    activity_type: string
    title: string
    description?: string
    scheduled_date?: string
    completed_date?: string
    status: 'pending' | 'completed' | 'cancelled'
    assigned_to?: string
    created_at: string
}

export interface CRMDocument {
    id: string
    client_id?: string
    property_id?: string
    file_name: string
    file_path: string
    file_type?: string
    file_size?: number
    document_type?: string
    uploaded_by?: string
    created_at: string
}

export interface CRMStats {
    totalClients: number
    totalProperties: number
    activeDeals: number
    pendingActivities: number
    monthlyRevenue: number
}

export function useCRM() {
    const [clients, setClients] = useState<CRMClient[]>([])
    const [properties, setProperties] = useState<CRMProperty[]>([])
    const [activities, setActivities] = useState<CRMActivity[]>([])
    const [documents, setDocuments] = useState<CRMDocument[]>([])
    const [stats, setStats] = useState<CRMStats>({
        totalClients: 0,
        totalProperties: 0,
        activeDeals: 0,
        pendingActivities: 0,
        monthlyRevenue: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Carregar clientes
    const loadClients = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('crm_clients')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setClients(data || [])
        } catch (err: any) {
            setError(err.message)
        }
    }, [])

    // Carregar imóveis
    const loadProperties = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('crm_properties')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setProperties(data || [])
        } catch (err: any) {
            setError(err.message)
        }
    }, [])

    // Carregar atividades
    const loadActivities = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('crm_activities')
                .select(`
                    *,
                    client:client_id(name),
                    property:property_id(title)
                `)
                .order('scheduled_date', { ascending: true })
                .limit(50)

            if (error) throw error
            setActivities(data || [])
        } catch (err: any) {
            setError(err.message)
        }
    }, [])

    // Carregar documentos
    const loadDocuments = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('crm_documents')
                .select(`
                    *,
                    client:client_id(name),
                    property:property_id(title)
                `)
                .order('created_at', { ascending: false })
                .limit(100)

            if (error) throw error
            setDocuments(data || [])
        } catch (err: any) {
            setError(err.message)
        }
    }, [])

    // Carregar estatísticas
    const loadStats = useCallback(async () => {
        try {
            const [clientsRes, propertiesRes, dealsRes, activitiesRes] = await Promise.all([
                supabase.from('crm_clients').select('id', { count: 'exact' }),
                supabase.from('crm_properties').select('id', { count: 'exact' }),
                supabase.from('crm_deals').select('id').eq('status', 'negotiating'),
                supabase.from('crm_activities').select('id').eq('status', 'pending')
            ])

            setStats({
                totalClients: clientsRes.count || 0,
                totalProperties: propertiesRes.count || 0,
                activeDeals: dealsRes.data?.length || 0,
                pendingActivities: activitiesRes.data?.length || 0,
                monthlyRevenue: 0 // Calcular depois com base nas vendas
            })
        } catch (err: any) {
            setError(err.message)
        }
    }, [])

    // Criar cliente
    const createClient = useCallback(async (clientData: Partial<CRMClient>) => {
        try {
            const { data, error } = await supabase
                .from('crm_clients')
                .insert([clientData])
                .select()
                .single()

            if (error) throw error
            
            setClients(prev => [data, ...prev])
            return data
        } catch (err: any) {
            setError(err.message)
            throw err
        }
    }, [])

    // Atualizar cliente
    const updateClient = useCallback(async (id: string, updates: Partial<CRMClient>) => {
        try {
            const { data, error } = await supabase
                .from('crm_clients')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            
            setClients(prev => prev.map(c => c.id === id ? data : c))
            return data
        } catch (err: any) {
            setError(err.message)
            throw err
        }
    }, [])

    // Criar atividade
    const createActivity = useCallback(async (activityData: Partial<CRMActivity>) => {
        try {
            const { data, error } = await supabase
                .from('crm_activities')
                .insert([activityData])
                .select()
                .single()

            if (error) throw error
            
            setActivities(prev => [data, ...prev])
            return data
        } catch (err: any) {
            setError(err.message)
            throw err
        }
    }, [])

    // Fazer upload de documento
    const uploadDocument = useCallback(async (
        file: File, 
        clientId?: string, 
        propertyId?: string,
        documentType?: string
    ) => {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `documents/${fileName}`

            // Upload do arquivo
            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // Salvar referência no banco
            const { data, error } = await supabase
                .from('crm_documents')
                .insert([{
                    client_id: clientId,
                    property_id: propertyId,
                    file_name: file.name,
                    file_path: filePath,
                    file_type: file.type,
                    file_size: file.size,
                    document_type: documentType
                }])
                .select()
                .single()

            if (error) throw error
            
            setDocuments(prev => [data, ...prev])
            return data
        } catch (err: any) {
            setError(err.message)
            throw err
        }
    }, [])

    // Carregar todos os dados
    const loadAll = useCallback(async () => {
        setLoading(true)
        setError(null)
        
        try {
            await Promise.all([
                loadClients(),
                loadProperties(),
                loadActivities(),
                loadDocuments(),
                loadStats()
            ])
        } finally {
            setLoading(false)
        }
    }, [loadClients, loadProperties, loadActivities, loadDocuments, loadStats])

    // Carregar dados ao montar
    useEffect(() => {
        loadAll()
    }, [loadAll])

    return {
        // Data
        clients,
        properties,
        activities,
        documents,
        stats,
        
        // State
        loading,
        error,
        
        // Actions
        createClient,
        updateClient,
        createActivity,
        uploadDocument,
        
        // Loaders
        loadClients,
        loadProperties,
        loadActivities,
        loadDocuments,
        loadStats,
        loadAll
    }
}
