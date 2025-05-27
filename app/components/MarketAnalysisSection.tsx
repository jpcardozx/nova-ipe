'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MarketAnalysisProps {
    variant?: 'default' | 'premium' | 'investor';
}

export const MarketAnalysisSection = ({ variant = 'default' }: MarketAnalysisProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const steps = [
        {
            icon: '📊',
            title: 'Análise de Mercado',
            description: 'Avaliamos 500+ transações recentes em Guararema',
            stat: 'R$ 120M+ analisados'
        },
        {
            icon: '🏠',
            title: 'Comparativo Local',
            description: 'Comparamos com imóveis similares no raio de 2km',
            stat: '95% de precisão'
        },
        {
            icon: '📈',
            title: 'Potencial de Valorização',
            description: 'Projetamos o crescimento nos próximos 5 anos',
            stat: '+12% ao ano'
        },
        {
            icon: '✅',
            title: 'Relatório Completo',
            description: 'Receba um relatório detalhado personalizado',
            stat: 'Gratuito'
        }
    ];

    const benefits = [
        '✓ Avaliação baseada em dados reais do mercado',
        '✓ Consultoria personalizada com especialista local',
        '✓ Estratégias de precificação otimizada',
        '✓ Identificação de oportunidades de investimento'
    ];

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 lg:p-12 shadow-xl border border-blue-100">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></span>
                        Análise Exclusiva Ipê
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                        Descubra o verdadeiro valor do seu imóvel
                    </h2>

                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Nossa expertise de 15+ anos em Guararema se traduz em avaliações precisas
                        e estratégias personalizadas para maximizar seus investimentos.
                    </p>
                </div>

                {/* Process Steps */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                    {/* Steps Visual */}
                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{
                                    opacity: isVisible ? 1 : 0,
                                    x: isVisible ? 0 : -50
                                }}
                                transition={{ delay: index * 0.2 }}
                                className={`flex items-start p-6 rounded-2xl transition-all duration-500 cursor-pointer ${currentStep === index
                                        ? 'bg-white shadow-lg border-2 border-blue-200'
                                        : 'bg-white/50 hover:bg-white/80'
                                    }`}
                                onMouseEnter={() => setCurrentStep(index)}
                            >
                                <div className="text-4xl mr-4 flex-shrink-0">{step.icon}</div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-600 mb-2">{step.description}</p>
                                    <div className="text-sm font-semibold text-blue-600">
                                        {step.stat}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Benefits & CTA */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">
                            Por que escolher nossa análise?
                        </h3>

                        <div className="space-y-4 mb-8">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="flex items-center text-slate-700"
                                >
                                    <span className="text-green-500 mr-3">{benefit.split(' ')[0]}</span>
                                    <span>{benefit.substring(2)}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Trust Elements */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="text-center p-4 bg-slate-50 rounded-xl">
                                <div className="text-2xl font-bold text-slate-900">500+</div>
                                <div className="text-sm text-slate-600">Avaliações realizadas</div>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-xl">
                                <div className="text-2xl font-bold text-slate-900">95%</div>
                                <div className="text-sm text-slate-600">Precisão comprovada</div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="space-y-4">
                            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                                Solicitar Análise Gratuita
                            </button>

                            <div className="flex items-center justify-center text-sm text-slate-500">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Seus dados estão seguros conosco
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Proof */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            O que dizem nossos clientes
                        </h3>
                        <div className="flex justify-center items-center space-x-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                            <span className="ml-2 text-slate-600">4.9/5 de satisfação</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                text: "A análise foi precisa e me ajudou a vender 15% acima do valor inicial que tinha em mente.",
                                author: "Maria S., Centro"
                            },
                            {
                                text: "Profissionalismo impecável. Recebi o relatório no prazo e com todos os detalhes prometidos.",
                                author: "João R., Itapema"
                            },
                            {
                                text: "Conhecimento local impressionante. Sabem exatamente o mercado de Guararema.",
                                author: "Ana L., Jardim Florestal"
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-slate-700 mb-3 text-sm italic">"{testimonial.text}"</p>
                                <div className="text-xs text-slate-500 font-medium">{testimonial.author}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
