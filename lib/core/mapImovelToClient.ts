
// Implementação minimalista para evitar erros de build
import type { ImovelClient, ImovelProjetado, ImagemClient } from '@/src/types/imovel-client';

export function mapImovelToClient(imovel: any): ImovelClient {
  return {
    _id: imovel._id || '',
    titulo: imovel.titulo || '',
    descricao: imovel.descricao || '',
    slug: imovel.slug?.current || '',
    endereco: imovel.endereco || '',
    preco: imovel.preco || 0,
    areaUtil: imovel.area || 0,
    dormitorios: imovel.quartos || 0,
    banheiros: imovel.banheiros || 0,
    vagas: imovel.vagas || 0,
    tipoImovel: imovel.tipo || 'Apartamento',
    destaque: imovel.destaque || false,
    status: imovel.status || 'disponivel',
    finalidade: imovel.modalidade || 'Venda',
    galeria: imovel.imagens?.map((img: any) => ({
      url: img?.asset?._ref || '',
      alt: img?.alt || ''
    })) || [],
    caracteristicas: imovel.caracteristicas || []
    // createdAt property removed as it's not in the ImovelClient interface
  };
}
