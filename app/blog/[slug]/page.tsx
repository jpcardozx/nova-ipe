import { getAllPostIds, getPostData } from '../../../lib/blog'
import { MDXRemote } from 'next-mdx-remote'

export default function Post({ postData }) {
  return (
    <article>
      <h1>{postData.title}</h1>
      <div>
        {postData.publishedAt}
      </div>
      <MDXRemote {...postData.content} />
    </article>
  )
}

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}