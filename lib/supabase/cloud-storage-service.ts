import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ifhfpaehnjpdwdocdzwd.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaGZwYWVobmpwZHdkb2NkendkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMDMxMzIsImV4cCI6MjA3MjU3OTEzMn0.-YL0e3oE6mRqL0K432iP3dlbTRPz8G07QJLOI0Ulcyk'

const supabase = createClient(supabaseUrl, supabaseKey)

export interface CloudFile {
    id: string
    name: string
    type: 'file' | 'folder'
    size?: number
    mimeType?: string
    path: string
    url?: string
    thumbnail?: string
    shared: boolean
    starred: boolean
    tags: string[]
    owner: string
    created_at: string
    updated_at?: string
}

export interface StorageStats {
    used: number
    total: number
    files: number
    folders: number
}

export class CloudStorageService {
    private static BUCKET_NAME = 'files'

    static async initializeBucket() {
        try {
            // Tentar criar o bucket se não existir
            const { data, error } = await supabase.storage.createBucket(this.BUCKET_NAME, {
                public: false,
                allowedMimeTypes: ['image/*', 'application/pdf', 'text/*', 'application/vnd.openxmlformats-officedocument.*'],
                fileSizeLimit: 50 * 1024 * 1024 // 50MB
            })

            if (error && !error.message.includes('already exists')) {
                console.error('Error creating bucket:', error)
                return false
            }

            return true
        } catch (error) {
            console.error('Error initializing bucket:', error)
            return false
        }
    }

    static async uploadFile(file: File, path: string = ''): Promise<{ data: CloudFile | null, error: any }> {
        try {
            await this.initializeBucket()

            const fileName = `${path}/${file.name}`.replace(/^\//, '')
            const filePath = `${Date.now()}-${fileName}`

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(this.BUCKET_NAME)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) {
                console.error('Upload error:', uploadError)
                return { data: null, error: uploadError }
            }

            // Obter URL pública
            const { data: urlData } = supabase.storage
                .from(this.BUCKET_NAME)
                .getPublicUrl(filePath)

            const cloudFile: CloudFile = {
                id: uploadData.path,
                name: file.name,
                type: 'file',
                size: file.size,
                mimeType: file.type,
                path: filePath,
                url: urlData.publicUrl,
                shared: false,
                starred: false,
                tags: [],
                owner: 'current_user', // TODO: integrar com auth
                created_at: new Date().toISOString()
            }

            return { data: cloudFile, error: null }
        } catch (error) {
            console.error('Error uploading file:', error)
            return { data: null, error }
        }
    }

    static async listFiles(path: string = ''): Promise<{ files: CloudFile[], error: any }> {
        try {
            await this.initializeBucket()

            const { data, error } = await supabase.storage
                .from(this.BUCKET_NAME)
                .list(path, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' }
                })

            if (error) {
                console.error('List files error:', error)
                return { files: [], error }
            }

            const files: CloudFile[] = data.map(item => ({
                id: item.name,
                name: item.name,
                type: item.metadata?.mimetype ? 'file' : 'folder',
                size: item.metadata?.size,
                mimeType: item.metadata?.mimetype,
                path: `${path}/${item.name}`.replace(/^\//, ''),
                shared: false,
                starred: false,
                tags: [],
                owner: 'current_user',
                created_at: item.created_at || new Date().toISOString(),
                updated_at: item.updated_at
            }))

            return { files, error: null }
        } catch (error) {
            console.error('Error listing files:', error)
            return { files: [], error }
        }
    }

    static async deleteFile(path: string): Promise<{ error: any }> {
        try {
            const { error } = await supabase.storage
                .from(this.BUCKET_NAME)
                .remove([path])

            if (error) {
                console.error('Delete error:', error)
                return { error }
            }

            return { error: null }
        } catch (error) {
            console.error('Error deleting file:', error)
            return { error }
        }
    }

    static async downloadFile(path: string): Promise<{ data: Blob | null, error: any }> {
        try {
            const { data, error } = await supabase.storage
                .from(this.BUCKET_NAME)
                .download(path)

            if (error) {
                console.error('Download error:', error)
                return { data: null, error }
            }

            return { data, error: null }
        } catch (error) {
            console.error('Error downloading file:', error)
            return { data: null, error }
        }
    }

    static async getPublicUrl(path: string): Promise<string> {
        const { data } = supabase.storage
            .from(this.BUCKET_NAME)
            .getPublicUrl(path)

        return data.publicUrl
    }

    static async getStorageStats(): Promise<StorageStats> {
        try {
            await this.initializeBucket()

            // Para estatísticas reais, seria necessário implementar uma função no backend
            // Por enquanto, retornamos dados simulados baseados nos arquivos listados
            const { files } = await this.listFiles()
            
            const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0)
            const fileCount = files.filter(f => f.type === 'file').length
            const folderCount = files.filter(f => f.type === 'folder').length

            return {
                used: totalSize,
                total: 10 * 1024 * 1024 * 1024, // 10GB limit
                files: fileCount,
                folders: folderCount
            }
        } catch (error) {
            console.error('Error getting storage stats:', error)
            return {
                used: 0,
                total: 10 * 1024 * 1024 * 1024,
                files: 0,
                folders: 0
            }
        }
    }

    static async createFolder(name: string, path: string = ''): Promise<{ error: any }> {
        try {
            // No Supabase Storage, folders são criadas implicitamente ao fazer upload de arquivos
            // Vamos criar um arquivo .gitkeep para manter a pasta
            const folderPath = `${path}/${name}/.gitkeep`.replace(/^\//, '')
            
            const { error } = await supabase.storage
                .from(this.BUCKET_NAME)
                .upload(folderPath, new Blob([''], { type: 'text/plain' }))

            if (error) {
                console.error('Create folder error:', error)
                return { error }
            }

            return { error: null }
        } catch (error) {
            console.error('Error creating folder:', error)
            return { error }
        }
    }

    static getFileIcon(mimeType: string = ''): string {
        if (mimeType.startsWith('image/')) return '🖼️'
        if (mimeType.startsWith('video/')) return '🎥'
        if (mimeType.startsWith('audio/')) return '🎵'
        if (mimeType.includes('pdf')) return '📄'
        if (mimeType.includes('doc') || mimeType.includes('word')) return '📝'
        if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊'
        if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📽️'
        if (mimeType.includes('zip') || mimeType.includes('rar')) return '🗜️'
        return '📎'
    }

    static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes'
        
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
}
