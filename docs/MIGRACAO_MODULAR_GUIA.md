# 🎯 Migração WordPress MODULAR - Guia Completo

**Sistema de batches com checkpoint, progress tracking e documentação em tempo real**

---

## 🌟 CARACTERÍSTICAS

### ✅ Segurança Total
- **Checkpoints automáticos** após cada batch
- **Pode pausar e retomar** a qualquer momento
- **Logs detalhados** de cada operação
- **State tracking em JSON** para auditoria
- **Nunca perde progresso** - mesmo se cair a conexão

### 📊 Progress Tracking
- **25 batches modulares** (não um "bolo" gigante)
- **Status em tempo real** de cada etapa
- **Estatísticas visuais** (completados, pendentes, falhas)
- **Estimativa de tempo** por batch
- **Tamanho de cada arquivo** documentado

### 🔄 Resiliência
- **Retry individual** de batches que falharam
- **Skip automático** de batches já completados
- **Backup incremental** - não refaz trabalho
- **Validação** em cada etapa

---

## 📋 ESTRUTURA DOS BATCHES

### FASE 1: Verificação (1 batch)
1. **verify_access** - Testa SSH e MySQL em ambos os servidores

### FASE 2: Backup no Locaweb (8 batches)
2. **backup_database** - Dump do MySQL (compactado)
3. **backup_core_files** - Arquivos raiz + wp-admin + wp-includes
4. **backup_plugins** - Diretório wp-content/plugins
5. **backup_themes** - Diretório wp-content/themes
6. **backup_uploads_2016_2020** - Uploads 2016-2020 (5 anos)
7. **backup_uploads_2021_2023** - Uploads 2021-2023 (3 anos)
8. **backup_uploads_2024_2025** - Uploads 2024-2025 (atual)
9. **backup_uploads_wpl** - Plugin WPL (765 pastas de imóveis)

### FASE 3: Transferência para Lightsail (5 batches)
10. **transfer_database** - Enviar database.sql.gz
11. **transfer_core** - Enviar core.tar.gz
12. **transfer_plugins** - Enviar plugins.tar.gz
13. **transfer_themes** - Enviar themes.tar.gz
14. **transfer_uploads** - Enviar todos os uploads

### FASE 4: Importação no Lightsail (6 batches)
15. **setup_lightsail_db** - Criar banco e usuário
16. **import_database** - Importar SQL
17. **extract_core** - Extrair arquivos core
18. **extract_plugins** - Extrair plugins
19. **extract_themes** - Extrair themes
20. **extract_uploads** - Extrair uploads

### FASE 5: Configuração Final (5 batches)
21. **configure_wp_config** - Ajustar wp-config.php
22. **fix_permissions** - Permissões bitnami:daemon
23. **cleanup_cache** - Remover cache antigo
24. **restart_services** - Reiniciar Apache + MySQL
25. **verify_site** - Testar site funcionando

---

## 🚀 COMO USAR

### Executar a migração

```bash
cd /home/jpcardozx/projetos/nova-ipe
./scripts/migration-modular.sh
```

### Menu interativo

```
========================================
  MIGRAÇÃO WORDPRESS MODULAR
========================================

ESTATÍSTICAS:
✅ Completados: 5/25 (20%)
⏳ Em progresso: 1
⏸️  Pendentes: 19
❌ Falhas: 0

Opções:
  1) Executar próximo batch
  2) Executar todos os batches pendentes
  3) Ver status detalhado
  4) Refazer batch específico
  5) Ver logs
  6) Criar backup do estado atual
  0) Sair
```

---

## 📂 ESTRUTURA DE ARQUIVOS

Tudo fica organizado em um diretório com timestamp:

