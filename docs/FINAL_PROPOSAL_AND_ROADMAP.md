# 🎯 PROPOSTA COMPLETA: Sistema WordPress → Sanity

**Data**: 08/10/2025  
**Status**: Sistema funcional sem fotos antigas

---

## 📊 ARQUITETURA ATUAL

### Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                     FONTES DE DADOS                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. DADOS (Textos, preços, características)                 │
│     ├─ Origem: SQL WordPress (imoveis-completo.sql)         │
│     ├─ Destino: ✅ Supabase (wordpress_properties)          │
│     └─ Status: ✅ 761/761 importadas (100%)                 │
│                                                              │
│  2. FOTOS (Imagens dos imóveis)                             │
│     ├─ Origem: 🔴 AWS Lightsail (servidor antigo)           │
│     ├─ Status atual: ❌ URLs não disponíveis no SQL         │
│     └─ Quantidade: ~4GB, pic_numb indica 20-50 fotos/imóvel │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ❓ RELEVÂNCIA DOS CAMPOS DE FOTO

### **pic_numb** (Quantidade de fotos)
**Relevância:** 🟡 **Informativa mas não crítica**

```typescript
// Exemplo:
property.data.pic_numb = 47  // "Esta property tinha 47 fotos no WordPress"
```

**Usos:**
- ✅ Mostrar badge "📸 47 fotos" no dashboard
- ✅ Priorizar properties com mais fotos no review
- ❌ NÃO afeta funcionamento do sistema
- ❌ NÃO é necessário para migração

**Recomendação:** 
- **Manter** - Útil como informação
- Ou **ignorar** - Sistema funciona sem ele

---

### **photo_urls** (Array de URLs das fotos)
**Relevância:** 🔴 **CRÍTICA para visualização**

```typescript
// Exemplo:
photo_urls: [
  'https://r2.novaipe.com/properties/78/foto1.jpg',
  'https://r2.novaipe.com/properties/78/foto2.jpg',
  // ...
]
```

**Usos:**
- 🔴 **Dashboard precisa** - Mostrar fotos no modal
- 🔴 **Sanity precisa** - Upload de fotos na migração
- 🔴 **Site público precisa** - Exibir galeria de fotos

**Status atual:** ❌ **VAZIO** (não temos as URLs)

**Recomendação:**
- **Opção A:** Descobrir URLs do Lightsail e popular
- **Opção B:** Deixar vazio, fotos virão de novos uploads

---

### **thumbnail_url** (Foto principal/capa)
**Relevância:** 🟡 **Importante para UX**

```typescript
// Exemplo:
thumbnail_url: 'https://r2.novaipe.com/properties/78/capa.jpg'
```

**Usos:**
- ✅ Card de preview no dashboard (listagem)
- ✅ Imagem principal no site
- ❌ Sistema funciona sem (mostra placeholder)

**Recomendação:** 
- Se tiver `photo_urls`, thumbnail é `photo_urls[0]`
- Senão, usar placeholder genérico

---

## 🗂️ ONDE ESTÃO AS FOTOS?

### Cenário provável:

```
AWS Lightsail (Servidor antigo WordPress)
├─ Endereço: wpl-imoveis.com ou wpl-imoveis.com.wp2.com.br
├─ Path provável: /wp-content/uploads/wplpro/properties/
├─ Estrutura:
│   ├─ properties/78/
│   │   ├─ 1.jpg
│   │   ├─ 2.jpg
│   │   └─ ... (47 fotos total)
│   ├─ properties/31/
│   │   └─ ... (11 fotos)
│   └─ ...
└─ Status: Servidor pode estar OFFLINE ou SEM ACESSO PÚBLICO
```

**Por que não temos URLs:**
- SQL WordPress não armazena URLs completas
- Só armazena `pic_numb` (quantidade)
- URLs são montadas dinamicamente pelo WordPress

**Opções:**

