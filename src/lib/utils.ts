import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Imovel, SanityImageAsset, SanityReference } from '@/types/sanity-schema';

/**
 * Combina nomes de classes condicionalmente com suporte a Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata um valor numérico para moeda brasileira (R$)
 * @param valor - Valor numérico a ser formatado
 * @param opcoes - Opções de formatação
 * @returns String formatada como moeda
 */
export function formatarMoeda(
  valor: number | undefined | null,
  opcoes: {
    moeda?: string;
    exibirSimbolo?: boolean;
    casasDecimais?: number;
    separadorDecimal?: string;
    separadorMilhar?: string;
  } = {}
) {
  if (valor === undefined || valor === null) {
    return '';
  }
  const {
    moeda = 'BRL',
    exibirSimbolo = true,
    casasDecimais = 2,
    separadorDecimal = ',',
    separadorMilhar = '.'
  } = opcoes;
  try {
    const simbolos: Record<string, string> = {
      BRL: 'R$',
      USD: '$',
      EUR: '€',
      GBP: '£'
    };
    const simbolo = simbolos[moeda] || moeda;
    const parteInteira = Math.floor(Math.abs(valor));
    const parteDecimal = Math.round((Math.abs(valor) - parteInteira) * Math.pow(10, casasDecimais))
      .toString()
      .padStart(casasDecimais, '0');
    const parteInteiraFormatada = parteInteira
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, separadorMilhar);
    const valorFormatado = `${parteInteiraFormatada}${separadorDecimal}${parteDecimal}`;
    return `${valor < 0 ? '-' : ''}${exibirSimbolo ? `${simbolo} ` : ''}${valorFormatado}`;
  } catch (error) {
    console.error('Erro ao formatar moeda:', error);
    return exibirSimbolo ? `R$ ${valor}` : `${valor}`;
  }
}

/**
 * Formata área em metros quadrados (m²)
 * @param m2 - Valor da área em metros quadrados
 * @returns String formatada (ex: "123 m²") ou string vazia se inválido
 */
export function formatarArea(
  m2: number | undefined | null,
  unidades: string = 'm²'
): string {
  if (m2 === undefined || m2 === null || isNaN(m2)) {
    return '';
  }
  const valor = Math.round(m2 * 100) / 100; // duas casas decimais
  return `${valor.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${unidades}`;
}

/**
 * Extrai URL de imagem do objeto Sanity
 */
function extrairUrlImagem(imageRef: any): string {
  if (!imageRef) return '/placeholder-imovel.jpg';
  if (typeof imageRef === 'string') return imageRef;
  if (imageRef.asset) {
    if (typeof imageRef.asset === 'object' && imageRef.asset !== null && 'url' in imageRef.asset) {
      return imageRef.asset.url;
    }
    return `/api/sanity/image?ref=${encodeURIComponent(
      typeof imageRef.asset === 'object' && imageRef.asset._ref
        ? imageRef.asset._ref
        : imageRef.asset
    )}`;
  }
  if ('url' in imageRef) return imageRef.url;
  return '/placeholder-imovel.jpg';
}

/**
 * Extrai o título da categoria de forma segura
 */
function extrairTituloCategoria(categoria: any): string | null {
  if (!categoria) return null;
  if (typeof categoria === 'object') {
    if ('categoriaTitulo' in categoria && categoria.categoriaTitulo) {
      return categoria.categoriaTitulo;
    }
    if ('titulo' in categoria && categoria.titulo) {
      return categoria.titulo;
    }
    if ('name' in categoria && categoria.name) {
      return categoria.name;
    }
    if ('_ref' in categoria) {
      return null;
    }
  }
  if (typeof categoria === 'string') {
    return categoria;
  }
  return null;
}

/**
 * Formata informações básicas do imóvel
 */
export function formatarImovelInfo(imovel: any) {
  if (!imovel) {
    console.error('Imóvel inválido ou ausente');
    return {
      id: 'invalid',
      slug: '',
      imagemUrl: '/placeholder-imovel.jpg',
      imagemAlt: 'Imóvel não disponível',
      endereco: '',
      titulo: 'Imóvel não disponível',
      categoria: null,
      preco: 0,
      destaque: false,
      status: 'indisponivel',
      finalidade: 'Venda',
      descricao: '',
      caracteristicas: {
        dormitorios: undefined,
        banheiros: undefined,
        vagas: undefined,
        areaUtil: undefined
      }
    };
  }
  const slug = typeof imovel.slug === 'string'
    ? imovel.slug
    : imovel.slug?.current || '';
  const imagemUrl = imovel.imagemUrl || extrairUrlImagem(imovel.imagem);
  const textoAlt = imovel.imagem?.alt || '';
  const endereco = [imovel.bairro, imovel.cidade, imovel.estado]
    .filter(Boolean)
    .join(', ');
  const categoria = extrairTituloCategoria(imovel.categoria);
  const titulo = imovel.titulo || `${categoria || 'Imóvel'} para ${imovel.finalidade || 'Venda'}`;
  return {
    id: imovel._id,
    slug,
    imagemUrl,
    imagemAlt: textoAlt || titulo,
    endereco,
    titulo,
    categoria,
    preco: imovel.preco,
    destaque: !!imovel.destaque,
    status: imovel.status || 'disponivel',
    finalidade: imovel.finalidade || 'Venda',
    descricao: imovel.descricao,
    caracteristicas: {
      dormitorios: imovel.dormitorios,
      banheiros: imovel.banheiros,
      vagas: imovel.vagas,
      areaUtil: imovel.areaUtil
    }
  };
}