```
~/wp-migration-20251007_234500/
├── state.json              # Estado da migração (JSON)
├── progress.txt            # Progresso legível
├── migration.log           # Log completo
├── errors.log              # Apenas erros
├── checkpoints/            # Checkpoints de cada batch
│   ├── 1_verify_access.checkpoint
│   ├── 2_backup_database.checkpoint
│   └── ...
├── database/
│   ├── database.sql.gz     # Dump do MySQL
│   └── metadata.txt        # Info do backup
├── core/
│   └── core.tar.gz         # WordPress core
├── plugins/
│   └── plugins.tar.gz      # Todos os plugins
├── themes/
│   └── themes.tar.gz       # Todos os themes
└── uploads/
    ├── uploads_2016_2020.tar.gz
    ├── uploads_2021_2023.tar.gz
    ├── uploads_2024_2025.tar.gz
    └── uploads_wpl.tar.gz
```

---

## 🔍 EXEMPLO DE state.json

```json
{
  "migration_id": "20251007_234500",
  "start_time": "2025-10-07T23:45:00-03:00",
  "current_batch": 5,
  "completed_batches": [],
  "failed_batches": [],
  "status": "in_progress",
  "batches": {
    "1_verify_access": "completed",
    "2_backup_database": "completed",
    "3_backup_core_files": "completed",
    "4_backup_plugins": "completed",
    "5_backup_themes": "in_progress",
    "6_backup_uploads_2016_2020": "pending",
    ...
  }
}
```

---

## 📊 EXEMPLO DE progress.txt

```
====================================
MIGRAÇÃO WORDPRESS - PROGRESSO
====================================
Data: 2025-10-07 23:50:15
Diretório: /home/jpcardozx/wp-migration-20251007_234500

ESTATÍSTICAS:
✅ Completados: 4/25 (16%)
⏳ Em progresso: 1
⏸️  Pendentes: 20
❌ Falhas: 0

BATCHES:
  1_verify_access: completed
  2_backup_database: completed
  3_backup_core_files: completed
  4_backup_plugins: completed
  5_backup_themes: in_progress
  6_backup_uploads_2016_2020: pending
  ...
====================================
```

---

## 🔄 CENÁRIOS DE USO

### Cenário 1: Execução normal sem interrupções

```bash
./scripts/migration-modular.sh
# Escolher opção 2: "Executar todos os batches pendentes"
# O script roda tudo automaticamente
# Você pode acompanhar o progresso em tempo real
```

### Cenário 2: Pausar e retomar

```bash
# Executando...
./scripts/migration-modular.sh
# Opção 2: Executar todos

# Conexão caiu no batch 7!
# Não tem problema, o batch 6 foi salvo como completed

# Depois, quando reconectar:
./scripts/migration-modular.sh
# O script detecta automaticamente que batches 1-6 estão completos
# Continua do batch 7
```

### Cenário 3: Batch falhou, corrigir e refazer

```bash
./scripts/migration-modular.sh
# Batch 8 falhou (uploads muito grandes, timeout)

# Menu:
# Opção 4: Refazer batch específico
# Digitar: 8_backup_uploads_2024_2025

# O script refaz apenas esse batch
# Todos os outros permanecem intactos
```

### Cenário 4: Verificar o que foi feito até agora

```bash
./scripts/migration-modular.sh
# Opção 3: Ver status detalhado

# Mostra:
# ✅ 1_verify_access: completed
# ✅ 2_backup_database: completed (245 MB)
# ✅ 3_backup_core_files: completed (18 MB)
# ❌ 4_backup_plugins: failed (timeout)
# ⏸️  5_backup_themes: pending
```

---

## 📝 LOGS DETALHADOS

### migration.log

```
[2025-10-07 23:45:00] ▶️  Iniciando batch: 1_verify_access
[2025-10-07 23:45:02] Testando SSH Locaweb...
[2025-10-07 23:45:03] ✅ SSH Locaweb: OK
[2025-10-07 23:45:03] Testando MySQL Locaweb...
[2025-10-07 23:45:05] ✅ MySQL Locaweb: OK
[2025-10-07 23:45:05] Testando SSH Lightsail...
[2025-10-07 23:45:07] ✅ SSH Lightsail: OK
[2025-10-07 23:45:07] ✅ Batch completado: 1_verify_access
[2025-10-07 23:45:07] ℹ️  Checkpoint salvo: 1_verify_access

[2025-10-07 23:45:10] ▶️  Iniciando batch: 2_backup_database
[2025-10-07 23:45:10] Fazendo dump do banco de dados...
[2025-10-07 23:47:25] ✅ Database dump criado: 245M
[2025-10-07 23:47:25] ✅ Batch completado: 2_backup_database
```

