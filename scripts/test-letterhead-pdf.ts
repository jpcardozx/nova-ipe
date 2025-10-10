/**
 * Script de teste: Gera PDF de exemplo com o timbre
 * 
 * Testa a integração completa do timbre com a carta de reajuste
 */

import { generateAdjustmentPDF } from '@/lib/services/aliquotas/pdf-generation';
import fs from 'fs';
import path from 'path';

async function testLetterhead() {
  console.log('🧪 TESTANDO GERAÇÃO DE PDF COM TIMBRE\n');
  
  // Template com timbre
  const template = {
    id: 'test-id',
    name: 'Carta Padrão com Timbre',
    code: 'standard_adjustment_letter',
    page_size: 'A4' as const,
    orientation: 'portrait' as const,
    margins: {
      top: 0,      // Sem margem no topo (timbre já tem)
      right: 0,
      bottom: 0,   // Sem margem no rodapé (timbre já tem)
      left: 0,
    },
    
    header_html: `
      <div class="letterhead-header">
        <img src="file:///home/jpcardozx/projetos/nova-ipe/public/letterhead/timbre-topo.png" class="timbre-topo" alt="Timbre Imobiliária Ipê" />
      </div>
    `,
    
    body_html: `
      <div class="content">
        <!-- TÍTULO CENTRALIZADO -->
        <h1 class="title">NOTIFICAÇÃO DE REAJUSTE DE ALUGUEL</h1>
        
        <!-- NOME DO TITULAR CENTRALIZADO -->
        <p class="recipient-name">{{client_name}}</p>
        
        <!-- INTRODUÇÃO PROFISSIONAL JUSTIFICADA À ESQUERDA -->
        <p class="intro">Prezado(a) Senhor(a),</p>
        
        <p class="intro">Conforme previsto no contrato de locação firmado em <strong>{{contract_date}}</strong>, referente ao imóvel situado em <strong>{{property_address}}</strong>, comunicamos o reajuste anual do valor do aluguel nos termos da legislação vigente.</p>
        
        <!-- DIVISOR HORIZONTAL -->
        <div class="divider"></div>
        
        <!-- TÍTULO DA TABELA CENTRALIZADO -->
        <h2 class="table-title">Demonstrativo do Reajuste</h2>
        
        <!-- TABELA DE VALORES -->
        <table class="values-table">
          <tbody>
            <tr>
              <td class="label">Índice Aplicado:</td>
              <td class="value">{{index_type}}</td>
            </tr>
            <tr>
              <td class="label">Percentual:</td>
              <td class="value">{{adjustment_percentage}}</td>
            </tr>
            <tr>
              <td class="label">Valor Atual do Aluguel:</td>
              <td class="value">R$ {{current_rent}}</td>
            </tr>
            <tr>
              <td class="label">Valor do Reajuste:</td>
              <td class="value">+ R$ {{increase_amount}}</td>
            </tr>
            <tr class="highlight">
              <td class="label"><strong>Novo Valor do Aluguel:</strong></td>
              <td class="value"><strong>R$ {{new_rent}}</strong></td>
            </tr>
            <tr>
              <td class="label">Data de Vigência:</td>
              <td class="value">{{effective_date}}</td>
            </tr>
            {{#if has_iptu}}
            <tr class="additional">
              <td class="label">IPTU (mensal):</td>
              <td class="value">R$ {{iptu_value}}</td>
            </tr>
            {{/if}}
            {{#if has_condominium}}
            <tr class="additional">
              <td class="label">Condomínio:</td>
              <td class="value">R$ {{condominium_value}}</td>
            </tr>
            {{/if}}
            <tr class="total">
              <td class="label"><strong>TOTAL MENSAL:</strong></td>
              <td class="value"><strong>R$ {{total_monthly}}</strong></td>
            </tr>
          </tbody>
        </table>
        
        <!-- FECHAMENTO PROFISSIONAL JUSTIFICADO À ESQUERDA -->
        <p class="closing-text">O novo valor entrará em vigor a partir da data supracitada, conforme estabelecido em contrato e nos termos da Lei nº 8.245/1991 (Lei do Inquilinato).</p>
        
        <p class="closing-text">Permanecemos à disposição para eventuais esclarecimentos.</p>
        
        <p class="regards">Atenciosamente,</p>
        
        <!-- ASSINATURA CENTRALIZADA -->
        <div class="signature-block">
          <div class="signature-line"></div>
          <p class="signatory-name">{{manager_name}}</p>
          <p class="signatory-creci">CRECI: {{manager_creci}}</p>
        </div>
      </div>
    `,
    
    footer_html: `
      <div class="letterhead-footer">
        <img src="file:///home/jpcardozx/projetos/nova-ipe/public/letterhead/timbre-rodape.png" class="timbre-rodape" alt="Rodapé Imobiliária Ipê" />
      </div>
    `,
    
    styles_css: `
      @page {
        size: A4;
        margin: 0;
      }
      
      body {
        font-family: 'Arial', 'Helvetica', sans-serif;
        font-size: 12pt;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
      }
      
      /* TIMBRE TOPO */
      .letterhead-header {
        width: 100%;
        margin: 0;
        padding: 0;
        text-align: center;
      }
      
      .letterhead-header .timbre-topo {
        width: 100%;
        height: auto;
        display: block;
        margin: 0;
        padding: 0;
      }
      
      /* CONTEÚDO DA CARTA */
      .content {
        padding: 20px 50px 15px 50px;
        margin: 0;
      }
      
      /* TÍTULO CENTRALIZADO */
      .title {
        text-align: center;
        color: #0066cc;
        font-size: 14pt;
        margin: 15px 0 20px 0;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 700;
      }
      
      /* NOME DO TITULAR CENTRALIZADO */
      .recipient-name {
        text-align: center;
        font-size: 12pt;
        font-weight: 600;
        color: #333;
        margin: 0 0 20px 0;
      }
      
      /* INTRODUÇÃO JUSTIFICADA À ESQUERDA */
      .intro {
        text-align: left;
        margin: 8px 0;
        font-size: 10pt;
        line-height: 1.5;
        color: #333;
      }
      
      /* DIVISOR HORIZONTAL BONITO */
      .divider {
        width: 100%;
        height: 2px;
        background: linear-gradient(to right, #0066cc, #66b3ff, #0066cc);
        margin: 20px 0;
        border-radius: 2px;
      }
      
      /* TÍTULO DA TABELA CENTRALIZADO */
      .table-title {
        text-align: center;
        font-size: 12pt;
        font-weight: 600;
        color: #0066cc;
        margin: 15px 0 12px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      /* TABELA DE VALORES */
      .values-table {
        width: 100%;
        border-collapse: collapse;
        margin: 0 0 15px 0;
        border: 1px solid #ddd;
        background: white;
      }
      
      .values-table td {
        padding: 8px 15px;
        border-bottom: 1px solid #eee;
        font-size: 10pt;
      }
      
      .values-table tr:last-child td {
        border-bottom: none;
      }
      
      .values-table .label {
        width: 60%;
        text-align: left;
        color: #666;
      }
      
      .values-table .value {
        width: 40%;
        text-align: right;
        color: #333;
        font-weight: 500;
      }
      
      .values-table tr.highlight {
        background: #e3f2fd;
      }
      
      .values-table tr.highlight td {
        font-size: 11pt;
        color: #0066cc;
      }
      
      .values-table tr.additional {
        background: #f8f9fa;
      }
      
      .values-table tr.total {
        background: #0066cc;
        color: white;
        border-top: 2px solid #004999;
      }
      
      .values-table tr.total td {
        color: white;
        font-size: 11pt;
        padding: 10px 15px;
      }
      
      /* FECHAMENTO JUSTIFICADO À ESQUERDA */
      .closing-text {
        text-align: left;
        margin: 12px 0 8px 0;
        font-size: 10pt;
        line-height: 1.5;
        color: #333;
      }
      
      .regards {
        text-align: left;
        margin: 25px 0 5px 0;
        font-size: 10pt;
        color: #333;
      }
      
      /* ASSINATURA CENTRALIZADA */
      .signature-block {
        margin: 40px auto 10px auto;
        text-align: center;
        max-width: 300px;
      }
      
      .signature-line {
        width: 100%;
        height: 1px;
        background: #333;
        margin: 0 0 8px 0;
      }
      
      .signatory-name {
        font-weight: 600;
        font-size: 11pt;
        margin: 5px 0 3px 0;
        color: #333;
      }
      
      .signatory-creci {
        font-size: 9pt;
        color: #666;
        margin: 0;
      }
      
      /* TIMBRE RODAPÉ */
      .letterhead-footer {
        width: 100%;
        margin: 0;
        padding: 0;
        text-align: center;
        page-break-inside: avoid;
      }
      
      .letterhead-footer .timbre-rodape {
        width: 100%;
        height: auto;
        display: block;
        margin: 0;
        padding: 0;
      }
      
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        
        .letterhead-header,
        .letterhead-footer {
          page-break-inside: avoid;
        }
      }
    `,
  };
  
  // Dados de exemplo
  const testData = {
    adjustment_id: 'test-123',
    client_id: 'client-456',
    tenant_name: 'Maria Silva Santos',
    tenant_email: 'maria.silva@email.com',
    tenant_cpf: '123.456.789-00',
    property_address: 'Rua das Flores, 123 - Apartamento 45 - Jardim Paulista - São Paulo/SP',
    property_code: 'IPE-2024-001',
    contract_date: new Date('2023-11-01'),
    last_adjustment_date: new Date('2024-11-01'),
    current_rent: 2500,
    new_rent: 2612.50,
    increase_amount: 112.50,
    adjustment_percentage: 4.5,
    iptu_value: 150,
    condominium_value: 350,
    other_charges: 0,
    total_monthly: 3112.50,
    index_type: 'IGPM',
    index_name: 'Índice Geral de Preços do Mercado',
    effective_date: new Date('2025-11-01'),
    manager_name: 'João Paulo Cardoso',
    manager_role: 'Gerente de Locações',
    manager_creci: '12345-F',
  };
  
  console.log('📝 Gerando PDF de teste...\n');
  
  try {
    const result = await generateAdjustmentPDF(template, testData);
    
    const outputPath = path.join(process.cwd(), 'test-output', 'carta-reajuste-com-timbre.pdf');
    
    // Criar diretório se não existir
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Salvar PDF
    fs.writeFileSync(outputPath, result.buffer);
    
    console.log('✅ PDF gerado com sucesso!\n');
    console.log(`📁 Localização: ${outputPath}`);
    console.log(`📊 Tamanho: ${(result.size / 1024).toFixed(2)} KB`);
    console.log(`📄 Páginas: ${result.pages}\n`);
    console.log('🎉 Abra o PDF para visualizar o resultado!\n');
    
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    throw error;
  }
}

// Executar
testLetterhead().catch(console.error);
