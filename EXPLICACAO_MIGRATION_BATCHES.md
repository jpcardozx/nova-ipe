# 📚 EXPLICAÇÃO COMPLETA - migration-batches.sh

## 🎯 **RESUMO EXECUTIVO**

Este script executa a migração em **12 batches independentes** com **progresso salvo automaticamente**.

**Se quebrar, NADA é perdido!** Você pode retomar exatamente de onde parou.

---

## 🔐 **SISTEMA DE CHECKPOINT (Progresso Salvo)**

### **Como funciona:**

#### 1. **Arquivo de Estado**
```
~/wp-migration-batches-YYYYMMDD_HHMMSS/state.txt
```

Contém:
```bash
MIGRATION_START=2025-10-08T00:15:00
MIGRATION_DIR=/home/jpcardozx/wp-migration-batches-20251008_001500
BATCH_1_VERIFY=completed    # ✅ Já executado
BATCH_2_DATABASE=completed  # ✅ Já executado
BATCH_3_PLUGINS=in_progress # ⏳ Executando agora
BATCH_4_THEMES=pending      # ⏸️ Aguardando
BATCH_5_UPLOADS_OLD=pending
...
```

#### 2. **Verificação Automática**
Antes de executar qualquer batch:
```bash
if is_completed 3; then
    info "Batch 3 já completado. Pulando..."
    return 0
fi
```

#### 3. **Marca como Completo**
Após sucesso:
```bash
mark_complete 3  # Atualiza state.txt → BATCH_3_PLUGINS=completed
```

### **O que acontece se quebrar?**

#### Cenário 1: Internet cai durante Batch 5 (Uploads Antigos)
```
✅ Batch 1: Verificar acessos → COMPLETADO
✅ Batch 2: Database → COMPLETADO
✅ Batch 3: Plugins → COMPLETADO
✅ Batch 4: Themes → COMPLETADO
❌ Batch 5: Uploads Antigos → FALHOU (internet caiu no meio)
⏸️ Batches 6-12 → NÃO EXECUTADOS
```

**Arquivos salvos:**
```
~/wp-migration-batches-20251008_001500/
├── database/
│   └── database.sql.gz ✅ 607KB (salvo!)
├── plugins/
│   └── plugins.tar.gz ✅ 70MB (salvo!)
├── themes/
│   └── themes.tar.gz ✅ 8MB (salvo!)
└── uploads/
    └── uploads_2016_2022.tar.gz ❌ 500MB (incompleto - mas não importa!)
```

**Para retomar:**
```bash
./scripts/migration-batches.sh
```

O script:
1. Lê `state.txt`
2. Vê que batches 1-4 estão `completed`
3. **Pula batches 1-4** (não refaz!)
4. **Retoma do batch 5** (refaz só o que falhou)

---

## 📋 **DETALHAMENTO DOS 12 BATCHES**

### **FASE 1: BACKUPS (Local → Seu PC)**

#### **Batch 1: Verificar Acessos** (30 segundos)
```bash
- Testa SSH Locaweb ✓
- Testa SSH Lightsail ✓
- Se falhar: Para tudo (credenciais inválidas)
```
**Salva:** Nada (só testa)
**Pode pular:** Sim, se já completado

---

#### **Batch 2: Backup Database** (30 segundos)
```bash
- Conecta no MySQL Locaweb
- Faz mysqldump (todas as tabelas)
- Comprime com gzip
- Valida tamanho (mínimo 50KB)
```
**Salva:** `database/database.sql.gz` (607KB)
**Se falhar:** Arquivo fica no seu PC, pode refazer só esse batch
**Validação:** Se arquivo < 50KB → ERRO

---

#### **Batch 3: Backup Plugins** (2-3 minutos)
```bash
- SSH no Locaweb
- cd wp-content
- tar -czf - plugins  # Compacta e envia via stdout
- Salva no seu PC
- Valida tamanho (mínimo 50MB)
```
**Salva:** `plugins/plugins.tar.gz` (70MB)
**Se falhar:** Refaz só esse batch
**Validação:** Se arquivo < 50MB → ERRO (esperado ~70MB)

---

#### **Batch 4: Backup Themes** (1 minuto)
```bash
- SSH no Locaweb
- cd wp-content
- tar -czf - themes
- Valida tamanho (mínimo 5MB)
```
**Salva:** `themes/themes.tar.gz` (8MB)
**Se falhar:** Refaz só esse batch
**Validação:** Se arquivo < 5MB → ERRO

---

#### **Batch 5: Backup Uploads Antigos** (10-15 minutos)
```bash
- SSH no Locaweb
- cd wp-content/uploads
- tar -czf - 2016 2017 2018 2019 2020 2021 2022
- Pode demorar MUITO (vários GB)
```
**Salva:** `uploads/uploads_2016_2022.tar.gz` (~1-2GB)
**Se falhar:** 
- Arquivo parcial é descartado
- Refaz do zero (o tar recomeça)
**Sem validação mínima:** Pode estar vazio se não houver uploads desses anos

