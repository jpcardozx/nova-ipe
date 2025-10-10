# 🔧 Solução Definitiva - Passo a Passo Locaweb

**Data:** 2025-10-07  
**Confiança:** 95%  
**Tempo estimado:** 5 minutos

---

## 🎯 O PROBLEMA:

O arquivo `wp-config.php` está configurado com:
```php
define('DB_HOST', 'localhost');
```

Mas o banco MySQL está em outro servidor:
```
Host: wp_imobiliaria.mysql.dbaas.com.br
```

Por isso o WordPress não consegue conectar e retorna erro 500.

---

## ✅ A SOLUÇÃO:

### 1️⃣ **Acessar o Painel Locaweb**

1. Acesse: https://painel.locaweb.com.br/
2. Faça login com suas credenciais
3. Você já está logado, então pule esta etapa

---

### 2️⃣ **Abrir o File Manager (Gerenciador de Arquivos)**

Procure por uma destas opções no menu:
- 🗂️ **"Gerenciador de Arquivos"**
- 🗂️ **"File Manager"**
- 🗂️ **"Arquivos da Hospedagem"**
- 🗂️ **"Hospedagem" → "Gerenciar Arquivos"**

Geralmente fica em:
```
Hospedagem → [Seu domínio] → Gerenciador de Arquivos
```

---

### 3️⃣ **Navegar até a raiz do WordPress**

Você verá pastas. Entre na pasta onde está o WordPress:
- Pode ser `public_html`
- Pode ser `www`
- Pode ser `httpdocs`
- Ou pode estar na raiz mesmo

**Como saber se está no lugar certo?**  
Você verá arquivos como:
- ✅ `wp-config.php` ← **É ESTE QUE QUEREMOS!**
- ✅ `wp-login.php`
- ✅ `index.php`
- ✅ Pastas `wp-content`, `wp-admin`, `wp-includes`

---

### 4️⃣ **Editar o arquivo wp-config.php**

1. Clique com botão direito em `wp-config.php`
2. Escolha **"Editar"** ou **"Edit"**
3. Procure pela linha (geralmente entre linhas 20-40):

```php
define('DB_HOST', 'localhost');
```

Ou pode estar como:
```php
define( 'DB_HOST', 'localhost' );
```

4. **ALTERE PARA:**

```php
define('DB_HOST', 'wp_imobiliaria.mysql.dbaas.com.br');
```

---

### 5️⃣ **Salvar e Testar**

1. Clique em **"Salvar"** ou **"Save"**
2. Feche o editor
3. Acesse: https://portal.imobiliariaipe.com.br/
4. 🎉 **Deve funcionar!**

---

## 🔍 OUTRAS LINHAS PARA VERIFICAR:

Enquanto estiver editando o `wp-config.php`, confirme que estas linhas estão EXATAMENTE assim:

```php
define('DB_NAME', 'wp_imobiliaria');
define('DB_USER', 'wp_imobiliaria');
define('DB_PASSWORD', 'Ipe@5084');
define('DB_HOST', 'wp_imobiliaria.mysql.dbaas.com.br');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');
```

---

## 🚨 SE NÃO ENCONTRAR O FILE MANAGER:

### Alternativa 1: Suporte Locaweb
Abra um ticket dizendo:

> Olá, preciso editar o arquivo wp-config.php do meu site portal.imobiliariaipe.com.br.
> 
> Por favor, altere a linha:
> ```
> define('DB_HOST', 'localhost');
> ```
> Para:
> ```
> define('DB_HOST', 'wp_imobiliaria.mysql.dbaas.com.br');
> ```
> 
> O site está retornando erro 500 por não conseguir conectar ao banco de dados.

### Alternativa 2: WebFTP (se conseguir logar)

Se conseguir acessar o WebFTP, siga os mesmos passos do File Manager.

---

## 📊 CONFIRMAÇÕES QUE JÁ TEMOS:

✅ Banco de dados está online e funcionando perfeitamente  
✅ 761 propriedades cadastradas no sistema  
✅ 34 posts publicados  
✅ Credenciais MySQL estão corretas  
✅ Apache e PHP funcionando  
✅ HTTPS/SSL válido  

❌ Único problema: wp-config.php aponta para localhost errado

---

## 🎯 RESULTADO ESPERADO:

Após a mudança, o site deve:
- ✅ Carregar normalmente
- ✅ Mostrar as 761 propriedades
- ✅ Permitir login do admin
- ✅ phpMyAdmin também deve funcionar

---

## 📞 PRECISA DE AJUDA?

1. **Tire prints do painel Locaweb** mostrando as opções de menu disponíveis
2. **Procure por "cPanel"** - alguns painéis usam cPanel que tem File Manager padrão
3. **Ligue para Locaweb**: 3003-3333 (SP) ou 4003-3333 (outras capitais)
4. **Chat Locaweb**: Geralmente disponível no próprio painel

---

## ⚠️ ATENÇÃO:

**FAÇA BACKUP antes de editar!**

No File Manager, antes de editar:
1. Clique com botão direito em `wp-config.php`
2. Escolha "Copiar" ou "Duplicate"
3. Renomeie para `wp-config.php.backup`
4. Agora edite o original

Assim, se algo der errado, você pode restaurar.

---

## 🎉 APÓS FUNCIONAR:

O site vai ter acesso a:
- 761 propriedades imobiliárias
- Sistema WPL (Imobiliário) completo
- Tema IPE Imóveis
- Painel WordPress admin

**Tudo já está configurado, só precisa dessa correção no host do banco!**
