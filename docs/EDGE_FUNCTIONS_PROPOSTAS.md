# ⚡ EDGE FUNCTIONS PROPOSTAS - DASHBOARD NOVA IPÊ

## 15 Edge Functions Essenciais para o Sistema

### 🔐 CATEGORIA 1: AUTENTICAÇÃO E SEGURANÇA (3 functions)

#### 1. auth-middleware
**Endpoint:** `/functions/v1/auth-middleware`
**Método:** POST
**Propósito:** Validar sessões e permissões
**Input:**
```typescript
{
  token: string,
  required_role?: 'client' | 'realtor' | 'admin'
}
```
**Output:**
```typescript
{
  valid: boolean,
  user: { id, email, role },
  permissions: string[]
}
```
**Use Case:** Proteger rotas sensíveis do dashboard

#### 2. generate-secure-token
**Endpoint:** `/functions/v1/generate-secure-token`
**Método:** POST
**Propósito:** Gerar tokens para compartilhamento de imóveis
**Input:**
```typescript
{
  property_id: string,
  expires_in_hours: number
}
```
**Output:**
```typescript
{
  token: string,
  share_url: string,
  expires_at: timestamp
}
```
**Use Case:** Links temporários para visualização sem login

#### 3. rate-limiter
**Endpoint:** `/functions/v1/rate-limiter`
**Método:** POST
**Propósito:** Prevenir abuse de API
**Input:**
```typescript
{
  ip: string,
  endpoint: string
}
```
**Output:**
```typescript
{
  allowed: boolean,
  remaining: number,
  reset_at: timestamp
}
```
**Use Case:** Proteger contra spam e DDoS

---

### 🏠 CATEGORIA 2: PROCESSAMENTO DE IMÓVEIS (4 functions)

#### 4. property-validator
**Endpoint:** `/functions/v1/property-validator`
**Método:** POST
**Propósito:** Validar dados antes de salvar
**Input:**
```typescript
{
  property_data: PropertyDTO,
  validate_photos: boolean
}
```
**Output:**
```typescript
{
  valid: boolean,
  errors: ValidationError[],
  warnings: string[]
}
```
**Use Case:** Garantir qualidade dos dados

#### 5. image-optimizer
**Endpoint:** `/functions/v1/image-optimizer`
**Método:** POST
**Propósito:** Processar e otimizar imagens
**Input:**
```typescript
{
  image_url: string,
  sizes: ['thumb', 'medium', 'large'],
  format: 'webp' | 'jpeg'
}
```
**Output:**
```typescript
{
  original_url: string,
  optimized_urls: {
    thumb: string,
    medium: string,
    large: string
  },
  compression_ratio: number
}
```
**Use Case:** Otimizar fotos de imóveis automaticamente

#### 6. geo-enrichment
**Endpoint:** `/functions/v1/geo-enrichment`
**Método:** POST
**Propósito:** Enriquecer dados com informações geográficas
**Input:**
```typescript
{
  address: string,
  lat?: number,
  lng?: number
}
```
**Output:**
```typescript
{
  formatted_address: string,
  coordinates: { lat, lng },
  neighborhood: string,
  nearby_places: Place[],
  distance_to_center: number
}
```
**Use Case:** Melhorar informações de localização

#### 7. property-recommendation
**Endpoint:** `/functions/v1/property-recommendation`
**Método:** POST
**Propósito:** Recomendar imóveis similares
**Input:**
```typescript
{
  property_id: string,
  user_id?: string,
  limit: number
}
```
**Output:**
```typescript
{
  recommendations: Property[],
  match_score: number,
  reason: string
}
```
**Use Case:** "Imóveis Similares" e personalização

---

### 📊 CATEGORIA 3: ANALYTICS E RELATÓRIOS (3 functions)

#### 8. analytics-aggregator
**Endpoint:** `/functions/v1/analytics-aggregator`
**Método:** GET
**Propósito:** Agregar métricas em tempo real
**Input:**
```typescript
{
  date_range: { start, end },
  metrics: ['views', 'leads', 'conversions']
}
```
**Output:**
```typescript
{
  total_views: number,
  total_leads: number,
  conversion_rate: number,
  top_properties: Property[],
  timeline: DataPoint[]
}
```
**Use Case:** Dashboard de métricas

#### 9. report-generator
**Endpoint:** `/functions/v1/report-generator`
**Método:** POST
**Propósito:** Gerar relatórios customizados
**Input:**
```typescript
{
  report_type: 'monthly' | 'quarterly' | 'custom',
  user_id?: string,
  property_ids?: string[],
  format: 'json' | 'pdf' | 'excel'
}
```
**Output:**
```typescript
{
  report_url: string,
  generated_at: timestamp,
  expires_in: number
}
```
**Use Case:** Relatórios para clientes e gestão

