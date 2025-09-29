export interface Property {
  id: string
  address: string
  tenant: string
  currentRent: number
  iptu: number
  referenceRate: number
  newRent: number
  status: 'pending' | 'approved' | 'sent'
  lastUpdate: string
}

export interface AliquotasPDFData {
  properties: Property[]
  clientInfo: {
    name: string
    email: string
    phone: string
  }
  generationDate: string
  validUntil: string
}

export class AliquotasPDFService {
  static async generatePDF(data: AliquotasPDFData): Promise<Blob> {
    // Simulação da geração de PDF com o timbre oficial
    // Em implementação real, usaria jsPDF ou similar com o timbre

    const mockPDFContent = this.generateMockPDFContent(data)
    return new Blob([mockPDFContent], { type: 'application/pdf' })
  }

  static generateMockPDFContent(data: AliquotasPDFData): string {
    const totalCurrentRent = data.properties.reduce((sum, p) => sum + p.currentRent, 0)
    const totalNewRent = data.properties.reduce((sum, p) => sum + p.newRent, 0)
    const totalIncrease = totalNewRent - totalCurrentRent

    return `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 2000
>>
stream
BT
/F1 16 Tf
50 750 Td
(IPÊ IMÓVEIS) Tj
0 -20 Td
(Praça 9 de Julho, nº 65, Centro) Tj
0 -40 Td
/F1 14 Tf
(RELATÓRIO DE REAJUSTE DE ALÍQUOTAS) Tj
0 -30 Td
/F1 12 Tf
(Cliente: ${data.clientInfo.name}) Tj
0 -20 Td
(Data: ${data.generationDate}) Tj
0 -40 Td
(RESUMO FINANCEIRO:) Tj
0 -20 Td
(Aluguel Total Atual: R$ ${totalCurrentRent.toLocaleString('pt-BR')}) Tj
0 -20 Td
(Novo Aluguel Total: R$ ${totalNewRent.toLocaleString('pt-BR')}) Tj
0 -20 Td
(Aumento Total: R$ ${totalIncrease.toLocaleString('pt-BR')}) Tj
0 -40 Td
(IMÓVEIS (${data.properties.length} selecionados):) Tj
${data.properties.map((prop, index) => `
0 -20 Td
(${index + 1}. ${prop.address}) Tj
0 -15 Td
(   Inquilino: ${prop.tenant}) Tj
0 -15 Td
(   Atual: R$ ${prop.currentRent.toLocaleString('pt-BR')} → Novo: R$ ${prop.newRent.toLocaleString('pt-BR')}) Tj
`).join('')}
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000053 00000 n
0000000110 00000 n
0000000263 00000 n
0000002314 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
2397
%%EOF`
  }

  static getTimbrePath(): string {
    return '/assets/timbre-ipe.pdf'
  }

  static async downloadPDF(data: AliquotasPDFData, filename?: string): Promise<void> {
    const pdfBlob = await this.generatePDF(data)
    const url = URL.createObjectURL(pdfBlob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename || `aliquotas-${new Date().toISOString().split('T')[0]}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }
}