'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Home, Star, ChevronDown } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';
import { Typography } from '@/lib/components/ui/Typography';
import { Container } from '@/lib/components/layout/Container';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (propertyType) params.append('tipo', propertyType);
    if (location) params.append('local', location);
    window.location.href = `/catalogo?${params.toString()}`;
  };

  const stats = [
    { number: '500+', label: 'Imóveis Vendidos' },
    { number: '15', label: 'Anos de Experiência' },
    { number: '4.9/5', label: 'Avaliação Clientes' },
  ];

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/images/hero-bg.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/85 to-gray-900/90" />
      </div>

      <Container className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <div className="mb-8">
            <Typography 
              variant="h1" 
              className="text-white mb-6"
            >
              Encontre o <span className="text-emerald-400">Imóvel Perfeito</span> em Guararema
            </Typography>
            <Typography 
              variant="large" 
              className="text-gray-200 max-w-2xl mx-auto"
            >
              Mais de 15 anos conectando famílias aos seus lares ideais. 
              Especialistas em compra, venda e locação na região.
            </Typography>
          </div>

          {/* Search Form */}
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-xl mb-12 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="O que você procura?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
                >
                  <option value="">Tipo de Imóvel</option>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
                >
                  <option value="">Localização</option>
                  <option value="centro">Centro</option>
                  <option value="jardim-santa-maria">Jardim Santa Maria</option>
                  <option value="ponte-grande">Ponte Grande</option>
                  <option value="jardim-sao-carlos">Jardim São Carlos</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleSearch}
                className="flex-1"
                size="lg"
              >
                <Search className="mr-2 h-5 w-5" />
                Buscar Imóveis
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.open('https://wa.me/5511981845016?text=Olá! Gostaria de uma avaliação profissional sobre imóveis em Guararema.', '_blank')}
              >
                Falar com Corretor
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-5 w-5 text-emerald-400 mr-1" />
                  <Typography variant="h3" className="text-white">
                    {stat.number}
                  </Typography>
                </div>
                <Typography variant="small" className="text-gray-300">
                  {stat.label}
                </Typography>
              </div>
            ))}
          </div>

          {/* CTA Links */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/comprar" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Ver Imóveis para Compra
            </Link>
            <Link href="/alugar" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Ver Imóveis para Aluguel
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}