━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 GUIA: EXECUTAR SQL NO SUPABASE DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎯 Objetivo
Criar as tabelas `notifications` e `user_activities` para o dashboard funcionar.

## 📝 Passo a Passo

### 1️⃣ Acessar Supabase Dashboard
```
URL: https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd
```

### 2️⃣ Ir para SQL Editor
```
Menu Lateral > SQL Editor > New Query
```

### 3️⃣ Copiar e Colar o SQL
```
Arquivo: supabase/migrations/20251010_dashboard_tables.sql
```

Copie TODO o conteúdo do arquivo e cole no SQL Editor.

### 4️⃣ Executar
```
Botão: Run (ou Ctrl+Enter)
```

### 5️⃣ Verificar Resultado
Você deve ver no output:
```
✅ Dashboard Tables Migration Completed!
📊 Tabelas criadas:
  - notifications: 0 registros
  - user_activities: 0 registros

🔐 RLS Policies ativas em ambas as tabelas
📈 Índices criados para performance
🔔 Triggers configurados

✅ Dashboard pronto para uso!
```

### 6️⃣ Confirmar Criação das Tabelas
```
Menu Lateral > Table Editor
```

Você deve ver:
- ✅ notifications
- ✅ user_activities
- ✅ user_profiles (já existe)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🔍 Estrutura das Tabelas

### 📋 notifications
```sql
- id (UUID, PK)
- user_id (UUID, FK -> auth.users)
- type (TEXT: info|success|warning|error)
- title (TEXT)
- message (TEXT)
- read (BOOLEAN)
- metadata (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 📊 user_activities
```sql
- id (UUID, PK)
- user_id (UUID, FK -> auth.users)
- type (TEXT)
- description (TEXT)
- metadata (JSONB)
- timestamp (TIMESTAMP)
- created_at (TIMESTAMP)
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ✅ Após Executar

1. **Reinicie o servidor dev:**
   ```bash
   # No terminal, pare com Ctrl+C e rode:
   pnpm dev
   ```

2. **Teste o login:**
   ```
   URL: http://localhost:3000/login
   Email: jpcardozo@imobiliariaipe.com.br
   Senha: @Ipe4693
   ```

3. **Verifique o dashboard:**
   - Deve carregar sem erros
   - Não deve mais redirecionar para /login
   - Notificações devem funcionar (sem erros no console)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🐛 Troubleshooting

### Erro: "relation already exists"
```
✅ IGNORAR! A tabela já existe, o script usa IF NOT EXISTS.
```

### Erro: "permission denied"
```
❌ PROBLEMA! Você precisa estar logado como owner do projeto.
Verifique se está usando o usuário correto no Supabase.
```

### Dashboard ainda redireciona para /login
```
🔍 VERIFICAR:
1. Servidor dev foi reiniciado após criar as tabelas?
2. As variáveis de ambiente estão corretas no .env.local?
3. O usuário está logado? (verifique localStorage no DevTools)
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📚 Recursos Úteis

**Verificar se usuário está autenticado:**
```javascript
// No Console do Browser (DevTools):
localStorage.getItem('sb-ifhfpaehnjpdwdocdzwd-auth-token')
```

**Forçar logout:**
```javascript
// No Console do Browser:
localStorage.clear()
sessionStorage.clear()
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
