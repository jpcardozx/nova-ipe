import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'app/data/articles')

export function getSortedPostsData() {
  try {
    // Get file names under /articles
    const fileNames = fs.readdirSync(postsDirectory)
    const markdownFiles = fileNames.filter(name => name.endsWith('.md'))
    
    const allPostsData = markdownFiles.map(fileName => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '')

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents)

      // Combine the data with the id
      return {
        id,
        ...(matterResult.data as { [key: string]: any })
      }
    })
    
    // Sort posts by date
    return allPostsData.sort((a: any, b: any) => {
      if (a.publishedAt < b.publishedAt) {
        return 1
      } else {
        return -1
      }
    })
  } catch (error) {
    console.error('Erro ao carregar posts:', error)
    return []
  }
}

export function getAllPostIds() {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    const markdownFiles = fileNames.filter(name => name.endsWith('.md'))
    
    return markdownFiles.map(fileName => {
      return {
        params: {
          id: fileName.replace(/\.md$/, '')
        }
      }
    })
  } catch (error) {
    console.error('Erro ao carregar IDs dos posts:', error)
    return []
  }
}

export async function getPostData(id: string) {
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Post não encontrado: ${id}`)
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
      content: matterResult.content
    }
  } catch (error) {
    console.error(`Erro ao carregar post ${id}:`, error)
    throw error
  }
}