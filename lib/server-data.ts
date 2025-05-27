/**
 * Utility para buscar dados do Hero no servidor
 */

// Tipos
export interface HeroData {
  marketMetrics: MarketMetric[];
  neighborhoods: NeighborhoodData[];
  stats: HeroStats;
}

interface MarketMetric {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  growth?: number;
}

interface NeighborhoodData {
  name: string;
  priceRange: string;
  characteristics: string;
  distance: string;
  highlight: string;
}

interface HeroStats {
  totalProperties: number;
  soldThisYear: number;
  averagePrice: string;
  clientSatisfaction: number;
}

/**
 * Busca dados do hero com cache e fallbacks
 */
export async function getHeroData(): Promise<HeroData> {
  try {
    // Em um ambiente real, isso viria do Sanity ou outra fonte de dados
    // Por agora, retornamos dados mockados com base em métricas reais
    
    return {
      marketMetrics: [
        {
          id: 'growth',
          title: 'Valorização Imóveis',
          value: '9.4%',
          subtitle: 'média anual em Guararema',
          growth: 9.4
        },
        {
          id: 'properties',
          title: 'Imóveis Disponíveis',
          value: '120+',
          subtitle: 'casas e apartamentos'
        },
        {
          id: 'sales',
          title: 'Vendas Realizadas',
          value: '350+',
          subtitle: 'nos últimos 2 anos'
        },
        {
          id: 'satisfaction',
          title: 'Satisfação',
          value: '98%',
          subtitle: 'dos nossos clientes'
        }
      ],
      neighborhoods: [
        {
          name: 'Centro',
          priceRange: 'R$ 280k - 450k',
          characteristics: 'Comércio próximo, infraestrutura completa',
          distance: '0km do centro',
          highlight: 'Localização privilegiada'
        },
        {
          name: 'Jardim das Flores',
          priceRange: 'R$ 320k - 580k',
          characteristics: 'Área nobre, casas grandes, muito verde',
          distance: '2km do centro',
          highlight: 'Qualidade de vida'
        },
        {
          name: 'Portal da Montanha',
          priceRange: 'R$ 400k - 750k',
          characteristics: 'Condomínios fechados, segurança 24h',
          distance: '3km do centro',
          highlight: 'Máxima segurança'
        }
      ],
      stats: {
        totalProperties: 127,
        soldThisYear: 89,
        averagePrice: 'R$ 420.000',
        clientSatisfaction: 98
      }
    };
  } catch (error) {
    console.error('Error fetching hero data:', error);
    
    // Fallback data
    return {
      marketMetrics: [],
      neighborhoods: [],
      stats: {
        totalProperties: 0,
        soldThisYear: 0,
        averagePrice: 'R$ 0',
        clientSatisfaction: 0
      }
    };
  }
}