---

#### **Batch 6: Backup Uploads Novos + WPL** (15-20 minutos)
```bash
- SSH no Locaweb
- cd wp-content/uploads
- tar -czf - 2023 2024 2025 WPL
- WPL = pasta com 765 subpastas de imóveis
```
**Salva:** `uploads/uploads_2023_2025_wpl.tar.gz` (~2-3GB)
**Se falhar:** Refaz do zero
**CRÍTICO:** WPL contém todas as imagens dos imóveis!

---

### **FASE 2: TRANSFERÊNCIA (Seu PC → Lightsail)**

#### **Batch 7: Transferir para Lightsail** (30-60 minutos)
```bash
# Transfere os 5 arquivos via SCP
scp database.sql.gz bitnami@lightsail:/tmp/
scp plugins.tar.gz bitnami@lightsail:/tmp/
scp themes.tar.gz bitnami@lightsail:/tmp/
scp uploads_2016_2022.tar.gz bitnami@lightsail:/tmp/
scp uploads_2023_2025_wpl.tar.gz bitnami@lightsail:/tmp/
```
**Se falhar no 3º arquivo:**
- Arquivos 1 e 2 já estão no Lightsail ✅
- Refaz do arquivo 3 em diante
**Pode demorar:** Sim! 4GB+ via internet

---

### **FASE 3: IMPORTAÇÃO (No Lightsail)**

#### **Batch 8: Importar Database** (2 minutos)
```bash
# Executa remotamente no Lightsail:
mysql -u root <<SQL
  CREATE DATABASE wp_imobiliaria;
  CREATE USER 'wp_imobiliaria'@'localhost';
  GRANT ALL PRIVILEGES;
SQL

gunzip < /tmp/database.sql.gz | mysql wp_imobiliaria
```
**Se falhar:**
- Database pode ficar pela metade
- Batch verifica `is_completed 8` → se pending, **dropa e recria**
**Seguro:** Sim, pode refazer

---

#### **Batch 9: Importar Arquivos** (5-10 minutos)
```bash
# No Lightsail:
1. Backup do wp-content atual (renomeia para .old)
2. Cria wp-content/{plugins,themes,uploads}
3. Extrai plugins.tar.gz
4. Extrai themes.tar.gz
5. Extrai uploads_2016_2022.tar.gz
6. Extrai uploads_2023_2025_wpl.tar.gz
7. Ajusta permissões (bitnami:daemon, 775/664)
```
**Se falhar no passo 4:**
- Passos 1-3 já foram executados
- Refaz do passo 4 (extrai themes novamente)
**Seguro:** Sim, extração é idempotente

---

#### **Batch 10: Configurar WordPress** (1 minuto)
```bash
# Edita wp-config.php:
sed -i "s/DB_NAME.*/DB_NAME = 'wp_imobiliaria'/"
sed -i "s/DB_USER.*/DB_USER = 'wp_imobiliaria'/"
sed -i "s/DB_PASSWORD.*/DB_PASSWORD = 'Ipe@5084'/"
sed -i "s/DB_HOST.*/DB_HOST = 'localhost'/"

# Adiciona URLs:
define('WP_HOME', 'https://portal.imobiliariaipe.com.br');
define('WP_SITEURL', 'https://portal.imobiliariaipe.com.br');
```
**Se falhar:** Pode refazer sem problemas (sed é idempotente)

---

#### **Batch 11: Reiniciar Serviços** (30 segundos)
```bash
sudo /opt/bitnami/ctlscript.sh restart apache
sudo /opt/bitnami/ctlscript.sh restart mysql
```
**Se falhar:** Pode reiniciar manualmente ou refazer batch

---

#### **Batch 12: Verificar Site** (10 segundos)
```bash
curl -I http://13.223.237.99
# Espera HTTP 200, 301 ou 302
```
**Se falhar:** Não é crítico, só verifica se está respondendo

---

## 🔄 **COMO RETOMAR APÓS FALHA**

### **Exemplo Prático:**

#### 1. **Execução inicial** (quebrou no Batch 6)
```bash
./scripts/migration-batches.sh

# Progresso:
✅ Batch 1: Verificar acessos
✅ Batch 2: Database
✅ Batch 3: Plugins
✅ Batch 4: Themes
✅ Batch 5: Uploads antigos
❌ Batch 6: Uploads novos (internet caiu!)
```

#### 2. **Verificar o que foi salvo**
```bash
ls -lh ~/wp-migration-batches-*/

# Resultado:
database/database.sql.gz     607K  ✅
plugins/plugins.tar.gz       70M   ✅
themes/themes.tar.gz         8.4M  ✅
uploads/uploads_2016_2022.tar.gz  1.8G  ✅
uploads/uploads_2023_2025_wpl.tar.gz  450M  ❌ (incompleto)
```

