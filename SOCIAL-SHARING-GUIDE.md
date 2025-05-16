# Social Media Sharing Optimization for Nova Ipê

Este documento descreve as implementações realizadas para otimizar o compartilhamento do site da Nova Ipê nas redes sociais.

## Otimizações Implementadas

### 1. Metadados OpenGraph Aprimorados
Implementamos metadados OpenGraph completos para permitir que redes sociais e aplicativos de mensagem como WhatsApp exibam previsualizações ricas do conteúdo compartilhado. Os metadados incluem:

- Título otimizado para cada tipo de página
- Descrição personalizada
- Imagens em vários tamanhos e formatos
- Informações específicas para propriedades imobiliárias

### 2. Esquemas JSON-LD para SEO
Adicionamos esquemas estruturados JSON-LD para melhorar a compreensão do conteúdo pelos motores de busca:

- `RealEstateAgent` para a imobiliária
- `WebSite` para o site como um todo
- `LocalBusiness` para informações de negócio local
- `RealEstateListing` para listagens de imóveis
- `BreadcrumbList` para navegação estruturada

### 3. Imagens OpenGraph Otimizadas
Criamos imagens OpenGraph em múltiplos formatos para garantir compatibilidade com diversas plataformas:

- Imagem padrão (1200x630px) para Facebook e a maioria das redes
- Imagem quadrada (1080x1080px) para Instagram e outras plataformas
- Imagem compacta (400x400px) otimizada para WhatsApp

### 4. Componentes React para Compartilhamento
Desenvolvemos componentes React específicos para facilitar o compartilhamento:

- `WhatsAppShare` - Botão otimizado para compartilhamento no WhatsApp
- `SocialShareButtons` - Conjunto de botões para várias redes sociais
- `PropertyMetadata` - Metadados específicos para páginas de imóveis
- `DynamicOGGenerator` - Gerador de imagens dinâmicas para compartilhamento

### 5. Metadados Específicos para WhatsApp
Adicionamos metadados específicos para otimizar a visualização no WhatsApp:

- Tags `whatsapp:title`, `whatsapp:description` e `whatsapp:image`
- Metadados de preço para imóveis
- Metadados de disponibilidade

### 6. Integração com Analytics
Os componentes de compartilhamento incluem integração com Google Analytics para rastreamento de compartilhamentos.

## Como Usar

### Gerando Imagens OpenGraph
Para gerar as imagens OpenGraph do site, execute:

```bash
npm run generate-og-images
```

Isso criará três versões de imagens na pasta `/public/images/`:
- `og-image-2025.jpg` - Padrão para a maioria das redes sociais
- `og-image-square.jpg` - Versão quadrada para Instagram
- `og-image-whatsapp.jpg` - Versão otimizada para WhatsApp

### Usando Metadados em Páginas Dinâmicas
Para páginas de imóveis, importe e utilize o `generatePropertyMetadata`:

```tsx
import { generatePropertyMetadata } from '@/lib/metadata-generators';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug);
  return generatePropertyMetadata(property);
}
```

### Adicionando Botões de Compartilhamento
Adicione botões de compartilhamento em qualquer página:

```tsx
import SocialShareButtons from '@/app/components/SocialShareButtons';

export default function PropertyPage({ property }) {
  return (
    <div>
      <h1>{property.title}</h1>
      <SocialShareButtons 
        title={property.title}
        description={`Confira este imóvel: ${property.title} em ${property.city}`}
        imageUrl={property.mainImage.url}
      />
    </div>
  );
}
```

### Botão Específico do WhatsApp
Para um botão apenas para WhatsApp:

```tsx
import WhatsAppShare from '@/app/components/WhatsAppShare';

<WhatsAppShare 
  title={property.title}
  message={`Encontrei este imóvel incrível: ${property.title} em ${property.city}`}
  buttonText="Enviar no WhatsApp"
  variant="primary"
  size="lg"
/>
```

## Padrões Recomendados (2025)

1. **Imagens OpenGraph**: Sempre forneça múltiplas versões para diferentes plataformas.
2. **Dados Estruturados**: Inclua JSON-LD para todos os tipos de conteúdo importantes.
3. **Metadados WhatsApp**: Use as tags específicas (`whatsapp:title`, etc.) para melhorar a experiência.
4. **Subdomínios de compartilhamento**: Considere implementar um subdomínio específico para compartilhamento (share.novaipe.com.br) em atualizações futuras.

## Testes e Validação

Para validar os metadados e dados estruturados, utilize:

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Google Structured Data Testing Tool](https://validator.schema.org/)
- [Rich Results Test](https://search.google.com/test/rich-results)
