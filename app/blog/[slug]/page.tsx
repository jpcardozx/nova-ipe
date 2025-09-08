import { getAllPostIds, getPostData } from '../../../lib/blog'
import { MDXRemote } from 'next-mdx-remote'

interface PostData {
  title: string
  publishedAt: string
  content: any
}

interface PostProps {
  postData: PostData
}

export default function Post({ postData }: PostProps) {
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

interface StaticProps {
  params: {
    id: string
  }
}

export async function getStaticProps({ params }: StaticProps) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}