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
export const featuredArticles: Article[] = articles
    .filter(a => a.featured)
    .map(article => ({
        ...article,
        difficulty: article.difficulty as 'iniciante' | 'intermediario' | 'avancado',
        author: 'Nova Ipe',
        publishedAt: '2024-01-15'
    }))

export const allArticles: Article[] = [
    ...articles.map(article => ({
        ...article,
        difficulty: article.difficulty as 'iniciante' | 'intermediario' | 'avancado',
        author: 'Nova Ipe',
        publishedAt: '2024-01-15'
    })),
    {
        id: 'instagram-para-corretores',
        title: 'Instagram para Corretores Iniciantes',
        subtitle: 'Como usar Stories e Posts para mostrar imóveis',
        category: 'trafego-pago',
        readTime: '8 min',
        difficulty: 'iniciante' as const,
        tags: ['Instagram', 'Stories', 'Visual', 'Social Media'],
        excerpt: 'Guia básico para usar o Instagram de forma profissional, mostrando imóveis e atraindo clientes através de conteúdo visual.',
        imageUrl: '/images/instagram-para-corretores.jpg',
        content: `Conteúdo completo sobre Instagram para corretores...`,
        author: 'Nova Ipe',
        publishedAt: '2024-01-10'
    }
]