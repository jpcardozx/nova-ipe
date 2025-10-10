# 🔗 WEBHOOKS PROPOSTOS - DASHBOARD NOVA IPÊ

## 15 Webhooks Essenciais para o Sistema

### 📊 CATEGORIA 1: GESTÃO DE USUÁRIOS (5 webhooks)

#### 1. user.created
**Trigger:** Novo usuário se registra
**Payload:** user_id, email, created_at
**Ação:** 
- Criar perfil na tabela `profiles`
- Enviar email de boas-vindas
- Notificar admin no dashboard
- Criar entrada de auditoria

#### 2. user.updated
**Trigger:** Usuário atualiza dados do perfil
**Payload:** user_id, changes, updated_at
**Ação:**
- Atualizar tabela `profiles`
- Log de alterações
- Notificar se mudança de email

#### 3. user.deleted
**Trigger:** Usuário é deletado
**Payload:** user_id, email, deleted_at
**Ação:**
- Arquivar dados (LGPD)
- Remover sessões ativas
- Notificar equipe

#### 4. password.reset_requested
**Trigger:** Usuário solicita reset de senha
**Payload:** user_id, email, token, expires_at
**Ação:**
- Enviar email com link de reset
- Log de segurança
- Alerta se múltiplas tentativas

#### 5. user.login_failed
**Trigger:** Falha de login (3+ tentativas)
**Payload:** email, ip_address, attempts, timestamp
**Ação:**
- Bloquear temporariamente
- Notificar usuário por email
- Log de segurança

---

### 🏠 CATEGORIA 2: GESTÃO DE IMÓVEIS (5 webhooks)

#### 6. property.created
**Trigger:** Novo imóvel cadastrado
**Payload:** property_id, user_id, data, created_at
**Ação:**
- Processar imagens (resize, webp)
- Gerar thumbnail automático
- Indexar para busca
- Notificar equipe de revisão

#### 7. property.status_changed
**Trigger:** Status do imóvel muda (pending→approved→archived)
**Payload:** property_id, old_status, new_status, changed_by
**Ação:**
- Atualizar índices de busca
- Notificar proprietário
- Atualizar estatísticas do dashboard
- Trigger email marketing se aprovado

#### 8. property.photos_uploaded
**Trigger:** Fotos são enviadas para imóvel
**Payload:** property_id, photo_urls[], uploaded_by
**Ação:**
- Otimizar imagens (compressão)
- Gerar múltiplos tamanhos (thumb, medium, large)
- Extrair metadados (geolocalização)
- Atualizar contadores

#### 9. property.lead_generated
**Trigger:** Usuário demonstra interesse no imóvel
**Payload:** property_id, user_id, type (visit|contact|whatsapp)
**Ação:**
- Criar registro de lead no CRM
- Notificar corretor responsável
- Email automático para cliente
- Atualizar métricas de conversão

#### 10. property.archived
**Trigger:** Imóvel é arquivado/vendido
**Payload:** property_id, reason, archived_by
**Ação:**
- Remover de listagens ativas
- Atualizar estatísticas
- Notificar interessados (imóvel vendido)
- Gerar relatório de performance

---

### 📈 CATEGORIA 3: ANALYTICS E NOTIFICAÇÕES (5 webhooks)

#### 11. dashboard.daily_report
**Trigger:** Agendado diariamente às 8h
**Payload:** date, stats{views, leads, new_properties}
**Ação:**
- Gerar relatório diário
- Enviar email para equipe
- Atualizar gráficos do dashboard
- Calcular métricas de conversão

#### 12. analytics.high_traffic_alert
**Trigger:** Pico de tráfego detectado (>200 visitas/hora)
**Payload:** timestamp, page, visitors_count
**Ação:**
- Notificar equipe
- Verificar performance do servidor
- Log para análise posterior

#### 13. crm.new_opportunity
**Trigger:** Lead qualificado criado
**Payload:** lead_id, property_id, user_id, score
**Ação:**
- Criar task no CRM
- Atribuir corretor automaticamente
- Enviar notificação push
- Email de follow-up agendado

#### 14. sync.wordpress_complete
**Trigger:** Sincronização WordPress finalizada
**Payload:** total_synced, new_count, updated_count
**Ação:**
- Atualizar dashboard de importação
- Notificar admin
- Gerar log detalhado
- Limpar cache

#### 15. backup.completed
**Trigger:** Backup automático concluído
**Payload:** backup_id, size, duration, success
**Ação:**
- Notificar admin
- Verificar integridade
- Atualizar histórico de backups
- Limpar backups antigos (>30 dias)

---

## 🔧 Implementação Recomendada

### Stack Sugerida:
```
Supabase Database Webhooks → Edge Functions → Actions
```

### Estrutura de Tabelas Necessárias:
```sql
-- Logs de webhooks
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_name TEXT NOT NULL,
  payload JSONB,
  status TEXT, -- success, failed, pending
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Perfis de usuário
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'client', -- client, realtor, admin
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Prioridade de Implementação:
🔴 Alta: #6, #7, #9, #13 (core do negócio)
🟡 Média: #1, #2, #11, #14 (operacional)
🟢 Baixa: #3, #5, #12, #15 (nice-to-have)
