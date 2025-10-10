/**
 * Cloudflare R2 Storage Service
 * Gerencia upload/download de fotos no R2
 * Custo: $0.015/GB (30% mais barato que Supabase) + Zero egress!
 */

import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Lazy initialization do R2 Client (só cria quando necessário)
let r2Client: S3Client | null = null

function getR2Client(): S3Client {
  if (!r2Client) {
    r2Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!.trim(),
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!.trim(),
      },
    })
  }
  return r2Client
}

const R2_BUCKET = process.env.R2_BUCKET_NAME || 'wpl-realty'
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://c5aff409f2452f34ccab6276da473130.r2.cloudflarestorage.com/wpl-realty'

export class CloudflareR2Service {
  /**
   * Upload de arquivo para R2
   * Path: wordpress-photos/{wp_id}/img_foto01.jpg
   */
  static async uploadFile(
    file: File | Buffer,
    path: string,
    contentType?: string
  ): Promise<string> {
    const buffer = file instanceof File
      ? Buffer.from(await file.arrayBuffer())
      : file

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: path,
      Body: buffer,
      ContentType: contentType || 'image/jpeg',
      CacheControl: 'public, max-age=31536000', // 1 ano
    })

    await getR2Client().send(command)

    // Retorna URL pública (R2 não cobra egress!)
    return `${R2_PUBLIC_URL}/${path}`
  }

  /**
   * Upload de múltiplas fotos de uma property
   * Retorna array de URLs públicas
   */
  static async uploadPropertyPhotos(
    wpId: number,
    photos: File[] | Buffer[],
    onProgress?: (current: number, total: number) => void
  ): Promise<string[]> {
    const uploadedUrls: string[] = []

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i]
      const fileName = photo instanceof File ? photo.name : `img_foto${String(i + 1).padStart(2, '0')}.jpg`
      const path = `wordpress-photos/${wpId}/${fileName}`

      try {
        const url = await this.uploadFile(photo, path)
        uploadedUrls.push(url)
        onProgress?.(i + 1, photos.length)
      } catch (error) {
        console.error(`Failed to upload ${fileName}:`, error)
      }
    }

    return uploadedUrls
  }

  /**
   * Download de arquivo do R2
   * Útil para migração Supabase → Sanity
   */
  static async downloadFile(path: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: path,
    })

    const response = await getR2Client().send(command)
    const chunks: Uint8Array[] = []

    if (response.Body) {
      // @ts-ignore - Body é ReadableStream no Node
      for await (const chunk of response.Body) {
        chunks.push(chunk)
      }
    }

    return Buffer.concat(chunks)
  }

  /**
   * Gera URL assinada temporária (privada, expira em X segundos)
   * Útil para dashboard privado sem expor URLs públicas
   */
  static async getSignedUrl(path: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: path,
    })

    return await getSignedUrl(getR2Client(), command, { expiresIn })
  }

  /**
   * Lista fotos de uma property
   */
  static async listPropertyPhotos(wpId: number): Promise<string[]> {
    const prefix = `wordpress-photos/${wpId}/`

    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      Prefix: prefix,
    })

    const response = await getR2Client().send(command)
    
    if (!response.Contents) return []

    return response.Contents
      .filter(item => item.Key)
      .map(item => `${R2_PUBLIC_URL}/${item.Key}`)
  }

  /**
   * Delete de arquivo
   */
  static async deleteFile(path: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: path,
    })

    await getR2Client().send(command)
  }

  /**
   * Delete de todas as fotos de uma property
   */
  static async deletePropertyPhotos(wpId: number): Promise<void> {
    const prefix = `wordpress-photos/${wpId}/`

    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      Prefix: prefix,
    })

    const response = await getR2Client().send(command)
    
    if (!response.Contents) return

    for (const item of response.Contents) {
      if (item.Key) {
        await this.deleteFile(item.Key)
      }
    }
  }

  /**
   * Migra fotos do Lightsail para R2
   * Baixa do Lightsail via URL e upload para R2
   */
  static async migrateFromLightsail(
    wpId: number,
    lightsailUrls: string[],
    onProgress?: (current: number, total: number) => void
  ): Promise<string[]> {
    const uploadedUrls: string[] = []

    for (let i = 0; i < lightsailUrls.length; i++) {
      const url = lightsailUrls[i]
      
      try {
        // Download do Lightsail
        const response = await fetch(url)
        if (!response.ok) {
          console.error(`Failed to download ${url}: ${response.statusText}`)
          continue
        }

        const buffer = Buffer.from(await response.arrayBuffer())
        
        // Extract filename ou usa numeração
        const fileName = url.split('/').pop() || `img_foto${String(i + 1).padStart(2, '0')}.jpg`
        const path = `wordpress-photos/${wpId}/${fileName}`

        // Upload para R2
        const r2Url = await this.uploadFile(buffer, path, response.headers.get('content-type') || 'image/jpeg')
        uploadedUrls.push(r2Url)
        
        onProgress?.(i + 1, lightsailUrls.length)
      } catch (error) {
        console.error(`Failed to migrate ${url}:`, error)
      }
    }

    return uploadedUrls
  }

  /**
   * Obtém stats de uso do bucket
   * R2 não cobra egress, mas é bom monitorar storage
   */
  static async getStorageStats() {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      Prefix: 'wordpress-photos/',
    })

    const response = await getR2Client().send(command)
    
    if (!response.Contents) {
      return { totalFiles: 0, totalSize: 0, totalSizeGB: 0 }
    }

    const totalSize = response.Contents.reduce((sum, item) => sum + (item.Size || 0), 0)

    return {
      totalFiles: response.Contents.length,
      totalSize, // bytes
      totalSizeGB: (totalSize / 1024 / 1024 / 1024).toFixed(2),
      monthlyCost: ((totalSize / 1024 / 1024 / 1024) * 0.015).toFixed(4), // $0.015/GB
    }
  }
}
