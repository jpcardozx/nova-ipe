// src/hooks/useImoveisDestaque.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { client } from '@lib/sanity/client';
import {
    queryImovelEmDestaque,
    queryImoveisParaVenda,
    queryImoveisParaAlugar
} from '@lib/queries';

/**
 * Hook personalizado para gerenciar imóveis em destaque
 * @param finalidade Finalidade dos imóveis ("Venda" | "Aluguel" | "Temporada")
 * @param carregarAutomaticamente Se deve carregar automaticamente quando visível
 * @returns Estado e funções para gerenciar imóveis em destaque
 */
export function useImoveisDestaque(
    finalidade = 'Venda',
    carregarAutomaticamente = true
) {
    // Estado para os imóveis
    const [imoveis, setImoveis] = useState([]);
    const [imovelAtivo, setImovelAtivo] = useState(null);
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [error, setError] = useState(null);

    // Hook para detecção de interseção (lazy loading)
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
        rootMargin: '200px'
    });

    // Busca imóveis em destaque 
    const fetchImoveisDestaque = useCallback(async () => {
        if (status === 'loading') return;

        try {
            setStatus('loading');

            // Seleciona a query adequada com base na finalidade
            let query;
            if (finalidade === 'Venda') {
                // Usando a query de imóveis em destaque, mas filtrando por finalidade
                query = `
          *[
            _type == "imovel" &&
            status == "disponivel" &&
            destaque == true &&
            finalidade == "Venda"
          ] | order(_createdAt desc)[0...8] {
            _id,
            titulo,
            slug,
            preco,
            finalidade,
            tipoImovel,
            bairro,
            cidade,
            descricao,
            dormitorios,
            banheiros,
            vagas,
            areaUtil,
            aceitaFinanciamento,
            destaque,
            categoria->{
              _id,
              "categoriaTitulo": titulo,
              "categoriaSlug": slug
            },
            imagem {
              "imagemUrl": asset->url,
              "alt": alt
            }
          }
        `;
            } else {
                // Usa a query existente
                query = queryImovelEmDestaque;
            }

            // Executa a query
            const resultado = await client.fetch(query);

            // Processa o resultado
            const imoveisNormalizados = resultado.map(imovel => ({
                ...imovel,
                // Normaliza campos para compatibilidade com componentes
                slug: imovel.slug?.current || imovel.slug,
                categoria: {
                    titulo: imovel.categoria?.categoriaTitulo,
                    slug: imovel.categoria?.categoriaSlug
                },
                imagemPrincipal: {
                    url: imovel.imagem?.imagemUrl,
                    alt: imovel.imagem?.alt
                }
            }));

            setImoveis(imoveisNormalizados);

            // Define o primeiro imóvel como ativo se existir
            if (imoveisNormalizados.length > 0) {
                setImovelAtivo(imoveisNormalizados[0]);
            }

            setStatus('success');
        } catch (err) {
            console.error('Erro ao buscar imóveis em destaque:', err);
            setError(err.message);
            setStatus('error');
        }
    }, [finalidade, status]);

    // Carrega os imóveis quando componente se torna visível, se configurado
    useEffect(() => {
        if (carregarAutomaticamente && inView && status === 'idle') {
            fetchImoveisDestaque();
        }
    }, [carregarAutomaticamente, inView, fetchImoveisDestaque, status]);

    // Seleciona um imóvel como ativo
    const selecionarImovel = useCallback((id) => {
        const imovel = imoveis.find(item => item._id === id);
        if (imovel) {
            setImovelAtivo(imovel);
        }
    }, [imoveis]);

    // Verifica se um imóvel está ativo
    const isImovelAtivo = useCallback((id) => {
        return imovelAtivo?._id === id;
    }, [imovelAtivo]);

    // Navega para o próximo imóvel
    const proximoImovel = useCallback(() => {
        if (!imoveis.length || !imovelAtivo) return;

        const indiceAtual = imoveis.findIndex(i => i._id === imovelAtivo._id);
        const proximoIndice = (indiceAtual + 1) % imoveis.length;
        setImovelAtivo(imoveis[proximoIndice]);
    }, [imoveis, imovelAtivo]);

    // Navega para o imóvel anterior
    const imovelAnterior = useCallback(() => {
        if (!imoveis.length || !imovelAtivo) return;

        const indiceAtual = imoveis.findIndex(i => i._id === imovelAtivo._id);
        const indiceAnterior = (indiceAtual - 1 + imoveis.length) % imoveis.length;
        setImovelAtivo(imoveis[indiceAnterior]);
    }, [imoveis, imovelAtivo]);

    // Calcula estatísticas dos imóveis
    const estatisticas = useMemo(() => {
        if (!imoveis.length) return null;

        // Calcular preço médio
        const precos = imoveis
            .filter(i => i.preco)
            .map(i => i.preco);

        const precoMedio = precos.length
            ? precos.reduce((sum, price) => sum + price, 0) / precos.length
            : 0;

        // Cidades únicas
        const cidadesMap = {};
        imoveis.forEach(i => {
            if (i.cidade) {
                cidadesMap[i.cidade] = (cidadesMap[i.cidade] || 0) + 1;
            }
        });

        const cidadesMaisComuns = Object.entries(cidadesMap)
            .sort((a, b) => b[1] - a[1])
            .map(([cidade]) => cidade)
            .slice(0, 3);

        return {
            total: imoveis.length,
            precoMedio,
            cidadesMaisComuns,
            precoMinimo: precos.length ? Math.min(...precos) : 0,
            precoMaximo: precos.length ? Math.max(...precos) : 0
        };
    }, [imoveis]);

    return {
        ref,
        imoveis,
        imovelAtivo,
        selecionarImovel,
        isImovelAtivo,
        proximoImovel,
        imovelAnterior,
        fetchImoveisDestaque,
        status,
        error,
        estatisticas
    };
}

/**
 * Hook para gerenciar favoritos
 */
export function useImoveisFavoritos() {
    const [favoritos, setFavoritos] = useState(() => {
        if (typeof window === 'undefined') return [];

        try {
            const saved = localStorage.getItem('imoveis-favoritos');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
            return [];
        }
    });

    // Adiciona um imóvel aos favoritos
    const adicionarFavorito = useCallback((id) => {
        setFavoritos(prev => {
            if (prev.includes(id)) return prev;

            const novos = [...prev, id];
            if (typeof window !== 'undefined') {
                localStorage.setItem('imoveis-favoritos', JSON.stringify(novos));
            }
            return novos;
        });
    }, []);

    // Remove um imóvel dos favoritos
    const removerFavorito = useCallback((id) => {
        setFavoritos(prev => {
            const novos = prev.filter(item => item !== id);
            if (typeof window !== 'undefined') {
                localStorage.setItem('imoveis-favoritos', JSON.stringify(novos));
            }
            return novos;
        });
    }, []);

    // Verifica se um imóvel está nos favoritos
    const isFavorito = useCallback((id) => {
        return favoritos.includes(id);
    }, [favoritos]);

    // Alterna o estado de favorito
    const toggleFavorito = useCallback((id) => {
        if (isFavorito(id)) {
            removerFavorito(id);
        } else {
            adicionarFavorito(id);
        }
    }, [isFavorito, removerFavorito, adicionarFavorito]);

    return {
        favoritos,
        isFavorito,
        toggleFavorito
    };
}