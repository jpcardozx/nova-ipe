'use client'

import { sanityClient } from './sanity.client'

export interface UploadResult {
  asset?: {
    _id: string
    url: string
    metadata?: {
      dimensions?: {
        width: number
        height: number
      }
    }
  }
  error?: string
}

/**
 * Converts a blob URL to a File object
 */
export async function blobToFile(blobUrl: string, filename: string): Promise<File> {
  try {
    const response = await fetch(blobUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()

    // Determine MIME type
    const mimeType = blob.type || 'application/octet-stream'

    // Create File object
    const file = new File([blob], filename, {
      type: mimeType,
      lastModified: Date.now()
    })

    return file
  } catch (error) {
    console.error('Error converting blob to file:', error)
    throw error
  }
}

/**
 * Validates image file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 50 * 1024 * 1024 // 50MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

  if (file.size > maxSize) {
    return { valid: false, error: 'Arquivo muito grande. Máximo 50MB.' }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou GIF.' }
  }

  return { valid: true }
}

/**
 * Uploads a file to Sanity with proper error handling
 */
export async function uploadToSanity(file: File): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return { error: validation.error }
    }

    // Check if client has token
    const client = sanityClient
    if (!client.config().token) {
      return { error: 'Token de autenticação não configurado. Verifique SANITY_API_TOKEN.' }
    }

    console.log('Uploading file to Sanity:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Upload to Sanity
    const asset = await client.assets.upload('image', file, {
      filename: file.name,
      contentType: file.type
    })

    console.log('Sanity upload successful:', asset)

    return {
      asset: {
        _id: asset._id,
        url: asset.url,
        metadata: asset.metadata
      }
    }
  } catch (error) {
    console.error('Sanity upload error:', error)

    let errorMessage = 'Erro desconhecido no upload'

    if (error instanceof Error) {
      errorMessage = error.message

      // Handle specific Sanity errors
      if (errorMessage.includes('400')) {
        errorMessage = 'Erro de validação. Verifique o formato do arquivo.'
      } else if (errorMessage.includes('401')) {
        errorMessage = 'Erro de autenticação. Token inválido ou expirado.'
      } else if (errorMessage.includes('413')) {
        errorMessage = 'Arquivo muito grande para upload.'
      } else if (errorMessage.includes('unsupported format')) {
        errorMessage = 'Formato de arquivo não suportado.'
      }
    }

    return { error: errorMessage }
  }
}

/**
 * Uploads a blob URL to Sanity (converts to File first)
 */
export async function uploadBlobToSanity(blobUrl: string, filename: string): Promise<UploadResult> {
  try {
    console.log('Converting blob to file:', { blobUrl, filename })

    const file = await blobToFile(blobUrl, filename)
    console.log('Blob converted to file:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    return await uploadToSanity(file)
  } catch (error) {
    console.error('Error uploading blob to Sanity:', error)
    return {
      error: error instanceof Error ? error.message : 'Erro ao processar blob URL'
    }
  }
}

/**
 * Helper to handle multiple file uploads with progress tracking
 */
export async function uploadMultipleFiles(
  files: File[],
  onProgress?: (progress: number, currentFile: string) => void
): Promise<{ results: UploadResult[]; errors: string[] }> {
  const results: UploadResult[] = []
  const errors: string[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    if (onProgress) {
      onProgress((i / files.length) * 100, file.name)
    }

    const result = await uploadToSanity(file)
    results.push(result)

    if (result.error) {
      errors.push(`${file.name}: ${result.error}`)
    }
  }

  if (onProgress) {
    onProgress(100, 'Concluído')
  }

  return { results, errors }
}