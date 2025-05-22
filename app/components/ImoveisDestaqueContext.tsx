'use client'

import { createContext, useContext, useReducer, useCallback, useMemo, ReactNode, useEffect, useRef } from 'react'
import type { Imovel } from '@/types/sanity-schema'

// Tipos de estado
type ImoveisDestaqueState = {
    imoveis: Imovel[];
    activeImovel: string | null;
    status: 'idle' | 'loading' | 'success' | 'error';
    error: string | null;
    lastFetched: number | null;
}

// Ações do reducer
type ImoveisDestaqueAction =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Imovel[] }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'SET_ACTIVE_IMOVEL'; payload: string }
    | { type: 'RESET' }

// Estado inicial
const initialState: ImoveisDestaqueState = {
    imoveis: [],
    activeImovel: null,
    status: 'idle',
    error: null,
    lastFetched: null
}

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Reducer para gerenciar o estado
function imoveisDestaqueReducer(state: ImoveisDestaqueState, action: ImoveisDestaqueAction): ImoveisDestaqueState {
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
                activeImovel: state.activeImovel || (action.payload.length > 0 ? action.payload[0]._id : null)
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
                activeImovel: action.payload
            }
        case 'RESET':
            return {
                ...initialState
            }
        default:
            return state
    }
}

// Criar contexto
interface ImoveisDestaqueContextType {
    state: ImoveisDestaqueState;
    fetchImoveis: (force?: boolean) => Promise<void>;
    setActiveImovel: (id: string) => void;
    isActiveImovel: (id: string) => boolean;
    reset: () => void;
}

const ImoveisDestaqueContext = createContext<ImoveisDestaqueContextType | undefined>(undefined);

// Provider component 
export function ImoveisDestaqueProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(imoveisDestaqueReducer, initialState);
    const abortControllerRef = useRef<AbortController | null>(null);

    const validateImovel = (imovel: any): imovel is Imovel => {
        return (
            imovel &&
            typeof imovel._id === 'string' &&
            typeof imovel.titulo === 'string'
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
            const response = await fetch('/api/imoveis/destaque', {
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
                console.warn('No valid properties found in response');
            }

            dispatch({ type: 'FETCH_SUCCESS', payload: validatedData });
        } catch (error) {
            // Ignore aborted requests
            if (error instanceof Error && error.name === 'AbortError') {
                return;
            }

            console.error('Error fetching imoveis:', error);
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Erro ao buscar imóveis'
            });
        } finally {
            if (abortControllerRef.current === abortController) {
                abortControllerRef.current = null;
            }
        }
    }, [state.status, state.lastFetched]); const setActiveImovel = useCallback((id: string) => {
        dispatch({ type: 'SET_ACTIVE_IMOVEL', payload: id });
    }, []);

    const isActiveImovel = useCallback(
        (id: string) => id === state.activeImovel,
        [state.activeImovel]
    );

    // Cleanup function to reset context
    const reset = useCallback(() => {
        dispatch({ type: 'RESET' });
    }, []);

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
    }, [fetchImoveis, state.status, reset]); const value = useMemo(
        () => ({
            state,
            fetchImoveis,
            setActiveImovel,
            isActiveImovel,
            reset
        }),
        [state, fetchImoveis, setActiveImovel, isActiveImovel, reset]
    )

    return (
        <ImoveisDestaqueContext.Provider value={value}>
            {children}
        </ImoveisDestaqueContext.Provider>
    )
}

export function useImoveisDestaque() {
    const context = useContext(ImoveisDestaqueContext)

    if (context === undefined) {
        throw new Error('useImoveisDestaque deve ser usado dentro de um ImoveisDestaqueProvider')
    }

    return context
}