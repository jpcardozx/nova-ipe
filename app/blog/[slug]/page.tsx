import { getPostData } from '../../../lib/blog'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function Post({ params }: PageProps) {
  const { slug } = await params
  const postData = await getPostData(slug) as any

  return (
    <article>
      <h1>{postData.title || 'Post'}</h1>
      <div>
        {postData.publishedAt || postData.date}
      </div>
      <div>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{postData.content}</pre>
      </div>
    </article>
  )
}