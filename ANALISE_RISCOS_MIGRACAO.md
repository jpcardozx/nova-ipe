# 🛡️ ANÁLISE DE RISCOS - Migração Design Tokens

## 📊 Nível de Risco: **BAIXO** ✅

**Resumo:** Migração segura com múltiplas camadas de proteção e breakpoints de reversão.

---

## 🔒 Garantias Implementadas

### **1. Backup Automático Obrigatório**
```bash
# ANTES de qualquer modificação, cria:
arquivo.tsx         # Original (será modificado)
arquivo.tsx.backup  # Backup (cópia exata do original)
```

**Breakpoint:** ✅ Pode reverter com `--restore` a qualquer momento

---

### **2. Modo Dry-Run (Preview Seguro)**
```bash
# Ver mudanças SEM aplicar
node scripts/migrate-to-tokens.js app/dashboard/page.tsx --dry-run

# Output mostra:
# ❌ ANTES:  className="bg-white dark:bg-slate-800"
# ✅ DEPOIS: className="bg-surface"
```

**Breakpoint:** ✅ Zero modificação no código, apenas visualização

---

### **3. Detecção de Backup Existente**
```bash
# Se já existe backup, NÃO sobrescreve
⚠️  Backup já existe: arquivo.tsx.backup
   Para re-migrar, primeiro restaure com: --restore
```

**Breakpoint:** ✅ Previne perda de backup original

---

### **4. Reversão Rápida**
```bash
# Reverter mudanças instantaneamente
node scripts/migrate-to-tokens.js app/dashboard/page.tsx --restore

# Restaura arquivo.tsx do arquivo.tsx.backup
```

**Breakpoint:** ✅ Desfazer em 1 segundo

---

### **5. Validação de Arquivos**
```javascript
// Antes de processar:
✅ Arquivo existe?
✅ É .tsx ou .jsx?
✅ Tem permissão de leitura/escrita?
✅ Caminho válido?
```

**Breakpoint:** ✅ Falha antes de modificar se houver problema

---

### **6. Git Integration (Recomendado)**
```bash
# Usar Git como camada extra de segurança
git status                    # Ver arquivos que serão modificados
git add -A                    # Adicionar mudanças
git commit -m "Pre-migration" # Commit antes da migração

# Migrar
node scripts/migrate-to-tokens.js app/dashboard/page.tsx

# Testar
pnpm dev

# Se algo der errado:
git reset --hard HEAD         # Reverter TUDO
```

**Breakpoint:** ✅ Git = máquina do tempo completa

---

## 📈 Níveis de Proteção

### **Nível 1: Backup do Script** ✅
```
arquivo.tsx.backup criado automaticamente
```

### **Nível 2: Git Commit** ✅
```
git commit antes da migração
```

### **Nível 3: Preview Dry-Run** ✅
```
--dry-run para ver mudanças antes
```

### **Nível 4: Modo Restore** ✅
```
--restore para desfazer
```

---

## 🎯 Processo Recomendado (Zero Risco)

### **Passo 1: Git Checkpoint**
```bash
cd /home/jpcardozx/projetos/nova-ipe
git status
git add -A
git commit -m "checkpoint: antes de migrar design tokens"
```

### **Passo 2: Preview (Dry-Run)**
```bash
# Ver o que VAI mudar (não modifica nada)
node scripts/migrate-to-tokens.js app/page.tsx --dry-run
```

### **Passo 3: Aplicar em 1 Arquivo de Teste**
```bash
# Migrar apenas 1 arquivo primeiro
node scripts/migrate-to-tokens.js app/page.tsx
```

### **Passo 4: Testar**
```bash
# Iniciar servidor
pnpm dev

# Abrir http://localhost:3001
# Verificar visualmente
# Testar dark mode: document.documentElement.classList.toggle('dark')
```

### **Passo 5A: Se Funcionou ✅**
```bash
# Continuar migrando outros arquivos
node scripts/migrate-to-tokens.js app/dashboard/page.tsx --dry-run
node scripts/migrate-to-tokens.js app/dashboard/page.tsx
# ... testar novamente
```

