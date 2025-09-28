// PDF generation service for Alíquotas (Tax Rates) documents
// This service generates PDF documents for rent adjustments based on reference rates and IPTU

interface Property {
  id: string;
  address: string;
  tenant: string;
  currentRent: number;
  iptu: number;
  referenceRate: number;
  newRent: number;
  status: 'pending' | 'approved' | 'sent';
  lastUpdate: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface PDFGenerationOptions {
  properties: Property[];
  client?: Client;
  includeLetterhead: boolean;
  includeCalculations: boolean;
  month: string;
  year: string;
}

export class AliquotasPDFService {
  /**
   * Generate PDF for rent adjustments
   * In a real implementation, this would use a PDF library like jsPDF, PDFKit, or Puppeteer
   */
  static async generatePDF(options: PDFGenerationOptions): Promise<Blob> {
    const {
      properties,
      client,
      includeLetterhead = true,
      includeCalculations = true,
      month,
      year
    } = options;

    // Mock PDF generation - in production, use a proper PDF library
    const pdfContent = this.generatePDFContent(options);
    
    // Simulate PDF generation
    console.log('Generating PDF with content:', pdfContent);
    
    // Return a mock blob - in production, return actual PDF blob
    const mockPdfBlob = new Blob([pdfContent], { type: 'application/pdf' });
    
    return mockPdfBlob;
  }

