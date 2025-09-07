import { ImovelClient, ImagemClient } from "@/src/types/imovel-client";
import { formatarMoeda, formatarArea, formatarEndereco } from "@/lib/utils";

/**
 * Mapeia um imóvel do formato Sanity para o formato cliente
 */
export function mapImovelToClient(imovel: any): ImovelClient {
    if (!imovel) return {} as ImovelClient;    // Log para depurar a estrutura do objeto imagem recebido do Sanity
    // console.log("mapImovelToClient - Object received:", {
    //     id: imovel._id,
    //     titulo: imovel.titulo,
    //     hasImagem: !!imovel.imagem,
    //     imagemType: imovel.imagem ? typeof imovel.imagem : 'undefined',
    //     imagemHasUrl: imovel.imagem?.url ? true : false,
    //     imagemHasAsset: imovel.imagem?.asset ? true : false,
    //     assetRef: imovel.imagem?.asset?._ref,
    // });    // Converte a imagem para o formato esperado
    let imagem: ImagemClient = {
        imagemUrl: '',
        alt: 'Imagem não disponível',
        asset: {
            _type: 'sanity.imageAsset'
        }
    };

    if (imovel.imagem) {
        // Extração robusta dos dados da imagem
        const imageData = imovel.imagem;
        const assetData = imageData.asset || {};

        // Extrai URL seguindo uma ordem de prioridade de múltiplas fontes
        const imageUrl =
            imageData.imagemUrl ||
            imageData.url ||
            assetData.url ||
            '';        // Se tem imagem, cria objeto com as propriedades necessárias
        imagem = {
            imagemUrl: imageUrl,
            alt: imageData.alt || imovel.titulo || 'Imagem do imóvel',
            asset: {
                ...assetData,
                _type: assetData._type || 'sanity.imageAsset',
                // Só inclui _ref se ele existir e não for vazio
                ...(assetData._ref && assetData._ref.trim() !== '' && { _ref: assetData._ref })
            }
        };// console.log("mapImovelToClient - Created image object:", {
        //     imagemUrl: imagem.imagemUrl,
        //     hasAssetet: !!imagem.asset,
        //     assetRef: imagem.asset?._ref,
        //     imageHasAsset: !!imageData.asset,
        //     completeObject: !!imageUrl && !!imagem.asset
        // });    } else {
        // Sem imagem, mantém valores padrão já definidos
        // console.log("mapImovelToClient - No image provided, using defaults");
    }

    // Formata o endereço como string
    const enderecoFormatado = imovel.endereco
        ? formatarEndereco(imovel.endereco)
        : '';

    return {
        _id: imovel._id || '',
        _type: imovel._type || 'imovel',
        titulo: imovel.titulo || '',
        slug: imovel.slug?.current || '',
        codigo: imovel.codigo || imovel.codigoInterno || '000000',
        preco: imovel.preco || 0,
        finalidade: imovel.finalidade || 'Venda',
        destaque: imovel.destaque || false,
        emAlta: imovel.emAlta || false, // Nova funcionalidade: Imóveis em Alta
        descricao: imovel.descricao || '',
        mapaLink: imovel.mapaLink || '',
        dataPublicacao: imovel.dataPublicacao || imovel._createdAt || '',

        // Características principais - CAMPOS CORRIGIDOS
        dormitorios: imovel.dormitorios || imovel.quartos || 0,
        banheiros: imovel.banheiros || 0,
        areaUtil: imovel.areaUtil || 0,
        area: imovel.area || imovel.areaTotal || 0, // área total
        vagas: imovel.vagas || 0,

        // Dados de localização - CAMPOS CORRIGIDOS
        bairro: imovel.bairro || imovel.endereco?.bairro || '',
        cidade: imovel.cidade || imovel.endereco?.cidade || '',
        estado: imovel.estado || imovel.endereco?.estado || '',
        
        // Tipo do imóvel - CAMPO CORRIGIDO
        tipoImovel: imovel.tipoImovel || imovel.tipo || 'Outro',

        // Flags
        aceitaFinanciamento: imovel.aceitaFinanciamento || false,
        documentacaoOk: imovel.documentacaoOk || false,

        // Características e recursos do imóvel
        caracteristicas: imovel.caracteristicas || [],
        possuiJardim: imovel.possuiJardim || false,
        possuiPiscina: imovel.possuiPiscina || false,

        // Categoria
        categoria: imovel.categoria ? {
            _id: imovel.categoria._id || '',
            titulo: imovel.categoria.titulo || '',
            slug: imovel.categoria.slug || { current: '' },
        } : undefined,

        // Imagens
        imagem,
        imagemOpenGraph: imagem,
        
        // Galeria de imagens
        galeria: imovel.galeria?.map((img: any) => ({
            imagemUrl: img.imagemUrl || img.url || img.asset?.url || '',
            alt: img.alt || img.titulo || imovel.titulo || 'Imagem da galeria',
            asset: {
                ...img.asset,
                _type: img.asset?._type || 'sanity.imageAsset',
                ...(img.asset?._ref && { _ref: img.asset._ref })
            }
        })) || [],

        // Outros campos
        endereco: enderecoFormatado,
        metaTitle: imovel.metaTitle || imovel.titulo || '',
        metaDescription: imovel.metaDescription || imovel.descricao?.slice(0, 160) || '',
        tags: imovel.tags || [],
        status: imovel.status || 'disponivel',
    };
}
