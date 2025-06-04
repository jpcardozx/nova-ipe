# Guia de Resolução de Problemas - Nova Ipê

Este documento fornece orientações para resolução de problemas comuns que podem surgir após a remediação arquitetural do projeto Nova Ipê.

## Erros Comuns e Soluções

### 1. Erros de TypeScript

**Problema**: Erros relacionados a propriedades ou tipos ausentes, especialmente em componentes como `PropertyCardUnified`.

**Solução**:

- Certifique-se de que todos os tipos estão sendo exportados corretamente nos arquivos de componentes
- Verifique se há inconsistências nas interfaces de propriedades
- Use `type` ou `interface` consistentemente para definições de tipo

**Exemplo de correção**:

```tsx
// Em PropertyCardUnified.tsx
export interface PropertyCardUnifiedProps {
  id: string;
  title: string;
  // Outras propriedades...
}

// Em outros arquivos
import type { PropertyCardUnifiedProps } from '@/components/ui/property/PropertyCardUnified';
```

### 2. Falhas na Estilização

**Problema**: Componentes não estilizados corretamente após a remoção de styled-components.

**Solução**:

- Consulte o guia CSS-CONSOLIDATION-GUIDE.md
- Verifique se as classes Tailwind estão sendo aplicadas corretamente
- Use a função `cn()` para condicionais de classes

**Exemplo de correção**:

```tsx
<div className={cn(
  "p-4 bg-white rounded-lg shadow",
  isActive && "ring-2 ring-primary",
  variant === "large" && "p-6"
)}>
```

### 3. Erros de Build

**Problema**: Falhas durante o processo de build.

**Solução**:

- Verifique se há importações de módulos removidos (webpack, styled-components)
- Execute `npm run typecheck` para identificar erros de tipos
- Verifique se o next.config.js está configurado corretamente

### 4. Problemas de Hidratação

**Problema**: Erros de hidratação no console como "Hydration failed because the initial UI...".

**Solução**:

- Verifique componentes que usam `useEffect` para manipulação do DOM
- Certifique-se de que o estado inicial do servidor é consistente com o cliente
- Use `useLayoutEffect` para operações DOM críticas

## Recursos de Referência

- [Documentação oficial do Next.js](https://nextjs.org/docs)
- [Guia Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion docs](https://www.framer.com/motion/)
- [Typescript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## Backups e Restauração

Caso seja necessário reverter para a configuração anterior:

1. Backups de arquivos importantes foram armazenados na raiz com extensão `.backup-[timestamp]`
2. Scripts e configurações originais foram arquivados em `/archive`
3. Para restaurar o next.config.js:
   ```
   copy next.config.backup-[timestamp].js next.config.js
   ```
4. Para restaurar o package.json:
   ```
   copy package.json.backup-[timestamp] package.json
   npm install
   ```
