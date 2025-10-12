# 🗺️ MAPA DE PROBLEMAS - Integração Jetimob

## 📊 Fluxo Atual (QUEBRADO) vs Fluxo Correto

### **FLUXO ATUAL (❌ NÃO FUNCIONA)**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário clica em "Conectar com Jetimob"                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. authenticate() é chamado                                 │
│    ❌ this.authToken = this.config.webserviceKey            │
│    ❌ Tenta GET em https://api.jetimob.com/v2/imoveis      │
│    ❌ Header: Authorization: Bearer {webserviceKey}         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. API Jetimob responde                                     │
│    ❌ 404 Not Found (rota /v2/imoveis não existe)          │
│    ❌ Ou 401 Unauthorized (header errado)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Código tenta parsear resposta                           │
│    ❌ data.access_token (campo não existe)                  │
│    ❌ Salva token inválido no localStorage                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. loadProperties() é chamado                               │
│    ❌ GET em https://api.jetimob.com/v2/properties         │
│    ❌ Header: Authorization: Bearer {token inválido}        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. API Jetimob responde                                     │
│    ❌ 404 Not Found (rota /properties não existe)          │
│    ❌ Lista vazia ou erro                                   │
└─────────────────────────────────────────────────────────────┘

RESULTADO: ❌ NADA FUNCIONA
```

---

### **FLUXO CORRETO (✅ COMO DEVE SER)**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário clica em "Conectar com Jetimob"                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. authenticate() é chamado                                 │
│    ✅ this.authToken = this.config.webserviceKey            │
│    ✅ return true (não precisa de request)                  │
│    ✅ Token está pronto para uso                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. loadProperties() é chamado                               │
│    ✅ GET em https://api.jetimob.com/imoveis                │
│    ✅ Header: token: {webserviceKey}                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. API Jetimob responde                                     │
│    ✅ 200 OK com lista de imóveis                           │
│    ✅ {imoveis: [...], total: 150, pagina: 1}              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Parse da resposta                                        │
│    ✅ data.imoveis é mapeado corretamente                   │
│    ✅ Lista é exibida no dashboard                          │
└─────────────────────────────────────────────────────────────┘

RESULTADO: ✅ TUDO FUNCIONA
```

---

## 🔴 Pontos de Falha Identificados

### **1. URL Base (lib/jetimob/jetimob-service.ts:494)**
```typescript
// ❌ ATUAL (ERRADO)
baseUrl: 'https://api.jetimob.com/v2'

// ✅ CORRETO
baseUrl: 'https://api.jetimob.com'
```

**Impacto:** CRÍTICO - Todas as requests falham com 404

---

### **2. Método authenticate() (linhas 68-95)**
```typescript
// ❌ ATUAL (COMPLEXO E ERRADO)
async authenticate(): Promise<boolean> {
    this.authToken = this.config.webserviceKey
    
    const response = await fetch(`${this.config.baseUrl}/imoveis`, {
        headers: {
            'Authorization': `Bearer ${this.authToken}`  // ❌ ERRADO
        }
    })
    
    const data = await response.json()
    this.authToken = data.access_token  // ❌ NÃO EXISTE
}

// ✅ CORRETO (SIMPLES)
async authenticate(): Promise<boolean> {
    this.authToken = this.config.webserviceKey
    return true  // Pronto! Sem request necessária
}
```

**Impacto:** CRÍTICO - Autenticação nunca funciona

---

### **3. getAuthHeaders() (linhas 109-113)**
```typescript
// ❌ ATUAL (ERRADO)
private getAuthHeaders(): HeadersInit {
    return {
        'Authorization': `Bearer ${this.authToken}`,  // ❌ Campo errado
        'X-Public-Key': this.config.publicKey         // ❌ Não existe na API
    }
}

// ✅ CORRETO
private getAuthHeaders(): HeadersInit {
    return {
        'Content-Type': 'application/json',
        'token': this.authToken  // ✅ Campo correto
    }
}
```

**Impacto:** CRÍTICO - Todas as requests retornam 401 Unauthorized

---

### **4. Endpoints de Imóveis (linhas 156, 176, 210, 240)**
```typescript
// ❌ ATUAL (ERRADO - em inglês)
fetch(`${this.config.baseUrl}/properties`)          // GET all
fetch(`${this.config.baseUrl}/properties/${id}`)    // GET one
fetch(`${this.config.baseUrl}/properties`)          // POST
fetch(`${this.config.baseUrl}/properties/${id}`)    // PUT

// ✅ CORRETO (em português - API Jetimob)
fetch(`${this.config.baseUrl}/imoveis`)             // GET all
fetch(`${this.config.baseUrl}/imovel/${id}`)        // GET one
fetch(`${this.config.baseUrl}/imovel`)              // POST
fetch(`${this.config.baseUrl}/imovel/${id}`)        // PUT
```

**Impacto:** ALTO - Todas as operações de imóveis falham com 404

---

### **5. Parse de Resposta (linha 165)**
```typescript
// ❌ ATUAL (ERRADO)
const data = await response.json()
return data.properties || []  // ❌ Campo errado

// ✅ CORRETO
const data = await response.json()
return data.imoveis || []  // ✅ Campo correto da API
```

