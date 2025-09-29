export interface ZohoEmailData {
  to: string | string[]
  subject: string
  htmlbody: string
  textbody?: string
  from?: {
    address: string
    name?: string
  }
  attachments?: Array<{
    filename: string
    content: string
    mime_type: string
  }>
  template_key?: string
  template_alias?: string
  merge_info?: Record<string, any>
}

export interface ZohoEmailResponse {
  data: Array<{
    code: string
    details: any
    message: string
  }>
  object: string
}

export class ZohoEmailService {
  private static readonly BASE_URL = 'https://zeptomail.zoho.com/v1.1'
  private static readonly TOKEN = process.env.ZOHO_ZEPTO_TOKEN

  static async sendEmail(emailData: ZohoEmailData): Promise<ZohoEmailResponse> {
    if (!this.TOKEN) {
      throw new Error('ZOHO_ZEPTO_TOKEN não está configurado nas variáveis de ambiente')
    }

    const payload = {
      from: emailData.from || {
        address: process.env.ZOHO_FROM_EMAIL || 'noreply@ipe-imoveis.com.br',
        name: 'IPÊ IMÓVEIS'
      },
      to: Array.isArray(emailData.to)
        ? emailData.to.map(email => ({ email_address: { address: email } }))
        : [{ email_address: { address: emailData.to } }],
      subject: emailData.subject,
      htmlbody: emailData.htmlbody,
      ...(emailData.textbody && { textbody: emailData.textbody }),
      ...(emailData.attachments && { attachments: emailData.attachments }),
      ...(emailData.template_key && { template_key: emailData.template_key }),
      ...(emailData.template_alias && { template_alias: emailData.template_alias }),
      ...(emailData.merge_info && { merge_info: emailData.merge_info })
    }

    try {
      const response = await fetch(`${this.BASE_URL}/email`, {
        method: 'POST',
        headers: {
          'Authorization': `Zoho-enczapikey ${this.TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Zoho ZeptoMail API Error: ${response.status} - ${errorData}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Erro ao enviar email via Zoho ZeptoMail:', error)
      throw error
    }
  }

  static async sendAliquotasReport(data: {
    clientEmail: string
    clientName: string
    properties: Array<{
      address: string
      tenant: string
      currentRent: number
      newRent: number
    }>
    pdfAttachment?: {
      filename: string
      content: string
    }
  }): Promise<ZohoEmailResponse> {
    const totalCurrentRent = data.properties.reduce((sum, p) => sum + p.currentRent, 0)
    const totalNewRent = data.properties.reduce((sum, p) => sum + p.newRent, 0)
    const totalIncrease = totalNewRent - totalCurrentRent

    const currentDate = new Date()
    const month = currentDate.toLocaleString('pt-BR', { month: 'long' })
    const year = currentDate.getFullYear()

    const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <!-- Header com cores da IPÊ IMÓVEIS -->
      <div style="background: linear-gradient(135deg, #ff7b00, #ffba00); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">IPÊ IMÓVEIS</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Praça 9 de Julho, nº 65, Centro</p>
      </div>

      <div style="padding: 30px; background-color: #f9f9f9;">
        <h2 style="color: #333; margin-bottom: 20px;">Comunicado de Reajuste de Aluguel</h2>

        <p style="color: #666; line-height: 1.6;">
          Olá <strong>${data.clientName}</strong>,
        </p>

        <p style="color: #666; line-height: 1.6;">
          Informamos que foi realizado o reajuste dos aluguéis referente ao período de <strong>${month}/${year}</strong>.
        </p>

        <!-- Resumo Financeiro -->
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff7b00;">
          <h3 style="color: #ff7b00; margin-top: 0;">Resumo do Reajuste</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666;">Imóveis afetados:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${data.properties.length}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Valor total atual:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">R$ ${totalCurrentRent.toLocaleString('pt-BR')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Novo valor total:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #28a745; text-align: right;">R$ ${totalNewRent.toLocaleString('pt-BR')}</td>
            </tr>
            <tr style="border-top: 1px solid #eee;">
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Aumento total:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #28a745; text-align: right;">+R$ ${totalIncrease.toLocaleString('pt-BR')}</td>
            </tr>
          </table>
        </div>

        <!-- Lista de Imóveis -->
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Detalhamento por Imóvel</h3>
          ${data.properties.map(property => `
            <div style="border-bottom: 1px solid #eee; padding: 15px 0;">
              <div style="font-weight: bold; color: #333; margin-bottom: 5px;">${property.address}</div>
              <div style="color: #666; font-size: 14px; margin-bottom: 8px;">Inquilino: ${property.tenant}</div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #666;">R$ ${property.currentRent.toLocaleString('pt-BR')}</span>
                <span style="color: #28a745; font-weight: bold;">→ R$ ${property.newRent.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <p style="color: #666; line-height: 1.6;">
          Para mais detalhes, consulte o relatório em anexo ou entre em contato conosco.
        </p>

        <p style="color: #666; line-height: 1.6;">
          Atenciosamente,<br>
          <strong>Equipe IPÊ IMÓVEIS</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background: linear-gradient(135deg, #ff7b00, #ffba00); padding: 20px; text-align: center; color: white;">
        <p style="margin: 0; font-size: 14px;">
          IPÊ IMÓVEIS - Seus imóveis, nossa expertise<br>
          Praça 9 de Julho, nº 65, Centro
        </p>
      </div>
    </div>
    `

    const emailData: ZohoEmailData = {
      to: data.clientEmail,
      subject: `IPÊ IMÓVEIS - Comunicado de Reajuste de Aluguel (${month}/${year})`,
      htmlbody: htmlBody,
      textbody: `
        IPÊ IMÓVEIS - Comunicado de Reajuste de Aluguel

        Olá ${data.clientName},

        Informamos que foi realizado o reajuste dos aluguéis referente ao período de ${month}/${year}.

        Resumo:
        - Imóveis: ${data.properties.length}
        - Valor total atual: R$ ${totalCurrentRent.toLocaleString('pt-BR')}
        - Novo valor total: R$ ${totalNewRent.toLocaleString('pt-BR')}
        - Aumento total: +R$ ${totalIncrease.toLocaleString('pt-BR')}

        Para mais detalhes, consulte o relatório em anexo.

        Atenciosamente,
        Equipe IPÊ IMÓVEIS
        Praça 9 de Julho, nº 65, Centro
      `,
      ...(data.pdfAttachment && {
        attachments: [{
          filename: data.pdfAttachment.filename,
          content: data.pdfAttachment.content,
          mime_type: 'application/pdf'
        }]
      })
    }

    return this.sendEmail(emailData)
  }

  static async sendTemplateEmail(templateAlias: string, toEmail: string, mergeData: Record<string, any>): Promise<ZohoEmailResponse> {
    const emailData: ZohoEmailData = {
      to: toEmail,
      subject: '', // Subject will come from template
      htmlbody: '', // Body will come from template
      template_alias: templateAlias,
      merge_info: mergeData
    }

    return this.sendEmail(emailData)
  }

  static getEmailTemplates() {
    return {
      aliquotas_notification: 'aliquotas-notification',
      welcome_client: 'welcome-client',
      contract_reminder: 'contract-reminder',
      payment_due: 'payment-due',
      maintenance_scheduled: 'maintenance-scheduled'
    }
  }
}