---

## ⏱️ TEMPO ESTIMADO POR BATCH

| Batch | Tempo Estimado | Tamanho Aproximado |
|-------|----------------|-------------------|
| 1. verify_access | ~10s | - |
| 2. backup_database | 2-5 min | 200-500 MB |
| 3. backup_core | 1-2 min | 15-25 MB |
| 4. backup_plugins | 2-5 min | 50-200 MB |
| 5. backup_themes | 1-3 min | 10-50 MB |
| 6. uploads 2016-2020 | 10-30 min | 500 MB - 2 GB |
| 7. uploads 2021-2023 | 10-30 min | 500 MB - 2 GB |
| 8. uploads 2024-2025 | 5-15 min | 200 MB - 1 GB |
| 9. uploads WPL | 15-45 min | 1-3 GB |
| 10-14. transfer | 20-60 min | (download + upload) |
| 15-25. setup/import | 15-30 min | - |

**TOTAL:** 2-4 horas (dependendo da internet)

---

## 🛡️ SEGURANÇA E RECUPERAÇÃO

### Se algo der errado:

1. **Servidor antigo continua intacto** - nada foi mexido
2. **Lightsail pode ser resetado** - é só uma cópia
3. **Todos os arquivos ficam salvos localmente** no diretório de migração
4. **Pode refazer quantas vezes quiser** - batches são idempotentes

### Backup do estado atual:

```bash
# No menu, opção 6
# Cria um snapshot completo do estado + arquivos
# Salvo em: ~/wp-migration-TIMESTAMP-backup.tar.gz
```

---

## 🔍 TROUBLESHOOTING

### Batch travou / timeout

```bash
# Espere terminar o timeout (geralmente 2-5 min)
# O batch será marcado como "failed"
# No menu: Opção 4 → Refazer batch específico
```

### Chave SSH não encontrada

```bash
# Erro: "Chave SSH não encontrada: ~/.ssh/LightsailDefaultKey-us-east-1.pem"

# Solução:
mv ~/Downloads/LightsailDefaultKey-us-east-1.pem ~/.ssh/
chmod 600 ~/.ssh/LightsailDefaultKey-us-east-1.pem
```

### Disco cheio (local)

```bash
# Verificar espaço:
df -h ~

# Liberar espaço ou mudar MIGRATION_DIR no script:
# Editar linha 13:
# MIGRATION_DIR="/mnt/external/wp-migration-$(date +%Y%m%d_%H%M%S)"
```

### Conexão SSH caiu

**Não tem problema!** O último batch completo está salvo.
Reconecte e execute novamente - continua de onde parou.

---

## 📞 MONITORAMENTO EM TEMPO REAL

### Ver progresso em outro terminal:

```bash
# Terminal 1: Rodando a migração
./scripts/migration-modular.sh

# Terminal 2: Monitorando
watch -n 5 cat ~/wp-migration-*/progress.txt

# Terminal 3: Acompanhando logs
tail -f ~/wp-migration-*/migration.log
```

---

## ✅ APÓS COMPLETAR TODOS OS BATCHES

O script fornecerá um relatório final:

```
====================================
MIGRAÇÃO COMPLETADA COM SUCESSO!
====================================

Estatísticas finais:
- Batches completados: 25/25
- Tempo total: 2h 34min
- Tamanho total: 4.2 GB
- Falhas: 0

Próximos passos:
1. Testar site: http://13.223.237.99
2. Verificar login WordPress
3. Configurar SSL (Let's Encrypt)
4. Apontar DNS
5. Desativar servidor antigo

Arquivos salvos em:
/home/jpcardozx/wp-migration-20251007_234500/

IMPORTANTE: Mantenha esse diretório até confirmar
que o site está 100% funcionando no Lightsail!
====================================
```

---

**Criado:** 7 de outubro de 2025
**Sistema:** Migration Modular v1.0

🎯 **Nunca mais perca progresso de migração!**
