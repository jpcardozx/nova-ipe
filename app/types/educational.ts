// Tipos para o sistema educacional
export interface Article {
    id: string
    title: string
    subtitle: string
    category: string
    readTime: string
    difficulty: 'iniciante' | 'intermediario' | 'avancado'
    tags: string[]
    excerpt: string
    content: string
    author: string
    publishedAt: string
    updatedAt?: string
    featured?: boolean
    imageUrl?: string
}

export interface Category {
    id: string
    name: string
    description: string
    icon: string
    color: string
    articleCount: number
}

export interface EducationalStats {
    totalArticles: number
    totalReadTime: number
    completedArticles: number
    progress: number
}
