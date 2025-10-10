# ⚡ GUIA RÁPIDO - 15 Minutos para Agenda Funcionando

## 🎯 Objetivo
Ter o sistema de agenda completo funcionando em **15 minutos**.

---

## ✅ PASSO 1: Database (5 min)

### 1.1 Abrir Supabase Dashboard
```
https://app.supabase.com/project/ifhfpaehnjpdwdocdzwd
```

### 1.2 Ir para SQL Editor
```
Dashboard → SQL Editor → New Query
```

### 1.3 Copiar e Executar Migration
```bash
# Abrir arquivo:
supabase/migrations/20250110_create_calendar_notifications_system.sql

# Copiar TODO o conteúdo
# Colar no SQL Editor
# Clicar em "Run" (Ctrl + Enter)
```

### 1.4 Verificar Tabelas Criadas
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'calendar_events',
    'notifications', 
    'event_participants',
    'notification_preferences',
    'webhook_logs'
  );
```

**Resultado esperado:** 5 tabelas listadas ✅

---

## ✅ PASSO 2: Provider (2 min)

### 2.1 Editar Root Layout
```typescript
// app/layout.tsx
import { NotificationProvider } from '@/app/providers/NotificationProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  )
}
```

---

## ✅ PASSO 3: Rota de Agenda (3 min)

### 3.1 Criar Página Principal
```typescript
// app/dashboard/agenda/page.tsx
import ModernAgendaPage from './modern-page'

export default function AgendaPage() {
  return <ModernAgendaPage />
}
```

### 3.2 Verificar Imports no DashboardSidebar
```typescript
// components/layout/DashboardSidebar.tsx ou app/dashboard/components/DashboardSidebar.tsx
// Verificar se já existe link para /dashboard/agenda

{
  icon: Calendar,
  label: 'Agenda',
  href: '/dashboard/agenda',
  color: 'text-indigo-600'
}
```

---

## ✅ PASSO 4: Testar (5 min)

### 4.1 Iniciar Dev Server
```bash
pnpm dev
```

### 4.2 Acessar Dashboard
```
http://localhost:3000/dashboard/agenda
```

### 4.3 Testes Rápidos

#### ✅ Teste 1: Criar Evento
1. Clicar em qualquer data no calendário
2. Digitar título
3. Confirmar
4. ✅ Evento deve aparecer imediatamente

#### ✅ Teste 2: Arrastar Evento
1. Arrastar evento para outra data
2. ✅ Evento deve mover
3. ✅ Toast "📅 Evento reagendado" deve aparecer

#### ✅ Teste 3: Deletar Evento
1. Clicar em evento
2. Confirmar exclusão
3. ✅ Evento desaparece
4. ✅ Toast "🗑️ Evento excluído" aparece

#### ✅ Teste 4: Realtime Indicator
1. ✅ Verificar badge verde "Tempo Real" no canto inferior direito

---

## 🎨 BONUS: Adicionar Calendário Compacto na Sidebar (5 min)

### Editar Sidebar
```typescript
// app/dashboard/layout.tsx ou components similar
import CompactCalendar from '@/components/calendar/CompactCalendar'

<div className="dashboard-layout">
  <aside className="sidebar">
    <DashboardSidebar />
    
    {/* Adicionar aqui */}
    <div className="mt-6 px-4">
      <CompactCalendar />
    </div>
  </aside>
  
  <main>{children}</main>
</div>
```

---

## 🔧 TROUBLESHOOTING

### Erro: "Table not found"
**Causa:** Migration não executada
**Solução:** Voltar ao Passo 1.3 e executar migration

### Erro: "User not found"
**Causa:** Usuário não logado
**Solução:** Fazer login no sistema (`/login`)

### Erro: "Permission denied"
**Causa:** RLS policies não aplicadas
**Solução:** Re-executar migration (ela cria as policies)

### Calendário não carrega
**Causa:** CSS não importado
**Solução:** Adicionar em `app/globals.css`:
```css
@import '@fullcalendar/core/main.css';
@import '@fullcalendar/daygrid/main.css';
@import '@fullcalendar/timegrid/main.css';
```

### Notificações não aparecem
**Causa:** Provider não adicionado
**Solução:** Verificar Passo 2.1

---

## ✅ CHECKLIST FINAL

Após 15 minutos, você deve ter:

- [x] 5 tabelas no Supabase
- [x] NotificationProvider no layout
- [x] Rota `/dashboard/agenda` funcionando
- [x] Pode criar eventos clicando no calendário
- [x] Pode arrastar eventos (drag & drop)
- [x] Pode deletar eventos
- [x] Toast notifications aparecem
- [x] Badge "Tempo Real" verde visível
- [x] Stats (hoje, próximos) funcionando

---

## 🚀 PRÓXIMOS PASSOS (Opcional)

### Depois de Funcionar
1. ⏳ Customizar cores dos eventos
2. ⏳ Adicionar modal avançado de criar evento
3. ⏳ Integrar com CRM (client_id)
4. ⏳ Configurar lembretes automáticos
5. ⏳ Deploy edge functions (webhooks)

### Features Avançadas
- [ ] Google Calendar sync
- [ ] Recurring events UI
- [ ] Email notifications
- [ ] Push notifications
- [ ] Team calendar
- [ ] iCal export

---

## 📞 AJUDA RÁPIDA

### Comandos Úteis

```bash
# Restart dev server
pnpm dev

# Verificar erros TypeScript
pnpm type-check

# Build production
pnpm build

# Ver logs Supabase
# (Supabase Dashboard → Logs)
```

### Arquivos Importantes

```
supabase/migrations/20250110_create_calendar_notifications_system.sql
app/dashboard/agenda/modern-page.tsx
app/providers/NotificationProvider.tsx
lib/services/calendar-notifications.ts
hooks/useAgendaSystem.ts
```

### Links Úteis

- Supabase Dashboard: https://app.supabase.com
- FullCalendar Docs: https://fullcalendar.io/docs
- Sonner Docs: https://sonner.emilkowal.ski

---

## 🎉 PRONTO!

Em **15 minutos** você tem:
- ✅ Calendário profissional
- ✅ Notificações em tempo real
- ✅ Drag & drop
- ✅ Database completo
- ✅ Realtime updates

**Agora é só usar! 🚀**

---

**Tempo médio:** 15 minutos
**Dificuldade:** ⭐⭐☆☆☆ (Fácil)
**Dependências:** Supabase configurado, Next.js rodando
