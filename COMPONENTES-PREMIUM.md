# Componentes Premium - Nova Ipê Imobiliária

Este documento descreve os componentes premium implementados para elevar a experiência do usuário no site da Nova Ipê Imobiliária. Estes componentes foram projetados para proporcionar uma experiência imersiva e interativa, diferenciando o site da concorrência.

## Índice

1. [PropertyView3D](#propertyview3d) - Visualização 3D interativa de imóveis
2. [VirtualTourViewer](#virtualtourviewer) - Tour virtual 360° de imóveis
3. [PropertyFeatureTabs](#propertyfeaturetabs) - Abas interativas para características de imóveis
4. [PropertyContactModal](#propertycontactmodal) - Modal de contato com multi-etapas
5. [Integração com a Homepage](#integração-com-a-homepage)
6. [Requisitos e Dependências](#requisitos-e-dependências)

## PropertyView3D

O componente `PropertyView3D` permite a visualização de modelos 3D de imóveis, oferecendo uma experiência interativa onde o usuário pode girar, aproximar e explorar o imóvel de todos os ângulos.

### Características

- Renderização de modelos 3D no formato GLTF/GLB
- Controles de rotação, zoom e pan
- Rotação automática (pode ser desativada)
- Informações sobrepostas ao modelo
- Controles de interface personalizados
- Iluminação e ambiente configuráveis

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `modelUrl` | `string` | `/models/house.glb` | URL do modelo 3D no formato GLTF/GLB |
| `title` | `string` | - | Título a ser exibido sobre o modelo |
| `description` | `string` | - | Descrição a ser exibida sobre o modelo |
| `className` | `string` | - | Classes CSS adicionais |
| `cameraPosition` | `[number, number, number]` | `[-10, 5, 15]` | Posição inicial da câmera |
| `modelScale` | `number` | `0.01` | Escala do modelo |
| `modelPosition` | `[number, number, number]` | `[0, 0, 0]` | Posição do modelo |
| `modelRotation` | `[number, number, number]` | `[0, 0, 0]` | Rotação inicial do modelo |
| `aspectRatio` | `string` | `aspect-[16/9]` | Proporção do container |
| `environmentPreset` | `string` | `apartment` | Preset de ambiente (apartment, city, dawn, forest, night, park, studio, sunset, warehouse) |
| `showInfo` | `boolean` | `true` | Se deve mostrar informações sobre o modelo |
| `onLoadComplete` | `() => void` | `() => {}` | Callback quando o modelo terminar de carregar |

### Exemplo de Uso

```tsx
<PropertyView3D 
  title="Casa Moderna em Condomínio Fechado"
  description="Modelo 3D interativo - Gire e explore o imóvel em detalhes"
  modelUrl="/models/house.glb"
  aspectRatio="aspect-square"
/>
```

## VirtualTourViewer

O componente `VirtualTourViewer` permite a criação de tours virtuais 360° de imóveis, permitindo que o usuário explore os ambientes como se estivesse realmente lá.

### Características

- Visualização de imagens panorâmicas 360°
- Navegação entre diferentes cenas (ambientes)
- Hotspots interativos para informações e navegação
- Controles de navegação personalizados
- Suporte para tela cheia
- Visualização de planta baixa com pontos de navegação
- Miniaturas para navegação rápida entre cenas

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `scenes` | `Scene[]` | - | Array de cenas do tour |
| `startScene` | `string` | - | ID da cena inicial |
| `autoLoad` | `boolean` | `true` | Se deve carregar automaticamente |
| `showControls` | `boolean` | `true` | Se deve mostrar controles de navegação |
| `showFullscreenButton` | `boolean` | `true` | Se deve mostrar botão de tela cheia |
| `showZoomControls` | `boolean` | `true` | Se deve mostrar controles de zoom |
| `showThumbnails` | `boolean` | `true` | Se deve mostrar miniaturas das cenas |
| `className` | `string` | - | Classes CSS adicionais |
| `height` | `string` | `h-[70vh]` | Altura do componente |
| `onSceneChange` | `(sceneId: string) => void` | - | Callback quando a cena mudar |

### Tipos de Dados

```tsx
type Hotspot = {
  id: string;
  type: 'info' | 'custom' | 'scene';
  pitch: number;
  yaw: number;
  text?: string;
  targetScene?: string;
  cssClass?: string;
};

type Scene = {
  id: string;
  title: string;
  imageUrl: string;
  hotspots?: Hotspot[];
  infoText?: string;
  thumbnail?: string;
};
```

### Exemplo de Uso

```tsx
const scenes = [
  {
    id: 'living-room',
    title: 'Sala de Estar',
    imageUrl: '/panoramas/living-room.jpg',
    infoText: 'Ampla sala de estar com pé direito duplo.',
    hotspots: [
      {
        id: 'hs-kitchen',
        type: 'scene',
        pitch: -10,
        yaw: 30,
        text: 'Ir para a cozinha',
        targetScene: 'kitchen'
      }
    ]
  },
  {
    id: 'kitchen',
    title: 'Cozinha',
    imageUrl: '/panoramas/kitchen.jpg',
    infoText: 'Cozinha gourmet com ilha central.'
  }
];

<VirtualTourViewer 
  scenes={scenes}
  showControls={true}
  showFullscreenButton={true}
  height="h-[70vh]"
/>
```

## PropertyFeatureTabs

O componente `PropertyFeatureTabs` apresenta as características de um imóvel em um formato de abas interativas, permitindo organizar as informações de forma clara e atraente.

### Características

- Abas interativas para diferentes categorias de características
- Suporte para orientação horizontal ou vertical
- Variantes de estilo (padrão ou cards)
- Animações suaves entre abas
- Suporte para ícones e imagens
- Destaque para características premium ou especiais

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `features` | `Feature[]` | - | Array de características |
| `defaultTab` | `string` | - | ID da aba selecionada por padrão |
| `className` | `string` | - | Classes CSS adicionais |
| `variant` | `'default' \| 'cards'` | `'default'` | Variante de estilo das abas |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientação das abas |

### Tipos de Dados

```tsx
interface Feature {
  id: string;
  name: string;
  icon: React.ReactNode;
  premium?: boolean;
  highlight?: boolean;
}

interface PropertyFeatureTabsProps {
  features: {
    id: string;
    title: string;
    description: string;
    image?: string;
    icon?: React.ReactNode;
    premium?: boolean;
    highlight?: boolean;
    items?: Feature[];
  }[];
}
```

### Exemplo de Uso

```tsx
const propertyFeatures = [
  {
    id: 'features',
    title: 'Características',
    description: 'Conheça os diferenciais deste empreendimento',
    items: [
      { id: 'f1', name: 'Piscina', icon: <span>🏊</span> },
      { id: 'f2', name: 'Academia', icon: <span>💪</span> }
    ]
  },
  {
    id: 'location',
    title: 'Localização',
    description: 'Proximidade com serviços essenciais',
    image: '/images/map.jpg',
    items: [
      { id: 'l1', name: '5 min do metrô', icon: <span>🚇</span> }
    ]
  }
];

<PropertyFeatureTabs 
  features={propertyFeatures}
  variant="cards"
  orientation="horizontal"
/>
```

## PropertyContactModal

O componente `PropertyContactModal` oferece um formulário de contato multi-etapas com animações e microinterações que aumentam a taxa de conversão.

### Características

- Formulário multi-etapas (dados pessoais, agendamento, confirmação)
- Animações de transição entre etapas
- Validação de formulário em tempo real
- Seleção de data e horário para visitas
- Preferência de contato (WhatsApp, telefone, email)
- Formatação automática de telefone
- Barra de progresso animada
- Estados de carregamento e sucesso
- Feedback visual de erros

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `isOpen` | `boolean` | - | Se o modal está aberto |
| `onClose` | `() => void` | - | Função para fechar o modal |
| `property` | `Property` | - | Dados do imóvel |
| `className` | `string` | - | Classes CSS adicionais |

### Tipos de Dados

```tsx
interface Property {
  id: string;
  title: string;
  image?: string;
  price?: string;
  address?: string;
}
```

### Exemplo de Uso

```tsx
const [isModalOpen, setIsModalOpen] = useState(false);

const property = {
  id: '123',
  title: 'Casa Moderna em Condomínio',
  image: '/images/property.jpg',
  price: 'R$ 1.200.000',
  address: 'Rua das Flores, 123 - Jardim Primavera'
};

<Button onClick={() => setIsModalOpen(true)}>
  Agendar Visita
</Button>

<PropertyContactModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  property={property}
/>
```

## Integração com a Homepage

A homepage foi redesenhada para incorporar estes componentes premium, criando uma experiência imersiva e sofisticada:

1. **Hero Section**: Mantida com design atual por ser eficaz
2. **Imóveis em Destaque**: Utilizando o `PropertyCarousel` existente
3. **Tour Virtual 360°**: Nova seção com `VirtualTourViewer` para exploração imersiva
4. **Visualização 3D**: Nova seção combinando `PropertyView3D` e `PropertyFeatureTabs`
5. **Imóveis para Alugar**: Utilizando o `PropertyCarousel` existente
6. **Lançamentos**: Utilizando o `PropertyCarousel` existente
7. **Como Funciona**: Mantida com o `ClientProgressSteps` existente
8. **Depoimentos e Contato**: Mantidas com os componentes existentes

## Requisitos e Dependências

Para utilizar estes componentes, as seguintes dependências são necessárias:

```bash
npm install react-parallax pannellum-react @splinetool/react-spline three @react-three/fiber @react-three/drei react-icons @headlessui/react react-spring @tippyjs/react framer-motion
```

### Dependências Principais

- **three.js**: Biblioteca de renderização 3D
- **@react-three/fiber**: Wrapper React para three.js
- **@react-three/drei**: Componentes úteis para React Three Fiber
- **pannellum-react**: Visualizador de panoramas 360°
- **framer-motion**: Animações avançadas
- **react-spring**: Animações baseadas em física
- **@headlessui/react**: Componentes de UI acessíveis e sem estilo
- **react-icons**: Biblioteca de ícones

## Conclusão

Estes componentes premium elevam significativamente a experiência do usuário no site da Nova Ipê Imobiliária, proporcionando interatividade, imersão e uma apresentação sofisticada dos imóveis. A combinação de visualização 3D, tours virtuais 360°, abas interativas e formulários de contato otimizados cria uma plataforma moderna e eficaz para a comercialização de imóveis de alto padrão. 