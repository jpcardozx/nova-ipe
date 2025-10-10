# 🔍 Perguntas de Diagnóstico - Erro 500 WordPress

## ❓ Perguntas Críticas Sem Resposta:

### 1. **Por que FTP/SSH não aceitam as credenciais corretas?**
   - **Hipóteses:**
     - Credenciais FTP ≠ Credenciais fornecidas
     - Conta suspensa/bloqueada
     - Firewall bloqueando IP 179.218.19.62
     - Serviço FTP/SSH desabilitado no plano
   - **Como descobrir:**
     - Verificar painel Locaweb se conta está ativa
     - Verificar se há logs de tentativas bloqueadas
     - Testar de outro IP/rede (celular 4G)

### 2. **As credenciais do MySQL no wp-config.php estão corretas?**
   - **O que verificar:**
     - DB_HOST está como `wp_imobiliaria.mysql.dbaas.com.br`?
     - DB_USER está como `wp_imobiliaria`?
     - DB_PASSWORD está como `Ipe@5084`?
     - DB_NAME está como `wp_imobiliaria`?
   - **Como descobrir:**
     - Acessar wp-config.php de QUALQUER forma
     - Comparar com credenciais do painel MySQL

### 3. **O MySQL tem whitelist de IPs?**
   - **Possibilidade:**
     - DBaaS da Locaweb pode bloquear conexões externas
     - Apenas servidor web (187.45.193.173) pode conectar
   - **Como descobrir:**
     - Tentar conexão MySQL direta do nosso IP
     - Verificar painel MySQL → Configurações → IPs permitidos

### 4. **O banco de dados existe e está acessível?**
   - **Possibilidade:**
     - Banco foi deletado/corrompido
     - Usuário MySQL sem permissões
     - Serviço MySQL temporariamente down
   - **Como descobrir:**
     - Verificar painel MySQL da Locaweb
     - Verificar tamanho/status do banco

### 5. **Qual é o conteúdo EXATO do wp-config.php atual?**
   - **Precisamos ver:**
     - Linhas DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
     - Se tem algum prefixo de tabela customizado
     - Se tem configurações de charset incorretas
   - **Como descobrir:**
     - Acesso via qualquer método ao arquivo

### 6. **Por que WebFTP não aceita as credenciais?**
   - **Hipóteses:**
     - Credenciais WebFTP ≠ Credenciais FTP
     - Senha com caracteres especiais mal escapados
     - Sessão expirada/cookie
     - URL errada do WebFTP
   - **Como descobrir:**
     - Resetar senha no painel
     - Tentar em navegador anônimo
     - Verificar URL correta do WebFTP da Locaweb

### 7. **Existe algum .htaccess bloqueando conexões?**
   - **Possibilidade:**
     - .htaccess com regras que quebram DB connection
     - Limite de memória/timeout muito baixo
   - **Como descobrir:**
     - Baixar .htaccess por qualquer método
     - Procurar por php_value, deny from, etc.

### 8. **O PHP tem a extensão mysqli/mysql instalada?**
   - **Possibilidade:**
     - Extensão desabilitada após atualização
     - Versão PHP incompatível
   - **Como descobrir:**
     - Criar arquivo phpinfo.php e acessar
     - Verificar módulos carregados

### 9. **Há logs de erro PHP acessíveis publicamente?**
   - **Locais possíveis:**
     - `public_html/error_log`
     - `public_html/wp-content/debug.log`
     - `.cpanel/logs/` (se usar cPanel)
   - **Como descobrir:**
     - Tentar acessar diretamente via URL
     - Exemplo: `https://portal.imobiliariaipe.com.br/error_log`

### 10. **Existe um painel alternativo de acesso (cPanel, Plesk)?**
   - **Possibilidade:**
     - Locaweb pode ter cPanel/Plesk além do painel próprio
     - Porta 2083 (cPanel HTTPS) ou 2082 (cPanel HTTP)
   - **Como descobrir:**
     - Testar `https://187.45.193.173:2083`
     - Verificar documentação da hospedagem

---

## 🎯 Próximos Passos Priorizados:

1. **Testar acesso a logs públicos** (mais rápido, sem autenticação)
2. **Testar phpinfo.php** (se conseguirmos criar)
3. **Testar MySQL direto** (verificar whitelist)
4. **Resolver acesso FTP** (credenciais corretas)
5. **Acessar wp-config.php** (qualquer método)
