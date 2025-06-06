// src/hooks/useImoveis.ts

'use client';

import { useState, useEffect, useCallback } from 'react';
import { sanityClient } from '@/lib/sanity';
import type { ImovelProjetado } from '../types/imovel-client';

interface UseImoveisState {
    data: ImovelProjetado[];
    status: 'idle' | 'loading' | 'error' | 'success';
    error?: Error;
}

export function useImoveis() {
    const [state, setState] = useState<UseImoveisState>({
        data: [],
        status: 'idle'
    });

    const fetchImoveis = useCallback(async () => {
        setState(s => ({ ...s, status: 'loading' }));
        try {
            const query = `
        *[_type == "imovel" && status == "disponivel"]
        | order(_createdAt desc) {
          ..., 
          // aqui recriamos o objeto slug com o formato exato que seu tipo espera:
          slug: {
            _type: "slug",
            current: slug.current
          },

          // você pode fazer o mesmo em categoria, imagem etc:
          categoria->{
            _type,           // se precisar
            titulo,
            slug
          },
          imagem{
            asset->{url},
            alt
          }
        }
      `;

            const resultado: ImovelProjetado[] = await sanityClient.fetch(query);

            setState({ data: resultado, status: 'success' });
        } catch (err) {
            setState({
                data: [],
                status: 'error',
                error: err instanceof Error ? err : new Error(String(err))
            });
        }
    }, []);

    useEffect(() => {
        fetchImoveis();
    }, [fetchImoveis]);

    return state;
}
