# GUIA TÉCNICO: Correção do Portal Legado

## 🎯 Objetivo
Resolver os problemas do servidor `portal.imobiliariaipe.com.br` para restaurar o acesso ao sistema legado.

## 🚨 Problemas Identificados

### 1. Certificado SSL Incorreto
- **Problema**: Certificado é para `*.websiteseguro.com`
- **Impacto**: Navegadores bloqueiam acesso HTTPS
- **Erro**: `SSL: no alternative certificate subject name matches target host name`

### 2. Erro suPHP
- **Problema**: `UID of script "/home/httpd/html/index.php" is smaller than min_uid`
- **Impacto**: Scripts PHP não executam
- **Resultado**: HTTP 500 Internal Server Error

## 🔧 Soluções

### Correção do SSL (Opção 1 - Recomendada)
```bash
# Para administrador/provedor de hospedagem

# 1. Solicitar novo certificado SSL para o domínio correto
# Domínio: portal.imobiliariaipe.com.br
# Tipo: Single domain ou Wildcard para *.imobiliariaipe.com.br

# 2. Instalar certificado via painel de controle
# ou via comando (exemplo com Let's Encrypt):
certbot --apache -d portal.imobiliariaipe.com.br

# 3. Verificar instalação:
echo | openssl s_client -connect portal.imobiliariaipe.com.br:443 -servername portal.imobiliariaipe.com.br 2>/dev/null | openssl x509 -noout -text | grep -A5 "Subject Alternative Name"
```

### Correção do SSL (Opção 2 - Temporária)
```bash
# Redirecionamento temporário HTTPS -> HTTP
# Adicionar no .htaccess ou virtual host:

RewriteEngine On
RewriteCond %{HTTPS} on
RewriteRule ^(.*)$ http://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
```

### Correção do suPHP
```bash
# 1. Verificar configuração atual
grep min_uid /etc/suphp/suphp.conf
cat /etc/suphp/suphp.conf

# 2. Verificar UID dos arquivos
ls -la /home/httpd/html/
stat /home/httpd/html/index.php

# 3a. Opção: Ajustar proprietário dos arquivos
# Descobrir usuário correto (geralmente o usuário da conta de hospedagem)
id nome_usuario_conta

# Corrigir proprietário
chown -R usuario_correto:grupo_correto /home/httpd/html/
# Exemplo: chown -R www-data:www-data /home/httpd/html/

# 3b. Opção: Ajustar min_uid no suPHP (menos recomendado)
# Editar /etc/suphp/suphp.conf
# Alterar min_uid para um valor menor
# CUIDADO: Pode criar vulnerabilidades de segurança

# 4. Reiniciar Apache
systemctl restart apache2
# ou
service apache2 restart
```

### Verificação de Permissões
```bash
# Permissões recomendadas:
# Diretórios: 755
# Arquivos PHP: 644
# Arquivos de configuração sensíveis: 600

find /home/httpd/html/ -type d -exec chmod 755 {} \;
find /home/httpd/html/ -type f -name "*.php" -exec chmod 644 {} \;
find /home/httpd/html/ -type f -name "*.html" -exec chmod 644 {} \;
```

## 🔍 Diagnóstico Avançado

### Verificar Logs de Erro
```bash
# Apache Error Log
tail -f /var/log/apache2/error.log

# suPHP Log (se disponível)
tail -f /var/log/suphp.log

# Logs do sistema
journalctl -u apache2 -f
```

### Testar Configuração
```bash
# Verificar sintaxe do Apache
apache2ctl configtest

# Verificar módulos carregados
apache2ctl -M | grep suphp

# Testar PHP
echo "<?php phpinfo(); ?>" > /home/httpd/html/test.php
```

## 📊 Monitoramento Pós-Correção

### Scripts de Verificação
```bash
#!/bin/bash
# check-portal.sh

echo "=== VERIFICAÇÃO DO PORTAL ==="
echo "Data: $(date)"

# Teste SSL
echo "1. SSL Certificate:"
echo | openssl s_client -connect portal.imobiliariaipe.com.br:443 -servername portal.imobiliariaipe.com.br 2>/dev/null | openssl x509 -noout -subject -dates

# Teste HTTP
echo "2. HTTP Response:"
curl -I https://portal.imobiliariaipe.com.br 2>/dev/null | head -3

# Verificar PHP
echo "3. PHP Status:"
curl -s "https://portal.imobiliariaipe.com.br/test.php" | grep -E "(PHP Version|System)" || echo "PHP não está funcionando"

echo "=== FIM DA VERIFICAÇÃO ==="
```

## 🚀 Plano de Migração (Longo Prazo)

### Fase 1: Estabilização
- [ ] Corrigir SSL e suPHP
- [ ] Implementar monitoramento
- [ ] Backup completo do sistema legado

### Fase 2: Análise
- [ ] Inventário de funcionalidades do sistema legado
- [ ] Identificar dependências críticas
- [ ] Mapear usuários ativos

### Fase 3: Migração
- [ ] Replicar funcionalidades no novo sistema
- [ ] Migrar dados importantes
- [ ] Treinar usuários

### Fase 4: Descomissionamento
- [ ] Redirecionar tráfego
- [ ] Manter backup por período determinado
- [ ] Desligar servidor legado

## 📞 Contatos de Emergência

**Para problemas urgentes:**
- Provedor de hospedagem: [contato]
- Administrador de sistema: [contato]
- Suporte técnico: [contato]

## 📝 Checklist de Verificação

Após implementar as correções:

- [ ] Certificado SSL válido instalado para portal.imobiliariaipe.com.br
- [ ] HTTPS funciona sem avisos de segurança
- [ ] HTTP responde corretamente (status 200)
- [ ] Scripts PHP executam sem erro suPHP
- [ ] Logs de erro limpos
- [ ] Usuários conseguem acessar o sistema
- [ ] Funcionalidades principais operacionais

## 🔄 Rotina de Manutenção

**Diário:**
- Verificar logs de erro
- Testar acesso básico

**Semanal:**
- Verificar validade do certificado SSL
- Backup incremental

**Mensal:**
- Backup completo
- Atualização de segurança
- Análise de performance