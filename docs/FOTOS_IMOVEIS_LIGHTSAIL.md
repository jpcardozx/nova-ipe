# 📸 Fotos dos Imóveis - Lightsail AWS

## 🎯 Localização das Fotos

**Servidor:** AWS Lightsail  
**IP:** `13.223.237.99`  
**Usuário SSH:** `bitnami`  
**Chave:** `LightsailDefaultKey-us-east-1.pem`

### 📂 Diretório Principal
```
/opt/bitnami/wordpress/wp-content/uploads/WPL/
```

### 📊 Estatísticas
- **Total de imóveis com fotos:** 763
- **Tamanho total:** 4.2 GB
- **Estrutura:** Cada imóvel tem um diretório com seu ID

## 🏗️ Estrutura de Arquivos

### Exemplo: Imóvel ID 100
```
/opt/bitnami/wordpress/wp-content/uploads/WPL/100/
├── img_foto01.jpg (192KB - original)
├── img_foto02.jpg (202KB - original)
├── img_foto03.jpg (217KB - original)
├── img_foto04.jpg (188KB - original)
├── img_foto05.jpg (203KB - original)
├── thimg_foto01_80x60.jpg (thumbnail pequeno)
├── thimg_foto01_105x80.jpg (thumbnail)
├── thimg_foto01_300x300.jpg (thumbnail médio)
├── thimg_foto01_640x480.jpg (thumbnail grande)
└── ... (mesmos tamanhos para cada foto)
```

## 🌐 URLs Públicas

### URL Base Atual (IP)
```
http://13.223.237.99/wp-content/uploads/WPL/
```

### Exemplo de URL Completa
```
http://13.223.237.99/wp-content/uploads/WPL/100/img_foto01.jpg
http://13.223.237.99/wp-content/uploads/WPL/100/thimg_foto01_640x480.jpg
```

### ⚠️ Domínio Real Pendente
O WordPress está configurado com IP direto. Deve haver um domínio real (tipo `imobiliaria.com.br`) que aponta para este IP via DNS.

## 🎨 Tamanhos de Thumbnail Disponíveis

| Tamanho | Dimensões | Uso Recomendado |
|---------|-----------|-----------------|
| `80x60` | 80x60px | Ícone pequeno |
| `105x80` | 105x80px | Lista compacta |
| `265x200` | 265x200px | Card médio |
| `285x140` | 285x140px | Banner horizontal |
| `300x300` | 300x300px | Card quadrado |
| `640x480` | 640x480px | Preview grande |
| Original | ~1920x1280px | Lightbox/zoom |

## 🔧 Migração para Supabase Storage

### Opção 1: Migração Completa (Recomendado)
```bash
# Baixar todas as fotos
rsync -avz -e "ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem" \
  bitnami@13.223.237.99:/opt/bitnami/wordpress/wp-content/uploads/WPL/ \
  ./temp-fotos-wpl/

# Upload para Supabase Storage
# Criar bucket: imoveis-fotos
# Estrutura: imoveis-fotos/{imovel_id}/{foto_numero}.jpg
```

### Opção 2: Proxy/CDN (Temporário)
- Manter fotos no Lightsail
- Criar proxy no Next.js para servir as imagens
- Gradualmente migrar para Supabase

### Opção 3: Cloudflare CDN (Intermediário)
- Configurar Cloudflare na frente do Lightsail
- Cache automático de imagens
- Redução de custos de bandwidth

## 📝 Padrão de Nomenclatura

### Fotos Originais
```
img_foto{número}.jpg
Exemplo: img_foto01.jpg, img_foto02.jpg
```

### Thumbnails
```
thimg_foto{número}_{largura}x{altura}.jpg
Exemplo: thimg_foto01_640x480.jpg
```

## 🔍 Comandos Úteis SSH

### Listar fotos de um imóvel
```bash
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@13.223.237.99 \
  "ls -lah /opt/bitnami/wordpress/wp-content/uploads/WPL/100/"
```

### Contar fotos de um imóvel
```bash
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@13.223.237.99 \
  "ls -1 /opt/bitnami/wordpress/wp-content/uploads/WPL/100/*.jpg | wc -l"
```

### Baixar fotos de um imóvel específico
```bash
scp -i ~/.ssh/LightsailDefaultKey-us-east-1.pem \
  bitnami@13.223.237.99:/opt/bitnami/wordpress/wp-content/uploads/WPL/100/*.jpg \
  ./imovel-100/
```

### Verificar tamanho de um imóvel
```bash
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@13.223.237.99 \
  "du -sh /opt/bitnami/wordpress/wp-content/uploads/WPL/100/"
```

## 🎯 Próximos Passos

### 1. Descobrir Domínio Real
```bash
# Verificar DNS reverso
dig -x 13.223.237.99

# Ou verificar no banco de dados WordPress
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@13.223.237.99 \
  "mysql -u root -p wp_imobiliaria -e 'SELECT option_value FROM wp_options WHERE option_name=\"siteurl\"'"
```

