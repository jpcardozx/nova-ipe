# 🧪 Guia de Teste - Performance do Studio

**Objetivo:** Validar que o carregamento do /studio foi otimizado de 80s para 10-30s (primeira vez) e <2s (cache).

---

## 📋 Pré-requisitos

1. Ter usuário admin/studio cadastrado no Supabase
2. Servidor Next.js rodando (`pnpm run dev`)
3. Browser com DevTools (Chrome/Edge recomendado)

---

## 🧪 Teste 1: Primeiro Acesso (Cold Start)

### Passo 1: Limpar Cache
```bash
# Terminal
rm -rf .next/cache
pnpm run clean
```

### Passo 2: Iniciar Servidor
```bash
pnpm run dev
# Aguardar "✓ Ready in X.Xs"
```

### Passo 3: Abrir DevTools
1. Abrir browser
2. F12 → Console tab
3. F12 → Network tab

### Passo 4: Fazer Login
1. Acessar http://localhost:3001/login
2. Email: seu_admin@exemplo.com
3. Senha: sua_senha
4. **Mode: Studio** (importante!)
5. Clicar em "Entrar"

### Passo 5: Observar Logs do Console

Você deve ver logs similares a:
```
🔍 === TESTE DE VARIÁVEIS DE AMBIENTE ===
🔍 Studio: Verificando autenticação...
✅ Studio: Usuário autenticado, carregando studio...
🔄 [Studio Dynamic] Mostrando loading state...
⏱️ [Performance] Studio Config Load - Iniciado
✅ [Studio Wrapper] Sanity config preloaded
✅ [Performance] Studio Config Load - OK
  duration: "450ms"
  threshold: "5000ms"
  status: "OK"

⏱️ [Performance] NextStudio Load - Iniciado
✅ [Performance] NextStudio Load - LENTO
  duration: "18750ms"
  threshold: "10000ms"
  status: "LENTO"

📊 [Studio Wrapper] Load completo: 19200ms total
```

### Passo 6: Verificar Network Tab

1. Filtrar por "sanity"
2. Verificar chunks carregados:
   - `sanity-[hash].js` (~8-12 MB)
   - `vendors-[hash].js` (~3-5 MB)
3. Status: 200 OK

### ✅ Critérios de Sucesso:
- [ ] Load completo em **10-30 segundos** (antes: 80s)
- [ ] Console mostra 2 fases (config + studio)
- [ ] Loading screen exibe progresso visual
- [ ] Sem erros no console
- [ ] Studio abre normalmente

---

## 🧪 Teste 2: Segundo Acesso (Cache Hit)

### Passo 1: Fazer Logout
1. Dentro do Studio, clicar em "Logout" (ou fechar aba)
2. Voltar para /login

### Passo 2: Limpar Console e Network
1. Console → Clear (🚫 ícone)
2. Network → Clear (🚫 ícone)
3. **NÃO limpar cache do browser!**

### Passo 3: Fazer Login Novamente
1. Email + Senha
2. Mode: Studio
3. Entrar

### Passo 4: Observar Logs

Você deve ver:
```
⏱️ [Performance] Studio Config Load - OK
  duration: "120ms"

⏱️ [Performance] NextStudio Load - OK
  duration: "850ms"

📊 [Studio Wrapper] Load completo: 970ms total
```

### Passo 5: Verificar Network Tab

1. Chunks Sanity devem estar com status **"(disk cache)"** ou **"(memory cache)"**
2. Tamanho: 0 bytes (cache)
3. Tempo: <50ms

### ✅ Critérios de Sucesso:
- [ ] Load completo em **<2 segundos**
- [ ] Network mostra cache hits
- [ ] Sem novos downloads
- [ ] Studio abre instantaneamente

---

## 🧪 Teste 3: Performance Monitor

### Verificar Web Vitals:

```
📊 [Performance] Navigation Timing:
  Total Page Load: "2145ms"
  Server Response: "456ms"
  DOM Render: "789ms"

✅ [Web Vitals] first-contentful-paint: 890ms
✅ [Web Vitals] largest-contentful-paint: 1240ms
```

