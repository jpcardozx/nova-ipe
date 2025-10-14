# 🚨 DIAGNÓSTICO: Integração Jetimob NÃO Funciona

## 📋 Análise Completa dos Problemas

### **PROBLEMA #1: URL Base Incorreta** ❌
**Gravidade:** CRÍTICA

**Encontrado:**
```typescript
// jetimob-service.ts linha 494
baseUrl: process.env.JETIMOB_BASE_URL || 'https://api.jetimob.com/v2'

// .env.local linha 27
JETIMOB_BASE_URL=https://api.jetimob.com/v2
```

**Problema:**
A API Jetimob **NÃO tem versão v2 pública**. A documentação oficial aponta para:
- ✅ Correto: `https://api.jetimob.com` (sem versionamento na URL)
- ❌ Errado: `https://api.jetimob.com/v2`

**Evidência:**
- Documentação oficial: https://jetimob.docs.apiary.io/
- Todos os endpoints na doc usam `https://api.jetimob.com` como base

---

### **PROBLEMA #2: Autenticação Implementada Incorretamente** ❌
**Gravidade:** CRÍTICA

**Código Atual (ERRADO):**
```typescript
// lib/jetimob/jetimob-service.ts linhas 68-95
async authenticate(): Promise<boolean> {
    try {
        // ❌ ERRADO: Jetimob não usa webservice key como Bearer token
        this.authToken = this.config.webserviceKey
        
        // ❌ ERRADO: Tentando fazer GET em /imoveis para testar
        const response = await fetch(`${this.config.baseUrl}/imoveis`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authToken}` // ❌ ERRADO
            }
        })
        
        // ❌ ERRADO: Esperando access_token na resposta
        const data = await response.json()
        this.authToken = data.access_token // ❌ Isso não existe na API
    }
}
```

**Como DEVERIA Ser (Baseado na Documentação):**
```typescript
// Jetimob usa autenticação via API Key nos HEADERS, não Bearer token
async authenticate(): Promise<boolean> {
    // Jetimob não requer endpoint de login separado
    // A autenticação é feita via headers em cada request
    this.authToken = this.config.webserviceKey
    return true
}
```

**Headers Corretos Jetimob:**
```typescript
private getAuthHeaders(): HeadersInit {
    return {
        'Content-Type': 'application/json',
        'token': this.config.webserviceKey,  // ✅ CORRETO
        // NÃO usar Authorization: Bearer
        // NÃO usar X-Public-Key (isso não existe na API)
    }
}
```

---

### **PROBLEMA #3: Headers Incorretos** ❌
**Gravidade:** CRÍTICA

**Código Atual (ERRADO):**
```typescript
// lib/jetimob/jetimob-service.ts linhas 109-113
private getAuthHeaders(): HeadersInit {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken || this.config.webserviceKey}`, // ❌ ERRADO
        'X-Public-Key': this.config.publicKey // ❌ NÃO EXISTE NA API
    }
}
```

**Correto (Baseado na Documentação):**
```typescript
private getAuthHeaders(): HeadersInit {
    return {
        'Content-Type': 'application/json',
        'token': this.config.webserviceKey  // ✅ Apenas isso
    }
}
```

---

### **PROBLEMA #4: Endpoints Incorretos** ❌
**Gravidade:** ALTA

**Encontrado:**
```typescript
// Todos os endpoints estão errados

// ❌ ERRADO
fetch(`${this.config.baseUrl}/properties`)       // linha 156
fetch(`${this.config.baseUrl}/properties/${id}`) // linha 176

// ❌ ERRADO
fetch(`${this.config.baseUrl}/leads`)            // linha 306
```

**Correto (Baseado na Documentação):**
```typescript
// ✅ CORRETO - Endpoints da API Jetimob
fetch(`${this.config.baseUrl}/imoveis`)              // Listar imóveis
fetch(`${this.config.baseUrl}/imovel/${id}`)         // Imóvel específico
fetch(`${this.config.baseUrl}/leads`)                // Leads (esse está certo)
fetch(`${this.config.baseUrl}/portais`)              // Portais
```

---

### **PROBLEMA #5: Estrutura de Resposta Incorreta** ❌
**Gravidade:** MÉDIA

**Código Atual (ERRADO):**
```typescript
// lib/jetimob/jetimob-service.ts linha 165
const data = await response.json()
return data.properties || []  // ❌ Campo errado
```

**Correto (Baseado na Documentação):**
```typescript
const data = await response.json()
return data.imoveis || []  // ✅ A API retorna "imoveis", não "properties"
```

---

### **PROBLEMA #6: Variáveis de Ambiente Desnecessárias** ⚠️
**Gravidade:** BAIXA (mas confunde)

**Encontrado:**
```bash
# .env.local
JETIMOB_WEBSERVICE_KEY=abFgx...  # ✅ NECESSÁRIO
JETIMOB_PUBLIC_KEY=9Ecsj...      # ❌ NÃO USADO pela API
JETIMOB_PRIVATE_KEY=EmlDK...     # ❌ NÃO USADO pela API
```

**Problema:**
A API Jetimob **só usa o webservice_key**. As outras keys (public/private) não existem na documentação oficial e não são usadas.

