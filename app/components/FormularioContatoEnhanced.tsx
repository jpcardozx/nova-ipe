'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedIcons } from '@/app/utils/optimized-icons';
import { cn } from '@/lib/utils';

interface ContactFormProps {
    className?: string;
    variant?: 'default' | 'premium' | 'rental';
    title?: string;
    subtitle?: string;
    showInvestmentFields?: boolean;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    message?: string;
    investmentRange?: string;
    timeframe?: string;
    propertyType?: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
}

const FormularioContatoEnhanced: React.FC<ContactFormProps> = ({
    className = '',
    variant = 'default',
    title,
    subtitle,
    showInvestmentFields = false
}) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        message: '',
        investmentRange: '',
        timeframe: '',
        propertyType: '',
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(false);

    // Variáveis de estilo baseadas na variante
    const variantStyles = {
        default: {
            container: 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30',
            badge: 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200 text-blue-800',
            gradient: 'from-blue-600 to-indigo-600',
            accent: 'text-blue-600',
            ring: 'focus:ring-blue-500/20 focus:border-blue-500'
        },
        premium: {
            container: 'bg-gradient-to-br from-white via-amber-50/40 to-orange-50/40',
            badge: 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200 text-amber-800',
            gradient: 'from-amber-500 to-orange-600',
            accent: 'text-amber-600',
            ring: 'focus:ring-amber-500/20 focus:border-amber-500'
        },
        rental: {
            container: 'bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/40',
            badge: 'bg-gradient-to-r from-emerald-100 to-teal-100 border-emerald-200 text-emerald-800',
            gradient: 'from-emerald-500 to-teal-600',
            accent: 'text-emerald-600',
            ring: 'focus:ring-emerald-500/20 focus:border-emerald-500'
        }
    };

    const currentStyles = variantStyles[variant];

    // Conteúdo dinâmico baseado na variante com mais apelo
    const getContent = () => {
        switch (variant) {
            case 'premium':
                return {
                    badge: '💎 Consultoria VIP Gratuita',
                    title: title || 'Consultoria Imobiliária Especializada',
                    subtitle: subtitle || 'Agende uma conversa com nossos especialistas e descubra as melhores oportunidades do mercado',
                    benefits: [
                        '📊 Análise de mercado personalizada e gratuita',
                        '🏆 Acesso a imóveis selecionados',
                        '👨‍💼 Acompanhamento 1:1 durante todo o processo',
                        '💰 Consultoria de investimento sem compromisso'
                    ],
                    callToAction: 'Quero Consultoria Gratuita →',
                    urgency: '⚡ Apenas 5 consultorias por semana - Reserve já a sua!',
                    testimonial: '"Vendemos nossa casa 30% acima da média do mercado!" - Maria S.'
                };
            case 'rental':
                return {
                    badge: '🚀 Aluguel Sem Burocracia',
                    title: title || 'Encontre seu Novo Lar em 48h',
                    subtitle: subtitle || 'Processo simplificado, documentação facilitada e suporte completo para sua mudança',
                    benefits: [
                        '✅ Imóveis vistoriados e prontos para morar',
                        '⚡ Documentação simplificada em 48h',
                        '📦 Suporte na mudança e decoração',
                        '💳 Sem taxas ocultas - transparência total'
                    ],
                    callToAction: 'Quero Alugar Agora →',
                    urgency: '🔥 Novos imóveis chegam diariamente - Seja o primeiro!',
                    testimonial: '"Consegui meu apartamento em apenas 2 dias!" - João P.'
                };
            default:
                return {
                    badge: '⭐ Atendimento 5 Estrelas',
                    title: title || 'Transforme seu Sonho em Realidade',
                    subtitle: subtitle || 'Nossa equipe está pronta para ajudar você a encontrar o imóvel perfeito',
                    benefits: [
                        '🤝 Atendimento personalizado e humanizado',
                        '🏠 Amplo portfólio de imóveis verificados',
                        '📋 Processo transparente e ágil',
                        '🎯 Suporte completo do início ao fim'
                    ],
                    callToAction: 'Falar com Especialista →',
                    urgency: '⭐ Fale conosco hoje e receba atendimento prioritário!',
                    testimonial: '"Experiência incrível, recomendo!" - Ana L.'
                };
        }
    };

    const content = getContent();

    // Validação do formulário
    const validateForm = (): boolean => {
        const errors: FormErrors = {};

        if (!formData.name.trim()) {
            errors.name = 'Nome é obrigatório';
        }

        if (!formData.email.trim()) {
            errors.email = 'E-mail é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'E-mail inválido';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Telefone é obrigatório';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Envio do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Simulação de API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Limpar o formulário após sucesso
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
                investmentRange: '',
                timeframe: '',
                propertyType: '',
            });

            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            setSubmitError(true);
            setTimeout(() => setSubmitError(false), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpar erro do campo quando usuário começar a digitar
        if (formErrors[name as keyof FormErrors]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <section className={cn("py-20 bg-gradient-to-b from-neutral-50 via-white to-neutral-50", className)}>
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Coluna de Informações */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        {/* Badge Apelativo */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={cn(
                                "inline-flex items-center gap-2 px-6 py-3 rounded-full border font-semibold text-sm",
                                currentStyles.badge
                            )}
                        >
                            <motion.span
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                                {content.badge.split(' ')[0]}
                            </motion.span>
                            <span>{content.badge.substring(content.badge.indexOf(' ') + 1)}</span>
                        </motion.div>

                        {/* Título Impactante */}
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
                                {content.title}
                            </h2>
                            <p className="text-xl text-neutral-600 leading-relaxed">
                                {content.subtitle}
                            </p>
                        </div>

                        {/* Benefícios com Emojis */}
                        <div className="space-y-4">
                            {content.benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="flex items-start gap-4 p-3 bg-white/80 rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                    <span className="text-2xl">{benefit.split(' ')[0]}</span>
                                    <span className="text-neutral-700 font-medium leading-relaxed">
                                        {benefit.substring(benefit.indexOf(' ') + 1)}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Urgência */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="p-4 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-xl"
                        >
                            <p className="text-orange-800 font-semibold text-center">
                                {content.urgency}
                            </p>
                        </motion.div>

                        {/* Depoimento */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm"
                        >
                            <p className="text-neutral-600 italic text-center">
                                {content.testimonial}
                            </p>
                        </motion.div>

                        {/* Informações de Contato */}
                        <div className="pt-8 border-t border-neutral-200">
                            <div className="flex flex-wrap items-center gap-6 text-neutral-600">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-emerald-100 rounded-full">
                                        <OptimizedIcons.Phone className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="font-medium">(11) 99999-9999</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <OptimizedIcons.MapPin className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="font-medium">Guararema, SP</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Coluna do Formulário */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={cn(
                            "relative p-8 lg:p-12 rounded-3xl border-2 shadow-2xl",
                            currentStyles.container,
                            variant === 'premium' ? 'border-amber-200' :
                                variant === 'rental' ? 'border-emerald-200' : 'border-blue-200'
                        )}
                    >
                        {/* Background Decorativo */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/60 to-transparent rounded-3xl" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100/50 to-transparent rounded-3xl" />

                        <div className="relative">
                            <AnimatePresence mode="wait">
                                {submitSuccess ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="text-center py-12"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring" }}
                                            className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                        >
                                            <OptimizedIcons.Check className="w-10 h-10 text-emerald-600" />
                                        </motion.div>
                                        <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                                            🎉 Mensagem Enviada!
                                        </h3>
                                        <p className="text-lg text-neutral-600 mb-2">
                                            Entraremos em contato em breve.
                                        </p>
                                        <p className="text-sm text-neutral-500">
                                            ⏰ Geralmente respondemos em até 2 horas
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        initial={{ opacity: 1 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        {/* Header do Formulário */}
                                        <div className="text-center mb-8">
                                            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                                                {content.callToAction}
                                            </h3>
                                            <p className="text-neutral-600">
                                                Preencha os dados abaixo e fale conosco
                                            </p>
                                        </div>

                                        {/* Nome */}
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 mb-3">
                                                👤 Nome completo *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={cn(
                                                    "w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 text-lg",
                                                    formErrors.name
                                                        ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                                                        : `border-neutral-300 ${currentStyles.ring}`
                                                )}
                                                placeholder="Seu nome completo"
                                            />
                                            {formErrors.name && (
                                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                    ⚠️ {formErrors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 mb-3">
                                                📧 E-mail *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={cn(
                                                    "w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 text-lg",
                                                    formErrors.email
                                                        ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                                                        : `border-neutral-300 ${currentStyles.ring}`
                                                )}
                                                placeholder="seu@email.com"
                                            />
                                            {formErrors.email && (
                                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                    ⚠️ {formErrors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Telefone */}
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 mb-3">
                                                📱 Telefone *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={cn(
                                                    "w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 text-lg",
                                                    formErrors.phone
                                                        ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                                                        : `border-neutral-300 ${currentStyles.ring}`
                                                )}
                                                placeholder="(11) 99999-9999"
                                            />
                                            {formErrors.phone && (
                                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                    ⚠️ {formErrors.phone}
                                                </p>
                                            )}
                                        </div>

                                        {/* Mensagem */}
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 mb-3">
                                                💬 Como podemos ajudar? (opcional)
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={4}
                                                className={cn(
                                                    "w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 text-lg resize-none",
                                                    `border-neutral-300 ${currentStyles.ring}`
                                                )}
                                                placeholder="Conte-nos sobre seus objetivos e necessidades..."
                                            />
                                        </div>

                                        {/* Botão de Envio Impactante */}
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn(
                                                "w-full py-5 px-8 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed",
                                                `bg-gradient-to-r ${currentStyles.gradient}`,
                                                variant === 'premium' ? 'focus:ring-amber-500' :
                                                    variant === 'rental' ? 'focus:ring-emerald-500' : 'focus:ring-blue-500'
                                            )}
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                                    <span>Enviando sua mensagem...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-3">
                                                    <span>{content.callToAction}</span>
                                                    <motion.div
                                                        animate={{ x: [0, 5, 0] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                    >
                                                        <OptimizedIcons.ArrowRight className="w-6 h-6" />
                                                    </motion.div>
                                                </div>
                                            )}
                                        </motion.button>

                                        {/* Garantias */}
                                        <div className="pt-4 border-t border-neutral-200">
                                            <div className="flex items-center justify-center gap-6 text-sm text-neutral-600">
                                                <div className="flex items-center gap-2">
                                                    <OptimizedIcons.Shield className="w-4 h-4 text-emerald-500" />
                                                    <span>100% Seguro</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <OptimizedIcons.Clock className="w-4 h-4 text-blue-500" />
                                                    <span>Resposta Rápida</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Erro de Envio */}
                                        {submitError && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-center"
                                            >
                                                ❌ Erro ao enviar mensagem. Tente novamente ou nos chame no WhatsApp.
                                            </motion.div>
                                        )}
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FormularioContatoEnhanced;
