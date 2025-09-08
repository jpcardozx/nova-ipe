import { getPostData } from '../../../lib/blog'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function Post({ params }: PageProps) {
  const postData = await getPostData(params.slug) as any

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