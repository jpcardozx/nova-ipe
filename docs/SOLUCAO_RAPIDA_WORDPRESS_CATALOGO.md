
# ⚡ Solução Rápida: WordPress → Catálogo Next.js

**Status Atual:** 🔴 **Fluxo difuso, sem integração**  
**Tempo para resolver:** 7-8 dias  
**Quick Win disponível:** ✅ Sim (3-4 horas)

---

## 🎯 Problema em 3 Linhas

1. ❌ **WordPress está isolado** (Lightsail) - 761 imóveis presos lá
2. ❌ **Catálogo Next.js só tem Sanity** - poucos imóveis
3. ❌ **Não existe ponte entre os dois** - migração 100% manual

---

## 🚀 Solução Rápida (Quick Win - 4h)

### Opção A: Export Manual Simplificado

```bash
# 1. Conectar ao WordPress (5 min)
./scripts/lightsail-access.sh

# 2. Dentro da instância, export SQL (10 min)
cd /opt/bitnami/wordpress
sudo wp db export wordpress-properties.sql \
  --tables=wpl_properties,wpl_property_types \
  --allow-root

# 3. Baixar arquivo (5 min)
exit
scp -i ~/.ssh/LightsailDefaultKey-us-east-1.pem \
  bitnami@13.223.237.99:/opt/bitnami/wordpress/wordpress-properties.sql \
  ~/downloads/

# 4. Converter SQL → JSON (30 min - script Python simples)
# Ver: scripts/wordpress-importer/sql-to-json.py

# 5. Import manual no Sanity Studio (3h para 50 imóveis prioritários)
# Copiar/colar campos principais
```

**Vantagem:** Funciona hoje  
**Desvantagem:** Lento, manual, não escalável

---

### Opção B: Script Automatizado (Recomendado)

#### Passo 1: Criar Conexão WordPress (30 min)

```typescript
// lib/wordpress/connection.ts
import mysql from 'mysql2/promise'

export async function getWordPressProperties() {
  const connection = await mysql.createConnection({
    host: '13.223.237.99',
    user: 'bn_wordpress',
    password: process.env.WP_DB_PASSWORD!, // Pegar do Lightsail
    database: 'bitnami_wordpress'
  })

  const [rows] = await connection.execute(`
    SELECT 
      p.id,
      p.post_title as titulo,
      pm1.meta_value as preco,
      pm2.meta_value as dormitorios,
      pm3.meta_value as banheiros,
      pm4.meta_value as area,
      pm5.meta_value as endereco
    FROM wpl_properties p
    LEFT JOIN wpl_property_meta pm1 ON p.id = pm1.property_id AND pm1.meta_key = 'price'
    LEFT JOIN wpl_property_meta pm2 ON p.id = pm2.property_id AND pm2.meta_key = 'bedrooms'
    LEFT JOIN wpl_property_meta pm3 ON p.id = pm3.property_id AND pm3.meta_key = 'bathrooms'
    LEFT JOIN wpl_property_meta pm4 ON p.id = pm4.property_id AND pm4.meta_key = 'area'
    LEFT JOIN wpl_property_meta pm5 ON p.id = pm5.property_id AND pm5.meta_key = 'address'
    WHERE p.deleted = 0
    LIMIT 100
  `)

  await connection.end()
  return rows
}
```

#### Passo 2: Criar Importer (1h)

```typescript
// scripts/wordpress-importer/simple-import.ts
import { getWordPressProperties } from '@/lib/wordpress/connection'
import { sanityClient } from '@/lib/sanity'

async function importToSanity() {
  console.log('🔍 Buscando imóveis do WordPress...')
  const wpProperties = await getWordPressProperties()
  console.log(`✅ ${wpProperties.length} imóveis encontrados`)

  for (const wp of wpProperties) {
    try {
      await sanityClient.create({
        _type: 'imovel',
        titulo: wp.titulo,
        preco: Number(wp.preco) || 0,
        dormitorios: Number(wp.dormitorios) || 0,
        banheiros: Number(wp.banheiros) || 0,
        areaUtil: Number(wp.area) || 0,
        endereco: wp.endereco,
        status: 'disponivel',
        finalidade: 'Venda', // Ajustar conforme lógica WPL
        sourceWordPressId: wp.id, // Para rastreamento
        slug: {
          _type: 'slug',
          current: `imovel-${wp.id}`
        }
      })
      
      console.log(`✅ Importado: ${wp.titulo}`)
    } catch (error) {
      console.error(`❌ Erro em ${wp.id}:`, error)
    }
  }
}

importToSanity()
```

