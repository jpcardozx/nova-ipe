# Resolução de problemas com source maps do lucide-react

Este documento descreve as soluções implementadas para resolver os erros de build relacionados aos source maps do pacote `lucide-react`.

## Problema

Durante o build de produção, o webpack tenta processar arquivos `.map` do pacote `lucide-react`, resultando em erros como:

```
Module parse failed: Unexpected token (1:10)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file.
```

## Solução implementada

Implementamos diversas camadas de solução para garantir que o build funcione corretamente:

### 1. Script de pré-build

Criamos um script `scripts/fix-sourcemaps.js` que é executado automaticamente antes do build para:
- Localizar arquivos `.map` problemáticos
- Substituí-los com arquivos vazios `{}`

### 2. Configuração do webpack

Em `webpack.sourcemap.config.js`, implementamos regras para:
- Ignorar arquivos `.map` durante o build
- Remover referências a source maps nos arquivos JavaScript

### 3. Sistema de fallback para ícones

Implementamos:
- `app/utils/icon-fallbacks.tsx`: versões simplificadas dos ícones mais usados
- `app/utils/icons/index.tsx`: sistema de carregamento dinâmico com fallback
- `app/components/SafeIcon.tsx`: componente resiliente para uso em toda a aplicação

### 4. Configuração do Vercel

Configuramos o `vercel.json` para:
- Usar o comando `vercel-build` que inclui a etapa de correção
- Definir headers apropriados para arquivos `.map`

## Como usar

### Importação segura de ícones

```tsx
// Método recomendado - importação do sistema seguro
import { Home, User, Menu } from '@/app/utils/icons';

function MyComponent() {
  return (
    <div>
      <Home size={24} />
      <User color="#333" />
      <Menu />
    </div>
  );
}
```

### Importação dinâmica segura

```tsx
// Para ícones menos comuns, use o componente Icon
import { Icon } from '@/app/utils/icons';

function MyComponent() {
  return (
    <div>
      <Icon name="AlertCircle" size={24} />
      <Icon name="Calendar" color="red" />
    </div>
  );
}
```

## Manutenção futura

Caso precise adicionar mais ícones ao sistema de fallback:

1. Adicione o SVG no arquivo `app/utils/icon-fallbacks.tsx`
2. Exporte o ícone em `app/utils/icons/index.tsx`

## Considerações

Esta solução foi desenvolvida para o build na Vercel. Se estiver enfrentando problemas em outros ambientes, ajuste conforme necessário.

---

**Data de implementação:** 19/05/2025  
**Desenvolvido por:** Equipe Nova Ipê
