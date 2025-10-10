# 📅 Sistema Completo de Agenda, Calendário e Notificações

## 🎯 Visão Geral

Sistema enterprise de agenda com:
- ✅ **Calendário completo** com eventos, recorrência e participantes
- ✅ **Notificações em tempo real** com múltiplos canais (app, email, SMS, push)
- ✅ **Armazenamento persistente** no Supabase PostgreSQL
- ✅ **Edge Functions** para webhooks estratégicos
- ✅ **Realtime Updates** via Supabase Realtime
- ✅ **RLS** (Row Level Security) configurado
- ✅ **React Hooks** para fácil integração

---

## 📊 Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                     │
├─────────────────────────────────────────────────────────────┤
│  React Hooks (useCalendar, useNotifications, useAgendaSystem) │
│  ↓                                                           │
│  Services (CalendarService, NotificationService)            │
│  ↓                                                           │
│  Supabase Client (API + Realtime WebSockets)               │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                         │
├─────────────────────────────────────────────────────────────┤
│  • PostgreSQL Database (5 tables + views)                   │
│  • Realtime Subscriptions (WebSocket)                       │
│  • Row Level Security (RLS)                                 │
│  • Database Functions & Triggers                            │
│  • Edge Functions (Deno)                                    │
│    - event-webhook                                          │
│    - notification-processor (cron job)                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL INTEGRATIONS                     │
├─────────────────────────────────────────────────────────────┤
│  • Email (SMTP)                                             │
│  • SMS (Twilio, SNS)                                        │
│  • Push Notifications (FCM, APNs)                           │
│  • External Webhooks (Zapier, Make, etc)                    │
│  • Calendar Sync (Google Calendar, Outlook)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Estrutura do Banco de Dados

### 1. **calendar_events** (Eventos de Calendário)
```sql
- id (UUID, PK)
- title, description, location
- start_datetime, end_datetime, all_day, timezone
- event_type (meeting, viewing, call, task, reminder, appointment, personal, deadline)
- category, priority (low, medium, high, urgent)
- status (scheduled, confirmed, cancelled, completed, no_show, rescheduled)
- user_id (owner), created_by, assigned_to[] (participants)
- client_id, property_id, task_id (relationships)
- is_recurring, recurrence_rule (RRULE format), parent_event_id
- reminders[] (minutes before event)
- metadata (JSONB), attachments[] (JSONB), tags[]
- online_meeting (JSONB: platform, url, meeting_id)
- created_at, updated_at
```

**Indexes:** user_id, start_datetime, end_datetime, status, event_type, client_id, assigned_to (GIN), tags (GIN)

**Triggers:**
- `update_calendar_events_updated_at()` - Auto-update updated_at
- `create_event_notifications()` - Auto-create reminder notifications

### 2. **notifications** (Sistema de Notificações)
```sql
- id (UUID, PK)
- title, message, icon
- type (info, success, warning, error, reminder, alert, task, event)
- priority (low, medium, high, urgent)
- category (task, event, client, property, system, marketing)
- user_id (recipient)
- event_id, task_id, client_id, property_id (relationships)
- scheduled_for, sent_at, is_sent
- read_at, is_read
- action_url, action_label
- channels (JSONB: {app, email, sms, push})
- delivery_status (JSONB)
- metadata (JSONB)
- created_at, expires_at
```

**Indexes:** user_id, is_read, is_sent, scheduled_for, type, priority, event_id

**Triggers:**
- `mark_notification_read()` - Auto-set read_at timestamp

### 3. **event_participants** (Participantes de Eventos)
```sql
- id (UUID, PK)
- event_id (FK), user_id
- status (pending, accepted, declined, tentative)
- role (organizer, attendee, required, optional)
- response_at, notes
- notification_preferences (JSONB)
- created_at, updated_at
```

**Constraints:** UNIQUE(event_id, user_id)

### 4. **notification_preferences** (Preferências de Notificação)
```sql
- id (UUID, PK)
- user_id (UNIQUE)
- enabled, quiet_hours_start, quiet_hours_end, timezone
- email_enabled, email_digest, email_digest_time
- push_enabled, sms_enabled
- events_enabled, tasks_enabled, clients_enabled, marketing_enabled, system_enabled
- default_event_reminders[] (minutes)
- metadata (JSONB)
- created_at, updated_at
```

### 5. **webhook_logs** (Logs de Webhooks)
```sql
- id (UUID, PK)
- webhook_type (event_created, event_updated, notification_sent, etc)
- endpoint, event_id, notification_id, user_id
- request_method, request_headers (JSONB), request_body (JSONB)
- response_status, response_body (JSONB), response_time_ms
- success, error_message, retry_count
- created_at, processed_at
```

