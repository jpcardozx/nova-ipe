# Guia para Resolução dos Problemas Críticos (Maio de 2025)

## Problemas Identificados e Soluções

### 1. Conflito entre Server Components e Client Components

**Problema**: Tentativa de importar diretamente Server Components em Client Components, o que não é suportado pela arquitetura do Next.js 15+.

**Solução**:

- Criamos adaptadores client-side em `app/components/client/PropertyShowcaseAdapter.tsx`
- Estes adaptadores criam contêineres com IDs específicos (`properties-sale-container`, `properties-rental-container`)
- Na página Server Component (`page.tsx`), renderizamos os componentes de servidor reais com os mesmos IDs

**Implementação**:

```jsx
// No client component (page-consolidated.tsx)
import { PropertiesSaleAdapter } from './components/client/PropertyShowcaseAdapter';

// Uso
<PropertiesSaleAdapter />;

// No server component (page.tsx)
import { PropertiesSale } from './components/server/PropertyShowcaseServer';

// Uso
<section id="properties-sale-container">
  <PropertiesSale />
</section>;
```

### 2. Configuração Experimental Incompatível com Next.js Stable

**Problema**: Uso de recursos experimentais como `ppr: 'incremental'` que são exclusivos para versões canary do Next.js.

**Solução**:

- Comentamos a linha `ppr: 'incremental'` no arquivo `next.config.js`
- Optamos por manter a versão estável do Next.js (15.2.4) em vez de migrar para canary

### 3. Erros de Validação TypeScript

**Problema**: Erros de tipo devido a declarações implícitas de parâmetros e propriedades.

**Solução**:

- Adicionamos interfaces explícitas para todos os componentes
- Adicionamos tipagem em parâmetros de função
- Resolvemos avisos de TypeScript relacionados a tipos `any` implícitos

### 4. Problemas de Instrumentação OpenTelemetry

**Problema**: Configuração OpenTelemetry causando erros quando o endpoint não está configurado.

**Solução**:

- Garantimos verificações adequadas antes de inicializar o SDK do OpenTelemetry
- Adicionamos tratamento de erros robusto
- Desabilitamos instrumentações pesadas em ambiente de desenvolvimento

### 5. Error Boundaries Aprimorados

**Problema**: Implementação incompleta de error boundaries para recuperação de falhas.

**Solução**:

- Aprimoramos o componente `SafeComponent` com opções de recuperação
- Adicionamos integração com serviços de analytics (Google Analytics, Sentry)
- Implementamos fallbacks mais informativos e com opção de recarregamento

## Padrões Recomendados

### 1. Divisão Client/Server

```jsx
// ❌ ERRADO: importar server components em client components
'use client';
import { ServerComponent } from './ServerComponent';

// ✅ CERTO: criar adaptadores client para server components
('use client');
export function ServerComponentAdapter() {
  return <div id="server-component-container"></div>;
}

// E na página server component:
import { ServerComponent } from './ServerComponent';

export default function Page() {
  return (
    <div id="server-component-container">
      <ServerComponent />
    </div>
  );
}
```

### 2. Tratamento de Erros

```jsx
// ❌ ERRADO: sem tratamento de erros
function RiskyComponent() {
  // código que pode falhar
}

// ✅ CERTO: uso de SafeComponent
import { SafeComponent } from './components/ui/ErrorBoundary';

function App() {
  return (
    <SafeComponent>
      <RiskyComponent />
    </SafeComponent>
  );
}
```

### 3. Validação de Tipo

```tsx
// ❌ ERRADO: sem tipagem
function Component(props) {
  // ...
}

// ✅ CERTO: com tipagem explícita
interface ComponentProps {
  name: string;
  count: number;
  optional?: boolean;
}

function Component({ name, count, optional = false }: ComponentProps) {
  // ...
}
```

## Próximos Passos

1. **Validação Completa**: Executar verificação TypeScript em todo o projeto
2. **Revisão de Server/Client**: Verificar todas as importações para garantir a separação correta
3. **Testes de Performance**: Comparar o desempenho antes e depois das alterações
4. **Monitoramento**: Implementar monitoramento para detectar falhas em produção

## Estratégia para Migrações Futuras

Para futuras atualizações do Next.js e React, recomendamos:

1. Criar branches de teste para experimentar recursos canary
2. Documentar dependências que podem ter problemas de compatibilidade
3. Manter um arquivo de diagnóstico atualizado com padrões de problemas conhecidos
4. Implementar testes automatizados para garantir que as migrações não quebrem funcionalidades
