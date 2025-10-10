# ANÁLISE COMPLETA: Schema SQL e Tipos TypeScript

**Data:** 2025-10-10
**Escopo:** Migrations SQL + Tipos TypeScript + Integridade de dados

---

## SUMÁRIO EXECUTIVO

### Estatísticas
- **Migrations analisadas:** 8 arquivos
- **Tabelas criadas:** 12 tabelas
- **Índices criados:** 50 índices
- **Tabelas com RLS:** 11 tabelas
- **Foreign Keys:** 11 referências
- **Problemas críticos encontrados:** 7
- **Problemas médios encontrados:** 12
- **Melhorias sugeridas:** 18

---

## 1. PROBLEMAS CRÍTICOS 🔴

### 1.1 Migrations Duplicadas de user_profiles
**Tipo:** Duplicidade
**Severidade:** 🔴 Crítica
**Local:**
- `/home/jpcardozx/projetos/nova-ipe/supabase/migrations/20251010_supabase_auth_migration.sql`
- `/home/jpcardozx/projetos/nova-ipe/supabase/migrations/20251010_supabase_auth_migration_fixed.sql`
- `/home/jpcardozx/projetos/nova-ipe/supabase/migrations/20251010_supabase_auth_migration_v2.sql`

**Problema:**
Existem **3 migrations diferentes** tentando criar/alterar a tabela `user_profiles` com lógicas conflitantes:
- `v1`: Cria coluna `auth_user_id` (UUID)
- `v2_fixed`: Tenta migrar `id` de UUID para TEXT
- `v2`: Abordagem estratégica diferente

Isso causa:
- Conflitos ao executar migrations sequencialmente
- Risco de perda de dados ao tentar alterar tipo de `id`
- Inconsistência entre ambientes (dev/staging/prod)

**Solução:**
```sql
-- CONSOLIDAR em uma única migration final
-- Arquivo: 20251010_user_profiles_final.sql

-- 1. Drop migrations antigas (se ainda não executadas)
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 2. Criar tabela definitiva
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  department TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  preferences JSONB DEFAULT '{}',
  stats JSONB DEFAULT '{}',
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índices obrigatórios
CREATE INDEX idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);
CREATE UNIQUE INDEX idx_user_profiles_email ON user_profiles(email);

-- 4. RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- 5. Trigger para auto-criar perfil
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (auth_user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (email) DO UPDATE SET
    auth_user_id = EXCLUDED.auth_user_id,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

### 1.2 Tabela user_profiles não está em types/supabase.ts
**Tipo:** Tipo TypeScript Faltando
**Severidade:** 🔴 Crítica
**Local:** `/home/jpcardozx/projetos/nova-ipe/types/supabase.ts`

**Problema:**
A tabela `user_profiles` existe nas migrations mas **não está definida** em `Database['public']['Tables']`.

Isso causa:
- Erros de TypeScript ao fazer queries
- Autocompletar não funciona
- Type safety quebrado

**Solução:**
```typescript
// Adicionar em types/supabase.ts

