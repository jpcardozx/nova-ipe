# 📸 Guia de Migração de Fotos WordPress → Cloudflare R2

## 🎯 Objetivo

Migrar as **~761 fotos** dos imóveis do WordPress para o **Cloudflare R2** e atualizar as URLs no Supabase.

## 📊 Status Atual

- ✅ **761 propriedades** importadas no Supabase
- ✅ **Credenciais R2** configuradas no `.env.local`
- ❌ **Fotos NÃO migradas** - URLs apontam para domínio morto (`wpl-imoveis.com`)
- ✅ **Conexão SSH** com AWS Lightsail disponível

## 💰 Custo Estimado

- **Storage**: ~3GB × $0.015/GB = **$0.045/mês** (~R$ 0.25/mês)
- **Bandwidth**: **ZERO** (Cloudflare R2 não cobra egress!)
- **Total anual**: ~$0.54/ano (~R$ 3/ano)

## 🚀 Processo de Migração

### Passo 1: Baixar Fotos do Lightsail (30-60min)

```bash
# Certifique-se que AWS CLI está configurado
aws sts get-caller-identity

# Execute o script de download
bash scripts/download-photos-from-lightsail.sh
```

**O que acontece:**
1. ✅ Conecta no AWS Lightsail via SSH
2. ✅ Verifica pasta `/opt/bitnami/wordpress/wp-content/uploads/wplpro`
3. ✅ Mostra estatísticas (tamanho, quantidade de pastas, fotos)
4. ✅ Baixa todas as fotos para `exports/imoveis/imoveis-export-20251008/fotos-completas/`

**Estrutura esperada:**
```
exports/imoveis/imoveis-export-20251008/fotos-completas/
├── properties/
│   ├── 860/
│   │   ├── img_foto01.jpg
│   │   ├── img_foto02.jpg
│   │   └── ...
│   ├── 861/
│   └── ...
```

### Passo 2: Upload para R2 e Atualizar Supabase (20-40min)

```bash
# Execute o script de upload
npx tsx scripts/upload-local-photos-to-r2.ts
```

**O que acontece:**
1. ✅ Lê pastas locais em `exports/imoveis/.../fotos-completas/properties/`
2. ✅ Para cada imóvel:
   - Faz upload das fotos para `wordpress-photos/{wpId}/` no R2
   - Atualiza `photo_urls` e `thumbnail_url` no Supabase
3. ✅ Mostra estatísticas finais (fotos enviadas, custo, etc.)

**URLs geradas (exemplo):**
```
https://c5aff409f2452f34ccab6276da473130.r2.cloudflarestorage.com/wpl-realty/wordpress-photos/860/img_foto01.jpg
```

### Passo 3: Verificar Cards no Dashboard

```bash
# Reinicie o servidor Next.js
pnpm dev

# Abra o dashboard
http://localhost:3000/dashboard/wordpress-catalog
```

**Resultado esperado:**
- ✅ Cards exibem fotos reais (não mais fallback com ícone 🏠)
- ✅ Contador de fotos funciona
- ✅ Modal mostra todas as fotos

## 🔧 Troubleshooting

### Problema: AWS CLI não configurado

```bash
aws configure
# Digite:
# AWS Access Key ID: (veja .aws/credentials)
# AWS Secret Access Key: (veja .aws/credentials)
# Region: us-east-1
# Output: json
```

### Problema: Conexão SSH falha

```bash
# Verifique credenciais AWS
aws sts get-caller-identity

# Teste conexão manual
bash scripts/lightsail-access.sh
```

### Problema: Pasta WPL não encontrada no Lightsail

O script automaticamente procura a pasta. Localizações possíveis:
- `/opt/bitnami/wordpress/wp-content/uploads/wplpro`
- `/opt/bitnami/wordpress/wp-content/uploads/WPL`
- `/home/bitnami/htdocs/wp-content/uploads/wplpro`

### Problema: Upload para R2 falha

Verifique `.env.local`:
```bash
# Deve ter (SEM NEXT_PUBLIC_):
R2_ENDPOINT="https://c5aff409f2452f34ccab6276da473130.r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID="425b56d6224b1196f536960bcfc1908b"
R2_SECRET_ACCESS_KEY="b3c64f2c353d1dba6756b8566cbbd5014926c47da4adaf8160ded0007e105738"
R2_BUCKET_NAME="wpl-realty"
```

### Problema: Fotos não aparecem nos cards

1. **Verifique URLs no Supabase:**
   ```sql
   SELECT wp_id, thumbnail_url, array_length(photo_urls, 1) as photo_count
   FROM wordpress_properties
   WHERE photo_urls IS NOT NULL
   LIMIT 10;
   ```

2. **Teste URL manualmente:**
   ```bash
   curl -I "https://c5aff409f2452f34ccab6276da473130.r2.cloudflarestorage.com/wpl-realty/wordpress-photos/860/img_foto01.jpg"
   # Deve retornar: HTTP/2 200
   ```

3. **Verifique PropertyCard.tsx:**
   ```typescript
   const hasValidImage = imageUrl && imageUrl.startsWith('https://') && !imageUrl.includes('wpl-imoveis.com')
   ```

## 📝 Scripts Disponíveis

### 1. `download-photos-from-lightsail.sh`
- **Função**: Baixa fotos do AWS Lightsail via SSH
- **Tempo**: 30-60 minutos
- **Dependências**: `aws-cli`, `jq`, `rsync` (ou `scp`)
- **Output**: `exports/imoveis/imoveis-export-20251008/fotos-completas/`

### 2. `upload-local-photos-to-r2.ts`
- **Função**: Lê fotos locais e faz upload para R2
- **Tempo**: 20-40 minutos
- **Dependências**: R2 credentials em `.env.local`
- **Output**: URLs atualizadas no Supabase

### 3. `migrate-all-photos-to-r2.ts` (OBSOLETO)
- ⚠️ **Não use este** - tenta baixar do Lightsail via HTTP (domain morto)
- Use a combinação dos scripts 1 + 2 acima

## ✅ Checklist de Migração

- [ ] AWS CLI configurado (`aws configure`)
- [ ] Credenciais R2 no `.env.local`
- [ ] Executar `bash scripts/download-photos-from-lightsail.sh`
- [ ] Verificar fotos em `exports/imoveis/.../fotos-completas/properties/`
- [ ] Executar `npx tsx scripts/upload-local-photos-to-r2.ts`
- [ ] Verificar URLs no Supabase (devem começar com `https://...r2.cloudflarestorage.com`)
- [ ] Testar dashboard (`http://localhost:3000/dashboard/wordpress-catalog`)
- [ ] Confirmar que fotos aparecem nos cards

## 🎉 Resultado Final

Após a migração:
- ✅ **761 propriedades** com fotos funcionando
- ✅ **URLs permanentes** no Cloudflare R2
- ✅ **Zero custo de bandwidth** (egress grátis!)
- ✅ **Cards bonitos** com fotos reais
- ✅ **Pronto para produção**

## 📞 Suporte

Se precisar de ajuda:
1. Verifique logs dos scripts (`console.log` mostra progresso)
2. Consulte `docs/IMAGES_NOT_LOADING_EXPLANATION.md`
3. Entre em contato com jpcardozx
