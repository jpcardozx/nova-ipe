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

const FormularioContatoUnified: React.FC<ContactFormProps> = ({
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
            container: 'bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/40',
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
        <section className={cn("py-20", className)}>
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Coluna de Informações */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className={cn(
                            "inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium",
                            currentStyles.badge
                        )}>
                            <OptimizedIcons.Award className="w-4 h-4" />
                            <span>{content.badge}</span>
                        </div>

                        {/* Título e Subtítulo */}
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
                                {content.title}
                            </h2>
                            <p className="text-xl text-neutral-600 leading-relaxed">
                                {content.subtitle}
                            </p>
                        </div>

                        {/* Benefícios */}
                        <div className="space-y-4">
                            {content.benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className={cn(
                                        "p-1.5 rounded-full",
                                        variant === 'premium' ? 'bg-amber-100' :
                                            variant === 'rental' ? 'bg-emerald-100' : 'bg-blue-100'
                                    )}>
                                        <OptimizedIcons.Check className={cn(
                                            "w-4 h-4",
                                            currentStyles.accent
                                        )} />
                                    </div>
                                    <span className="text-neutral-700 font-medium">{benefit}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Informações de Contato */}
                        <div className="pt-8 border-t border-neutral-200">
                            <div className="flex items-center gap-4 text-neutral-600">
                                <div className="flex items-center gap-2">
                                    <OptimizedIcons.Phone className="w-5 h-5" />
                                    <span>(11) 99999-9999</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <OptimizedIcons.MapPin className="w-5 h-5" />
                                    <span>Guararema, SP</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coluna do Formulário */}
                    <div className={cn(
                        "relative p-8 lg:p-12 rounded-3xl border border-neutral-200 shadow-xl",
                        currentStyles.container
                    )}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent rounded-3xl" />

                        <div className="relative">
                            <AnimatePresence mode="wait">
                                {submitSuccess ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <OptimizedIcons.Check className="w-8 h-8 text-emerald-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                                            Mensagem Enviada!
                                        </h3>
                                        <p className="text-neutral-600">
                                            Entraremos em contato em breve.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        initial={{ opacity: 1 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        {/* Nome */}
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Nome completo *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={cn(
                                                    "w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2",
                                                    formErrors.name
                                                        ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                                                        : "border-neutral-300 focus:ring-blue-500/20 focus:border-blue-500"
                                                )}
                                                placeholder="Seu nome completo"
                                            />
                                            {formErrors.name && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                E-mail *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={cn(
                                                    "w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2",
                                                    formErrors.email
                                                        ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                                                        : "border-neutral-300 focus:ring-blue-500/20 focus:border-blue-500"
                                                )}
                                                placeholder="seu@email.com"
                                            />
                                            {formErrors.email && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                            )}
                                        </div>

                                        {/* Telefone */}
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Telefone *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={cn(
                                                    "w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2",
                                                    formErrors.phone
                                                        ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                                                        : "border-neutral-300 focus:ring-blue-500/20 focus:border-blue-500"
                                                )}
                                                placeholder="(11) 99999-9999"
                                            />
                                            {formErrors.phone && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                                            )}
                                        </div>

                                        {/* Campos de Investimento (condicional) */}
                                        {showInvestmentFields && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                        Faixa de investimento
                                                    </label>
                                                    <select
                                                        name="investmentRange"
                                                        value={formData.investmentRange}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                    >
                                                        <option value="">Selecione uma faixa</option>
                                                        <option value="até-300k">Até R$ 300.000</option>
                                                        <option value="300k-500k">R$ 300.000 - R$ 500.000</option>
                                                        <option value="500k-800k">R$ 500.000 - R$ 800.000</option>
                                                        <option value="800k-1m">R$ 800.000 - R$ 1.000.000</option>
                                                        <option value="acima-1m">Acima de R$ 1.000.000</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                        Prazo para decisão
                                                    </label>
                                                    <select
                                                        name="timeframe"
                                                        value={formData.timeframe}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                    >
                                                        <option value="">Selecione um prazo</option>
                                                        <option value="imediato">Imediato (até 30 dias)</option>
                                                        <option value="curto">Curto prazo (1-3 meses)</option>
                                                        <option value="medio">Médio prazo (3-6 meses)</option>
                                                        <option value="longo">Longo prazo (6+ meses)</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}

                                        {/* Mensagem */}
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Mensagem (opcional)
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                                                placeholder="Conte-nos mais sobre o que você procura..."
                                            />
                                        </div>

                                        {/* Botão de Envio */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={cn(
                                                "w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                                                `bg-gradient-to-r ${currentStyles.gradient} hover:shadow-lg focus:ring-blue-500`
                                            )}
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    <span>Enviando...</span>
                                                </div>) : (
                                                <div className="flex items-center justify-center gap-2">
                                                    <span>{content.callToAction}</span>
                                                    <OptimizedIcons.ArrowRight className="w-5 h-5" />
                                                </div>
                                            )}
                                        </button>                                        {/* Erro de Envio */}
                                        {submitError && (
                                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
                                                Erro ao enviar mensagem. Tente novamente.
                                            </div>
                                        )}

                                        {/* Urgência */}
                                        <div className="text-center">
                                            <p className={cn(
                                                "text-sm font-medium py-2 px-4 rounded-full inline-block",
                                                variant === 'premium' ? 'bg-amber-100 text-amber-800' :
                                                    variant === 'rental' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                            )}>
                                                {content.urgency}
                                            </p>
                                        </div>

                                        {/* Depoimento */}
                                        <div className="text-center pt-4 border-t border-neutral-200">
                                            <p className="text-sm text-neutral-600 italic">
                                                {content.testimonial}
                                            </p>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { FormularioContatoUnified };
export default FormularioContatoUnified;
