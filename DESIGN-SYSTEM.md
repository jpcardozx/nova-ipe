# Sistema de Design Nova Ipê

Este documento descreve o sistema de design utilizado no projeto Nova Ipê, incluindo cores, tipografia, espaçamento e componentes.

## Visão Geral

O sistema de design da Nova Ipê foi criado para garantir consistência visual e uma experiência de usuário de alta qualidade. Ele é baseado em princípios de:

- **Simplicidade**: Interfaces limpas e objetivas
- **Elegância**: Elementos visuais refinados que transmitem confiança
- **Responsividade**: Adaptação perfeita a todos os dispositivos
- **Acessibilidade**: Design inclusivo para todos os usuários

## 🎨 Cores

### Cores Primárias

| Nome           | Valor      | Uso                                      |
|----------------|------------|------------------------------------------|
| `brand-green`  | `#1a6f5c`  | Cor principal da marca, ações primárias  |
| `brand-dark`   | `#0D1F2D`  | Backgrounds e textos de destaque         |
| `accent-yellow`| `#ffcc00`  | Elementos de destaque e call-to-actions  |
| `brand-light`  | `#f8f4e3`  | Backgrounds e elementos sutis            |

### Cores Neutras

Uma escala de cinzas para textos, bordas e elementos secundários:

| Nome            | Uso                                       |
|-----------------|-------------------------------------------|
| `neutral-50`    | Backgrounds muito claros                  |
| `neutral-100`   | Backgrounds claros, hover states          |
| `neutral-200`   | Bordas e separadores leves                |
| `neutral-300`   | Bordas e elementos desabilitados          |
| `neutral-400`   | Textos muito claros                       |
| `neutral-500`   | Textos secundários                        |
| `neutral-600`   | Textos de médio contraste                 |
| `neutral-700`   | Textos de alto contraste                  |
| `neutral-800`   | Títulos e textos principais               |
| `neutral-900`   | Textos com máximo contraste               |

### Estados Funcionais

| Nome           | Valor      | Uso                                      |
|----------------|------------|------------------------------------------|
| `success`      | `#10b981`  | Mensagens de sucesso e confirmação       |
| `warning`      | `#f59e0b`  | Alertas e avisos                         |
| `error`        | `#ef4444`  | Erros e ações destrutivas                |
| `info`         | `#3b82f6`  | Informações e notificações               |

## 🔤 Tipografia

### Fontes

| Família        | Uso                                       |
|----------------|-------------------------------------------|
| `Montserrat`   | Fonte principal para textos e interface   |
| `Italiana`     | Fonte de display para títulos principais  |
| `Libre`        | Fonte para elementos de destaque          |

### Tamanhos

Escala tipográfica consistente para todo o projeto:

| Nome      | Tamanho    | Uso                                       |
|-----------|------------|-------------------------------------------|
| `xs`      | `0.75rem`  | Textos muito pequenos, legendas           |
| `sm`      | `0.875rem` | Textos pequenos, notas                    |
| `base`    | `1rem`     | Textos regulares, corpo principal         |
| `lg`      | `1.125rem` | Textos ligeiramente destacados            |
| `xl`      | `1.25rem`  | Subtítulos e destaques médios             |
| `2xl`     | `1.5rem`   | Títulos de seções menores                 |
| `3xl`     | `1.875rem` | Títulos de seções                         |
| `4xl`     | `2.25rem`  | Títulos principais                        |
| `5xl`     | `3rem`     | Títulos de página                         |
| `6xl`     | `4rem`     | Títulos heroicos                          |

## 📏 Espaçamento

Sistema de espaçamento consistente para margens, paddings e gaps:

| Nome      | Tamanho    | Uso                                       |
|-----------|------------|-------------------------------------------|
| `xs`      | `0.25rem`  | Espaçamento mínimo                        |
| `sm`      | `0.5rem`   | Espaçamento pequeno                       |
| `md`      | `1rem`     | Espaçamento padrão                        |
| `lg`      | `1.5rem`   | Espaçamento médio                         |
| `xl`      | `2rem`     | Espaçamento grande                        |
| `2xl`     | `3rem`     | Espaçamento maior                         |
| `3xl`     | `4rem`     | Espaçamento para seções                   |
| `4xl`     | `6rem`     | Espaçamento para seções grandes           |

## 🔲 Bordas e Cantos

| Nome          | Valor       | Uso                                      |
|---------------|-------------|------------------------------------------|
| `radius-sm`   | `0.125rem`  | Bordas sutilmente arredondadas           |
| `radius-md`   | `0.25rem`   | Arredondamento padrão                    |
| `radius-lg`   | `0.5rem`    | Arredondamento médio                     |
| `radius-xl`   | `1rem`      | Arredondamento grande                    |
| `radius-full` | `9999px`    | Elementos circulares (botões, badges)    |

## 🧩 Componentes Principais

### Botões

Variantes disponíveis:

- `default`: Botão principal com a cor da marca
- `secondary`: Botão secundário com menor destaque
- `outline`: Botão com contorno e fundo transparente
- `ghost`: Botão sem fundo e sem borda
- `link`: Botão que parece um link
- `destructive`: Para ações destrutivas
- `accent`: Botão com a cor de destaque

Tamanhos disponíveis:

- `xs`: Extra pequeno
- `sm`: Pequeno
- `default`: Tamanho padrão
- `lg`: Grande
- `xl`: Extra grande
- `icon`: Para botões com ícones

### Cards

Variantes disponíveis:

- `default`: Card padrão com sombra
- `outline`: Card com borda e sem sombra
- `flat`: Card sem sombra e sem borda
- `elevated`: Card com sombra mais pronunciada
- `premium`: Card especial com borda dourada

Exemplos de uso:

```tsx
<Card variant="premium" hover="scale">
  <CardHeader>
    <CardTitle>Imóvel em Destaque</CardTitle>
    <CardDescription>Condomínio exclusivo com vista para a serra</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Conteúdo do card */}
  </CardContent>
  <CardFooter>
    <CardBadge variant="success">Novo</CardBadge>
    <Button>Ver detalhes</Button>
  </CardFooter>
</Card>
```

### Carrosséis

Um componente de carrossel otimizado para exibir múltiplos itens:

```tsx
<Carousel 
  options={{ 
    slidesPerView: 1, 
    breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
    autoplay: true 
  }}
  title="Imóveis em Destaque"
>
  {/* Slides */}
</Carousel>
```

## 📝 Guia de Uso

Para utilizar o sistema de design:

1. **Cores e Tokens**: Use as variáveis CSS ou funções helper
   ```tsx
   <div className="bg-brand-green text-white">
   <div className="border-neutral-200">
   ```

2. **Funções Utilitárias**: Use as funções de utils.ts
   ```tsx
   import { cn, getThemeColor } from '@/lib/utils';
   
   <div className={cn('base-class', conditional && 'conditional-class')}>
   ```

3. **Componentes UI**: Importe dos diretórios apropriados
   ```tsx
   import { Button } from '@/components/ui/Button';
   import { Card } from '@/components/ui/data-display/Card';
   ```

## 📈 Melhores Práticas

- Prefira usar componentes do sistema em vez de criar novos
- Mantenha a consistência usando as variáveis de espaçamento e cores
- Use o Tailwind para estilos inline, mas extraia padrões recorrentes para componentes
- Ao adicionar um novo componente, documente-o seguindo o padrão existente
