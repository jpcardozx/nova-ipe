import { supabase } from '@/lib/supabase'

export interface CloudFile {
    id: string
    name: string
    path: string
    size: number
    type: string
    created_at: string
    updated_at: string
    folder_path?: string
    metadata?: {
        mimetype?: string
        lastModified?: string
        width?: number
        height?: number
    }
}

export interface CloudFolder {
    id: string
    name: string
    path: string
    parent_path?: string
    description?: string
    created_by: string
    created_at: string
    updated_at: string
    file_count?: number
    total_size?: number
}

export class CloudStorageService {
    // ==================== PASTAS ====================
    
    static async getFolders(parentPath: string = '/'): Promise<{
        folders: CloudFolder[]
        error: any
    }> {
        try {
            const { data, error } = await supabase
                .from('cloud_folders')
                .select('*')
                .eq('parent_path', parentPath)
                .order('name')

            if (error) throw error

            return { folders: data || [], error: null }
        } catch (error) {
            console.error('Erro ao buscar pastas:', error)
            return { folders: [], error }
        }
    }

    static async createFolder(data: {
        name: string
        parent_path: string
        description?: string
    }): Promise<{
        folder: CloudFolder | null
        error: any
    }> {
        try {
            const folderPath = `${data.parent_path}${data.parent_path.endsWith('/') ? '' : '/'}${data.name}`
            
            const { data: folder, error } = await supabase
                .from('cloud_folders')
                .insert({
                    name: data.name,
                    path: folderPath,
                    parent_path: data.parent_path,
                    description: data.description,
                    created_by: (await supabase.auth.getUser()).data.user?.id
                })
                .select()
                .single()

            if (error) throw error

            return { folder, error: null }
        } catch (error) {
            console.error('Erro ao criar pasta:', error)
            return { folder: null, error }
        }
    }

    static async deleteFolder(folderId: string): Promise<{
        success: boolean
        error: any
    }> {
        try {
            // Primeiro, verificar se a pasta está vazia
            const { data: subfolders } = await supabase
                .from('cloud_folders')
                .select('id')
                .eq('parent_path', (await supabase
                    .from('cloud_folders')
                    .select('path')
                    .eq('id', folderId)
                    .single()).data?.path)

            if (subfolders && subfolders.length > 0) {
                throw new Error('Pasta não está vazia. Remova o conteúdo primeiro.')
            }

            // Verificar arquivos no Supabase Storage
            const { data: folder } = await supabase
                .from('cloud_folders')
                .select('path')
                .eq('id', folderId)
                .single()

            if (folder) {
                const { data: files } = await supabase.storage
                    .from('documents')
                    .list(folder.path)

                if (files && files.length > 0) {
                    throw new Error('Pasta contém arquivos. Remova os arquivos primeiro.')
                }
            }

            // Deletar pasta
            const { error } = await supabase
                .from('cloud_folders')
                .delete()
                .eq('id', folderId)

            if (error) throw error

            return { success: true, error: null }
        } catch (error) {
            console.error('Erro ao deletar pasta:', error)
            return { success: false, error }
        }
    }

    static async renameFolder(folderId: string, newName: string): Promise<{
        folder: CloudFolder | null
        error: any
    }> {
        try {
            // Buscar dados atuais da pasta
            const { data: currentFolder } = await supabase
                .from('cloud_folders')
                .select('*')
                .eq('id', folderId)
                .single()

            if (!currentFolder) throw new Error('Pasta não encontrada')

            // Construir novo path
            const parentPath = currentFolder.parent_path || '/'
            const newPath = `${parentPath}${parentPath.endsWith('/') ? '' : '/'}${newName}`

            // Atualizar pasta
            const { data: folder, error } = await supabase
                .from('cloud_folders')
                .update({
                    name: newName,
                    path: newPath
                })
                .eq('id', folderId)
                .select()
                .single()

            if (error) throw error

            // TODO: Atualizar paths de subpastas e arquivos se necessário

            return { folder, error: null }
        } catch (error) {
            console.error('Erro ao renomear pasta:', error)
            return { folder: null, error }
        }
    }

    // ==================== ARQUIVOS ====================

    static async getFiles(folderPath: string = '/'): Promise<{
        files: CloudFile[]
        error: any
    }> {
        try {
            const listPath = folderPath === '/' ? '' : folderPath

            const { data, error } = await supabase.storage
                .from('documents')
                .list(listPath, {
                    limit: 100,
                    offset: 0
                })

            if (error) throw error

            // Processar dados dos arquivos
            const files: CloudFile[] = (data || [])
                .filter(item => !item.name?.endsWith('/'))
                .map(file => ({
                    id: file.id || crypto.randomUUID(),
                    name: file.name,
                    path: `${folderPath}${folderPath.endsWith('/') ? '' : '/'}${file.name}`,
                    size: file.metadata?.size || 0,
                    type: file.metadata?.mimetype || 'application/octet-stream',
                    created_at: file.created_at || new Date().toISOString(),
                    updated_at: file.updated_at || new Date().toISOString(),
                    folder_path: folderPath,
                    metadata: file.metadata
                }))

            return { files, error: null }
        } catch (error) {
            console.error('Erro ao buscar arquivos:', error)
            return { files: [], error }
        }
    }

    static async uploadFile(
        file: File, 
        folderPath: string = '/',
        options: {
            overwrite?: boolean
            onProgress?: (progress: number) => void
        } = {}
    ): Promise<{
        path: string | null
        error: any
    }> {
        try {
            const filePath = `${folderPath}${folderPath.endsWith('/') ? '' : '/'}${file.name}`

            const { data, error } = await supabase.storage
                .from('documents')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: options.overwrite || false
                })

            if (error) throw error