---

## 🔒 Row Level Security (RLS)

Todas as tabelas têm RLS habilitado:

### calendar_events
- ✅ SELECT: Own events + shared events (assigned_to)
- ✅ INSERT: Own events only
- ✅ UPDATE: Own events or created_by
- ✅ DELETE: Own events or created_by

### notifications
- ✅ SELECT: Own notifications only
- ✅ INSERT: System can insert (unrestricted)
- ✅ UPDATE: Own notifications only

### event_participants
- ✅ SELECT: Events where user is participant
- ✅ ALL: Event owners can manage

### notification_preferences
- ✅ ALL: Own preferences only

---

## 🚀 Edge Functions

### 1. **event-webhook** (`supabase/functions/event-webhook/index.ts`)

**Propósito:** Processar webhooks de eventos com estratégias customizadas

**Invocação:**
```typescript
await supabase.functions.invoke('event-webhook', {
  body: {
    type: 'event.created' | 'event.updated' | 'event.cancelled' | 'event.reminder',
    event_id: 'uuid',
    event_data: {...},
    user_id: 'uuid',
    timestamp: 'ISO8601'
  }
})
```

**Estratégias por Tipo:**

#### `event.created`
1. Criar notificações para todos os participantes (assigned_to)
2. Registrar interação no CRM (se client_id presente)
3. Trigger webhook externo (Google Calendar, Zapier, etc)

#### `event.updated`
1. Notificar participantes sobre mudanças
2. Trigger webhook externo com alterações

#### `event.cancelled`
1. Cancelar todas as notificações pendentes do evento
2. Notificar participantes sobre cancelamento
3. Trigger webhook externo

#### `event.reminder`
1. Criar notificação de lembrete
2. Enviar push notification
3. Calcular minutos até o evento

**Environment Variables:**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
EXTERNAL_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/...
WEBHOOK_SECRET=your-hmac-secret
```

**Deploy:**
```bash
supabase functions deploy event-webhook
```

---

### 2. **notification-processor** (`supabase/functions/notification-processor/index.ts`)

**Propósito:** Processar notificações agendadas e enviar via múltiplos canais

**Invocação:** Via cron job (a cada 1 minuto)

**Fluxo de Processamento:**
1. Buscar notificações pendentes (`is_sent=false`, `scheduled_for <= NOW()`)
2. Para cada notificação:
   - Verificar preferências do usuário
   - Verificar quiet hours
   - Enviar via canais habilitados:
     - ✅ App (sempre)
     - 📧 Email (via SMTP webhook)
     - 📱 SMS (via Twilio/SNS)
     - 📲 Push (via FCM/APNs)
   - Atualizar status (`is_sent=true`, `delivery_status`)
   - Logar falhas em `webhook_logs`

**Quiet Hours:** Não envia notificações durante horário de silêncio configurado pelo usuário

**Environment Variables:**
```bash
SMTP_WEBHOOK_URL=https://your-domain.com/api/email/send
SMS_WEBHOOK_URL=https://api.twilio.com/2010-04-01/...
PUSH_WEBHOOK_URL=https://fcm.googleapis.com/fcm/send
PUSH_API_KEY=your-fcm-api-key
```

**Cron Setup (Supabase Dashboard):**
```bash
# A cada 1 minuto
*/1 * * * * curl -X POST \
  https://your-project.supabase.co/functions/v1/notification-processor \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Deploy:**
```bash
supabase functions deploy notification-processor
```

---

## 💻 Client-Side Usage

### React Hook: `useCalendar`

```typescript
import { useCalendar } from '@/hooks/useAgendaSystem'

function MyComponent() {
  const {
    events,
    loading,
    error,
    refresh,
    createEvent,
    updateEvent,
    deleteEvent,
    cancelEvent,
    todayEvents,
    upcomingEvents,
    stats
  } = useCalendar({
    userId: user.id,
    enableRealtime: true,      // Realtime updates
    autoRefresh: true,          // Auto refresh a cada X segundos
    refreshInterval: 60000,     // 1 minuto
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    eventType: 'meeting',
    status: 'scheduled'
  })

  // Criar evento
  const handleCreate = async () => {
    await createEvent({
      title: 'Reunião com Cliente',
      description: 'Apresentação de imóveis',
      start_datetime: new Date().toISOString(),
      end_datetime: new Date(Date.now() + 3600000).toISOString(),
      event_type: 'meeting',
      priority: 'high',
      status: 'scheduled',
      user_id: user.id,
      created_by: user.id,
      assigned_to: [user.id, 'other-user-id'],
      client_id: 'client-uuid',
      reminders: [15, 60], // 15 e 60 minutos antes
      all_day: false,
      timezone: 'America/Sao_Paulo'
    })
  }

  return (
    <div>
      <h1>Agenda</h1>
      <p>Hoje: {stats.today} eventos</p>
      <p>Próximas 24h: {stats.upcoming} eventos</p>
      
      {todayEvents.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <button onClick={() => cancelEvent(event.id, 'Cliente cancelou')}>
            Cancelar
          </button>
        </div>
      ))}
    </div>
  )
}
```

