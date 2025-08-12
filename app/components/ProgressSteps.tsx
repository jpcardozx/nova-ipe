'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
    Coffee,
    MapPin,
    Home,
    ArrowRight,
    Calendar,
    Clock,
    Star,
    Quote,
    CheckCircle,
    MessageCircle,
    Phone,
    TreePine,
    Plus,
    Minus
} from 'lucide-react'

interface TimelineStep {
    id: string
    week: string
    title: string
    description: string
    action: string
    result: string
    icon: React.ReactNode
}

const timelineSteps: TimelineStep[] = [
    {
        id: "conversa",
        week: "Semana 1",
        title: "Uma conversa honesta",
        description: "Sem vendas, sem pressão. Apenas uma conversa sobre o que você realmente busca em Guararema.",
        action: "Café de 1h no nosso escritório ou videochamada",
        result: "Clareza sobre seus objetivos e próximos passos",
        icon: <Coffee className="w-5 h-5" />
    },
    {
        id: "imersao",
        week: "Semana 2",
        title: "Imersão na cidade",
        description: "Um dia inteiro conhecendo Guararema como morador, não como turista. Bairros, escolas, comércio, rotina real.",
        action: "Tour personalizado de 6h pela cidade",
        result: "Decisão informada sobre mudar ou não",
        icon: <MapPin className="w-5 h-5" />
    },
    {
        id: "selecao",
        week: "Semana 3-4",
        title: "Seleção cirúrgica",
        description: "Máximo 3 imóveis que realmente fazem sentido para você. Análise completa de cada opção.",
        action: "Visitas detalhadas com análise técnica",
        result: "Escolha certeira, sem desperdício de tempo",
        icon: <Home className="w-5 h-5" />
    }
]

const testimonials = [
    {
        quote: "Não queriam só vender. Queriam entender se Guararema era mesmo para nós. Foi.",
        author: "Ana Castro",
        role: "Empresária, mudou-se em 2023",
        rating: 5
    },
    {
        quote: "Em 3 semanas encontramos nossa casa. Em 3 meses já tínhamos amigos. Processo impecável.",
        author: "Roberto Lima",
        role: "Arquiteto, mudou-se em 2024",
        rating: 5
    }
]

const ProcessoGuararema: React.FC = () => {
    const [activeStep, setActiveStep] = useState<string>("conversa");
    const [showContact, setShowContact] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

    return (
        <section ref={containerRef} className="py-20 bg-white relative overflow-hidden">
            {/* Subtle background element */}
            <motion.div
                style={{ opacity, scale }}
                className="absolute top-20 right-0 w-96 h-96 opacity-[0.03]"
            >
                <TreePine className="w-full h-full" />
            </motion.div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header - Direct and Clear */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        3 semanas para descobrir se
                        <span className="text-green-600"> Guararema é para você</span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        Sem tours genéricos. Sem pressão de vendas.
                        Apenas um processo honesto para uma decisão importante.
                    </p>

                    {/* Quick proof */}
                    <div className="inline-flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Processo de 3-4 semanas</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-current text-yellow-500" />
                            <span>5.0 de avaliação</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            <span>Atendimento personalizado</span>
                        </div>
                    </div>
                </motion.div>

                {/* Timeline - Visual and Clear */}
                <div className="mb-20">
                    <div className="relative">
                        {/* Progress line */}
                        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200">
                            <motion.div
                                className="h-full bg-green-500"
                                initial={{ width: "0%" }}
                                animate={{
                                    width: activeStep === "conversa" ? "0%" :
                                        activeStep === "imersao" ? "50%" : "100%"
                                }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        {/* Steps */}
                        <div className="relative grid md:grid-cols-3 gap-8">
                            {timelineSteps.map((step, index) => (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => setActiveStep(step.id)}
                                    className="relative cursor-pointer"
                                >
                                    {/* Step indicator */}
                                    <div className={`
                                        absolute top-0 left-0 w-16 h-16 rounded-full 
                                        flex items-center justify-center transition-all
                                        ${activeStep === step.id
                                            ? 'bg-green-500 text-white scale-110'
                                            : 'bg-white border-2 border-gray-300 text-gray-600'}
                                    `}>
                                        {step.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="pt-20">
                                        <div className="text-sm font-medium text-gray-500 mb-1">
                                            {step.week}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group flex items-center justify-between">
                                            {step.title}
                                            <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                                                {activeStep === step.id ?
                                                    <Minus className="w-4 h-4" /> :
                                                    <Plus className="w-4 h-4" />
                                                }
                                            </span>
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {step.description}
                                        </p>

                                        <AnimatePresence>
                                            {activeStep === step.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="space-y-3 mt-4 pt-4 border-t"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 mb-1">
                                                            O que acontece:
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {step.action}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 mb-1">
                                                            Resultado:
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {step.result}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Social Proof */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 rounded-2xl p-6"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                                ))}
                            </div>
                            <Quote className="w-8 h-8 text-gray-300 mb-3" />
                            <p className="text-gray-700 mb-4 italic">
                                "{testimonial.quote}"
                            </p>
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {testimonial.author}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {testimonial.role}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA - Clear and Direct */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-10 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Comece com uma conversa
                        </h3>
                        <p className="text-lg text-green-100 mb-8 max-w-xl mx-auto">
                            Sem compromisso. Sem custo. Apenas uma conversa honesta
                            sobre suas expectativas e se podemos ajudar.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/visitas"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 
                                         bg-white text-green-700 rounded-xl font-semibold 
                                         hover:bg-green-50 transition-colors"
                            >
                                <Calendar className="w-5 h-5" />
                                Agendar conversa inicial
                                <ArrowRight className="w-5 h-5" />
                            </a>

                            <button
                                onClick={() => setShowContact(!showContact)}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 
                                         bg-green-800 text-white rounded-xl font-semibold 
                                         hover:bg-green-900 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                (11) 9xxxx-xxxx
                            </button>
                        </div>

                        <p className="text-sm text-green-200 mt-6">
                            Atendemos apenas 3 processos por mês para garantir qualidade
                        </p>
                    </div>

                    {/* Quick contact expansion */}
                    <AnimatePresence>
                        {showContact && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 p-4 bg-gray-50 rounded-xl"
                            >
                                <p className="text-gray-700">
                                    WhatsApp direto: (11) 9xxxx-xxxx<br />
                                    Horário: Seg-Sex 9h-18h, Sáb 9h-13h
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    )
}

export default ProcessoGuararema