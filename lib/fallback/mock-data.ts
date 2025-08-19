// lib/fallback/mock-data.ts
import type { ImovelClient } from '../../src/types/imovel-client';

export const fallbackImoveisVenda: ImovelClient[] = [
    {
        _id: 'fallback-1',
        titulo: 'Casa Moderna em Guararema',
        slug: 'casa-moderna-guararema-1',
        preco: 850000,
        finalidade: 'Venda',
        tipoImovel: 'Casa',
        destaque: true,
        bairro: 'Centro',
        cidade: 'Guararema',
        estado: 'SP',
        descricao: 'Bela casa moderna com acabamento de primeira qualidade.',
        dormitorios: 3,
        banheiros: 2,
        areaUtil: 180,
        vagas: 2,
        aceitaFinanciamento: true,
        documentacaoOk: true,
        caracteristicas: ['Jardim', 'Área Gourmet', 'Piscina'],
        possuiJardim: true,
        possuiPiscina: true,
        imagem: {
            imagemUrl: '/images/property-placeholder-1.jpg',
            alt: 'Casa Moderna em Guararema'
        },
        categoria: {
            _id: 'cat-casa',
            titulo: 'Casas',
            slug: 'casas'
        },
        status: 'disponivel'
    },
    {
        _id: 'fallback-2',
        titulo: 'Apartamento no Centro de Guararema',
        slug: 'apartamento-centro-guararema-2',
        preco: 450000,
        finalidade: 'Venda',
        tipoImovel: 'Apartamento',
        destaque: true,
        bairro: 'Centro',
        cidade: 'Guararema',
        estado: 'SP',
        descricao: 'Apartamento completo em localização privilegiada.',
        dormitorios: 2,
        banheiros: 1,
        areaUtil: 85,
        vagas: 1,
        aceitaFinanciamento: true,
        documentacaoOk: true,
        caracteristicas: ['Portaria 24h', 'Elevador', 'Playground'],
        possuiJardim: false,
        possuiPiscina: false,
        imagem: {
            imagemUrl: '/images/property-placeholder-2.jpg',
            alt: 'Apartamento no Centro de Guararema'
        },
        categoria: {
            _id: 'cat-apartamento',
            titulo: 'Apartamentos',
            slug: 'apartamentos'
        },
        status: 'disponivel'
    },
    {
        _id: 'fallback-3',
        titulo: 'Terreno Comercial Guararema',
        slug: 'terreno-comercial-guararema-3',
        preco: 320000,
        finalidade: 'Venda',
        tipoImovel: 'Terreno',
        destaque: true,
        bairro: 'Vila Galvão',
        cidade: 'Guararema',
        estado: 'SP',
        descricao: 'Excelente terreno para investimento comercial.',
        dormitorios: 0,
        banheiros: 0,
        areaUtil: 500,
        vagas: 0,
        aceitaFinanciamento: true,
        documentacaoOk: true,
        caracteristicas: ['Esquina', 'Comercial', 'Documentação em dia'],
        possuiJardim: false,
        possuiPiscina: false,
        imagem: {
            imagemUrl: '/images/property-placeholder-3.jpg',
            alt: 'Terreno Comercial Guararema'
        },
        categoria: {
            _id: 'cat-terreno',
            titulo: 'Terrenos',
            slug: 'terrenos'
        },
        status: 'disponivel'
    }
];

export const fallbackImoveisAluguel: ImovelClient[] = [
    {
        _id: 'fallback-aluguel-1',
        titulo: 'Casa para Locação no Centro',
        slug: 'casa-locacao-centro-1',
        preco: 2500,
        finalidade: 'Aluguel',
        tipoImovel: 'Casa',
        destaque: false,
        bairro: 'Centro',
        cidade: 'Guararema',
        estado: 'SP',
        descricao: 'Casa ampla para locação com ótima localização.',
        dormitorios: 3,
        banheiros: 2,
        areaUtil: 160,
        vagas: 2,
        aceitaFinanciamento: false,
        documentacaoOk: true,
        caracteristicas: ['Quintal', 'Garagem Coberta'],
        possuiJardim: true,
        possuiPiscina: false,
        imagem: {
            imagemUrl: '/images/property-placeholder-4.jpg',
            alt: 'Casa para Locação no Centro'
        },
        categoria: {
            _id: 'cat-casa',
            titulo: 'Casas',
            slug: 'casas'
        },
        status: 'disponivel'
    },
    {
        _id: 'fallback-aluguel-2',
        titulo: 'Apartamento para Aluguel',
        slug: 'apartamento-aluguel-2',
        preco: 1800,
        finalidade: 'Aluguel',
        tipoImovel: 'Apartamento',
        destaque: false,
        bairro: 'Jardim Esperança',
        cidade: 'Guararema',
        estado: 'SP',
        descricao: 'Apartamento mobiliado para locação.',
        dormitorios: 2,
        banheiros: 1,
        areaUtil: 70,
        vagas: 1,
        aceitaFinanciamento: false,
        documentacaoOk: true,
        caracteristicas: ['Mobiliado', 'Portaria'],
        possuiJardim: false,
        possuiPiscina: false,
        imagem: {
            imagemUrl: '/images/property-placeholder-5.jpg',
            alt: 'Apartamento para Aluguel'
        },
        categoria: {
            _id: 'cat-apartamento',
            titulo: 'Apartamentos',
            slug: 'apartamentos'
        },
        status: 'disponivel'
    }
];

export const fallbackMessage = '🔧 Exibindo dados de demonstração. Conectividade com o servidor será restabelecida em breve.';
