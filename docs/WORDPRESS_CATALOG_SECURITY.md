# WordPress Catalog - Segurança e RLS Policies

## 🔐 Arquitetura de Segurança

### ✅ Implementado

1. **Service Key Protegida**
   - ❌ `NEXT_PUBLIC_SUPABASE_SERVICE_KEY` removida (não expor no client!)
   - ✅ `SUPABASE_SERVICE_ROLE_KEY` usada apenas server-side
   - ✅ `wordpress-catalog-service.ts` usado **apenas em API routes**

2. **Autenticação em API Routes**
   - ✅ Middleware `requireAuth()` em todas as rotas `/api/dashboard/`
   - ✅ Modo dev bypass apenas em `localhost` (não funciona em produção)
   - ✅ Client-side usa `dashboardApi.getProperties()` que adiciona token automaticamente

3. **Dados Sensíveis**
   - ✅ Service key nunca enviada ao client
   - ✅ Todas as queries passam por API routes autenticadas
   - ✅ Frontend não tem acesso direto ao Supabase Admin

### 🚧 Próximos Passos: Row Level Security (RLS)

Atualmente, a segurança depende **apenas da autenticação da API route**. Para produção robusta, implemente RLS:

#### 1. Habilitar RLS na tabela

```sql
ALTER TABLE wordpress_properties ENABLE ROW LEVEL SECURITY;
```

#### 2. Policies recomendadas

**Policy 1: Admin Full Access**
```sql
CREATE POLICY "Admin users have full access"
ON wordpress_properties
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin'
  OR auth.jwt() ->> 'role' = 'realtor'
);
```

**Policy 2: Service Role Bypass (para API routes)**
```sql
CREATE POLICY "Service role has full access"
ON wordpress_properties
FOR ALL
TO service_role
USING (true);
```

**Policy 3: Public Read Only for Published**
```sql
CREATE POLICY "Public can view migrated properties"
ON wordpress_properties
FOR SELECT
TO anon
USING (status = 'migrated');
```

#### 3. Verificar policies ativas

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'wordpress_properties';
```

## 📋 Checklist de Segurança

- [x] Service key não exposta no client
- [x] API routes autenticadas
- [x] Dev mode apenas em localhost
- [ ] RLS habilitado na tabela
- [ ] Policies criadas e testadas
- [ ] Auditoria de logs de acesso
- [ ] Rate limiting em APIs
- [ ] CORS configurado corretamente

## 🔑 Variáveis de Ambiente

### Produção (Vercel/Deploy)

```bash
# ✅ Correto
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx... (anon key - pode expor)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx... (service key - NUNCA expor!)

# ❌ ERRADO
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=xxx # NUNCA fazer isso!
```

### Desenvolvimento

```bash
# .env.local (git ignored)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx... # Sem NEXT_PUBLIC_!
```

## 🚨 Avisos Importantes

1. **Service Key = Acesso Total**
   - Bypassa RLS
   - Acessa qualquer tabela
   - Pode deletar/modificar tudo
   - **NUNCA** enviar ao client

2. **Anon Key = Seguro para Client**
   - Resposta RLS policies
   - Pode ser exposta publicamente
   - Limitada pelas policies do Supabase

3. **Authenticated Token**
   - Gerado após login
   - Usado para identificar usuário
   - Resposta RLS policies
   - Enviado em headers `Authorization: Bearer <token>`

## 🛡️ Boas Práticas

1. **API Routes como Proxy**
   - ✅ Client → API Route → Supabase (service key)
   - ❌ Client → Supabase (service key exposta!)

2. **Autenticação**
   - Use `requireAuth()` em todas as rotas sensíveis
   - Valide role/permissions no middleware
   - Log de acessos para auditoria

3. **RLS como Camada Extra**
   - Mesmo com service key, RLS adiciona proteção
   - Previne bugs acidentais
   - Defense in depth

## 📚 Referências

- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Supabase Service Key Best Practices](https://supabase.com/docs/guides/api/api-keys)
