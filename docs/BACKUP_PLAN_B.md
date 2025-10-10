# 🔄 Plano de Backup Alternativo

## Problema
SSH/FTP instável com timeout constante

## ✅ Solução: Painel LocaWeb

### Opção 1: File Manager Web
1. Acessar painel LocaWeb
2. File Manager
3. Comprimir `public_html/` direto no servidor
4. Download do arquivo .zip via HTTP (mais estável)

### Opção 2: Backup automático LocaWeb
1. Painel → Backups
2. Gerar backup completo
3. Download do backup oficial

### Opção 3: Rsync em horário alternativo
```bash
# Testar conexão em diferentes horários
# Madrugada geralmente é mais estável
./scripts/backup-modular.sh
```

## 🎯 Informações Obtidas

### Banco de Dados ✅
- **wp_imobiliaria:** 7.5 MB
- **Backup local:** ~/db-backups/wp_imobiliaria_backup_20251006_183343.sql.gz (602 KB)
- **Status:** COMPLETO

### Credenciais ✅
```
SSH: imobiliariaipe1@187.45.193.173:22
DB: wp_imobiliaria@wp_imobiliaria.mysql.dbaas.com.br
```

### Arquivos WordPress ❌
- **Status:** PENDENTE
- **Estimativa:** 500 MB - 5 GB
- **Conteúdo:**
  - uploads/ (fotos imóveis)
  - themes/
  - plugins/
  - wp-config.php
  - .htaccess

## 🚀 Recomendação Imediata

### Via Painel LocaWeb (Mais Confiável)

1. **Login:** https://painel.locaweb.com.br
2. **File Manager** ou **Backup**
3. **Comprimir public_html/**
4. **Download via browser** (HTTP mais estável que FTP/SSH)

**OU**

### Contato LocaWeb
- Solicitar backup completo via ticket
- Envio por link de download
- Geralmente disponibilizam em 24h

## 💡 Enquanto isso...

### Preparar AWS agora (paralelo)
```bash
# 1. Criar EC2 instance
# 2. Instalar LEMP stack
# 3. Criar RDS MySQL
# 4. Configurar security groups
# 5. Importar DB (já temos!)
```

Quando arquivos chegarem:
```bash
# Upload para EC2
scp -r wp-content/ ubuntu@aws-instance:/var/www/html/
```

## 📋 Checklist Atualizado

- [x] DB backup
- [x] Credenciais documentadas
- [ ] Arquivos WordPress (via painel LocaWeb)
- [ ] Setup AWS EC2 + RDS
- [ ] Importar DB na AWS
- [ ] Upload arquivos
- [ ] Configurar CloudFlare
- [ ] Teste
- [ ] DNS cutover

---

**Ação imediata:** Acessar painel LocaWeb e gerar backup ou comprimir public_html/ via File Manager Web
