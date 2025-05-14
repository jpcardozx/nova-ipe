# Nova Ipê - Site Imobiliário Premium

Um site moderno e elegante para uma imobiliária de alto padrão, com foco em experiência do usuário e design premium.

## Visão Geral

O Nova Ipê é um projeto de site imobiliário desenvolvido com tecnologias modernas como Next.js, React, TypeScript, Tailwind CSS e Framer Motion. O objetivo é oferecer uma experiência digital premium para clientes que buscam imóveis de alto padrão.

## Características Principais

- **Design Premium**: Interface elegante e sofisticada com animações suaves e micro-interações
- **Sistema de Design Consistente**: Definições padronizadas de cores, tipografia, espaçamentos e componentes
- **Componentes Reutilizáveis**: Biblioteca de componentes UI modulares e extensíveis
- **Responsivo**: Adaptação perfeita para todos os tamanhos de tela
- **Otimizado para Performance**: Carregamento rápido e experiência fluida
- **Acessibilidade**: Conformidade com padrões WCAG para garantir usabilidade para todos

## Sistema de Design

O projeto utiliza um sistema de design completo definido em `lib/design-system.ts` com:

- **Cores**: Paleta principal e cores de acento
- **Tipografia**: Hierarquia de textos e fontes
- **Espaçamentos**: Sistema de grid e espaçamentos consistentes
- **Breakpoints**: Pontos de quebra para responsividade
- **Animações**: Transições e efeitos padronizados

## Componentes UI

### Componentes Core

- **Button**: Botão customizável com múltiplas variantes, animações e estados
  - Variantes: primary, secondary, outline, ghost, light, dark, premium, success, danger, link
  - Animações: pulse, scale, float, glow, subtle
  - Suporte a ícones, loading state e acessibilidade

### Componentes de Propriedade

- **PropertyCard**: Card para exibição de imóveis com imagens, informações e interações
- **PropertyCarousel**: Carrossel para exibir coleções de imóveis com navegação e responsividade
- **PropertyHero**: Seção hero para páginas de detalhes de imóveis com galeria de imagens
- **PropertyFeatures**: Exibição de características e comodidades do imóvel
- **PropertyMap**: Componente para mostrar localização e proximidades do imóvel

## Como Usar

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/nova-ipe.git

# Navegue até o diretório
cd nova-ipe

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Exemplos de Uso

#### Button

```tsx
import { Button } from '@/components/ui/core/Button';

export default function Example() {
  return (
    <div className="space-y-4">
      <Button variant="primary">Botão Primário</Button>
      <Button variant="premium" animation="float" leftIcon={<StarIcon />}>
        Botão Premium
      </Button>
      <Button variant="outline" loading>
        Carregando...
      </Button>
    </div>
  );
}
```

#### PropertyCard

```tsx
import { PropertyCard } from '@/components/ui/property';

export default function Example() {
  return (
    <PropertyCard
      id="1"
      title="Apartamento de Luxo"
      slug="apartamento-luxo"
      location="Jardins"
      city="São Paulo"
      price={1250000}
      propertyType="sale"
      area={120}
      bedrooms={3}
      bathrooms={2}
      parkingSpots={2}
      mainImage={{
        url: "/images/apartamento.jpg",
        alt: "Apartamento de Luxo"
      }}
      isPremium={true}
    />
  );
}
```

#### PropertyCarousel

```tsx
import { PropertyCarousel } from '@/components/ui/property';

export default function Example() {
  return (
    <PropertyCarousel
      properties={propertiesArray}
      title="Imóveis em Destaque"
      subtitle="Confira nossas melhores opções"
      slidesToShow={3}
      showControls={true}
      autoplay={true}
      viewAllLink="/imoveis"
    />
  );
}
```

## Estrutura do Projeto

```
├── app/                  # Páginas e rotas do Next.js
├── components/           # Componentes React
│   ├── ui/               # Componentes de UI
│   │   ├── core/         # Componentes base (Button, etc)
│   │   └── property/     # Componentes específicos de imóveis
├── lib/                  # Utilitários e configurações
│   └── design-system.ts  # Sistema de design
├── public/               # Arquivos estáticos
└── styles/               # Estilos globais
```

## Tecnologias Utilizadas

- **Next.js**: Framework React para renderização híbrida
- **React**: Biblioteca para construção de interfaces
- **TypeScript**: Tipagem estática para JavaScript
- **Tailwind CSS**: Framework CSS utilitário
- **Framer Motion**: Biblioteca de animações
- **Lucide Icons**: Ícones modernos e consistentes

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a licença MIT.
