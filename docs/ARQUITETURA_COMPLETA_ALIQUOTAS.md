# 🎨 ARQUITETURA COMPLETA - SISTEMA DE GERAÇÃO DE CARTAS DE REAJUSTE

## 📋 VISÃO GERAL

Sistema profissional para geração automatizada de cartas de reajuste de aluguel, com interface wizard interativa, templates customizáveis e geração de PDF de alta qualidade.

---

## 🎯 FLUXO DO USUÁRIO (UX)

### **Wizard em 4 Etapas**

```
┌─────────────────────────────────────────────────────────────────┐
│  ETAPA 1: SELEÇÃO DE CLIENTE                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔍 Buscar cliente no CRM                                       │
│  ┌────────────────────────────────────────────────┐            │
│  │ 🔎 Digite nome, CPF, email ou telefone...      │            │
│  └────────────────────────────────────────────────┘            │
│                                                                 │
│  Resultados:                                                    │
│  ┌────────────────────────────────────────────────┐            │
│  │ 👤 Maria Silva Santos                          │            │
│  │    CPF: 123.456.789-00                         │            │
│  │    📧 maria.silva@email.com                    │            │
│  │    📍 Rua das Flores, 123 - Apto 45           │            │
│  │    ✅ Cliente ativo desde 2023                 │            │
│  │    [Selecionar Cliente]                        │            │
│  └────────────────────────────────────────────────┘            │
│                                                                 │
│  ┌────────────────────────────────────────────────┐            │
│  │ 👤 João Pedro Silva                            │            │
│  │    CPF: 987.654.321-00                         │            │
│  │    📧 joao.pedro@email.com                     │            │
│  │    ⚠️  Contrato vence em 30 dias               │            │
│  │    [Selecionar Cliente]                        │            │
│  └────────────────────────────────────────────────┘            │
│                                                                 │
│  OU                                                             │
│                                                                 │
│  ┌──────────────────────────────────────┐                      │
│  │ [+ Novo Cliente]                     │                      │
│  │ Preencher dados manualmente          │                      │
│  └──────────────────────────────────────┘                      │
│                                                                 │
│  💡 Dica: Use Tab para navegar rapidamente                     │
│                                                                 │
│  [Cancelar]                           [Próximo: Dados →]       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ETAPA 2: DADOS DO IMÓVEL E CONTRATO                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📍 ENDEREÇO DO IMÓVEL                                         │
│  ┌─────────────────────────────────────────┐                  │
│  │ Rua das Flores, 123 - Apto 45          │                  │
│  └─────────────────────────────────────────┘                  │
│                                                                 │
│  🏷️  CÓDIGO DO IMÓVEL (opcional)                              │
│  ┌─────────────────────────────────────────┐                  │
│  │ IPE-2024-001                            │                  │
│  └─────────────────────────────────────────┘                  │
│                                                                 │
│  💰 VALORES ATUAIS                                             │
│  ┌──────────────────────┬──────────────────────┐              │
│  │ Aluguel              │ R$ [2.500,00]        │              │
│  ├──────────────────────┼──────────────────────┤              │
│  │ IPTU (mensal)        │ R$ [  150,00]        │              │
│  ├──────────────────────┼──────────────────────┤              │
│  │ Condomínio           │ R$ [  350,00]        │              │
│  ├──────────────────────┼──────────────────────┤              │
│  │ Outras taxas         │ R$ [    0,00]        │              │
│  └──────────────────────┴──────────────────────┘              │
│                                                                 │
│  📅 DATAS                                                       │
│  Data do contrato: [01/11/2023]                                │
│  Último reajuste:  [01/11/2024]                                │
│                                                                 │
│  📝 OBSERVAÇÕES (opcional)                                     │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Ex: Cliente solicitou reajuste antecipado              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [← Voltar]                         [Próximo: Cálculo →]      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ETAPA 3: CÁLCULO DO REAJUSTE                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 ÍNDICE DE REAJUSTE                                         │
│  ┌─────────────────────────────────────────┐                  │
│  │ [⚙️ IGPM ▼]  Taxa: 4,50% a.a.          │                  │
│  │                                          │                  │
│  │ ℹ️  Índice oficial para contratos       │                  │
│  │    de locação residencial                │                  │
│  └─────────────────────────────────────────┘                  │
│                                                                 │
│  Outros índices disponíveis:                                   │
│  • IPCA - Inflação oficial (3,8% a.a.)                        │
│  • INCC - Construção civil (2,9% a.a.)                        │
│  • Taxa customizada                                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  📈 SIMULAÇÃO DO REAJUSTE                               │  │
│  │                                                          │  │
│  │  Valor atual do aluguel:      R$ 2.500,00              │  │
│  │  Índice aplicado (IGPM):           4,50%               │  │
│  │  Valor do reajuste:          + R$   112,50             │  │
│  │  ═══════════════════════════════════════               │  │
│  │  💰 NOVO VALOR:               R$ 2.612,50              │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────┐                │  │
│  │  │ Total mensal (com taxas):          │                │  │
│  │  │ • Aluguel:          R$ 2.612,50    │                │  │
│  │  │ • IPTU:             R$   150,00    │                │  │
│  │  │ • Condomínio:       R$   350,00    │                │  │
│  │  │ ─────────────────────────────────  │                │  │
│  │  │ TOTAL:              R$ 3.112,50    │                │  │
│  │  └────────────────────────────────────┘                │  │
│  │                                                          │  │
│  │  📅 Data de vigência: [01/11/2025]                     │  │
│  │                                                          │  │
│  │  ⏰ Este reajuste entrará em vigor a partir de:        │  │
│  │     1º de novembro de 2025                              │  │
│  │                                                          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [← Voltar]                         [Próximo: Revisão →]      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ETAPA 4: REVISÃO E GERAÇÃO                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ DADOS CONFIRMADOS                                          │
│                                                                 │
│  👤 Cliente: Maria Silva Santos                                │
│  📍 Imóvel: Rua das Flores, 123 - Apto 45                     │
│  💰 De R$ 2.500,00 → Para R$ 2.612,50 (+4,50%)                │
│  📅 Vigência: 01/11/2025                                       │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📄 PREVIEW DA CARTA                                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  [🏢 TIMBRE DA IMOBILIÁRIA IPÊ]                        │  │
│  │                                                          │  │
│  │  ───────────────────────────────────────────────────    │  │
│  │                                                          │  │
│  │  NOTIFICAÇÃO DE REAJUSTE DE ALUGUEL                     │  │
│  │                                                          │  │
│  │  Prezado(a) Maria Silva Santos,                         │  │
│  │                                                          │  │
│  │  Conforme estipulado em contrato de locação,            │  │
│  │  vimos por meio desta comunicar o reajuste anual        │  │
│  │  do valor do aluguel do imóvel localizado em:           │  │
│  │                                                          │  │
│  │      Rua das Flores, 123 - Apto 45                     │  │
│  │                                                          │  │
│  │  📊 Dados do Reajuste:                                  │  │
│  │                                                          │  │
│  │  • Índice utilizado: IGPM                               │  │
│  │  • Percentual aplicado: 4,50%                           │  │
│  │  • Valor atual: R$ 2.500,00                             │  │
│  │  • Novo valor: R$ 2.612,50                              │  │
│  │  • Vigência: 01/11/2025                                 │  │
│  │                                                          │  │
│  │  [... resto da carta ...]                               │  │
│  │                                                          │  │
│  │  [Ver carta completa →]                                 │  │
│  │                                                          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  📝 OBSERVAÇÕES INTERNAS (não aparece na carta)                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Cliente avisado por telefone em 01/10/2025             │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  🎯 AÇÕES DISPONÍVEIS                                          │
│                                                                 │
│  ┌────────────┬────────────┬────────────┬────────────┐        │
│  │ 📥 Baixar  │ 📧 Enviar  │ 💾 Salvar  │ ❌ Cancelar│        │
│  │    PDF     │  por Email │  Rascunho  │            │        │
│  └────────────┴────────────┴────────────┴────────────┘        │
│                                                                 │
│  [← Voltar]                         [✅ Gerar e Enviar]       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ ARQUITETURA DO SISTEMA

### **1. Frontend - Wizard Components**

```typescript
app/dashboard/aliquotas/
├── page.tsx                      // Dashboard principal
├── new/
│   ├── page.tsx                  // Página do wizard
│   └── components/
│       ├── CalculatorWizard.tsx  // Container principal
│       ├── WizardNav.tsx         // Navegação entre steps
│       ├── ProgressIndicator.tsx // Barra de progresso
│       │
│       ├── Step1ClientSelection/ 
│       │   ├── index.tsx
│       │   ├── ClientSearch.tsx       // Busca com autocomplete
│       │   ├── ClientCard.tsx         // Card de cliente
│       │   ├── NewClientForm.tsx      // Formulário novo cliente
│       │   └── useClientSearch.ts     // Hook de busca
│       │
│       ├── Step2PropertyData/
│       │   ├── index.tsx
│       │   ├── AddressInput.tsx       // Input de endereço
│       │   ├── ValuesForm.tsx         // Formulário de valores
│       │   ├── DatePicker.tsx         // Seletor de datas
│       │   └── usePropertyForm.ts     // Hook do formulário
│       │
│       ├── Step3Calculation/
│       │   ├── index.tsx
│       │   ├── IndexSelector.tsx      // Seletor de índice
│       │   ├── CalculationPreview.tsx // Preview do cálculo
│       │   ├── ValueBreakdown.tsx     // Detalhamento
│       │   └── useCalculation.ts      // Hook de cálculo
│       │
│       └── Step4Review/
│           ├── index.tsx
│           ├── DataSummary.tsx        // Resumo dos dados
│           ├── LetterPreview.tsx      // Preview da carta
│           ├── ActionsPanel.tsx       // Botões de ação
│           └── useGeneration.ts       // Hook de geração
│
├── [id]/
│   ├── page.tsx                  // Visualizar reajuste
│   └── edit/
│       └── page.tsx              // Editar reajuste
│
└── components/
    ├── AdjustmentCard.tsx        // Card de reajuste
    ├── AdjustmentList.tsx        // Lista de reajustes
    ├── StatusBadge.tsx           // Badge de status
    ├── FilterPanel.tsx           // Painel de filtros
    └── BulkActions.tsx           // Ações em massa
