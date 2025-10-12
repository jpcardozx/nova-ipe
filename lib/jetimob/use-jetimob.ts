/**
 * Hook React para integração com Jetimob API
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { jetimobService, JetimobLead } from './jetimob-service'

interface UseJetimobOptions {
    autoAuthenticate?: boolean
    onError?: (error: Error) => void
}

interface UseJetimobReturn {
    // Estado
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    
    // Métodos de autenticação
    authenticate: () => Promise<boolean>
    
    // Métodos de imóveis
    properties: any[]
    loadProperties: () => Promise<void>
    createProperty: (property: any) => Promise<any>
    updateProperty: (id: string, updates: any) => Promise<any>
    deleteProperty: (id: string) => Promise<void>
    
    // Métodos de portais
    portals: any[]
    loadPortals: () => Promise<void>
    syncToPortals: (propertyId: string, portalIds: string[]) => Promise<void>
    unsyncFromPortals: (propertyId: string, portalIds: string[]) => Promise<void>
    
    // Métodos de leads
    leads: any[]
    loadLeads: (filters?: any) => Promise<void>
    updateLeadStatus: (leadId: string, status: JetimobLead['status']) => Promise<void>
    
    // Upload de imagens
    uploadImage: (propertyId: string, file: File) => Promise<string | null>
    
    // Relatórios
    getReport: (propertyId: string) => Promise<any>
}

export function useJetimob(options: UseJetimobOptions = {}): UseJetimobReturn {
    const { autoAuthenticate = true, onError } = options
    
    // Estados principais
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    // Estados de dados
    const [properties, setProperties] = useState<any[]>([])
    const [portals, setPortals] = useState<any[]>([])
    const [leads, setLeads] = useState<any[]>([])

    // Função para lidar com erros
    const handleError = useCallback((err: Error) => {
        const errorMessage = err.message || 'Erro desconhecido'
        setError(errorMessage)
        if (onError) {
            onError(err)
        }
        console.error('Erro Jetimob:', err)
    }, [onError])

    // Autenticação
    const authenticate = useCallback(async (): Promise<boolean> => {
        setIsLoading(true)
        setError(null)
        
        try {
            const success = await jetimobService.authenticate()
            setIsAuthenticated(success)
            
            if (!success) {
                throw new Error('Falha na autenticação com Jetimob')
            }            
            return true
        } catch (err) {
            handleError(err as Error)
            return false
        } finally {
            setIsLoading(false)
        }
    }, [handleError])

    // Carregar imóveis
    const loadProperties = useCallback(async (): Promise<void> => {
        if (!isAuthenticated) return
        
        setIsLoading(true)
        setError(null)
        
        try {
            const data = await jetimobService.getProperties()
            setProperties(data)
        } catch (err) {
            handleError(err as Error)
        } finally {
            setIsLoading(false)
        }
    }, [isAuthenticated, handleError])

    // Criar imóvel
    const createProperty = useCallback(async (property: any): Promise<any> => {
        if (!isAuthenticated) throw new Error('Não autenticado')
        
        setIsLoading(true)
        setError(null)
        
        try {
            const newProperty = await jetimobService.createProperty(property)
            setProperties(prev => [...prev, newProperty])
            return newProperty
        } catch (err) {
            handleError(err as Error)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [isAuthenticated, handleError])

    // Atualizar imóvel
    const updateProperty = useCallback(async (id: string, updates: any): Promise<any> => {
        if (!isAuthenticated) throw new Error('Não autenticado')
        
        setIsLoading(true)
        setError(null)
        
        try {
            const updatedProperty = await jetimobService.updateProperty(id, updates)
            setProperties(prev => prev.map(p => p.id === id ? updatedProperty : p))
            return updatedProperty
        } catch (err) {
            handleError(err as Error)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [isAuthenticated, handleError])

    // Deletar imóvel
    const deleteProperty = useCallback(async (id: string): Promise<void> => {
        if (!isAuthenticated) throw new Error('Não autenticado')
        
        setIsLoading(true)
        setError(null)
        
        try {
            await jetimobService.deleteProperty(id)
            setProperties(prev => prev.filter(p => p.id !== id))
        } catch (err) {
            handleError(err as Error)
        } finally {
            setIsLoading(false)
        }
    }, [isAuthenticated, handleError])

    // Carregar portais
    const loadPortals = useCallback(async (): Promise<void> => {
        if (!isAuthenticated) return
        
        setIsLoading(true)
        setError(null)
        
        try {
            const data = await jetimobService.getPortals()
            setPortals(data)
        } catch (err) {
            handleError(err as Error)
        } finally {
            setIsLoading(false)
        }
    }, [isAuthenticated, handleError])

    // Sincronizar com portais
    const syncToPortals = useCallback(async (propertyId: string, portalIds: string[]): Promise<void> => {
        if (!isAuthenticated) throw new Error('Não autenticado')
        
        setIsLoading(true)
        setError(null)
        
        try {
            await jetimobService.syncPropertyToPortals(propertyId, portalIds)
        } catch (err) {
            handleError(err as Error)
        } finally {
            setIsLoading(false)
        }
    }, [isAuthenticated, handleError])

    // Remover sincronização
    const unsyncFromPortals = useCallback(async (propertyId: string, portalIds: string[]): Promise<void> => {
        if (!isAuthenticated) throw new Error('Não autenticado')
        
        setIsLoading(true)
        setError(null)
        
        try {
            await jetimobService.unsyncPropertyFromPortals(propertyId, portalIds)
        } catch (err) {
            handleError(err as Error)
        } finally {
            setIsLoading(false)
        }
    }, [isAuthenticated, handleError])

    // Carregar leads
    const loadLeads = useCallback(async (filters?: any): Promise<void> => {
        if (!isAuthenticated) return
        
        setIsLoading(true)
        setError(null)
        
        try {
            const data = await jetimobService.getLeads(filters)
            setLeads(data)
        } catch (err) {
            handleError(err as Error)
        } finally {
            setIsLoading(false)
        }
    }, [isAuthenticated, handleError])

    // Atualizar status do lead (API somente leitura - retorna warning)
    const updateLeadStatus = useCallback(async (leadId: string, status: JetimobLead['status']): Promise<void> => {
        if (!isAuthenticated) throw new Error('Não autenticado')
        
        setIsLoading(true)
        setError(null)
        
        try {
            await jetimobService.updateLeadStatus(leadId, status)
            // API não suporta escrita, então não atualizamos o estado local
        } catch (err) {
            handleError(err as Error)
        } finally {
            setIsLoading(false)
        }
    }, [isAuthenticated, handleError])

    // Upload de imagem
    const uploadImage = useCallback(async (propertyId: string, file: File): Promise<string | null> => {
        if (!isAuthenticated) throw new Error('Não autenticado')
        
        setIsLoading(true)
        setError(null)
        
        try {
            // Simula o upload criando uma URL falsa
            const fakeUrl = URL.createObjectURL(file)
            const result = await jetimobService.uploadPropertyImage(propertyId, fakeUrl)
            return result.url
        } catch (err) {
            handleError(err as Error)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [isAuthenticated, handleError])

    // Obter relatório
    const getReport = useCallback(async (propertyId: string): Promise<any> => {
        if (!isAuthenticated) throw new Error('Não autenticado')
        
        setIsLoading(true)
        setError(null)
        
        try {
            const report = await jetimobService.getPerformanceReport(propertyId)
            return report
        } catch (err) {
            handleError(err as Error)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [isAuthenticated, handleError])

    // Auto-autenticação no mount
    useEffect(() => {
        if (autoAuthenticate && !isAuthenticated) {
            authenticate()
        }
    }, [autoAuthenticate, isAuthenticated, authenticate])

    return {
        // Estado
        isAuthenticated,
        isLoading,
        error,
        
        // Autenticação
        authenticate,
        
        // Imóveis
        properties,
        loadProperties,
        createProperty,
        updateProperty,
        deleteProperty,
        
        // Portais
        portals,
        loadPortals,
        syncToPortals,
        unsyncFromPortals,
        
        // Leads
        leads,
        loadLeads,
        updateLeadStatus,
        
        // Upload
        uploadImage,
        
        // Relatórios
        getReport
    }
}

// Hook específico para propriedades
export function useJetimobProperties() {
    const {
        properties,
        loadProperties,
        createProperty,
        updateProperty,
        deleteProperty,
        isLoading,
        error
    } = useJetimob()

    return {
        properties,
        loadProperties,
        createProperty,
        updateProperty,
        deleteProperty,
        isLoading,
        error
    }
}

// Hook específico para leads
export function useJetimobLeads() {
    const {
        leads,
        loadLeads,
        updateLeadStatus,
        isLoading,
        error
    } = useJetimob()

    return {
        leads,
        loadLeads,
        updateLeadStatus,
        isLoading,
        error
    }
}

// Hook específico para portais
export function useJetimobPortals() {
    const {
        portals,
        loadPortals,
        syncToPortals,
        unsyncFromPortals,
        isLoading,
        error
    } = useJetimob()

    return {
        portals,
        loadPortals,
        syncToPortals,
        unsyncFromPortals,
        isLoading,
        error
    }
}