### **Passo 5B: Se Deu Problema ❌**
```bash
# OPÇÃO 1: Restaurar com script
node scripts/migrate-to-tokens.js app/page.tsx --restore

# OPÇÃO 2: Restaurar com Git
git checkout app/page.tsx

# OPÇÃO 3: Restaurar tudo com Git
git reset --hard HEAD
```

---

## 🔥 Cenários de Falha e Soluções

### **Cenário 1: Visual Quebrado Após Migração**

**Sintoma:** Cores erradas, dark mode não funciona

**Causa Provável:** Token não existe ou nome incorreto

**Solução:**
```bash
# 1. Restaurar arquivo
node scripts/migrate-to-tokens.js app/page.tsx --restore

# 2. Verificar tokens disponíveis
cat app/globals.css | grep "^  --color"

# 3. Ajustar mapeamento em scripts/migrate-to-tokens.js
# 4. Tentar novamente
```

**Breakpoint:** ✅ Backup preservado, fácil reverter

---

### **Cenário 2: Build Falha**

**Sintoma:** `npm run build` retorna erro

**Causa Provável:** Sintaxe inválida ou classe CSS desconhecida

**Solução:**
```bash
# 1. Ver erro específico
npm run build

# 2. Restaurar do backup
node scripts/migrate-to-tokens.js app/page.tsx --restore

# 3. OU reverter com Git
git checkout app/page.tsx

# 4. Corrigir manualmente a classe problemática
```

**Breakpoint:** ✅ Build falha ANTES de deploy, não em produção

---

### **Cenário 3: TypeScript Errors**

**Sintoma:** Erros de tipo após migração

**Causa Provável:** Muito improvável (migração só muda classes CSS)

**Solução:**
```bash
# TypeScript não deveria ser afetado, mas se houver problema:
npx tsc --noEmit

# Reverter se necessário
node scripts/migrate-to-tokens.js app/page.tsx --restore
```

**Breakpoint:** ✅ TypeScript valida antes de runtime

---

### **Cenário 4: Esqueci de Fazer Backup**

**Sintoma:** Modificou arquivo sem usar o script

**Solução:**
```bash
# Git é seu amigo
git diff app/page.tsx              # Ver mudanças
git checkout app/page.tsx          # Desfazer
git log --oneline                  # Ver commits anteriores
git reset --hard <commit-hash>     # Voltar para commit específico
```

**Breakpoint:** ✅ Git sempre salva

---

## 📊 Tabela de Riscos

| Risco | Probabilidade | Impacto | Mitigação | Reversão |
|-------|---------------|---------|-----------|----------|
| Visual quebrado | Baixa | Médio | Preview dry-run | 1 comando |
| Build falha | Muito baixa | Médio | Validação de sintaxe | 1 comando |
| Perda de código | Zero | Alto | Backup automático + Git | 1 comando |
| TypeScript errors | Zero | Baixo | Não afeta tipos | N/A |
| Performance degradada | Zero | Baixo | Tokens são otimizados | N/A |
| Dark mode quebra | Baixa | Médio | Testar antes de commit | 1 comando |

---

## ✅ Checklist Pré-Migração

- [ ] **Git está limpo** (sem mudanças não commitadas)
  ```bash
  git status
  # Se tiver mudanças: git add -A && git commit -m "save work"
  ```

- [ ] **Servidor parado** (evita hot-reload durante migração)
  ```bash
  # Ctrl+C no terminal do pnpm dev
  ```

- [ ] **Backup manual (opcional, redundância)**
  ```bash
  cp -r app app_backup_$(date +%Y%m%d_%H%M%S)
  ```

- [ ] **Testou dry-run** (viu preview das mudanças)
  ```bash
  node scripts/migrate-to-tokens.js <arquivo> --dry-run
  ```

- [ ] **Tem acesso ao Git** (pode reverter rapidamente)
  ```bash
  git log --oneline | head -n 5
  ```

---

## 🚀 Comando Seguro para Iniciar

