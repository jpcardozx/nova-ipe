import { getSortedPostsData } from '../lib/blog'
import Link from 'next/link'

interface PostData {
  id: string
  publishedAt: string
  title: string
}

export default function Blog() {
  const allPostsData = getSortedPostsData()

  return (
    <section>
      <h2>Blog</h2>
      <ul>
        {allPostsData.map((post: any) => (
          <li key={post.id}>
            <Link href={`/blog/${post.id}`}>
              {post.title}
            </Link>
            <br />
            <small>
              {post.publishedAt}
            </small>
          </li>
        ))}
      </ul>
    </section>
  )
}
