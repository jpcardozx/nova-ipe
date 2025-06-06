// filepath: app/components/TrustAndCredibilityData.ts
export interface TrustBadge {
  icon: string;
  title: string;
  description: string;
  stat: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  location: string;
  rating: number;
  service: 'venda' | 'compra' | 'aluguel';
}

export const TRUST_BADGES: TrustBadge[] = [
  { icon: '🏆', title: 'Liderança Consagrada', description: 'Maior volume de negócios em Guararema, triênio 2022-2024', stat: '#1 em resultados' },
  { icon: '⚡', title: 'Liquidez Acelerada', description: 'Tempo médio de venda 40 % inferior à média regional', stat: '≈ 45 dias' },
  { icon: '💰', title: 'Valorização Garantida', description: 'Negociações 8 % acima do valor de mercado local', stat: '+ R$ 35 mil' },
  { icon: '🛡️', title: 'Compliance Total', description: 'Processo 100 % documentado, sem intercorrências judiciais', stat: '0 litígios' },
];

export const TESTIMONIALS: Testimonial[] = [
  { quote: 'A Ipê Imóveis vendeu minha casa em apenas 30 dias, exatamente pelo valor pretendido. Transparência do início ao fim.', author: 'Carlos Montenegro', location: 'Jardim Florestal', rating: 5, service: 'venda' },
  { quote: 'Encontramos o imóvel ideal graças à precisão da equipe. Foi uma experiência tranquila e segura.', author: 'Família Rodrigues', location: 'Centro', rating: 5, service: 'compra' },
  { quote: 'Aluguei o apartamento rapidamente e com excelentes inquilinos. Atendimento impecável.', author: 'Mariana Costa', location: 'Itapema', rating: 5, service: 'aluguel' },
  { quote: 'Profissionais que realmente entendem o mercado local. Fui orientado na melhor decisão de investimento.', author: 'Roberto Silva', location: 'Vila Esperança', rating: 5, service: 'venda' },
];
