# WordPress Migration to AWS Lightsail - Complete Toolkit

Ferramentas completas para migrar WordPress da Locaweb para AWS Lightsail, **100% local** no Linux com VS Code.

## 🎯 O que este toolkit faz

1. **Acesso automatizado** ao WordPress no Lightsail via AWS CLI (sem CloudShell)
2. **Extração da senha** do wp-admin da imagem Bitnami
3. **Migração assistida** de banco de dados e arquivos
4. **Search-replace** seguro de URLs com WP-CLI
5. **Configuração HTTPS** automatizada

## 📦 Pré-requisitos

### Instalar AWS CLI e jq

```bash
sudo apt-get update
sudo apt-get install -y awscli jq
```

### Configurar AWS CLI

```bash
aws configure
```

Você precisará:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (ex: `us-east-1`)
- Output format: `json`

**Obter credenciais AWS:**
1. Acesse [AWS Console](https://console.aws.amazon.com)
2. Vá em: IAM → Users → [Seu usuário] → Security credentials
3. Crie "Access keys" se não tiver

## 🚀 Uso Rápido

### 1. Acessar WordPress e obter senha

```bash
cd /home/jpcardozx/projetos/nova-ipe
./scripts/lightsail-access.sh
```

Este script:
- ✅ Verifica dependências (AWS CLI, jq)
- ✅ Obtém chaves SSH temporárias da instância
- ✅ Extrai senha do wp-admin automaticamente
- ✅ Salva credenciais em `.lightsail-access/wp-credentials.txt`
- ✅ Menu interativo para SSH, criar admin, etc.

### 2. Migrar conteúdo

```bash
./scripts/wp-migration-helper.sh
```

Este script oferece:
- 📤 Upload e importação de banco SQL
- 📁 Upload de wp-content (plugins/themes/uploads)
- 🔄 Search-replace de URLs (dry-run e execução)
- 🔧 Correção de permissões
- 🗄️ Backup do banco atual
- ♻️ Limpeza de cache
- 🔍 Verificação/reparo de banco

## 📚 Documentação

### Guias Completos
- **[MIGRACAO_WORDPRESS_LIGHTSAIL.md](./MIGRACAO_WORDPRESS_LIGHTSAIL.md)** - Guia passo a passo completo da migração
- **[QUICK_REFERENCE_WORDPRESS_LIGHTSAIL.md](./QUICK_REFERENCE_WORDPRESS_LIGHTSAIL.md)** - Comandos úteis e troubleshooting

### Scripts Disponíveis
- **`scripts/lightsail-access.sh`** - Acesso SSH e credenciais do WordPress
- **`scripts/wp-migration-helper.sh`** - Ferramentas de migração

## 🔄 Fluxo de Migração Típico

### Fase 1: Setup e Acesso (5 min)

```bash
# 1. Instalar dependências (se necessário)
sudo apt-get install -y awscli jq

# 2. Configurar AWS
aws configure

# 3. Obter acesso ao WordPress
./scripts/lightsail-access.sh
# Escolha opção 5 para abrir wp-admin no navegador
```

### Fase 2: Preparação do Site Antigo (15 min)

No site antigo (Locaweb):

```bash
# Opção A: Usar plugin Duplicator (MAIS FÁCIL)
# 1. Instalar Duplicator no WordPress
# 2. Desativar plugins de cache pesados
# 3. Criar pacote e baixar .zip + installer.php

# Opção B: Manual
# 1. Exportar banco via phpMyAdmin
# 2. Baixar wp-content via FTP/SFTP
```

### Fase 3: Importação (10 min)

```bash
# Usar o helper de migração
./scripts/wp-migration-helper.sh

# No menu:
# 1. Upload de arquivo SQL (importar banco)
# 2. Upload de wp-content
# 3. Search-Replace de URLs (DRY RUN primeiro!)
# 4. Search-Replace de URLs (EXECUTAR)
# 5. Regenerar permissões
# 6. Limpar cache
```

### Fase 4: DNS e HTTPS (configuração única)

```bash
# 1. Alocar IP estático no Lightsail (via AWS Console ou CLI)
aws lightsail allocate-static-ip --region us-east-1 --static-ip-name ipe-static
aws lightsail attach-static-ip --region us-east-1 \
  --static-ip-name ipe-static --instance-name Ipe-1

# 2. Apontar DNS (no seu provedor)
# A @ -> SEU_IP_ESTATICO
# A www -> SEU_IP_ESTATICO

# 3. Aguardar propagação (15min - 48h)
dig seudominio.com.br +short

# 4. Via SSH, rodar bncert-tool
ssh -i .lightsail-access/key.pem bitnami@SEU_IP
sudo /opt/bitnami/bncert-tool

# 5. Atualizar URLs no banco
sudo wp search-replace 'http://dominio.com' 'https://dominio.com' \
  --all-tables --allow-root
```

## 🎓 Comandos Essenciais

### Acessar via SSH

```bash
# Com o script (usa chave temporária)
./scripts/lightsail-access.sh
# Opção 1: Conectar via SSH

# Manual (após executar lightsail-access.sh uma vez)
ssh -i .lightsail-access/key.pem \
  -o UserKnownHostsFile=.lightsail-access/known_hosts \
  bitnami@SEU_IP
```

### WP-CLI Essencial

```bash
# Dentro da instância SSH

# Listar usuários
sudo wp user list --allow-root

# Criar novo admin
sudo wp user create admin admin@email.com \
  --role=administrator \
  --user_pass='SenhaForte!' \
  --allow-root

# Trocar senha
sudo wp user update user --user_pass='NovaSenha!' --allow-root

# Exportar banco
sudo wp db export backup.sql --allow-root

# Importar banco
sudo wp db import backup.sql --allow-root

# Search-replace (DRY RUN sempre primeiro!)
sudo wp search-replace 'http://old.com' 'https://new.com' \
  --all-tables --dry-run --allow-root

# Flush cache/rewrite
sudo wp cache flush --allow-root
sudo wp rewrite flush --allow-root
```

### Controle de Serviços

```bash
# Status
sudo /opt/bitnami/ctlscript.sh status

# Reiniciar Apache
sudo /opt/bitnami/ctlscript.sh restart apache

# Ver logs
sudo tail -f /opt/bitnami/apache/logs/error_log
```

## 🛠️ Troubleshooting

### AWS CLI não configurado
```bash
aws configure
# Preencha com suas credenciais da AWS
```

### "Instance not found"
```bash
# Verificar nome correto da instância
aws lightsail get-instances --region us-east-1

# Editar variável no script se necessário
export INSTANCE_NAME="Nome-Correto-Da-Instancia"
./scripts/lightsail-access.sh
```

### Senha não encontrada no local padrão
```bash
# Via SSH, buscar arquivo de senha
find /home -name "*password*" -type f 2>/dev/null

# Ou criar nova senha direto
sudo wp user update user --user_pass='NovaSenha!' --allow-root
```

### Permalinks não funcionam
```bash
sudo wp rewrite flush --allow-root
sudo /opt/bitnami/ctlscript.sh restart apache
```

### Imagens não aparecem
```bash
# Corrigir permissões
sudo chown -R bitnami:daemon /opt/bitnami/wordpress/wp-content/uploads
sudo chmod -R 755 /opt/bitnami/wordpress/wp-content/uploads

# Regenerar miniaturas
sudo wp media regenerate --yes --allow-root
```

## 📊 Estrutura de Arquivos Gerada

```
nova-ipe/
├── scripts/
│   ├── lightsail-access.sh           # Script de acesso
│   └── wp-migration-helper.sh        # Script de migração
├── docs/
│   ├── MIGRACAO_WORDPRESS_LIGHTSAIL.md
│   ├── QUICK_REFERENCE_WORDPRESS_LIGHTSAIL.md
│   └── README_WORDPRESS_TOOLKIT.md   # Este arquivo
├── .lightsail-access/                # Criado pelo script
│   ├── access.json                   # Credenciais SSH
│   ├── key.pem                       # Chave SSH temporária
│   ├── known_hosts                   # Host keys
│   └── wp-credentials.txt            # Credenciais do WordPress
└── .wordpress-backup/                # Criado pelo helper
    └── backup-YYYYMMDD-HHMMSS.sql   # Backups
```

## ⚠️ Notas Importantes

1. **Chaves SSH são temporárias** - válidas por algumas horas. Execute `lightsail-access.sh` novamente se expirar.

2. **Sempre faça backup** antes de importar/alterar banco de dados:
   ```bash
   sudo wp db export /tmp/backup-$(date +%Y%m%d).sql --allow-root
   ```

3. **Search-replace com WP-CLI** trata serialização corretamente - **nunca** use SQL direto para URLs.

4. **IP estático é essencial** antes de configurar DNS - evita perder IP em reboot.

5. **bncert-tool renova SSL automaticamente** - não precisa configurar cron manual.

## 🔗 Links Úteis

- [AWS Lightsail Console](https://lightsail.aws.amazon.com/)
- [AWS CLI Lightsail Reference](https://docs.aws.amazon.com/cli/latest/reference/lightsail/)
- [WP-CLI Commands](https://developer.wordpress.org/cli/commands/)
- [Bitnami WordPress Docs](https://docs.bitnami.com/aws/apps/wordpress/)
- [Let's Encrypt](https://letsencrypt.org/)

## 💡 Dicas Pro

### Alias úteis no ~/.bashrc (dentro da instância)
```bash
echo "alias wproot='cd /opt/bitnami/wordpress'" >> ~/.bashrc
echo "alias wpcli='sudo wp --allow-root'" >> ~/.bashrc
echo "alias apachelog='sudo tail -f /opt/bitnami/apache/logs/error_log'" >> ~/.bashrc
echo "alias apacherestart='sudo /opt/bitnami/ctlscript.sh restart apache'" >> ~/.bashrc
source ~/.bashrc
```

### Usar sua própria chave SSH permanente
```bash
# Após conectar com chave temporária
mkdir -p ~/.ssh && chmod 700 ~/.ssh
cat >> ~/.ssh/authorized_keys << 'EOF'
ssh-ed25519 SUA_CHAVE_PUBLICA_AQUI
EOF
chmod 600 ~/.ssh/authorized_keys
```

### Snapshot antes de mudanças grandes
```bash
aws lightsail create-instance-snapshot \
  --region us-east-1 \
  --instance-name Ipe-1 \
  --instance-snapshot-name pre-migration-$(date +%Y%m%d)
```

## 📝 Checklist de Migração

- [ ] AWS CLI instalado e configurado
- [ ] Executado `lightsail-access.sh` com sucesso
- [ ] Login no wp-admin funcionando
- [ ] Backup do site antigo salvo localmente
- [ ] Banco de dados importado
- [ ] wp-content importado
- [ ] Search-replace executado
- [ ] Permissões corrigidas
- [ ] Site carregando corretamente (páginas, imagens, links)
- [ ] IP estático alocado e anexado
- [ ] DNS apontado
- [ ] HTTPS configurado (bncert-tool)
- [ ] Teste completo do site
- [ ] Backup do novo site criado

---

**Pronto para começar?**

```bash
# Verifique dependências primeiro
which aws || sudo apt-get install -y awscli
which jq || sudo apt-get install -y jq

# Configure AWS
aws configure

# Execute o script
./scripts/lightsail-access.sh
```

**Boa migração! 🚀**