#### Passo 3: Executar (30 min)

```bash
# Instalar dependências
pnpm add mysql2

# Pegar senha do WordPress
./scripts/lightsail-access.sh
# Dentro: cat /home/bitnami/bitnami_credentials

# Adicionar ao .env.local
echo "WP_DB_PASSWORD=sua_senha_aqui" >> .env.local

# Executar import
npx tsx scripts/wordpress-importer/simple-import.ts

# Output esperado:
# 🔍 Buscando imóveis do WordPress...
# ✅ 100 imóveis encontrados
# ✅ Importado: Casa no Centro
# ✅ Importado: Apartamento Vista Alegre
# ...
```

**Vantagem:** Automatizado, rápido, reutilizável  
**Tempo:** 2h setup + 30min execução = **2.5h total**

---

## 📊 Comparação das Opções

| Aspecto | Opção A (Manual) | Opção B (Script) |
|---------|------------------|------------------|
| **Tempo setup** | 5 min | 2h |
| **Tempo por imóvel** | 3-5 min | 5 seg |
| **100 imóveis** | 5-8 horas | 10 minutos |
| **761 imóveis** | 38-63 horas | 1 hora |
| **Reutilizável** | ❌ | ✅ |
| **Erros** | Muitos | Poucos |
| **Recomendado para** | <10 imóveis | >10 imóveis |

---

## 🎯 Recomendação Final

### Para resolver HOJE (4h):
1. ✅ **Usar Opção B (Script)** - Setup em 2h, roda em minutos
2. ✅ **Importar primeiro lote (100 imóveis)** - Validar funcionalidade
3. ✅ **Se OK, rodar para os 761** - Migração completa

### Para resolver COMPLETO (7-8 dias):
1. ✅ Implementar tudo da **ANALISE_FLUXO_WORDPRESS_CATALOGO.md**
2. ✅ Criar dashboard de revisão
3. ✅ Migrar fotos para Sanity CDN
4. ✅ Setup de staging area (Supabase)

---

## 🚨 Decisão Necessária

**Qual caminho seguir?**

### 🟢 Caminho Rápido (Recomendado)
```
WordPress → Script (2.5h) → Sanity → Catálogo ✅
```
- ✅ Resolve hoje
- ✅ 761 imóveis no catálogo
- ⚠️ Sem review/staging
- ⚠️ Fotos ficam no Lightsail (fallback)

### 🟡 Caminho Completo
```
WordPress → Supabase Staging → Dashboard Review → Sanity + R2 → Catálogo ✅
```
- ✅ Profissional
- ✅ Review humano
- ✅ Fotos otimizadas
- ⏳ 7-8 dias

---

## 💡 Próximo Passo

**Escolha 1 das 2 opções:**

### Opção 1: Quick Win (começar agora - 4h)
```bash
cd /home/jpcardozx/projetos/nova-ipe
code docs/SOLUCAO_RAPIDA_WORDPRESS_CATALOGO.md # Este arquivo
# Seguir "Opção B: Script Automatizado"
```

### Opção 2: Implementação Completa (agendar 7-8 dias)
```bash
cd /home/jpcardozx/projetos/nova-ipe
code docs/ANALISE_FLUXO_WORDPRESS_CATALOGO.md # Documento detalhado
# Seguir "Plano de Ação Recomendado"
```

---

## 📝 Arquivos Criados

1. ✅ `docs/ANALISE_FLUXO_WORDPRESS_CATALOGO.md` - Análise completa (200+ linhas)
2. ✅ `docs/SOLUCAO_RAPIDA_WORDPRESS_CATALOGO.md` - Este arquivo (quick reference)
3. ⏳ `lib/wordpress/connection.ts` - Próximo a criar
4. ⏳ `scripts/wordpress-importer/simple-import.ts` - Próximo a criar

---

**Decisão:** Aguardando confirmação do usuário sobre qual caminho seguir.
