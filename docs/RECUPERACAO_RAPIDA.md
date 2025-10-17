# 🚑 Recuperação de Imóvel Deletado - AÇÃO IMEDIATA

## ⚡ Recuperação em 30 segundos

### 1. Configure o token (apenas na primeira vez)

Edite o arquivo `.env.local` e adicione:

```bash
SANITY_API_TOKEN=seu_token_aqui
```

**Como obter o token:**
1. Acesse: https://www.sanity.io/manage/personal/project/0nks58lj
2. Clique em **API** → **Tokens**
3. Clique em **Add API token**
4. Nome: "Recovery Script"
5. Permissão: **Editor** ou **Administrator**
6. Copie o token e cole no `.env.local`

### 2. Execute o script interativo

```bash
node scripts/recover-imovel-interactive.js
```

### 3. Siga as instruções na tela

O script vai:
- Perguntar há quanto tempo foi deletado
- Listar todos os imóveis deletados nesse período
- Permitir escolher qual restaurar
- Restaurar com um clique

## 📋 Exemplo de uso

```
$ node scripts/recover-imovel-interactive.js

╔═════════════════════════════════════════════════════════════╗
║     🚑 RECUPERAÇÃO DE IMÓVEIS DELETADOS - Ipê Imóveis     ║
╚═════════════════════════════════════════════════════════════╝

📦 Projeto: 0nks58lj
📊 Dataset: production

⏰ Há quanto tempo o imóvel foi deletado?

   1. Últimas 2 horas
   2. Últimas 4 horas (padrão)
   3. Últimas 8 horas
   4. Últimas 24 horas
   5. Últimas 48 horas
   6. Última semana

Escolha uma opção [2]: 2

🔍 Buscando imóveis deletados desde 16/10/2025 12:00:00...

🔴 1 imóvel(is) deletado(s) encontrado(s):

──────────────────────────────────────────────────────────────────
1. Casa com 3 quartos no centro
   📍 Rua das Flores, 123 - Centro
   💰 R$ 450.000
   🏷️  Venda - Casa
   🆔 ID: imovel-abc123
   🔗 Slug: casa-3-quartos-centro
   📅 Última modificação: 16/10/2025 14:30:00
──────────────────────────────────────────────────────────────────

Digite o número do imóvel para restaurar (1-1) ou [Enter] para sair: 1

🚑 Restaurando imóvel...
   Título: Casa com 3 quartos no centro
   ID: imovel-abc123

⚠️  Confirma a restauração? (s/N): s

✅ Imóvel restaurado com sucesso!

🎉 Pronto! Acesse o Studio para verificar:
   http://localhost:3000/studio/desk/imovel;imovel-abc123
```

## 🔧 Comandos alternativos (para usuários avançados)

### Listar apenas

```bash
node scripts/recover-deleted-imovel.js list
```

### Restaurar direto pelo ID

```bash
node scripts/recover-deleted-imovel.js restore imovel-abc123
```

### Restaurar pelo slug

```bash
node scripts/recover-deleted-imovel.js restore-slug casa-3-quartos-centro
```

### Verificar se existe draft

```bash
node scripts/recover-deleted-imovel.js check-draft imovel-abc123
```

## 🆘 Problemas comuns

### "Token não encontrado"

**Solução:** Configure o `SANITY_API_TOKEN` no `.env.local` conforme instruções acima.

### "Nenhum imóvel foi deletado"

**Possíveis causas:**
1. O imóvel foi deletado há mais tempo → Escolha opção 6 (última semana)
2. O imóvel já foi restaurado → Verifique no Studio
3. Erro no dataset → Confirme que está usando o dataset correto

### "The document already exists"

**Solução:** O imóvel já foi restaurado! Acesse o Studio e verifique.

## 📚 Documentação completa

Para mais detalhes, prevenção futura e casos avançados, consulte:
- [Guia Completo de Recuperação](./GUIA_RECUPERACAO_IMOVEIS.md)

---

**⏱️ Tempo estimado:** 30 segundos a 2 minutos  
**💡 Dica:** Quanto mais rápido agir, mais fácil a recuperação!
