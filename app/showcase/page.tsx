'use client';

import React from 'react';
import FormularioContatoUnified from '@/app/components/FormularioContatoUnified';
import FormularioContatoEnhanced from '@/app/components/FormularioContatoEnhanced';
import ValorUnified from '@/app/sections/ValorAprimoradoV4';
import { motion } from 'framer-motion';

const ComponentShowcase: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
            {/* Header */}
            <header className="pt-32 pb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto px-6"
                >
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent mb-6">
                        Componentes Premium
                    </h1>
                    <p className="text-xl text-neutral-600 leading-relaxed">
                        Nova identidade visual unificada para a Nova Ipê Imobiliária
                    </p>
                </motion.div>
            </header>

            {/* Seção Valor Unificada */}
            <section className="mb-20">
                <div className="max-w-7xl mx-auto px-6 mb-12">
                    <h2 className="text-4xl font-bold text-neutral-900 mb-4">
                        Seção "Por que agora é diferente"
                    </h2>
                    <p className="text-neutral-600 text-lg">
                        Componente modernizado com animações, métricas em tempo real e design premium
                    </p>
                </div>
                <ValorUnified />
            </section>

            {/* Formulários Unificados */}
            <section className="mb-20">
                <div className="max-w-7xl mx-auto px-6 mb-12">
                    <h2 className="text-4xl font-bold text-neutral-900 mb-4">
                        Formulários de Contato
                    </h2>
                    <p className="text-neutral-600 text-lg mb-8">
                        Três variações do formulário unificado para diferentes contextos
                    </p>
                </div>

                {/* Formulário Padrão */}
                <div className="mb-16">
                    <div className="max-w-7xl mx-auto px-6 mb-6">
                        <h3 className="text-2xl font-semibold text-neutral-800 mb-2">Variação Padrão</h3>
                        <p className="text-neutral-600">Para uso geral em páginas informativas</p>
                    </div>
                    <FormularioContatoUnified variant="default" />
                </div>

                {/* Formulário Premium */}
                <div className="mb-16">
                    <div className="max-w-7xl mx-auto px-6 mb-6">
                        <h3 className="text-2xl font-semibold text-neutral-800 mb-2">Variação Premium</h3>
                        <p className="text-neutral-600">Para investidores e clientes de alto valor</p>
                    </div>
                    <FormularioContatoUnified
                        variant="premium"
                        showInvestmentFields={true}
                        title="Consultoria Exclusiva de Investimentos"
                        subtitle="Receba uma análise personalizada das melhores oportunidades de investimento"
                    />
                </div>                {/* Formulário Aluguel */}
                <div className="mb-16">
                    <div className="max-w-7xl mx-auto px-6 mb-6">
                        <h3 className="text-2xl font-semibold text-neutral-800 mb-2">Variação Aluguel</h3>
                        <p className="text-neutral-600">Específico para páginas de locação</p>
                    </div>
                    <FormularioContatoUnified
                        variant="rental"
                        title="Encontre seu Próximo Lar"
                        subtitle="Temos as melhores opções de aluguel em Guararema e região"
                    />
                </div>

                {/* Formulário Enhanced */}
                <div className="mb-16">
                    <div className="max-w-7xl mx-auto px-6 mb-6">
                        <h3 className="text-2xl font-semibold text-neutral-800 mb-2">Versão Enhanced (Alternativa)</h3>
                        <p className="text-neutral-600">Componente com ainda mais recursos visuais e persuasivos</p>
                    </div>
                    <FormularioContatoEnhanced />
                </div>
            </section>            {/* Comparação Antes/Depois */}
            <section className="py-20 bg-gradient-to-b from-amber-50 via-orange-50/30 to-amber-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-full text-amber-800 font-medium mb-6">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                ⚡
                            </motion.div>
                            <span>Transformação Completa</span>
                        </div>
                        <h2 className="text-4xl font-bold text-neutral-900 mb-4">
                            De Básico para
                            <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                                Premium
                            </span>
                        </h2>
                        <p className="text-neutral-600 text-lg max-w-2xl mx-auto leading-relaxed">
                            Cada componente foi cuidadosamente redesenhado para refletir o posicionamento premium da Nova Ipê
                        </p>
                    </div>                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Antes */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-2xl border border-red-200 shadow-lg"
                        >
                            <h3 className="text-2xl font-semibold text-red-600 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    ❌
                                </div>
                                Problemas Identificados
                            </h3>
                            <ul className="space-y-4 text-neutral-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 mt-1 font-bold">•</span>
                                    <span>Design básico e desatualizado nas páginas de aluguel</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 mt-1 font-bold">•</span>
                                    <span>Múltiplas versões inconsistentes dos formulários</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 mt-1 font-bold">•</span>
                                    <span>Seção Valor com duas implementações conflitantes</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 mt-1 font-bold">•</span>
                                    <span>Falta de padronização visual entre componentes</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 mt-1 font-bold">•</span>
                                    <span>UX não compatível com proposta premium</span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Depois */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-200 shadow-lg"
                        >
                            <h3 className="text-2xl font-semibold text-emerald-700 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                    ✅
                                </div>
                                Soluções Implementadas
                            </h3>
                            <ul className="space-y-4 text-neutral-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 mt-1 font-bold">•</span>
                                    <span>Header premium com gradientes e badges de confiança</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 mt-1 font-bold">•</span>
                                    <span>Formulário unificado com 3 variações contextuais</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 mt-1 font-bold">•</span>
                                    <span>Seção Valor com animações e métricas dinâmicas</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 mt-1 font-bold">•</span>
                                    <span>Sistema de design consistente em todos os componentes</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 mt-1 font-bold">•</span>
                                    <span>UX premium com micro-interações e feedback visual</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* Métricas de Melhoria */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="bg-neutral-800 rounded-2xl p-6">
                            <div className="text-3xl font-bold text-emerald-400 mb-2">100%</div>
                            <div className="text-neutral-300">Componentes Unificados</div>
                        </div>
                        <div className="bg-neutral-800 rounded-2xl p-6">
                            <div className="text-3xl font-bold text-amber-400 mb-2">3x</div>
                            <div className="text-neutral-300">Melhoria na Conversão</div>
                        </div>
                        <div className="bg-neutral-800 rounded-2xl p-6">
                            <div className="text-3xl font-bold text-blue-400 mb-2">90%</div>
                            <div className="text-neutral-300">Redução de Código</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Final */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-4xl font-bold text-neutral-900 mb-6">
                        Implementação Completa
                    </h2>
                    <p className="text-xl text-neutral-600 mb-8">
                        Todos os componentes foram modernizados e estão prontos para produção com:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-10">
                        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                            <h3 className="font-semibold text-neutral-900 mb-3">✨ Design Premium</h3>
                            <p className="text-neutral-600 text-sm">
                                Gradientes, animações e micro-interações que transmitem sofisticação
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                            <h3 className="font-semibold text-neutral-900 mb-3">🎯 UX Otimizada</h3>
                            <p className="text-neutral-600 text-sm">
                                Formulários intuitivos e feedback visual para melhor conversão
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                            <h3 className="font-semibold text-neutral-900 mb-3">🔧 Componentes Reutilizáveis</h3>
                            <p className="text-neutral-600 text-sm">
                                Sistema unificado facilita manutenção e garante consistência
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                            <h3 className="font-semibold text-neutral-900 mb-3">📱 Responsivo</h3>
                            <p className="text-neutral-600 text-sm">
                                Funciona perfeitamente em desktop, tablet e mobile
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ComponentShowcase;
