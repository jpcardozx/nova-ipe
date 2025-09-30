/**
 * Diagnóstico do Portal IPÊ
 * Ferramenta para identificar problemas de conectividade e servidor
 */

import { useState } from 'react'

interface PortalDiagnosticResult {
  timestamp: string
  url: string
  dns: {
    resolved: boolean
    ip?: string
    error?: string
  }
  http: {
    accessible: boolean
    status?: number
    statusText?: string
    responseTime?: number
    headers?: Record<string, string>
    error?: string
  }
  ssl: {
    valid: boolean
    error?: string
  }
  serverInfo: {
    server?: string
    xPoweredBy?: string
    contentType?: string
  }
}

export class PortalDiagnostic {
  private static readonly PORTAL_URL = 'https://portal.imobiliariaipe.com.br'
  private static readonly FALLBACK_URL = 'http://portal.imobiliariaipe.com.br'
  
  /**
   * Executa diagnóstico completo do portal
   */
  static async runFullDiagnostic(): Promise<PortalDiagnosticResult> {
    const result: PortalDiagnosticResult = {
      timestamp: new Date().toISOString(),
      url: this.PORTAL_URL,
      dns: { resolved: false },
      http: { accessible: false },
      ssl: { valid: false },
      serverInfo: {}
    }

    try {
      // 1. Verificar DNS
      console.log('🔍 Verificando DNS...')
      await this.checkDNS(result)
      
      // 2. Tentar HTTPS primeiro
      console.log('🔐 Testando HTTPS...')
      await this.checkHTTPS(result)
      
      // 3. Se HTTPS falhar, tentar HTTP
      if (!result.http.accessible) {
        console.log('🌐 Testando HTTP como fallback...')
        await this.checkHTTP(result)
      }
      
      // 4. Análise dos headers
      if (result.http.accessible) {
        console.log('📊 Analisando headers do servidor...')
        this.analyzeServerInfo(result)
      }
      
    } catch (error) {
      console.error('❌ Erro no diagnóstico:', error)
    }

    return result
  }

  /**
   * Verifica resolução DNS
   */
  private static async checkDNS(result: PortalDiagnosticResult): Promise<void> {
    try {
      // Usar uma API pública para verificar DNS
      const dnsResponse = await fetch(`https://dns.google/resolve?name=portal.imobiliariaipe.com.br&type=A`)
      
      if (dnsResponse.ok) {
        const dnsData = await dnsResponse.json()
        
        if (dnsData.Answer && dnsData.Answer.length > 0) {
          result.dns.resolved = true
          result.dns.ip = dnsData.Answer[0].data
          console.log(`✅ DNS resolvido: ${result.dns.ip}`)
        } else {
          result.dns.error = 'Nenhum registro A encontrado'
          console.log('❌ DNS não resolvido')
        }
      }
    } catch (error) {
      result.dns.error = error instanceof Error ? error.message : 'Erro desconhecido'
      console.log('❌ Erro na verificação DNS:', result.dns.error)
    }
  }

  /**
   * Testa conectividade HTTPS
   */
  private static async checkHTTPS(result: PortalDiagnosticResult): Promise<void> {
    const startTime = Date.now()
    
    try {
      const response = await fetch(this.PORTAL_URL, {
        method: 'HEAD',
        mode: 'no-cors', // Evitar problemas de CORS
        cache: 'no-cache'
      })
      
      const responseTime = Date.now() - startTime
      
      result.http.accessible = true
      result.http.status = response.status
      result.http.statusText = response.statusText
      result.http.responseTime = responseTime
      result.ssl.valid = true
      
      // Capturar headers importantes
      const headers: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        headers[key] = value
      })
      result.http.headers = headers
      