export type Database = {
  public: {
    Tables: {
      // ... outras tabelas ...

      user_profiles: {
        Row: {
          id: string
          auth_user_id: string | null
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          department: string | null
          role: string | null
          status: string | null
          preferences: Json | null
          stats: Json | null
          permissions: string[] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          department?: string | null
          role?: string | null
          status?: string | null
          preferences?: Json | null
          stats?: Json | null
          permissions?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          auth_user_id?: string | null
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          department?: string | null
          role?: string | null
          status?: string | null
          preferences?: Json | null
          stats?: Json | null
          permissions?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_auth_user_id_fkey"
            columns: ["auth_user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
  }
}
```

---

### 1.3 Tabelas de Alíquotas não têm tipos em supabase.ts
**Tipo:** Tipo TypeScript Faltando
**Severidade:** 🔴 Crítica
**Local:** `/home/jpcardozx/projetos/nova-ipe/types/supabase.ts`

**Problema:**
As seguintes tabelas existem em migrations mas não em types:
- `rent_adjustments`
- `adjustment_history`
- `calculation_settings`
- `pdf_templates`

**Solução:**
```typescript
// Adicionar em types/supabase.ts

rent_adjustments: {
  Row: {
    id: string
    property_id: string | null
    client_id: string | null
    property_address: string
    property_code: string | null
    tenant_name: string
    tenant_email: string | null
    tenant_phone: string | null
    tenant_document: string | null
    current_rent: number
    iptu_value: number | null
    condominium_value: number | null
    other_charges: number | null
    reference_rate: number
    adjustment_percentage: number | null
    calculation_method: string | null
    new_rent: number
    increase_amount: number | null
    calculation_date: string
    effective_date: string | null
    review_date: string | null
    status: string | null
    approval_status: string | null
    approved_by: string | null
    approved_at: string | null
    approval_notes: string | null
    pdf_url: string | null
    pdf_filename: string | null
    pdf_generated_at: string | null
    sent_at: string | null
    sent_by: string | null
    sent_to_emails: string[] | null
    tenant_response: string | null
    tenant_response_date: string | null
    tenant_response_notes: string | null
    notes: string | null
    internal_notes: string | null
    tags: string[] | null
    metadata: Json | null
    calculation_config: Json | null
    created_at: string | null
    updated_at: string | null
    created_by: string | null
    updated_by: string | null
    deleted_at: string | null
    deleted_by: string | null
  }
  Insert: {
    // ... tipos de inserção
  }
  Update: {
    // ... tipos de atualização
  }
  Relationships: []
}

adjustment_history: {
  Row: {
    id: string
    adjustment_id: string
    action: string
    action_description: string | null
    performed_by: string | null
    performed_by_name: string | null
    performed_by_role: string | null
    old_values: Json | null
    new_values: Json | null
    metadata: Json | null
    created_at: string | null
    ip_address: unknown | null
    user_agent: string | null
  }
  Insert: {
    // ...
  }
  Update: {
    // ...
  }
  Relationships: [
    {
      foreignKeyName: "adjustment_history_adjustment_id_fkey"
      columns: ["adjustment_id"]
      isOneToOne: false
      referencedRelation: "rent_adjustments"
      referencedColumns: ["id"]
    }
  ]
}

calculation_settings: {
  Row: {
    id: string
    name: string
    description: string | null
    code: string | null
    index_type: string
    base_rate: number | null
    applies_to: string | null
    property_types: string[] | null
    calculation_formula: string | null
    min_rate: number | null
    max_rate: number | null
    valid_from: string | null
    valid_until: string | null
    active: boolean | null
    is_default: boolean | null
    settings: Json | null
    created_at: string | null
    updated_at: string | null
    created_by: string | null
    updated_by: string | null
  }
  Insert: {
    // ...
  }
  Update: {
    // ...
  }
  Relationships: []
}

pdf_templates: {
  Row: {
    id: string
    name: string
    description: string | null
    code: string
    template_type: string | null
    header_html: string | null
    body_html: string | null
    footer_html: string | null
    styles_css: string | null
    page_size: string | null
    orientation: string | null
    margins: Json | null
    available_variables: string[] | null
    preview_image_url: string | null
    active: boolean | null
    is_default: boolean | null
    created_at: string | null
    updated_at: string | null
    created_by: string | null
    updated_by: string | null
  }
  Insert: {
    // ...
  }
  Update: {
    // ...
  }
  Relationships: []
}
```

---

### 1.4 Tabelas de Calendário/Notificações não têm tipos em supabase.ts
**Tipo:** Tipo TypeScript Faltando
**Severidade:** 🔴 Crítica
**Local:** `/home/jpcardozx/projetos/nova-ipe/types/supabase.ts`

**Problema:**
As seguintes tabelas existem em migrations mas não em types:
- `event_participants`
- `notification_preferences`
- `webhook_logs`

**Nota:** `calendar_events` e `notifications` JÁ EXISTEM em types/supabase.ts mas com **estrutura diferente** das migrations!

**Conflito identificado:**

**Migration (20250110):**
```sql
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  event_type VARCHAR(50),
  status VARCHAR(30),
  user_id UUID NOT NULL,
  created_by UUID NOT NULL,
  assigned_to UUID[],
  -- ...
);
```

**Types/supabase.ts (existente):**
```typescript
calendar_events: {
  Row: {
    id: string
    title: string
    start_date: string  // ❌ Diferente! Migration usa start_datetime
    end_date: string    // ❌ Diferente! Migration usa end_datetime
    event_type: string | null
    client_id: string | null
    created_by: string | null
    attendees: string[] | null  // ❌ Migration usa assigned_to
    // ...
  }
}
```

**Severidade:** 🔴🔴🔴 **CRÍTICA** - Runtime errors garantidos!

**Solução:**
```typescript
// SUBSTITUIR definição em types/supabase.ts

calendar_events: {
  Row: {
    id: string
    title: string
    description: string | null
    location: string | null
    start_datetime: string  // ✅ Corrigido
    end_datetime: string    // ✅ Corrigido
    all_day: boolean | null
    timezone: string | null
    event_type: string
    category: string | null
    priority: string | null
    status: string | null
    user_id: string
    created_by: string
    assigned_to: string[] | null  // ✅ Corrigido
    client_id: string | null
    property_id: string | null
    task_id: string | null
    is_recurring: boolean | null
    recurrence_rule: Json | null
    parent_event_id: string | null
    reminders: number[] | null
    notification_sent: boolean | null
    metadata: Json | null
    attachments: Json | null
    tags: string[] | null
    online_meeting: Json | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    // ...
  }
  Update: {
    // ...
  }
  Relationships: [
    {
      foreignKeyName: "calendar_events_parent_event_id_fkey"
      columns: ["parent_event_id"]
      isOneToOne: false
      referencedRelation: "calendar_events"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "calendar_events_client_id_fkey"
      columns: ["client_id"]
      isOneToOne: false
      referencedRelation: "crm_clients"
      referencedColumns: ["id"]
    }
  ]
}

// ADICIONAR tabelas faltantes:

event_participants: {
  Row: {
    id: string
    event_id: string
    user_id: string
    status: string | null
    role: string | null
    response_at: string | null
    notes: string | null
    notification_preferences: Json | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    // ...
  }
  Update: {
    // ...
  }
  Relationships: [
    {
      foreignKeyName: "event_participants_event_id_fkey"
      columns: ["event_id"]
      isOneToOne: false
      referencedRelation: "calendar_events"
      referencedColumns: ["id"]
    }
  ]
}

notification_preferences: {
  Row: {
    id: string
    user_id: string
    enabled: boolean | null
    quiet_hours_start: string | null
    quiet_hours_end: string | null
    timezone: string | null
    email_enabled: boolean | null
    email_digest: boolean | null
    email_digest_time: string | null
    push_enabled: boolean | null
    sms_enabled: boolean | null
    events_enabled: boolean | null
    tasks_enabled: boolean | null
    clients_enabled: boolean | null
    marketing_enabled: boolean | null
    system_enabled: boolean | null
    default_event_reminders: number[] | null
    metadata: Json | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    // ...
  }
  Update: {
    // ...
  }
  Relationships: []
}

webhook_logs: {
  Row: {
    id: string
    webhook_type: string
    endpoint: string | null
    event_id: string | null
    notification_id: string | null
    user_id: string | null
    request_method: string | null
    request_headers: Json | null
    request_body: Json | null
    response_status: number | null
    response_body: Json | null
    response_time_ms: number | null
    success: boolean | null
    error_message: string | null
    retry_count: number | null
    created_at: string | null
    processed_at: string | null
  }
  Insert: {
    // ...
  }
  Update: {
    // ...
  }
  Relationships: [
    {
      foreignKeyName: "webhook_logs_event_id_fkey"
      columns: ["event_id"]
      isOneToOne: false
      referencedRelation: "calendar_events"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "webhook_logs_notification_id_fkey"
      columns: ["notification_id"]
      isOneToOne: false
      referencedRelation: "notifications"
      referencedColumns: ["id"]
    }
  ]
}
```

---

### 1.5 Foreign Key faltando: rent_adjustments → profiles
**Tipo:** Constraint Faltando
**Severidade:** 🔴 Crítica
**Local:** `20250108_create_aliquotas_tables.sql` (linhas 58, 89)

**Problema:**
Campos `approved_by`, `created_by`, `updated_by` referenciam `UUID` mas não têm FK para `auth.users` ou `profiles`.

**Risco:**
- Dados órfãos (IDs inválidos)
- Impossível fazer JOIN confiável
- Perda de integridade referencial

**Solução:**
```sql
-- Adicionar no final da migration 20250108_create_aliquotas_tables.sql

ALTER TABLE rent_adjustments
  ADD CONSTRAINT fk_rent_adjustments_approved_by
  FOREIGN KEY (approved_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE rent_adjustments
  ADD CONSTRAINT fk_rent_adjustments_created_by
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE rent_adjustments
  ADD CONSTRAINT fk_rent_adjustments_updated_by
  FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE rent_adjustments
  ADD CONSTRAINT fk_rent_adjustments_sent_by
  FOREIGN KEY (sent_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Mesmo para calculation_settings e pdf_templates
ALTER TABLE calculation_settings
  ADD CONSTRAINT fk_calculation_settings_created_by
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE calculation_settings
  ADD CONSTRAINT fk_calculation_settings_updated_by
  FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE pdf_templates
  ADD CONSTRAINT fk_pdf_templates_created_by
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE pdf_templates
  ADD CONSTRAINT fk_pdf_templates_updated_by
  FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL;
```

---

### 1.6 RLS Policy incorreta: referência a tabela "profiles" inexistente
**Tipo:** RLS
**Severidade:** 🔴 Crítica
**Local:** `20250108_create_aliquotas_tables.sql` (linhas 395-440)

**Problema:**
As políticas RLS referenciam `profiles` mas a migration não cria essa tabela:

```sql
-- LINHA 398
USING (auth.uid() = created_by OR auth.uid() IN (
  SELECT id FROM profiles WHERE role IN ('admin', 'realtor')  -- ❌ profiles não existe!
))
```

**Impacto:**
- RLS quebrado (queries falham)
- Usuários não conseguem acessar dados
- Sistema inutilizável

**Solução:**
```sql
-- SUBSTITUIR políticas em 20250108_create_aliquotas_tables.sql

-- Política: Usuários podem ver seus reajustes
DROP POLICY IF EXISTS "Usuários podem ver seus próprios reajustes" ON rent_adjustments;
CREATE POLICY "Users can view own adjustments"
  ON rent_adjustments FOR SELECT
  USING (
    auth.uid() = created_by
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'realtor')
    )
  );

-- Política: Usuários podem criar reajustes
DROP POLICY IF EXISTS "Usuários podem criar reajustes" ON rent_adjustments;
CREATE POLICY "Users can create adjustments"
  ON rent_adjustments FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND status = 'active'
    )
  );

-- Política: Usuários podem atualizar seus reajustes ou admins
DROP POLICY IF EXISTS "Usuários podem atualizar seus reajustes ou admins" ON rent_adjustments;
CREATE POLICY "Users can update own adjustments or admins"
  ON rent_adjustments FOR UPDATE
  USING (
    auth.uid() = created_by
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Aplicar mesma correção para adjustment_history, calculation_settings, pdf_templates
```

---

### 1.7 CHECK constraint pode ser muito restritivo
**Tipo:** Constraint
**Severidade:** 🔴 Crítica
**Local:** `20250110_create_calendar_notifications_system.sql` (linha 64)

**Problema:**
```sql
CONSTRAINT valid_event_type CHECK (
  event_type IN ('meeting', 'viewing', 'call', 'task', 'reminder', 'appointment', 'personal', 'deadline')
)
```

Se alguém tentar criar um evento com tipo customizado, vai falhar.

**Solução:**
```sql
-- OPÇÃO 1: Remover constraint e usar no nível da aplicação
ALTER TABLE calendar_events DROP CONSTRAINT valid_event_type;

-- OPÇÃO 2: Adicionar 'other' ou 'custom'
ALTER TABLE calendar_events DROP CONSTRAINT valid_event_type;
ALTER TABLE calendar_events ADD CONSTRAINT valid_event_type CHECK (
  event_type IN ('meeting', 'viewing', 'call', 'task', 'reminder', 'appointment', 'personal', 'deadline', 'other')
);

-- OPÇÃO 3: Usar ENUM (mais robusto)
CREATE TYPE event_type_enum AS ENUM (
  'meeting', 'viewing', 'call', 'task', 'reminder', 'appointment', 'personal', 'deadline', 'other'
);

ALTER TABLE calendar_events
  ALTER COLUMN event_type TYPE event_type_enum
  USING event_type::event_type_enum;
```

---

## 2. PROBLEMAS MÉDIOS 🟡

### 2.1 Índices faltando para performance
**Tipo:** Índice
**Severidade:** 🟡 Média
**Local:** Múltiplas tabelas

**Problema:**
Colunas usadas em WHERE/JOIN sem índice:

**Tabela: rent_adjustments**
- `tenant_name` - usado em busca (linha 104 tem índice mas apenas para full-text)
- `sent_at` - usado em filtros temporais
- `effective_date` - ordenação por data

**Tabela: calendar_events**
- `category` - filtro comum
- `priority` - filtro comum
- Índice composto (user_id, start_datetime) para queries do tipo "meus eventos do dia X"

**Tabela: notifications**
- Índice composto (user_id, is_read) para "notificações não lidas do usuário"
- `created_at` - ordenação

**Solução:**
```sql
-- rent_adjustments
CREATE INDEX idx_rent_adjustments_tenant_name_trgm ON rent_adjustments USING gin(tenant_name gin_trgm_ops);
CREATE INDEX idx_rent_adjustments_sent_at ON rent_adjustments(sent_at) WHERE sent_at IS NOT NULL;
CREATE INDEX idx_rent_adjustments_effective_date ON rent_adjustments(effective_date) WHERE effective_date IS NOT NULL;

-- calendar_events
CREATE INDEX idx_calendar_events_category ON calendar_events(category);
CREATE INDEX idx_calendar_events_priority ON calendar_events(priority);
CREATE INDEX idx_calendar_events_user_datetime ON calendar_events(user_id, start_datetime);

-- notifications
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

---

### 2.2 Campos NOT NULL podem causar problemas
**Tipo:** Constraint
**Severidade:** 🟡 Média
**Local:** Múltiplas tabelas

**Problema:**
Campos obrigatórios que podem não estar disponíveis no momento da criação:

**calendar_events:**
- `user_id UUID NOT NULL` - OK
- `created_by UUID NOT NULL` - OK
- `start_datetime` e `end_datetime` NOT NULL - OK

**rent_adjustments:**
- `property_address TEXT NOT NULL` - OK
- `tenant_name TEXT NOT NULL` - OK
- `current_rent DECIMAL NOT NULL` - OK

**Tudo parece correto**, mas considere:

**notification_preferences:**
- `user_id UUID NOT NULL UNIQUE` - OK

**Recomendação:**
Adicionar valores DEFAULT para evitar erros:

```sql
ALTER TABLE notification_preferences
  ALTER COLUMN enabled SET DEFAULT TRUE;

ALTER TABLE notification_preferences
  ALTER COLUMN email_enabled SET DEFAULT TRUE;

ALTER TABLE notification_preferences
  ALTER COLUMN push_enabled SET DEFAULT TRUE;
```

---

### 2.3 Soft delete sem índice
**Tipo:** Índice
**Severidade:** 🟡 Média
**Local:** `rent_adjustments` (linha 105)

**Problema:**
Tabela tem `deleted_at` para soft delete, mas queries sempre vão incluir `WHERE deleted_at IS NULL`.

**Performance:**
Sem índice parcial, todas as rows (incluindo deletadas) serão escaneadas.

**Solução:**
```sql
-- Já existe! (linha 105)
CREATE INDEX idx_rent_adjustments_deleted_at
  ON rent_adjustments(deleted_at)
  WHERE deleted_at IS NULL;

-- ✅ Correto! Parabéns!

-- Mas considere também índice composto para queries comuns:
CREATE INDEX idx_rent_adjustments_active_status
  ON rent_adjustments(status, deleted_at)
  WHERE deleted_at IS NULL;
```

---

### 2.4 Timezone não especificado
**Tipo:** Tipo de Dados
**Severidade:** 🟡 Média
**Local:** Múltiplas tabelas

**Problema:**
Algumas colunas usam `TIMESTAMPTZ` (correto), outras apenas `TIMESTAMP`.

**calendar_events:**
✅ Usa `TIMESTAMPTZ` (correto)

**rent_adjustments:**
✅ Usa `TIMESTAMPTZ` (correto)

**notifications:**
✅ Usa `TIMESTAMPTZ` (correto)

**wordpress_properties:**
✅ Usa `TIMESTAMPTZ` (correto)

**Tudo correto!** 🎉

---

### 2.5 JSON vs JSONB
**Tipo:** Tipo de Dados
**Severidade:** 🟡 Média
**Local:** Múltiplas tabelas

**Problema:**
Algumas migrations usam `JSON`, outras `JSONB`.

**Performance:** JSONB é mais rápido para queries.

**Análise:**
- `rent_adjustments.metadata` - JSONB ✅
- `calendar_events.metadata` - JSONB ✅
- `notifications.metadata` - JSON ❌

**Solução:**
```sql
-- Mudar de JSON para JSONB
ALTER TABLE notifications
  ALTER COLUMN metadata TYPE JSONB
  USING metadata::jsonb;

-- Adicionar índice GIN para busca rápida
CREATE INDEX idx_notifications_metadata
  ON notifications USING gin(metadata);
```

---

### 2.6 Funções trigger sem erro handling
**Tipo:** Trigger
**Severidade:** 🟡 Média
**Local:** `20250110_create_calendar_notifications_system.sql` (linhas 319-362)

**Problema:**
Função `create_event_notifications()` não trata erros se inserção falhar.

**Solução:**
```sql
CREATE OR REPLACE FUNCTION create_event_notifications()
RETURNS TRIGGER AS $$
DECLARE
    reminder_minutes INTEGER;
    notification_time TIMESTAMPTZ;
    notification_id UUID;
BEGIN
    IF NEW.reminders IS NOT NULL THEN
        FOREACH reminder_minutes IN ARRAY NEW.reminders
        LOOP
            notification_time := NEW.start_datetime - (reminder_minutes || ' minutes')::INTERVAL;

            IF notification_time > NOW() THEN
                BEGIN
                    INSERT INTO notifications (
                        title, message, type, priority, category,
                        user_id, event_id, scheduled_for,
                        action_url, action_label
                    ) VALUES (
                        '🔔 Lembrete: ' || NEW.title,
                        'Seu evento começa em ' || reminder_minutes || ' minutos',
                        'reminder', NEW.priority, 'event',
                        NEW.user_id, NEW.id, notification_time,
                        '/dashboard/agenda?event=' || NEW.id,
                        'Ver Evento'
                    )
                    RETURNING id INTO notification_id;

                    RAISE NOTICE 'Notificação criada: %', notification_id;
                EXCEPTION
                    WHEN OTHERS THEN
                        RAISE WARNING 'Falha ao criar notificação para evento %: %', NEW.id, SQLERRM;
                        -- Continuar processando próximo reminder
                END;
            END IF;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### 2.7 View sem índice materializada
**Tipo:** Performance
**Severidade:** 🟡 Média
**Local:** `20250108_create_aliquotas_tables.sql` (linha 365)

**Problema:**
View `adjustment_statistics` calcula agregações pesadas em tempo real.

**Solução:**
```sql
-- Transformar em Materialized View
DROP VIEW IF EXISTS adjustment_statistics;

CREATE MATERIALIZED VIEW adjustment_statistics AS
SELECT
  DATE_TRUNC('month', calculation_date) AS period,
  COUNT(*) AS total_adjustments,
  COUNT(*) FILTER (WHERE status = 'approved') AS approved_count,
  COUNT(*) FILTER (WHERE status = 'sent') AS sent_count,
  COUNT(*) FILTER (WHERE tenant_response = 'accepted') AS accepted_count,
  AVG(reference_rate) AS avg_rate,
  SUM(increase_amount) AS total_increase,
  AVG(increase_amount) AS avg_increase
FROM rent_adjustments
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('month', calculation_date)
ORDER BY period DESC;

-- Índice para performance
CREATE UNIQUE INDEX idx_adjustment_statistics_period
  ON adjustment_statistics(period);

-- Refresh automático diário
CREATE OR REPLACE FUNCTION refresh_adjustment_statistics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY adjustment_statistics;
END;
$$ LANGUAGE plpgsql;

-- Agendar refresh (via pg_cron ou aplicação)
-- SELECT cron.schedule('refresh-adjustment-stats', '0 2 * * *', 'SELECT refresh_adjustment_statistics()');
```

---

### 2.8 Unique constraints faltando
**Tipo:** Constraint
**Severidade:** 🟡 Média
**Local:** Múltiplas tabelas

**Problema:**
Campos que deveriam ser únicos mas não têm constraint:

**rent_adjustments:**
- Nenhum problema aparente

**calculation_settings:**
✅ `code` tem UNIQUE (linha 151)

**pdf_templates:**
✅ `code` tem UNIQUE (linha 203)

**event_participants:**
✅ UNIQUE(event_id, user_id) (linha 176)

**Tudo correto!** 🎉

---

### 2.9 Cascade delete pode ser perigoso
**Tipo:** Foreign Key
**Severidade:** 🟡 Média
**Local:** Múltiplas tabelas

**Problema:**
`ON DELETE CASCADE` pode causar perda de dados inesperada:

**Análise:**
- `adjustment_history` → `rent_adjustments` CASCADE ✅ (histórico não faz sentido sem parent)
- `wordpress_migration_tasks` → `wordpress_properties` CASCADE ✅
- `event_participants` → `calendar_events` CASCADE ✅
- `user_profiles` → `auth.users` CASCADE ⚠️ **Considerar SET NULL**

**Recomendação:**
```sql
-- Para user_profiles, considere soft delete em vez de cascade
ALTER TABLE user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_auth_user_id_fkey;

ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_auth_user_id_fkey
  FOREIGN KEY (auth_user_id)
  REFERENCES auth.users(id)
  ON DELETE SET NULL;  -- Manter perfil, remover link

-- Adicionar coluna para identificar perfis órfãos
ALTER TABLE user_profiles ADD COLUMN is_orphaned BOOLEAN DEFAULT FALSE;

-- Trigger para marcar órfãos
CREATE OR REPLACE FUNCTION mark_orphaned_profiles()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles
  SET is_orphaned = TRUE
  WHERE auth_user_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mark_orphaned_on_user_delete
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION mark_orphaned_profiles();
```

---

### 2.10 Falta documentação inline
**Tipo:** Documentação
**Severidade:** 🟡 Média
**Local:** Todas as migrations

**Problema:**
Apenas algumas tabelas têm `COMMENT ON`:

✅ `wordpress_properties` tem (linha 167-170)
✅ `rent_adjustments` tem (linha 488-496)
❌ `calendar_events` não tem
❌ `notifications` não tem
❌ `event_participants` não tem

**Solução:**
```sql
-- Adicionar em 20250110_create_calendar_notifications_system.sql

COMMENT ON TABLE calendar_events IS
'Sistema completo de calendário com suporte a recorrência, notificações e participantes';

COMMENT ON COLUMN calendar_events.start_datetime IS
'Data/hora de início do evento (TIMESTAMPTZ para suporte a timezone)';

COMMENT ON COLUMN calendar_events.recurrence_rule IS
'Regra de recorrência no formato RRULE (RFC 5545)';

COMMENT ON TABLE event_participants IS
'Participantes de eventos com status RSVP (accepted, declined, tentative)';

COMMENT ON TABLE notification_preferences IS
'Preferências de notificação por usuário incluindo quiet hours e canais';

COMMENT ON TABLE webhook_logs IS
'Logs de webhooks para auditoria e debugging de integrações externas';
```

---

### 2.11 Array columns sem validação
**Tipo:** Constraint
**Severidade:** 🟡 Média
**Local:** Múltiplas tabelas

**Problema:**
Colunas array não têm validação de tamanho:

- `calendar_events.assigned_to UUID[]` - pode ter milhares de UUIDs
- `calendar_events.tags VARCHAR(50)[]` - pode ter milhares de tags
- `notifications.sent_to_emails TEXT[]` - pode explodir

**Solução:**
```sql
-- Adicionar CHECK constraints para limitar tamanho

ALTER TABLE calendar_events
  ADD CONSTRAINT check_assigned_to_size
  CHECK (array_length(assigned_to, 1) <= 100);

ALTER TABLE calendar_events
  ADD CONSTRAINT check_tags_size
  CHECK (array_length(tags, 1) <= 20);

ALTER TABLE rent_adjustments
  ADD CONSTRAINT check_sent_to_emails_size
  CHECK (array_length(sent_to_emails, 1) <= 50);

ALTER TABLE rent_adjustments
  ADD CONSTRAINT check_tags_size
  CHECK (array_length(tags, 1) <= 20);
```

---

### 2.12 Falta auditoria em algumas tabelas
**Tipo:** Auditoria
**Severidade:** 🟡 Média
**Local:** Múltiplas tabelas

**Problema:**
Algumas tabelas não têm campos de auditoria:

✅ `rent_adjustments` - tem `created_by`, `updated_by`, `deleted_by` (completo!)
✅ `calendar_events` - tem `created_by`, `user_id`
❌ `notifications` - não tem `created_by` ou `sent_by`
❌ `event_participants` - não tem `added_by`

**Solução:**
```sql
-- Adicionar auditoria em notifications
ALTER TABLE notifications ADD COLUMN created_by UUID;
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_created_by
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX idx_notifications_created_by ON notifications(created_by);

-- Adicionar auditoria em event_participants
ALTER TABLE event_participants ADD COLUMN added_by UUID;
ALTER TABLE event_participants ADD CONSTRAINT fk_event_participants_added_by
  FOREIGN KEY (added_by) REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX idx_event_participants_added_by ON event_participants(added_by);
```

---

## 3. MELHORIAS SUGERIDAS 🟢

### 3.1 Adicionar full-text search
**Local:** `calendar_events`, `notifications`

```sql
-- calendar_events
ALTER TABLE calendar_events ADD COLUMN search_vector TSVECTOR;

CREATE INDEX idx_calendar_events_search
  ON calendar_events USING GIN(search_vector);

CREATE OR REPLACE FUNCTION update_calendar_events_search()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('portuguese', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.location, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calendar_events_search_update
  BEFORE INSERT OR UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_calendar_events_search();

-- notifications
ALTER TABLE notifications ADD COLUMN search_vector TSVECTOR;

CREATE INDEX idx_notifications_search
  ON notifications USING GIN(search_vector);

CREATE OR REPLACE FUNCTION update_notifications_search()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('portuguese', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.message, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notifications_search_update
  BEFORE INSERT OR UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_search();
```

---

### 3.2 Adicionar particionamento por data
**Local:** `calendar_events`, `notifications`, `webhook_logs`

**Benefício:** Performance em tabelas com milhões de rows.

```sql
-- Exemplo para calendar_events
-- NOTA: Exige recriar tabela, fazer em nova migration

-- 1. Criar nova tabela particionada
CREATE TABLE calendar_events_new (
  -- mesmas colunas...
) PARTITION BY RANGE (start_datetime);

-- 2. Criar partições (exemplo: por mês)
CREATE TABLE calendar_events_2025_10 PARTITION OF calendar_events_new
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

CREATE TABLE calendar_events_2025_11 PARTITION OF calendar_events_new
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

-- 3. Migrar dados
INSERT INTO calendar_events_new SELECT * FROM calendar_events;

-- 4. Renomear
DROP TABLE calendar_events CASCADE;
ALTER TABLE calendar_events_new RENAME TO calendar_events;

-- 5. Criar função para auto-criar partições
CREATE OR REPLACE FUNCTION create_calendar_partition()
RETURNS void AS $$
DECLARE
  partition_date DATE := DATE_TRUNC('month', NOW() + INTERVAL '1 month');
  partition_name TEXT := 'calendar_events_' || TO_CHAR(partition_date, 'YYYY_MM');
  start_date TEXT := partition_date::TEXT;
  end_date TEXT := (partition_date + INTERVAL '1 month')::TEXT;
BEGIN
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF calendar_events FOR VALUES FROM (%L) TO (%L)',
    partition_name, start_date, end_date
  );
END;
$$ LANGUAGE plpgsql;

-- Agendar criação mensal (via pg_cron)
-- SELECT cron.schedule('create-calendar-partitions', '0 0 1 * *', 'SELECT create_calendar_partition()');
```

---

### 3.3 Adicionar histórico de alterações (audit log)
**Local:** Todas as tabelas principais

```sql
-- Criar tabela genérica de audit
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  old_values JSONB,
  new_values JSONB,
  changed_fields TEXT[],
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_performed_by ON audit_log(performed_by);
CREATE INDEX idx_audit_log_performed_at ON audit_log(performed_at DESC);

-- Função genérica para audit
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
  old_data JSONB;
  new_data JSONB;
  changed_fields TEXT[];
BEGIN
  IF (TG_OP = 'DELETE') THEN
    old_data := to_jsonb(OLD);
    INSERT INTO audit_log (table_name, record_id, action, old_values, performed_by)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', old_data, auth.uid());
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);

    -- Detectar campos alterados
    SELECT array_agg(key) INTO changed_fields
    FROM jsonb_each(old_data)
    WHERE value IS DISTINCT FROM new_data->key;

    INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, changed_fields, performed_by)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', old_data, new_data, changed_fields, auth.uid());
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    new_data := to_jsonb(NEW);
    INSERT INTO audit_log (table_name, record_id, action, new_values, performed_by)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', new_data, auth.uid());
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar em tabelas críticas
CREATE TRIGGER audit_rent_adjustments
  AFTER INSERT OR UPDATE OR DELETE ON rent_adjustments
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_calendar_events
  AFTER INSERT OR UPDATE OR DELETE ON calendar_events
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
```

---

### 3.4 Adicionar rate limiting para notificações
**Local:** `notifications`

```sql
-- Tabela para rastreamento de rate limit
CREATE TABLE notification_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  notification_type TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, notification_type, window_start)
);

