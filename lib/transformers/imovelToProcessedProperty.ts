import { ImovelClient } from '../../src/types/imovel-client';
import { ProcessedProperty } from '../../app/types/property';

export function transformImovelToProcessedProperty(imovel: ImovelClient): ProcessedProperty {
  const titulo = imovel.titulo || 'Imóvel disponível';
  const tipo = imovel.tipoImovel || 'Casa';
  const preco = imovel.preco || 0;
  const descricao = imovel.descricao || '';
  const localizacao = imovel.bairro || imovel.cidade || 'Guararema';
  const quartos = imovel.dormitorios;
  const banheiros = imovel.banheiros;
  const area = imovel.areaUtil;
  const destaque = imovel.destaque;
  const mainImageUrl = imovel.imagem?.imagemUrl || imovel.galeria?.[0]?.imagemUrl || '';

  return {
    _id: imovel._id,
    id: imovel._id, // Alias
    titulo,
    title: titulo, // Alias
    tipo,
    propertyType: tipo?.toLowerCase(), // Alias
    preco,
    price: preco, // Alias
    descricao,
    description: descricao, // Alias
    localizacao,
    location: localizacao, // Alias
    imagens: imovel.galeria?.map(img => ({
      asset: {
        _ref: img.asset?._ref || '',
        url: img.imagemUrl
      },
      alt: img.alt || titulo
    })) || [],
    quartos,
    bedrooms: quartos, // Alias
    banheiros,
    bathrooms: banheiros, // Alias
    area,
    garagem: imovel.vagas ? imovel.vagas > 0 : false,
    parkingSpots: imovel.vagas, // Alias
    slug: {
      current: imovel.slug
    },
    categoria: (imovel.finalidade === 'Venda' ? 'venda' : 'aluguel') as 'venda' | 'aluguel',
    destaque,
    featured: destaque, // Alias
    isPremium: destaque, // Alias
    isHighlight: destaque, // Alias
    isNew: false, // Could be calculated based on dataPublicacao
    mainImage: mainImageUrl ? {
      url: mainImageUrl,
      alt: titulo
    } : undefined
  };
}