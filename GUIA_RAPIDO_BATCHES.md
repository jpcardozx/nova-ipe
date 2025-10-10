# 🚀 GUIA RÁPIDO - Migração em Batches

## ✅ **RESPOSTA À SUA PERGUNTA:**

### **SIM, o progresso fica salvo!**

Se quebrar no batch 5, você pode:
1. ✅ Ver o que foi salvo
2. ✅ Executar o script novamente
3. ✅ Ele pula batches 1-4 automaticamente
4. ✅ Continua do batch 5

**Arquivos ficam salvos em:**
```
~/wp-migration-batches-YYYYMMDD_HHMMSS/
```

**Progresso salvo em:**
```
~/wp-migration-batches-YYYYMMDD_HHMMSS/state.txt
```

---

## 📋 **RESUMO DOS 12 BATCHES**

| # | Nome | O que faz | Tempo | Tamanho |
|---|------|-----------|-------|---------|
| 1 | Verificar Acessos | Testa SSH Locaweb + Lightsail | 30s | - |
| 2 | Backup Database | Dump MySQL → .sql.gz | 30s | 607KB |
| 3 | Backup Plugins | Compacta /wp-content/plugins | 2-3min | 70MB |
| 4 | Backup Themes | Compacta /wp-content/themes | 1min | 8MB |
| 5 | Backup Uploads Antigos | Anos 2016-2022 | 10-15min | ~2GB |
| 6 | Backup Uploads Novos | Anos 2023-2025 + WPL (imóveis) | 15-20min | ~2GB |
| 7 | Transferir para Lightsail | Envia todos os arquivos via SCP | 30-60min | 4GB+ |
| 8 | Importar Database | Cria DB + importa SQL | 2min | - |
| 9 | Importar Arquivos | Extrai plugins, themes, uploads | 5-10min | - |
| 10 | Configurar WordPress | Edita wp-config.php | 1min | - |
| 11 | Reiniciar Serviços | Restart Apache + MySQL | 30s | - |
| 12 | Verificar Site | Testa HTTP response | 10s | - |

**TOTAL:** 1h30 - 2h30

---

## 🎯 **COMO EXECUTAR**

### **Opção 1: Batch por Batch (Recomendado)**
```bash
cd /home/jpcardozx/projetos/nova-ipe
./scripts/migration-batches.sh

# Menu aparece, escolha: 1
# Aguarda completar
# Verifica se está OK
# Pressiona ENTER
# Escolhe: 1 novamente (próximo batch)
```

### **Opção 2: Todos de Uma Vez**
```bash
cd /home/jpcardozx/projetos/nova-ipe
./scripts/migration-batches.sh

# Menu aparece, escolha: 2
# Confirma: s
# Vai tomar café ☕
# Volta em 2 horas
```

---

## 🔄 **SE QUEBRAR NO MEIO**

### **Exemplo: Quebrou no Batch 6**

#### 1. **Ver o que foi salvo:**
```bash
ls -lh ~/wp-migration-batches-*/

# Mostra:
# database.sql.gz          607K  ✅
# plugins.tar.gz           70M   ✅
# themes.tar.gz            8.4M  ✅
# uploads_2016_2022.tar.gz 1.8G  ✅
# uploads_2023_2025_wpl.tar.gz 450M ❌ (incompleto)
```

#### 2. **Ver progresso:**
```bash
cat ~/wp-migration-batches-*/state.txt

# Mostra:
# BATCH_1_VERIFY=completed
# BATCH_2_DATABASE=completed
# BATCH_3_PLUGINS=completed
# BATCH_4_THEMES=completed
# BATCH_5_UPLOADS_OLD=completed
# BATCH_6_UPLOADS_NEW=pending  ← Parou aqui!
```

#### 3. **Retomar:**
```bash
./scripts/migration-batches.sh

# Escolhe: 1 (próximo batch)
# Script automaticamente:
#   - Pula batches 1-5 ✅
#   - Executa batch 6 novamente ⏳
```

---

## 🛡️ **SEGURANÇA**

### **Nada é perdido:**
1. ✅ **Backups locais preservados** → Sempre no seu PC
2. ✅ **WordPress antigo preservado** → Renomeado para `.old` no Lightsail
3. ✅ **State file rastreado** → Sabe exatamente onde parou
4. ✅ **Validação de tamanho** → Não aceita arquivos vazios

### **Pode refazer:**
- ✅ Um batch específico (opção 3 no menu)
- ✅ Do ponto onde parou (opção 1)
- ✅ Tudo do zero (deletar pasta e executar novamente)

---

## 📊 **MONITORAR PROGRESSO**

### **Em tempo real (outro terminal):**
```bash
watch -n 5 'cat ~/wp-migration-batches-*/state.txt'
```

### **Ver tamanhos:**
```bash
du -sh ~/wp-migration-batches-*/*
```

### **Ver logs (se houver):**
```bash
tail -f ~/wp-migration-batches-*/logs/*.log
```

---

## 🎯 **COMANDOS RÁPIDOS**

### **Iniciar:**
```bash
cd /home/jpcardozx/projetos/nova-ipe
./scripts/migration-batches.sh
```

### **Ver progresso:**
```bash
cat ~/wp-migration-batches-*/state.txt | grep BATCH
```

### **Ver backups:**
```bash
ls -lh ~/wp-migration-batches-*/
```

### **Limpar e recomeçar:**
```bash
rm -rf ~/wp-migration-batches-*
./scripts/migration-batches.sh
```

---

## ✅ **PRONTO!**

**O sistema:**
- ✅ Salva progresso automaticamente
- ✅ Pode ser retomado de qualquer ponto
- ✅ Preserva todos os arquivos
- ✅ Valida cada etapa
- ✅ Mostra progresso visual
- ✅ Nunca perde trabalho feito

**Execute com confiança! 🚀**

```bash
cd /home/jpcardozx/projetos/nova-ipe
./scripts/migration-batches.sh
```
