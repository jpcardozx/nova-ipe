import { MetadataRoute } from 'next';

/**
 * Arquivo robots.ts gerado dinamicamente
 * Controla como os motores de busca interagem com o site
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.nova-ipe.com.br';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/studio/',
        '/login/',
        '/offline/',
        '/_next/',
        '/cdn-cgi/',
      ],
      // Reduzir a frequência de crawling para não sobrecarregar o servidor
      crawlDelay: 5,
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
