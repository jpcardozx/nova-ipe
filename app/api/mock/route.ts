import { NextResponse } from 'next/server';

// Helper to create consistent image objects
const createImage = (url: string, alt: string) => {
    console.log(`Creating image object for URL: ${url}`);
    return {
        url,
        imagemUrl: url, // For backward compatibility
        alt
    };
};

console.log('Mock API module loaded');

// Mock imoveis data with consistent image format
const mockImoveis = [
    {
        _id: '1',
        titulo: 'Casa de Luxo em Guararema',
        slug: 'casa-de-luxo-em-guararema',
        preco: 1500000,
        finalidade: 'Venda',
        bairro: 'Centro',
        cidade: 'Guararema',
        destaque: true,
        dormitorios: 4,
        banheiros: 3,
        vagas: 2,
        areaUtil: 250,
        imagem: createImage('/images/hero-bg.jpg', 'Casa de Luxo'),
        categoria: {
            titulo: 'Casa',
            slug: 'casa'
        }
    },
    {
        _id: '2',
        titulo: 'Apartamento Moderno com Vista',
        slug: 'apartamento-moderno-com-vista',
        preco: 850000,
        finalidade: 'Venda',
        bairro: 'Itapema',
        cidade: 'Guararema',
        destaque: true,
        dormitorios: 3,
        banheiros: 2,
        vagas: 1,
        areaUtil: 120,
        imagem: createImage('/images/hero-bg.jpg', 'Apartamento Moderno'),
        categoria: {
            titulo: 'Apartamento',
            slug: 'apartamento'
        }
    },
    {
        _id: '3',
        titulo: 'Chácara com Piscina e Área Verde',
        slug: 'chacara-com-piscina',
        preco: 2200000,
        finalidade: 'Venda',
        bairro: 'Rural',
        cidade: 'Guararema',
        destaque: true,
        dormitorios: 5,
        banheiros: 4,
        vagas: 4,
        areaUtil: 5000,
        imagem: createImage('/images/hero-bg.jpg', 'Chácara'),
        categoria: {
            titulo: 'Chácara',
            slug: 'chacara'
        }
    },
    {
        _id: '4',
        titulo: 'Casa para Aluguel em Condomínio',
        slug: 'casa-para-aluguel-condominio',
        preco: 2500,
        finalidade: 'Aluguel',
        bairro: 'Condomínio Verde',
        cidade: 'Guararema',
        destaque: true,
        dormitorios: 3,
        banheiros: 2,
        vagas: 2,
        areaUtil: 150,
        imagem: createImage('/images/hero-bg.jpg', 'Casa para Aluguel'),
        categoria: {
            titulo: 'Casa',
            slug: 'casa'
        }
    }
];

export async function GET() {
    console.log('Mock API GET handler called');

    try {
        console.log(`Returning ${mockImoveis.length} mock imoveis`);

        return NextResponse.json(mockImoveis, {
            status: 200,
            headers: {
                'Cache-Control': 'public, max-age=3600',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        console.error('Error in mock API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 
