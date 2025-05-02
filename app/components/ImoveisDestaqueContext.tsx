'use client'

import React, { createContext, useContext, useReducer, ReactNode, useCallback, useMemo } from 'react'
import type { ImovelClient } from '@/types/imovel-client'

// Tipos
export type ImoveisDestaqueStatus = 'idle' | 'loading' | 'success' | 'error'

export type ImoveisDestaqueState = {
    imoveis: ImovelClient[]
    activeImovelId: string | null
    status: ImoveisDestaqueStatus
    error: Error | null
    lastUpdated: number | null
}

type ImoveisDestaqueAction =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: { imoveis: ImovelClient[] } }
    | { type: 'FETCH_ERROR'; payload: { error: Error } }
    | { type: 'SET_ACTIVE_IMOVEL'; payload: { id: string } }
    | { type: 'RESET' }

type ImoveisDestaqueContextType = {
    state: ImoveisDestaqueState
    dispatch: React.Dispatch<ImoveisDestaqueAction>
    setActiveImovel: (id: string) => void
    getActiveImovel: () => ImovelClient | undefined
    isActiveImovel: (id: string) => boolean
    fetchImoveis: () => Promise<void>
}

// Estado inicial
const initialState: ImoveisDestaqueState = {
    imoveis: [],
    activeImovelId: null,
    status: 'idle',
    error: null,
    lastUpdated: null
}

// Constantes para cache
const CACHE_KEY = 'imoveis-destaque'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Criação do contexto
const ImoveisDestaqueContext = createContext<ImoveisDestaqueContextType | undefined>(undefined)

// Reducer para gerenciar as transições de estado
function imoveisDestaqueReducer(
    state: ImoveisDestaqueState,
    action: ImoveisDestaqueAction
): ImoveisDestaqueState {
    switch (action.type) {
        case 'FETCH_START':
            return {
                ...state,
                status: 'loading',
                error: null
            }
        case 'FETCH_SUCCESS':
            const imoveis = action.payload.imoveis
            return {
                ...state,
                imoveis,
                activeImovelId: imoveis.length > 0 ? imoveis[0]._id : null,
                status: 'success',
                error: null,
                lastUpdated: Date.now()
            }
        case 'FETCH_ERROR':
            return {
                ...state,
                status: 'error',
                error: action.payload.error
            }
        case 'SET_ACTIVE_IMOVEL':
            return {
                ...state,
                activeImovelId: action.payload.id
            }
        case 'RESET':
            return initialState
        default:
            return state
    }
}

// Provider Component
export function ImoveisDestaqueProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(imoveisDestaqueReducer, initialState)

    // Buscar imóveis da API
    const fetchImoveis = useCallback(async () => {
        if (state.status === 'loading') return

        dispatch({ type: 'FETCH_START' })

        try {
            // Verificar cache
            const cached = sessionStorage.getItem(CACHE_KEY)
            if (cached) {
                const { data, timestamp } = JSON.parse(cached)
                if (Date.now() - timestamp < CACHE_DURATION) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: { imoveis: data } })
                    return
                }
            }

            // Buscar da API
            const res = await fetch('/api/destaques')

            if (!res.ok) {
                throw new Error(`API respondeu com status ${res.status}`)
            }

            const data = await res.json()

            if (!Array.isArray(data)) {
                throw new Error('Formato de dados inválido')
            }

            // Atualizar state e cache
            dispatch({ type: 'FETCH_SUCCESS', payload: { imoveis: data } })
            sessionStorage.setItem(
                CACHE_KEY,
                JSON.stringify({
                    data,
                    timestamp: Date.now()
                })
            )
        } catch (err) {
            console.error('Erro ao buscar destaques:', err)
            dispatch({
                type: 'FETCH_ERROR',
                payload: { error: err instanceof Error ? err : new Error(String(err)) }
            })
        }
    }, [state.status])

    // Definir imóvel ativo
    const setActiveImovel = useCallback(
        (id: string) => {
            dispatch({ type: 'SET_ACTIVE_IMOVEL', payload: { id } })
        },
        []
    )

    // Obter o imóvel ativo atual
    const getActiveImovel = useCallback((): ImovelClient | undefined => {
        return state.imoveis.find((imovel) => imovel._id === state.activeImovelId)
    }, [state.imoveis, state.activeImovelId])

    // Verificar se um imóvel é o ativo
    const isActiveImovel = useCallback(
        (id: string): boolean => {
            return id === state.activeImovelId
        },
        [state.activeImovelId]
    )

    // Memoizar o valor do contexto para evitar re-renderizações desnecessárias
    const value = useMemo(
        () => ({
            state,
            dispatch,
            setActiveImovel,
            getActiveImovel,
            isActiveImovel,
            fetchImoveis
        }),
        [state, setActiveImovel, getActiveImovel, isActiveImovel, fetchImoveis]
    )

    return <ImoveisDestaqueContext.Provider value={value}>{children}</ImoveisDestaqueContext.Provider>
}

// Hook para usar o contexto
export function useImoveisDestaque() {
    const context = useContext(ImoveisDestaqueContext)
    if (context === undefined) {
        throw new Error('useImoveisDestaque must be used within a ImoveisDestaqueProvider')
    }
    return context
}