```

---

### **2. Backend - API Routes**

```typescript
app/api/aliquotas/
├── calculate/
│   └── route.ts                  // POST - Calcular reajuste
│       // Input: valores, índice, data
│       // Output: cálculo detalhado
│
├── adjustments/
│   ├── route.ts                  // GET/POST - Listar/criar
│   └── [id]/
│       ├── route.ts              // GET/PATCH/DELETE
│       ├── approve/
│       │   └── route.ts          // POST - Aprovar
│       ├── reject/
│       │   └── route.ts          // POST - Rejeitar
│       └── send/
│           └── route.ts          // POST - Enviar por email
│
├── pdf/
│   ├── generate/
│   │   └── route.ts              // POST - Gerar PDF
│   │       // 1. Busca template
│   │       // 2. Substitui variáveis
│   │       // 3. Adiciona timbre
│   │       // 4. Gera PDF (Puppeteer)
│   │       // 5. Upload R2
│   │       // 6. Retorna URL
│   │
│   ├── preview/
│   │   └── route.ts              // POST - Preview HTML
│   │
│   └── templates/
│       ├── route.ts              // GET/POST - Templates
│       └── [id]/
│           └── route.ts          // GET/PATCH/DELETE
│
├── stats/
│   └── route.ts                  // GET - Estatísticas
│       // Total, pendentes, enviados, etc
│
├── settings/
│   └── route.ts                  // GET/PATCH - Config IGPM/IPCA
│
└── bulk/
    ├── approve/
    │   └── route.ts              // POST - Aprovar múltiplos
    └── send/
        └── route.ts              // POST - Enviar múltiplos
