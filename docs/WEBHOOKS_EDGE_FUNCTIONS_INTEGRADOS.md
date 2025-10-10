# 🔄 INTEGRAÇÕES WEBHOOKS + EDGE FUNCTIONS

## 10 Fluxos Completos que Combinam Ambas as Tecnologias

### 🎯 FLUXO 1: CADASTRO COMPLETO DE IMÓVEL

**Trigger:** Webhook `property.created`
**Edge Functions Acionadas:**
1. `property-validator` - Valida dados
2. `image-optimizer` - Processa fotos
3. `geo-enrichment` - Enriquece localização
4. `email-sender` - Notifica admin

**Sequência:**
```mermaid
Webhook: property.created
  ↓
Edge Function: property-validator
  ↓ (if valid)
Edge Function: image-optimizer (paralelo)
Edge Function: geo-enrichment (paralelo)
  ↓
Update DB: property status = 'processing' → 'active'
  ↓
Edge Function: email-sender
  ↓
Webhook: property.status_changed (active)
```

**Implementação:**
```typescript
// Webhook Handler
async function handlePropertyCreated(payload) {
  const { property_id, data } = payload
  
  // 1. Validar
  const validation = await fetch('edge/property-validator', {
    method: 'POST',
    body: JSON.stringify({ property_data: data })
  })
  
  if (!validation.valid) {
    await updatePropertyStatus(property_id, 'invalid')
    return
  }
  
  // 2. Processar imagens (paralelo)
  const imagePromises = data.photos.map(photo => 
    fetch('edge/image-optimizer', {
      method: 'POST',
      body: JSON.stringify({ image_url: photo })
    })
  )
  
  // 3. Enriquecer geo (paralelo)
  const geoPromise = fetch('edge/geo-enrichment', {
    method: 'POST',
    body: JSON.stringify({ address: data.address })
  })
  
  const [images, geo] = await Promise.all([
    Promise.all(imagePromises),
    geoPromise
  ])
  
  // 4. Atualizar banco
  await updateProperty(property_id, {
    photos: images,
    geo_data: geo,
    status: 'active'
  })
  
  // 5. Notificar
  await fetch('edge/email-sender', {
    method: 'POST',
    body: JSON.stringify({
      template: 'property_approved',
      to: data.owner_email
    })
  })
}
```

---

### 🎯 FLUXO 2: GERAÇÃO E FOLLOW-UP DE LEADS

**Trigger:** Webhook `property.lead_generated`
**Edge Functions Acionadas:**
1. `crm-sync` - Cria lead no CRM
2. `whatsapp-integration` - Envia mensagem WhatsApp
3. `email-sender` - Email automático
4. `analytics-aggregator` - Atualiza métricas

**Sequência:**
```
User clica "Tenho interesse"
  ↓
Webhook: property.lead_generated
  ↓
Edge Function: crm-sync → Cria lead no Zoho
  ↓ (paralelo)
Edge Function: whatsapp-integration → Corretor recebe WhatsApp
Edge Function: email-sender → Cliente recebe email
Edge Function: analytics-aggregator → Atualiza dashboard
  ↓
Schedule Follow-up (24h depois)
```

**Dados do Lead:**
```typescript
interface Lead {
  id: string
  property_id: string
  user_id: string
  contact_type: 'visit' | 'whatsapp' | 'call'
  message?: string
  created_at: timestamp
}
```

---

### 🎯 FLUXO 3: RELATÓRIO DIÁRIO AUTOMÁTICO

**Trigger:** Webhook `dashboard.daily_report` (agendado)
**Edge Functions Acionadas:**
1. `analytics-aggregator` - Coleta métricas
2. `report-generator` - Gera PDF
3. `email-sender` - Envia para equipe

**Sequência:**
```
Cron: Todo dia 8h
  ↓
Webhook: dashboard.daily_report
  ↓
Edge Function: analytics-aggregator
  → Busca dados das últimas 24h
  → Calcula KPIs
  ↓
Edge Function: report-generator
  → Gera PDF com gráficos
  → Upload para Storage
  ↓
Edge Function: email-sender
  → Envia para toda equipe
  → Inclui link do relatório
```

**Métricas Incluídas:**
- Total de visitas ao site
- Novos leads gerados
- Taxa de conversão
- Imóveis mais visualizados
- Novos cadastros de imóveis

---

### 🎯 FLUXO 4: SINCRONIZAÇÃO WORDPRESS → SUPABASE

**Trigger:** Webhook `sync.wordpress_complete`
**Edge Functions Acionadas:**
1. `property-validator` - Valida importados
2. `image-optimizer` - Otimiza imagens antigas
3. `geo-enrichment` - Adiciona coordenadas
4. `email-sender` - Notifica conclusão

