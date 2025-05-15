'use client'

import { createContext, useContext, useReducer, useCallback, useMemo, ReactNode } from 'react'
import type { Imovel } from '@/types/sanity-schema'

// Tipos de estado
type ImoveisDestaqueState = {
    imoveis: Imovel[];
    activeImovel: string | null;
    status: 'idle' | 'loading' | 'success' | 'error';
    error: string | null;
}

// Ações do reducer
type ImoveisDestaqueAction =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Imovel[] }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'SET_ACTIVE_IMOVEL'; payload: string }

// Estado inicial
const initialState: ImoveisDestaqueState = {
    imoveis: [],
    activeImovel: null,
    status: 'idle',
    error: null
}

// Reducer para gerenciar o estado
function imoveisDestaqueReducer(state: ImoveisDestaqueState, action: ImoveisDestaqueAction): ImoveisDestaqueState {
    switch (action.type) {
        case 'FETCH_START':
            return {
                ...state,
                status: 'loading',
                error: null
            }
        case 'FETCH_SUCCESS': return {
            ...state,
            imoveis: action.payload,
            status: 'success',
            error: null,
            // Define o primeiro imóvel como ativo se não houver nenhum ativo ainda
            activeImovel: state.activeImovel || (action.payload.length > 0 ? (action.payload[0] as any & { _id: string })._id : null)
        }
        case 'FETCH_ERROR':
            return {
                ...state,
                status: 'error',
                error: action.payload
            }
        case 'SET_ACTIVE_IMOVEL':
            return {
                ...state,
                activeImovel: action.payload
            }
        default:
            return state
    }
}

// Criar contexto
interface ImoveisDestaqueContextType {
    state: ImoveisDestaqueState;
    fetchImoveis: () => Promise<void>;
    setActiveImovel: (id: string) => void;
    isActiveImovel: (id: string) => boolean;
}

const ImoveisDestaqueContext = createContext<ImoveisDestaqueContextType | undefined>(undefined)

// Provider component
export function ImoveisDestaqueProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(imoveisDestaqueReducer, initialState)

    /**
     * Função para buscar imóveis do Sanity
     */
    const fetchImoveis = useCallback(async () => {
        dispatch({ type: 'FETCH_START' })

        try {
            // Endpoint da API para buscar os imóveis em destaque
            const response = await fetch('/api/imoveis/destaque')

            if (!response.ok) {
                throw new Error(`Erro ao buscar imóveis: ${response.status}`)
            }

            const data = await response.json()

            // Se a resposta da API incluir uma propriedade error
            if (data.error) {
                throw new Error(data.error)
            }

            // Assumindo que a API retorna um array de imóveis
            dispatch({ type: 'FETCH_SUCCESS', payload: data.imoveis || [] })
        } catch (error) {
            console.error('Erro ao buscar imóveis:', error)
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Erro desconhecido ao buscar imóveis'
            })
        }
    }, [])

    /**
     * Define um imóvel como ativo para destaque na seção hero
     */
    const setActiveImovel = useCallback((id: string) => {
        dispatch({ type: 'SET_ACTIVE_IMOVEL', payload: id })
    }, [])

    /**
     * Verifica se um imóvel está ativo
     */
    const isActiveImovel = useCallback(
        (id: string) => id === state.activeImovel,
        [state.activeImovel]
    )

    // Memoiza o valor do contexto para evitar re-renderizações desnecessárias
    const contextValue = useMemo(
        () => ({
            state,
            fetchImoveis,
            setActiveImovel,
            isActiveImovel
        }),
        [state, fetchImoveis, setActiveImovel, isActiveImovel]
    )

    return (
        <ImoveisDestaqueContext.Provider value={contextValue}>
            {children}
        </ImoveisDestaqueContext.Provider>
    )
}

/**
 * Hook para usar o contexto de imóveis em destaque
 */
export function useImoveisDestaque() {
    const context = useContext(ImoveisDestaqueContext)

    if (context === undefined) {
        throw new Error('useImoveisDestaque deve ser usado dentro de um ImoveisDestaqueProvider')
    }

    return context
}