```

---

### **3. Serviços e Utils**

```typescript
lib/
├── services/
│   ├── aliquotas/
│   │   ├── calculation.ts        // Lógica de cálculo
│   │   ├── pdf-generation.ts     // Geração de PDF
│   │   ├── template-engine.ts    // Engine de templates
│   │   ├── email-sender.ts       // Envio de emails
│   │   └── storage.ts            // Upload R2/Supabase
│   │
│   └── crm/
│       └── client-search.ts      // Busca no CRM
│
├── utils/
│   ├── currency.ts               // Formatação de moeda
│   ├── date.ts                   // Manipulação de datas
│   ├── validation.ts             // Validações
│   └── pdf/
│       ├── puppeteer-config.ts   // Config Puppeteer
│       ├── html-to-pdf.ts        // Conversão HTML→PDF
│       └── letterhead.ts         // Adiciona timbre
│
└── hooks/
    ├── useWizardState.ts         // Estado do wizard
    ├── useCalculation.ts         // Hook de cálculo
    ├── usePDFGeneration.ts       // Hook de geração
    └── useAdjustments.ts         // Hook de reajustes
```

---

## 📦 DEPENDÊNCIAS NECESSÁRIAS

```json
{
  "dependencies": {
    // Geração de PDF
    "puppeteer": "^21.11.0",
    "pdf-lib": "^1.17.1",
    
    // Template engine
    "handlebars": "^4.7.8",
    "mustache": "^4.2.0",
    
    // Upload e storage
    "@aws-sdk/client-s3": "^3.901.0",  // ✅ Já tem!
    
    // Email
    "nodemailer": "^6.9.7",
    "mjml": "^4.15.3",                 // Templates de email
    
    // Validação
    "zod": "^3.22.4",                  // ✅ Já tem!
    
    // Utilidades
    "date-fns": "^2.30.0",             // ✅ Já tem!
    "currency.js": "^2.0.4"
  },
  "devDependencies": {
    "@types/puppeteer": "^7.0.4",
    "@types/nodemailer": "^6.4.14",
    "@types/handlebars": "^4.1.0"
  }
}
```

---

## 🎨 SISTEMA DE TEMPLATES

### **Estrutura do Template no Banco**

```typescript
interface PDFTemplate {
  id: string;
  name: string;
  code: string;
  
