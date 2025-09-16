# Correções dos Erros de Upload Sanity

Este documento descreve as correções implementadas para resolver os erros de upload no Sanity Studio.

## 🐛 Problemas Identificados

1. **Erro 400 Bad Request** - Servidor rejeitando uploads
2. **Falha no preprocessing de imagens** - Problemas com URLs blob
3. **Warning de API depreciada** - Uso de `configContext.client` obsoleto
4. **Incompatibilidade de versões** - Mismatch entre versões da API

## ✅ Correções Implementadas

### 1. Atualização da Versão da API

**Arquivos alterados:**
- `lib/sanity/sanity.client.ts`
- `sanity.config.ts`
- `.env.local`

**Mudança:**
```typescript
// Antes
apiVersion: '2023-05-03'

// Depois
apiVersion: '2024-01-01'
```

### 2. Adição de Token de Autenticação

**Arquivo:** `lib/sanity/sanity.client.ts`

```typescript
export const sanityClient = createClient({
    projectId: '0nks58lj',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
    token: process.env.SANITY_API_TOKEN, // ✅ Adicionado
})
```

### 3. Utilitário para Conversão de Blob URLs

**Arquivo criado:** `lib/sanity/upload-helper.ts`

Funções principais:
- `blobToFile()` - Converte blob URLs em objetos File
- `validateImageFile()` - Valida arquivos antes do upload
- `uploadToSanity()` - Upload com tratamento de erro robusto
- `uploadBlobToSanity()` - Upload específico para blob URLs

### 4. Hook React para Uploads

**Arquivo criado:** `app/hooks/useSanityUpload.ts`

Interface limpa para componentes React:
- Estado de upload com progresso
- Tratamento de múltiplos arquivos
- Controle de erros centralizado

### 5. Script de Teste

**Arquivo criado:** `scripts/test-sanity-upload.js`

Validação completa:
- ✅ Configuração do cliente
- ✅ Conectividade com API
- ✅ Permissões de upload
- ✅ Upload e cleanup de arquivo teste

## 🔧 Como Usar as Correções

### Upload de Arquivo Normal

```typescript
import { useSanityUpload } from '@/app/hooks/useSanityUpload'

const { uploadFile, uploadState } = useSanityUpload()

const handleFileUpload = async (file: File) => {
  const result = await uploadFile(file)

  if (result.error) {
    console.error('Erro:', result.error)
  } else {
    console.log('Sucesso:', result.asset)
  }
}
```

### Upload de Blob URL

```typescript
import { uploadBlobToSanity } from '@/lib/sanity/upload-helper'

const handleBlobUpload = async (blobUrl: string) => {
  const result = await uploadBlobToSanity(blobUrl, 'filename.jpg')

  if (result.error) {
    console.error('Erro:', result.error)
  } else {
    console.log('Asset URL:', result.asset?.url)
  }
}
```

## 🧪 Validação

Execute o teste para verificar se tudo está funcionando:

```bash
node scripts/test-sanity-upload.js
```

**Saída esperada:**
```
🧪 Testando configuração do Sanity...
✅ Cliente configurado
📡 Testando conexão com API...
✅ Conexão OK
🔑 Verificando permissões de upload...
✅ Upload de teste bem-sucedido!
🧹 Removendo arquivo de teste...
✅ Arquivo de teste removido
🎉 Todos os testes passaram! O Sanity está configurado corretamente.
```

## 🔐 Variáveis de Ambiente Necessárias

Certifique-se de que estas variáveis estão configuradas em `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=0nks58lj
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=seu_token_aqui
```

## ⚠️ Possíveis Problemas e Soluções

### Erro 401 (Unauthorized)
- Verifique se `SANITY_API_TOKEN` está configurado
- Confirme que o token tem permissões de escrita

### Erro 400 (Bad Request)
- Valide o formato do arquivo
- Verifique se o arquivo não excede 50MB
- Confirme que o tipo MIME é suportado

### Erro de CORS com Blob URLs
- Use `blobToFile()` antes do upload
- Certifique-se de que o blob é válido

### Warning sobre Client Context
- ✅ Corrigido com atualização da API version
- Não mais necessário usar `context.getClient()`

## 📊 Tipos de Arquivo Suportados

- **Imagens:** JPEG, PNG, WebP, GIF, SVG
- **Tamanho máximo:** 50MB
- **Validação automática:** Incluída no helper

## 🚀 Próximos Passos

1. Integrar `useSanityUpload` nos componentes existentes
2. Substituir uploads diretos por helpers
3. Adicionar preview de imagens durante upload
4. Implementar retry automático em caso de falha