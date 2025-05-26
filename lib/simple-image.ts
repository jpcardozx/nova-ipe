// Simple image utilities without complex dependencies

export interface SimpleImage {
  url: string;
  alt: string;
}

export function getImageUrl(image: any): string {
  if (typeof image === 'string') return image;
  if (image?.asset?.url) return image.asset.url;
  if (image?.url) return image.url;
  return '/images/property-placeholder.jpg';
}

export function getImageAlt(image: any, fallback = 'Imagem'): string {
  if (typeof image === 'string') return fallback;
  return image?.alt || fallback;
}

export function processSimpleImage(image: any, defaultAlt = 'Imagem'): SimpleImage {
  return {
    url: getImageUrl(image),
    alt: getImageAlt(image, defaultAlt)
  };
}