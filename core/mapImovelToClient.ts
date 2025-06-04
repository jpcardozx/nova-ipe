import { ImovelClient, ImagemClient } from "@/src/types/imovel-client";
import { formatarMoeda, formatarArea, formatarEndereco } from "@/lib/utils";

/**
 * Mapeia um imóvel do formato Sanity para o formato cliente
 * Versão unificada para manter compatibilidade com a implementação em lib/mapImovelToClient.ts
 */
export function mapImovelToClient(imovel: any): ImovelClient {
    if (!imovel) return {} as ImovelClient;

    // Converte a imagem para o formato esperado
    let imagem: ImagemClient | undefined; // Allow undefined if no image

    if (imovel.imagem) {
        const imageData = imovel.imagem;
        const assetData = imageData.asset || {};
        const imageUrl = imageData.imagemUrl || assetData.url || '';

        imagem = {
            imagemUrl: imageUrl,
            alt: imageData.alt || imovel.titulo || 'Imagem do imóvel',
            asset: {
                ...assetData,
                _type: assetData._type || 'sanity.imageAsset',
                _ref: assetData._ref || ''
            }
        };
    } else {
        imagem = undefined; // Explicitly set to undefined if no image
    }

    // Formata o endereço como string
    const enderecoFormatado = imovel.endereco
        ? formatarEndereco(imovel.endereco)
        : '';

    return {
        _id: imovel._id || '',
        slug: imovel.slug?.current || imovel.slug || '',
        titulo: imovel.titulo || '',
        preco: imovel.preco || 0,
        finalidade: imovel.finalidade,
        tipoImovel: imovel.tipoImovel,
        destaque: imovel.destaque,
        bairro: imovel.bairro,
        cidade: imovel.cidade,
        estado: imovel.estado,
        descricao: imovel.descricao,
        mapaLink: imovel.mapaLink,
        dataPublicacao: imovel.dataPublicacao,
        dormitorios: imovel.dormitorios,
        banheiros: imovel.banheiros,
        areaUtil: imovel.areaUtil,
        vagas: imovel.vagas,
        aceitaFinanciamento: imovel.aceitaFinanciamento,
        documentacaoOk: imovel.documentacaoOk,
        caracteristicas: imovel.caracteristicas || [],
        possuiJardim: imovel.possuiJardim,
        possuiPiscina: imovel.possuiPiscina,
        galeria: imovel.galeria?.map((g: any) => ({
            imagemUrl: g.imagemUrl || g.asset?.url || '',
            alt: g.alt || imovel.titulo || 'Imagem da galeria',
            asset: g.asset ? { _ref: g.asset._ref, _type: g.asset._type } : undefined
        })) || [],
        categoria: imovel.categoria ? {
            _id: imovel.categoria._id,
            titulo: imovel.categoria.titulo,
            slug: imovel.categoria.slug?.current
        } : undefined,
        imagem: imagem, // Assign the processed image object
        imagemOpenGraph: imovel.imagemOpenGraph ? {
            imagemUrl: imovel.imagemOpenGraph.imagemUrl || imovel.imagemOpenGraph.asset?.url || '',
            alt: imovel.imagemOpenGraph.alt || imovel.titulo || 'Imagem Open Graph',
            asset: imovel.imagemOpenGraph.asset ? { _ref: imovel.imagemOpenGraph.asset._ref, _type: imovel.imagemOpenGraph.asset._type } : undefined
        } : undefined,
        endereco: imovel.endereco,
        metaTitle: imovel.metaTitle,
        metaDescription: imovel.metaDescription,
        tags: imovel.tags || [],
        status: imovel.status,
        id: imovel._id // Ensure id is present for TurboComprarPage compatibility
    };
}

export default mapImovelToClient;