  /**
   * Generate HTML content that would be converted to PDF
   */
  private static generatePDFContent(options: PDFGenerationOptions): string {
    const { properties, client, includeLetterhead, month, year } = options;
    
    const letterhead = includeLetterhead ? this.generateLetterhead() : '';
    const propertyTable = this.generatePropertyTable(properties);
    const calculations = this.generateCalculationsSummary(properties);
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reajuste de Aluguel - ${month}/${year}</title>
          <style>
            ${this.getPDFStyles()}
          </style>
        </head>
        <body>
          ${letterhead}
          
          <div class="document-header">
            <h1>Comunicado de Reajuste de Aluguel</h1>
            <p class="date">Referente ao período: ${month}/${year}</p>
            ${client ? `<p class="client">Destinatário: ${client.name}</p>` : ''}
          </div>

          <div class="content">
            <p class="intro">
              Prezado(a) ${client?.name || 'Cliente'},
            </p>
            
            <p>
              Conforme previsto em contrato, comunicamos o reajuste dos valores de aluguel 
              para o mês de ${month}/${year}, calculado com base nas taxas de referência 
              do mercado e valores de IPTU atualizados.
            </p>

            ${propertyTable}
            ${calculations}

            <div class="footer-text">
              <p>
                Os novos valores entrarão em vigor a partir do próximo vencimento.
                Para dúvidas ou esclarecimentos, entre em contato conosco.
              </p>
              
              <p class="signature">
                Atenciosamente,<br>
                <strong>Ipê Imóveis</strong><br>
                Administração Predial
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static generateLetterhead(): string {
    return `
      <div class="letterhead">
        <div class="company-info">
          <h2>IPÊ IMÓVEIS</h2>
          <p>Serviços Imobiliários</p>
          <div class="contact-info">
            <p>📍 Guararema - SP</p>
            <p>📞 (11) 4693-3003</p>
            <p>📧 contato@ipeimoveis.com.br</p>
          </div>
        </div>
        <div class="logo-space">
          <!-- Logo would go here -->
          <div class="logo-placeholder">IPÊ</div>
        </div>
      </div>
    `;
  }

  private static generatePropertyTable(properties: Property[]): string {
    const rows = properties.map(property => `
      <tr>
        <td>${property.address}</td>
        <td>${property.tenant}</td>
        <td class="currency">R$ ${property.currentRent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td class="currency">R$ ${property.iptu.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td class="percentage">${(property.referenceRate * 100).toFixed(2)}%</td>
        <td class="currency highlight">R$ ${property.newRent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td class="currency increase">+R$ ${(property.newRent - property.currentRent).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
      </tr>
    `).join('');

    return `
      <div class="table-section">
        <h3>Detalhamento dos Reajustes</h3>
        <table class="properties-table">
          <thead>
            <tr>
              <th>Imóvel</th>
              <th>Inquilino</th>
              <th>Aluguel Atual</th>
              <th>IPTU</th>
              <th>Taxa Ref.</th>
              <th>Novo Aluguel</th>
              <th>Aumento</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  private static generateCalculationsSummary(properties: Property[]): string {
    const totalCurrentRent = properties.reduce((sum, p) => sum + p.currentRent, 0);
    const totalNewRent = properties.reduce((sum, p) => sum + p.newRent, 0);
    const totalIncrease = totalNewRent - totalCurrentRent;
    const averageIncrease = properties.length > 0 ? (totalIncrease / totalCurrentRent) * 100 : 0;

    return `
      <div class="calculations-section">
        <h3>Resumo dos Cálculos</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <label>Total Aluguel Atual:</label>
            <span class="value">R$ ${totalCurrentRent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div class="summary-item">
            <label>Total Novo Aluguel:</label>
            <span class="value highlight">R$ ${totalNewRent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div class="summary-item">
            <label>Aumento Total:</label>
            <span class="value increase">R$ ${totalIncrease.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div class="summary-item">
            <label>Percentual Médio:</label>
            <span class="value">${averageIncrease.toFixed(2)}%</span>
          </div>
        </div>
        
        <div class="methodology">
          <h4>Metodologia de Cálculo</h4>
          <ul>
            <li>Taxa de referência aplicada sobre o valor atual do aluguel</li>
            <li>Acréscimo proporcional do IPTU conforme legislação municipal</li>
            <li>Valores baseados em índices de mercado atualizados</li>
          </ul>
        </div>
      </div>
    `;
  }

  private static getPDFStyles(): string {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Arial', sans-serif;
        font-size: 12px;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      
      .letterhead {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 3px solid #f97316;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      
      .company-info h2 {
        color: #f97316;
        font-size: 24px;
        font-weight: bold;
      }
      
      .company-info p {
        color: #666;
        margin: 5px 0;
      }
      
      .contact-info {
        margin-top: 10px;
      }
      
      .contact-info p {
        font-size: 10px;
        margin: 2px 0;
      }
      
      .logo-placeholder {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #f97316, #ea580c);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 18px;
      }
      
      .document-header {
        text-align: center;
        margin-bottom: 30px;
        padding: 20px;
        background: #f8fafc;
        border-radius: 8px;
      }
      
      .document-header h1 {
        color: #1e293b;
        font-size: 20px;
        margin-bottom: 10px;
      }
      
      .date, .client {
        color: #64748b;
        font-size: 14px;
        margin: 5px 0;
      }
      
      .content {
        margin: 30px 0;
      }
      
      .intro {
        font-weight: bold;
        margin-bottom: 20px;
      }
      
      .table-section {
        margin: 30px 0;
      }
      
      .table-section h3 {
        color: #1e293b;
        margin-bottom: 15px;
        padding-bottom: 5px;
        border-bottom: 2px solid #f97316;
      }
      
      .properties-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      
      .properties-table th,
      .properties-table td {
        padding: 8px 12px;
        text-align: left;
        border: 1px solid #e2e8f0;
      }
      
      .properties-table th {
        background: #f1f5f9;
        font-weight: bold;
        color: #1e293b;
        font-size: 11px;
      }
      
      .properties-table td {
        font-size: 10px;
      }
      
      .currency {
        text-align: right;
      }
      
      .percentage {
        text-align: center;
      }
      
      .highlight {
        background: #fef3c7;
        font-weight: bold;
      }
      
      .increase {
        color: #059669;
        font-weight: bold;
      }
      
      .calculations-section {
        margin: 30px 0;
        padding: 20px;
        background: #f8fafc;
        border-radius: 8px;
      }
      
      .calculations-section h3 {
        color: #1e293b;
        margin-bottom: 15px;
      }
      
      .summary-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin: 20px 0;
      }
      
      .summary-item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        background: white;
        border-radius: 4px;
        border-left: 4px solid #f97316;
      }
      
      .summary-item label {
        font-weight: bold;
        color: #64748b;
      }
      
      .summary-item .value {
        font-weight: bold;
        color: #1e293b;
      }
      
      .methodology {
        margin-top: 20px;
      }
      
      .methodology h4 {
        color: #1e293b;
        margin-bottom: 10px;
      }
      
      .methodology ul {
        padding-left: 20px;
      }
      
      .methodology li {
        margin: 5px 0;
        color: #64748b;
      }
      
      .footer-text {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #e2e8f0;
      }
      
      .signature {
        margin-top: 30px;
        text-align: right;
      }
      
      @media print {
        body {
          padding: 0;
        }
        
        .letterhead {
          page-break-inside: avoid;
        }
        
        .properties-table {
          page-break-inside: avoid;
        }
      }
    `;
  }

  /**
   * Download PDF file
   */
  static async downloadPDF(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Send PDF via email (mock implementation)
   * In production, this would integrate with your email service (Zoho, etc.)
   */
  static async sendPDFByEmail(
    blob: Blob, 
    client: Client, 
    subject: string, 
    message: string
  ): Promise<boolean> {
    try {
      // Mock email sending - integrate with your email service
      console.log('Sending PDF via email:', {
        to: client.email,
        subject,
        message,
        attachment: blob
      });

      // Simulate API call to email service
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, integrate with Supabase to log the transaction
      await this.logTransaction(client, 'pdf_sent', {
        subject,
        filename: `aliquotas_${new Date().toISOString().split('T')[0]}.pdf`,
        fileSize: blob.size
      });

      return true;
    } catch (error) {
      console.error('Failed to send PDF:', error);
      return false;
    }
  }

  /**
   * Log transaction in Supabase CRM
   * This connects with the crm_clients table mentioned in the requirements
   */
  private static async logTransaction(
    client: Client,
    transactionType: string,
    data: any
  ): Promise<void> {
    try {
      // Mock Supabase transaction logging
      // In production, use actual Supabase client
      console.log('Logging transaction to Supabase:', {
        client_id: client.id,
        transaction_type: transactionType,
        transaction_data: data,
        timestamp: new Date().toISOString()
      });

      // Example Supabase code:
      // const { error } = await supabase
      //   .from('client_transactions')
      //   .insert({
      //     client_id: client.id,
      //     transaction_type: transactionType,
      //     transaction_data: data,
      //     created_at: new Date().toISOString()
      //   });

    } catch (error) {
      console.error('Failed to log transaction:', error);
    }
  }
}

// Export utility functions
export const generateAliquotasPDF = AliquotasPDFService.generatePDF;
export const downloadAliquotasPDF = AliquotasPDFService.downloadPDF;
export const sendAliquotasPDF = AliquotasPDFService.sendPDFByEmail;