---

### **PROBLEMA #7: Fluxo de Autenticação Quebrado** ❌
**Gravidade:** CRÍTICA

**Sequência Atual (QUEBRADA):**
1. ❌ Tenta fazer GET em `/imoveis` sem token válido
2. ❌ Espera receber `access_token` na resposta
3. ❌ Salva token inexistente no localStorage
4. ❌ Usa token inválido em requests subsequentes

**Sequência Correta:**
1. ✅ Pega `webserviceKey` do `.env.local`
2. ✅ Usa direto como `token` no header
3. ✅ Não precisa de chamada de autenticação separada
4. ✅ Toda request usa o mesmo header `token: webserviceKey`

---

### **PROBLEMA #8: Documentação Inconsistente** ⚠️
**Gravidade:** MÉDIA

**Encontrado:**
```markdown
# docs/JETIMOB_INTEGRATION.md linha 24
JETIMOB_BASE_URL=https://api.jetimob.com/v1  # ❌ v1 não existe

# JETIMOB_INTEGRATION_README.md linha 58
JETIMOB_BASE_URL=https://api.jetimob.com/v1  # ❌ v1 não existe
```

**Correto:**
```bash
JETIMOB_BASE_URL=https://api.jetimob.com  # ✅ Sem versionamento
```

---

## 🔍 Resumo dos Erros

| # | Problema | Gravidade | Status |
|---|----------|-----------|--------|
| 1 | URL base com `/v2` inexistente | CRÍTICA | ❌ Bloqueante |
| 2 | Autenticação Bearer token errada | CRÍTICA | ❌ Bloqueante |
| 3 | Headers com campos inexistentes | CRÍTICA | ❌ Bloqueante |
| 4 | Endpoints em inglês (deveria ser português) | ALTA | ❌ Não funciona |
| 5 | Estrutura de resposta JSON errada | MÉDIA | ❌ Parse falha |
| 6 | Variáveis env desnecessárias | BAIXA | ⚠️ Confuso |
| 7 | Fluxo de autenticação complexo desnecessário | CRÍTICA | ❌ Quebrado |
| 8 | Documentação desatualizada | MÉDIA | ⚠️ Confuso |

---

## 🎯 Causa Raiz

**A integração foi implementada baseada em suposições ou documentação antiga, não na documentação oficial atual da Jetimob.**

Problemas principais:
1. ✅ **URL base correta:** `https://api.jetimob.com` (SEM `/v2`)
2. ✅ **Header de autenticação:** `token: webserviceKey` (NÃO Bearer)
3. ✅ **Endpoints em português:** `/imoveis`, `/imovel/{id}` (NÃO `/properties`)
4. ✅ **Sem endpoint de login:** Autenticação é por header em cada request
5. ✅ **Resposta JSON:** `{imoveis: [...]}` (NÃO `{properties: [...]}`)

---

## 🚀 Solução Necessária

### **Arquivos que PRECISAM ser corrigidos:**

1. **lib/jetimob/jetimob-service.ts** - Reescrever completamente:
   - URL base
   - Método authenticate()
   - Headers
   - Todos os endpoints
   - Parse de respostas

2. **.env.local** - Simplificar:
   - Remover JETIMOB_PUBLIC_KEY (não usado)
   - Remover JETIMOB_PRIVATE_KEY (não usado)
   - Corrigir JETIMOB_BASE_URL

3. **docs/JETIMOB_INTEGRATION.md** - Atualizar:
   - Exemplos de código corretos
   - URLs corretas
   - Headers corretos

4. **JETIMOB_INTEGRATION_README.md** - Atualizar:
   - Mesmas correções da documentação

---

## 📚 Referências Corretas

### **Documentação Oficial:**
- https://jetimob.docs.apiary.io/

### **Exemplo de Request Correto:**
```bash
curl -X GET "https://api.jetimob.com/imoveis" \
  -H "Content-Type: application/json" \
  -H "token: abFgxNZPusQFUKKVIhuLq1hMU2HOOprLgNfookSayKOnMdUe5oVxw7JXJlg8YIht"
```

### **Exemplo de Resposta Esperada:**
```json
{
  "imoveis": [
    {
      "id": 123,
      "titulo": "Apartamento 3 quartos",
      "descricao": "...",
      "tipo": "apartamento",
      "valor": 500000
    }
  ],
  "total": 150,
  "pagina": 1
}
```

---

## ✅ Próximos Passos

1. **URGENTE:** Reescrever `jetimob-service.ts` com endpoints corretos
2. **URGENTE:** Corrigir headers de autenticação
3. **URGENTE:** Atualizar URL base
4. **IMPORTANTE:** Testar com a API real
5. **IMPORTANTE:** Atualizar documentação
6. **OPCIONAL:** Remover variáveis env desnecessárias

---

## 🎯 Estimativa de Correção

**Tempo:** 2-3 horas
**Complexidade:** Média (reescrita necessária)
**Risco:** Baixo (código isolado, não afeta outras partes)

**Status Atual:** ❌ **INTEGRAÇÃO COMPLETAMENTE QUEBRADA**
**Após Correção:** ✅ **FUNCIONAL**