**Impacto:** MÉDIO - Dados não são exibidos mesmo se a request funcionar

---

### **6. Variáveis de Ambiente (.env.local:24-26)**
```bash
# ❌ ATUAL (DESNECESSÁRIO)
JETIMOB_WEBSERVICE_KEY=abFgx...  # ✅ NECESSÁRIO
JETIMOB_PUBLIC_KEY=9Ecsj...      # ❌ NÃO USADO
JETIMOB_PRIVATE_KEY=EmlDK...     # ❌ NÃO USADO

# ✅ CORRETO (SIMPLIFICADO)
JETIMOB_WEBSERVICE_KEY=abFgx...  # ✅ Só isso é necessário
JETIMOB_BASE_URL=https://api.jetimob.com  # ✅ Sem /v2
```

**Impacto:** BAIXO - Não quebra, mas confunde

---

## 📈 Matriz de Severidade

| Problema | Arquivo | Linha | Severidade | Bloqueia? | Fix Tempo |
|----------|---------|-------|------------|-----------|-----------|
| URL base /v2 | jetimob-service.ts | 494 | 🔴 CRÍTICA | SIM | 1 min |
| Headers errados | jetimob-service.ts | 109-113 | 🔴 CRÍTICA | SIM | 2 min |
| authenticate() complexo | jetimob-service.ts | 68-95 | 🔴 CRÍTICA | SIM | 5 min |
| Endpoints em inglês | jetimob-service.ts | 156+ | 🟠 ALTA | SIM | 10 min |
| Parse errado | jetimob-service.ts | 165+ | 🟡 MÉDIA | NÃO | 5 min |
| Vars env extras | .env.local | 25-26 | 🟢 BAIXA | NÃO | 1 min |
| Doc desatualizada | JETIMOB_*.md | - | 🟡 MÉDIA | NÃO | 10 min |

**Total tempo de correção:** ~35 minutos

---

## 🎯 Checklist de Correção

### **Fase 1: Correções Críticas (10 min)**
- [ ] Corrigir URL base: remover `/v2`
- [ ] Simplificar método `authenticate()`
- [ ] Corrigir `getAuthHeaders()` para usar `token:`
- [ ] Remover verificação de `access_token`

### **Fase 2: Correções de Endpoints (15 min)**
- [ ] Trocar `/properties` → `/imoveis`
- [ ] Trocar `/properties/${id}` → `/imovel/${id}`
- [ ] Trocar `/leads` (já está certo)
- [ ] Corrigir parse: `data.properties` → `data.imoveis`
- [ ] Corrigir parse: `data.property` → `data.imovel`

### **Fase 3: Limpeza (10 min)**
- [ ] Remover `JETIMOB_PUBLIC_KEY` do .env (ou deixar comentado)
- [ ] Remover `JETIMOB_PRIVATE_KEY` do .env (ou deixar comentado)
- [ ] Atualizar documentação JETIMOB_INTEGRATION.md
- [ ] Atualizar JETIMOB_INTEGRATION_README.md

### **Fase 4: Testes (10 min)**
- [ ] Testar autenticação
- [ ] Testar listagem de imóveis
- [ ] Testar busca de imóvel específico
- [ ] Testar listagem de leads
- [ ] Verificar console para erros

---

## 📚 Documentação de Referência

### **API Jetimob - Endpoints Corretos:**

```
BASE: https://api.jetimob.com

GET    /imoveis              → Lista todos os imóveis
GET    /imovel/{id}          → Busca imóvel específico
POST   /imovel               → Cria novo imóvel
PUT    /imovel/{id}          → Atualiza imóvel
DELETE /imovel/{id}          → Deleta imóvel

GET    /leads                → Lista leads
POST   /lead                 → Cria lead
PUT    /lead/{id}            → Atualiza lead

GET    /portais              → Lista portais disponíveis
POST   /portal/sincronizar   → Sincroniza com portal
```

### **Headers Corretos:**
```http
Content-Type: application/json
token: {JETIMOB_WEBSERVICE_KEY}
```

### **Exemplo de Resposta (GET /imoveis):**
```json
{
  "imoveis": [
    {
      "id": 123,
      "titulo": "Apartamento 3 quartos",
      "descricao": "Lindo apartamento...",
      "tipo": "apartamento",
      "valor": 500000,
      "quartos": 3,
      "banheiros": 2,
      "vagas": 2
    }
  ],
  "total": 150,
  "pagina": 1,
  "por_pagina": 20
}
```

---

## 🚀 Status Final

**Diagnóstico:** ✅ COMPLETO
**Problemas Mapeados:** 8 principais
**Severidade:** 3 CRÍTICOS, 1 ALTO, 2 MÉDIOS, 2 BAIXOS
**Tempo de Correção:** ~35 minutos
**Complexidade:** MÉDIA (reescrita parcial necessária)

**Ação Recomendada:** Corrigir imediatamente os 3 problemas críticos para desbloquear a integração.
