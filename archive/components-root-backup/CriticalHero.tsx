"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CriticalHero() {
    return (
        <section className="relative min-h-screen bg-gradient-to-br from-emerald-50 to-white pt-16">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-center min-h-screen py-20">
                    <div className="max-w-3xl">
                        {/* Badge */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-8">
                            🏡 Especialistas em Imóveis
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Encontre o{' '}
                            <span className="text-emerald-600">imóvel perfeito</span>{' '}
                            para você
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Mais de 20 anos conectando pessoas aos seus sonhos.
                            Compra, venda e locação com total segurança e transparência.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/comprar"
                                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Ver Imóveis
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="#contato"
                                className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
                            >
                                Falar com Consultor
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-200">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">500+</div>
                                <div className="text-sm text-gray-600">Imóveis Vendidos</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">20+</div>
                                <div className="text-sm text-gray-600">Anos de Experiência</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">98%</div>
                                <div className="text-sm text-gray-600">Clientes Satisfeitos</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
