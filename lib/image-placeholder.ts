/**
 * Utilitário para criação de placeholder para imagens
 * Versão: 1.5 - Maio 2025
 */

import { imageLog } from './image-logger';

// Tipos de placeholders disponíveis
export type PlaceholderType = 'property' | 'error' | 'loading' | 'simple';

// Configuração para personalização de placeholders
export interface PlaceholderConfig {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    logo?: boolean; // Incluir logo da imobiliária
    pattern?: boolean; // Incluir padrão de fundo
}

// Configurações padrão para placeholders
const defaultConfig: PlaceholderConfig = {
    backgroundColor: '#f5f5f5',
    textColor: '#666666',
    borderColor: '#e0e0e0',
    logo: true,
    pattern: true
};

/**
 * Gera um placeholder visual para imóveis quando a imagem real não estiver disponível
 * Cria uma imagem SVG simples com texto personalizado
 */
export function generatePropertyPlaceholder(
    propertyTitle: string,
    width: number = 640,
    height: number = 480,
    config: Partial<PlaceholderConfig> = {}
): string {
    // Combinar configuração padrão com as configurações fornecidas
    const finalConfig = { ...defaultConfig, ...config };
    // Verificar se o título é válido
    if (!propertyTitle || typeof propertyTitle !== 'string') {
        imageLog.warn('Título de propriedade inválido para placeholder', {
            details: { providedTitle: String(propertyTitle) }
        });
        propertyTitle = 'Propriedade Ipê';
    }

    // Sanitizar e limitar o título para evitar problemas de segurança
    const safeTitle = propertyTitle
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    // Cortar o título se for muito longo
    const displayTitle = safeTitle.length > 40
        ? safeTitle.substring(0, 40) + '...'
        : safeTitle;    // Gerar o padrão de fundo (opcional)
    const patternDef = finalConfig.pattern ? `
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${finalConfig.borderColor}" stroke-width="0.5" opacity="0.3"/>
        </pattern>
      </defs>
    ` : '';

    // Gerar o logo (opcional)
    const logoSvg = finalConfig.logo ? `
      <g transform="translate(${width / 2 - 25}, ${height - 60})">
        <rect x="0" y="0" width="50" height="30" rx="5" fill="#588157" />
        <text x="25" y="20" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="white">
          IPÊ
        </text>
      </g>
    ` : '';

    // Gerar o SVG como um placeholder
    const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${patternDef}
      <rect width="${width}" height="${height}" fill="${finalConfig.backgroundColor}" stroke="${finalConfig.borderColor}" stroke-width="2"/>
      ${finalConfig.pattern ? `<rect width="${width}" height="${height}" fill="url(#grid)" opacity="0.3"/>` : ''}
      <rect x="10" y="10" width="${width - 20}" height="${height - 20}" rx="5" fill="white" stroke="${finalConfig.borderColor}" stroke-dasharray="5,5" fill-opacity="0.8"/>
      
      <!-- Ícone de imagem -->
      <g transform="translate(${width / 2 - 30}, ${height / 2 - 70})">
        <rect x="0" y="0" width="60" height="50" rx="5" stroke="${finalConfig.textColor}" stroke-width="2" fill="none"/>
        <circle cx="15" cy="15" r="6" fill="${finalConfig.textColor}"/>
        <polyline points="0,50 20,30 30,40 60,10 60,50" stroke="${finalConfig.textColor}" stroke-width="2" fill="none"/>
      </g>
      
      <text x="${width / 2}" y="${height / 2}" font-family="Arial" font-size="16" text-anchor="middle" fill="${finalConfig.textColor}">
        ${displayTitle}
      </text>
      
      ${logoSvg}
    </svg>
  `;

    // Converter para Data URL para uso em src de imagem
    const encoded = encodeURIComponent(svgContent);
    return `data:image/svg+xml,${encoded}`;
}

/**
 * Cria placehoulder visual com aspecto ratio correto para propriedades
 */
export function createPropertyPlaceholder(
    title: string = 'Imóvel',
    aspectRatio: string = '4:3',
    type: PlaceholderType = 'property'
): string {
    try {
        // Garantir que o aspect ratio é válido
        const parts = aspectRatio.split(':');
        if (parts.length !== 2) {
            imageLog.warn('Aspect ratio inválido para placeholder', {
                details: { providedRatio: aspectRatio }
            });
            aspectRatio = '4:3'; // Fallback para aspecto padrão
        }

        const [widthRatio, heightRatio] = aspectRatio.split(':').map(n => {
            const num = Number(n);
            return isNaN(num) || num <= 0 ? 1 : num;
        });

        const baseWidth = 800;
        const height = baseWidth * (heightRatio / widthRatio);

        // Configurações específicas por tipo de placeholder
        const configByType: Record<PlaceholderType, Partial<PlaceholderConfig>> = {
            property: {
                backgroundColor: '#f5f5f5',
                textColor: '#555555',
                borderColor: '#dddddd',
                pattern: true,
                logo: true
            },
            error: {
                backgroundColor: '#fff5f5',
                textColor: '#e53e3e',
                borderColor: '#feb2b2',
                pattern: false
            },
            loading: {
                backgroundColor: '#ebf8ff',
                textColor: '#3182ce',
                borderColor: '#bee3f8'
            },
            simple: {
                backgroundColor: '#f7fafc',
                textColor: '#718096',
                borderColor: '#e2e8f0',
                pattern: false,
                logo: false
            }
        };

        return generatePropertyPlaceholder(
            title,
            baseWidth,
            height,
            configByType[type]
        );
    } catch (error) {
        imageLog.error('Erro ao criar placeholder', {
            error,
            details: { title, aspectRatio }
        });

        // Retornar um placeholder simples em caso de erro
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%23f0f0f0"/%3E%3C/svg%3E';
    }
}
