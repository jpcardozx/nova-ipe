# 🔐 SISTEMA DE AUTENTICAÇÃO - DASHBOARD API

## ✅ Resposta: SIM, temos autenticação configurada!

### 📋 O que foi implementado:

#### 1. **Middleware de Autenticação** (`lib/auth/api-auth-middleware.ts`)
✅ Valida token JWT do Supabase Auth
✅ Verifica permissões por role (admin, realtor, client)
✅ Retorna 401 Unauthorized se não autenticado
✅ Retorna 403 Forbidden se role insuficiente

#### 2. **Authenticated Fetch Helper** (`lib/utils/authenticated-fetch.ts`)
✅ Obtém token da sessão Supabase automaticamente
✅ Adiciona header `Authorization: Bearer <token>`
✅ API simplificada para o dashboard: `dashboardApi.getStats()`, etc

#### 3. **API Routes Protegidas**
✅ `/api/dashboard/wordpress-catalog/stats` - Requer autenticação
✅ `/api/dashboard/wordpress-catalog/properties` - Requer autenticação
✅ `/api/dashboard/wordpress-catalog/update-status` - Requer role admin

---

## 🔐 Como Funciona

### Fluxo de Autenticação:

```
1. Usuário faz login em /login
   ↓
2. Supabase Auth gera JWT token
   ↓
3. Token salvo na sessão do browser
   ↓
4. Client component usa dashboardApi.getStats()
   ↓
5. authenticatedFetch() pega token da sessão
   ↓
6. Envia request com header: Authorization: Bearer <token>
   ↓
7. API route chama requireAuth(request)
   ↓
8. Middleware valida token com Supabase
   ↓
9. Se válido: continua processamento
   Se inválido: retorna 401 Unauthorized
```

---

## 🧪 Testando Autenticação

### 1. Sem Token (❌ Deve falhar):
```bash
curl http://localhost:3000/api/dashboard/wordpress-catalog/stats

# Resposta esperada:
{
  "error": "Missing or invalid authorization header"
}
# Status: 401 Unauthorized
```

### 2. Com Token Válido (✅ Deve funcionar):

**Primeiro, faça login e pegue o token:**
```typescript
// No browser console (após login):
const { data: { session } } = await supabase.auth.getSession()
console.log('Token:', session.access_token)
```

**Depois teste com curl:**
```bash
TOKEN="seu_token_aqui"

curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:3000/api/dashboard/wordpress-catalog/stats

# Resposta esperada:
{
  "total": 761,
  "pending": 141,
  "archived": 620,
  ...
}
# Status: 200 OK
```

### 3. Testar no Browser (✅ Automático):

```typescript
// O dashboardApi já inclui o token automaticamente!
import { dashboardApi } from '@/lib/utils/authenticated-fetch'

// Basta chamar:
const stats = await dashboardApi.getStats()
// Token é adicionado automaticamente do Supabase session
```

---

## 👥 Usuários Autorizados

### Credenciais Atuais (4 usuários):

| Email | Senha | Role | Acesso Dashboard |
|-------|-------|------|------------------|
| `jlpaula@imobiliariaipe.com.br` | `Ipe@4693` | ? | Sim (se admin/realtor) |
| `julia@imobiliariaipe.com.br` | `Ipe@4693` | ? | Sim (se admin/realtor) |
| `leonardo@imobiliariaipe.com.br` | `Ipe@4693` | ? | Sim (se admin/realtor) |
| `jpcardozo@imobiliariaipe.com.br` | `Ipe@4693` | ? | Sim (se admin/realtor) |

### ⚠️ IMPORTANTE: Configurar Roles

Os usuários precisam ter o campo `role` configurado na tabela `profiles`:

```sql
-- Verificar roles atuais
SELECT id, email, role FROM auth.users 
LEFT JOIN public.profiles ON auth.users.id = profiles.id;

-- Atualizar role para admin (exemplo)
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'user-uuid-aqui';

-- Criar perfil se não existir
INSERT INTO public.profiles (id, email, role, status, created_at)
VALUES (
  'user-uuid',
  'jpcardozo@imobiliariaipe.com.br',
  'admin',
  'active',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

---

## 📊 Níveis de Permissão

### **Admin** (role: 'admin')
✅ Acesso total ao dashboard
✅ Listar propriedades
✅ Ver estatísticas
✅ Atualizar status de propriedades
✅ Deletar propriedades (futuro)

### **Realtor** (role: 'realtor')
✅ Acesso ao dashboard
✅ Listar propriedades
✅ Ver estatísticas
❌ Não pode atualizar status (apenas admin)

### **Client** (role: 'client')
❌ Sem acesso ao dashboard
✅ Pode ver catálogo público
✅ Pode gerar leads

---

## 🔧 Código de Implementação

### API Route com Auth:

```typescript
// app/api/dashboard/wordpress-catalog/stats/route.ts
import { requireAuth } from '@/lib/auth/api-auth-middleware'

