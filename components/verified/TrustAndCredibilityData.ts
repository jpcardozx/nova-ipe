export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  image?: {
    url: string;
    alt?: string;
  };
  date?: string;
  verified?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Maria Silva',
    role: 'Compradora',
    company: 'Engenheira Civil',
    content: 'Excelente atendimento e transparência total no processo. Encontrei minha casa dos sonhos através da Nova Ipê.',
    rating: 5,
    image: {
      url: '/testimonials/maria-silva.jpg',
      alt: 'Maria Silva'
    },
    verified: true
  },
  {
    id: '2',
    name: 'João Santos',
    role: 'Investidor',
    company: 'Empresário',
    content: 'Profissionais extremamente competentes. Me ajudaram a encontrar o investimento perfeito no mercado imobiliário.',
    rating: 5,
    image: {
      url: '/testimonials/joao-santos.jpg',
      alt: 'João Santos'
    },
    verified: true
  },
  {
    id: '3',
    name: 'Ana Paula',
    role: 'Vendedora',
    company: 'Professora',
    content: 'Venderam meu apartamento em tempo recorde e pelo melhor preço. Recomendo sem hesitação!',
    rating: 5,
    image: {
      url: '/testimonials/ana-paula.jpg',
      alt: 'Ana Paula'
    },
    verified: true
  },
  {
    id: '4',
    name: 'Carlos Mendes',
    role: 'Locatário',
    company: 'Advogado',
    content: 'Processo de locação super rápido e sem burocracias desnecessárias. Equipe muito profissional.',
    rating: 4,
    image: {
      url: '/testimonials/carlos-mendes.jpg',
      alt: 'Carlos Mendes'
    },
    verified: true
  },
  {
    id: '5',
    name: 'Fernanda Costa',
    role: 'Compradora',
    company: 'Médica',
    content: 'Atendimento personalizado e dedicado. Senti que realmente se importavam em encontrar o imóvel ideal para mim.',
    rating: 5,
    image: {
      url: '/testimonials/fernanda-costa.jpg',
      alt: 'Fernanda Costa'
    },
    verified: true
  }
];

export default TESTIMONIALS;
