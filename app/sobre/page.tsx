import { Metadata } from 'next';
import Image from 'next/image';
import { Award, Users, Home, Heart, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre Nós - Ipê Imóveis | 15 Anos de Experiência em Guararema',
  description: 'Conheça a história da Ipê Imóveis. Mais de 15 anos ajudando famílias a encontrar o lar perfeito em Guararema. Expertise local e atendimento personalizado.',
  keywords: 'Ipê Imóveis, sobre nós, história, experiência, Guararema, imobiliária, equipe, missão, valores',
};

export default function AboutPage() {
  const stats = [
    { icon: Home, label: 'Imóveis Vendidos', value: '500+', description: 'Transações realizadas com sucesso' },
    { icon: Users, label: 'Famílias Atendidas', value: '400+', description: 'Clientes satisfeitos e realizados' },
    { icon: Award, label: 'Anos de Experiência', value: '15+', description: 'Tradição e conhecimento do mercado' },
    { icon: Heart, label: 'Satisfação', value: '98%', description: 'Índice de satisfação dos clientes' },
  ];

  const teamMembers = [
    {
      name: 'Maria Silva',
      role: 'Diretora Comercial',
      experience: '15 anos',
      description: 'Especialista em negociação e atendimento ao cliente.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b9c0e647?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'João Santos',
      role: 'Corretor Sênior',
      experience: '12 anos',
      description: 'Expert em avaliação imobiliária e mercado local.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Ana Costa',
      role: 'Corretora',
      experience: '8 anos',
      description: 'Especializada em imóveis residenciais e primeiro imóvel.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
  ];

  const timeline = [
    { year: '2009', event: 'Fundação da Ipê Imóveis', description: 'Início das atividades em Guararema' },
    { year: '2012', event: '100 Imóveis Vendidos', description: 'Marco de crescimento e confiança' },
    { year: '2016', event: 'Expansão da Equipe', description: 'Novos corretores especializados' },
    { year: '2020', event: 'Plataforma Digital', description: 'Modernização e atendimento online' },
    { year: '2024', event: '500+ Imóveis', description: 'Consolidação como referência regional' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Nossa História
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            15 anos dedicados a transformar sonhos em realidade, 
            conectando famílias aos seus lares perfeitos em Guararema.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-gray-600 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission and Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Missão, Visão e Valores</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Missão</h3>
              <p className="text-gray-600">
                Facilitar a realização do sonho da casa própria, oferecendo 
                serviços imobiliários de excelência com transparência e confiança.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Visão</h3>
              <p className="text-gray-600">
                Ser a imobiliária de referência em Guararema e região, 
                reconhecida pela qualidade dos serviços e satisfação dos clientes.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Valores</h3>
              <p className="text-gray-600">
                Transparência, ética, comprometimento, inovação e 
                relacionamento próximo com nossos clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Nossa Jornada em Guararema
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                A Ipê Imóveis nasceu em 2009 do sonho de criar uma imobiliária 
                diferente em Guararema. Com foco no atendimento personalizado 
                e conhecimento profundo do mercado local, começamos nossa jornada 
                ajudando famílias a encontrarem seus lares ideais.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Ao longo dos anos, construímos relacionamentos sólidos com a 
                comunidade, baseados na confiança, transparência e resultados 
                excepcionais. Cada imóvel vendido, cada família atendida, 
                representa uma história de sucesso que nos motiva a continuar.
              </p>
              <p className="text-lg text-gray-600">
                Hoje, somos reconhecidos como a imobiliária de referência em 
                Guararema, com uma equipe experiente e apaixonada pelo que faz.
              </p>
            </div>
            
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Equipe Ipê Imóveis"
                width={600}
                height={400}
                className="rounded-lg shadow-lg object-cover w-full h-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa Trajetória</h2>
            <p className="text-lg text-gray-600">15 anos de crescimento e conquistas</p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-green-200"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-lg p-6 shadow-md">
                      <div className="text-2xl font-bold text-green-600 mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.event}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa Equipe</h2>
            <p className="text-lg text-gray-600">Profissionais experientes e dedicados</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-green-600 font-medium mb-1">{member.role}</p>
                <p className="text-sm text-gray-500 mb-3">{member.experience} de experiência</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para encontrar seu novo lar?
          </h2>
          <p className="text-xl mb-8">
            Nossa experiência e conhecimento local estão à sua disposição. 
            Entre em contato e descubra como podemos ajudar você.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contato"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Falar com Nossa Equipe
            </a>
            <a
              href="/catalogo"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              Ver Imóveis Disponíveis
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}