  // Estrutura do documento
  header_html: string;      // Timbre + Logo
  body_html: string;        // Corpo da carta
  footer_html: string;      // Rodapé + Assinatura
  styles_css: string;       // Estilos customizados
  
  // Configurações
  page_size: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  // Variáveis disponíveis
  available_variables: string[];
  
  // Metadados
  is_default: boolean;
  active: boolean;
}
```

### **Exemplo de Template HTML**

```html
<!-- HEADER com timbre -->
<div class="letterhead">
  <img src="{{company_logo}}" class="logo" />
  <div class="company-info">
    <h2>{{company_name}}</h2>
    <p>CRECI: {{creci_number}}</p>
    <p>{{company_address}}</p>
    <p>Tel: {{company_phone}} | Email: {{company_email}}</p>
  </div>
  <div class="document-date">
    {{city}}, {{document_date}}
  </div>
</div>

<!-- BODY da carta -->
<div class="content">
  <h1 class="title">NOTIFICAÇÃO DE REAJUSTE DE ALUGUEL</h1>
  
  <p class="greeting">Prezado(a) <strong>{{client_name}}</strong>,</p>
  
  <p>Conforme estipulado em contrato de locação firmado em 
     <strong>{{contract_date}}</strong>, vimos por meio desta 
     comunicar o <strong>reajuste anual do valor do aluguel</strong> 
     do imóvel localizado em:</p>
  
  <p class="property-address">{{property_address}}</p>
  
  <div class="adjustment-details">
    <h3>📊 Dados do Reajuste</h3>
    
    <table class="details-table">
      <tr>
        <td><strong>Índice utilizado:</strong></td>
        <td>{{index_type}} ({{index_name}})</td>
      </tr>
      <tr>
        <td><strong>Percentual aplicado:</strong></td>
        <td>{{percentage}}%</td>
      </tr>
      <tr>
        <td><strong>Valor atual do aluguel:</strong></td>
        <td>R$ {{current_rent}}</td>
      </tr>
      <tr>
        <td><strong>Valor do reajuste:</strong></td>
        <td>R$ {{increase_amount}}</td>
      </tr>
      <tr class="highlight">
        <td><strong>Novo valor do aluguel:</strong></td>
        <td><strong>R$ {{new_rent}}</strong></td>
      </tr>
      <tr>
        <td><strong>Data de vigência:</strong></td>
        <td>{{effective_date}}</td>
      </tr>
    </table>
  </div>
  
  <p>O novo valor entrará em vigor a partir de 
     <strong>{{effective_date}}</strong>, conforme previsto 
     no contrato de locação.</p>
  
  <p class="legal-note">
    O reajuste é baseado na variação acumulada do índice 
    {{index_type}} no período de 12 meses anteriores à data 
    de aniversário do contrato, em conformidade com a 
    <strong>Lei nº 8.245/1991</strong> (Lei do Inquilinato).
  </p>
  
  <p>Para sua comodidade, seguem abaixo os valores atualizados:</p>
  
  <table class="summary-table">
    <thead>
      <tr>
        <th>Descrição</th>
        <th>Valor</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Aluguel</td>
        <td>R$ {{new_rent}}</td>
      </tr>
      {{#if has_iptu}}
      <tr>
        <td>IPTU (mensal)</td>
        <td>R$ {{iptu_value}}</td>
      </tr>
      {{/if}}
      {{#if has_condominium}}
      <tr>
        <td>Condomínio</td>
        <td>R$ {{condominium_value}}</td>
      </tr>
      {{/if}}
      {{#if has_other_charges}}
      <tr>
        <td>Outras taxas</td>
        <td>R$ {{other_charges}}</td>
      </tr>
      {{/if}}
      <tr class="total">
        <td><strong>TOTAL</strong></td>
        <td><strong>R$ {{total_monthly}}</strong></td>
      </tr>
    </tbody>
  </table>
  
  <p>Permanecemos à disposição para quaisquer esclarecimentos 
     através dos nossos canais de atendimento.</p>
  
  <p class="closing">Atenciosamente,</p>
</div>

<!-- FOOTER com assinatura -->
<div class="signature-block">
  {{#if has_signature_image}}
  <img src="{{signature_image}}" class="signature" />
  {{/if}}
  
  <div class="signatory-info">
    <p class="name">{{manager_name}}</p>
    <p class="role">{{manager_role}}</p>
    <p class="creci">CRECI: {{manager_creci}}</p>
  </div>
</div>

<div class="footer-note">
  <p>Este é um documento oficial de notificação de reajuste de aluguel.</p>
  <p>{{company_name}} - {{company_slogan}}</p>
</div>
```

### **CSS Profissional**

```css
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
  padding: 20mm;
}

.letterhead {
  border-bottom: 3px solid #0066cc;
  padding-bottom: 15px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.letterhead .logo {
  max-height: 80px;
  max-width: 200px;
}

.company-info {
  text-align: center;
  flex: 1;
}

.company-info h2 {
  margin: 0;
  color: #0066cc;
  font-size: 18pt;
}

.company-info p {
  margin: 2px 0;
  font-size: 9pt;
  color: #666;
}

.document-date {
  text-align: right;
  font-size: 10pt;
  color: #666;
}

.content {
  margin: 20px 0;
}

.title {
  text-align: center;
  color: #0066cc;
  font-size: 16pt;
  margin: 20px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.greeting {
  margin-top: 30px;
}

.property-address {
  text-align: center;
  font-weight: bold;
  font-size: 13pt;
  margin: 20px 0;
  padding: 10px;
  background: #f8f9fa;
  border-left: 4px solid #0066cc;
}

.adjustment-details {
  background: #f8f9fa;
  padding: 20px;
  margin: 30px 0;
  border-radius: 8px;
  border-left: 4px solid #0066cc;
}

.adjustment-details h3 {
  margin-top: 0;
  color: #0066cc;
}

.details-table,
.summary-table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
}

.details-table td,
.summary-table td,
.summary-table th {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.details-table tr.highlight {
  background: #e3f2fd;
  font-size: 14pt;
}

.summary-table thead th {
  background: #0066cc;
  color: white;
  text-align: left;
  font-weight: bold;
}

.summary-table tr.total {
  background: #e3f2fd;
  font-size: 13pt;
  border-top: 2px solid #0066cc;
}

.legal-note {
  font-size: 10pt;
  color: #666;
  font-style: italic;
  margin: 20px 0;
  padding: 10px;
  background: #fff9e6;
  border-left: 3px solid #ffc107;
}

.closing {
  margin-top: 40px;
}

.signature-block {
  margin-top: 60px;
  text-align: center;
}

.signature-block .signature {
  max-height: 60px;
  margin-bottom: 10px;
}

.signatory-info .name {
  font-weight: bold;
  font-size: 13pt;
  margin: 5px 0;
}

.signatory-info .role,
.signatory-info .creci {
  font-size: 10pt;
  color: #666;
  margin: 2px 0;
}

.footer-note {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
  text-align: center;
  font-size: 9pt;
  color: #999;
}

@media print {
  body {
    margin: 0;
    padding: 20mm;
  }
}
```

---

## 🚀 FLUXO DE GERAÇÃO DE PDF

```typescript
// lib/services/aliquotas/pdf-generation.ts

import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import { uploadToR2 } from './storage';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export async function generateAdjustmentPDF(data: AdjustmentData) {
  // 1. Buscar template
  const template = await getTemplate(data.templateId || 'default');
  
  // 2. Compilar templates com Handlebars
  const headerTemplate = Handlebars.compile(template.header_html);
  const bodyTemplate = Handlebars.compile(template.body_html);
  const footerTemplate = Handlebars.compile(template.footer_html);
  
  // 3. Preparar dados para o template
  const templateData = {
    // Empresa
    company_logo: 'https://cdn.ipe.com.br/logo.png',
    company_name: 'Imobiliária Ipê',
    company_address: 'Rua das Palmeiras, 456 - São Paulo/SP',
    company_phone: '(11) 3456-7890',
    company_email: 'contato@imobiliariaipe.com.br',
    creci_number: '12345-F',
    company_slogan: 'Gestão Profissional de Imóveis',
    
    // Documento
    document_date: format(new Date(), 'dd/MM/yyyy', { locale: ptBR }),
    city: 'São Paulo',
    
    // Cliente
    client_name: data.tenant_name,
    
    // Imóvel
    property_address: data.property_address,
    property_code: data.property_code,
    
    // Contrato
    contract_date: format(new Date(data.contractDate), 'dd/MM/yyyy'),
    
    // Reajuste
    index_type: data.index_type.toUpperCase(),
    index_name: getIndexName(data.index_type),
    percentage: formatNumber(data.adjustment_percentage, 2),
    current_rent: formatCurrency(data.current_rent),
    increase_amount: formatCurrency(data.increase_amount),
    new_rent: formatCurrency(data.new_rent),
    effective_date: format(new Date(data.effective_date), 'dd/MM/yyyy'),
    
    // Valores adicionais
    has_iptu: data.iptu_value > 0,
    iptu_value: formatCurrency(data.iptu_value),
    has_condominium: data.condominium_value > 0,
    condominium_value: formatCurrency(data.condominium_value),
    has_other_charges: data.other_charges > 0,
    other_charges: formatCurrency(data.other_charges),
    total_monthly: formatCurrency(
      data.new_rent + data.iptu_value + data.condominium_value + data.other_charges
    ),
    
    // Assinatura
    has_signature_image: !!data.signature_image,
    signature_image: data.signature_image || '',
    manager_name: data.manager_name || 'Gerente Responsável',
    manager_role: data.manager_role || 'Gerente de Locações',
    manager_creci: data.manager_creci || '12345-F',
  };
  
  // 4. Renderizar HTML completo
  const header = headerTemplate(templateData);
  const body = bodyTemplate(templateData);
  const footer = footerTemplate(templateData);
  
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
  
  // 5. Gerar PDF com Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
  
  const pdfBuffer = await page.pdf({
    format: template.page_size,
    printBackground: true,
    margin: {
      top: `${template.margins.top}mm`,
      right: `${template.margins.right}mm`,
      bottom: `${template.margins.bottom}mm`,
      left: `${template.margins.left}mm`,
    },
  });
  
  await browser.close();
  
  // 6. Upload para R2
  const filename = `reajustes/${data.client_id}/${Date.now()}-${slugify(data.tenant_name)}.pdf`;
  const url = await uploadToR2(pdfBuffer, filename, 'application/pdf');
  
  return {
    url,
    filename,
    size: pdfBuffer.length,
    generated_at: new Date(),
  };
}

// Helper functions
function getIndexName(indexType: string): string {
  const names: Record<string, string> = {
    'igpm': 'Índice Geral de Preços do Mercado',
    'ipca': 'Índice Nacional de Preços ao Consumidor Amplo',
    'incc': 'Índice Nacional de Custo da Construção',
  };
  return names[indexType.toLowerCase()] || indexType;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number, decimals: number): string {
  return value.toFixed(decimals).replace('.', ',');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

---

## 📧 ENVIO DE EMAIL

```typescript
// lib/services/aliquotas/email-sender.ts

import nodemailer from 'nodemailer';

export async function sendAdjustmentEmail(adjustment: RentAdjustment, pdfUrl: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .button { 
          display: inline-block; 
          padding: 12px 24px; 
          background: #0066cc; 
          color: white; 
          text-decoration: none; 
          border-radius: 4px; 
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Notificação de Reajuste de Aluguel</h1>
        </div>
        
        <div class="content">
          <p>Prezado(a) <strong>${adjustment.tenant_name}</strong>,</p>
          
          <p>Segue em anexo a notificação oficial de reajuste do valor do aluguel do imóvel localizado em:</p>
          
          <p><strong>${adjustment.property_address}</strong></p>
          
          <p><strong>Resumo do reajuste:</strong></p>
          <ul>
            <li>Valor atual: R$ ${formatCurrency(adjustment.current_rent)}</li>
            <li>Novo valor: R$ ${formatCurrency(adjustment.new_rent)}</li>
            <li>Percentual: ${adjustment.adjustment_percentage}%</li>
            <li>Vigência: ${format(new Date(adjustment.effective_date), 'dd/MM/yyyy')}</li>
          </ul>
          
          <p style="text-align: center;">
            <a href="${pdfUrl}" class="button">📥 Baixar PDF</a>
          </p>
          
          <p>Para dúvidas ou esclarecimentos, entre em contato conosco.</p>
        </div>
        
        <div class="footer">
          <p>Imobiliária Ipê - Gestão Profissional de Imóveis</p>
          <p>Tel: (11) 3456-7890 | Email: contato@imobiliariaipe.com.br</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await transporter.sendMail({
    from: `"Imobiliária Ipê" <${process.env.SMTP_FROM}>`,
    to: adjustment.tenant_email,
    subject: `Notificação de Reajuste de Aluguel - ${adjustment.property_address}`,
    html: emailHtml,
    attachments: [
      {
        filename: `reajuste-${slugify(adjustment.tenant_name)}.pdf`,
        path: pdfUrl,
      },
    ],
  });
  
  return {
    sent_at: new Date(),
    recipient: adjustment.tenant_email,
  };
}
```

---

## ✅ PRÓXIMOS PASSOS

### **Fase 1: Instalação de Dependências (5 min)**
```bash
pnpm add puppeteer pdf-lib handlebars nodemailer mjml currency.js
pnpm add -D @types/puppeteer @types/nodemailer @types/handlebars
```

### **Fase 2: Serviços Core (30 min)**
- `lib/services/aliquotas/calculation.ts`
- `lib/services/aliquotas/pdf-generation.ts`
- `lib/services/aliquotas/template-engine.ts`
- `lib/services/aliquotas/email-sender.ts`

### **Fase 3: API Routes (45 min)**
- `/api/aliquotas/calculate/route.ts`
- `/api/aliquotas/adjustments/route.ts`
- `/api/aliquotas/pdf/generate/route.ts`
- `/api/aliquotas/stats/route.ts`

### **Fase 4: Wizard Components (2h)**
- Step 1: Client Selection (CRM autocomplete)
- Step 2: Property Data
- Step 3: Calculation Preview
- Step 4: Review & Generate

### **Fase 5: Dashboard (1h)**
- Overview com estatísticas
- Lista de reajustes
- Filtros e ações em massa

---

## 🎯 QUANDO VOCÊ ENVIAR O TIMBRE

Vou adicionar ele no template assim:

```sql
UPDATE pdf_templates 
SET header_html = '
  <div class="letterhead">
    <img src="https://r2.nova-ipe.com/timbre-ipe.png" class="logo" />
    <!-- resto do template -->
  </div>
'
WHERE code = 'standard_adjustment_letter';
```

---

**Pronto para começar a implementação?** 🚀