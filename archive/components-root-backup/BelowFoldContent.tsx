"use client"

import React from 'react'
import Link from 'next/link'

export default function BelowFoldContent() {
    return (
        <>
            {/* Testimonials Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            O que nossos clientes dizem
                        </h2>
                        <p className="text-lg text-gray-600">
                            Depoimentos reais de quem confiou na Nova IPE
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    👤
                                </div>
                                <div className="ml-3">
                                    <h4 className="font-semibold text-gray-900">Maria Silva</h4>
                                    <p className="text-sm text-gray-600">Cliente</p>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                "Excelente atendimento! Encontrei minha casa dos sonhos rapidamente."
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    👤
                                </div>
                                <div className="ml-3">
                                    <h4 className="font-semibold text-gray-900">João Santos</h4>
                                    <p className="text-sm text-gray-600">Cliente</p>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                "Profissionais competentes e muito atenciosos. Recomendo!"
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    👤
                                </div>
                                <div className="ml-3">
                                    <h4 className="font-semibold text-gray-900">Ana Costa</h4>
                                    <p className="text-sm text-gray-600">Cliente</p>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                "Venderam meu apartamento em tempo recorde. Muito satisfeita!"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-emerald-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Pronto para encontrar seu próximo imóvel?
                    </h2>
                    <p className="text-xl text-emerald-100 mb-8">
                        Entre em contato conosco e realizaremos uma consultoria gratuita
                    </p>
                    <Link
                        href="#contato"
                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Falar Agora
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Nova IPE</h3>
                            <p className="text-gray-400">
                                Sua imobiliária de confiança há mais de 20 anos.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Serviços</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/comprar" className="hover:text-white">Comprar</Link></li>
                                <li><Link href="/alugar" className="hover:text-white">Alugar</Link></li>
                                <li><Link href="/vender" className="hover:text-white">Vender</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Contato</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>📞 (11) 99999-9999</li>
                                <li>📧 contato@novaipe.com.br</li>
                                <li>📍 São Paulo, SP</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Redes Sociais</h4>
                            <div className="flex space-x-4">
                                <span className="text-gray-400">📘</span>
                                <span className="text-gray-400">📷</span>
                                <span className="text-gray-400">🐦</span>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 Nova IPE. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}
