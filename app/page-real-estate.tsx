'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Phone, Mail, Home, Building, Users, Award } from 'lucide-react';
import type { ImovelClient } from '../src/types/imovel-client';

interface HomePageProps {
  propertiesForSale: ImovelClient[];
  propertiesForRent: ImovelClient[];
  featuredProperties: ImovelClient[];
}

export default function RealEstateHomePage({
  propertiesForSale,
  propertiesForRent,
  featuredProperties
}: HomePageProps) {
  const [searchType, setSearchType] = useState<'venda' | 'aluguel'>('venda');
  const [searchLocation, setSearchLocation] = useState('');

  const stats = [
    { icon: Home, label: 'Imóveis Vendidos', value: '500+' },
    { icon: Users, label: 'Famílias Atendidas', value: '400+' },
    { icon: Award, label: 'Anos de Experiência', value: '15+' },
    { icon: Building, label: 'Imóveis Disponíveis', value: '50+' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      tipo: searchType,
      ...(searchLocation && { localizacao: searchLocation })
    });
    window.location.href = `/catalogo?${searchParams.toString()}`;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section - Real Estate Focus */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Encontre seu Imóvel em <span className="text-yellow-400">Guararema</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              15 anos ajudando famílias a encontrar o lar perfeito.
              Mais de 500 imóveis vendidos e 400 famílias realizadas.
            </p>

            {/* Property Search Form */}
            <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto shadow-lg">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setSearchType('venda')}
                      className={`px-6 py-2 rounded-md font-medium transition-colors ${searchType === 'venda'
                          ? 'bg-green-600 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Comprar
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchType('aluguel')}
                      className={`px-6 py-2 rounded-md font-medium transition-colors ${searchType === 'aluguel'
                          ? 'bg-green-600 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Alugar
                    </button>
                  </div>

                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Onde você quer morar em Guararema?"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="contact-btn flex items-center gap-2 px-8 py-3"
                  >
                    <Search className="h-5 w-5" />
                    Buscar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Imóveis em Destaque</h2>
              <p className="text-lg text-gray-600">Selecionamos os melhores imóveis para você</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.slice(0, 6).map((property) => (
                <div key={property.id} className="property-card">
                  <div className="relative h-64">
                    <Image
                      src={property.imagem?.imagemUrl || '/placeholder-property.jpg'}
                      alt={property.titulo || 'Imóvel'}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="property-type">
                        {property.finalidade}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {property.titulo}
                    </h3>

                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.cidade || 'Guararema'}</span>
                    </div>

                    <div className="property-features mb-4">
                      {property.dormitorios && property.dormitorios > 0 && (
                        <span className="property-feature">
                          🛏️ {property.dormitorios} quartos
                        </span>
                      )}
                      {property.banheiros && property.banheiros > 0 && (
                        <span className="property-feature">
                          🚿 {property.banheiros} banheiros
                        </span>
                      )}
                      {property.areaUtil && (
                        <span className="property-feature">
                          📐 {property.areaUtil}m²
                        </span>
                      )}
                    </div>

                    <div className="property-price mb-4">
                      R$ {property.preco?.toLocaleString('pt-BR') || 'Consulte'}
                    </div>

                    <Link
                      href={`/imovel/${property.slug || property.id || property._id}`}
                      className="contact-btn w-full text-center block"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/catalogo"
                className="inline-flex items-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                Ver Todos os Imóveis
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Quick Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            O que você está procurando?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/comprar" className="group">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center mb-4">
                  <Home className="h-12 w-12 mr-4" />
                  <div>
                    <h3 className="text-2xl font-bold">Comprar Imóvel</h3>
                    <p className="text-blue-100">Encontre sua casa própria</p>
                  </div>
                </div>
                <p className="text-lg">
                  {propertiesForSale.length} imóveis disponíveis para compra em Guararema e região
                </p>
              </div>
            </Link>

            <Link href="/alugar" className="group">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-8 text-white hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center mb-4">
                  <Building className="h-12 w-12 mr-4" />
                  <div>
                    <h3 className="text-2xl font-bold">Alugar Imóvel</h3>
                    <p className="text-purple-100">Encontre o lar ideal</p>
                  </div>
                </div>
                <p className="text-lg">
                  {propertiesForRent.length} imóveis disponíveis para aluguel com preços acessíveis
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section - Local Focus */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Especialistas em Guararema há 15 anos
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Conhecemos cada bairro, cada rua e cada oportunidade em Guararema.
                Nossa experiência local faz toda a diferença na hora de encontrar
                o imóvel perfeito para sua família.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span>Avaliação gratuita do seu imóvel</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span>Acompanhamento completo da documentação</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span>Negociação personalizada</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span>Suporte jurídico especializado</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:(11)99999-9999"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  (11) 99999-9999
                </a>
                <a
                  href="mailto:contato@ipeimoveis.com.br"
                  className="inline-flex items-center justify-center px-6 py-3 border border-green-600 text-green-600 hover:bg-green-50 font-semibold rounded-lg transition-colors"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Enviar E-mail
                </a>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/images/guararema-office.jpg"
                alt="Escritório Ipê Imóveis em Guararema"
                width={600}
                height={400}
                className="rounded-lg shadow-lg object-cover w-full h-80"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para encontrar seu novo lar?
          </h2>
          <p className="text-xl mb-8">
            Entre em contato conosco hoje mesmo e deixe que nossa experiência
            trabalhe para você.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contato"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Falar com Especialista
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              Ver Imóveis Disponíveis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}