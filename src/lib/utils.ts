// src/lib/utils.ts
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
  // Valor padrão caso undefined ou null
  if (valor === undefined || valor === null) {
    return '';
  }

  // Valores padrão
  const {
    moeda = 'BRL',
    exibirSimbolo = true,
    casasDecimais = 2,
    separadorDecimal = ',',
    separadorMilhar = '.'
  } = opcoes;

  try {
    // Determina o símbolo da moeda baseado no código
    const simbolos: Record<string, string> = {
      'BRL': 'R$',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    };

    // Usa o código da moeda diretamente se não houver símbolo definido
    const simbolo = simbolos[moeda] || moeda;

    // Formata o número
    const parteInteira = Math.floor(Math.abs(valor));
    const parteDecimal = Math.round(
      (Math.abs(valor) - parteInteira) * Math.pow(10, casasDecimais)
    ).toString().padStart(casasDecimais, '0');

    // Formata parte inteira com separador de milhar
    const parteInteiraFormatada = parteInteira
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, separadorMilhar);

    // Monta o valor formatado
    const valorFormatado = `${parteInteiraFormatada}${separadorDecimal}${parteDecimal}`;

    // Adiciona o símbolo da moeda, se solicitado
    return `${valor < 0 ? '-' : ''}${exibirSimbolo ? `${simbolo} ` : ''}${valorFormatado}`;
  } catch (error) {
    console.error('Erro ao formatar moeda:', error);
    // Fallback para formatação básica
    return exibirSimbolo ? `R$ ${valor}` : `${valor}`;
  }
}

/**
 * Extrai URL de imagem do objeto Sanity
 * @param imageRef Referência de imagem do Sanity
 * @returns URL da imagem ou imagem padrão
 */
function extrairUrlImagem(imageRef: any): string {
  // Placeholder padrão
  if (!imageRef) return '/placeholder-imovel.jpg';

  // Casos possíveis de estrutura da imagem
  if (typeof imageRef === 'string') return imageRef;

  // Normalização da API do Sanity
  if (imageRef.asset) {
    // Caso 1: imageRef.asset é um objeto com propriedade url
    if (typeof imageRef.asset === 'object' && imageRef.asset !== null && 'url' in imageRef.asset) {
      return imageRef.asset.url;
    }

    // Caso 2: Sanity pode retornar uma referência que precisa ser processada no frontend
    return `/api/sanity/image?ref=${encodeURIComponent(
      typeof imageRef.asset === 'object' && imageRef.asset._ref
        ? imageRef.asset._ref
        : imageRef.asset
    )}`;
  }

  // Para o caso em que a API já normalizou os dados com uma URL
  if ('url' in imageRef) return imageRef.url;

  // Fallback para placeholder
  return '/placeholder-imovel.jpg';
}

/**
 * Extrai o título da categoria de forma segura
 * @param categoria Objeto categoria do Sanity
 * @returns Título da categoria ou null
 */
function extrairTituloCategoria(categoria: any): string | null {
  if (!categoria) return null;

  // Se categoria for um objeto completo
  if (typeof categoria === 'object') {
    // Checar propriedades possíveis em ordem de preferência
    if ('categoriaTitulo' in categoria && categoria.categoriaTitulo) {
      return categoria.categoriaTitulo;
    }

    if ('titulo' in categoria && categoria.titulo) {
      return categoria.titulo;
    }

    if ('name' in categoria && categoria.name) {
      return categoria.name;
    }

    // Se categoria.ref existe, pode ser uma referência não resolvida
    if ('_ref' in categoria) {
      return null; // Sem informação disponível para extrair
    }
  }

  // Se categoria é string, retornar ela diretamente
  if (typeof categoria === 'string') {
    return categoria;
  }

  return null;
}

/**
 * Formata informações básicas do imóvel
 * @param imovel - Objeto com dados do imóvel
 * @returns Objeto normalizado com dados do imóvel
 */
export function formatarImovelInfo(imovel: any) {
  // Validação de entrada
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

  // Extrai e normaliza campos para apresentação consistente
  const slug = typeof imovel.slug === 'string'
    ? imovel.slug
    : imovel.slug?.current || '';

  // Processamento de imagens adaptado à estrutura real
  const imagemUrl = imovel.imagemUrl || extrairUrlImagem(imovel.imagem);

  // Processamento de texto alternativo
  const textoAlt = imovel.imagem?.alt || '';

  // Montagem do endereço
  const endereco = [imovel.bairro, imovel.cidade, imovel.estado]
    .filter(Boolean)
    .join(', ');

  // Extrair título da categoria
  const categoria = extrairTituloCategoria(imovel.categoria);

  // Montagem do título do imóvel
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