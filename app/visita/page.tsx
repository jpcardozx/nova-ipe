import React from 'react'
import { Metadata } from 'next'
import { Calendar, Clock, MapPin, Users, CheckCircle, Phone, MessageCircle, Shield, Award, ArrowRight, Send } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Agende sua Visita | Ipê Concept',
    description: 'Agende uma visita gratuita aos nossos imóveis em Guararema.',
}

export default function VisitaPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Professional Header Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {/* Company Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6">
                            <Calendar className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium">Agendamento de Visitas</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Agende Sua Visita
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Visite nossos imóveis com acompanhamento especializado. Atendimento personalizado e sem compromisso.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <a
                                href="https://wa.me/5511999999999?text=Olá! Gostaria de agendar uma visita"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                            >
                                <MessageCircle className="w-6 h-6" />
                                Agendar no WhatsApp
                            </a>
                            <a
                                href="tel:+5511999999999"
                                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg backdrop-blur-sm transition-all duration-200"
                            >
                                <Phone className="w-6 h-6" />
                                Ligar Agora
                            </a>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Clock className="w-6 h-6 text-amber-400" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">24h</div>
                            <div className="text-sm text-gray-300">Resposta garantida</div>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Users className="w-6 h-6 text-amber-400" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">500+</div>
                            <div className="text-sm text-gray-300">Visitas realizadas</div>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Award className="w-6 h-6 text-amber-400" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">100%</div>
                            <div className="text-sm text-gray-300">Gratuitas</div>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Shield className="w-6 h-6 text-amber-400" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">15+</div>
                            <div className="text-sm text-gray-300">Anos de experiência</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Visit Scheduling Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-5 gap-12">

                        {/* Visit Information Sidebar */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Contact Methods */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                    Formas de Agendamento
                                </h3>

                                <div className="space-y-4">
                                    {/* WhatsApp */}
                                    <a
                                        href="https://wa.me/5511999999999?text=Olá! Gostaria de agendar uma visita"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors group"
                                    >
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                                            <MessageCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                                            <p className="text-gray-600">Resposta imediata</p>
                                            <p className="text-sm text-gray-500">(11) 9 9999-9999</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                                    </a>

                                    {/* Phone */}
                                    <a
                                        href="tel:+5511999999999"
                                        className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-amber-300 transition-colors group"
                                    >
                                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-amber-200 transition-colors">
                                            <Phone className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Telefone</h4>
                                            <p className="text-gray-600">Atendimento direto</p>
                                            <p className="text-sm text-gray-500">(11) 9 9999-9999</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                                    </a>
                                </div>
                            </div>

                            {/* Visit Hours */}
                            <div className="bg-gray-900 text-white p-6 rounded-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <Clock className="w-5 h-5 text-amber-400" />
                                    <h4 className="font-semibold">Horários de Visita</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Segunda - Sexta</span>
                                        <span>9:00 - 18:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sábados</span>
                                        <span>9:00 - 16:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Domingos</span>
                                        <span>9:00 - 14:00</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-gray-700">
                                        <span>Agendamento antecipado</span>
                                        <span className="text-amber-400">Recomendado</span>
                                    </div>
                                </div>
                            </div>

                            {/* Location Info */}
                            <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <MapPin className="w-5 h-5 text-amber-600" />
                                    <h4 className="font-semibold text-gray-900">Regiões Atendidas</h4>
                                </div>
                                <div className="text-sm text-gray-700 space-y-1">
                                    <div>• Guararema Centro</div>
                                    <div>• Itapema</div>
                                    <div>• Portal do Paraíso</div>
                                    <div>• Mogi das Cruzes</div>
                                    <div>• Jacareí</div>
                                    <div>• Suzano</div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg border border-gray-200 p-8">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Escolha a Melhor Forma para Você
                                    </h2>
                                    <p className="text-gray-600">
                                        Oferecemos diferentes canais de atendimento para sua conveniência
                                    </p>
                                </div>

                                {/* Contact Options Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    {/* WhatsApp Option */}
                                    <div className="text-center p-6 border-2 border-green-200 rounded-xl hover:border-green-400 transition-colors group">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <MessageCircle className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Via WhatsApp
                                        </h3>
                                        <p className="text-gray-600 mb-4">
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
                                    <div className="text-center p-6 border-2 border-amber-200 rounded-xl hover:border-amber-400 transition-colors group">
                                        <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Phone className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Por Telefone
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Fale diretamente com nossos especialistas
                                        </p>
                                        <a
                                            href="tel:+5511999999999"
                                            className="inline-flex items-center justify-center w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                        >
                                            (11) 9 9999-9999
                                        </a>
                                    </div>
                                </div>

                                {/* What's Included Section */}
                                <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl mb-8">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-amber-600" />
                                        O que está incluído na visita:
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">Visita acompanhada por corretor especializado</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">Informações completas sobre o imóvel</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">Orientação sobre documentação</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">Atendimento sem compromisso</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">Análise da região e infraestrutura</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">Suporte para financiamento</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Privacy Notice */}
                                <div className="text-center pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                        <Shield className="w-4 h-4 text-amber-600" />
                                        <span>Atendimento profissional e respeitoso garantido</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}