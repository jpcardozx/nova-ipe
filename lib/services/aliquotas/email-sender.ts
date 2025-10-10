/**
 * Serviço de Envio de Email
 * 
 * Envia cartas de reajuste por email com PDF anexado
 * Suporta templates HTML responsivos
 */

import nodemailer from 'nodemailer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from './calculation';

export interface EmailData {
  // Destinatário
  recipient_email: string;
  recipient_name: string;
  
  // Reajuste
  property_address: string;
  current_rent: number;
  new_rent: number;
  adjustment_percentage: number;
  effective_date: Date;
  index_type: string;
  
  // PDF
  pdf_url: string;
  pdf_filename: string;
  
  // Opcional
  notes?: string;
  cc_emails?: string[];
  bcc_emails?: string[];
}

export interface EmailResult {
  sent: boolean;
  message_id: string;
  sent_at: Date;
  recipient: string;
}

/**
 * Cria transporter do Nodemailer
 */
function createTransporter() {
  // Verificar configuração
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP credentials not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.');
  }
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para outros
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Gera HTML do email
 */
function generateEmailHTML(data: EmailData): string {
  const company_name = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Imobiliária Ipê';
  const company_logo = process.env.NEXT_PUBLIC_COMPANY_LOGO || 'https://cdn.nova-ipe.com/logo.png';
  const company_phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '(11) 3456-7890';
  const company_email = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contato@imobiliariaipe.com.br';
  const company_website = process.env.NEXT_PUBLIC_COMPANY_WEBSITE || 'www.imobiliariaipe.com.br';
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notificação de Reajuste de Aluguel</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #0066cc 0%, #004999 100%);
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .email-header img {
      max-height: 60px;
      margin-bottom: 15px;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .email-body {
      padding: 30px 20px;
      background: #ffffff;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .property-box {
      background: #f8f9fa;
      border-left: 4px solid #0066cc;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .property-box strong {
      color: #0066cc;
    }
    .values-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: #f8f9fa;
      border-radius: 8px;
      overflow: hidden;
    }
    .values-table th {
      background: #0066cc;
      color: #ffffff;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    .values-table td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    .values-table tr:last-child td {
      border-bottom: none;
    }
    .highlight-row {
      background: #e3f2fd;
      font-weight: 600;
    }
    .cta-button {
      display: inline-block;
      padding: 14px 28px;
      background: #0066cc;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .cta-button:hover {
      background: #0052a3;
    }
    .info-box {
      background: #fff9e6;
      border-left: 3px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      font-size: 14px;
    }
    .email-footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #666;
      border-top: 1px solid #e0e0e0;
    }
    .email-footer a {
      color: #0066cc;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background: #e0e0e0;
      margin: 30px 0;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }
      .email-body {
        padding: 20px 15px;
      }
      .values-table {
        font-size: 14px;
      }
      .values-table th,
      .values-table td {
        padding: 8px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
      <img src="${company_logo}" alt="${company_name}">
      <h1>Notificação de Reajuste de Aluguel</h1>
    </div>
    
    <!-- Body -->
    <div class="email-body">
      <p class="greeting">Prezado(a) <strong>${data.recipient_name}</strong>,</p>
      
      <p>Segue em anexo a <strong>notificação oficial de reajuste</strong> do valor do aluguel do imóvel localizado em:</p>
      
      <div class="property-box">
        <strong>📍 Endereço:</strong><br>
        ${data.property_address}
      </div>
      
      <p><strong>📊 Resumo do Reajuste:</strong></p>
      
      <table class="values-table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th style="text-align: right;">Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Valor atual do aluguel</td>
            <td style="text-align: right;">${formatCurrency(data.current_rent)}</td>
          </tr>
          <tr>
            <td>Índice aplicado (${data.index_type.toUpperCase()})</td>
            <td style="text-align: right;">${data.adjustment_percentage.toFixed(2).replace('.', ',')}%</td>
          </tr>
          <tr class="highlight-row">
            <td><strong>Novo valor do aluguel</strong></td>
            <td style="text-align: right;"><strong>${formatCurrency(data.new_rent)}</strong></td>
          </tr>
          <tr>
            <td>Data de vigência</td>
            <td style="text-align: right;">${format(data.effective_date, 'dd/MM/yyyy', { locale: ptBR })}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="info-box">
        ℹ️ <strong>Importante:</strong> O novo valor entrará em vigor a partir de <strong>${format(data.effective_date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</strong>, conforme previsto no contrato de locação.
      </div>
      
      ${data.notes ? `
      <p><strong>📝 Observações:</strong></p>
      <p>${data.notes}</p>
      ` : ''}
      
      <div style="text-align: center;">
        <a href="${data.pdf_url}" class="cta-button">
          📥 Baixar Carta Completa (PDF)
        </a>
      </div>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: #666;">
        O documento completo com todos os detalhes legais está anexado a este email e também pode ser baixado através do link acima.
      </p>
      
      <p>Para dúvidas ou esclarecimentos, estamos à disposição através dos nossos canais de atendimento.</p>
    </div>
    
    <!-- Footer -->
    <div class="email-footer">
      <p><strong>${company_name}</strong></p>
      <p>
        📞 ${company_phone} | 
        📧 <a href="mailto:${company_email}">${company_email}</a>
      </p>
      <p>
        🌐 <a href="https://${company_website}">${company_website}</a>
      </p>
      <p style="font-size: 12px; color: #999; margin-top: 15px;">
        Este é um email automático de notificação. Por favor, não responda diretamente.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Envia email com carta de reajuste
 */
export async function sendAdjustmentEmail(data: EmailData): Promise<EmailResult> {
  try {
    const transporter = createTransporter();
    
    const emailHTML = generateEmailHTML(data);
    
    const company_name = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Imobiliária Ipê';
    const from_email = process.env.SMTP_FROM || process.env.SMTP_USER;
    
    const mailOptions = {
      from: `"${company_name}" <${from_email}>`,
      to: data.recipient_email,
      cc: data.cc_emails?.join(', '),
      bcc: data.bcc_emails?.join(', '),
      subject: `Notificação de Reajuste de Aluguel - ${data.property_address}`,
      html: emailHTML,
      attachments: [
        {
          filename: data.pdf_filename,
          path: data.pdf_url,
        },
      ],
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    return {
      sent: true,
      message_id: info.messageId,
      sent_at: new Date(),
      recipient: data.recipient_email,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Envia email de teste
 */
export async function sendTestEmail(recipient: string): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    const company_name = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Imobiliária Ipê';
    const from_email = process.env.SMTP_FROM || process.env.SMTP_USER;
    
    await transporter.sendMail({
      from: `"${company_name}" <${from_email}>`,
      to: recipient,
      subject: 'Teste de Configuração de Email - Sistema de Reajustes',
      html: `
        <h1>Email de Teste</h1>
        <p>Se você recebeu este email, a configuração SMTP está funcionando corretamente!</p>
        <p>Sistema de Geração de Cartas de Reajuste - ${company_name}</p>
      `,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    return false;
  }
}

/**
 * Verifica se SMTP está configurado
 */
export function isSMTPConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
}

/**
 * Valida email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
