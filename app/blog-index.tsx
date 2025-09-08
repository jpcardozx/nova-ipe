import { getSortedPostsData } from '../lib/blog'
import Link from 'next/link'

export default function BlogIndex({ allPostsData }) {
  return (
    <section>
      <h2>Blog</h2>
      <ul>
        {allPostsData.map(({ id, publishedAt, title }) => (
          <li key={id}>
            <Link href={`/blog/${id}`}>
              <a>{title}</a>
            </Link>
            <br />
            <small>
              {publishedAt}
            </small>
          </li>
        ))}
      </ul>
    </section>
  )
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}
