# Por Que as Imagens Não Aparecem nos Cards

## 🔍 Investigação Completa

### Problema Identificado

**O domínio `wpl-imoveis.com` não existe mais (NXDOMAIN)**

```bash
$ host wpl-imoveis.com
Host wpl-imoveis.com not found: 3(NXDOMAIN)

$ curl -I https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/860/1.jpg
curl: (6) Could not resolve host: wpl-imoveis.com
```

### Situação Atual

As **761 propriedades** foram importadas do WordPress antigo com **URLs de fotos que não funcionam mais**:

```json
{
  "thumbnail_url": "https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/860/1.jpg",
  "photo_urls": [
    "https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/860/1.jpg",
    "https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/860/2.jpg"
    // ... 33 mais
  ],
  "photo_count": 35
}
```

## ✅ Soluções Disponíveis

### Opção 1: Migração para Cloudflare R2 (RECOMENDADO)

**Status:** Scripts prontos, credenciais faltando

Já temos o script completo de migração: `scripts/migrate-all-photos-to-r2.ts`

**Como funciona:**
1. Busca fotos do servidor Lightsail (se ainda existirem)
2. Faz upload para Cloudflare R2
3. Atualiza `photo_urls` no Supabase com as novas URLs R2

**Custo:** ~$0.045/mês para ~3GB de fotos

**Credenciais necessárias:**
```bash
# .env.local
CLOUDFLARE_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=wpl-realty  # ✅ já configurado
```

**Para executar:**
```bash
npx tsx scripts/migrate-all-photos-to-r2.ts
```

### Opção 2: Backup FTP/SSH do Lightsail

Se as fotos ainda existem no servidor Lightsail, podemos baixá-las via FTP/SSH e fazer upload para R2.

Scripts disponíveis:
- `scripts/backup-ftp.sh`
- `scripts/db-import-ssh.sh`

### Opção 3: Aceitar sem Fotos Temporariamente

O sistema já está preparado para funcionar sem fotos:

```tsx
// PropertyCard.tsx
const hasValidImage = false // Mostra fallback com ícone
```

Os cards mostram:
- 🏠 Ícone de casa
- Contador de fotos (ex: "35 fotos")
- Todas as outras informações (quartos, banheiros, preço, etc.)

## 🎯 Recomendação

1. **Curto prazo:** Cards funcionam sem fotos (status atual)
2. **Médio prazo:** Configurar Cloudflare R2 e migrar fotos
3. **Longo prazo:** Ao publicar no site, fazer upload de novas fotos profissionais

## 📊 Dados Importados Corretamente

Apesar das fotos, TODOS os dados foram importados:

✅ **761 propriedades** com:
- Títulos
- Descrições
- Preços
- Endereços
- Quartos (quando disponível)
- Banheiros (quando disponível)
- Área (quando disponível)
- Referências (MLS ID)
- Status de publicação

## 🔧 Ações Imediatas

### Para o Usuário Final (Corretor)
- Sistema **100% funcional** para revisão e aprovação
- Pode filtrar, revisar, aprovar imóveis
- Ao aprovar para publicação, pode adicionar novas fotos

### Para o Desenvolvedor
Configurar Cloudflare R2:
1. Criar conta Cloudflare (gratuita)
2. Criar R2 bucket "wpl-realty"
3. Gerar API tokens
4. Adicionar credenciais no `.env.local`
5. Executar `npx tsx scripts/migrate-all-photos-to-r2.ts`

## 📝 Conclusão

As imagens **NÃO carregam** porque:
- ❌ Domínio `wpl-imoveis.com` caiu
- ❌ URLs antigas no banco de dados
- ✅ Solução existe (migração para R2)
- ✅ Sistema funciona sem fotos temporariamente

**Prioridade:** Configurar R2 e migrar fotos antes de ir para produção.
