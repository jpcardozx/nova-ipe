# Nova IPE - Documentação Técnica Completa

## Visão Geral da Arquitetura

O **Nova IPE** é um site de imobiliária moderno construído com Next.js 14, focado em performance, SEO e experiência do usuário. O projeto utiliza uma arquitetura de componentes modulares com integração a CMS headless (Sanity) e analytics avançados.

## Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de CSS utilitário
- **Framer Motion** - Animações e transições
- **Lucide React** - Ícones vetoriais

### Backend/CMS
- **Sanity CMS** - Sistema de gerenciamento de conteúdo headless
- **Next.js API Routes** - APIs serverless

### Analytics & Performance
- **Google Analytics 4** - Tracking de usuários e conversões
- **Facebook Pixel** - Tracking para campanhas sociais
- **Web Vitals** - Métricas de performance

### Validação & Forms
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Custom validation** - Validação personalizada para formulários de contato

## Estrutura do Projeto

```
nova-ipe/
├── app/                          # App Router (Next.js 14)
│   ├── api/                      # API Routes
│   │   ├── contact/             # API de contato
│   │   ├── imoveis/             # APIs de imóveis
│   │   └── sanity/              # Proxy para Sanity
│   ├── components/              # Componentes reutilizáveis
│   │   ├── ui/                  # Componentes de interface
│   │   ├── property/            # Componentes específicos de imóveis
│   │   └── verified/            # Componentes verificados
│   ├── hooks/                   # React Hooks customizados
│   │   ├── useAnalytics.ts      # Hook de analytics
│   │   ├── useProperties.ts     # Hook de propriedades
│   │   └── useDebounce.ts       # Hook de debounce
│   ├── sections/                # Seções de página
│   │   ├── Footer.tsx           # Rodapé
│   │   ├── NavBar.tsx           # Navegação
│   │   └── Hero.tsx             # Seções hero
│   ├── utils/                   # Utilitários
│   │   ├── scroll-helper.ts     # Helpers de scroll
│   │   └── performance-*.ts     # Utilitários de performance
│   ├── contato/                 # Página de contato
│   ├── imovel/[slug]/          # Páginas dinâmicas de imóveis
│   └── globals.css              # Estilos globais
├── components/                   # Componentes legacy
├── lib/                         # Bibliotecas e configurações
├── public/                      # Arquivos estáticos
├── studio/                      # Sanity Studio
└── types/                       # Definições de tipos TypeScript
```

## Funcionalidades Principais

### 1. Gestão de Imóveis
- **Listagem dinâmica**: Imóveis carregados via Sanity CMS
- **Páginas individuais**: URLs amigáveis para SEO
- **Filtros avançados**: Por tipo, preço, localização
- **Galeria de imagens**: Otimizada com Next.js Image

### 2. Sistema de Contato
- **Formulário validado**: Validação client-side e server-side
- **API personalizada**: `/api/contact` com validação robusta
- **WhatsApp integration**: Redirecionamento direto para +5521990051961
- **Analytics tracking**: Rastreamento de conversões

### 3. Analytics e Tracking
- **Google Analytics 4**: Eventos customizados e conversões
- **Facebook Pixel**: Tracking para campanhas
- **Scroll tracking**: Métricas de engajamento
- **Web Vitals**: Monitoramento de performance

### 4. Performance e SEO
- **Server-side rendering**: Para melhor SEO
- **Image optimization**: Next.js Image component
- **Code splitting**: Carregamento otimizado
- **Web Vitals**: Métricas de Core Web Vitals

## Implementações Recentes (Correções)

### 1. Correção de Erros TypeScript
**Problema**: Duplicação de função no arquivo `page-backup.tsx`
```typescript
// ANTES (ERRO)
export default function ContactPage() {
  // Função incompleta...
}
export default function ContactPage() {
  // Segunda função...
}

// DEPOIS (CORRIGIDO)
export default function ContactPage() {
  // Função única e completa
}
```

### 2. Atualização de Números de Telefone
**Objetivo**: Centralizar todos os contatos no número +5521990051961

**Arquivos atualizados**:
- `app/contato/page.tsx`
- `app/sections/Footer.tsx`
- `app/components/WhatsAppButton.tsx`
- `app/components/property/PropertyDetails.tsx`
- E mais 20+ arquivos