### ✅ **Opção A: Acessar Lightsail** (Se possível)
```bash
# 1. Testar se servidor está online
curl -I https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/78/1.jpg

# 2. Se funcionar:
# - Criar script para baixar todas as fotos
# - Upload para Cloudflare R2
# - Atualizar photo_urls no Supabase
```

### ❌ **Opção B: Lightsail inacessível** (Servidor desligado/privado)
```
Então:
- Fotos antigas estão PERDIDAS
- pic_numb vira só informação histórica
- Fotos novas via upload manual no dashboard
```

---

## 🎯 PROPOSTA: Dashboard sem Fotos Antigas

### Arquitetura proposta:

```
┌─────────────────────────────────────────────────────────────┐
│                    DASHBOARD WORKFLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. LISTAGEM                                                 │
│     ├─ Dados: ✅ Supabase (wordpress_properties)            │
│     ├─ Fotos: ⚠️  Placeholder se photo_urls vazio           │
│     └─ Badge: "📸 47 fotos no WP" (informativo)             │
│                                                              │
│  2. VISUALIZAÇÃO (Modal)                                     │
│     ├─ Dados: ✅ Todos os campos do WP                      │
│     ├─ Fotos antigas: ❌ "Fotos não disponíveis"            │
│     └─ Upload novo: ✅ Botão para adicionar fotos           │
│                                                              │
│  3. APROVAÇÃO/REVIEW                                         │
│     ├─ Revisar dados: ✅ Funciona                           │
│     ├─ Aprovar sem foto: ✅ Permitido                       │
│     └─ Adicionar fotos: ✅ Opcional antes de migrar         │
│                                                              │
│  4. MIGRAÇÃO PARA SANITY                                     │
│     ├─ Dados: ✅ Todos migram                               │
│     ├─ Fotos: ⚠️  Só se photo_urls existir                  │
│     └─ Fallback: Property sem foto no Sanity                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de trabalho do usuário:

```
1. Acessa dashboard
   └─ Vê 761 properties (141 pending, 620 archived)

2. Filtra por "pending"
   └─ 141 properties ativas para review

3. Abre property #78
   ├─ ✅ Vê: título, descrição, preço, localização, quartos, etc
   ├─ ⚠️  Vê: "Esta property tinha 47 fotos no WordPress (não disponíveis)"
   └─ ✅ Opção: "📤 Adicionar fotos agora" (upload manual)

4. Decide:
   OPÇÃO A: Aprovar SEM fotos
   └─ Property vai pro Sanity sem imagens (pode adicionar depois)
   
   OPÇÃO B: Adicionar fotos antes
   └─ Upload manual → R2 → Atualiza photo_urls → Aprova

5. Migra para Sanity
   └─ Property aparece no site com ou sem fotos
