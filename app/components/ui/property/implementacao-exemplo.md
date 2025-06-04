# Exemplos de Implementação para Componentes Unificados

Este documento contém exemplos práticos de como implementar e usar os componentes unificados no projeto Nova Ipê.

## PropertyCardUnified

### Exemplo de Implementação Básica

```tsx
import { PropertyCardUnified } from '@/components/ui/property/PropertyCardUnified';

export default function MinhaListaDeImoveis() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PropertyCardUnified
        id="prop-123"
        title="Apartamento Moderno com Vista Panorâmica"
        slug="apartamento-moderno-vista"
        location="Jardim Paulista"
        city="São Paulo"
        price={750000}
        propertyType="sale"
        area={120}
        bedrooms={3}
        bathrooms={2}
        parkingSpots={1}
        mainImage={{
          url: '/images/apartments/modern-view.jpg',
          alt: 'Vista do apartamento moderno',
        }}
        isHighlight={true}
      />

      {/* Mais cards... */}
    </div>
  );
}
```

### Exemplo com Imagem do Sanity

```tsx
<PropertyCardUnified
  id="prop-456"
  title="Casa em Condomínio Fechado"
  slug="casa-condominio-fechado"
  location="Alphaville"
  city="Barueri"
  price={1250000}
  propertyType="sale"
  area={240}
  bedrooms={4}
  bathrooms={3}
  parkingSpots={2}
  mainImage={{
    sanityImage: property.mainImage, // Referência direta do Sanity
    alt: 'Casa em Condomínio Alphaville',
  }}
  isPremium={true}
/>
```

### Exemplo com Callback de Favoritos

```tsx
function handleFavoriteToggle(id: string) {
  console.log(`Toggling favorite status for property: ${id}`);
  // Implementar lógica de favoritos...
}

<PropertyCardUnified
  id="prop-789"
  // ... outras props
  onFavoriteToggle={handleFavoriteToggle}
/>;
```

## VirtualizedPropertiesGridUnified

### Implementação Básica

```tsx
import VirtualizedPropertiesGridUnified from '@/app/components/VirtualizedPropertiesGridUnified';

export default function PaginaDeImoveis() {
  const [properties, setProperties] = useState<UnifiedPropertyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      setIsLoading(true);
      try {
        const data = await fetchPropertiesFromAPI();
        setProperties(data);
      } catch (error) {
        console.error('Erro ao carregar imóveis:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperties();
  }, []);

  function handleFavoriteToggle(id: string) {
    // Implementar lógica de favoritos
  }

  function resetFilters() {
    // Implementar reset de filtros
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Nossos Imóveis</h1>

      <VirtualizedPropertiesGridUnified
        properties={properties}
        isLoading={isLoading}
        onFavoriteToggle={handleFavoriteToggle}
        resetFilters={resetFilters}
        className="h-[800px]"
      />
    </div>
  );
}
```

### Dicas de Otimização

1. **Memoize os dados de imóveis** para evitar re-renderizações desnecessárias:

```tsx
const memoizedProperties = useMemo(() => {
  return properties.map(property => ({
    ...property,
    // Adicione dados calculados aqui para evitar cálculos repetidos
    formattedPrice: formatarMoeda(property.price),
  }));
}, [properties]);
```

2. **Use prefetch para rotas comuns**:

```tsx
import { useRouter } from 'next/router';

function PropertyCardWithPrefetch(props) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch da página de detalhes
    router.prefetch(`/imovel/${props.slug}`);
  }, [props.slug, router]);

  return <PropertyCardUnified {...props} />;
}
```

## Implementação Futura: PropertyHeroUnified

```tsx
<PropertyHeroUnified
  id="prop-123"
  title="Apartamento Luxuoso com Vista para o Mar"
  address="Avenida Atlântica, 1500"
  city="Rio de Janeiro"
  state="RJ"
  price={2500000}
  formattedPrice="R$ 2.500.000"
  propertyType="sale"
  status="available"
  mainImage={{
    url: '/images/properties/luxury-apartment.jpg',
    alt: 'Vista frontal do apartamento luxuoso',
  }}
  images={[
    {
      url: '/images/properties/luxury-apartment-1.jpg',
      alt: 'Sala de estar',
    },
    {
      url: '/images/properties/luxury-apartment-2.jpg',
      alt: 'Cozinha gourmet',
    },
    // mais imagens...
  ]}
  onScheduleVisit={() => openScheduleModal('prop-123')}
  onShare={() => openShareOptions('prop-123')}
/>
```
