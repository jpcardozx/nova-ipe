import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ifhfpaehnjpdwdocdzwd.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaGZwYWVobmpwZHdkb2NkendkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMDMxMzIsImV4cCI6MjA3MjU3OTEzMn0.-YL0e3oE6mRqL0K432iP3dlbTRPz8G07QJLOI0Ulcyk'

const supabase = createClient(supabaseUrl, supabaseKey)

export interface Document {
    id: string
    title: string
    type: 'contract' | 'proposal' | 'deed' | 'certificate' | 'report' | 'other'
    status: 'draft' | 'pending' | 'signed' | 'completed' | 'expired'
    client_name?: string
    property_address?: string
    file_url?: string
    file_size?: string
    content?: string
    is_template: boolean
    is_favorite: boolean
    created_by?: string
    created_at: string
    updated_at?: string
}

export interface DocumentTemplate {
    id: string
    name: string
    description: string
    type: 'contract' | 'proposal' | 'deed' | 'certificate' | 'report'
    content?: string
    usage_count: number
    created_by?: string
    created_at: string
    updated_at?: string
}

export class DocumentsService {
    static async getDocuments() {
        try {
            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching documents:', error)
                return { documents: [], error }
            }

            return { documents: data || [], error: null }
        } catch (error) {
            console.error('Error in getDocuments:', error)
            return { documents: [], error }
        }
    }

    static async getDocumentTemplates() {
        try {
            const { data, error } = await supabase
                .from('document_templates')
                .select('*')
                .order('usage_count', { ascending: false })

            if (error) {
                console.error('Error fetching document templates:', error)
                return { templates: [], error }
            }

            return { templates: data || [], error: null }
        } catch (error) {
            console.error('Error in getDocumentTemplates:', error)
            return { templates: [], error }
        }
    }

    static async createDocument(document: Omit<Document, 'id' | 'created_at' | 'updated_at'>) {
        try {
            const { data, error } = await supabase
                .from('documents')
                .insert([{
                    ...document,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single()

            if (error) {
                console.error('Error creating document:', error)
                return { document: null, error }
            }

            return { document: data, error: null }
        } catch (error) {
            console.error('Error in createDocument:', error)
            return { document: null, error }
        }
    }

    static async updateDocument(id: string, updates: Partial<Document>) {
        try {
            const { data, error } = await supabase
                .from('documents')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single()

            if (error) {
                console.error('Error updating document:', error)
                return { document: null, error }
            }

            return { document: data, error: null }
        } catch (error) {
            console.error('Error in updateDocument:', error)
            return { document: null, error }
        }
    }

    static async deleteDocument(id: string) {
        try {
            const { error } = await supabase
                .from('documents')
                .delete()
                .eq('id', id)

            if (error) {
                console.error('Error deleting document:', error)
                return { error }
            }

            return { error: null }
        } catch (error) {
            console.error('Error in deleteDocument:', error)
            return { error }
        }
    }

    static async toggleFavorite(id: string, isFavorite: boolean) {
        try {
            const { data, error } = await supabase
                .from('documents')
                .update({ 
                    is_favorite: isFavorite,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single()

            if (error) {
                console.error('Error toggling favorite:', error)
                return { document: null, error }
            }

            return { document: data, error: null }
        } catch (error) {
            console.error('Error in toggleFavorite:', error)
            return { document: null, error }
        }
    }

    static async createFromTemplate(templateId: string, title: string, clientName?: string, propertyAddress?: string) {
        try {
            // Buscar o template
            const { data: template, error: templateError } = await supabase
                .from('document_templates')
                .select('*')
                .eq('id', templateId)
                .single()

            if (templateError) {
                console.error('Error fetching template:', templateError)
                return { document: null, error: templateError }
            }

            // Criar documento baseado no template
            const newDocument = {
                title,
                type: template.type,
                status: 'draft' as const,
                client_name: clientName,
                property_address: propertyAddress,
                content: template.content,
                is_template: false,
                is_favorite: false,
                created_at: new Date().toISOString()
            }

            const { data, error } = await supabase
                .from('documents')
                .insert([newDocument])
                .select()
                .single()

            if (error) {
                console.error('Error creating document from template:', error)
                return { document: null, error }
            }

            // Incrementar contador de uso do template
            await supabase
                .from('document_templates')
                .update({ 
                    usage_count: template.usage_count + 1,
                    updated_at: new Date().toISOString()
                })
                .eq('id', templateId)

            return { document: data, error: null }
        } catch (error) {
            console.error('Error in createFromTemplate:', error)
            return { document: null, error }
        }
    }

    static async searchDocuments(query: string, type?: string, status?: string) {
        try {
            let queryBuilder = supabase
                .from('documents')
                .select('*')

            if (query) {
                queryBuilder = queryBuilder.or(`title.ilike.%${query}%,client_name.ilike.%${query}%,property_address.ilike.%${query}%`)
            }

            if (type && type !== 'all') {
                queryBuilder = queryBuilder.eq('type', type)
            }

            if (status && status !== 'all') {
                queryBuilder = queryBuilder.eq('status', status)
            }

            const { data, error } = await queryBuilder
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error searching documents:', error)
                return { documents: [], error }
            }

            return { documents: data || [], error: null }
        } catch (error) {
            console.error('Error in searchDocuments:', error)
            return { documents: [], error }
        }
    }
}
