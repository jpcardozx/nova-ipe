# 🧪 GUIA DE TESTE: Solução Quota Exceeded

**Data:** 11 de outubro de 2025  
**Objetivo:** Validar a solução em cenários reais

---

## ✅ Pré-requisitos

- [x] Servidor rodando em `http://localhost:3000`
- [x] Navegador com DevTools aberto (F12)
- [x] Console visível para monitorar logs

---

## 📋 Teste 1: Verificar Instalação

### Passo 1: Acessar ferramenta de diagnóstico

```
🌐 URL: http://localhost:3000/diagnostico-storage.html
```

**Resultado esperado:**
- ✅ Página carrega normalmente
- ✅ Dashboard mostra estatísticas
- ✅ 4 botões visíveis (Atualizar, Limpar Supabase, Limpar Rate Limit, Limpeza Total)

### Passo 2: Verificar estatísticas

Clique em **🔄 Atualizar**

**Resultado esperado:**
```
✅ Uso do Storage: XX%
✅ Total de Itens: XX
✅ Itens Supabase: XX
✅ Espaço Usado: XX KB
```

### Passo 3: Verificar logs

No painel de logs deve aparecer:
```
[HH:MM:SS] 🔍 Iniciando diagnóstico...
[HH:MM:SS] ✅ Diagnóstico concluído: X itens, X.XX KB usados
```

---

## 📋 Teste 2: Login Normal (Storage OK)

### Passo 1: Limpar storage

1. Acessar: `http://localhost:3000/diagnostico-storage.html`
2. Clicar em **🚨 Limpeza Total**
3. Confirmar ação
4. Verificar que uso caiu para ~0%

### Passo 2: Tentar login

1. Ir para `/login`
2. Inserir credenciais válidas
3. Clicar em "Entrar"

**Resultado esperado no Console:**
```javascript
🔐 useSupabaseAuth.signIn - Tentando login...
🧹 Iniciando limpeza de dados de rate limit...
✅ X itens de rate limit removidos
📊 Storage pronto: usage: XX%, items: XX
✅ useSupabaseAuth.signIn - Sucesso!
```

**Resultado na tela:**
- ✅ Login bem-sucedido
- ✅ Redirecionamento para dashboard
- ✅ Sem mensagens de erro

---

## 📋 Teste 3: Simular Storage Cheio

### Passo 1: Encher localStorage artificialmente

No **DevTools Console**, execute:

```javascript
// Encher localStorage até ~90% de capacidade
console.log('🧪 Enchendo localStorage...')

let count = 0
try {
  for (let i = 0; i < 1000; i++) {
    localStorage.setItem(`test_fill_${i}`, 'X'.repeat(5000))
    count++
  }
} catch (e) {
  console.log(`⚠️ Storage cheio após ${count} itens`)
}

// Verificar tamanho
let total = 0
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i)
  const value = localStorage.getItem(key)
  total += (key.length + value.length) * 2
}
console.log(`📊 Storage usado: ${(total / 1024 / 1024).toFixed(2)} MB`)
```

**Resultado esperado:**
```
🧪 Enchendo localStorage...
⚠️ Storage cheio após XXX itens
📊 Storage usado: X.XX MB
```

### Passo 2: Verificar diagnóstico

1. Acessar: `http://localhost:3000/diagnostico-storage.html`
2. Clicar em **🔄 Atualizar**

**Resultado esperado:**
- ⚠️ Uso do Storage: >80%
- ⚠️ Alerta: "Storage quase cheio! Recomendamos fazer limpeza."
- 🟠 Barra de progresso laranja/vermelha

### Passo 3: Tentar login com storage cheio

1. Ir para `/login`
2. Inserir credenciais válidas
3. Clicar em "Entrar"

**Resultado esperado no Console:**
```javascript
🔐 useSupabaseAuth.signIn - Tentando login...
🧹 Iniciando limpeza de dados Supabase...
✅ Limpeza concluída: 0 itens, XXX KB liberados
⚠️ Falha ao salvar em localStorage, tentando fallback...
🧹 Iniciando limpeza de dados Supabase...
✅ XX itens Supabase removidos
✅ XX itens de teste removidos
✅ Salvo após limpeza automática
✅ useSupabaseAuth.signIn - Sucesso!
```

**Resultado na tela:**
- ✅ Login bem-sucedido (após limpeza automática)
- ✅ Redirecionamento para dashboard
- ✅ Sem erros visíveis para o usuário

---

## 📋 Teste 4: Limpeza Manual

### Passo 1: Criar dados de teste

```javascript
// No DevTools Console
for (let i = 0; i < 10; i++) {
  localStorage.setItem(`sb-test-${i}`, JSON.stringify({ data: 'X'.repeat(1000) }))
}
console.log('✅ 10 itens Supabase de teste criados')
```

### Passo 2: Usar ferramenta de limpeza

1. Acessar: `http://localhost:3000/diagnostico-storage.html`
2. Clicar em **🔄 Atualizar** (deve mostrar +10 itens Supabase)
3. Clicar em **🧹 Limpar Supabase**

**Resultado esperado:**
- ✅ Alerta verde: "Limpeza concluída! X itens removidos."
- ✅ Logs mostram: `✅ X itens Supabase removidos`
- ✅ Itens Supabase volta ao normal

### Passo 3: Verificar rate limit

```javascript
// No DevTools Console
for (let i = 0; i < 5; i++) {
  localStorage.setItem(`login_attempts_test${i}@example.com`, JSON.stringify({ 
    failedAttempts: 3,
    lastAttempt: Date.now()
  }))
}
console.log('✅ 5 itens de rate limit criados')
```

1. Voltar para ferramenta: `http://localhost:3000/diagnostico-storage.html`
2. Clicar em **⚡ Limpar Rate Limit**

