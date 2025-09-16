'use client'

import { useState, useCallback } from 'react'
import { uploadToSanity, uploadBlobToSanity, uploadMultipleFiles, UploadResult } from '../../lib/sanity/upload-helper'

interface UploadState {
  uploading: boolean
  progress: number
  currentFile: string
  error: string | null
  results: UploadResult[]
}

interface UseSanityUploadReturn {
  uploadState: UploadState
  uploadFile: (file: File) => Promise<UploadResult>
  uploadFiles: (files: File[]) => Promise<{ results: UploadResult[]; errors: string[] }>
  uploadFromBlob: (blobUrl: string, filename: string) => Promise<UploadResult>
  resetUpload: () => void
}

export function useSanityUpload(): UseSanityUploadReturn {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    currentFile: '',
    error: null,
    results: []
  })

  const resetUpload = useCallback(() => {
    setUploadState({
      uploading: false,
      progress: 0,
      currentFile: '',
      error: null,
      results: []
    })
  }, [])

  const uploadFile = useCallback(async (file: File): Promise<UploadResult> => {
    setUploadState(prev => ({
      ...prev,
      uploading: true,
      progress: 0,
      currentFile: file.name,
      error: null
    }))

    try {
      const result = await uploadToSanity(file)

      setUploadState(prev => ({
        ...prev,
        uploading: false,
        progress: 100,
        results: [...prev.results, result],
        error: result.error || null
      }))

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'

      setUploadState(prev => ({
        ...prev,
        uploading: false,
        error: errorMessage
      }))

      return { error: errorMessage }
    }
  }, [])

  const uploadFiles = useCallback(async (files: File[]): Promise<{ results: UploadResult[]; errors: string[] }> => {
    setUploadState(prev => ({
      ...prev,
      uploading: true,
      progress: 0,
      currentFile: '',
      error: null,
      results: []
    }))

    try {
      const { results, errors } = await uploadMultipleFiles(files, (progress, currentFile) => {
        setUploadState(prev => ({
          ...prev,
          progress,
          currentFile
        }))
      })

      setUploadState(prev => ({
        ...prev,
        uploading: false,
        progress: 100,
        results,
        error: errors.length > 0 ? errors.join('\n') : null
      }))

      return { results, errors }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'

      setUploadState(prev => ({
        ...prev,
        uploading: false,
        error: errorMessage
      }))

      return { results: [], errors: [errorMessage] }
    }
  }, [])

  const uploadFromBlob = useCallback(async (blobUrl: string, filename: string): Promise<UploadResult> => {
    setUploadState(prev => ({
      ...prev,
      uploading: true,
      progress: 0,
      currentFile: filename,
      error: null
    }))

    try {
      const result = await uploadBlobToSanity(blobUrl, filename)

      setUploadState(prev => ({
        ...prev,
        uploading: false,
        progress: 100,
        results: [...prev.results, result],
        error: result.error || null
      }))

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'

      setUploadState(prev => ({
        ...prev,
        uploading: false,
        error: errorMessage
      }))

      return { error: errorMessage }
    }
  }, [])

  return {
    uploadState,
    uploadFile,
    uploadFiles,
    uploadFromBlob,
    resetUpload
  }
}