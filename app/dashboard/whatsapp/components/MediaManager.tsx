'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { Progress } from '@/components/ui/progress'
import {
  Upload,
  File,
  Image,
  Video,
  Music,
  FileText,
  Trash2,
  Download,
  Eye,
  Share2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video' | 'audio' | 'document'
  size: number
  url: string
  uploadedAt: Date
  status: 'uploading' | 'completed' | 'error'
  progress?: number
}

export default function MediaManager() {
  const [files, setFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'Casa_Centro_01.jpg',
      type: 'image',
      size: 2048000,
      url: '/placeholder-image.jpg',
      uploadedAt: new Date(),
      status: 'completed'
    },
    {
      id: '2',
      name: 'Contrato_Modelo.pdf',
      type: 'document',
      size: 1024000,
      url: '/placeholder-document.pdf',
      uploadedAt: new Date(),
      status: 'completed'
    }
  ])

  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supportedTypes = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    video: ['mp4', 'avi', 'mov', 'wmv'],
    audio: ['mp3', 'wav', 'ogg', 'm4a'],
    document: ['pdf', 'doc', 'docx', 'txt', 'csv', 'xlsx']
  }

  const maxFileSize = 16 * 1024 * 1024 // 16MB

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />
      case 'video': return <Video className="w-5 h-5" />
      case 'audio': return <Music className="w-5 h-5" />
      case 'document': return <FileText className="w-5 h-5" />
      default: return <File className="w-5 h-5" />
    }
  }

  const getFileTypeFromExtension = (filename: string): 'image' | 'video' | 'audio' | 'document' => {
    const ext = filename.split('.').pop()?.toLowerCase() || ''

    if (supportedTypes.image.includes(ext)) return 'image'
    if (supportedTypes.video.includes(ext)) return 'video'
    if (supportedTypes.audio.includes(ext)) return 'audio'
    return 'document'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    handleFiles(selectedFiles)
  }

  const handleFiles = (fileList: File[]) => {
    fileList.forEach(file => {
      if (file.size > maxFileSize) {
        console.error(`Arquivo ${file.name} muito grande`)
        return
      }

      const newFile: MediaFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: getFileTypeFromExtension(file.name),
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
        status: 'uploading',
        progress: 0
      }

      setFiles(prev => [...prev, newFile])

      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          setFiles(prev => prev.map(f =>
            f.id === newFile.id
              ? { ...f, status: 'completed', progress: 100 }
              : f
          ))
          clearInterval(interval)
        } else {
          setFiles(prev => prev.map(f =>
            f.id === newFile.id
              ? { ...f, progress }
              : f
          ))
        }
      }, 200)
    })
  }

  const deleteFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id))
  }

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciador de Mídia</h2>
          <p className="text-gray-600">Gerencie arquivos para envio no WhatsApp</p>
        </div>
        <Button
          onClick={openFilePicker}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Arquivos
        </Button>
      </div>

      {/* File Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(supportedTypes).map(([type, extensions], index) => {
          const count = files.filter(f => f.type === type && f.status === 'completed').length
          const totalSize = files
            .filter(f => f.type === type && f.status === 'completed')
            .reduce((acc, f) => acc + f.size, 0)

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${
                      type === 'image' ? 'bg-green-100' :
                      type === 'video' ? 'bg-red-100' :
                      type === 'audio' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      {getFileIcon(type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 capitalize">{type}s</p>
                      <p className="text-lg font-bold text-gray-900">{count}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(totalSize)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
      >
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Arraste arquivos aqui ou clique para selecionar
          </h3>
          <p className="text-gray-500 mb-4">
            Suporta imagens, vídeos, áudios e documentos (até 16MB)
          </p>
          <Button
            variant="outline"
            onClick={openFilePicker}
          >
            Selecionar Arquivos
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept={Object.values(supportedTypes).flat().map(ext => `.${ext}`).join(',')}
          />
        </CardContent>
      </Card>

      {/* Files Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Arquivos Enviados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        {getFileIcon(file.type)}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          file.status === 'completed' ? 'bg-green-100 text-green-800' :
                          file.status === 'uploading' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {file.status}
                      </Badge>
                    </div>

                    {file.status === 'uploading' && file.progress !== undefined && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Enviando...</span>
                          <span>{Math.round(file.progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {file.type === 'image' && file.status === 'completed' && (
                      <div className="mb-3">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {file.status === 'completed' && (
                      <div className="flex justify-between">
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteFile(file.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}