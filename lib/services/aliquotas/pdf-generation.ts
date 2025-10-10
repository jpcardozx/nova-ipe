/**
 * Serviço de Geração de PDF
 * 
 * Gera PDFs profissionais de cartas de reajuste usando Puppeteer
 * com suporte a templates customizáveis e timbre corporativo
 */

import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency, formatPercentage, formatDate, formatDateLong } from './calculation';

export interface AdjustmentData {
  // IDs
  adjustment_id?: string;
  client_id: string;
  template_id?: string;
  
  // Cliente
  tenant_name: string;
  tenant_email: string;
  tenant_cpf?: string;
  
  // Imóvel
  property_address: string;
  property_code?: string;
  
  // Contrato
  contract_date: Date;
  last_adjustment_date?: Date;
  
  // Valores
  current_rent: number;
  new_rent: number;
  increase_amount: number;
  adjustment_percentage: number;
  
  // Valores adicionais
  iptu_value: number;
  condominium_value: number;
  other_charges: number;
  total_monthly: number;
  
  // Índice
  index_type: string;
  index_name: string;
  
  // Vigência
  effective_date: Date;
  
  // Assinatura
  manager_name?: string;
  manager_role?: string;
  manager_creci?: string;
  signature_image?: string;
  
  // Observações
  notes?: string;
}

export interface PDFTemplate {
  id: string;
  name: string;
  code: string;
  header_html: string;
  body_html: string;
  footer_html: string;
  styles_css: string;
  page_size: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface PDFGenerationResult {
  buffer: Buffer;
  size: number;
  generated_at: Date;
  pages: number;
}

/**
 * Registra helpers customizados do Handlebars
 */
function registerHandlebarsHelpers() {
  // Helper para formatação de moeda
  Handlebars.registerHelper('currency', function(value: number) {
    return formatCurrency(value);
  });

  // Helper para formatação de percentual
  Handlebars.registerHelper('percentage', function(value: number) {
    return formatPercentage(value);
  });

  // Helper para formatação de data
  Handlebars.registerHelper('date', function(value: Date) {
    return formatDate(value);
  });

  // Helper para data por extenso
  Handlebars.registerHelper('dateLong', function(value: Date) {
    return formatDateLong(value);
  });

  // Helper para uppercase
  Handlebars.registerHelper('upper', function(value: string) {
    return value?.toUpperCase() || '';
  });

  // Helper para lowercase
  Handlebars.registerHelper('lower', function(value: string) {
    return value?.toLowerCase() || '';
  });

  // Helper condicional de comparação
  Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });
}

/**
 * Prepara dados para o template
 */
function prepareTemplateData(data: AdjustmentData): Record<string, any> {
  const city = extractCityFromAddress(data.property_address);
  
  return {
    // Empresa (configurável via ENV ou banco)
    company_logo: process.env.NEXT_PUBLIC_COMPANY_LOGO || 'https://cdn.nova-ipe.com/logo.png',
    company_name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Imobiliária Ipê',
    company_address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Rua das Palmeiras, 456 - São Paulo/SP',
    company_phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '(11) 3456-7890',
    company_email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contato@imobiliariaipe.com.br',
    creci_number: process.env.NEXT_PUBLIC_CRECI_NUMBER || '12345-F',
    company_slogan: process.env.NEXT_PUBLIC_COMPANY_SLOGAN || 'Gestão Profissional de Imóveis',
    company_website: process.env.NEXT_PUBLIC_COMPANY_WEBSITE || 'www.imobiliariaipe.com.br',
    
    // Documento
    document_date: format(new Date(), 'dd/MM/yyyy', { locale: ptBR }),
    document_date_long: format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
    city,
    
    // Cliente
    client_name: data.tenant_name,
    client_email: data.tenant_email,
    client_cpf: data.tenant_cpf,
    
    // Imóvel
    property_address: data.property_address,
    property_code: data.property_code,
    
    // Contrato
    contract_date: formatDate(data.contract_date),
    contract_date_long: formatDateLong(data.contract_date),
    last_adjustment_date: data.last_adjustment_date ? formatDate(data.last_adjustment_date) : null,
    
    // Reajuste - valores brutos para cálculos
    current_rent_raw: data.current_rent,
    new_rent_raw: data.new_rent,
    increase_amount_raw: data.increase_amount,
    adjustment_percentage_raw: data.adjustment_percentage,
    
    // Reajuste - valores formatados
    current_rent: formatCurrency(data.current_rent),
    new_rent: formatCurrency(data.new_rent),
    increase_amount: formatCurrency(data.increase_amount),
    adjustment_percentage: formatPercentage(data.adjustment_percentage),
    
    // Índice
    index_type: data.index_type.toUpperCase(),
    index_name: data.index_name,
    
    // Vigência
    effective_date: formatDate(data.effective_date),
    effective_date_long: formatDateLong(data.effective_date),
    
    // Valores adicionais - brutos
    iptu_value_raw: data.iptu_value,
    condominium_value_raw: data.condominium_value,
    other_charges_raw: data.other_charges,
    total_monthly_raw: data.total_monthly,
    
    // Valores adicionais - formatados
    iptu_value: formatCurrency(data.iptu_value),
    condominium_value: formatCurrency(data.condominium_value),
    other_charges: formatCurrency(data.other_charges),
    total_monthly: formatCurrency(data.total_monthly),
    
    // Flags booleanas
    has_iptu: data.iptu_value > 0,
    has_condominium: data.condominium_value > 0,
    has_other_charges: data.other_charges > 0,
    has_property_code: !!data.property_code,
    has_notes: !!data.notes,
    
    // Assinatura
    manager_name: data.manager_name || 'Gerente Responsável',
    manager_role: data.manager_role || 'Gerente de Locações',
    manager_creci: data.manager_creci || process.env.NEXT_PUBLIC_CRECI_NUMBER || '12345-F',
    has_signature_image: !!data.signature_image,
    signature_image: data.signature_image || '',
    
    // Observações
    notes: data.notes,
    
    // Metadados
    adjustment_id: data.adjustment_id,
  };
}

