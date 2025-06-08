'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  MapPin, 
  TrendingUp, 
  Users, 
  Award,
  Building2,
  Home,
  Phone,
  Mail,
  Star,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '../sections/NavBar';
import Footer from '../sections/Footer';

// Mock data - replace with real data
const mockProperties = [
  {
    id: '1',
    title: 'Casa Premium Guararema',
    location: 'Centro - Guararema',
    price: 'R$ 850.000',
    beds: 3,
    baths: 2,
    area: '180m²',
    image: '/images/casaEx.jpg',
    type: 'venda'
  },
  {
    id: '2', 
    title: 'Apartamento Moderno',
    location: 'Vila São João',
    price: 'R$ 2.800/mês',
    beds: 2,
    baths: 1,
    area: '75m²',
    image: '/images/houses.jpg',
    type: 'aluguel'
  },
  {
    id: '3',
    title: 'Casa com Piscina',
    location: 'Condomínio Fechado',
    price: 'R$ 1.200.000',
    beds: 4,
    baths: 3,
    area: '220m²',
    image: '/images/casaEx.jpg',
    type: 'venda'
  }
];

const stats = [
  { icon: Award, value: '25+', label: 'Anos de Experiência' },
  { icon: Users, value: '2000+', label: 'Clientes Satisfeitos' },
  { icon: Building2, value: '500+', label: 'Imóveis Vendidos' }
];

const testimonials = [
  {
    name: 'Maria Silva',
    comment: 'Encontrei minha casa dos sonhos com o atendimento excepcional da Nova Ipê.',
    rating: 5
  },
  {
    name: 'João Santos',
    comment: 'Profissionalismo e dedicação que fazem toda a diferença.',
    rating: 5
  }
];

export default function NovaVersaoHomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const heroSlides = [
    {
      title: 'Seu Novo Lar',
      subtitle: 'O lugar perfeito onde sua família crescerá',
      description: 'Transformamos a busca pelo lar ideal em uma jornada tranquila e segura.',
      cta: 'Encontrar Meu Lar',
      image: '/images/hero.png'
    },
    {
      title: 'Investimento Inteligente',
      subtitle: 'Maximize seu patrimônio com imóveis em Guararema',
      description: 'Oportunidades únicas de investimento com alta valorização.',
      cta: 'Ver Oportunidades',
      image: '/images/investment-growth.jpg'
    },
    {
      title: 'Qualidade de Vida',
      subtitle: 'Viva melhor em um ambiente privilegiado',
      description: 'Proximidade à natureza sem abrir mão da comodidade urbana.',
      cta: 'Conhecer Região',
      image: '/images/hero-experience.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section Premium */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: activeSlide === index ? 1 : 0 }}
              transition={{ duration: 1.5 }}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/30" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-7xl font-light mb-6">
              {heroSlides[activeSlide].title}
            </h1>
            <p className="text-xl lg:text-2xl mb-4 text-slate-200">
              {heroSlides[activeSlide].subtitle}
            </p>
            <p className="text-lg mb-8 text-slate-300 max-w-2xl mx-auto">
              {heroSlides[activeSlide].description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg"
              >
                {heroSlides[activeSlide].cta}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-slate-900"
              >
                <Phone className="w-5 h-5 mr-2" />
                (11) 4693-8484
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                activeSlide === index ? 'bg-amber-500' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-amber-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                  <div className="text-slate-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-light text-slate-900 mb-4">
              Imóveis em <span className="font-bold text-amber-600">Destaque</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Seleção exclusiva de propriedades com o melhor da região
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {mockProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.type === 'venda' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {property.type === 'venda' ? 'Venda' : 'Aluguel'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-slate-600 mb-4">
                    <span>{property.beds} quartos</span>
                    <span>{property.baths} banheiros</span>
                    <span>{property.area}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-amber-600">
                      {property.price}
                    </span>
                    <Button size="sm" variant="outline">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/comprar">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                Ver Todos os Imóveis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Market Analysis Preview */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-amber-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl lg:text-5xl font-light text-slate-900 mb-6">
              Análise de <span className="font-bold text-amber-600">Mercado</span>
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Insights exclusivos sobre o mercado imobiliário de Guararema
            </p>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-left">
                  <h3 className="text-2xl font-semibold mb-4">Valorização Regional</h3>
                  <p className="text-slate-600 mb-6">
                    Guararema apresenta uma das maiores taxas de valorização 
                    imobiliária da região metropolitana, com crescimento de 
                    <span className="font-bold text-amber-600"> 15% ao ano</span>.
                  </p>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Ver Análise Completa
                  </Button>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-amber-600 mb-2">15%</div>
                  <div className="text-slate-600">Valorização Anual</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-light text-white mb-4">
              O que nossos <span className="font-bold text-amber-400">clientes dizem</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/90 text-lg mb-6 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                <div className="font-semibold text-amber-400">{testimonial.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-amber-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl lg:text-5xl font-light text-white mb-6">
              Pronto para <span className="font-bold">começar?</span>
            </h2>
            <p className="text-xl text-amber-100 mb-8">
              Nossa equipe está pronta para ajudar você a encontrar o imóvel perfeito
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato">
                <Button 
                  size="lg" 
                  className="bg-white text-amber-600 hover:bg-slate-100 px-8 py-4"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Entre em Contato
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-amber-600"
              >
                <Phone className="w-5 h-5 mr-2" />
                (11) 4693-8484
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}