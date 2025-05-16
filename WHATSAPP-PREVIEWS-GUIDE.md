# Guia para Otimização de Links no WhatsApp - Nova Ipê Imobiliária

Este guia explica como configurar e usar as previews otimizadas para WhatsApp no site da Nova Ipê Imobiliária.

## O Problema Resolvido

Quando compartilhamos links do site no WhatsApp, às vezes eles não mostram previews adequadas, ou mostram apenas um carregamento contínuo sem exibir o conteúdo. As correções implementadas resolvem esses problemas.

## Como Funciona

### 1. Componentes Criados

Foram criados os seguintes componentes:

- **LoadingStateManager**: Remove o estado de carregamento da página
- **WhatsAppOptimizer**: Adiciona metatags específicas para WhatsApp
- **WhatsAppPreviewCard**: Gera cards de preview para links compartilhados

### 2. API Dinâmica para Imagens OG

Foi criada uma API para gerar imagens OG dinamicamente:

```
/api/og?title=Título&subtitle=Subtítulo&type=whatsapp
```

**Parâmetros**:
- `title`: Título principal da imagem
- `subtitle`: Subtítulo ou descrição
- `type`: Tipo de imagem (default, whatsapp, imovel)

### 3. Metatags Específicas para WhatsApp

O site agora inclui metatags específicas para o WhatsApp:

```html
<meta property="whatsapp:title" content="Título" />
<meta property="whatsapp:description" content="Descrição" />
<meta property="whatsapp:image" content="URL da imagem" />
<meta property="whatsapp:card" content="summary_large_image" />
```

## Como Usar nas Páginas

### Para Páginas Estáticas

Para páginas com conteúdo fixo, as metatags já estão configuradas no layout global.

### Para Páginas Dinâmicas (Imóveis, Blog, etc.)

1. Importe o componente `WhatsAppPreviewCard`:

```jsx
import WhatsAppPreviewCard from '../components/WhatsAppPreviewCard';
```

2. Use-o dentro da página, passando as propriedades:

```jsx
<WhatsAppPreviewCard 
  title="Título do Imóvel" 
  description="Descrição do imóvel" 
  imageUrl={`/api/og?title=${encodeURIComponent(titulo)}&type=whatsapp`} 
  imageAlt="Descrição da imagem" 
/>
```

## Testando as Previews

Para testar como as previews aparecerão no WhatsApp:

1. **Ambiente de Dev**: Abra `https://seusite.vercel.app/?debug=whatsapp` para simular a visualização do WhatsApp
2. **Teste Real**: Compartilhe o link em uma conversa privada do WhatsApp (com você mesmo) para ver como aparece
3. **Ferramenta externa**: Use [https://www.opengraph.xyz](https://www.opengraph.xyz) para verificar todas as metatags

## Solução de Problemas

Se as previews não estiverem aparecendo corretamente:

1. **Cache do WhatsApp**: O WhatsApp cacheia previews. Use um link com parâmetro para forçar atualização: `?v=123`
2. **Tamanho da imagem**: Para WhatsApp, prefira imagens mais quadradas (800x800) do que retangulares
3. **SSL/HTTPS**: Certifique-se que o site está usando HTTPS, caso contrário o WhatsApp não carrega as previews

## Otimizações Adicionais

- As imagens OG são geradas dinamicamente para cada conteúdo
- O carregamento da página foi otimizado para mostrar conteúdo mais rapidamente
- É feita detecção automática se o acesso vem do WhatsApp para otimizar a experiência