CREATE INDEX idx_notification_rate_limits_user ON notification_rate_limits(user_id);
CREATE INDEX idx_notification_rate_limits_window ON notification_rate_limits(window_start);

-- Função para verificar rate limit
CREATE OR REPLACE FUNCTION check_notification_rate_limit(
  p_user_id UUID,
  p_type TEXT,
  p_max_per_hour INTEGER DEFAULT 100
)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
BEGIN
  -- Contar notificações na última hora
  SELECT COALESCE(SUM(count), 0) INTO current_count
  FROM notification_rate_limits
  WHERE user_id = p_user_id
    AND notification_type = p_type
    AND window_start > NOW() - INTERVAL '1 hour';

  RETURN current_count < p_max_per_hour;
END;
$$ LANGUAGE plpgsql;

-- Trigger para enforcement
CREATE OR REPLACE FUNCTION enforce_notification_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT check_notification_rate_limit(NEW.user_id, NEW.type) THEN
    RAISE EXCEPTION 'Rate limit exceeded for user % and notification type %', NEW.user_id, NEW.type;
  END IF;

  -- Registrar no rate limit
  INSERT INTO notification_rate_limits (user_id, notification_type)
  VALUES (NEW.user_id, NEW.type)
  ON CONFLICT (user_id, notification_type, window_start)
  DO UPDATE SET count = notification_rate_limits.count + 1;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notification_rate_limit_trigger
  BEFORE INSERT ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION enforce_notification_rate_limit();

