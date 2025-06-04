'use client';

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
    Home, Users, Clock, CheckCircle2, TrendingUp, Building2,
    Eye, ArrowRight, Calendar, Phone, BarChart3, Clipboard,
    Key, TreePine, Star, Play
} from 'lucide-react'

interface ClientProfile {
    id: string
    title: string
    focus: string
    icon: React.ReactNode
    stats: { value: string; label: string }
}

interface ProcessStep {
    id: string
    title: string
    description: string
    timeline: string
    icon: React.ReactNode
    highlight: string
}

const ClientProgressSteps = () => {
    const [selectedProfile, setSelectedProfile] = useState('family')
    const [activeStep, setActiveStep] = useState<string | null>(null)

    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: "-50px" })

    // Perfis simplificados
    const clientProfiles: Record<string, ClientProfile> = {
        family: {
            id: 'family',
            title: 'Famílias',
            focus: 'Qualidade de vida',
            icon: <Home className="w-5 h-5" />,
            stats: { value: 'R$ 1.950', label: 'economia mensal média' }
        },
        remote: {
            id: 'remote',
            title: 'Home Office',
            focus: 'Produtividade',
            icon: <Building2 className="w-5 h-5" />,
            stats: { value: '2h30', label: 'tempo economizado/dia' }
        },
        investor: {
            id: 'investor',
            title: 'Investidores',
            focus: 'Oportunidades',
            icon: <TrendingUp className="w-5 h-5" />,
            stats: { value: '7.2% a.a.', label: 'valorização média' }
        }
    }

    // Processo simplificado em 4 etapas
    const processSteps: ProcessStep[] = [
        {
            id: 'consultation',
            title: 'Primeira Conversa',
            description: 'Entendemos suas necessidades e objetivos',
            timeline: '1h',
            icon: <Users className="w-5 h-5" />,
            highlight: 'Análise personalizada do seu perfil'
        },
        {
            id: 'research',
            title: 'Pesquisa Dirigida',
            description: 'Selecionamos as melhores oportunidades',
            timeline: '3-5 dias',
            icon: <BarChart3 className="w-5 h-5" />,
            highlight: 'Apenas opções que fazem sentido para você'
        },
        {
            id: 'visits',
            title: 'Visitas Focadas',
            description: 'Conhecemos juntos as opções selecionadas',
            timeline: '1-2 semanas',
            icon: <Eye className="w-5 h-5" />,
            highlight: 'Máximo 3 imóveis, escolhidos a dedo'
        },
        {
            id: 'closing',
            title: 'Fechamento Seguro',
            description: 'Cuidamos de tudo até a entrega das chaves',
            timeline: '2-4 semanas',
            icon: <Key className="w-5 h-5" />,
            highlight: 'Sem surpresas, total transparência'
        }
    ]

    return (
        <div ref={containerRef} className="relative bg-gradient-to-br from-stone-50 to-amber-50 py-16 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-32 h-32 bg-amber-500 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-stone-600 rounded-full blur-3xl" />
            </div>

            <motion.div
                className="relative z-10 max-w-7xl mx-auto px-6"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1 }}
            >
                {/* Header Compacto */}
                <div className="text-center mb-12">
                    <motion.div
                        className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-stone-200 text-sm text-stone-600 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <TreePine className="w-4 h-4" />
                        <span>Processo Guararema • 15 anos de experiência</span>
                    </motion.div>

                    <motion.h1
                        className="text-3xl md:text-4xl font-bold text-stone-900 mb-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Como encontrar sua casa ideal
                        <span className="block text-amber-700">em Guararema</span>
                    </motion.h1>

                    <motion.p
                        className="text-lg text-stone-600 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Processo simplificado e transparente para sua família
                    </motion.p>
                </div>

                {/* Profile Selection Horizontal */}
                <motion.div
                    className="flex justify-center gap-4 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    {Object.entries(clientProfiles).map(([id, profile]) => (
                        <motion.button
                            key={id}
                            onClick={() => setSelectedProfile(id)}
                            className={`relative flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${selectedProfile === id
                                ? 'bg-stone-900 text-white shadow-lg scale-105'
                                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
                                }`}
                            whileHover={{ scale: selectedProfile === id ? 1.05 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className={selectedProfile === id ? 'text-amber-300' : 'text-amber-600'}>
                                {profile.icon}
                            </span>
                            <div className="text-left">
                                <div className="font-semibold text-sm">{profile.title}</div>
                                <div className={`text-xs ${selectedProfile === id ? 'text-stone-300' : 'text-stone-500'}`}>
                                    {profile.focus}
                                </div>
                            </div>

                            {/* Stats Badge */}
                            {selectedProfile === id && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute -top-3 -right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium"
                                >
                                    {profile.stats.value}
                                </motion.div>
                            )}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Selected Profile Highlight */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedProfile}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-stone-200">
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                            <span className="text-stone-600 text-sm">
                                {clientProfiles[selectedProfile].stats.value} {clientProfiles[selectedProfile].stats.label}
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Process Steps - Compact 4-Column Layout */}
                <div className="max-w-5xl mx-auto mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-stone-900 mb-2">
                            Nosso processo em 4 etapas
                        </h2>
                        <p className="text-stone-600">
                            Refinado com mais de 200 transações realizadas
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {processSteps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                className="relative bg-white rounded-xl p-6 border border-stone-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                                whileHover={{ y: -4 }}
                            >
                                {/* Step Number */}
                                <div className="absolute -top-3 left-4 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {index + 1}
                                </div>

                                {/* Icon */}
                                <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                                    <span className="text-stone-600 group-hover:text-amber-600">
                                        {step.icon}
                                    </span>
                                </div>

                                {/* Content */}
                                <h3 className="font-semibold text-stone-900 mb-2 text-sm">
                                    {step.title}
                                </h3>
                                <p className="text-stone-600 text-xs mb-3 leading-relaxed">
                                    {step.description}
                                </p>

                                {/* Timeline */}
                                <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                                    <Clock className="w-3 h-3" />
                                    <span>{step.timeline}</span>
                                </div>

                                {/* Highlight */}
                                <div className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                    {step.highlight}
                                </div>

                                {/* Expand Indicator */}
                                <motion.div
                                    className="absolute top-4 right-4 text-stone-400"
                                    animate={{ rotate: activeStep === step.id ? 45 : 0 }}
                                >
                                    <Play className="w-4 h-4" />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA Compacto */}
                <motion.div
                    className="max-w-2xl mx-auto text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm">
                        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>

                        <h3 className="text-xl font-bold text-stone-900 mb-3">
                            Vamos conversar sobre seu projeto
                        </h3>

                        <p className="text-stone-600 mb-6">
                            Consulta inicial sem compromisso para entender suas necessidades
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <motion.a
                                href="/agendar"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-semibold rounded-lg hover:bg-stone-800 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Calendar className="w-4 h-4" />
                                Agendar conversa
                            </motion.a>

                            <motion.a
                                href="/whatsapp"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-700 font-semibold rounded-lg border border-stone-300 hover:border-stone-400 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Phone className="w-4 h-4" />
                                WhatsApp
                            </motion.a>
                        </div>

                        <div className="text-xs text-stone-500 mt-4">
                            Resposta em até 1 hora • Segunda a sábado
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

export { ClientProgressSteps }
export default ClientProgressSteps