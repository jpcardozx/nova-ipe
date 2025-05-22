'use client'

import React, {
    createContext,
    useContext,
    useReducer,
    useCallback,
    useMemo,
    useEffect,
    useRef,
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

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

type State = {
    imoveis: Imovel[]
    status: 'idle' | 'loading' | 'success' | 'error'
    error: string | null
    activeImovelId: string | null
    lastFetched: number | null
    filtros: FiltrosAluguel
}

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Imovel[] }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'SET_ACTIVE_IMOVEL'; payload: string }
    | { type: 'APLICAR_FILTROS'; payload: FiltrosAluguel }
    | { type: 'LIMPAR_FILTROS' }
    | { type: 'RESET' }

/* ----------------------- Estado inicial ----------------------- */
const initialState: State = {
    imoveis: [],
    status: 'idle',
    error: null,
    activeImovelId: null,
    lastFetched: null,
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
            return {
                ...state,
                status: 'loading',
                error: null
            }

        case 'FETCH_SUCCESS':
            return {
                ...state,
                imoveis: action.payload,
                status: 'success',
                error: null,
                lastFetched: Date.now(),
                activeImovelId: state.activeImovelId || action.payload[0]?._id || null
            }

        case 'FETCH_ERROR':
            return {
                ...state,
                status: 'error',
                error: action.payload,
                imoveis: []
            }

        case 'SET_ACTIVE_IMOVEL':
            return {
                ...state,
                activeImovelId: action.payload
            }

        case 'APLICAR_FILTROS':
            return {
                ...state,
                filtros: action.payload
            }

        case 'LIMPAR_FILTROS':
            return {
                ...state,
                filtros: initialState.filtros
            }

        case 'RESET':
            return {
                ...initialState
            }

        default:
            return state
    }
}

/* --------------------- Contexto e Provider --------------------- */
type ImoveisAluguelContextType = {
    state: State
    fetchImoveis: (force?: boolean) => Promise<void>
    setActiveImovel: (id: string) => void
    isActiveImovel: (id: string) => boolean
    aplicarFiltros: (filtros: FiltrosAluguel) => void
    limparFiltros: () => void
    contarFiltrosAtivos: () => number
    reset: () => void
}

const ImoveisAluguelContext = createContext<ImoveisAluguelContextType | undefined>(undefined)

export function ImoveisAluguelProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const abortControllerRef = useRef<AbortController | null>(null);

    const validateImovel = (imovel: any): imovel is Imovel => {
        return (
            imovel &&
            typeof imovel._id === 'string' &&
            typeof imovel.titulo === 'string' &&
            typeof imovel.valorAluguel === 'number'
        );
    };

    const fetchImoveis = useCallback(async (force = false) => {
        // Check cache unless force refresh is requested
        if (!force && state.status === 'success' && state.lastFetched) {
            const cacheAge = Date.now() - state.lastFetched;
            if (cacheAge < CACHE_DURATION) {
                return; // Use cached data
            }
        }

        // Prevent multiple simultaneous requests
        if (state.status === 'loading') {
            return;
        }

        // Cancel any existing fetch
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        dispatch({ type: 'FETCH_START' });

        try {
            const response = await fetch('/api/imoveis/aluguel', {
                signal: abortController.signal,
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Validate data structure
            if (!Array.isArray(data)) {
                throw new Error('API response is not in the expected format');
            }

            // Validate each imovel
            const validatedData = data.filter(validateImovel);

            if (validatedData.length === 0 && data.length > 0) {
                console.warn('No valid rental properties found in response');
            }

            dispatch({ type: 'FETCH_SUCCESS', payload: validatedData });
        } catch (error) {
            // Ignore aborted requests
            if (error instanceof Error && error.name === 'AbortError') {
                return;
            }

            console.error('Error fetching rental properties:', error);
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Erro ao buscar imóveis'
            });
        } finally {
            if (abortControllerRef.current === abortController) {
                abortControllerRef.current = null;
            }
        }
    }, [state.status, state.lastFetched]);

    const setActiveImovel = useCallback((id: string) => {
        dispatch({ type: 'SET_ACTIVE_IMOVEL', payload: id });
    }, []);

    const isActiveImovel = useCallback(
        (id: string) => state.activeImovelId === id,
        [state.activeImovelId]
    ); const aplicarFiltros = useCallback((filtros: FiltrosAluguel) => {
        dispatch({ type: 'APLICAR_FILTROS', payload: filtros });
    }, []);

    const limparFiltros = useCallback(() => {
        dispatch({ type: 'LIMPAR_FILTROS' });
    }, []);

    const reset = useCallback(() => {
        dispatch({ type: 'RESET' });
    }, []);

    const contarFiltrosAtivos = useCallback(() => {
        const { filtros } = state;
        let count = 0;
        if (filtros.precoMax !== null) count++;
        if (filtros.quartos !== null) count++;
        if (filtros.bairros.length > 0) count++;
        if (filtros.mobiliado) count++;
        if (filtros.petsPermitidos) count++;
        if (filtros.promocao) count++;
        return count;
    }, [state.filtros]);

    // Auto-fetch on mount with cleanup
    useEffect(() => {
        if (state.status === 'idle') {
            fetchImoveis();
        }

        // Cleanup on unmount
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
            reset();
        };
    }, [fetchImoveis, state.status, reset]);

    const value: ImoveisAluguelContextType = useMemo(() => ({
        state,
        fetchImoveis,
        setActiveImovel,
        isActiveImovel,
        aplicarFiltros,
        limparFiltros,
        contarFiltrosAtivos,
        reset
    }), [state, fetchImoveis, setActiveImovel, isActiveImovel, aplicarFiltros, limparFiltros, contarFiltrosAtivos, reset])

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
