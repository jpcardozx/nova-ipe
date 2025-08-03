export interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  telephone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface WebsiteSchemaProps {
  name: string;
  url: string;
  description?: string;
  author?: string;
}

export interface LocalBusinessSchemaProps extends OrganizationSchemaProps {
  priceRange?: string;
  openingHours?: string[];
  geo?: {
    latitude: number;
    longitude: number;
  };
}

export function OrganizationSchema({ 
  name, 
  url, 
  logo, 
  description, 
  telephone, 
  address 
}: OrganizationSchemaProps) {
  return {
    "@type": "Organization",
    name,
    url,
    ...(logo && { logo }),
    ...(description && { description }),
    ...(telephone && { telephone }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: address.street,
        addressLocality: address.city,
        addressRegion: address.state,
        postalCode: address.postalCode,
        addressCountry: address.country
      }
    })
  };
}

export function WebsiteSchema({ 
  name, 
  url, 
  description, 
  author 
}: WebsiteSchemaProps) {
  return {
    "@type": "WebSite",
    name,
    url,
    ...(description && { description }),
    ...(author && { author: { "@type": "Person", name: author } })
  };
}

export function LocalBusinessSchema({ 
  name, 
  url, 
  logo, 
  description, 
  telephone, 
  address,
  priceRange,
  openingHours,
  geo
}: LocalBusinessSchemaProps) {
  return {
    "@type": "LocalBusiness",
    name,
    url,
    ...(logo && { logo }),
    ...(description && { description }),
    ...(telephone && { telephone }),
    ...(priceRange && { priceRange }),
    ...(openingHours && { openingHours }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: address.street,
        addressLocality: address.city,
        addressRegion: address.state,
        postalCode: address.postalCode,
        addressCountry: address.country
      }
    }),
    ...(geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: geo.latitude,
        longitude: geo.longitude
      }
    })
  };
}