**Sequência:**
```
WordPress Import Script (manual/agendado)
  ↓
Importa 761 propriedades
  ↓
Webhook: sync.wordpress_complete
  ↓
For each property (batch de 10):
  Edge Function: property-validator
  Edge Function: image-optimizer (se tem fotos)
  Edge Function: geo-enrichment
  ↓
Update batch status
  ↓
When complete:
  Edge Function: email-sender
  → "Importação concluída: 761 imóveis"
```

---

### 🎯 FLUXO 5: ATUALIZAÇÃO DE STATUS COM NOTIFICAÇÕES

**Trigger:** Webhook `property.status_changed`
**Edge Functions Acionadas:**
1. `email-sender` - Notifica proprietário
2. `whatsapp-integration` - Notifica interessados
3. `crm-sync` - Atualiza CRM
4. `analytics-aggregator` - Atualiza stats

**Sequência:**
```
Admin muda status: pending → approved
  ↓
Webhook: property.status_changed
  ↓
Check new_status:
  
  If 'approved':
    Edge Function: email-sender → Proprietário
    Edge Function: property-recommendation → Busca similares
    Update search index
    
  If 'archived':
    Edge Function: email-sender → Interessados (vendido)
    Edge Function: whatsapp-integration → Corretor
    Edge Function: crm-sync → Fecha deal
    Remove from active listings
    
  If 'rejected':
    Edge Function: email-sender → Proprietário (feedback)
    Log reason
```

---

### 🎯 FLUXO 6: UPLOAD DE FOTOS COM PROCESSAMENTO

**Trigger:** Webhook `property.photos_uploaded`
**Edge Functions Acionadas:**
1. `image-optimizer` - Gera múltiplos tamanhos
2. `auth-middleware` - Valida permissões
3. `geo-enrichment` - Extrai metadados GPS

**Sequência:**
```
User faz upload de 10 fotos
  ↓
Auth check
  ↓
Upload to Supabase Storage
  ↓
Webhook: property.photos_uploaded
  ↓
For each photo (paralelo):
  Edge Function: image-optimizer
    → thumb (300x200)
    → medium (800x600)
    → large (1920x1080)
    → webp format
  ↓
  Extract EXIF data
  Edge Function: geo-enrichment
    → Get GPS coordinates
    → Validate location
  ↓
Update property record with optimized URLs
  ↓
Delete original large files (save storage)
```

---

### 🎯 FLUXO 7: RESET DE SENHA SEGURO

**Trigger:** Webhook `password.reset_requested`
**Edge Functions Acionadas:**
1. `generate-secure-token` - Cria token único
2. `rate-limiter` - Previne abuse
3. `email-sender` - Envia link de reset

**Sequência:**
```
User clica "Esqueci minha senha"
  ↓
Edge Function: rate-limiter
  → Check IP (max 3 requests/hour)
  ↓
Webhook: password.reset_requested
  ↓
Edge Function: generate-secure-token
  → Creates unique token (expires in 1h)
  → Stores in DB with user_id
  ↓
Edge Function: email-sender
  → Send email with reset link
  → Template: password_reset
  ↓
Log security event
```

**Segurança:**
- Token válido por 1 hora apenas
- Usado uma única vez
- Rate limit por IP
- Log de todas tentativas

---

### 🎯 FLUXO 8: RECOMENDAÇÕES PERSONALIZADAS

**Trigger:** Webhook `user.login` (novo)
**Edge Functions Acionadas:**
1. `analytics-aggregator` - Histórico do usuário
2. `property-recommendation` - Sugere imóveis
3. `email-sender` - Email com sugestões (se >7 dias sem login)

**Sequência:**
```
User faz login
  ↓
Webhook: user.login
  ↓
Edge Function: analytics-aggregator
  → Busca histórico de visualizações
  → Identifica preferências (tipo, preço, localização)
  ↓
Edge Function: property-recommendation
  → Algoritmo de matching
  → Retorna top 5 imóveis
  ↓
If last_login > 7 days:
  Edge Function: email-sender
    → "Novos imóveis que você vai gostar"
    → Lista com 5 recomendações
```

**Algoritmo de Matching:**
- Tipo de imóvel (casa, apto, terreno)
- Faixa de preço (±20%)
- Localização (mesmo bairro ou próximo)
- Características (quartos, garagem)

---

### 🎯 FLUXO 9: MONITORAMENTO E ALERTAS

**Trigger:** Webhook `analytics.high_traffic_alert`
**Edge Functions Acionadas:**
1. `performance-monitor` - Verifica health
2. `rate-limiter` - Ajusta limites
3. `email-sender` - Alerta equipe técnica

