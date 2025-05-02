'use client'

import React, {
    createContext,
    useContext,
    useReducer,
    useCallback,
    useMemo,
    ReactNode
} from 'react'

/* ------------------------- Tipagens ------------------------- */
export type Imovel = {
    _id: string
    titulo: string
    slug?: string
    bairro: string
    endereco: string
    descricao: string
    valorAluguel: number
    caracteristicas: string[]
    imagens: string[]
    tipo: string
    destaque?: boolean
    isPremium?: boolean
    disponibilidadeImediata?: boolean
    avaliacaoLocador?: number
    promocao?: {
        ativa: boolean
        desconto: number
        texto?: string
    }
}

export type FiltrosAluguel = {
    precoMax: number | null
    quartos: number | null
    bairros: string[]
    mobiliado: boolean
    petsPermitidos: boolean
    promocao: boolean
}

type State = {
    imoveis: Imovel[]
    status: 'idle' | 'loading' | 'success' | 'error'
    error: string | null
    activeImovelId: string | null
    filtros: FiltrosAluguel
}

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Imovel[] }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'SET_ACTIVE_IMOVEL'; payload: string }
    | { type: 'APLICAR_FILTROS'; payload: FiltrosAluguel }
    | { type: 'LIMPAR_FILTROS' }

/* ----------------------- Estado inicial ----------------------- */
const initialState: State = {
    imoveis: [],
    status: 'idle',
    error: null,
    activeImovelId: null,
    filtros: {
        precoMax: null,
        quartos: null,
        bairros: [],
        mobiliado: false,
        petsPermitidos: false,
        promocao: false
    }
}

/* ----------------------- Reducer ----------------------- */
function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, status: 'loading', error: null }

        case 'FETCH_SUCCESS':
            return {
                ...state,
                imoveis: action.payload,
                status: 'success',
                error: null,
                activeImovelId: action.payload[0]?._id || null
            }

        case 'FETCH_ERROR':
            return { ...state, status: 'error', error: action.payload }

        case 'SET_ACTIVE_IMOVEL':
            return { ...state, activeImovelId: action.payload }

        case 'APLICAR_FILTROS':
            return { ...state, filtros: action.payload }

        case 'LIMPAR_FILTROS':
            return { ...state, filtros: initialState.filtros }

        default:
            return state
    }
}

/* --------------------- Contexto e Provider --------------------- */
type ImoveisAluguelContextType = {
    state: State
    fetchImoveis: () => Promise<void>
    setActiveImovel: (id: string) => void
    isActiveImovel: (id: string) => boolean
    aplicarFiltros: (filtros: FiltrosAluguel) => void
    limparFiltros: () => void
    contarFiltrosAtivos: () => number
}

const ImoveisAluguelContext = createContext<ImoveisAluguelContextType | undefined>(undefined)

export function ImoveisAluguelProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState)

    const fetchImoveis = useCallback(async () => {
        dispatch({ type: 'FETCH_START' })

        try {
            // Simula fetch ou substitua por API real
            const response = await fetch('/api/imoveis/aluguel')
            const data: Imovel[] = await response.json()

            dispatch({ type: 'FETCH_SUCCESS', payload: data })
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: 'Erro ao buscar imóveis' })
        }
    }, [])

    const setActiveImovel = useCallback((id: string) => {
        dispatch({ type: 'SET_ACTIVE_IMOVEL', payload: id })
    }, [])

    const isActiveImovel = useCallback(
        (id: string) => state.activeImovelId === id,
        [state.activeImovelId]
    )

    const aplicarFiltros = useCallback((filtros: FiltrosAluguel) => {
        dispatch({ type: 'APLICAR_FILTROS', payload: filtros })
    }, [])

    const limparFiltros = useCallback(() => {
        dispatch({ type: 'LIMPAR_FILTROS' })
    }, [])

    const contarFiltrosAtivos = useCallback(() => {
        const { filtros } = state
        let count = 0
        if (filtros.precoMax !== null) count++
        if (filtros.quartos !== null) count++
        if (filtros.bairros.length > 0) count++
        if (filtros.mobiliado) count++
        if (filtros.petsPermitidos) count++
        if (filtros.promocao) count++
        return count
    }, [state.filtros])

    const value: ImoveisAluguelContextType = useMemo(() => ({
        state,
        fetchImoveis,
        setActiveImovel,
        isActiveImovel,
        aplicarFiltros,
        limparFiltros,
        contarFiltrosAtivos
    }), [state, fetchImoveis, setActiveImovel, isActiveImovel, aplicarFiltros, limparFiltros, contarFiltrosAtivos])

    return (
        <ImoveisAluguelContext.Provider value={value}>
            {children}
        </ImoveisAluguelContext.Provider>
    )
}

/* --------------------- Hook simplificado --------------------- */
export function useImoveisAluguel() {
    const context = useContext(ImoveisAluguelContext)
    if (!context) {
        throw new Error('useImoveisAluguel deve ser usado dentro de um ImoveisAluguelProvider')
    }
    return context
}