#### 10. performance-monitor
**Endpoint:** `/functions/v1/performance-monitor`
**Método:** GET
**Propósito:** Monitorar performance do sistema
**Input:**
```typescript
{
  check_type: 'health' | 'speed' | 'errors'
}
```
**Output:**
```typescript
{
  status: 'healthy' | 'degraded' | 'down',
  response_time: number,
  error_rate: number,
  uptime: number
}
```
**Use Case:** Alertas e monitoramento

---

### 💬 CATEGORIA 4: COMUNICAÇÃO E INTEGRAÇÕES (5 functions)

#### 11. email-sender
**Endpoint:** `/functions/v1/email-sender`
**Método:** POST
**Propósito:** Enviar emails transacionais
**Input:**
```typescript
{
  to: string | string[],
  template: 'welcome' | 'lead' | 'report',
  variables: Record<string, any>
}
```
**Output:**
```typescript
{
  message_id: string,
  status: 'sent' | 'queued' | 'failed',
  delivered_at?: timestamp
}
```
**Use Case:** Emails automáticos do sistema

#### 12. whatsapp-integration
**Endpoint:** `/functions/v1/whatsapp-integration`
**Método:** POST
**Propósito:** Enviar mensagens WhatsApp
**Input:**
```typescript
{
  phone: string,
  message: string,
  property_id?: string
}
```
**Output:**
```typescript
{
  message_id: string,
  status: 'sent' | 'delivered' | 'failed',
  whatsapp_url: string
}
```
**Use Case:** Contato rápido via WhatsApp

#### 13. crm-sync
**Endpoint:** `/functions/v1/crm-sync`
**Método:** POST
**Propósito:** Sincronizar com CRM externo (Zoho/Pipedrive)
**Input:**
```typescript
{
  entity: 'lead' | 'contact' | 'deal',
  action: 'create' | 'update' | 'delete',
  data: any
}
```
**Output:**
```typescript
{
  crm_id: string,
  synced_at: timestamp,
  status: 'success' | 'failed'
}
```
**Use Case:** Integração com CRM

#### 14. sms-notifier
**Endpoint:** `/functions/v1/sms-notifier`
**Método:** POST
**Propósito:** Enviar notificações SMS
**Input:**
```typescript
{
  phone: string,
  message: string,
  priority: 'high' | 'normal'
}
```
**Output:**
```typescript
{
  sms_id: string,
  status: 'sent' | 'failed',
  cost: number
}
```
**Use Case:** Alertas urgentes

#### 15. webhook-dispatcher
**Endpoint:** `/functions/v1/webhook-dispatcher`
**Método:** POST
**Propósito:** Disparar webhooks para sistemas externos
**Input:**
```typescript
{
  event: string,
  payload: any,
  target_url: string
}
```
**Output:**
```typescript
{
  delivered: boolean,
  response_code: number,
  retry_count: number
}
```
**Use Case:** Integrações com terceiros

---

## 🚀 Stack Tecnológica Recomendada

### Runtime:
- **Deno** (Supabase Edge Functions padrão)
- TypeScript nativo
- Deploy automático via CLI

### Bibliotecas Úteis:
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts"
```

### Estrutura de Pasta:
```
supabase/
├── functions/
│   ├── auth-middleware/
│   │   └── index.ts
│   ├── image-optimizer/
│   │   └── index.ts
│   ├── email-sender/
│   │   └── index.ts
│   └── _shared/
│       ├── supabase.ts
│       ├── validators.ts
│       └── utils.ts
```

### Variáveis de Ambiente Necessárias:
```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
WHATSAPP_API_KEY=
CRM_API_KEY=
```

---

## 📊 Prioridade de Implementação

### 🔴 P0 - CRÍTICAS (implementar primeiro):
- #1 auth-middleware
- #4 property-validator
- #5 image-optimizer
- #11 email-sender

### 🟡 P1 - IMPORTANTES (implementar em seguida):
- #6 geo-enrichment
- #7 property-recommendation
- #8 analytics-aggregator
- #12 whatsapp-integration

### 🟢 P2 - NICE TO HAVE (implementar depois):
- #2 generate-secure-token
- #3 rate-limiter
- #9 report-generator
- #13 crm-sync
- #14 sms-notifier

### ⚪ P3 - OPCIONAL (futuro):
- #10 performance-monitor
- #15 webhook-dispatcher

---

## 🧪 Exemplo de Implementação

### Edge Function: image-optimizer
```typescript
// supabase/functions/image-optimizer/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { image_url, sizes = ['thumb', 'medium', 'large'] } = await req.json()
    
    // Validação
    if (!image_url) {
      return new Response(
        JSON.stringify({ error: 'image_url is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Processar imagem (exemplo simplificado)
    const optimized = await optimizeImage(image_url, sizes)
    
    return new Response(
      JSON.stringify({ success: true, optimized }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### Deploy:
```bash
supabase functions deploy image-optimizer
```
