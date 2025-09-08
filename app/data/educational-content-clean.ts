import { Article, Category } from '@/app/types/educational'
import { articles } from './articles'

export const educationalCategories: Category[] = [
    {
        id: 'trafego-pago',
        name: 'Tráfego Pago',
        description: 'Estratégias fundamentais de marketing digital',
        icon: '🎯',
        color: 'blue',
        articleCount: articles.filter(a => a.category === 'trafego-pago').length
    },
    {
        id: 'aquisicao-clientes',
        name: 'Aquisição de Clientes',
        description: 'Técnicas para captar e converter leads',
        icon: '👥',
        color: 'green',
        articleCount: articles.filter(a => a.category === 'aquisicao-clientes').length
    },
    {
        id: 'vendas-imobiliario',
        name: 'Vendas Imobiliário',
        description: 'Estratégias específicas do setor imobiliário',
        icon: '🏠',
        color: 'purple',
        articleCount: articles.filter(a => a.category === 'vendas-imobiliario').length
    }
]

// Convert articles to the expected format and mark as featured
export const featuredArticles: Article[] = articles.filter(a => a.featured)

export const allArticles: Article[] = [
    ...articles,
    {
        id: 'instagram-para-corretores',
        title: 'Instagram para Corretores Iniciantes',
        subtitle: 'Como usar Stories e Posts para mostrar imóveis',
        category: 'trafego-pago',
        readTime: '8 min',
        difficulty: 'iniciante',
        tags: ['Instagram', 'Stories', 'Visual', 'Social Media'],
        excerpt: 'Guia básico para usar o Instagram de forma profissional, mostrando imóveis e atraindo clientes através de conteúdo visual.',
        imageUrl: '/images/instagram-para-corretores.jpg',
        featured: false,
        content: `
# Instagram para Corretores Iniciantes

## Por Que o Instagram Funciona Para Imóveis?

O Instagram é uma rede visual, perfeita para mostrar imóveis. As pessoas adoram ver fotos bonitas de casas e apartamentos, mesmo quando não estão procurando. É uma forma de "plantar a semente" do interesse.

## 1. Configurando Seu Perfil Profissional

### Mudando para Conta Comercial
1. Vá em Configurações
2. Escolha "Conta"
3. Selecione "Mudar para Conta Profissional"
4. Escolha "Empresa" como categoria

### Otimizando Seu Perfil
- **Nome de usuário**: @joao.corretor.sp (claro e profissional)
- **Nome**: João Silva | Corretor Imóveis SP
- **Bio**: "🏠 Apartamentos Zona Sul SP | 📱 WhatsApp no link | 🔑 Realizando sonhos há 5 anos"
- **Link**: Seu WhatsApp Business ou site
- **Foto**: Sua foto profissional sorrindo

## 2. Tipos de Conteúdo Que Funcionam

### Posts no Feed
- **Fotos de imóveis**: Uma foto linda por post
- **Carrosséis**: 3-5 fotos do mesmo imóvel
- **Infográficos**: Dicas sobre financiamento
- **Depoimentos**: Clientes com as chaves na mão
- **Bastidores**: Você trabalhando, visitando obras

### Stories (Desaparecem em 24h)
- **Tour rápido**: Vídeo de 15-30 segundos caminhando pelo imóvel
- **Enquetes**: "Qual vista preferem: mar ou cidade?"
- **Perguntas**: Responda dúvidas sobre mercado
- **Dicas rápidas**: "Como escolher um bom bairro"
- **Processo**: Mostrando documentação, visitas, etc.

## 3. Fotografando Imóveis Para Instagram

### Dicas Básicas
- **Luz natural**: Sempre que possível, abra janelas
- **Ângulos**: Posicione-se no canto para mostrar mais espaço
- **Limpeza**: Arrume o ambiente antes de fotografar
- **Detalhes**: Mostre acabamentos, vista, diferenciais
- **Pessoas**: Ocasionalmente inclua pessoas usando o espaço

### Editando no Próprio Instagram
- **Brilho**: Aumente levemente
- **Contraste**: Dá mais vivacidade
- **Saturação**: Cuidado para não exagerar
- **Filtros**: Use com moderação, prefira natural

### Apps Gratuitos Úteis
- **VSCO**: Para edição mais profissional
- **Canva**: Para criar infográficos
- **Unfold**: Templates para Stories
- **Reels**: Editor nativo do Instagram

## Conclusão Prática

O Instagram não vai te dar clientes imediatamente - ele constrói sua marca e autoridade ao longo do tempo. Seja consistente, autêntico e sempre útil.

O segredo não está em ter milhares de seguidores, mas em ter os seguidores certos - pessoas realmente interessadas em imóveis na sua região de atuação.

Comece aos poucos: um post por dia, responda todos os comentários e mensagens, e vá aprendendo com a prática. O Instagram premia consistência, não perfeição.
        `,
        author: 'Nova IPÊ Academy',
        publishedAt: '2024-09-03'
    }
]