export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  date: string
  readTime: number
  featured?: boolean
}

export interface Category {
  id: string
  name: string
  description: string
  color: string
  icon: string
  articleCount: number
}