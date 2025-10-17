# 🚀 Configuração de Variáveis de Ambiente - Vercel

## 🔴 Problema Atual

```
Error: supabaseUrl is required.
Export encountered an error on /quiz/page: /quiz
```

## ✅ Solução

As variáveis de ambiente do Supabase não estão configuradas no Vercel.

## 📋 Variáveis Necessárias

### 1. NEXT_PUBLIC_SUPABASE_URL
```
https://ifhfpaehnjpdwdocdzwd.supabase.co
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaGZwYWVobmpwZHdkb2NkendkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMDMxMzIsImV4cCI6MjA3MjU3OTEzMn0.-YL0e3oE6mRqL0K432iP3dlbTRPz8G07QJLOI0Ulcyk
```

## 🎯 Como Configurar

### Opção 1: Via Interface Web (RECOMENDADO)

1. Acesse: https://vercel.com/jpcardozx/arco/settings/environment-variables

2. Clique em "Add New" para cada variável:

   **Primeira Variável:**
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://ifhfpaehnjpdwdocdzwd.supabase.co`
   - **Environments:** ✓ Production ✓ Preview ✓ Development
   - Clique em "Save"

   **Segunda Variável:**
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (JWT completo)
   - **Environments:** ✓ Production ✓ Preview ✓ Development
   - Clique em "Save"

3. **Force um novo deploy:**
   - Vá para: https://vercel.com/jpcardozx/arco
   - Clique nos três pontos (...) no último deployment
   - Selecione "Redeploy"
   - Marque "Use existing Build Cache" como **desmarcado**
   - Clique em "Redeploy"

### Opção 2: Via Vercel CLI

```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Login no Vercel
vercel login

# Adicionar variáveis
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Cole: https://ifhfpaehnjpdwdocdzwd.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Cole o JWT completo

# Repetir para preview e development
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview

vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development

# Force um novo deploy
vercel --prod --force
```

## ⚠️ Importante

1. **Todas as variáveis que começam com `NEXT_PUBLIC_` são expostas no browser**
   - Isso é correto e esperado para o Supabase
   - A anon key é projetada para ser pública
   - A segurança é garantida pelo Row Level Security (RLS) do Supabase

2. **Você DEVE fazer um novo deploy após adicionar as variáveis**
   - As variáveis só ficam disponíveis em novos builds
   - Faça um redeploy ou push de um novo commit

3. **Configure para todos os ambientes**
   - Production: para o site em produção
   - Preview: para PRs e branches de preview
   - Development: para desenvolvimento local via Vercel

## 🔍 Como Verificar se Funcionou

Após o deploy, verifique no console do browser:

```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
// Deve mostrar: https://ifhfpaehnjpdwdocdzwd.supabase.co
```

Ou procure no log de build do Vercel. Se não houver mais o erro:
```
Error: supabaseUrl is required.
```

Então está funcionando! ✅

## 📚 Referências

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase with Vercel](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

---

**Última atualização:** 17 de outubro de 2025
