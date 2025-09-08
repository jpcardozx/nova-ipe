import { getAllPostIds, getPostData } from '../../../lib/blog'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

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
  content: string
}

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Gera parâmetros estáticos para todas as páginas de blog
export async function generateStaticParams() {
  try {
    const paths = getAllPostIds()
    return paths.map((path) => ({
      slug: path.params.id
    }))
  } catch (error) {
    console.error('Erro ao gerar parâmetros estáticos:', error)
    return []
  }
}

// Gera metadados dinâmicos para SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const rawPostData = await getPostData(slug)
    const postData = rawPostData as PostData

    return {
      title: postData.title || 'Artigo - Ipê Imóveis',
      description: postData.excerpt || `Leia o artigo: ${postData.title}`,
      openGraph: {
        title: postData.title || 'Artigo - Ipê Imóveis',
        description: postData.excerpt || `Leia o artigo: ${postData.title}`,
        type: 'article',
        publishedTime: postData.publishedAt,
        authors: [postData.author || 'Ipê Imóveis'],
        images: postData.imageUrl ? [{ url: postData.imageUrl }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: postData.title || 'Artigo - Ipê Imóveis',
        description: postData.excerpt || `Leia o artigo: ${postData.title}`,
        images: postData.imageUrl ? [postData.imageUrl] : undefined,
      }
    }
  } catch (error) {
    return {
      title: 'Artigo não encontrado',
      description: 'O artigo solicitado não foi encontrado.'
    }
  }
}

export default async function Post({ params }: PageProps) {
  try {
    const { slug } = await params
    const rawPostData = await getPostData(slug)
    const postData = rawPostData as PostData

    if (!postData) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header do artigo */}
            <header className="px-6 py-8 border-b border-gray-100">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {postData.title || 'Título não disponível'}
                </h1>

                {postData.subtitle && (
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {postData.subtitle}
                  </p>
                )}

                {postData.excerpt && (
                  <p className="text-lg text-gray-500 mb-6 leading-relaxed">
                    {postData.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 flex-wrap">
                  {postData.publishedAt && (
                    <time dateTime={postData.publishedAt}>
                      {new Date(postData.publishedAt).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  )}

                  {postData.author && (
                    <>
                      <span>•</span>
                      <span>Por {postData.author}</span>
                    </>
                  )}

                  {postData.readTime && (
                    <>
                      <span>•</span>
                      <span>{postData.readTime} de leitura</span>
                    </>
                  )}

                  {postData.difficulty && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{postData.difficulty}</span>
                    </>
                  )}
                </div>
              </div>
            </header>

            {/* Imagem de destaque */}
            {postData.imageUrl && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={postData.imageUrl}
                  alt={postData.title || 'Imagem do artigo'}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Conteúdo do artigo */}
            <div className="px-6 py-8">
              <div className="prose prose-lg prose-blue max-w-none">
                <div dangerouslySetInnerHTML={{ __html: postData.content }} />
              </div>
            </div>

            {/* Footer do artigo */}
            <footer className="px-6 py-6 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="text-sm text-gray-500">
                  {postData.publishedAt && (
                    <>Publicado em {new Date(postData.publishedAt).toLocaleDateString('pt-BR')}</>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {postData.tags && postData.tags.length > 0 && (
                    <div className="flex items-center space-x-2 flex-wrap">
                      {postData.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </footer>
          </article>

          {/* Navegação de volta */}
          <div className="mt-8 text-center">
            <a
              href="/blog"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              ← Voltar ao Blog
            </a>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Erro ao carregar post:', error)
    notFound()
  }
}