---

### React Hook: `useNotifications`

```typescript
import { useNotifications } from '@/hooks/useAgendaSystem'

function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
  } = useNotifications({
    userId: user.id,
    enableRealtime: true,           // Receber notificações em tempo real
    playSound: true,                // Tocar som ao receber
    showBrowserNotification: true   // Mostrar notificação do navegador
  })

  return (
    <div>
      <h2>Notificações ({unreadCount})</h2>
      <button onClick={markAllAsRead}>Marcar todas como lidas</button>
      
      {notifications.map(notif => (
        <div key={notif.id} className={notif.is_read ? 'read' : 'unread'}>
          <span>{notif.icon}</span>
          <h4>{notif.title}</h4>
          <p>{notif.message}</p>
          {notif.action_url && (
            <a href={notif.action_url}>{notif.action_label}</a>
          )}
          <button onClick={() => markAsRead(notif.id)}>Marcar como lida</button>
          <button onClick={() => deleteNotification(notif.id)}>Excluir</button>
        </div>
      ))}
    </div>
  )
}
```

---

### React Hook: `useAgendaSystem` (Combined)

```typescript
import { useAgendaSystem } from '@/hooks/useAgendaSystem'

function Dashboard() {
  const {
    calendar,
    notifications,
    loading,
    error
  } = useAgendaSystem({
    userId: user.id,
    enableRealtime: true,
    autoRefresh: true,
    playSound: true,
    showBrowserNotification: true
  })

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Calendar Section */}
      <section>
        <h2>Agenda - {calendar.stats.today} eventos hoje</h2>
        {calendar.todayEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </section>
      
      {/* Notifications Section */}
      <section>
        <h2>Notificações ({notifications.unreadCount})</h2>
        {notifications.notifications.slice(0, 5).map(notif => (
          <NotificationItem key={notif.id} notification={notif} />
        ))}
      </section>
    </div>
  )
}
```

---

## 📡 Realtime Features

### Calendar Realtime Updates

Automaticamente recebe updates quando:
- ✅ Novo evento criado
- ✅ Evento atualizado (horário, título, etc)
- ✅ Evento cancelado
- ✅ Participante adicionado/removido
- ✅ Status alterado (confirmed, completed, etc)

```typescript
// Configurar subscription manualmente
import { CalendarService } from '@/lib/services/calendar-notifications'

const channel = CalendarService.subscribeToEvents(userId, (event) => {
  console.log('📅 Evento atualizado:', event)
  // Update UI
})

// Cleanup
channel.unsubscribe()
```

### Notification Realtime Updates

Recebe notificações instantaneamente:
- ✅ Nova notificação criada
- ✅ Notificação marcada como lida
- ✅ Som opcional ao receber
- ✅ Browser notification (com permissão)

```typescript
import { NotificationService } from '@/lib/services/calendar-notifications'

const channel = NotificationService.subscribeToNotifications(userId, (notification) => {
  console.log('🔔 Nova notificação:', notification)
  // Show toast, play sound, etc
})

// Cleanup
channel.unsubscribe()
```

---

## 🎯 Casos de Uso Estratégicos

### 1. **Lembretes Automáticos de Visitas**

```typescript
// Criar evento de visita
await createEvent({
  title: 'Visita ao Imóvel - Rua das Flores, 123',
  event_type: 'viewing',
  client_id: 'client-uuid',
  property_id: 'property-uuid',
  reminders: [60, 15], // 1h e 15min antes
  // Automaticamente cria 2 notificações agendadas
})
```

### 2. **Notificações de Follow-up**

```typescript
// Após reunião, agendar follow-up
await createNotification({
  title: '🔔 Follow-up: Cliente João Silva',
  message: 'Entrar em contato sobre proposta enviada',
  type: 'reminder',
  priority: 'high',
  user_id: corretor.id,
  client_id: 'client-uuid',
  scheduled_for: addDays(new Date(), 3).toISOString(), // 3 dias depois
  action_url: '/dashboard/clients/client-uuid',
  action_label: 'Ver Cliente'
})
```

