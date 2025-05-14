import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

const config = {
    /**
     * Find your project ID and dataset in `sanity.json` in your studio project.
     * These are considered "public", but you can use environment variables
     * if you want differ between local dev and production.
     */
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
    useCdn: process.env.NODE_ENV === 'production',
    /**
     * Set useCdn to `false` if your application requires the freshest possible
     * data always (potentially slightly slower and a bit more expensive).
     * Authenticated request (like preview) will always bypass the CDN
     */
    apiVersion: '2023-05-03',
};

export const sanityClient = createClient(config);

// Configuração do construtor de URL para imagens
const builder = imageUrlBuilder(sanityClient);

/**
 * Helper function para gerar URLs de imagem do Sanity otimizadas
 * @param {Object} source - Objeto de imagem do Sanity
 * @returns {Function} - Builder function de URL para a imagem
 */
export const urlFor = (source) => {
    return builder.image(source);
};

/**
 * Recupera propriedades em destaque
 * @param {number} limit - Limite de registros a retornar
 * @returns {Promise<Array>} - Array de propriedades
 */
export async function getFeaturedProperties(limit = 6) {
    return sanityClient.fetch(`
    *[_type == "property" && featured == true] | order(publishedAt desc)[0...${limit}] {
      _id,
      title,
      slug,
      location,
      city,
      price,
      propertyType,
      area,
      bedrooms,
      bathrooms,
      parkingSpots,
      "mainImage": {
        "url": mainImage.asset->url,
        "alt": mainImage.alt
      },
      isPremium,
      isHighlight,
      isNew,
      has3DModel,
      hasVirtualTour
    }
  `);
}

/**
 * Recupera propriedades para aluguel
 * @param {number} limit - Limite de registros a retornar
 * @returns {Promise<Array>} - Array de propriedades
 */
export async function getRentProperties(limit = 6) {
    return sanityClient.fetch(`
    *[_type == "property" && propertyType == "rent"] | order(publishedAt desc)[0...${limit}] {
      _id,
      title,
      slug,
      location,
      city,
      price,
      propertyType,
      area,
      bedrooms,
      bathrooms,
      parkingSpots,
      "mainImage": {
        "url": mainImage.asset->url,
        "alt": mainImage.alt
      },
      isPremium,
      isHighlight,
      isNew
    }
  `);
}

/**
 * Recupera lançamentos de propriedades
 * @param {number} limit - Limite de registros a retornar
 * @returns {Promise<Array>} - Array de propriedades
 */
export async function getNewProperties(limit = 4) {
    return sanityClient.fetch(`
    *[_type == "property" && isNew == true] | order(publishedAt desc)[0...${limit}] {
      _id,
      title,
      slug,
      location,
      city,
      price,
      propertyType,
      area,
      bedrooms,
      bathrooms,
      parkingSpots,
      "mainImage": {
        "url": mainImage.asset->url,
        "alt": mainImage.alt
      },
      isPremium,
      isHighlight,
      isNew,
      features
    }
  `);
}

/**
 * Recupera detalhes de uma propriedade específica
 * @param {string} slug - Slug da propriedade
 * @returns {Promise<Object>} - Objeto da propriedade
 */
export async function getProperty(slug) {
    return sanityClient.fetch(`
    *[_type == "property" && slug.current == $slug][0] {
      _id,
      title,
      description,
      slug,
      location,
      address,
      city,
      price,
      propertyType,
      area,
      bedrooms,
      bathrooms,
      parkingSpots,
      "mainImage": {
        "url": mainImage.asset->url,
        "alt": mainImage.alt
      },
      "images": images[] {
        "url": asset->url,
        "alt": alt
      },
      isPremium,
      isHighlight,
      isNew,
      has3DModel,
      hasVirtualTour,
      modelUrl,
      publishedAt,
      features,
      "virtualTour": virtualTour[] {
        title,
        "imageUrl": image.asset->url,
        infoText,
        hotspots
      }
    }
  `, { slug });
}

/**
 * Pesquisa propriedades com base em critérios
 * @param {Object} params - Parâmetros de pesquisa
 * @returns {Promise<Array>} - Array de propriedades
 */
export async function searchProperties({
    type = null,
    minPrice = null,
    maxPrice = null,
    bedrooms = null,
    location = null,
    limit = 12,
    offset = 0
}) {
    let filters = ['_type == "property"'];

    if (type) filters.push(`propertyType == "${type}"`);
    if (minPrice) filters.push(`price >= ${minPrice}`);
    if (maxPrice) filters.push(`price <= ${maxPrice}`);
    if (bedrooms) filters.push(`bedrooms >= ${bedrooms}`);
    if (location) filters.push(`location match "${location}*" || city match "${location}*"`);

    const filterString = filters.join(' && ');

    return sanityClient.fetch(`
    *[${filterString}] | order(publishedAt desc)[${offset}...${offset + limit}] {
      _id,
      title,
      slug,
      location,
      city,
      price,
      propertyType,
      area,
      bedrooms,
      bathrooms,
      parkingSpots,
      "mainImage": {
        "url": mainImage.asset->url,
        "alt": mainImage.alt
      },
      isPremium,
      isHighlight,
      isNew
    }
  `);
} 