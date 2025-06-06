'use client';

import React from 'react';

// === HOMEPAGE DEFINITIVA - ARQUITETURA LIMPA ===
export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* === HERO SECTION - IMPACTO MÁXIMO === */}
      <section className="relative min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo/Brand */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Nova Ipê
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full"></div>
            </div>

            {/* Headline Principal */}
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Encontre o Imóvel dos Seus Sonhos em
              <span className="block text-amber-600">Guararema</span>
            </h2>

            {/* Subheadline Engajante */}
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Especialistas em imóveis premium. Transformamos sonhos em realidade
              com atendimento personalizado e resultados excepcionais.
            </p>

            {/* CTAs Principais */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                Ver Imóveis Disponíveis
              </button>
              <button className="border-2 border-amber-500 text-amber-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-amber-50 transition-all">
                Avaliar Meu Imóvel
              </button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">500+</div>
                <div className="text-gray-600">Imóveis Vendidos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">15</div>
                <div className="text-gray-600">Anos de Experiência</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">98%</div>
                <div className="text-gray-600">Clientes Satisfeitos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-amber-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-orange-200 rounded-full opacity-30 animate-float-delayed"></div>
      </section>

      {/* === VALOR SECTION - CONVERSÃO === */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Descubra o Valor do Seu Imóvel
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Avaliação gratuita e precisa em menos de 24 horas
            </p>
          </div>

          {/* Calculadora Visual */}
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-lg">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Avaliação Profissional</h3>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Endereço do imóvel"
                className="w-full p-4 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Área (m²)"
                  className="w-full p-4 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <select className="w-full p-4 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  <option>Tipo de imóvel</option>
                  <option>Casa</option>
                  <option>Apartamento</option>
                  <option>Terreno</option>
                </select>
              </div>
              <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                Avaliar Gratuitamente
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* === DIFERENCIAL SECTION - AUTORIDADE === */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Por Que Escolher a Nova Ipê?
            </h2>
            <p className="text-xl text-gray-600">
              Somos diferentes porque focamos no que realmente importa: você
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Diferencial 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Atendimento Personalizado</h3>
              <p className="text-gray-600">
                Cada cliente é único. Criamos estratégias específicas para suas necessidades e objetivos.
              </p>
            </div>

            {/* Diferencial 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-6">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Análise de Mercado</h3>
              <p className="text-gray-600">
                Dados precisos e análises profundas para garantir as melhores decisões.
              </p>
            </div>

            {/* Diferencial 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-6">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Resultados Rápidos</h3>
              <p className="text-gray-600">
                Processos otimizados que aceleram vendas e compras sem comprometer a qualidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === CONTATO SECTION - CONVERSÃO FINAL === */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Entre em contato agora e transforme seus objetivos em realidade
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-white text-amber-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
              WhatsApp: (11) 99999-9999
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-amber-600 transition-all">
              Agendar Reunião
            </button>
          </div>

          <p className="text-amber-100">
            📍 Guararema, SP | 📧 contato@novaipe.com.br
          </p>
        </div>      </section>
    </main>
  );
}