/**
 * Extrai cidade do endereço
 */
function extractCityFromAddress(address: string): string {
  // Tenta extrair cidade do formato "Rua X, 123 - Bairro - Cidade/UF"
  const match = address.match(/[-–]\s*([^-–/]+?)\s*\/\s*[A-Z]{2}\s*$/);
  if (match) {
    return match[1].trim();
  }
  
  // Fallback para cidade padrão
  return 'São Paulo';
}

/**
 * Gera HTML completo do documento
 */
async function renderFullHTML(template: PDFTemplate, data: AdjustmentData): Promise<string> {
  // Registrar helpers
  registerHandlebarsHelpers();
  
  // Preparar dados
  const templateData = prepareTemplateData(data);
  
  // Compilar templates
  const headerTemplate = Handlebars.compile(template.header_html);
  const bodyTemplate = Handlebars.compile(template.body_html);
  const footerTemplate = Handlebars.compile(template.footer_html);
  
  // Renderizar seções
  const header = headerTemplate(templateData);
  const body = bodyTemplate(templateData);
  const footer = footerTemplate(templateData);
  
  // Montar HTML completo
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="author" content="${templateData.company_name}">
      <meta name="subject" content="Notificação de Reajuste de Aluguel">
      <title>Carta de Reajuste - ${data.tenant_name}</title>
      <style>${template.styles_css}</style>
    </head>
    <body>
      ${header}
      ${body}
      ${footer}
    </body>
    </html>
  `;
}

/**
 * Gera PDF usando Puppeteer
 */
export async function generateAdjustmentPDF(
  template: PDFTemplate,
  data: AdjustmentData
): Promise<PDFGenerationResult> {
  try {
    // Renderizar HTML
    const fullHtml = await renderFullHTML(template, data);
    
    // Configurar Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
    
    const page = await browser.newPage();
    
    // Definir conteúdo
    await page.setContent(fullHtml, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });
    
    // Gerar PDF
    const pdfBuffer = await page.pdf({
      format: template.page_size,
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: `${template.margins.top}mm`,
        right: `${template.margins.right}mm`,
        bottom: `${template.margins.bottom}mm`,
        left: `${template.margins.left}mm`,
      },
      displayHeaderFooter: false,
    });
    
    // Contar páginas
    const pages = await page.evaluate(() => {
      const pageHeight = document.documentElement.scrollHeight;
      const a4Height = 297 * 3.7795275591; // A4 height em pixels (96 DPI)
      return Math.ceil(pageHeight / a4Height);
    });
    
    await browser.close();
    
    return {
      buffer: Buffer.from(pdfBuffer),
      size: pdfBuffer.length,
      generated_at: new Date(),
      pages: pages || 1,
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Gera preview HTML (sem conversão para PDF)
 */
export async function generateHTMLPreview(
  template: PDFTemplate,
  data: AdjustmentData
): Promise<string> {
  return renderFullHTML(template, data);
}

/**
 * Gera slug para nome de arquivo
 */
export function generateFilename(tenant_name: string, adjustment_id?: string): string {
  const slug = tenant_name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const timestamp = Date.now();
  const id_suffix = adjustment_id ? `-${adjustment_id}` : '';
  
  return `reajuste-${slug}-${timestamp}${id_suffix}.pdf`;
}

/**
 * Valida template
 */
export function validateTemplate(template: PDFTemplate): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!template.header_html) {
    errors.push('Template header_html is required');
  }
  
  if (!template.body_html) {
    errors.push('Template body_html is required');
  }
  
  if (!template.styles_css) {
    errors.push('Template styles_css is required');
  }
  
  if (!['A4', 'Letter'].includes(template.page_size)) {
    errors.push('Invalid page_size. Must be A4 or Letter');
  }
  
  if (!['portrait', 'landscape'].includes(template.orientation)) {
    errors.push('Invalid orientation. Must be portrait or landscape');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