```

---

## ✅ FUNCIONALIDADES COMPLETAS

### ✅ Sistema de Dados (100%)
- [x] Importação SQL → Supabase (761 properties)
- [x] Badge system (pending, reviewing, approved, migrated, rejected, archived)
- [x] Full-text search (Portuguese)
- [x] RLS policies (segurança)
- [x] Task tracking (migration_tasks)

### ✅ Cloudflare R2 Service (100%)
- [x] Upload de fotos
- [x] Download
- [x] Signed URLs (visualização temporária)
- [x] Delete
- [x] List

### ✅ Dashboard UI (90%)
- [x] Listagem com paginação
- [x] Filtros por status
- [x] Search bar
- [x] Modal de detalhes
- [x] Ações: aprovar/rejeitar/notas
- [x] Stats dashboard
- [ ] Badge 'archived' (falta adicionar)
- [ ] Responsividade testada

### ✅ Migração para Sanity (80%)
- [x] Validação (só approved)
- [x] Mapeamento de campos
- [x] Upload de fotos (SE existirem)
- [x] Criação de documento
- [x] Update de status
- [ ] HTML → Portable Text
- [ ] Campos extras (vagas, condomínio, etc)

---

## 🔴 FUNCIONALIDADES PENDENTES

### 🔴 CRÍTICAS (Bloqueiam uso completo)

#### 1. **HTML → Portable Text Converter**
**Tempo:** 2-3 horas  
**Impacto:** Descrições ficam quebradas no Sanity

```typescript
// lib/utils/html-to-portable-text.ts
export function convertHtmlToPortableText(html: string) {
  // Converter HTML → Portable Text
  // Preservar formatação básica
  // Remover tags desnecessárias
}
```

**Bibliotecas:**
```bash
pnpm add html-to-portable-text
# ou
pnpm add @sanity/block-tools
```

---

#### 2. **Testar Dashboard Completo**
**Tempo:** 1 hora  
**Checklist:**
- [ ] npm run dev → dashboard carrega
- [ ] Listagem mostra 761 properties
- [ ] Filtro por status funciona
- [ ] Modal abre com dados
- [ ] Botão aprovar funciona
- [ ] Badge 'archived' aparece
- [ ] Responsivo mobile/tablet

---

#### 3. **Completar Schema Sanity**
**Tempo:** 30 minutos  
**Adicionar defaults:**

```typescript
// wordpress-catalog-service.ts migrateToSanity()
const sanityDoc = {
  // ... campos existentes
  
  // ADICIONAR:
  vagas: 0,              // Padrão
  precoCondominio: 0,    // Padrão
  precoIPTU: 0,          // Padrão
  caracteristicas: [],   // Vazio
  destaque: false,       // Padrão
  
  localizacao: {
    pais: property.data.location1_name,
    estado: property.data.location2_name,
    cidade: property.data.location3_name,
    bairro: property.data.location4_name,
    rua: property.data.field_42,
    cep: '',             // Vazio (pode geocodificar depois)
    lat: null,           // Null (pode geocodificar depois)
    lng: null            // Null
  }
}
```

---

### 🟡 IMPORTANTES (Melhoram UX)

#### 4. **Badge 'archived' no UI**
**Tempo:** 15 minutos

```typescript
// app/dashboard/wordpress-catalog/page.tsx linha 32
archived: { 
  label: 'Arquivado', 
  color: 'bg-gray-100 text-gray-700 border-gray-200', 
  icon: Archive,
  gradient: 'from-gray-400 to-gray-600'
}
```

---

#### 5. **Upload de Fotos no Dashboard**
**Tempo:** 2-3 horas  
**Features:**
- Drag & drop de múltiplas fotos
- Preview antes de upload
- Progress bar
- Upload para R2
- Atualiza photo_urls no Supabase

---

#### 6. **Placeholder para Properties sem Foto**
**Tempo:** 30 minutos  
**Implementação:**

```typescript
// Componente PropertyCard
{property.thumbnail_url ? (
  <img src={property.thumbnail_url} alt={property.data.field_313} />
) : (
  <div className="bg-gray-200 flex items-center justify-center">
    <ImageIcon className="text-gray-400" size={48} />
    <span className="text-sm">
      {property.data.pic_numb 
        ? `${property.data.pic_numb} fotos no WP (não disponíveis)`
        : 'Sem fotos'}
    </span>
  </div>
)}
```

---

### 🟢 NICE TO HAVE (Futuro)

7. Bulk actions (aprovar múltiplos)
8. Export CSV
9. Webhooks automáticos
10. Edge Functions
11. Geocoding automático (CEP → lat/lng)
12. OCR em fotos (extrair texto)
13. AI para descrições (melhorar textos)

---

## 📋 DECISÃO SOBRE FOTOS ANTIGAS

### **Cenário 1: Lightsail ACESSÍVEL** ✅

```bash
# Teste:
curl -I https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/78/1.jpg
# Resposta: 200 OK

# Ação:
npx tsx scripts/migrate-photos-to-r2.ts
# - Baixa todas as fotos
# - Upload para R2
# - Atualiza photo_urls
# Tempo: 4-6 horas
```

**Resultado:**
- ✅ Dashboard mostra fotos antigas
- ✅ Migração para Sanity inclui fotos
- ✅ Histórico completo preservado

---

### **Cenário 2: Lightsail INACESSÍVEL** ❌

```bash
# Teste:
curl -I https://wpl-imoveis.com/...
# Resposta: 404 Not Found ou Timeout

