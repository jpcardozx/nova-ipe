# Configuração do Facebook App ID

## Problema Resolvido

✅ **Missing Properties: fb:app_id** - O erro foi corrigido adicionando o fb:app_id ao metadata

## Como Obter seu Facebook App ID Real

### 1. Acesse o Facebook Developers

- Vá para: https://developers.facebook.com/
- Faça login com sua conta Facebook

### 2. Crie um Novo App

- Clique em "Meus Apps" > "Criar App"
- Escolha "Consumidor" ou "Empresa" conforme seu caso
- Nome do app: "Ipê Imóveis"
- Email de contato: seu email

### 3. Configure o App

- Na dashboard do app, você verá o **App ID** no topo
- Copie este número (ex: 1234567890123456)

### 4. Substitua no Código

- Abra `app/metadata.tsx`
- Encontre a linha: `'fb:app_id': '1234567890123456',`
- Substitua pelo seu App ID real

### 5. Configure Domínios

- No painel do Facebook App
- Vá em "Configurações" > "Básico"
- Adicione seus domínios:
  - `ipeimoveis.vercel.app`
  - `localhost` (para desenvolvimento)

## Benefícios

- ✅ Compartilhamento otimizado no Facebook
- ✅ Analytics do Facebook funcionando
- ✅ Preview correto do banner social
- ✅ Sem mais warnings de propriedades ausentes

## Arquivo Atual

O arquivo `app/metadata.tsx` já está configurado com um placeholder. Apenas substitua pelo ID real quando obtê-lo.
