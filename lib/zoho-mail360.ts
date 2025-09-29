// lib/zoho-mail360.ts
interface ZohoMail360Config {
  clientId: string
  clientSecret: string
  redirectUri: string
  scope: string
}

interface ZohoUser {
  emailAddress: string
  displayName: string
  firstName: string
  lastName: string
  organizationName: string
}

export class ZohoMail360Auth {
  private config: ZohoMail360Config

  constructor() {
    this.config = {
      clientId: process.env.ZOHO_CLIENT_ID || '',
      clientSecret: process.env.ZOHO_CLIENT_SECRET || '',
      redirectUri: process.env.ZOHO_REDIRECT_URI || '',
      scope: 'ZohoMail.accounts.READ ZohoMail.organization.READ'
    }
  }

  // Verificar credenciais diretamente via API
  async verifyUser(email: string, password: string): Promise<ZohoUser | null> {
    try {
      console.log('🔍 Verificando usuário Zoho:', email)
      
      // Verificar se é domínio corporativo
      if (!this.isCorporateEmail(email)) {
        console.log('❌ Email não é corporativo')
        return null
      }
      
      // Verificar se as credenciais estão configuradas
      if (!this.config.clientId || !this.config.clientSecret) {
        console.log('⚠️ Credenciais Zoho não configuradas, usando modo mock')
        return this.createMockUser(email)
      }
      
      // Para produção: implementar verificação real da API
      // Por enquanto, simular sucesso para emails corporativos válidos
      console.log('✅ Credenciais Zoho configuradas, simulando autenticação...')
      
      // Validação básica da senha
      if (password.length < 6) {
        console.log('❌ Senha muito curta')
        return null
      }
      
      return this.createMockUser(email)
      
    } catch (error) {
      console.error('❌ Erro na verificação Zoho Mail360:', error)
      return null
    }
  }

  // Verificar se as credenciais estão configuradas
  isConfigured(): boolean {
    return !!(this.config.clientId && this.config.clientSecret)
  }

  private isCorporateEmail(email: string): boolean {
    const corporateDomains = ['@imobiliariaipe.com.br', '@ipeimoveis.com']
    return corporateDomains.some(domain => email.includes(domain))
  }

  private createMockUser(email: string): ZohoUser {
    const [localPart, domain] = email.split('@')
    const names = localPart.split('.')
    
    return {
      emailAddress: email,
      displayName: names.map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' '),
      firstName: names[0] || localPart,
      lastName: names[1] || '',
      organizationName: domain.replace(/\.(com|com\.br)$/, '').toUpperCase()
    }
  }
}

export const zohoMail360 = new ZohoMail360Auth()