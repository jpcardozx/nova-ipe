# 🔧 GUIA: Corrigir Homepage Genérica

**Data:** 8 de outubro de 2025 - 02:48 AM
**Problema:** Site exibindo "User's blog" com tema Twenty Sixteen
**Causa:** Tema errado ativo + Homepage configurada como blog

---

## 🎯 CORREÇÃO PASSO A PASSO

### **PASSO 1: Acessar wp-admin**

```
URL: http://13.223.237.99/wp-admin
Login: jpcardozo
Senha: Ipe@10203040
```

---

### **PASSO 2: Verificar e Ativar Tema Correto**

#### 2.1 - Ir em Aparência → Temas

No menu lateral esquerdo:
1. Clique em **"Aparência"**
2. Clique em **"Temas"**

#### 2.2 - Identificar o Tema da Imobiliária

**Procure por:**
- Nome que mencione "IPE", "Imobiliária", "Real Estate"
- Qualquer tema que **NÃO SEJA**:
  - Twenty Sixteen
  - Twenty Twenty-One
  - Twenty Twenty-Two
  - Twenty Twenty-Three
  - Twenty Twenty-Four

#### 2.3 - Ativar o Tema Correto

1. Passe o mouse sobre o tema da imobiliária
2. Clique em **"Ativar"**

**⚠️ SE NÃO HOUVER TEMA CUSTOMIZADO:**
- O tema da imobiliária pode não ter sido migrado
- **Me avise imediatamente** para investigarmos

---

### **PASSO 3: Configurar Página Inicial Estática**

#### 3.1 - Ir em Configurações → Leitura

No menu lateral esquerdo:
1. Clique em **"Configurações"**
2. Clique em **"Leitura"**

#### 3.2 - Alterar para "Uma página estática"

**Você verá:**
```
Sua página inicial exibe
  ○ Suas últimas postagens  [ESTÁ MARCADO ERRADO]
  ○ Uma página estática
```

**Faça:**
1. Marque: **"Uma página estática"**
2. No dropdown **"Página inicial"**, selecione:
   - "Home" ou
   - "Inicial" ou
   - "Página Principal" ou
   - Qualquer página que pareça ser a homepage

#### 3.3 - Salvar

1. Role até o final da página
2. Clique em **"Salvar alterações"**

---

### **PASSO 4: Atualizar Permalinks**

#### 4.1 - Ir em Configurações → Links Permanentes

No menu lateral esquerdo:
1. Clique em **"Configurações"**
2. Clique em **"Links Permanentes"**

#### 4.2 - Salvar (sem alterar nada)

1. **NÃO MUDE NADA**
2. Role até o final
3. Clique em **"Salvar alterações"**

Isso regenera o `.htaccess` e atualiza as regras de rewrite.

---

### **PASSO 5: Verificar WPL**

#### 5.1 - Ir em Plugins → Plugins instalados

No menu lateral esquerdo:
1. Clique em **"Plugins"**
2. Clique em **"Plugins instalados"**

#### 5.2 - Verificar WPL

**Procure por:**
- "Real Estate Listing - Realtyna WPL"

**Deve estar:**
- ✅ **Ativo** (escrito em azul)

**Se estiver "Inativo":**
1. Clique em **"Ativar"**

---

### **PASSO 6: Testar**

#### 6.1 - Abrir Homepage

Abra uma nova aba e acesse:
```
http://13.223.237.99/
```

**O que esperar:**
- ✅ Título correto da imobiliária (não "User's blog")
- ✅ Layout do tema customizado
- ✅ Conteúdo da página inicial

**Se ainda aparecer "User's blog":**
- Limpe o cache do navegador (Ctrl + F5)
- Tente navegador anônimo

---

## 📸 ME ENVIE PRINTS

Preciso que você tire prints e me mostre:

### Print 1: Temas Disponíveis
```
Aparência → Temas
```
**Mostre:** Todos os temas listados

### Print 2: Páginas Criadas
```
Páginas → Todas as Páginas
```
**Mostre:** Lista de todas as páginas

### Print 3: Configuração de Leitura
```
Configurações → Leitura
```
**Mostre:** Como está configurado "Sua página inicial exibe"

---

## 🚨 PROBLEMAS POSSÍVEIS

### Problema 1: Não há tema customizado

**Sintoma:**
- Só aparece Twenty Sixteen e outros temas padrão

**Causa:**
- Tema da imobiliária não foi migrado do servidor antigo

**Solução:**
- Eu preciso acessar o servidor Locaweb antigo
- Fazer download do tema
- Subir para o Lightsail

---

### Problema 2: Não há páginas criadas

**Sintoma:**
- Em "Páginas → Todas as Páginas" só aparece "Sample Page"

**Causa:**
- Páginas não foram migradas

**Solução:**
- Verificar se páginas foram importadas no database
- Pode precisar reimportar do backup

---

### Problema 3: Homepage mostra erro 404

**Sintoma:**
- Após configurar página estática, homepage dá 404

**Causa:**
- Permalinks não regenerados corretamente

**Solução:**
- Ir em Configurações → Links Permanentes → Salvar novamente
- Verificar se .htaccess tem permissão de escrita

---

## 📊 DIAGNÓSTICO ATUAL

### O que está CERTO:
- ✅ WordPress funcionando
- ✅ Login funcionando
- ✅ Plugin WPL ativo
- ✅ 761 imóveis no database
- ✅ 4.2GB de imagens migradas

### O que está ERRADO:
- ❌ Tema Twenty Sixteen (genérico) ativo
- ❌ Homepage configurada como "posts" (blog)
- ❌ Título "User's blog" (padrão WordPress)

---

## ✅ APÓS CORREÇÃO, DEVE APARECER:

```
- Título: "Imobiliária IPE" (ou similar)
- Layout: Design customizado da imobiliária
- Conteúdo: Página inicial com busca de imóveis
- Menu: Menu personalizado do site
- WPL: Imóveis listados
```

---

## 🆘 SE NÃO CONSEGUIR

Me avise em qual passo travou e envie:
1. Print da tela
2. Mensagem de erro (se houver)
3. O que você viu de diferente

Eu te ajudo a resolver!

---

**⏱ Tempo estimado:** 5-10 minutos

**Comece agora! 🚀**
