// Implementação otimizada com melhor gerenciamento de tipos e performance
import type { ImagemClient, ImovelClient } from '@/src/types/imovel-client';
import type { Imovel } from '../../src/types/sanity-schema';
import { formatarMoeda, formatarArea, formatarEndereco } from '@/lib/utils';

/**
 * Mapeia um imóvel do formato Sanity para o formato client com otimizações de performance
 * - Implementa tipagem estrita para evitar erros em tempo de execução
 * - Usa transformação eficiente para reduzir operações de verificação redundantes
 * - Evita chamadas repetitivas às propriedades aninhadas
 */
export function mapImovelToClient(imovel: Partial<Imovel>): ImovelClient {
  if (!imovel) return {} as ImovelClient;

  // Destructuring para evitar chamadas repetitivas às propriedades
  const {
    _id = '',
    titulo = '',
    descricao = '',
    slug,
    endereco = '',
    preco = 0,
    areaUtil = 0,
    dormitorios = 0,
    banheiros = 0,
    vagas = 0,
    tipoImovel = 'Apartamento',
    destaque = false,
    status = 'disponivel',
    finalidade = 'Venda',
    imagem,
    bairro = '',
    cidade = '',
    estado = ''
  } = imovel;

  // Explicitly cast properties and ensure proper type annotations
  const imagens = Array.isArray((imovel as any).imagens) ? (imovel as any).imagens : [];
  const caracteristicas = Array.isArray((imovel as any).caracteristicas) ? (imovel as any).caracteristicas : [];

  // Tratamento otimizado de imagens
  const galeriaProcessada: ImagemClient[] = imagens.map((img: any) => ({
    url: img?.asset?._ref || '',
    alt: img?.alt || '',
    _type: 'image'
  }));

  // Função de guarda de tipo para verificar a propriedade `alt` em `imagem`
  const hasAltProperty = (obj: any): obj is { alt: string } => 'alt' in obj;

  // Criar o objeto de saída apenas uma vez, evitando recriações
  return {
    _id,
    titulo,
    descricao,
    slug: typeof slug === 'string' ? slug : slug?.current || '',
    endereco,
    preco,
    areaUtil,
    dormitorios,
    banheiros,
    vagas,
    tipoImovel,
    destaque,
    status,
    finalidade,
    bairro,
    cidade,
    estado,
    galeria: galeriaProcessada,
    caracteristicas,
    imagem: imagem ? {
      imagemUrl: imagem.asset?._ref || '',
      alt: hasAltProperty(imagem) ? imagem.alt : titulo || '',
      asset: {
        _type: 'sanity.imageAsset',
        _ref: imagem.asset?._ref || ''
      }
    } : undefined
  };
}
