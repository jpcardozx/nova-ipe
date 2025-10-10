/**
 * WordPress Photo URL Helper
 * Gera URLs corretas para fotos do WordPress no Lightsail
 *
 * NOTA: Hard-coded por enquanto para funcionar no browser.
 * Para mudar, altere diretamente aqui ou crie um config.
 */

// IP do Lightsail (WordPress Legacy)
const LIGHTSAIL_BASE_URL = 'http://13.223.237.99'
const WPL_UPLOADS_PATH = '/wp-content/uploads/WPL'

export interface PhotoUrls {
  original: string
  thumbnail: string // 640x480
  small: string     // 300x300
  tiny: string      // 105x80
}

/**
 * Gera todas as URLs de uma foto específica
 */
export function getPhotoUrls(wpId: number, photoNumber: number): PhotoUrls {
  const num = String(photoNumber).padStart(2, '0')
  const base = `${LIGHTSAIL_BASE_URL}${WPL_UPLOADS_PATH}/${wpId}`

  return {
    original: `${base}/img_foto${num}.jpg`,
    thumbnail: `${base}/thimg_foto${num}_640x480.jpg`,
    small: `${base}/thimg_foto${num}_300x300.jpg`,
    tiny: `${base}/thimg_foto${num}_105x80.jpg`,
  }
}

/**
 * Gera apenas a URL da thumbnail (mais usada)
 */
export function getThumbnailUrl(wpId: number, photoNumber: number = 1): string {
  return getPhotoUrls(wpId, photoNumber).thumbnail
}

/**
 * Gera URLs de todas as fotos de um imóvel
 */
export function getAllPhotoUrls(wpId: number, photoCount: number): string[] {
  const urls: string[] = []

  for (let i = 1; i <= photoCount; i++) {
    urls.push(getThumbnailUrl(wpId, i))
  }

  return urls
}

/**
 * Verifica se uma URL é do Lightsail (WordPress antigo)
 */
export function isLightsailUrl(url: string): boolean {
  return url.includes('13.223.237.99') || url.includes('wp-content/uploads/WPL')
}

/**
 * Verifica se uma URL é do R2 (Cloudflare)
 */
export function isR2Url(url: string): boolean {
  return url.includes('r2.cloudflarestorage.com') || url.includes('pub-')
}

/**
 * Prioriza URLs: R2 > Lightsail > Fallback
 */
export function getBestPhotoUrl(
  r2Url: string | undefined,
  wpId: number,
  photoNumber: number = 1
): string {
  // 1. Se tem URL do R2, usa ela
  if (r2Url && isR2Url(r2Url)) {
    return r2Url
  }

  // 2. Se é URL do Lightsail válida, usa ela
  if (r2Url && isLightsailUrl(r2Url)) {
    return r2Url
  }

  // 3. Gera URL do Lightsail baseada no wp_id
  return getThumbnailUrl(wpId, photoNumber)
}
