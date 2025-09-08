import { getSortedPostsData } from '../../lib/blog'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Ipê Imóveis',
  description: 'Artigos e conteúdos educativos sobre o mercado imobiliário, estratégias de marketing e dicas para corretores.',
  openGraph: {
    title: 'Blog - Ipê Imóveis',
    description: 'Artigos e conteúdos educativos sobre o mercado imobiliário, estratégias de marketing e dicas para corretores.',
    type: 'website',
  },
}

interface PostData {
  id: string
  title?: string
  subtitle?: string
  category?: string
  readTime?: string
  difficulty?: string
  tags?: string[]
  excerpt?: string
  imageUrl?: string
  author?: string
  publishedAt?: string
  featured?: boolean
}

export default async function Blog() {
  const allPostsData = getSortedPostsData() as PostData[]

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'basico':
        return 'bg-green-100 text-green-800'
      case 'intermediario':
        return 'bg-yellow-100 text-yellow-800'
      case 'avancado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'estrategico':
        return 'bg-blue-100 text-blue-800'
      case 'operacional':
        return 'bg-purple-100 text-purple-800'
      case 'tecnico':
        return 'bg-indigo-100 text-indigo-800'
      case 'marketing':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog Ipê Imóveis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conteúdos educativos, estratégias de marketing e insights do mercado imobiliário
            para acelerar o crescimento da sua carreira.
          </p>
        </div>

        {/* Posts Featured */}
        {allPostsData.some(post => post.featured) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Artigos em Destaque</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {allPostsData
                .filter(post => post.featured)
                .slice(0, 2)
                .map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {post.imageUrl && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.imageUrl}
                          alt={post.title || 'Imagem do artigo'}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        {post.category && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getCategoryColor(post.category)}`}>
                            {post.category}
                          </span>
                        )}
                        {post.difficulty && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getDifficultyColor(post.difficulty)}`}>
                            {post.difficulty}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        <Link href={`/blog/${post.id}`}>
                          {post.title || 'Título não disponível'}
                        </Link>
                      </h3>

                      {post.subtitle && (
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {post.subtitle}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          {post.publishedAt && (
                            <time dateTime={post.publishedAt}>
                              {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                            </time>
                          )}
                          {post.readTime && (
                            <span>{post.readTime}</span>
                          )}
                        </div>
                        <span className="text-blue-600 hover:text-blue-800 font-medium">
                          Ler mais →
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Todos os Artigos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPostsData.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {post.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title || 'Imagem do artigo'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    {post.category && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    )}
                    {post.difficulty && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getDifficultyColor(post.difficulty)}`}>
                        {post.difficulty}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.id}`}>
                      {post.title || 'Título não disponível'}
                    </Link>
                  </h3>

                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      {post.publishedAt && (
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short'
                          })}
                        </time>
                      )}
                      {post.readTime && (
                        <span>{post.readTime}</span>
                      )}
                    </div>
                    <span className="text-blue-600 hover:text-blue-800 font-medium">
                      →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-blue-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Quer mais conteúdos como estes?
            </h2>
            <p className="text-blue-100 mb-6">
              Receba semanalmente artigos exclusivos e insights do mercado imobiliário.
            </p>
            <Link
              href="/contato"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Entre em contato
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}