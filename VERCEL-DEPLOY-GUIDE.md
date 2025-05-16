# Guia Rápido de Deploy na Vercel - Nova Ipê

Este guia contém instruções para fazer o deploy do site Nova Ipê na plataforma Vercel, resolvendo os problemas de importação, dependências nativas, carregamento contínuo e previews no WhatsApp.

## Problemas Resolvidos

✅ **Erros de path imports** - Corrigido substituindo imports absolutos por relativos
✅ **Dependências nativas (canvas)** - Implementado fallback para ambientes sem suporte a compilação nativa
✅ **Problemas de carregamento contínuo** - Adicionado timeout de segurança e otimizações CSS
✅ **Preview de links no WhatsApp** - Implementados metatags específicas e geração dinâmica de OG Images

## Opção 1: Deploy automático (recomendado)

Utilize o script de deploy automatizado que criamos para simplificar o processo:

```bash
npm run deploy
```

Este script fará:
1. Instalação das dependências
2. Geração de imagens OG de fallback
3. Teste de build local
4. Login na plataforma Vercel (se necessário)
5. Deploy para produção

## Opção 2: Deploy manual usando Vercel CLI

Se preferir fazer o deploy manualmente:

1. Certifique-se que a CLI da Vercel está instalada:
   ```bash
   npm install -g vercel
   ```

2. Faça login na sua conta Vercel:
   ```bash
   vercel login
   ```

3. Execute o deploy de produção:
   ```bash
   npm run deploy:prod
   ```

## Opção 3: Deploy via GitHub Integration

Para configurar um deploy automático a cada push:

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em "New Project" (Novo Projeto)
3. Importe o repositório do GitHub
4. Mantenha as configurações padrão (já temos o vercel.json configurado)
5. Clique em "Deploy"

## Configurações Aplicadas

Modificamos os seguintes arquivos para garantir um deploy correto:

- **vercel.json**: Otimizado para lidar com o ambiente Vercel
- **package.json**: Scripts específicos para build em produção
- **.npmrc**: Configuração para lidar com dependências nativas
- **jsconfig.json**: Configuração aprimorada de paths
- **Imports nos arquivos**: Corrigido caminhos de importação para usar caminho relativo

## Verificação Pós-Deploy

Após o deploy, verifique:

1. Se o site está acessível através da URL gerada pela Vercel
2. Se as imagens carregam corretamente
3. Se não há problemas de carregamento de componentes

## Solução de Problemas

Se encontrar problemas:

1. Verifique os logs de build na plataforma Vercel
2. Execute `npm run test:vercel-build` para testar o build localmente
3. Verifique se há erros de caminho nos imports (use paths relativos em vez de alias)
4. Verifique se o arquivo vercel.json está no formato correto

## Manutenção

Quando for necessário atualizar o site:

1. Faça suas alterações
2. Teste localmente com `npm run build`
3. Faça o commit das mudanças
4. Se configurado com integração GitHub, o deploy será automático
5. Caso contrário, execute `npm run deploy`

## Otimização para WhatsApp

Implementamos várias melhorias para garantir a correta exibição de links compartilhados no WhatsApp:

### 1. Componentes específicos

- `WhatsAppPreviewCard` - Gera metatags otimizadas para o WhatsApp
- `LoadingStateManager` - Resolve problemas de carregamento contínuo
- API `/api/og` - Gera imagens dinâmicas para previews

### 2. Metatags implementadas

```html
<meta property="whatsapp:title" content="Título do Imóvel" />
<meta property="whatsapp:description" content="Descrição do imóvel" />
<meta property="whatsapp:image" content="URL da imagem OG" />
<meta property="whatsapp:card" content="summary_large_image" />
```

### 3. Testando previews

Para testar as previews no WhatsApp:

1. Compartilhe o link em um chat privado do WhatsApp (exemplo com você mesmo)
2. Use o parâmetro `?v=123` para forçar a atualização do cache
3. Verifique se a imagem é exibida corretamente e se o título/descrição aparecem

### Mais detalhes

Consulte o arquivo `WHATSAPP-PREVIEWS-GUIDE.md` para mais informações sobre as otimizações de WhatsApp.