# Ação:
# Ignorar fotos antigas
# Remover ou marcar pic_numb como "informativo"
```

**Resultado:**
- ⚠️  Dashboard sem fotos antigas
- ⚠️  Properties no Sanity sem fotos
- ✅ Fotos novas via upload manual
- ✅ Sistema funciona 100% mesmo assim

**Ajustes necessários:**

```sql
-- Opção 1: Limpar campo (não é necessário)
UPDATE wordpress_properties SET photo_count = 0;

-- Opção 2: Deixar como está (recomendado)
-- pic_numb vira informação histórica: "tinha 47 fotos no WP"
```

---

## 🚀 PLANO DE AÇÃO RECOMENDADO

### **Fase 1: MVP Funcional (3-4h)** 🎯

```
[ ] 1. HTML → Portable Text converter (2h)
    └─ pnpm add html-to-portable-text
    └─ Criar lib/utils/html-to-portable-text.ts
    └─ Integrar em migrateToSanity()

[ ] 2. Completar campos Sanity (30min)
    └─ Adicionar defaults (vagas, preço condomínio, etc)
    └─ localizacao objeto completo

[ ] 3. Badge 'archived' UI (15min)
    └─ Adicionar no statusConfig

[ ] 4. Testar dashboard (1h)
    └─ npm run dev
    └─ Testar fluxo completo
    └─ Verificar responsividade

[ ] 5. Testar migração real (30min)
    └─ Aprovar 1 property
    └─ Migrar para Sanity
    └─ Verificar no Sanity Studio
```

**Resultado:** 
- ✅ Sistema 100% funcional
- ✅ Pode revisar e migrar properties
- ⚠️  Sem fotos antigas (só novas via upload)

---

### **Fase 2: Fotos (SE POSSÍVEL)** 📸

```
[ ] 1. Testar acesso Lightsail (15min)
    └─ curl URLs de teste
    └─ Verificar se servidor está online

SE ACESSÍVEL:
[ ] 2. Migrar fotos (4-6h)
    └─ Script de download
    └─ Upload para R2
    └─ Update Supabase

SE INACESSÍVEL:
[ ] 2. Upload manual no dashboard (2-3h)
    └─ Componente de upload
    └─ Drag & drop
    └─ Integração R2
```

---

### **Fase 3: Melhorias UX (FUTURO)** ✨

```
[ ] Placeholder para properties sem foto
[ ] Bulk actions
[ ] Geocoding automático
[ ] Webhooks
[ ] Edge Functions
```

---

## 📊 RESUMO EXECUTIVO

### **O que temos HOJE:**
✅ 761 properties com TODOS os dados no Supabase  
✅ Dashboard funcional (listagem, filtros, modal, ações)  
✅ R2 configurado para armazenar fotos  
✅ Migração para Sanity funcional (80%)  

### **O que FALTA para usar 100%:**
🔴 HTML → Portable Text (2h) - CRÍTICO  
🔴 Completar campos Sanity (30min) - CRÍTICO  
🔴 Testar dashboard (1h) - CRÍTICO  
🟡 Badge 'archived' (15min) - Melhoria  

### **Sobre as fotos:**
- `pic_numb` → Informativo (não crítico)
- `photo_urls` → Vazio (aguardando decisão)
- **Opção A:** Migrar do Lightsail (SE acessível)
- **Opção B:** Upload manual no dashboard (sempre funciona)

### **Tempo total MVP:**
**3-4 horas** para sistema 100% funcional (sem fotos antigas)  
**+4-6 horas** SE quiser migrar fotos antigas (opcional)

---

## ❓ PRÓXIMO PASSO

**Você decide:**

1. **🚀 Começar Fase 1 (MVP)** - 3-4h, sistema funcional hoje
2. **📸 Testar Lightsail primeiro** - Ver se fotos estão acessíveis
3. **🤔 Outra prioridade** - Me diga o que é mais importante

**Qual opção você prefere?**