**Exemplo de mudança**:
```typescript
// ANTES
const whatsappUrl = `https://wa.me/5511981845016?text=${message}`;

// DEPOIS
const whatsappUrl = `https://wa.me/5521990051961?text=${message}`;
```

### 3. Implementação de Formulário Real
**Problema**: Formulários eram simulações (mock)
**Solução**: API real com validação

#### API de Contato (`/api/contact`)
```typescript
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  propertyType: string;
}

export async function POST(request: NextRequest) {
  // Validação server-side
  // Processamento de dados
  // Resposta estruturada
}
```

#### Validação Client-side
```typescript
const validateForm = () => {
  const newErrors: Record<string, string> = {};
  
  if (!formData.name.trim()) {
    newErrors.name = 'Nome é obrigatório';
  }
  
  if (!formData.email.trim()) {
    newErrors.email = 'Email é obrigatório';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = 'Email inválido';
  }
  
  return Object.keys(newErrors).length === 0;
};
```

### 4. Analytics Aprimorado
**Implementação robusta** com tracking de:
- Visualizações de imóveis
- Conversões de formulário
- Cliques em WhatsApp
- Tempo na página
- Scroll profundo

## Configuração de Deploy

### Variáveis de Ambiente
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_GA_TRACKING_ID=AW-17457190449
NEXT_PUBLIC_ENABLE_ANALYTICS=true
SANITY_API_TOKEN=your_api_token
```

### Build e Deploy
```bash
# Instalação de dependências
npm install

# Build de produção
npm run build

# Verificação de tipos
npm run typecheck

# Lint
npm run lint
```

### Otimizações de Performance
1. **Image optimization**: Todas as imagens usam Next.js Image
2. **Code splitting**: Componentes carregados sob demanda
3. **Lazy loading**: Imagens e componentes carregados quando necessário
4. **Caching**: Estratégias de cache para APIs e assets

## Estrutura de Componentes

### Componentes de UI Base
- `Button` - Botões reutilizáveis
- `Card` - Cards de conteúdo
- `Modal` - Modais e dialogs
- `Form` - Componentes de formulário

### Componentes Específicos
- `PropertyCard` - Card de imóvel
- `ContactForm` - Formulário de contato
- `WhatsAppButton` - Botão flutuante do WhatsApp
- `PropertyGallery` - Galeria de imagens

### Hooks Customizados
- `useAnalytics` - Gerenciamento de analytics
- `useProperties` - Gestão de dados de imóveis
- `useDebounce` - Debounce para inputs
- `useIntersectionObserver` - Observação de elementos

## Manutenção e Desenvolvimento

### Fluxo de Desenvolvimento
1. **Feature branches**: Cada nova feature em branch separada
2. **TypeScript strict**: Tipagem obrigatória
3. **Linting**: ESLint + Prettier
4. **Testing**: Testes unitários e integração

### Monitoramento
1. **Web Vitals**: Core Web Vitals tracking
2. **Error boundaries**: Captura de erros React
3. **Analytics**: Eventos customizados
4. **Performance**: Métricas de carregamento

### Futuras Melhorias
1. **Email service**: Integração com SendGrid/Nodemailer
2. **Database**: Persistência de leads
3. **Dashboard**: Admin para gestão de contatos
4. **PWA**: Progressive Web App features
5. **Multilingual**: Suporte a múltiplos idiomas

## Considerações de Segurança

### Validação de Dados
- Validação client-side e server-side
- Sanitização de inputs
- Rate limiting para APIs

### CORS e Headers
- Headers de segurança configurados
- CORS adequadamente configurado
- CSP (Content Security Policy) implementado

### Privacidade
- LGPD compliance para dados pessoais
- Cookies consent
- Analytics com respeito à privacidade

## Conclusão

O Nova IPE foi reestruturado para ser uma plataforma robusta, performática e escalável. As correções implementadas garantem:

- **Funcionalidade real**: Formulários funcionais com validação
- **Contato unificado**: Todos os pontos de contato direcionam para o número correto
- **Analytics confiável**: Tracking preciso de conversões e engajamento
- **Performance otimizada**: Carregamento rápido e experiência fluida
- **Manutenibilidade**: Código limpo e bem documentado

A arquitetura modular permite fácil manutenção e extensão de funcionalidades futuras.