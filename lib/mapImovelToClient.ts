import { ImovelClient, ImagemClient } from "@/src/types/imovel-client";
import { formatarMoeda, formatarArea, formatarEndereco } from "@/lib/utils";

/**
 * Mapeia um imóvel do formato Sanity para o formato cliente
 */
export function mapImovelToClient(imovel: any): ImovelClient {
    if (!imovel) return {} as ImovelClient;

    // Log para depurar a estrutura do objeto imagem recebido do Sanity
    console.log("mapImovelToClient - Object received:", {
        id: imovel._id,
        titulo: imovel.titulo,
        hasImagem: !!imovel.imagem,
        imagemType: imovel.imagem ? typeof imovel.imagem : 'undefined',
        imagemHasUrl: imovel.imagem?.url ? true : false,
        imagemHasAsset: imovel.imagem?.asset ? true : false,
        assetRef: imovel.imagem?.asset?._ref,
    });    // Converte a imagem para o formato esperado
    let imagem: ImagemClient;

    if (imovel.imagem) {
        // Extração robusta dos dados da imagem
        const imageData = imovel.imagem;
        const assetData = imageData.asset || {};

        // Extrai URL seguindo uma ordem de prioridade de múltiplas fontes
        const imageUrl =
            imageData.imagemUrl ||
            imageData.url ||
            assetData.url ||
            '';

        // Se tem imagem, cria objeto com as propriedades necessárias
        // Garantimos que todos os campos necessários estão presentes
        imagem = {
            _type: 'image',
            url: imageUrl,
            imagemUrl: imageUrl,
            alt: imageData.alt || imovel.titulo || 'Imagem do imóvel',
            // Preserva a referência completa do asset, ou cria uma estrutura mínima
            asset: {
                ...assetData,
                _type: assetData._type || 'sanity.imageAsset',
                _ref: assetData._ref || ''
            }
        };

        console.log("mapImovelToClient - Created image object:", {
            url: imagem.url,
            imagemUrl: imagem.imagemUrl,
            hasAsset: !!imagem.asset,
            assetRef: imagem.asset?._ref,
            assetUrl: imagem.asset?.url,
            imageHasAsset: !!imageData.asset,
            completeObject: !!imageUrl && !!imagem.asset
        });
    } else {
        // Sem imagem, usa valores padrão
        imagem = {
            _type: 'image',
            url: '',
            imagemUrl: '',
            alt: 'Imagem não disponível',
            asset: {
                _type: 'sanity.imageAsset',
                _ref: ''
            }
        };
        console.log("mapImovelToClient - No image provided, using defaults");
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
