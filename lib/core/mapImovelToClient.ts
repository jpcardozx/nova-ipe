
// Implementação minimalista para evitar erros de build
import type { ImovelClient, ImovelProjetado } from '@/types/imovel-client';

export function mapImovelToClient(imovel: any): ImovelClient {
  return {
    id: imovel._id || '',
    titulo: imovel.titulo || '',
    descricao: imovel.descricao || '',
    slug: imovel.slug?.current || '',
    endereco: imovel.endereco || {},
    preco: imovel.preco || 0,
    area: imovel.area || 0,
    quartos: imovel.quartos || 0,
    banheiros: imovel.banheiros || 0,
    vagas: imovel.vagas || 0,
    tipo: imovel.tipo || 'Apartamento',
    destaque: imovel.destaque || false,
    status: imovel.status || 'Disponível',
    modalidade: imovel.modalidade || 'Venda',
    imagens: imovel.imagens?.map(img => ({ 
      url: img?.asset?._ref || '',
      alt: img?.alt || ''
    })) || [],
    caracteristicas: imovel.caracteristicas || [],
    createdAt: imovel._createdAt || new Date().toISOString(),
  };
}
