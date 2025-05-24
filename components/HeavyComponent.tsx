"use client"

import React from 'react'

export default function HeavyComponent() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Nossos Serviços
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Oferecemos uma gama completa de serviços imobiliários para atender todas as suas necessidades.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            🏠
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Compra</h3>
                        <p className="text-gray-600">
                            Encontre o imóvel dos seus sonhos com nossa assessoria completa e especializada.
                        </p>
                    </div>

                    <div className="text-center p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            💰
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Venda</h3>
                        <p className="text-gray-600">
                            Venda seu imóvel rapidamente com nossa estratégia de marketing digital.
                        </p>
                    </div>

                    <div className="text-center p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            🏘️
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Locação</h3>
                        <p className="text-gray-600">
                            Alugue com segurança através do nosso processo de análise rigoroso.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
