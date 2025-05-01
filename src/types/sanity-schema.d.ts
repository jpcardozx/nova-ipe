import type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
} from "sanity-codegen";

export type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
};

/**
 * 🏡 Imóvel
 *
 *
 */
export interface Imovel extends SanityDocument {
  _type: "imovel";

  /**
   * Título do Imóvel — `string`
   *
   * Nome de exibição do imóvel (ex: Casa com quintal em Guararema)
   */
  titulo?: string;

  /**
   * Categoria — `reference`
   *
   *
   */
  categoria?: SanityReference<Categoria>;

  /**
   * Finalidade — `string`
   *
   *
   */
  finalidade?: "Venda" | "Aluguel" | "Temporada";

  /**
   * Descrição — `text`
   *
   *
   */
  descricao?: string;

  /**
   * 🛏️ Dormitórios — `number`
   *
   *
   */
  dormitorios?: number;

  /**
   * 🛁 Banheiros — `number`
   *
   *
   */
  banheiros?: number;

  /**
   * 📐 Área útil (m²) — `number`
   *
   *
   */
  areaUtil?: number;

  /**
   * 🚗 Vagas de garagem — `number`
   *
   *
   */
  vagas?: number;

  /**
   * 🏘️ Tipo de Imóvel — `string`
   *
   *
   */
  tipoImovel?: "Casa" | "Apartamento" | "Terreno" | "Comercial" | "Outro";

  /**
   * 💰 Preço (R$) — `number`
   *
   *
   */
  preco?: number;

  /**
   * 📍 Endereço completo — `string`
   *
   *
   */
  endereco?: string;

  /**
   * Bairro — `string`
   *
   *
   */
  bairro?: string;

  /**
   * Cidade — `string`
   *
   *
   */
  cidade?: string;

  /**
   * Estado (UF) — `string`
   *
   *
   */
  estado?: string;

  /**
   * 📄 Documentação OK? — `boolean`
   *
   *
   */
  documentacaoOk?: boolean;

  /**
   * 🏦 Aceita financiamento? — `boolean`
   *
   *
   */
  aceitaFinanciamento?: boolean;

  /**
   * Imagem Principal — `image`
   *
   *
   */
  imagem?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Link personalizado (ex: WhatsApp, formulário externo) — `url`
   *
   *
   */
  linkPersonalizado?: string;

  /**
   * Link do Google Maps — `url`
   *
   *
   */
  mapaLink?: string;

  /**
   * Imagem para Open Graph — `image`
   *
   *
   */
  imagemOpenGraph?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * URL amigável — `slug`
   *
   *
   */
  slug?: { _type: "slug"; current: string };

  /**
   * Título para Google — `string`
   *
   *
   */
  metaTitle?: string;

  /**
   * Descrição para redes sociais — `text`
   *
   *
   */
  metaDescription?: string;

  /**
   * 🏷️ Tags — `array`
   *
   *
   */
  tags?: Array<SanityKeyed<string>>;

  /**
   * ⭐ Imóvel em destaque? — `boolean`
   *
   *
   */
  destaque?: boolean;

  /**
   * 📊 Status — `string`
   *
   *
   */
  status?: "disponivel" | "reservado" | "vendido";

  /**
   * 👤 Responsável pelo cadastro — `string`
   *
   *
   */
  responsavel?: string;

  /**
   * ⏳ Expira em — `datetime`
   *
   *
   */
  dataDeExpiracao?: string;

  /**
   * 📡 Origem da campanha — `string`
   *
   *
   */
  origemLeadSugerida?: "whatsapp" | "instagram" | "google" | "indicacao";

  /**
   * 📈 Valor da campanha (R$) — `number`
   *
   *
   */
  valorCampanha?: number;

  /**
   * 🔐 Código interno — `string`
   *
   *
   */
  codigoInterno?: string;

  /**
   * 📝 Observações internas — `text`
   *
   *
   */
  observacoesInternas?: string;
}

/**
 * 📁 Categoria de Imóvel
 *
 *
 */
export interface Categoria extends SanityDocument {
  _type: "categoria";

  /**
   * Título da Categoria — `string`
   *
   * Ex: Casa, Apartamento, Terreno
   */
  titulo?: string;

  /**
   * Slug da URL — `slug`
   *
   *
   */
  slug?: { _type: "slug"; current: string };

  /**
   * 🟢 Categoria ativa? — `boolean`
   *
   * Controle de visibilidade no painel e filtros.
   */
  ativo?: boolean;

  /**
   * 📌 Ordem de exibição — `number`
   *
   * Menores valores aparecem primeiro no menu e nas listas.
   */
  ordem?: number;
}

export type Documents = Imovel | Categoria;