export async function GET(request: NextRequest) {
  // 🔐 Autenticação obrigatória
  const authError = await requireAuth(request)
  if (authError) return authError
  
  // Se chegou aqui, está autenticado!
  const stats = await WordPressCatalogService.getStats()
  return NextResponse.json(stats)
}
```

### Client-Side Usage:

```typescript
// app/dashboard/wordpress-catalog/page.tsx
import { dashboardApi } from '@/lib/utils/authenticated-fetch'

const { data: stats } = useQuery({
  queryKey: ['wordpress-stats'],
  queryFn: () => dashboardApi.getStats() // Token incluído automaticamente
})
```

---

## 🚨 Tratamento de Erros

### Se não autenticado:

```typescript
try {
  const stats = await dashboardApi.getStats()
} catch (error) {
  // Error: No active session - please login first
  // Redirecionar para /login
  router.push('/login')
}
```

### Se token expirou:

```typescript
// authenticatedFetch() detecta automaticamente
// e lança erro: "Invalid or expired token"

// Solução: Fazer logout e pedir novo login
await supabase.auth.signOut()
router.push('/login?expired=true')
```

---

## 📝 Checklist de Segurança

- [x] ✅ SERVICE_ROLE_KEY apenas server-side
- [x] ✅ Autenticação obrigatória nas API routes
- [x] ✅ Validação de token JWT
- [x] ✅ Verificação de role/permissões
- [x] ✅ Headers de autorização
- [ ] ⏳ Configurar roles na tabela profiles
- [ ] ⏳ Criar RLS policies na tabela profiles
- [ ] ⏳ Adicionar rate limiting
- [ ] ⏳ Logs de acesso/auditoria
- [ ] ⏳ Refresh token automático

---

## 🔜 Próximos Passos

### 1. Configurar Roles dos Usuários (PRIORITÁRIO):

```bash
# Executar script para configurar roles
node << 'EOF'
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupRoles() {
  const users = [
    { email: 'jpcardozo@imobiliariaipe.com.br', role: 'admin' },
    { email: 'julia@imobiliariaipe.com.br', role: 'realtor' },
    { email: 'leonardo@imobiliariaipe.com.br', role: 'realtor' },
    { email: 'jlpaula@imobiliariaipe.com.br', role: 'realtor' }
  ]
  
  for (const user of users) {
    const { data: authUser } = await supabase.auth.admin.listUsers()
    const foundUser = authUser.users.find(u => u.email === user.email)
    
    if (foundUser) {
      // Inserir ou atualizar profile
      await supabase.from('profiles').upsert({
        id: foundUser.id,
        email: user.email,
        role: user.role,
        status: 'active'
      })
      console.log(`✅ ${user.email} → role: ${user.role}`)
    }
  }
}

setupRoles()
EOF
```

### 2. Criar Tabela Profiles (se não existir):

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'realtor', 'client')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Usuários podem ler seu próprio perfil
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins podem ler todos os perfis
CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3. Testar Fluxo Completo:

1. ✅ Fazer login com `jpcardozo@imobiliariaipe.com.br`
2. ✅ Acessar `/dashboard/wordpress-catalog`
3. ✅ Verificar console: "Fetching stats (authenticated)"
4. ✅ Ver cards renderizando com 761 imóveis
5. ✅ Tentar atualizar status de uma propriedade
6. ✅ Verificar logs do servidor mostrando user_id

---

## 🎯 Status Atual

### ✅ IMPLEMENTADO:
- Middleware de autenticação
- Helper authenticated fetch
- API routes protegidas
- Validação de token JWT
- Verificação de roles

### ⏳ PENDENTE:
- Configurar roles na tabela profiles
- Criar tabela profiles (se não existe)
- Testar com usuário real logado
- Adicionar redirect automático para /login se não autenticado

### 🔥 CRÍTICO:
**Usuários precisam estar logados via Supabase Auth** para acessar o dashboard!

Se tentar acessar sem login:
```
Error: No active session - please login first
```

**Solução:** Ir para `/login` e entrar com as credenciais acima.

---

**Data:** 08/10/2025  
**Status:** ✅ AUTENTICAÇÃO IMPLEMENTADA  
**Próximo:** Configurar roles e testar com login real