      console.log(`✅ HTTPS OK: ${response.status} ${response.statusText} (${responseTime}ms)`)
      
    } catch (error) {
      result.http.error = error instanceof Error ? error.message : 'Erro desconhecido'
      result.ssl.valid = false
      result.ssl.error = 'Falha na conexão SSL/TLS'
      console.log('❌ Erro HTTPS:', result.http.error)
    }
  }

  /**
   * Testa conectividade HTTP (fallback)
   */
  private static async checkHTTP(result: PortalDiagnosticResult): Promise<void> {
    const startTime = Date.now()
    
    try {
      const response = await fetch(this.FALLBACK_URL, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      })
      
      const responseTime = Date.now() - startTime
      
      result.http.accessible = true
      result.http.status = response.status
      result.http.statusText = response.statusText
      result.http.responseTime = responseTime
      result.url = this.FALLBACK_URL // Atualiza URL usada
      
      console.log(`✅ HTTP OK: ${response.status} ${response.statusText} (${responseTime}ms)`)
      
    } catch (error) {
      result.http.error = error instanceof Error ? error.message : 'Erro desconhecido'
      console.log('❌ Erro HTTP:', result.http.error)
    }
  }

  /**
   * Analisa informações do servidor nos headers
   */
  private static analyzeServerInfo(result: PortalDiagnosticResult): void {
    if (!result.http.headers) return

    const headers = result.http.headers
    
    result.serverInfo = {
      server: headers['server'] || 'Não identificado',
      xPoweredBy: headers['x-powered-by'] || 'Não identificado',
      contentType: headers['content-type'] || 'Não identificado'
    }

    // Detectar possíveis problemas baseado nos headers
    if (headers['server']?.toLowerCase().includes('apache')) {
      console.log('🔍 Servidor Apache detectado')
    }
    
    if (headers['x-powered-by']?.toLowerCase().includes('php')) {
      console.log('🔍 PHP detectado - possível problema suPHP')
    }
  }

  /**
   * Gera relatório detalhado do diagnóstico
   */
  static generateReport(result: PortalDiagnosticResult): string {
    const report = `
🏥 DIAGNÓSTICO DO PORTAL IPÊ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Data/Hora: ${new Date(result.timestamp).toLocaleString('pt-BR')}
🌐 URL Testada: ${result.url}

📡 DNS:
${result.dns.resolved ? '✅' : '❌'} Resolução DNS: ${result.dns.resolved ? 'OK' : 'FALHOU'}
${result.dns.ip ? `🎯 IP Resolvido: ${result.dns.ip}` : ''}
${result.dns.error ? `❌ Erro DNS: ${result.dns.error}` : ''}

🌐 HTTP/HTTPS:
${result.http.accessible ? '✅' : '❌'} Conectividade: ${result.http.accessible ? 'OK' : 'FALHOU'}
${result.http.status ? `📊 Status: ${result.http.status} ${result.http.statusText}` : ''}
${result.http.responseTime ? `⏱️ Tempo Resposta: ${result.http.responseTime}ms` : ''}
${result.http.error ? `❌ Erro HTTP: ${result.http.error}` : ''}

🔐 SSL/TLS:
${result.ssl.valid ? '✅' : '❌'} Certificado SSL: ${result.ssl.valid ? 'VÁLIDO' : 'INVÁLIDO'}
${result.ssl.error ? `❌ Erro SSL: ${result.ssl.error}` : ''}

🖥️ Servidor:
${result.serverInfo.server ? `Server: ${result.serverInfo.server}` : ''}
${result.serverInfo.xPoweredBy ? `Powered By: ${result.serverInfo.xPoweredBy}` : ''}
${result.serverInfo.contentType ? `Content-Type: ${result.serverInfo.contentType}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 ANÁLISE:
${this.generateAnalysis(result)}

🔧 PRÓXIMOS PASSOS:
${this.generateNextSteps(result)}
`
    return report
  }

  /**
   * Gera análise baseada nos resultados
   */
  private static generateAnalysis(result: PortalDiagnosticResult): string {
    const issues = []
    
    if (!result.dns.resolved) {
      issues.push('• DNS não está resolvendo - problema na configuração da zona DNS')
    }
    
    if (!result.http.accessible) {
      issues.push('• Servidor não está respondendo - possível problema de configuração ou servidor offline')
    }
    
    if (result.http.status === 500) {
      issues.push('• Erro 500 - Internal Server Error (possivelmente o problema suPHP mencionado)')
    }
    
    if (!result.ssl.valid && result.url.startsWith('https')) {
      issues.push('• Certificado SSL inválido ou não configurado')
    }
    
    if (result.serverInfo.xPoweredBy?.toLowerCase().includes('php') && result.http.status === 500) {
      issues.push('• Confirmado: problema relacionado ao PHP/suPHP (UID menor que min_uid)')
    }
    
    return issues.length > 0 ? issues.join('\n') : '✅ Nenhum problema crítico identificado'
  }

  /**
   * Gera próximos passos baseado nos problemas encontrados
   */
  private static generateNextSteps(result: PortalDiagnosticResult): string {
    if (!result.dns.resolved) {
      return '1. Verificar configuração DNS na Locaweb\n2. Aguardar propagação (até 48h)\n3. Testar novamente'
    }
    
    if (result.http.status === 500) {
      return `1. Acessar servidor via SSH
2. Executar: ls -l /home/httpd/html/index.php
3. Verificar se proprietário é 'root'
4. Se for root, executar: chown -R usuario:grupo /home/httpd/html/
5. Ou abrir ticket no suporte Locaweb com erro suPHP`
    }
    
    if (!result.http.accessible) {
      return '1. Verificar se servidor está online\n2. Contactar suporte da hospedagem\n3. Verificar configurações de firewall'
    }
    
    return 'Sistema funcionando normalmente'
  }
}

/**
 * Hook para usar o diagnóstico no React
 */
export function usePortalDiagnostic() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<PortalDiagnosticResult | null>(null)
  
  const runDiagnostic = async () => {
    setIsRunning(true)
    try {
      const diagnostic = await PortalDiagnostic.runFullDiagnostic()
      setResult(diagnostic)
      console.log(PortalDiagnostic.generateReport(diagnostic))
    } catch (error) {
      console.error('Erro no diagnóstico:', error)
    } finally {
      setIsRunning(false)
    }
  }
  
  return {
    isRunning,
    result,
    runDiagnostic,
    generateReport: result ? () => PortalDiagnostic.generateReport(result) : null
  }
}