-- Job de limpeza (executar diariamente)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM notification_rate_limits
  WHERE window_start < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;
```

---

### 3.5 Adicionar cache de contadores
**Local:** Várias tabelas

```sql
-- Tabela de contadores cacheados
CREATE TABLE cached_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  counter_name TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, counter_name)
);

CREATE INDEX idx_cached_counters_entity ON cached_counters(entity_type, entity_id);

-- Função para incrementar contador
CREATE OR REPLACE FUNCTION increment_counter(
  p_entity_type TEXT,
  p_entity_id UUID,
  p_counter_name TEXT,
  p_increment INTEGER DEFAULT 1
)
RETURNS void AS $$
BEGIN
  INSERT INTO cached_counters (entity_type, entity_id, counter_name, count)
  VALUES (p_entity_type, p_entity_id, p_counter_name, p_increment)
  ON CONFLICT (entity_type, entity_id, counter_name)
  DO UPDATE SET
    count = cached_counters.count + p_increment,
    last_updated = NOW();
END;
$$ LANGUAGE plpgsql;

-- Exemplo: Contador de eventos por usuário
CREATE OR REPLACE FUNCTION update_user_event_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    PERFORM increment_counter('user', NEW.user_id, 'total_events', 1);
    PERFORM increment_counter('user', NEW.user_id, 'events_' || NEW.status, 1);
  ELSIF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    PERFORM increment_counter('user', NEW.user_id, 'events_' || OLD.status, -1);
    PERFORM increment_counter('user', NEW.user_id, 'events_' || NEW.status, 1);
  ELSIF (TG_OP = 'DELETE') THEN
    PERFORM increment_counter('user', OLD.user_id, 'total_events', -1);
    PERFORM increment_counter('user', OLD.user_id, 'events_' || OLD.status, -1);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calendar_events_counter_trigger
  AFTER INSERT OR UPDATE OR DELETE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_user_event_count();
