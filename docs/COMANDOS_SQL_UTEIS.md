# 🗄️ Comandos SQL Úteis - WordPress Imobiliária IPE

**Banco:** wp_imobiliaria  
**Host:** wp_imobiliaria.mysql.dbaas.com.br  
**Status:** ✅ Online e funcional

---

## 🔐 CONECTAR AO BANCO:

```bash
mysql -h wp_imobiliaria.mysql.dbaas.com.br \
      -u wp_imobiliaria \
      -p'Ipe@5084' \
      wp_imobiliaria
```

---

## 📊 ESTATÍSTICAS DO SITE:

### Total de Propriedades
```sql
SELECT COUNT(*) as total_propriedades 
FROM wp_wpl_properties;
```
**Resultado atual:** 761 propriedades

### Total de Posts Publicados
```sql
SELECT COUNT(*) as total_posts 
FROM wp_posts 
WHERE post_status = 'publish' 
  AND post_type = 'post';
```
**Resultado atual:** 34 posts

### Total de Páginas
```sql
SELECT COUNT(*) as total_paginas 
FROM wp_posts 
WHERE post_status = 'publish' 
  AND post_type = 'page';
```

### Total de Usuários
```sql
SELECT COUNT(*) as total_usuarios 
FROM wp_users;
```

---

## 👤 GERENCIAMENTO DE USUÁRIOS:

### Listar Todos os Usuários
```sql
SELECT ID, user_login, user_email, user_registered 
FROM wp_users 
ORDER BY ID;
```

### Ver Detalhes do Admin
```sql
SELECT u.ID, u.user_login, u.user_email, u.user_registered,
       (SELECT meta_value FROM wp_usermeta 
        WHERE user_id = u.ID AND meta_key = 'wp_capabilities') as roles
FROM wp_users u
WHERE ID = 1;
```

### Resetar Senha do Admin (EMERGÊNCIA)
```sql
-- Gera senha: NovaSenh@123
UPDATE wp_users 
SET user_pass = MD5('NovaSenh@123') 
WHERE ID = 1;
```

⚠️ **ATENÇÃO:** Isso é MD5 (inseguro). O WordPress vai rehash na primeira vez que logar.

### Criar Novo Usuário Admin
```sql
-- Inserir usuário
INSERT INTO wp_users (user_login, user_pass, user_nicename, user_email, user_registered) 
VALUES ('emergencia', MD5('Senha@Temp123'), 'emergencia', 'seu@email.com', NOW());

-- Pegar o ID do novo usuário
SET @user_id = LAST_INSERT_ID();

-- Dar permissões de admin
INSERT INTO wp_usermeta (user_id, meta_key, meta_value) 
VALUES 
  (@user_id, 'wp_capabilities', 'a:1:{s:13:"administrator";b:1;}'),
  (@user_id, 'wp_user_level', '10');
```

---

## 🏢 PROPRIEDADES IMOBILIÁRIAS (WPL):

### Listar Últimas 10 Propriedades
```sql
SELECT id, location_text as endereco, bedroom, bathroom, price 
FROM wp_wpl_properties 
ORDER BY id DESC 
LIMIT 10;
```

### Propriedades por Tipo
```sql
SELECT 
    pt.name as tipo,
    COUNT(p.id) as quantidade
FROM wp_wpl_properties p
LEFT JOIN wp_wpl_property_types pt ON p.property_type = pt.id
GROUP BY pt.name
ORDER BY quantidade DESC;
```

### Propriedades por Cidade
```sql
SELECT 
    location2_name as cidade,
    COUNT(*) as quantidade
FROM wp_wpl_properties
WHERE location2_name IS NOT NULL
GROUP BY location2_name
ORDER BY quantidade DESC
LIMIT 20;
```

### Propriedades com Preços
```sql
SELECT 
    id,
    location_text as endereco,
    bedroom as quartos,
    price as preco,
    (SELECT name FROM wp_wpl_property_types WHERE id = property_type) as tipo
FROM wp_wpl_properties
WHERE price > 0
ORDER BY price DESC
LIMIT 20;
```

---

## 🔧 CONFIGURAÇÕES DO SITE:

### Ver URL do Site
```sql
SELECT option_value as url_site 
FROM wp_options 
WHERE option_name = 'siteurl';
```
**Deve retornar:** `https://portal.imobiliariaipe.com.br`

### Mudar URL do Site (se necessário)
```sql
UPDATE wp_options 
SET option_value = 'https://portal.imobiliariaipe.com.br' 
WHERE option_name IN ('siteurl', 'home');
```

### Ver Tema Ativo
```sql
SELECT option_value as tema_ativo 
FROM wp_options 
WHERE option_name = 'template';
```
**Resultado atual:** ipeimoveis

### Ver Plugins Ativos
```sql
SELECT option_value 
FROM wp_options 
WHERE option_name = 'active_plugins';
```

### Desativar TODOS os Plugins (troubleshooting)
```sql
UPDATE wp_options 
SET option_value = 'a:0:{}' 
WHERE option_name = 'active_plugins';
```

### Mudar para Tema Padrão (troubleshooting)
```sql
UPDATE wp_options 
SET option_value = 'twentytwentyone' 
WHERE option_name IN ('template', 'stylesheet');
```

---

## 📧 CONTATOS/FORMULÁRIOS:

### Listar Posts de Contato (se usar Contact Form 7)
```sql
SELECT * 
FROM wp_posts 
WHERE post_type = 'wpcf7_contact_form' 
  AND post_status = 'publish';
```

---

## 🧹 LIMPEZA/MANUTENÇÃO:

### Limpar Revisões de Posts
```sql
DELETE FROM wp_posts 
WHERE post_type = 'revision';
```

### Limpar Rascunhos Antigos
```sql
DELETE FROM wp_posts 
WHERE post_status = 'auto-draft' 
  AND post_modified < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

### Limpar Comentários Spam
```sql
DELETE FROM wp_comments 
WHERE comment_approved = 'spam';
```

### Limpar Transientes Expirados
```sql
DELETE FROM wp_options 
WHERE option_name LIKE '_transient_timeout_%' 
  AND option_value < UNIX_TIMESTAMP();

DELETE FROM wp_options 
WHERE option_name LIKE '_transient_%' 
  AND option_name NOT LIKE '_transient_timeout_%' 
  AND option_name NOT IN (
    SELECT CONCAT('_transient_', SUBSTRING(option_name, 20))
    FROM wp_options
    WHERE option_name LIKE '_transient_timeout_%'
  );
```

---

## 🔍 DIAGNÓSTICO:

### Tamanho das Tabelas
```sql
SELECT 
    table_name AS tabela,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS tamanho_mb,
    table_rows AS linhas
FROM information_schema.TABLES
WHERE table_schema = 'wp_imobiliaria'
ORDER BY (data_length + index_length) DESC;
```

### Verificar Integridade das Tabelas
```sql
SELECT 
    COUNT(*) as total_tabelas,
    SUM(table_rows) as total_registros
FROM information_schema.TABLES
WHERE table_schema = 'wp_imobiliaria';
```

### Posts por Status
```sql
SELECT 
    post_status,
    post_type,
    COUNT(*) as quantidade
FROM wp_posts
GROUP BY post_status, post_type
ORDER BY quantidade DESC;
```

---

## 🚨 EMERGÊNCIAS:

### Habilitar Debug Mode (via SQL)
```sql
-- Não recomendado fazer via SQL, mas em emergência:
-- Editar wp-config.php é melhor, mas se não tiver acesso:
SELECT 'Edit wp-config.php manually to add:' as instrucao,
       "define('WP_DEBUG', true);" as codigo;
```

### Verificar se há Backups de Config
```sql
-- Procurar por opções de backup
SELECT option_name, option_value 
FROM wp_options 
WHERE option_name LIKE '%backup%' 
   OR option_name LIKE '%config%'
LIMIT 20;
```

---

## 📊 RELATÓRIOS:

### Atividade Recente de Usuários
```sql
SELECT 
    u.user_login,
    MAX(p.post_modified) as ultima_atividade
FROM wp_users u
LEFT JOIN wp_posts p ON u.ID = p.post_author
GROUP BY u.user_login
ORDER BY ultima_atividade DESC;
```

### Propriedades Mais Recentes
```sql
SELECT 
    id,
    location_text as endereco,
    price as preco,
    FROM_UNIXTIME(add_date) as data_cadastro
FROM wp_wpl_properties
ORDER BY add_date DESC
LIMIT 10;
```

---

## 💾 BACKUP VIA SQL:

### Exportar Estrutura Completa
```bash
mysqldump -h wp_imobiliaria.mysql.dbaas.com.br \
          -u wp_imobiliaria \
          -p'Ipe@5084' \
          wp_imobiliaria > backup_$(date +%Y%m%d).sql
```

### Exportar Apenas Dados (sem estrutura)
```bash
mysqldump -h wp_imobiliaria.mysql.dbaas.com.br \
          -u wp_imobiliaria \
          -p'Ipe@5084' \
          --no-create-info \
          wp_imobiliaria > dados_$(date +%Y%m%d).sql
```

### Exportar Apenas uma Tabela
```bash
mysqldump -h wp_imobiliaria.mysql.dbaas.com.br \
          -u wp_imobiliaria \
          -p'Ipe@5084' \
          wp_imobiliaria wp_wpl_properties > propriedades_backup.sql
```

---

## 🎯 QUERIES ÚTEIS PÓS-MIGRAÇÃO:

### Corrigir URLs após Mudança de Domínio
```sql
-- Substituir URLs antigos por novos
UPDATE wp_posts 
SET post_content = REPLACE(post_content, 
    'http://old-domain.com', 
    'https://portal.imobiliariaipe.com.br');

UPDATE wp_postmeta 
SET meta_value = REPLACE(meta_value, 
    'http://old-domain.com', 
    'https://portal.imobiliariaipe.com.br');

UPDATE wp_options 
SET option_value = REPLACE(option_value, 
    'http://old-domain.com', 
    'https://portal.imobiliariaipe.com.br');
```

---

## 📝 NOTAS:

- ⚠️ **Sempre faça backup antes de UPDATE/DELETE**
- ✅ **Banco está em servidor externo, sem whitelist de IP**
- 🔐 **Credenciais funcionam de qualquer lugar**
- 📊 **761 propriedades estão íntegras e prontas para uso**

---

*Para executar estes comandos, você precisa de acesso ao terminal ou ferramentas como phpMyAdmin/MySQL Workbench*