### 3. **Sincronização com Google Calendar**

```typescript
// Via webhook externo configurado em EXTERNAL_WEBHOOK_URL
// Zapier/Make recebe evento e sincroniza com Google Calendar
```

### 4. **Notificações de Vencimento de Contrato**

```typescript
// Edge function com cron diário
// Verifica contratos vencendo em 30 dias
// Cria notificações automáticas para corretores
```

### 5. **Alertas de Oportunidades**

```typescript
// Novo lead no CRM
await createNotification({
  title: '🎯 Novo Lead Qualificado!',
  message: 'Maria Santos busca apto 2 quartos no Centro',
  type: 'alert',
  priority: 'urgent',
  category: 'client',
  user_id: corretor.id,
  channels: {
    app: true,
    email: true,
    push: true,
    sms: false
  }
})
```

---

## 🔧 Configuração e Deploy

### 1. **Executar Migration**

```bash
# Via Supabase Dashboard SQL Editor
# Copiar e colar: supabase/migrations/20250110_create_calendar_notifications_system.sql
```

### 2. **Deploy Edge Functions**

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy event-webhook
supabase functions deploy notification-processor

# Ver logs
supabase functions logs event-webhook
```

### 3. **Configurar Cron Jobs** (Supabase Dashboard)

```
Nome: notification-processor
Schedule: */1 * * * * (a cada 1 minuto)
Function: notification-processor
```

### 4. **Configurar Environment Variables**

No Supabase Dashboard → Settings → Edge Functions:

```env
EXTERNAL_WEBHOOK_URL=https://hooks.zapier.com/...
WEBHOOK_SECRET=seu-secret-hmac
SMTP_WEBHOOK_URL=https://your-api.com/email/send
SMS_WEBHOOK_URL=https://api.twilio.com/...
PUSH_WEBHOOK_URL=https://fcm.googleapis.com/...
PUSH_API_KEY=your-fcm-key
```

---

## 📊 Métricas e Analytics

### Views Disponíveis

```sql
-- Eventos ativos com contagem de participantes
SELECT * FROM active_events;

-- Notificações pendentes de envio
SELECT * FROM pending_notifications;

-- Próximos eventos (24h)
SELECT * FROM upcoming_events;

-- Estatísticas por usuário
SELECT * FROM user_event_stats;
```

### Function: Auto-completar eventos passados

```sql
-- Executar manualmente ou via cron diário
SELECT auto_complete_past_events();
-- Retorna número de eventos completados
```

---

## 🎨 Componentes de UI (Sugestões)

### 1. **CalendarView** (Full Calendar)
- Visualização mensal/semanal/diária
- Drag & drop para reagendar
- Color coding por tipo de evento
- Quick create modal

### 2. **NotificationDropdown**
- Badge com unread count
- Lista de notificações recentes
- Actions (marcar lida, ir para link)
- "Ver todas" link

### 3. **EventModal**
- Create/Edit form
- Datepicker com timezone
- Participant selector (multi-select)
- Recurring event options (RRULE builder)
- Online meeting integration
- Reminder checkboxes

### 4. **AgendaDashboard**
- Today's events
- Upcoming events (next 7 days)
- Calendar heatmap
- Quick stats cards

---

## 🚀 Próximos Passos

1. ✅ **Executar migration** no Supabase
2. ✅ **Deploy edge functions**
3. ✅ **Configurar cron jobs**
4. ⏳ **Criar componentes UI** (CalendarView, NotificationCenter)
5. ⏳ **Integrar com CRM** (client_id FK)
6. ⏳ **Setup SMTP webhook** para emails
7. ⏳ **Setup Push notifications** (FCM)
8. ⏳ **Testes E2E** do fluxo completo

---

## 📞 Support & Troubleshooting

### Realtime não funciona?
```typescript
// Verificar conexão
const { data, error } = await supabase
  .from('calendar_events')
  .select('*')
  .limit(1)

console.log('Supabase connected:', !error)
```

### Notificações não são enviadas?
```bash
# Verificar logs da edge function
supabase functions logs notification-processor --tail

# Verificar cron job no Dashboard
# Verificar env vars configuradas
```

### Webhook falha?
```sql
-- Verificar logs
SELECT * FROM webhook_logs 
WHERE success = false 
ORDER BY created_at DESC 
LIMIT 10;
```

---

**Sistema pronto para uso!** 🎉
