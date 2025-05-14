import type { ImovelProjetado } from '@/types/imovel-client'
import type { ImovelClient } from '@/types/imovel-client'

export function mapImovelToClient(i: ImovelProjetado): ImovelClient {
  return {
    _id: i._id as string,
    slug: i.slug?.current ?? '',
    titulo: i.titulo,
    preco: i.preco,
    finalidade: i.finalidade,
    tipoImovel: i.tipoImovel,
    destaque: i.destaque,
    bairro: i.bairro,
    cidade: i.cidade,
    descricao: i.descricao,
    aceitaFinanciamento: i.aceitaFinanciamento,
    documentacaoOk: i.documentacaoOk,
    imagem: i.imagem ? {
      url: i.imagem.imagemUrl ?? '',
      imagemUrl: i.imagem.imagemUrl ?? '',
      alt: i.imagem.alt ?? ''
    } : undefined,
    imagemOpenGraph: i.imagemOpenGraph ? {
      url: i.imagemOpenGraph.imagemUrl ?? ''
    } : undefined,
    categoria: i.categoria,
    endereco: i.endereco,
    metaTitle: i.metaTitle,
    metaDescription: i.metaDescription,
    tags: i.tags,
    status: i.status,
    dormitorios: i.dormitorios,
    banheiros: i.banheiros,
    areaUtil: i.areaUtil,
    vagas: i.vagas,
  }
}