**Resultado esperado:**
- ✅ Alerta verde: "Rate limit limpo! X itens removidos."
- ✅ Todos os `login_attempts_*` removidos

---

## 📋 Teste 5: Cenário Extremo (Storage Crítico)

### Passo 1: Simular ambos storages cheios

```javascript
// Encher localStorage
try {
  for (let i = 0; true; i++) {
    localStorage.setItem(`fill_local_${i}`, 'X'.repeat(10000))
  }
} catch {}

// Encher sessionStorage
try {
  for (let i = 0; true; i++) {
    sessionStorage.setItem(`fill_session_${i}`, 'X'.repeat(10000))
  }
} catch {}

console.log('⚠️ Ambos storages cheios!')
```

### Passo 2: Tentar login

1. Ir para `/login`
2. Inserir credenciais válidas
3. Clicar em "Entrar"

**Resultado esperado no Console:**
```javascript
🔐 useSupabaseAuth.signIn - Tentando login...
⚠️ Falha ao salvar em localStorage, tentando fallback...
🚨 Ativando limpeza de emergência...
✅ Limpeza de emergência concluída
✅ Salvo após limpeza de emergência
✅ useSupabaseAuth.signIn - Sucesso!
```

**Resultado na tela:**
- ✅ Login bem-sucedido (após limpeza de emergência)
- ⚠️ Possível mensagem: "Storage estava cheio. Cache foi limpo automaticamente."
- ✅ Funcionamento normal restaurado

---

## 📋 Teste 6: Fallback para sessionStorage

### Passo 1: Desabilitar localStorage

```javascript
// No DevTools Console
// Simular localStorage indisponível
const originalSetItem = localStorage.setItem
localStorage.setItem = function() {
  throw new DOMException('QuotaExceededError')
}
```

### Passo 2: Tentar login

1. Ir para `/login`
2. Inserir credenciais válidas
3. Clicar em "Entrar"

**Resultado esperado no Console:**
```javascript
⚠️ localStorage cheio, tentando limpeza...
⚠️ Limpeza falhou, usando sessionStorage como fallback
✅ Salvo em sessionStorage (fallback)
```

**Resultado na tela:**
- ✅ Login bem-sucedido
- ✅ Sessão salva em sessionStorage
- ⚠️ Sessão expira ao fechar aba (comportamento esperado)

### Passo 3: Restaurar localStorage

```javascript
localStorage.setItem = originalSetItem
console.log('✅ localStorage restaurado')
```

---

## 📊 Checklist de Validação

### ✅ Instalação
- [ ] Ferramenta de diagnóstico acessível
- [ ] Dashboard mostra estatísticas corretas
- [ ] Botões funcionam

### ✅ Login Normal
- [ ] Login funciona com storage limpo
- [ ] Logs aparecem no console
- [ ] Preparação automática executa

### ✅ Storage Cheio
- [ ] Limpeza automática ativa
- [ ] Login funciona mesmo com storage >80%
- [ ] Fallback para sessionStorage funciona

### ✅ Limpeza Manual
- [ ] Botão "Limpar Supabase" funciona
- [ ] Botão "Limpar Rate Limit" funciona
- [ ] Botão "Limpeza Total" funciona

### ✅ Cenário Extremo
- [ ] Limpeza de emergência ativa quando necessário
- [ ] Sistema se recupera automaticamente
- [ ] Login eventual funciona

### ✅ Fallback
- [ ] sessionStorage usado como fallback
- [ ] Login funciona mesmo sem localStorage
- [ ] Comportamento documentado

---

## 🎯 Critérios de Sucesso

A solução é considerada **bem-sucedida** se:

1. ✅ **Login sempre funciona** (mesmo com storage cheio)
2. ✅ **Limpeza automática** previne quota exceeded
3. ✅ **Fallback funciona** quando necessário
4. ✅ **Ferramenta visual** permite diagnóstico fácil
5. ✅ **Logs claros** facilitam debug
6. ✅ **Sem intervenção manual** necessária

---

## 📝 Relatório de Teste

### Template para preencher:

```markdown
## Relatório de Teste - Solução Quota Exceeded

**Data:** __/__/__
**Testador:** ___________
**Ambiente:** [ ] Local [ ] Staging [ ] Produção

### Resultados:

- [ ] Teste 1: Verificar Instalação
  - Status: [ ] Passou [ ] Falhou
  - Observações: _______

- [ ] Teste 2: Login Normal
  - Status: [ ] Passou [ ] Falhou
  - Observações: _______

- [ ] Teste 3: Storage Cheio
  - Status: [ ] Passou [ ] Falhou
  - Observações: _______

- [ ] Teste 4: Limpeza Manual
  - Status: [ ] Passou [ ] Falhou
  - Observações: _______

- [ ] Teste 5: Cenário Extremo
  - Status: [ ] Passou [ ] Falhou
  - Observações: _______

- [ ] Teste 6: Fallback sessionStorage
  - Status: [ ] Passou [ ] Falhou
  - Observações: _______

### Conclusão:

[ ] Todos os testes passaram - Solução aprovada
[ ] Alguns testes falharam - Ajustes necessários
[ ] Maioria falhou - Revisão completa necessária

### Próximos passos:

1. _______
2. _______
3. _______
```

---

## 🎉 Conclusão

Após executar todos os testes:

1. ✅ Se **todos passarem**: Solução pronta para produção
2. ⚠️ Se **alguns falharem**: Revisar casos específicos
3. ❌ Se **maioria falhar**: Revisar implementação

**Lembre-se:** A solução tem **3 níveis de proteção**, então mesmo que um nível falhe, os outros devem garantir o funcionamento.