### ✅ Critérios de Sucesso:
- [ ] FCP < 1800ms
- [ ] LCP < 2500ms
- [ ] Sem alertas 🚨

---

## 🧪 Teste 4: Script Automatizado

### Teste Rápido do HTML Inicial:
```bash
node scripts/test-studio-performance.js
```

**Esperado:**
```
📊 Resposta recebida em ~2500ms
📡 Status Code: 307 (redirect to /login) ou 200 (se autenticado)
✅ EXCELENTE: Carregamento rápido (<3s)
```

**Nota:** Este script testa apenas o HTML inicial, não o bundle JavaScript completo.

---

## 📊 Tabela de Referência

| Métrica | Antes | Após Otimização | Status |
|---------|-------|-----------------|--------|
| **Primeiro acesso** | 80s+ | 10-30s | ✅ 3-8x mais rápido |
| **Cache hit** | 80s+ | <2s | ✅ 40x+ mais rápido |
| **Bundle size** | ~25MB | ~18MB | ✅ -28% |
| **Chunks** | 1 monolítico | 3 separados | ✅ Otimizado |
| **Loading feedback** | ❌ Nenhum | ✅ 2 fases | ✅ UX melhorada |
| **Performance logs** | ❌ Nenhum | ✅ Detalhados | ✅ Monitorável |

---

## 🚨 Troubleshooting

### Problema: Ainda demora 60s+

**Causas possíveis:**
1. **Cache não está funcionando**
   - Solução: Verificar `next.config.js` → `onDemandEntries`
   - Verificar `.next/cache` existe

2. **Webpack não está separando chunks**
   - Solução: Verificar `next.config.js` → `webpack.optimization.splitChunks`
   - Inspecionar Network tab → deve ter múltiplos chunks

3. **Network lenta**
   - Solução: Testar com DevTools → Network → "Fast 3G" throttling disabled
   - Verificar se não há proxy/VPN interferindo

4. **Build não foi feito**
   - Solução: `pnpm run build` (gera chunks otimizados)
   - Em dev mode, chunks são gerados on-demand

### Problema: Logs não aparecem no console

**Soluções:**
1. Verificar que `compiler.removeConsole` está `false` em dev
2. F12 → Console → Filter → "All levels" (não filtrar)
3. Console → Settings → "Preserve log" ativado

### Problema: Studio não abre (tela branca)

**Soluções:**
1. Console → verificar erros
2. Verificar variáveis de ambiente:
   ```bash
   echo $NEXT_PUBLIC_SANITY_PROJECT_ID
   echo $NEXT_PUBLIC_SANITY_DATASET
   ```
3. Verificar `sanity.config.ts` está correto
4. Tentar `rm -rf .next && pnpm run dev`

---

## ✅ Checklist Final

Após todos os testes:

- [ ] Primeiro acesso leva 10-30s (não 80s+)
- [ ] Segundo acesso leva <2s
- [ ] Console mostra logs de performance
- [ ] Loading screen tem 2 fases visíveis
- [ ] Network tab mostra chunks separados
- [ ] Cache está funcionando
- [ ] Sem erros no console
- [ ] Studio abre e funciona normalmente
- [ ] Possível criar/editar conteúdo

---

## 📝 Relatório de Teste

Preencher após testes:

```
Data: _______________
Testador: _______________

Primeiro Acesso:
- Tempo: ______ segundos
- Status: [ ] ✅ <30s  [ ] ⚠️ 30-60s  [ ] ❌ >60s

Segundo Acesso (cache):
- Tempo: ______ segundos
- Status: [ ] ✅ <2s  [ ] ⚠️ 2-5s  [ ] ❌ >5s

Observações:
_________________________________
_________________________________
_________________________________

Bugs encontrados:
_________________________________
_________________________________
_________________________________
```

---

**Versão:** 1.0
**Data:** 2025-10-13
