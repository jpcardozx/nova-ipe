/**
 * Helper para URLs de imagens dos imóveis
 * Conecta com as fotos do Lightsail AWS
 */

export interface ImovelImageOptions {
  size?: 'original' | '640x480' | '300x300' | '285x140' | '265x200' | '105x80' | '80x60'
  fotoNumero?: number
  fallback?: boolean
}

/**
 * Gera URL da imagem do imóvel no Lightsail
 */
export function getImovelImageUrl(
  imovelId: string | number,
  options: ImovelImageOptions = {}
): string {
  const {
    size = '640x480',
    fotoNumero = 1,
    fallback = true
  } = options

  // ⚠️ Hard-coded porque process.env não funciona em client components
  // TODO: Mover para API route se precisar de ENV vars dinâmicas
  const baseUrl = 'http://13.223.237.99/wp-content/uploads/WPL'
  const fotoStr = String(fotoNumero).padStart(2, '0')

  let filename: string

  if (size === 'original') {
    filename = `img_foto${fotoStr}.jpg`
  } else {
    filename = `thimg_foto${fotoStr}_${size}.jpg`
  }

  const url = `${baseUrl}/${imovelId}/${filename}`

  // Debug apenas em desenvolvimento (client-side check)
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log(`🖼️ Imagem gerada: ${url}`)
  }

  return url
}

/**
 * Gera array de URLs para galeria de fotos
 */
export function getImovelGalleryUrls(
  imovelId: string | number,
  totalFotos: number = 5,
  size: ImovelImageOptions['size'] = '640x480'
): string[] {
  const urls: string[] = []
  
  for (let i = 1; i <= totalFotos; i++) {
    urls.push(getImovelImageUrl(imovelId, { size, fotoNumero: i }))
  }
  
  return urls
}

/**
 * Verifica se uma imagem existe (retorna Promise)
 */
export async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Hook React para imagem com fallback automático
 */
export function useImovelImage(
  imovelId: string | number,
  options: ImovelImageOptions = {}
) {
  const primaryUrl = getImovelImageUrl(imovelId, options)
  
  // Fallback para foto 1 se não for foto 1
  const fallbackUrl = options.fotoNumero !== 1 
    ? getImovelImageUrl(imovelId, { ...options, fotoNumero: 1 })
    : undefined
  
  // URL de placeholder genérico
  const placeholderUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQ4MCIgdmlld0JveD0iMCAwIDY0MCA0ODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2NDAiIGhlaWdodD0iNDgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Im0zMjAgMjQwIDEwMC0xMDB2MjAwbC0xMDAtMTAwWiIgZmlsbD0iI0Q1RDdEQSIvPgo8L3N2Zz4K'
  
  return {
    primaryUrl,
    fallbackUrl,
    placeholderUrl,
    // Função para usar no onError do img
    handleImageError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget
      if (fallbackUrl && img.src === primaryUrl) {
        img.src = fallbackUrl
      } else if (img.src !== placeholderUrl) {
        img.src = placeholderUrl
      }
    }
  }
}

/**
 * Configurações de tamanho para diferentes contextos
 */
export const IMAGE_SIZES = {
  thumbnail: '105x80',
  card: '300x300',
  preview: '640x480',
  banner: '285x140',
  detail: 'original'
} as const

/**
 * Estatísticas das fotos (do diagnóstico feito)
 */
export const FOTOS_STATS = {
  totalImoveis: 763,
  imoveisAtivos: 757,
  tamanhoTotal: '3.98 GB',
  tamanhoBytes: 4277385246,
  baseUrl: 'http://13.223.237.99/wp-content/uploads/WPL',
  estrutura: {
    original: 'img_foto{01-XX}.jpg (~200KB)',
    thumbnails: {
      '80x60': 'thimg_foto{01}_80x60.jpg (~4KB)',
      '105x80': 'thimg_foto{01}_105x80.jpg (~6KB)', 
      '265x200': 'thimg_foto{01}_265x200.jpg (~30KB)',
      '285x140': 'thimg_foto{01}_285x140.jpg (~23KB)',
      '300x300': 'thimg_foto{01}_300x300.jpg (~40KB)',
      '640x480': 'thimg_foto{01}_640x480.jpg (~90KB)'
    }
  }
} as const

/**
 * Função para migração futura (placeholder)
 */
export function getMigrationStatus() {
  return {
    lightsailOnline: true,
    supabaseReady: false,
    migrationPercent: 0,
    recommendation: 'Usar Lightsail por enquanto, migrar para Supabase Storage futuramente'
  }
}