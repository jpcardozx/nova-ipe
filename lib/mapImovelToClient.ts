import { ImovelClient, ImagemClient } from "@/src/types/imovel-client";
import { formatarMoeda, formatarArea, formatarEndereco } from "@/lib/utils";

/**
 * Mapeia um imóvel do formato Sanity para o formato cliente
 */
export function mapImovelToClient(imovel: any): ImovelClient {
    if (!imovel) return {} as ImovelClient;

    // Converte a imagem para o formato esperado
    const imagem: ImagemClient = imovel.imagem ? {
        url: imovel.imagem.url || imovel.imagem.asset?.url || '',
        imagemUrl: imovel.imagem.url || imovel.imagem.asset?.url || '',
        alt: imovel.imagem.alt || imovel.titulo || 'Imagem do imóvel'
    } : { url: '', imagemUrl: '', alt: 'Imagem não disponível' };

    // Formata o endereço como string
    const enderecoFormatado = imovel.endereco
        ? formatarEndereco(imovel.endereco)
        : '';

    return {
        _id: imovel._id || '',
        _type: imovel._type || 'imovel',
        titulo: imovel.titulo || '',
        slug: imovel.slug?.current || '',
        preco: imovel.preco || 0,
        finalidade: imovel.finalidade || 'Venda',
        tipoImovel: imovel.tipo || 'Outro',
        destaque: imovel.destaque || false,
        bairro: imovel.endereco?.bairro || '',
        cidade: imovel.endereco?.cidade || '',
        estado: imovel.endereco?.estado || '',
        descricao: imovel.descricao || '',
        mapaLink: imovel.mapaLink || '',

        // Características principais
        dormitorios: imovel.quartos || 0,
        banheiros: imovel.banheiros || 0,
        areaUtil: imovel.area || 0,
        vagas: imovel.vagas || 0,

        // Flags
        aceitaFinanciamento: imovel.aceitaFinanciamento || false,
        documentacaoOk: imovel.documentacaoOk || false,

        // Categoria
        categoria: imovel.categoria ? {
            _id: imovel.categoria._id || '',
            titulo: imovel.categoria.titulo || '',
            slug: imovel.categoria.slug || { current: '' },
        } : undefined,

        // Imagens
        imagem,
        imagemOpenGraph: imagem,

        // Outros campos
        endereco: enderecoFormatado,
        metaTitle: imovel.metaTitle || imovel.titulo || '',
        metaDescription: imovel.metaDescription || imovel.descricao?.slice(0, 160) || '',
        tags: imovel.tags || [],
        status: imovel.status || 'disponivel',
    };
}
