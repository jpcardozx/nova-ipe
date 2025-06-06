'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileCheck, Key, TrendingUp, UserCheck, ClipboardCheck, Sparkles, LucideIcon } from 'lucide-react';

interface Step {
    id: number;
    icon: LucideIcon;
    title: string;
    description: string;
}

interface Section {
    id: string;
    title: string;
    description: string;
    steps: Step[];
}

const sections: Section[] = [
    {
        id: "avaliacao",
        title: "Para Compradores",
        description: "O caminho para sua propriedade ideal",
        steps: [
            {
                id: 1,
                icon: Search,
                title: "Avaliação de Requisitos",
                description: "Análise detalhada das suas necessidades específicas e perfil de investimento.",
            },
            {
                id: 2,
                icon: ClipboardCheck,
                title: "Seleção Premium",
                description: "Curadoria personalizada das melhores opções que atendem seus critérios.",
            },
            {
                id: 3,
                icon: Key,
                title: "Negociação Especializada",
                description: "Condução estratégica de todo o processo de aquisição.",
            }
        ]
    },
    {
        id: "venda",
        title: "Para Vendedores",
        description: "Maximize o valor do seu imóvel",
        steps: [
            {
                id: 1,
                icon: Sparkles,
                title: "Avaliação Profissional",
                description: "Análise completa do potencial de mercado do seu imóvel.",
            },
            {
                id: 2,
                icon: UserCheck,
                title: "Exposição Premium",
                description: "Apresentação estratégica para compradores qualificados.",
            },
            {
                id: 3,
                icon: TrendingUp,
                title: "Valorização Garantida",
                description: "Estratégias para maximizar o retorno do seu investimento.",
            }
        ]
    }
];

export default function ClientProgressSteps() {
    return (
        <section className="py-24 bg-neutral-50 relative overflow-hidden">
            {/* Background Sutil */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[url('/patterns/premium-pattern.svg')] opacity-[0.03]" />
                <div className="absolute inset-0 bg-gradient-radial from-transparent to-neutral-100/50" />
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-6 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-6">
                        <span className="w-1 h-1 rounded-full bg-amber-500" />
                        Processo Especializado
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                        Atendimento Personalizado
                    </h2>
                    <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
                        Nossa metodologia especializada garante o melhor resultado para cada perfil de cliente
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-16">
                    {sections.map((section: Section, sectionIndex: number) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: sectionIndex * 0.2
                            }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-3">
                                <h3 className="text-2xl font-bold text-neutral-900">
                                    {section.title}
                                </h3>
                                <p className="text-neutral-600">
                                    {section.description}
                                </p>
                            </div>

                            <div className="space-y-6">
                                {section.steps.map((step: Step, stepIndex: number) => (
                                    <motion.div
                                        key={step.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.5,
                                            delay: (sectionIndex * 0.2) + (stepIndex * 0.1)
                                        }}
                                        className="flex gap-4 p-6 bg-white rounded-xl shadow-sm border border-neutral-100 hover:border-amber-200 transition-all group"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center group-hover:bg-amber-400/20 transition-colors">
                                                {React.createElement(step.icon, {
                                                    className: "w-6 h-6 text-amber-400"
                                                })}
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-lg font-semibold text-neutral-900">
                                                    {step.title}
                                                </span>
                                                <span className="text-amber-400 text-sm font-medium">
                                                    {step.id}/3
                                                </span>
                                            </div>
                                            <p className="text-neutral-600">
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-center mt-16"
                >
                    <a
                        href="#contact"
                        className="inline-flex items-center px-6 py-3 text-sm font-medium text-neutral-900 bg-amber-400 rounded-lg hover:bg-amber-300 transition-all duration-200"
                    >
                        Iniciar Consultoria
                        <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}