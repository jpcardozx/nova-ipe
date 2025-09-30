# 🔧 Guia FileZilla: Correção do Portal WordPress

## 📋 Configuração FileZilla

### Dados de Conexão Locaweb:
```
Servidor: ftp.imobiliariaipe.com.br
ou: portal.imobiliariaipe.com.br
Porta: 21
Tipo: FTP normal
Usuário: [sua conta locaweb]
Senha: [sua senha locaweb]
```

## 🎯 Passo a Passo - Correção de Permissões

### 1. Conectar ao FTP
- Abra FileZilla
- Arquivo → Gerenciador de Sites
- Nova entrada: "Portal IPÊ - Locaweb"
- Preencha dados acima
- Conectar

### 2. Navegar para Diretório Correto
```
Procure por uma dessas pastas:
📁 /public_html/
📁 /www/
📁 /html/
📁 / (raiz)

Deve conter arquivos WordPress:
- index.php
- wp-config.php
- wp-content/
- wp-admin/
```

### 3. Corrigir Permissões (CRÍTICO)
```
Selecionar TODOS os arquivos (Ctrl+A)
Botão direito → "Permissões de arquivo..."

CONFIGURAR:
┌─────────────────────────────────────┐
│ Tipo           │ Permissão │ Octal │
├─────────────────────────────────────┤
│ 📁 Diretórios  │ rwxr-xr-x │  755  │
│ 📄 Arquivos    │ rw-r--r-- │  644  │
│ 🔒 wp-config   │ rw-------  │  600  │
└─────────────────────────────────────┘

✅ Marcar: "Aplicar a diretórios"
✅ Marcar: "Aplicar a arquivos"
✅ Marcar: "Recursivo"
```

### 4. Teste Imediato
Após aplicar permissões:
http://portal.imobiliariaipe.com.br
Deve carregar o WordPress! 🎉

## ⚠️ Problemas Comuns FileZilla:

### Erro: "Conexão recusada"
```
Tente portas alternativas:
- Porta 21 (FTP)
- Porta 22 (SFTP)
- Porta 990 (FTPS)
```

### Erro: "Login incorreto"
```
Verificar:
- Usuário = nome da conta Locaweb
- Senha = senha do painel Locaweb
- Domínio correto no servidor
```

### Não encontra arquivos WordPress
```
Navegar em:
- Clique duplo nas pastas
- Procure por "index.php"
- Se estiver vazio, WordPress pode estar em subpasta
```