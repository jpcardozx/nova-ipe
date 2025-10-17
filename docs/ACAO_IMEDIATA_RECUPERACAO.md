# 🚨 AÇÃO IMEDIATA - Imóvel Deletado

## 🎯 Objetivo
Recuperar o imóvel que foi deletado pela corretora há ~2 horas.

## ⚡ PASSO A PASSO (5 minutos)

### PASSO 1: Configure o acesso (apenas 1x)

Execute no terminal:

```bash
./scripts/setup-recovery.sh
```

O script vai:
1. Abrir o link para gerar o token
2. Pedir que você cole o token
3. Salvar automaticamente no `.env.local`

**OU** faça manualmente:

1. Abra: https://www.sanity.io/manage/personal/project/0nks58lj/api/tokens
2. Clique em **"Add API token"**
3. Preencha:
   - **Name:** `Recovery Script`
   - **Permissions:** `Editor` (ou `Administrator`)
4. Clique em **"Add token"**
5. Copie o token que aparece (só vai aparecer 1 vez!)
6. Edite o arquivo `.env.local` e adicione:
   ```
   SANITY_API_TOKEN=skxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

### PASSO 2: Execute o script de recuperação

```bash
node scripts/recover-imovel-interactive.js
```

---

### PASSO 3: Escolha o período

```
⏰ Há quanto tempo o imóvel foi deletado?

   1. Últimas 2 horas  ← Para o seu caso
   2. Últimas 4 horas (padrão)
   3. Últimas 8 horas
   ...
```

Digite: `1` (para 2 horas atrás)

---

### PASSO 4: Identifique o imóvel

O script vai listar algo assim:

```
🔴 3 imóvel(is) deletado(s) encontrado(s):

──────────────────────────────────────────────────────────────
1. Casa com 3 quartos no centro
   📍 Rua das Flores, 123 - Centro
   💰 R$ 450.000
   🏷️  Venda - Casa
   📅 Última modificação: 16/10/2025 14:30:00
──────────────────────────────────────────────────────────────
2. Apartamento Studio em Guararema
   📍 Av. Principal, 456 - Centro
   💰 R$ 280.000
   🏷️  Venda - Apartamento
   📅 Última modificação: 16/10/2025 13:15:00
──────────────────────────────────────────────────────────────
```

---

### PASSO 5: Restaure

Digite o número do imóvel e confirme:

```
Digite o número do imóvel para restaurar (1-3): 1

⚠️  Confirma a restauração? (s/N): s

✅ Imóvel restaurado com sucesso!
```

---

## ✅ Verificação

Acesse o Studio e confirme que o imóvel voltou:

```
http://localhost:3000/studio/desk/imovel
```

Ou acesse direto pelo link que o script forneceu.

---

## 🆘 Se algo der errado

### Erro: "Token não encontrado"
**Causa:** Você não configurou o token  
**Solução:** Execute o PASSO 1 novamente

### Erro: "Nenhum imóvel foi deletado"
**Causa:** Talvez tenha sido há mais tempo  
**Solução:** No PASSO 3, escolha opção 4 (24 horas) ou 6 (1 semana)

### Erro: "The document already exists"
**Causa:** O imóvel já foi restaurado  
**Solução:** Acesse o Studio e verifique. Pode estar lá!

### Erro: "Unauthorized"
**Causa:** Token sem permissões  
**Solução:** Gere um novo token com permissão de **Editor**

---

## 📞 Contatos de emergência

- **Documentação Sanity:** https://www.sanity.io/docs/history-experience
- **Suporte:** https://www.sanity.io/help

---

## 🛡️ Prevenção futura

Após recuperar, considere:

1. **Remover permissão de delete** dos corretores
2. **Fazer backup diário** do dataset
3. **Implementar soft delete** (marcar como deletado em vez de deletar)

Guia completo em: `docs/GUIA_RECUPERACAO_IMOVEIS.md`

---

**⏱️ Tempo total:** 3-5 minutos  
**🎯 Taxa de sucesso:** ~95% (se agir rápido)  
**📅 Janela ideal:** Primeiras 24-48 horas após deleção
