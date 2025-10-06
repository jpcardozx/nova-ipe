import { MetadataRoute } from 'next';

/**
 * Arquivo robots.ts gerado dinamicamente
 * Controla como os motores de busca interagem com o site
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.imobiliariaipe.com.br';
  
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
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