**Sequência:**
```
Sistema detecta >200 visitas/hora
  ↓
Webhook: analytics.high_traffic_alert
  ↓
Edge Function: performance-monitor
  → Check server response time
  → Check database connections
  → Check memory usage
  ↓
If degraded:
  Edge Function: rate-limiter
    → Reduce limits temporarily
    → Enable caching
  Edge Function: email-sender
    → Alert tech team
    → Include metrics dashboard link
  ↓
Log incident for analysis
```

---

### 🎯 FLUXO 10: BACKUP E AUDITORIA

**Trigger:** Webhook `backup.completed`
**Edge Functions Acionadas:**
1. `report-generator` - Relatório de backup
2. `email-sender` - Notifica admin
3. `webhook-dispatcher` - Notifica sistemas externos

**Sequência:**
```
Backup automático roda (3h da manhã)
  ↓
Backup completo de:
  - Database (postgres dump)
  - Storage (fotos)
  - Configs
  ↓
Webhook: backup.completed
  ↓
Edge Function: report-generator
  → Gera relatório:
    • Tamanho do backup
    • Tempo de execução
    • Integridade verificada
    • Arquivos incluídos
  ↓
Edge Function: email-sender
  → Envia para admin@imobiliariaipe.com.br
  → Inclui link de download (expires em 24h)
  ↓
Edge Function: webhook-dispatcher
  → Notifica sistema de monitoramento externo
  → Update status dashboard
  ↓
Delete backups com >30 dias
```

---

## 📊 Resumo de Recursos Necessários

### Infraestrutura:
```yaml
Supabase:
  - Database Webhooks: 15 configurados
  - Edge Functions: 15 deployadas
  - Storage: Para backups e relatórios
  - Cron Jobs: 3 agendamentos

Integrações Externas:
  - SMTP (emails)
  - WhatsApp Business API
  - CRM API (Zoho/Pipedrive)
  - SMS Gateway (opcional)
```

### Custos Estimados (mensal):
```
Supabase Pro: $25/mês
  - 100GB bandwidth
  - 8GB database
  - 100GB storage

Email (SendGrid): $15/mês
  - 40,000 emails

WhatsApp API: $0.005/msg
  - Estimado: $20/mês (4000 msgs)

Total: ~$60/mês
```

### Performance Esperada:
- **Webhooks:** <100ms response time
- **Edge Functions:** <200ms execution time
- **Email Delivery:** <3s
- **Image Optimization:** <5s por imagem
- **Reliability:** 99.9% uptime

---

## 🚀 Roadmap de Implementação

### Fase 1 (Semana 1-2): CORE
- ✅ Setup Supabase Webhooks
- ✅ Deploy Edge Functions essenciais
- ✅ Fluxo 1: Cadastro de imóvel
- ✅ Fluxo 2: Geração de leads

### Fase 2 (Semana 3-4): AUTOMAÇÃO
- ⏳ Fluxo 3: Relatórios diários
- ⏳ Fluxo 4: Sync WordPress
- ⏳ Fluxo 6: Upload de fotos

### Fase 3 (Semana 5-6): INTEGRAÇÕES
- ⏳ Fluxo 5: Notificações
- ⏳ Fluxo 7: Reset de senha
- ⏳ CRM integration

### Fase 4 (Semana 7-8): ANALYTICS
- ⏳ Fluxo 8: Recomendações
- ⏳ Fluxo 9: Monitoramento
- ⏳ Fluxo 10: Backups

---

## 📝 Próximos Passos

1. **Configurar Supabase CLI:**
```bash
npm install -g supabase
supabase login
supabase init
```

2. **Criar primeira Edge Function:**
```bash
supabase functions new property-validator
# Editar: supabase/functions/property-validator/index.ts
supabase functions deploy property-validator
```

3. **Configurar primeiro Webhook:**
```sql
-- No Supabase Dashboard → Database → Webhooks
CREATE TRIGGER on_property_created
  AFTER INSERT ON wordpress_properties
  FOR EACH ROW
  EXECUTE FUNCTION supabase_functions.http_request(
    'https://[PROJECT].supabase.co/functions/v1/handle-property-created',
    'POST',
    '{"Content-Type": "application/json"}',
    '{}',
    '5000'
  );
```

4. **Testar integração:**
```bash
# Local testing
supabase functions serve property-validator

# Trigger teste
curl -i --location --request POST 'http://localhost:54321/functions/v1/property-validator' \
  --header 'Content-Type: application/json' \
  --data '{"property_data": {...}}'
```
