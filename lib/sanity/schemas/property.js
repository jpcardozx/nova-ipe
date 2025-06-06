export default {
    name: 'property',
    title: 'Propriedades',
    type: 'document',
    groups: [
        {
            name: 'basicInfo',
            title: 'Informações básicas',
        },
        {
            name: 'details',
            title: 'Detalhes',
        },
        {
            name: 'media',
            title: 'Mídia',
        },
        {
            name: 'features',
            title: 'Características',
        },
        {
            name: 'premium',
            title: 'Conteúdo Premium',
        },
    ],
    fields: [
        {
            name: 'title',
            title: 'Título',
            type: 'string',
            validation: (Rule) => Rule.required(),
            group: 'basicInfo',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
            group: 'basicInfo',
        },
        {
            name: 'description',
            title: 'Descrição',
            type: 'text',
            rows: 3,
            group: 'basicInfo',
        },
        {
            name: 'propertyType',
            title: 'Tipo de oferta',
            type: 'string',
            options: {
                list: [
                    { title: 'Venda', value: 'sale' },
                    { title: 'Aluguel', value: 'rent' },
                ],
            },
            validation: (Rule) => Rule.required(),
            group: 'basicInfo',
        },
        {
            name: 'price',
            title: 'Preço',
            type: 'number',
            validation: (Rule) => Rule.required(),
            group: 'basicInfo',
        },
        {
            name: 'featured',
            title: 'Destacado',
            type: 'boolean',
            description: 'Marque para exibir na seção de destaque',
            group: 'basicInfo',
        },
        {
            name: 'isPremium',
            title: 'Premium',
            type: 'boolean',
            description: 'Marque para destacar como imóvel premium',
            group: 'basicInfo',
        },
        {
            name: 'isHighlight',
            title: 'Super destaque',
            type: 'boolean',
            description: 'Marque para dar maior destaque visual na listagem',
            group: 'basicInfo',
        },
        {
            name: 'isNew',
            title: 'Lançamento',
            type: 'boolean',
            description: 'Marque para listar como lançamento',
            group: 'basicInfo',
        },
        {
            name: 'location',
            title: 'Bairro',
            type: 'string',
            group: 'details',
        },
        {
            name: 'address',
            title: 'Endereço completo',
            type: 'string',
            group: 'details',
        },
        {
            name: 'city',
            title: 'Cidade',
            type: 'string',
            group: 'details',
        },
        {
            name: 'area',
            title: 'Área (m²)',
            type: 'number',
            group: 'details',
        },
        {
            name: 'bedrooms',
            title: 'Dormitórios',
            type: 'number',
            group: 'details',
        },
        {
            name: 'bathrooms',
            title: 'Banheiros',
            type: 'number',
            group: 'details',
        },
        {
            name: 'parkingSpots',
            title: 'Vagas de garagem',
            type: 'number',
            group: 'details',
        },
        {
            name: 'mainImage',
            title: 'Imagem principal',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Texto alternativo',
                },
            ],
            validation: (Rule) => Rule.required(),
            group: 'media',
        },
        {
            name: 'images',
            title: 'Galeria de imagens',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: {
                        hotspot: true,
                    },
                    fields: [
                        {
                            name: 'alt',
                            type: 'string',
                            title: 'Texto alternativo',
                        },
                    ],
                },
            ],
            group: 'media',
        },
        {
            name: 'features',
            title: 'Características',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'category',
                            title: 'Categoria',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Características', value: 'features' },
                                    { title: 'Sustentabilidade', value: 'sustainability' },
                                    { title: 'Localização', value: 'location' },
                                    { title: 'Segurança', value: 'security' },
                                    { title: 'Lazer', value: 'leisure' },
                                ],
                            },
                        },
                        {
                            name: 'items',
                            title: 'Itens',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    fields: [
                                        {
                                            name: 'name',
                                            title: 'Nome',
                                            type: 'string',
                                        },
                                        {
                                            name: 'highlight',
                                            title: 'Destaque',
                                            type: 'boolean',
                                        },
                                        {
                                            name: 'premium',
                                            title: 'Premium',
                                            type: 'boolean',
                                        },
                                    ],
                                    preview: {
                                        select: {
                                            title: 'name',
                                            subtitle: 'highlight',
                                        },
                                        prepare({ title, subtitle }) {
                                            return {
                                                title,
                                                subtitle: subtitle ? '⭐ Destaque' : '',
                                            };
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                    preview: {
                        select: {
                            title: 'category',
                            items: 'items',
                        },
                        prepare({ title, items }) {
                            const itemCount = items?.length || 0;
                            return {
                                title: title === 'features'
                                    ? 'Características'
                                    : title === 'sustainability'
                                        ? 'Sustentabilidade'
                                        : title === 'location'
                                            ? 'Localização'
                                            : title === 'security'
                                                ? 'Segurança'
                                                : title === 'leisure'
                                                    ? 'Lazer'
                                                    : title,
                                subtitle: `${itemCount} item${itemCount === 1 ? '' : 's'}`,
                            };
                        },
                    },
                },
            ],
            group: 'features',
        },
        {
            name: 'has3DModel',
            title: 'Possui modelo 3D?',
            type: 'boolean',
            description: 'Ative para disponibilizar visualização 3D do imóvel',
            group: 'premium',
        },
        {
            name: 'modelUrl',
            title: 'URL do Modelo 3D',
            type: 'url',
            description: 'Link para o modelo 3D no formato GLTF/GLB',
            hidden: ({ document }) => !document?.has3DModel,
            group: 'premium',
        },
        {
            name: 'modelScale',
            title: 'Escala do modelo',
            type: 'number',
            description: 'Valor para ajuste de escala do modelo 3D',
            hidden: ({ document }) => !document?.has3DModel,
            group: 'premium',
        },
        {
            name: 'hasVirtualTour',
            title: 'Possui tour virtual?',
            type: 'boolean',
            description: 'Ative para disponibilizar tour virtual 360°',
            group: 'premium',
        },
        {
            name: 'virtualTour',
            title: 'Tour Virtual',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'title',
                            title: 'Título da cena',
                            type: 'string',
                        },
                        {
                            name: 'image',
                            title: 'Imagem panorâmica 360°',
                            type: 'image',
                            options: { hotspot: true },
                        },
                        {
                            name: 'infoText',
                            title: 'Texto informativo',
                            type: 'text',
                            rows: 2,
                        },
                        {
                            name: 'hotspots',
                            title: 'Pontos interativos',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    fields: [
                                        {
                                            name: 'id',
                                            title: 'ID',
                                            type: 'string',
                                        },
                                        {
                                            name: 'type',
                                            title: 'Tipo',
                                            type: 'string',
                                            options: {
                                                list: [
                                                    { title: 'Informação', value: 'info' },
                                                    { title: 'Link para cena', value: 'scene' },
                                                    { title: 'Personalizado', value: 'custom' },
                                                ],
                                            },
                                        },
                                        {
                                            name: 'pitch',
                                            title: 'Pitch',
                                            type: 'number',
                                            description: 'Posição vertical (-90 a 90)',
                                        },
                                        {
                                            name: 'yaw',
                                            title: 'Yaw',
                                            type: 'number',
                                            description: 'Posição horizontal (-180 a 180)',
                                        },
                                        {
                                            name: 'text',
                                            title: 'Texto',
                                            type: 'string',
                                        },
                                        {
                                            name: 'targetScene',
                                            title: 'ID da cena destino',
                                            type: 'string',
                                            hidden: ({ parent }) => parent?.type !== 'scene',
                                        },
                                    ],
                                    preview: {
                                        select: {
                                            title: 'text',
                                            type: 'type',
                                        },
                                        prepare({ title, type }) {
                                            const types = {
                                                info: '🔍 Info',
                                                scene: '🚪 Navegação',
                                                custom: '✨ Personalizado',
                                            };
                                            return {
                                                title: title || 'Hotspot sem título',
                                                subtitle: types[type] || type,
                                            };
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            media: 'image',
                        },
                    },
                },
            ],
            hidden: ({ document }) => !document?.hasVirtualTour,
            group: 'premium',
        },
        {
            name: 'publishedAt',
            title: 'Data de publicação',
            type: 'datetime',
            group: 'basicInfo',
        },
    ],
    preview: {
        select: {
            title: 'title',
            media: 'mainImage',
            price: 'price',
            propertyType: 'propertyType',
        },
        prepare({ title, media, price, propertyType }) {
            const formattedPrice = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(price);

            return {
                title,
                subtitle: `${propertyType === 'sale' ? 'Venda' : 'Aluguel'} - ${formattedPrice}`,
                media,
            };
        },
    },
}; 