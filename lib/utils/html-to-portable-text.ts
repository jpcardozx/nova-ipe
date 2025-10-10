/**
 * Converte HTML para Portable Text (formato do Sanity)
 * 
 * HTML do WordPress → Portable Text do Sanity
 * 
 * ⚠️ SERVER-SIDE ONLY - não pode rodar no browser
 * Simplificado para não usar jsdom (causa erro de build)
 */

/**
 * Converte HTML para Portable Text
 * @param html - String HTML (pode conter tags, formatação, etc)
 * @returns Array de blocks do Portable Text
 */
export function convertHtmlToPortableText(html: string | null | undefined): any[] {
  // Se não tiver HTML ou for vazio
  if (!html || html === '0' || html.trim() === '') {
    return [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '', marks: [] }],
      },
    ]
  }

  try {
    // Limpar HTML comum do WordPress
    let cleanHtml = html
      .replace(/<br\s*\/?>/gi, '\n') // <br> → quebra de linha
      .replace(/<\/p><p>/gi, '\n\n') // </p><p> → parágrafo novo
      .replace(/&nbsp;/gi, ' ') // &nbsp; → espaço
      .replace(/&quot;/gi, '"') // &quot; → "
      .replace(/&amp;/gi, '&') // &amp; → &
      .trim()

    // Se depois de limpar não sobrou nada útil
    if (cleanHtml === '' || cleanHtml === '<p></p>') {
      return [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: '', marks: [] }],
        },
      ]
    }

    // Remover todas as tags HTML e converter para texto simples
    const plainText = cleanHtml
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (!plainText) {
      return [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: '', marks: [] }],
        },
      ]
    }

    // Quebrar em parágrafos (por linha dupla)
    const paragraphs = plainText.split(/\n\n+/).filter((p) => p.trim())

    if (paragraphs.length === 0) {
      return [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: plainText, marks: [] }],
        },
      ]
    }

    return paragraphs.map((paragraph) => ({
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: paragraph.trim(), marks: [] }],
    }))
  } catch (error) {
    console.warn('Erro ao converter HTML para Portable Text:', error)

    // Fallback: texto simples sem formatação
    const plainText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

    if (!plainText) {
      return [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: '', marks: [] }],
        },
      ]
    }

    // Retornar como bloco único
    return [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: plainText, marks: [] }],
      },
    ]
  }
}

/**
 * Converte texto simples para Portable Text
 * @param text - String de texto simples
 * @returns Array de blocks do Portable Text
 */
export function textToPortableText(text: string | null | undefined): any[] {
  if (!text || text.trim() === '') {
    return [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '', marks: [] }],
      },
    ]
  }

  // Quebrar em parágrafos (por linha vazia)
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim())

  if (paragraphs.length === 0) {
    return [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: text.trim(), marks: [] }],
      },
    ]
  }

  return paragraphs.map((paragraph) => ({
    _type: 'block',
    style: 'normal',
    children: [
      {
        _type: 'span',
        text: paragraph.trim(),
        marks: [],
      },
    ],
  }))
}
