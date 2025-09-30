# 🔍 Guia Específico: Painel Locaweb - Onde Encontrar

## 📋 PASSO A PASSO NO PAINEL LOCAWEB:

### 1. Login no Painel
```
https://painel.locaweb.com.br
→ Inserir credenciais
→ Aguardar carregar dashboard
```

### 2. Localizar Gerenciador de Arquivos
```
PROCURE POR UMA DESTAS OPÇÕES:

🎯 NOMES COMUNS NO PAINEL:
- "Gerenciador de Arquivos"
- "File Manager" 
- "Arquivos do Site"
- "Hospedagem" → "Arquivos"
- "Sites" → "Gerenciar Arquivos"
- "FTP" → "Gerenciador Web"

📍 LOCALIZAÇÃO TÍPICA:
- Menu lateral esquerdo
- Seção "Hospedagem"
- Aba "Sites" ou "Domínios"
- Dashboard principal (ícone de pasta)
```

### 3. Navegar para WordPress
```
DENTRO DO GERENCIADOR DE ARQUIVOS:

🔍 PROCURE ESTAS PASTAS:
- public_html/
- www/
- html/  
- htdocs/
- [nome_do_dominio]/

🎯 CONFIRMAÇÃO:
Deve conter arquivos WordPress:
✅ index.php
✅ wp-config.php  
✅ wp-content/
✅ wp-admin/
✅ wp-includes/
```

### 4. Corrigir Permissões
```
SELEÇÃO:
- Ctrl+A (selecionar todos)
- Ou clicar na checkbox "Selecionar Todos"

AÇÃO:
- Botão direito → "Propriedades"
- Ou menu "Ções" → "Permissões"
- Ou ícone de "Configurações"

CONFIGURAR:
┌─────────────────────────────────────┐
│ Proprietário: [sua_conta_locaweb]   │
│ Grupo: [sua_conta_locaweb]          │
│ Permissões Diretórios: 755          │
│ Permissões Arquivos: 644            │
│ ☑️ Aplicar recursivamente            │
└─────────────────────────────────────┘
```

## 🔧 SE NÃO ENCONTRAR O GERENCIADOR:

### Opção A: Chat/Suporte Locaweb
```
No próprio painel procure:
- "Suporte" ou "Ajuda"
- "Chat Online"
- Pergunte: "Onde está o gerenciador de arquivos?"
```

### Opção B: Telefone Direto
```
📞 4004-4040
🗣️ "Preciso corrigir permissões suPHP do portal.imobiliariaipe.com.br"
⏱️ Eles resolvem em 5-10 minutos
```

### Opção C: SSH (Se disponível)
```bash
# Testar se SSH está habilitado:
ssh [sua_conta]@hm2662.locaweb.com.br

# Se funcionar, executar:
whoami
chown -R $(whoami):$(whoami) /home/httpd/html/
find /home/httpd/html/ -type d -exec chmod 755 {} \;
find /home/httpd/html/ -type f -name "*.php" -exec chmod 644 {} \;
```

## 🎯 CONFIRMAÇÃO FINAL:

### Após qualquer correção, teste:
```bash
curl -I http://portal.imobiliariaipe.com.br
```

### Resultado esperado:
```
HTTP/1.1 200 OK
Server: Apache
Content-Type: text/html
```

### Se der 200 OK:
✅ WordPress funcionando!
✅ Próximo passo: Implementar proxy SSL grátis