### 2. Atualizar Código Next.js
```typescript
// lib/imageHelpers.ts
export function getImovelImageUrl(imovelId: number, fotoNumero: number, size?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_WP_UPLOADS_URL || 'http://13.223.237.99/wp-content/uploads/WPL'
  
  if (size) {
    return `${baseUrl}/${imovelId}/thimg_foto${String(fotoNumero).padStart(2, '0')}_${size}.jpg`
  }
  
  return `${baseUrl}/${imovelId}/img_foto${String(fotoNumero).padStart(2, '0')}.jpg`
}

// Uso:
getImovelImageUrl(100, 1) // http://13.223.237.99/wp-content/uploads/WPL/100/img_foto01.jpg
getImovelImageUrl(100, 1, '640x480') // http://13.223.237.99/wp-content/uploads/WPL/100/thimg_foto01_640x480.jpg
```

### 3. Configurar .env
```env
NEXT_PUBLIC_WP_UPLOADS_URL=http://13.223.237.99/wp-content/uploads/WPL
# Ou quando descobrir o domínio:
NEXT_PUBLIC_WP_UPLOADS_URL=https://seudominio.com.br/wp-content/uploads/WPL
```

### 4. Componente de Imagem Otimizado
```typescript
// components/ImovelImage.tsx
import Image from 'next/image'
import { getImovelImageUrl } from '@/lib/imageHelpers'

export function ImovelImage({ 
  imovelId, 
  fotoNumero = 1, 
  size = '640x480',
  alt 
}: {
  imovelId: number
  fotoNumero?: number
  size?: '80x60' | '105x80' | '265x200' | '285x140' | '300x300' | '640x480' | 'original'
  alt: string
}) {
  const src = getImovelImageUrl(imovelId, fotoNumero, size === 'original' ? undefined : size)
  
  return (
    <Image
      src={src}
      alt={alt}
      width={size === 'original' ? 1920 : parseInt(size.split('x')[0])}
      height={size === 'original' ? 1280 : parseInt(size.split('x')[1])}
      className="object-cover"
      loading="lazy"
    />
  )
}
```

## 💾 Backup e Migração

### Script de Backup Completo
```bash
#!/bin/bash
# backup-fotos-imoveis.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups/fotos_imoveis_${TIMESTAMP}"

echo "📸 Iniciando backup de fotos dos imóveis..."
echo "Destino: ${BACKUP_DIR}"

mkdir -p "${BACKUP_DIR}"

# Baixar todas as fotos
rsync -avz --progress \
  -e "ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem" \
  bitnami@13.223.237.99:/opt/bitnami/wordpress/wp-content/uploads/WPL/ \
  "${BACKUP_DIR}/"

echo "✅ Backup concluído!"
echo "Total: $(du -sh ${BACKUP_DIR} | cut -f1)"
```

### Script de Upload para Supabase
```bash
#!/bin/bash
# upload-to-supabase.sh

SOURCE_DIR="./backups/fotos_imoveis_latest"
SUPABASE_PROJECT_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-anon-key"
BUCKET="imoveis-fotos"

echo "☁️ Fazendo upload para Supabase Storage..."

for imovel_dir in ${SOURCE_DIR}/*; do
  imovel_id=$(basename "$imovel_dir")
  
  echo "Processando imóvel ${imovel_id}..."
  
  for foto in ${imovel_dir}/*.jpg; do
    foto_name=$(basename "$foto")
    
    curl -X POST \
      "${SUPABASE_PROJECT_URL}/storage/v1/object/${BUCKET}/${imovel_id}/${foto_name}" \
      -H "Authorization: Bearer ${SUPABASE_KEY}" \
      -H "Content-Type: image/jpeg" \
      --data-binary "@${foto}"
  done
done

echo "✅ Upload concluído!"
```

## 🔒 Segurança

### Recomendações
1. ✅ Adicionar HTTPS (Let's Encrypt ou Cloudflare)
2. ✅ Configurar CORS para seu domínio Next.js
3. ✅ Adicionar CDN (Cloudflare)
4. ✅ Migrar para Supabase Storage (longo prazo)
5. ✅ Implementar lazy loading no frontend

### Configuração Apache (se necessário)
```apache
# /opt/bitnami/wordpress/.htaccess ou httpd.conf
<IfModule mod_headers.c>
    # CORS para Next.js
    Header set Access-Control-Allow-Origin "https://seu-dominio-nextjs.com"
    Header set Access-Control-Allow-Methods "GET, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"
    
    # Cache de imagens (1 ano)
    <FilesMatch "\.(jpg|jpeg|png|gif|webp)$">
        Header set Cache-Control "max-age=31536000, public, immutable"
    </FilesMatch>
</IfModule>
```

## 📊 Análise de Uso

### Fotos Mais Comuns por Imóvel
```bash
# Verificar quantas fotos cada imóvel tem
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@13.223.237.99 \
  "for dir in /opt/bitnami/wordpress/wp-content/uploads/WPL/*/; do echo -n \"\$(basename \$dir): \"; ls -1 \$dir/img_foto*.jpg 2>/dev/null | wc -l; done" | sort -t: -k2 -rn | head -20
```

### Top 10 Maiores Imóveis (em tamanho de fotos)
```bash
ssh -i ~/.ssh/LightsailDefaultKey-us-east-1.pem bitnami@13.223.237.99 \
  "cd /opt/bitnami/wordpress/wp-content/uploads/WPL && du -sh */ | sort -rh | head -10"
```

---

**Última atualização:** 9 de outubro de 2025  
**Status:** ✅ Fotos localizadas e acessíveis  
**Prioridade:** 🔴 Alta - Migrar para solução permanente