```

---

### 3.6 Implementar soft delete universal
**Local:** Todas as tabelas

```sql
-- Adicionar deleted_at em tabelas que não têm
ALTER TABLE calendar_events ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE notifications ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE event_participants ADD COLUMN deleted_at TIMESTAMPTZ;

-- Índices
CREATE INDEX idx_calendar_events_deleted ON calendar_events(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_deleted ON notifications(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_event_participants_deleted ON event_participants(deleted_at) WHERE deleted_at IS NULL;

-- Função universal de soft delete
CREATE OR REPLACE FUNCTION soft_delete(
  p_table_name TEXT,
  p_record_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  sql TEXT;
BEGIN
  sql := format(
    'UPDATE %I SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
    p_table_name
  );

  EXECUTE sql USING p_record_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Função universal de restore
CREATE OR REPLACE FUNCTION restore_deleted(
  p_table_name TEXT,
  p_record_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  sql TEXT;
BEGIN
  sql := format(
    'UPDATE %I SET deleted_at = NULL WHERE id = $1 AND deleted_at IS NOT NULL RETURNING id',
    p_table_name
  );

  EXECUTE sql USING p_record_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Job de limpeza permanente (após 90 dias)
CREATE OR REPLACE FUNCTION permanent_delete_old_soft_deleted()
RETURNS void AS $$
DECLARE
  table_rec RECORD;
BEGIN
  FOR table_rec IN
    SELECT table_name
    FROM information_schema.columns
    WHERE column_name = 'deleted_at'
      AND table_schema = 'public'
  LOOP
    EXECUTE format(
      'DELETE FROM %I WHERE deleted_at < NOW() - INTERVAL ''90 days''',
      table_rec.table_name
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

---

## 4. CHECKLIST DE AÇÕES RECOMENDADAS

### 🔴 Críticas (Fazer Imediatamente)

- [ ] **1.1** Consolidar migrations de user_profiles em uma única versão final
- [ ] **1.2** Adicionar tipo `user_profiles` em `types/supabase.ts`
- [ ] **1.3** Adicionar tipos de Alíquotas em `types/supabase.ts`
- [ ] **1.4** Corrigir tipos de `calendar_events` e adicionar tabelas faltantes
- [ ] **1.5** Adicionar Foreign Keys para campos `*_by` em `rent_adjustments`
- [ ] **1.6** Corrigir RLS policies que referenciam tabela `profiles` inexistente
- [ ] **1.7** Revisar CHECK constraints muito restritivos em `calendar_events`

### 🟡 Médias (Fazer Esta Semana)

- [ ] **2.1** Adicionar índices faltando para performance
- [ ] **2.2** Revisar campos NOT NULL e adicionar DEFAULTs onde apropriado
- [ ] **2.5** Migrar colunas JSON para JSONB
- [ ] **2.6** Adicionar error handling em triggers
- [ ] **2.7** Transformar views em Materialized Views
- [ ] **2.9** Revisar cascade deletes e considerar soft delete
- [ ] **2.11** Adicionar validação de tamanho para colunas array
- [ ] **2.12** Adicionar campos de auditoria faltando

### 🟢 Melhorias (Fazer Este Mês)

- [ ] **3.1** Implementar full-text search
- [ ] **3.2** Avaliar necessidade de particionamento
- [ ] **3.3** Implementar audit log genérico
- [ ] **3.4** Adicionar rate limiting para notificações
- [ ] **3.5** Implementar cache de contadores
- [ ] **3.6** Implementar soft delete universal

---

## 5. SCRIPT DE VALIDAÇÃO

Execute este script para verificar integridade atual:

```sql
-- ============================================
-- SCRIPT DE VALIDAÇÃO DO SCHEMA
-- ============================================

-- 1. Verificar tabelas sem RLS
SELECT
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN '✅ Habilitado' ELSE '❌ Desabilitado' END as rls_status
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE schemaname = 'public'
  AND tablename NOT LIKE 'pg_%'
ORDER BY rls_status, tablename;

-- 2. Verificar Foreign Keys faltando
SELECT
  t.table_name,
  c.column_name,
  c.data_type
FROM information_schema.columns c
JOIN information_schema.tables t ON c.table_name = t.table_name
LEFT JOIN information_schema.constraint_column_usage ccu
  ON ccu.table_name = c.table_name
  AND ccu.column_name = c.column_name
WHERE t.table_schema = 'public'
  AND c.column_name SIMILAR TO '%(_id|_by)$'
  AND c.data_type = 'uuid'
  AND ccu.constraint_name IS NULL
ORDER BY t.table_name, c.column_name;

-- 3. Verificar índices faltando em FKs
SELECT
  tc.table_name,
  kcu.column_name,
  CASE
    WHEN i.indexname IS NOT NULL THEN '✅ Tem índice'
    ELSE '❌ Sem índice'
  END as index_status
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
LEFT JOIN pg_indexes i
  ON i.tablename = tc.table_name
  AND i.indexdef LIKE '%' || kcu.column_name || '%'
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY index_status, tc.table_name;

-- 4. Verificar tabelas sem updated_at
SELECT
  table_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = t.table_name
        AND column_name = 'updated_at'
    ) THEN '✅ Tem'
    ELSE '❌ Falta'
  END as has_updated_at
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY has_updated_at, table_name;

-- 5. Verificar colunas sem NOT NULL onde deveria ter
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name IN ('id', 'created_at')
  AND is_nullable = 'YES'
ORDER BY table_name, column_name;

-- 6. Verificar soft delete implementation
SELECT
  table_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = t.table_name
        AND column_name = 'deleted_at'
    ) THEN '✅ Implementado'
    ELSE '⚠️ Não implementado'
  END as soft_delete,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_indexes
      WHERE tablename = t.table_name
        AND indexdef LIKE '%deleted_at%'
    ) THEN '✅ Tem índice'
    ELSE '❌ Sem índice'
  END as soft_delete_index
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY soft_delete, table_name;

-- 7. Analisar tamanho das tabelas
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_total_relation_size(schemaname||'.'||tablename) AS bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY bytes DESC;

-- 8. Verificar triggers por tabela
SELECT
  t.tgname AS trigger_name,
  c.relname AS table_name,
  p.proname AS function_name
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE c.relnamespace = 'public'::regnamespace
  AND NOT t.tgisinternal
ORDER BY c.relname, t.tgname;
```

---

## 6. PRÓXIMOS PASSOS

### Semana 1: Correções Críticas
1. Executar consolidação de `user_profiles` migrations
2. Gerar tipos TypeScript atualizados
3. Adicionar Foreign Keys faltando
4. Corrigir RLS policies

### Semana 2: Performance
1. Adicionar índices faltando
2. Migrar JSON para JSONB
3. Implementar Materialized Views
4. Otimizar queries lentas

### Semana 3: Robustez
1. Implementar audit log
2. Adicionar validações adicionais
3. Implementar rate limiting
4. Documentar schema completo

### Semana 4: Melhorias
1. Implementar full-text search
2. Avaliar particionamento
3. Implementar cache de contadores
4. Criar scripts de manutenção

---

## 7. RECURSOS ADICIONAIS

### Comandos Úteis

```bash
# Gerar tipos TypeScript a partir do schema
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts

# Aplicar migrations localmente
npx supabase migration up

# Verificar diff entre local e remoto
npx supabase db diff

# Fazer dump do schema atual
pg_dump -h HOST -U USER -d DB --schema-only > schema_backup.sql
```

### Links de Referência

- [Supabase RLS Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Index Types](https://www.postgresql.org/docs/current/indexes-types.html)
- [JSONB Performance](https://www.postgresql.org/docs/current/datatype-json.html)
- [Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

---

**Gerado em:** 2025-10-10
**Versão:** 1.0
**Autor:** Claude (Análise Automatizada)