            return { path: data.path, error: null }
        } catch (error) {
            console.error('Erro no upload:', error)
            return { path: null, error }
        }
    }

    static async downloadFile(filePath: string): Promise<{
        data: Blob | null
        error: any
    }> {
        try {
            const { data, error } = await supabase.storage
                .from('documents')
                .download(filePath)

            if (error) throw error

            return { data, error: null }
        } catch (error) {
            console.error('Erro no download:', error)
            return { data: null, error }
        }
    }

    static async deleteFile(filePath: string): Promise<{
        success: boolean
        error: any
    }> {
        try {
            const { error } = await supabase.storage
                .from('documents')
                .remove([filePath])

            if (error) throw error

            return { success: true, error: null }
        } catch (error) {
            console.error('Erro ao deletar arquivo:', error)
            return { success: false, error }
        }
    }

    static async moveFile(
        fromPath: string, 
        toPath: string
    ): Promise<{
        success: boolean
        error: any
    }> {
        try {
            const { error } = await supabase.storage
                .from('documents')
                .move(fromPath, toPath)

            if (error) throw error

            return { success: true, error: null }
        } catch (error) {
            console.error('Erro ao mover arquivo:', error)
            return { success: false, error }
        }
    }

    static async copyFile(
        fromPath: string, 
        toPath: string
    ): Promise<{
        success: boolean
        error: any
    }> {
        try {
            const { data: fileData, error: downloadError } = await this.downloadFile(fromPath)
            if (downloadError) throw downloadError

            if (!fileData) throw new Error('Arquivo não encontrado')

            const file = new File([fileData], toPath.split('/').pop() || 'file')
            const { error: uploadError } = await this.uploadFile(
                file, 
                toPath.substring(0, toPath.lastIndexOf('/'))
            )

            if (uploadError) throw uploadError

            return { success: true, error: null }
        } catch (error) {
            console.error('Erro ao copiar arquivo:', error)
            return { success: false, error }
        }
    }

    // ==================== BUSCA E NAVEGAÇÃO ====================

    static async searchFiles(
        searchTerm: string,
        folderPath?: string
    ): Promise<{
        files: CloudFile[]
        folders: CloudFolder[]
        error: any
    }> {
        try {
            // Buscar pastas
            let foldersQuery = supabase
                .from('cloud_folders')
                .select('*')
                .ilike('name', `%${searchTerm}%`)

            if (folderPath) {
                foldersQuery = foldersQuery.like('path', `${folderPath}%`)
            }

            const { data: folders, error: foldersError } = await foldersQuery

            if (foldersError) throw foldersError

            // Buscar arquivos (limitado por não ter busca direta no storage)
            const { files, error: filesError } = await this.getFiles(folderPath)
            
            if (filesError) throw filesError

            const filteredFiles = files.filter(file =>
                file.name.toLowerCase().includes(searchTerm.toLowerCase())
            )

            return { 
                files: filteredFiles, 
                folders: folders || [], 
                error: null 
            }
        } catch (error) {
            console.error('Erro na busca:', error)
            return { files: [], folders: [], error }
        }
    }

    static async getFolderStats(folderPath: string): Promise<{
        stats: {
            fileCount: number
            totalSize: number
            subfolderCount: number
        } | null
        error: any
    }> {
        try {
            // Contar subpastas
            const { data: subfolders } = await supabase
                .from('cloud_folders')
                .select('id')
                .eq('parent_path', folderPath)

            // Buscar arquivos para contar e calcular tamanho
            const { files } = await this.getFiles(folderPath)

            const stats = {
                fileCount: files.length,
                totalSize: files.reduce((total, file) => total + file.size, 0),
                subfolderCount: subfolders?.length || 0
            }

            return { stats, error: null }
        } catch (error) {
            console.error('Erro ao calcular estatísticas:', error)
            return { stats: null, error }
        }
    }

    // ==================== COMPARTILHAMENTO ====================

    static async shareFile(
        filePath: string,
        expiresIn: number = 3600 // segundos
    ): Promise<{
        url: string | null
        error: any
    }> {
        try {
            const { data, error } = await supabase.storage
                .from('documents')
                .createSignedUrl(filePath, expiresIn)

            if (error) throw error

            return { url: data.signedUrl, error: null }
        } catch (error) {
            console.error('Erro ao compartilhar arquivo:', error)
            return { url: null, error }
        }
    }

    static async getPublicUrl(filePath: string): Promise<{
        url: string | null
        error: any
    }> {
        try {
            const { data } = supabase.storage
                .from('documents')
                .getPublicUrl(filePath)

            return { url: data.publicUrl, error: null }
        } catch (error) {
            console.error('Erro ao obter URL pública:', error)
            return { url: null, error }
        }
    }

    // ==================== UTILITÁRIOS ====================

    static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    static getFileIcon(file: CloudFile): string {
        if (file.type.startsWith('image/')) return '🖼️'
        if (file.type.includes('pdf')) return '📄'
        if (file.type.includes('word')) return '📝'
        if (file.type.includes('excel') || file.type.includes('spreadsheet')) return '📊'
        if (file.type.includes('video/')) return '🎥'
        if (file.type.includes('audio/')) return '🎵'
        if (file.type.includes('zip') || file.type.includes('rar')) return '📦'
        return '📁'
    }

    static validateFileType(file: File, allowedTypes: string[]): boolean {
        if (allowedTypes.includes('*')) return true
        
        return allowedTypes.some(type => 
            file.type.includes(type) || 
            file.name.toLowerCase().endsWith(type.toLowerCase())
        )
    }

    static validateFileSize(file: File, maxSizeMB: number): boolean {
        return file.size <= maxSizeMB * 1024 * 1024
    }
}
