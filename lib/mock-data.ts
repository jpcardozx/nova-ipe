// Dados mockados para desenvolvimento
export const mockImoveisDestaque = [
    {
        _id: 'mock-destaque-1',
        titulo: 'Casa de luxo em condomínio - MOCK',
        slug: { current: 'casa-luxo-condominio' },
        preco: 1250000,
        finalidade: 'Venda',
        tipoImovel: 'Casa',
        bairro: 'Condomínio Jardins',
        cidade: 'Guararema',
        dormitorios: 4,
        banheiros: 3,
        areaUtil: 280,
        vagas: 4,
        destaque: true,
        imagem: {
            _type: 'image',
            alt: 'Casa de luxo em condomínio fechado',
            asset: {
                _ref: 'image-123',
                url: '/placeholder-casa-luxo.jpg'
            }
        }
    },
    {
        _id: 'mock-destaque-2',
        titulo: 'Apartamento moderno - MOCK',
        slug: { current: 'apartamento-moderno' },
        preco: 650000,
        finalidade: 'Venda',
        tipoImovel: 'Apartamento',
        bairro: 'Centro',
        cidade: 'Guararema',
        dormitorios: 2,
        banheiros: 2,
        areaUtil: 85,
        vagas: 1,
        destaque: true,
        imagem: {
            _type: 'image',
            alt: 'Apartamento moderno no centro',
            asset: {
                _ref: 'image-456',
                url: '/placeholder-apto-moderno.jpg'
            }
        }
    },
    {
        _id: 'mock-destaque-3',
        titulo: 'Chácara próxima ao rio - MOCK',
        slug: { current: 'chacara-proxima-rio' },
        preco: 890000,
        finalidade: 'Venda',
        tipoImovel: 'Chácara',
        bairro: 'Várzea',
        cidade: 'Guararema',
        dormitorios: 3,
        banheiros: 2,
        areaUtil: 5000,
        vagas: 4,
        destaque: true,
        imagem: {
            _type: 'image',
            alt: 'Chácara com vista para o rio',
            asset: {
                _ref: 'image-789',
                url: '/placeholder-chacara-rio.jpg'
            }
        }
    }
];

export const mockImoveisAluguel = [
    {
        _id: 'mock-aluguel-1',
        titulo: 'Casa para temporada - MOCK',
        slug: { current: 'casa-temporada' },
        preco: 3500,
        finalidade: 'Aluguel',
        tipoImovel: 'Casa',
        bairro: 'Lago Azul',
        cidade: 'Guararema',
        dormitorios: 3,
        banheiros: 2,
        areaUtil: 150,
        vagas: 2,
        destaque: false,
        imagem: {
            _type: 'image',
            alt: 'Casa para temporada próxima ao lago',
            asset: {
                _ref: 'image-abc',
                url: '/placeholder-casa-temporada.jpg'
            }
        }
    },
    {
        _id: 'mock-aluguel-2',
        titulo: 'Apartamento central - MOCK',
        slug: { current: 'apto-central' },
        preco: 2200,
        finalidade: 'Aluguel',
        tipoImovel: 'Apartamento',
        bairro: 'Centro',
        cidade: 'Guararema',
        dormitorios: 2,
        banheiros: 1,
        areaUtil: 70,
        vagas: 1,
        destaque: false,
        imagem: {
            _type: 'image',
            alt: 'Apartamento no centro da cidade',
            asset: {
                _ref: 'image-def',
                url: '/placeholder-apto-central.jpg'
            }
        }
    },
    {
        _id: 'mock-aluguel-3',
        titulo: 'Sala comercial - MOCK',
        slug: { current: 'sala-comercial' },
        preco: 1800,
        finalidade: 'Aluguel',
        tipoImovel: 'Comercial',
        bairro: 'Centro',
        cidade: 'Guararema',
        dormitorios: 0,
        banheiros: 1,
        areaUtil: 45,
        vagas: 1,
        destaque: false,
        imagem: {
            _type: 'image',
            alt: 'Sala comercial no centro',
            asset: {
                _ref: 'image-ghi',
                url: '/placeholder-sala-comercial.jpg'
            }
        }
    }
];
