'use client';

import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Nova Ipê
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Encontre o imóvel dos seus sonhos com a Nova Ipê, sua imobiliária de confiança.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Imóveis para Venda
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Explore nossa seleção de casas e apartamentos à venda.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Imóveis para Locação
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Encontre o aluguel perfeito para você e sua família.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Atendimento Especializado
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nossa equipe está pronta para ajudá-lo em cada etapa.
              </p>
            </div>
          </div>
          
          <div className="mt-16">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Ver Imóveis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
