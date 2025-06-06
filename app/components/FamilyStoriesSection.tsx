'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Home, Users } from 'lucide-react';

interface FamilyStory {
    id: string;
    name: string;
    title: string;
    story: string;
    beforeAfter: {
        before: string;
        after: string;
    };
    icon: React.ReactNode;
    image?: string;
}

const familyStories: FamilyStory[] = [
    {
        id: 'familia-silva',
        name: 'Família Silva',
        title: 'De apartamento apertado para casa com quintal',
        story: 'Nossos filhos finalmente têm espaço para brincar e correr. A mudança para Guararema foi a melhor decisão que tomamos.',
        beforeAfter: {
            before: 'Apartamento 65m² em SP - R$ 3.200/mês só de condomínio',
            after: 'Casa 120m² com quintal - R$ 800/mês de gastos totais'
        },
        icon: <Users className="w-6 h-6" />
    },
    {
        id: 'casal-oliveira',
        name: 'Ana e Roberto',
        title: 'Trabalho remoto em casa própria',
        story: 'Conseguimos comprar nossa primeira casa e ainda economizar dinheiro todo mês. Roberto trabalha de casa com vista para o jardim.',
        beforeAfter: {
            before: 'Aluguel R$ 2.800 + gastos em SP',
            after: 'Casa própria + R$ 1.500 de economia mensal'
        },
        icon: <Home className="w-6 h-6" />
    },
    {
        id: 'dona-maria',
        name: 'Maria Santos',
        title: 'Aposentadoria tranquila',
        story: 'Vendi meu apartamento em São Paulo e comprei uma casa em Guararema. Agora tenho dinheiro guardado e vivo com muita tranquilidade.',
        beforeAfter: {
            before: 'Apartamento 2 quartos em SP - valor R$ 550k',
            after: 'Casa 3 quartos + R$ 200k investidos'
        },
        icon: <Heart className="w-6 h-6" />
    }
];

const FamilyStoriesSection = () => {
    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
                            Histórias Reais
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Famílias que mudaram de vida
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Conheça algumas das famílias que fizeram a mudança para Guararema
                            e transformaram sua qualidade de vida
                        </p>
                    </motion.div>
                </div>

                {/* Stories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {familyStories.map((story, index) => (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Icon and Name */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                    {story.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{story.name}</h3>
                                    <p className="text-sm text-gray-600">{story.title}</p>
                                </div>
                            </div>

                            {/* Story */}
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                "{story.story}"
                            </p>

                            {/* Before/After */}
                            <div className="space-y-3">
                                <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-200">
                                    <p className="text-sm text-red-800">
                                        <strong>Antes:</strong> {story.beforeAfter.before}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-200">
                                    <p className="text-sm text-green-800">
                                        <strong>Hoje:</strong> {story.beforeAfter.after}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center"
                >
                    <p className="text-lg text-gray-600 mb-6">
                        Sua família pode ser a próxima história de sucesso
                    </p>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors duration-200">
                        <Home className="w-5 h-5" />
                        Encontrar minha casa ideal
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default FamilyStoriesSection;
