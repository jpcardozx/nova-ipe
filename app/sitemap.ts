import { MetadataRoute } from 'next';

/**
 * Sitemap dinâmico gerado pelo Next.js
 * Importante para SEO: Ajuda search engines a descobrir todas as páginas
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.nova-ipe.com.br';
  const currentDate = new Date().toISOString();

  // Páginas principais e estáticas
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/comprar`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/alugar`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ] as MetadataRoute.Sitemap;

  // Nota: Em um ambiente real, você buscaria dinamicamente
  // todas as entradas das páginas de imóveis com lastModified
  // apropriado baseado na data de atualização no banco de dados
  
  // Exemplo fictício de como adicionar imóveis dinâmicos gerados do banco
  // const imoveisEntries = [...imoveisData].map((imovel) => ({
  //   url: `${baseUrl}/imovel/${imovel.slug}`,
  //   lastModified: imovel.updatedAt || currentDate,
  //   changeFrequency: 'weekly' as const,
  //   priority: imovel.destaque ? 0.9 : 0.7,
  // }));
  
  // Retornar o sitemap completo (estáticos + dinâmicos)
  return [...staticPages]; 
  
  // Em produção: return [...staticPages, ...imoveisEntries];
}
