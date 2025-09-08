# 🚀 Guia de Configuração Vercel - ipeimoveis.vercel.app

## 📋 Resumo da Situação

✅ **Status Atual:**
- Projeto existe na Vercel como `ipeimoveis.vercel.app`
- Configurações de produção atualizadas para domínio correto
- Variáveis Supabase definidas nos arquivos `.env.production`
- TypeScript sem erros ✨

## 🔗 Passo 1: Conectar Projeto Local à Vercel

```bash
# 1. Fazer login na Vercel (se necessário)
npx vercel login

# 2. Conectar ao projeto existente
npx vercel link
# Quando perguntado:
# - "Link to existing project?" → YES
# - "What's the name of your existing project?" → ipeimoveis
```

## 🔧 Passo 2: Verificar Variáveis de Ambiente

```bash
# Verificar variáveis atuais
npx vercel env ls

# Verificar se existem as variáveis necessárias:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY  
# - NEXT_PUBLIC_SITE_URL
```

## ➕ Passo 3: Adicionar Variáveis (se necessário)

```bash
# Adicionar URL do Supabase
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Valor: https://ifhfpaehnjpdwdocdzwd.supabase.co

# Adicionar chave anônima do Supabase
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaGZwYWVobmpwZHdkb2NkendkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMDMxMzIsImV4cCI6MjA3MjU3OTEzMn0.-YL0e3oE6mRqL0K432iP3dlbTRPz8G07QJLOI0Ulcyk

# Adicionar URL do site
npx vercel env add NEXT_PUBLIC_SITE_URL production
# Valor: https://ipeimoveis.vercel.app
```

## 🚀 Passo 4: Deploy

```bash
# Deploy para produção
npx vercel --prod

# Ou fazer push para main (se conectado ao GitHub)
git add .
git commit -m "fix: configuração Supabase para ipeimoveis.vercel.app"
git push origin main
```

## 🏠 Passo 5: Verificar no Dashboard Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto `ipeimoveis`
3. Vá em **Settings** → **Environment Variables**
4. Verifique se as 3 variáveis estão configuradas:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ✅ `NEXT_PUBLIC_SITE_URL`

## 🔍 Passo 6: Testar Conexão

Após o deploy, acesse:
- **Site**: https://ipeimoveis.vercel.app
- **Login**: https://ipeimoveis.vercel.app/login
- **Blog**: https://ipeimoveis.vercel.app/blog

## 🛠️ Troubleshooting

### Se der erro de autenticação:
```bash
npx vercel logout
npx vercel login
```

### Se não encontrar o projeto:
1. Verifique o nome exato no dashboard Vercel
2. Confirme que você tem acesso ao projeto
3. Use o nome exato quando fizer `vercel link`

### Se Supabase não conectar:
1. Verifique se as variáveis foram salvas corretamente
2. Faça um novo deploy: `npx vercel --prod`
3. Verifique logs: `npx vercel logs ipeimoveis.vercel.app`

## ✅ Checklist Final

- [ ] Projeto conectado via `vercel link`
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Site acessível em https://ipeimoveis.vercel.app
- [ ] Login/Supabase funcionando
- [ ] Blog carregando corretamente

---

**💡 Dica:** Use `npx vercel logs` para ver logs em tempo real e debugar qualquer problema.
