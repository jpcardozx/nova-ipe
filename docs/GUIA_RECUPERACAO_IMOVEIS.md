# 🚑 Guia de Recuperação de Imóveis Deletados

**Situação:** Uma corretora deletou um imóvel importante há ~2 horas.  
**Solução:** Usar o histórico (time-travel) do Sanity para recuperar.

---

## 🚀 Recuperação Rápida (3 passos)

### 1️⃣ Listar imóveis deletados

```bash
node scripts/recover-deleted-imovel.js list
```

Isso mostrará todos os imóveis que foram deletados nas últimas 4 horas, incluindo:
- ID do imóvel
- Título
- Slug
- Categoria
- Endereço
- Data da última modificação

### 2️⃣ Restaurar pelo ID

```bash
node scripts/recover-deleted-imovel.js restore <ID_DO_IMOVEL>
```

Exemplo:
```bash
node scripts/recover-deleted-imovel.js restore imovel-abc123
```

### 3️⃣ Verificar no Studio

Acesse: `https://seusite.com/studio/desk/imovel;<ID_DO_IMOVEL>`

---

## 🔧 Comandos Disponíveis

### Listar deletados
```bash
node scripts/recover-deleted-imovel.js list
```

### Restaurar por ID
```bash
node scripts/recover-deleted-imovel.js restore imovel-123
```

### Restaurar por slug
```bash
node scripts/recover-deleted-imovel.js restore-slug casa-em-guararema
```

### Verificar se existe draft
```bash
node scripts/recover-deleted-imovel.js check-draft imovel-123
```

---

## 🔍 Cenários Comuns

### Cenário 1: "Não sei qual foi deletado"

```bash
# Lista todos deletados nas últimas 4h
node scripts/recover-deleted-imovel.js list
```

### Cenário 2: "Sei o endereço mas não o ID"

```bash
# Lista todos e procure pelo endereço visualmente
node scripts/recover-deleted-imovel.js list

# Ou use o slug se souber
node scripts/recover-deleted-imovel.js restore-slug nome-do-slug
```

### Cenário 3: "Foi deletado há mais de 4 horas"

Edite o script `scripts/recover-deleted-imovel.js` e ajuste a constante:

```javascript
// Linha ~43
const FOUR_HOURS_AGO = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 24 horas
```

### Cenário 4: "Só o draft foi deletado"

```bash
node scripts/recover-deleted-imovel.js check-draft imovel-123
```

Se o draft ainda existir, basta publicar no Studio.

---

## ⚙️ Configuração

### Requisitos

1. **Token do Sanity com permissão de escrita**
   
   Adicione no `.env.local`:
   ```env
   SANITY_API_TOKEN=seu_token_aqui
   ```

2. **Dependências instaladas**
   ```bash
   pnpm install
   ```

### Como obter o token

1. Acesse: https://www.sanity.io/manage
2. Selecione o projeto "nova-ipe" (ID: `0nks58lj`)
3. Vá em **API** → **Tokens**
4. Crie um token com permissão de **Editor** ou **Administrator**
5. Copie e adicione no `.env.local`

---

## 🛡️ Prevenção Futura

### 1. Permissões por role

Crie roles no Sanity que impeçam corretores de deletar:

**`sanity.config.ts`:**
```typescript
// Exemplo de role customizada
export default defineConfig({
  // ... outras configs
  document: {
    actions: (prev, context) => {
      // Remove ação de delete para corretores
      if (context.currentUser?.roles?.includes('corretor')) {
        return prev.filter(action => action.action !== 'delete')
      }
      return prev
    }
  }
})
```

### 2. Soft delete

Adicione um campo `isDeleted` no schema:

**`studio/schemas/imovel.ts`:**
```typescript
defineField({
  name: 'isDeleted',
  title: 'Deletado?',
  type: 'boolean',
  initialValue: false,
  hidden: true
})
```

E filtre no desk:

```typescript
// Não mostra imóveis "deletados"
desk.list()
  .filter('_type == "imovel" && !isDeleted')
```

### 3. Backup automático

Agende exports diários:

```bash
#!/bin/bash
# scripts/backup-sanity.sh

DATE=$(date +%Y-%m-%d)
sanity dataset export production ./backups/sanity-$DATE.tar.gz

# Mantenha apenas últimos 7 dias
find ./backups -name "sanity-*.tar.gz" -mtime +7 -delete
```

**Cron job:**
```bash
0 3 * * * cd /home/jpcardozx/projetos/nova-ipe && ./scripts/backup-sanity.sh
```

### 4. Log de mudanças

Use webhooks do Sanity para registrar deletions:

```typescript
// Endpoint: /api/sanity-webhook
export async function POST(request: Request) {
  const payload = await request.json()
  
  if (payload.operation === 'delete') {
    // Registre em um log
    await logDeletion({
      documentId: payload.documentId,
      type: payload.type,
      deletedBy: payload.identity,
      timestamp: new Date().toISOString()
    })
  }
}
```

---

## 🚨 Troubleshooting

### "SANITY_API_TOKEN não encontrado"

**Solução:** Configure o token no `.env.local`:
```bash
echo 'SANITY_API_TOKEN=seu_token_aqui' >> .env.local
```

### "Imóvel não encontrado nesse período"

**Possíveis causas:**
1. Foi deletado há mais de 4 horas → Ajuste `FOUR_HOURS_AGO` no script
2. ID ou slug incorreto → Verifique com `list`
3. Já foi restaurado → Verifique no Studio

### "The document already exists"

**Solução:** O imóvel já foi restaurado! Verifique no Studio.

### "Unauthorized" ou "403"

**Solução:** Seu token não tem permissão de escrita. Crie um novo token com role de Editor/Admin.

---

## 📚 Recursos Adicionais

### Sanity CLI

```bash
# Export completo do dataset
sanity dataset export production ./backup.tar.gz

# Import de um backup
sanity dataset import ./backup.tar.gz production

# Ver histórico de um documento (no Studio)
# /studio/desk/<type>;<documentId>
```

### API Time-travel

```javascript
// Buscar estado 2 dias atrás
const twosDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
const oldData = await client.fetch('*[_type == "imovel"]', {}, { at: twoDaysAgo })
```

---

## 📞 Suporte

- **Documentação Sanity:** https://www.sanity.io/docs/history-experience
- **Time Travel API:** https://www.sanity.io/docs/query-cheat-sheet#time-travel

---

**Última atualização:** 16 de outubro de 2025
