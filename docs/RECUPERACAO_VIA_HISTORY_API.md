# 🔑 Como Recuperar via History API

## ❌ Problema Atual

O token configurado tem permissão de **Editor**, mas a **History API** requer permissões de **Administrator** ou permissões específicas de History.

## 🎯 Solução: Criar Token Administrator

### Passo 1: Criar Novo Token

1. Acesse: https://www.sanity.io/manage/personal/project/0nks58lj/api/tokens

2. Clique em **"Add API token"**

3. **Preencha:**
   - **Name:** `Recovery Admin Token`
   - **Permissions:** **`Administrator`** ⭐ (IMPORTANTE!)
   
4. Clique em **"Add token"**

5. **Copie o token** (aparece só 1 vez!)

### Passo 2: Atualizar Token

Abra o arquivo `.env.local` e substitua o token atual:

```bash
# Substitua esta linha:
SANITY_API_TOKEN=sk3hRm7g...

# Pelo novo token Administrator:
SANITY_API_TOKEN=seu_novo_token_admin_aqui
```

### Passo 3: Execute o Script

```bash
node scripts/recuperar-via-history-api.js
```

---

## 🔍 O que o Script Faz

1. **Busca todas as transações** do documento via History API
2. **Identifica a transação de DELETE** e quem fez
3. **Recupera a versão anterior** ao delete
4. **Restaura automaticamente** o documento

---

## 📋 Informações para o Suporte Sanity

Se precisar contactar o suporte:

```
Project ID: 0nks58lj
Dataset: production
Document ID: d5476428-a47b-4075-9383-f0cf58f58d66
Título: "Casa Charmosa com Vista no Condomínio Alpes"
Usuário que deletou: julia@imobiliariaipe.com.br
Data da deleção: 16/10/2025
Token atual: Editor (sem acesso à History API)
```

**Pergunta ao suporte:**
> "Preciso recuperar um documento deletado hoje. Tenho o ID mas meu token Editor não tem acesso à History API. Como posso acessar o histórico para restaurar? Preciso criar um token Administrator ou há outra forma?"

---

## 🛠️ Alternativa: Via CLI com Admin Permissions

Se você tem acesso admin no projeto, pode usar o CLI:

```bash
# 1. Fazer login como admin
npx sanity login

# 2. Exportar dataset de um ponto no tempo específico
# (antes da deleção - ajuste o timestamp)
npx sanity dataset export production backup-pre-delete.tar.gz \
  --at 2025-10-16T12:00:00Z

# 3. Extrair e buscar o documento
tar -xzf backup-pre-delete.tar.gz
grep "d5476428-a47b-4075-9383-f0cf58f58d66" data.ndjson > documento-recuperado.json

# 4. Restaurar
npx sanity documents create < documento-recuperado.json
```

---

## 🔒 Sobre Permissões de Token

### **Editor** (atual)
- ✅ Ler documentos
- ✅ Criar/Editar/Deletar documentos
- ❌ **Acessar History API**
- ❌ Gerenciar projeto

### **Administrator** (necessário)
- ✅ Ler documentos
- ✅ Criar/Editar/Deletar documentos
- ✅ **Acessar History API** ⭐
- ✅ Gerenciar projeto
- ✅ Gerenciar usuários/tokens

---

## ⚡ Após Criar o Token Admin

Execute:

```bash
node scripts/recuperar-via-history-api.js
```

O script vai:
1. Listar todas as transações do documento
2. Mostrar quando foi deletado e por quem
3. Recuperar a versão anterior
4. Restaurar automaticamente
5. Limpar draft vazio (se houver)

**Tempo estimado:** 30 segundos

---

## 📚 Referências

- **History API:** https://www.sanity.io/docs/http-reference/history
- **Tokens API:** https://www.sanity.io/docs/http-auth
- **Permissions:** https://www.sanity.io/docs/access-control

---

## ✅ Checklist

```
[ ] Acessar https://www.sanity.io/manage/personal/project/0nks58lj/api/tokens
[ ] Criar token com permissão "Administrator"
[ ] Copiar o token
[ ] Atualizar SANITY_API_TOKEN no .env.local
[ ] Executar: node scripts/recuperar-via-history-api.js
[ ] Verificar no Studio se recuperou
```

---

**Última atualização:** 16/10/2025  
**Status:** Aguardando token Administrator
