# Integração com Jetimob API

Este documento explica como funciona a integração com a API da Jetimob para sincronização de imóveis com portais imobiliários.

## 📋 Visão Geral

A integração com a Jetimob permite:

- **Sincronizar imóveis** com portais como Viva Real, ZAP, OLX, etc.
- **Gerenciar leads** provenientes dos portais
- **Monitorar performance** de anúncios
- **Automatizar publicações** e atualizações
- **Receber notificações** em tempo real via webhooks

## 🔧 Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis no seu `.env.local`:

```bash
# Configurações da API Jetimob
JETIMOB_API_KEY=your_jetimob_api_key_here
JETIMOB_BASE_URL=https://api.jetimob.com/v1
JETIMOB_USER_ID=your_jetimob_user_id
JETIMOB_PASSWORD=your_jetimob_password
```

### 2. Obtendo Credenciais

1. Acesse o painel da Jetimob
2. Vá em **Configurações > API**
3. Gere uma nova API Key
4. Configure os webhooks (opcional)

## 🚀 Como Usar

### Usando o Hook React

```typescript
import { useJetimob } from '@/lib/jetimob/use-jetimob'

function MyComponent() {
    const {
        properties,
        loadProperties,
        createProperty,
        updateProperty,
        deleteProperty,
        isLoading,
        error
    } = useJetimob()

    useEffect(() => {
        loadProperties()
    }, [])

    return (
        <div>
            {isLoading && <p>Carregando...</p>}
            {error && <p>Erro: {error}</p>}
            {properties.map(property => (
                <div key={property.id}>{property.title}</div>
            ))}
        </div>
    )
}
```

### Usando o Serviço Diretamente

```typescript
import { jetimobService } from '@/lib/jetimob/jetimob-service'

// Buscar imóveis
const properties = await jetimobService.getProperties()

// Criar novo imóvel
const newProperty = await jetimobService.createProperty({
    title: 'Apartamento 3 quartos',
    description: 'Lindo apartamento...',
    property_type: 'Apartamento',
    transaction_type: 'sale',
    price: 500000,
    // ... outros campos
})

// Sincronizar com portais
await jetimobService.syncPropertyToPortals(propertyId, ['viva_real', 'zap'])
```

## 📊 Estrutura de Dados

### Imóvel (JetimobProperty)

```typescript
interface JetimobProperty {
    id: string
    title: string
    description: string
    property_type: string
    transaction_type: 'sale' | 'rent'
    price: number
    area: number
    bedrooms: number
    bathrooms: number
    parking_spaces: number
    address: {
        street: string
        number: string
        neighborhood: string
        city: string
        state: string
        zipcode: string
        latitude?: number
        longitude?: number
    }
    features: string[]
    images: string[]
    status: 'active' | 'inactive' | 'sold' | 'rented'
    created_at: string
    updated_at: string
}
```

### Lead (JetimobLead)

```typescript
interface JetimobLead {
    id: string
    name: string
    email: string
    phone: string
    property_id: string
    message: string
    source: string
    created_at: string
    status: 'new' | 'contacted' | 'qualified' | 'converted'
}
```

## 🌐 Endpoints da API

### Imóveis

- `GET /api/jetimob/properties` - Listar imóveis
- `POST /api/jetimob/properties` - Criar imóvel
- `GET /api/jetimob/properties/[id]` - Buscar imóvel específico
- `PUT /api/jetimob/properties/[id]` - Atualizar imóvel
- `DELETE /api/jetimob/properties/[id]` - Deletar imóvel

### Leads

- `GET /api/jetimob/leads` - Listar leads
- `PATCH /api/jetimob/leads` - Atualizar status do lead

### Portais

- `GET /api/jetimob/portals` - Listar portais
- `POST /api/jetimob/portals` - Sincronizar/desincronizar com portais

### Webhook

- `POST /api/jetimob/webhook` - Receber notificações da Jetimob

## 🔔 Webhooks

A Jetimob pode enviar notificações automáticas para:

- **Novos leads** (`lead.created`)
- **Lead atualizado** (`lead.updated`)
- **Imóvel atualizado** (`property.updated`)
- **Sincronização concluída** (`property.synced`)
- **Status do portal alterado** (`portal.status_changed`)

### Configurando Webhooks

1. No painel da Jetimob, vá em **Webhooks**
2. Adicione a URL: `https://seudominio.com/api/jetimob/webhook`
3. Selecione os eventos desejados
4. Configure o token de segurança (se disponível)

## 📱 Dashboard

Acesse `/dashboard/jetimob` para visualizar:

- **Visão geral** com estatísticas
- **Gestão de imóveis** com CRUD completo
- **Leads** dos portais
- **Status dos portais** e sincronização
- **Configurações** da integração

## 🔒 Segurança

### Autenticação

O serviço gerencia automaticamente:
- **Token de acesso** com renovação automática
- **Persistência** do token no localStorage
- **Reautenticação** quando necessário

### Validação de Webhook

```typescript
// Validar assinatura do webhook (se fornecida)
function validateJetimobSignature(signature: string, body: any): boolean {
    const secret = process.env.JETIMOB_WEBHOOK_SECRET
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(body))
        .digest('hex')
    
    return signature === expectedSignature
}
```

## 📈 Monitoramento

### Logs

Os seguintes eventos são logados:
- Autenticação bem-sucedida/falha
- Requisições à API
- Processamento de webhooks
- Erros de sincronização

### Métricas

Monitore:
- **Taxa de sucesso** da sincronização
- **Tempo de resposta** da API
- **Volume de leads** por portal
- **Performance** dos anúncios

## 🛠️ Desenvolvimento

### Testes

```bash
# Testar autenticação
npm run test:jetimob:auth

# Testar sincronização
npm run test:jetimob:sync

# Testar webhooks
npm run test:jetimob:webhook
```

### Debug

Ative logs detalhados:

```typescript
// No desenvolvimento
const jetimobService = new JetimobService({
    ...config,
    debug: true
})
```

## 🚨 Tratamento de Erros

### Erros Comuns

1. **Autenticação falhou**
   - Verificar API Key e credenciais
   - Verificar se a conta está ativa

2. **Imóvel não sincronizado**
   - Verificar se todos os campos obrigatórios estão preenchidos
   - Verificar se as imagens estão no formato correto

3. **Portal offline**
   - Verificar status do portal no dashboard
   - Aguardar reestabelecimento da conexão

### Retry e Fallback

```typescript
// Configurar retry automático
const jetimobService = new JetimobService({
    ...config,
    retryAttempts: 3,
    retryDelay: 1000
})
```

## 📞 Suporte

Para suporte técnico:
- **Documentação**: https://jetimob.docs.apiary.io
- **Suporte Jetimob**: suporte@jetimob.com
- **Issues**: Use o sistema de issues do projeto

## 🔄 Versionamento

Esta integração é compatível com:
- **Jetimob API**: v1.x
- **Next.js**: 15.x
- **React**: 18.x

Mantenha sempre as dependências atualizadas para garantir compatibilidade.
