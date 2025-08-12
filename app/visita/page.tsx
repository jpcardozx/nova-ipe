import React from 'react'
import { Metadata } from 'next'
import VisitaHeroClean from './components/VisitaHeroClean'

export const metadata: Metadata = {
    title: 'Agende sua Visita | Ipê Concept',
    description: 'Agende uma visita gratuita aos nossos imóveis em Guararema.',
}

export default function VisitaPage() {
    return (
        <main className="min-h-screen">
            <VisitaHeroClean />

            {/* Simple visit form section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Como prefere agendar?
                        </h2>
                        <p className="text-lg text-slate-600">
                            Escolha a forma mais conveniente para você
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* WhatsApp Option */}
                        <div className="text-center p-6 border-2 border-amber-200 rounded-xl hover:border-amber-500 transition-colors">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.687" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                Via WhatsApp
                            </h3>
                            <p className="text-slate-600 mb-4">
                                Resposta imediata e agendamento rápido
                            </p>
                            <a
                                href="https://wa.me/5511999999999?text=Olá! Gostaria de agendar uma visita"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Agendar no WhatsApp
                            </a>
                        </div>

                        {/* Phone Option */}
                        <div className="text-center p-6 border-2 border-slate-200 rounded-xl hover:border-slate-400 transition-colors">
                            <div className="w-16 h-16 bg-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                Por Telefone
                            </h3>
                            <p className="text-slate-600 mb-4">
                                Fale diretamente com nossos especialistas
                            </p>
                            <a
                                href="tel:+5511999999999"
                                className="inline-flex items-center justify-center w-full bg-slate-500 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                (11) 9 9999-9999
                            </a>
                        </div>
                    </div>

                    {/* Additional info */}
                    <div className="mt-8 p-6 bg-amber-50 rounded-xl">
                        <h4 className="font-semibold text-slate-900 mb-2">O que está incluso na visita:</h4>
                        <ul className="space-y-2 text-slate-700">
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Visita acompanhada por corretor especializado
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Informações completas sobre o imóvel e região
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Orientação sobre documentação e financiamento
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Atendimento sem compromisso
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    )
}