### **Ultra-Seguro (Recomendado para primeira vez):**
```bash
# 1. Checkpoint Git
git add -A && git commit -m "checkpoint: before token migration"

# 2. Preview em 1 arquivo
node scripts/migrate-to-tokens.js app/page.tsx --dry-run

# 3. Se parecer bom, aplicar
node scripts/migrate-to-tokens.js app/page.tsx

# 4. Testar visualmente
pnpm dev
# Abrir http://localhost:3001
# Toggle dark mode no DevTools

# 5A. Se funcionou ✅
git add app/page.tsx
git commit -m "migrated: app/page.tsx to design tokens"
rm app/page.tsx.backup

# 5B. Se deu problema ❌
node scripts/migrate-to-tokens.js app/page.tsx --restore
# OU
git checkout app/page.tsx
```

---

## 📈 Progressão Gradual Recomendada

### **Fase 1: Teste Inicial (5 min)**
```bash
# Migrar apenas homepage
node scripts/migrate-to-tokens.js app/page.tsx --dry-run
node scripts/migrate-to-tokens.js app/page.tsx
pnpm dev
# Testar visualmente
```

### **Fase 2: Dashboard Principal (10 min)**
```bash
# Migrar layout do dashboard
node scripts/migrate-to-tokens.js app/dashboard/layout.tsx --dry-run
node scripts/migrate-to-tokens.js app/dashboard/layout.tsx
node scripts/migrate-to-tokens.js app/dashboard/page.tsx --dry-run
node scripts/migrate-to-tokens.js app/dashboard/page.tsx
pnpm dev
# Testar
```

### **Fase 3: Páginas Secundárias (20 min)**
```bash
# Migrar outras páginas
node scripts/migrate-to-tokens.js app/dashboard/agenda/page.tsx
node scripts/migrate-to-tokens.js app/dashboard/clients/page.tsx
node scripts/migrate-to-tokens.js app/dashboard/settings/page.tsx
pnpm dev
# Testar cada página
```

### **Fase 4: Componentes (15 min)**
```bash
# Migrar componentes reutilizáveis
node scripts/migrate-to-tokens.js components/
pnpm dev
# Testar todas as páginas que usam os componentes
```

### **Fase 5: Limpeza (5 min)**
```bash
# Remover backups após confirmar que tudo funciona
find . -name "*.backup" -type f -delete

# Commit final
git add -A
git commit -m "completed: design tokens migration"
```

---

## 🎯 Conclusão

### **Nível de Risco: BAIXO** ✅

**Por quê?**
- ✅ Backup automático antes de qualquer mudança
- ✅ Modo dry-run para preview sem risco
- ✅ Reversão em 1 comando
- ✅ Git como camada extra de segurança
- ✅ Validações antes de modificar
- ✅ Detecção de backups existentes
- ✅ Processo gradual (1 arquivo por vez)

**Breakpoints Disponíveis:**
1. **Preview (--dry-run):** Ver mudanças sem aplicar
2. **Backup (.backup):** Arquivo salvo antes da modificação
3. **Restore (--restore):** Reverter com script
4. **Git Checkout:** Reverter com Git
5. **Git Reset:** Voltar commits inteiros

**Tempo de Reversão:** <1 segundo

**Probabilidade de Perda de Dados:** ~0% (múltiplas camadas de backup)

---

## 🚦 Recomendação Final

✅ **PODE INICIAR COM SEGURANÇA**

**Comando para começar:**
```bash
# Garantir Git limpo
git status
git add -A && git commit -m "checkpoint: before migration"

# Preview primeiro arquivo
node scripts/migrate-to-tokens.js app/page.tsx --dry-run

# Se parecer bom, aplicar
node scripts/migrate-to-tokens.js app/page.tsx

# Testar
pnpm dev
```

**Se algo der errado em qualquer momento:**
```bash
node scripts/migrate-to-tokens.js app/page.tsx --restore
# OU
git reset --hard HEAD
```

---

**Migração é:** LEVE ✅ | SEGURA ✅ | REVERSÍVEL ✅ | COM BREAKPOINTS ✅