#### 3. **Retomar**
```bash
./scripts/migration-batches.sh

# Menu aparece:
# Progresso: 5/12 (41%)
# 
# Estado dos batches:
#   ✅ BATCH_1_VERIFY
#   ✅ BATCH_2_DATABASE
#   ✅ BATCH_3_PLUGINS
#   ✅ BATCH_4_THEMES
#   ✅ BATCH_5_UPLOADS_OLD
#   ⏸️ BATCH_6_UPLOADS_NEW
#   ⏸️ BATCH_7_TRANSFER
#   ...
#
# Escolha:
# 1) Executar próximo batch  ← Escolha essa!
```

#### 4. **Script automaticamente:**
- Lê `state.txt`
- Vê que batches 1-5 = `completed`
- **Pula batches 1-5**
- **Executa batch 6** (refaz só o upload que falhou)

---

## 🛡️ **GARANTIAS DE SEGURANÇA**

### **1. Arquivos locais sempre preservados**
```bash
~/wp-migration-batches-20251008_001500/
```
- ✅ Nunca são deletados
- ✅ Podem ser usados para refazer
- ✅ Backup completo no seu PC

### **2. WordPress antigo preservado no Lightsail**
```bash
# Batch 9 faz backup automático:
sudo mv /opt/bitnami/wordpress/wp-content \
        /opt/bitnami/wordpress/wp-content.old.20251008
```
- ✅ Se algo der errado, pode restaurar
- ✅ Apenas renomeia, não deleta

### **3. State file independente**
```bash
state.txt → Controla progresso
```
- ✅ Criado no início
- ✅ Atualizado após cada batch
- ✅ Nunca é sobrescrito

### **4. Validação de tamanhos**
```bash
if [ "$bytes" -lt 50000000 ]; then
    error "Arquivo muito pequeno!"
    return 1  # Não marca como completed
fi
```
- ✅ Evita falsos positivos
- ✅ Se arquivo está vazio, batch não é marcado como completo

---

## 📊 **FLUXOGRAMA DE EXECUÇÃO**

```
INÍCIO
  │
  ├─ Lê state.txt (ou cria se não existe)
  │
  ├─ MENU
  │   ├─ 1) Próximo batch
  │   ├─ 2) Todos os batches
  │   ├─ 3) Batch específico
  │   └─ 0) Sair
  │
  ├─ Escolha: 1 (Próximo batch)
  │
  ├─ Busca primeiro batch com status != completed
  │   │
  │   ├─ BATCH_1 = completed? → Pula
  │   ├─ BATCH_2 = completed? → Pula
  │   ├─ BATCH_3 = pending?   → EXECUTA!
  │   │
  │   └─ Executa batch_3_plugins()
  │       │
  │       ├─ Baixa plugins via SSH
  │       ├─ Valida tamanho
  │       │
  │       ├─ Sucesso?
  │       │   ├─ Sim → mark_complete(3)
  │       │   │        └─ state.txt: BATCH_3=completed
  │       │   │
  │       │   └─ Não → return 1
  │       │            └─ state.txt: BATCH_3=pending (não muda)
  │       │
  │       └─ Volta ao MENU
  │
  └─ Repete até todos = completed
```

---

## 🎯 **COMANDOS ÚTEIS**

### **Ver progresso atual**
```bash
cat ~/wp-migration-batches-*/state.txt
```

### **Ver tamanho dos backups**
```bash
du -sh ~/wp-migration-batches-*/*
```

### **Reiniciar do zero** (se quiser recomeçar)
```bash
rm -rf ~/wp-migration-batches-*
./scripts/migration-batches.sh
```

### **Continuar de onde parou**
```bash
# Só executar novamente:
./scripts/migration-batches.sh
# Ele detecta automaticamente o progresso!
```

---

## ✅ **VANTAGENS DESTE SISTEMA**

1. ✅ **Retomável:** Nunca perde progresso
2. ✅ **Visível:** Mostra status de cada batch
3. ✅ **Seguro:** Backups locais preservados
4. ✅ **Validado:** Verifica tamanho dos arquivos
5. ✅ **Controlado:** Executa 1 por vez ou todos
6. ✅ **Transparente:** Logs em tempo real
7. ✅ **Reversível:** WordPress antigo preservado

---

## 🚀 **PRONTO PARA EXECUTAR!**

```bash
cd /home/jpcardozx/projetos/nova-ipe
chmod +x scripts/migration-batches.sh
./scripts/migration-batches.sh
```

**Recomendação:**
- Escolha opção **1** (próximo batch)
- Aguarde completar
- Verifique se está OK
- Execute próximo batch

Ou:
- Escolha opção **2** (todos de uma vez)
- Vá tomar um café ☕
- Volte em 2 horas

**Qualquer problema → O progresso está salvo! 🎯**
