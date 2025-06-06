'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    trackFormInteraction,
    trackFormPerformance,
    validateBrazilianPhone,
    validateEmailDomain,
    formSubmissionTracker,
    manageFocus,
    formPersistence
} from '../utils/formHelpers';
import {
    Shield,
    Phone,
    User,
    Mail,
    Clock,
    CheckCircle,
    MapPin,
    TrendingUp,
    Building,
    Users,
    Award,
    ArrowRight,
    ChevronDown,
    AlertCircle,
    Info
} from 'lucide-react';
import { useToast } from './ui/Toast';

interface ContactFormProps {
    className?: string;
    title?: string;
    description?: string;
    ctaText?: string;
    badge?: string;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    interest: string;
    message?: string;
}

interface FormErrors {
    [key: string]: string;
}

// Utility function for better phone formatting
const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
};

// Enhanced validation
const validateForm = (data: FormData): FormErrors => {
    const errors: FormErrors = {};

    if (!data.name.trim()) {
        errors.name = 'Nome é obrigatório';
    } else if (data.name.trim().length < 2) {
        errors.name = 'Nome deve ter pelo menos 2 caracteres';
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(data.name)) {
        errors.name = 'Nome deve conter apenas letras';
    }

    if (!data.email.trim()) {
        errors.email = 'E-mail é obrigatório';
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.email = 'E-mail inválido';
        } else if (!validateEmailDomain(data.email)) {
            errors.email = 'Domínio de e-mail não reconhecido';
        }
    }

    if (!data.phone.trim()) {
        errors.phone = 'Telefone é obrigatório';
    } else if (!validateBrazilianPhone(data.phone)) {
        errors.phone = 'Telefone deve ser um número brasileiro válido';
    }

    if (!data.interest) {
        errors.interest = 'Selecione seu interesse';
    }

    return errors;
};

const FormularioContatoSubtil: React.FC<ContactFormProps> = ({ className = '' }) => {
    // Form state
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        interest: '',
        message: '',
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [isInterestDropdownOpen, setIsInterestDropdownOpen] = useState(false);
    const [validationMode, setValidationMode] = useState<'onBlur' | 'onSubmit'>('onBlur');
    const [formStartTime, setFormStartTime] = useState<number>(0);

    // Toast system
    const { addToast, ToastContainer } = useToast(); const sectionRef = useRef<HTMLElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
        layoutEffect: false
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

    // Load saved form data on mount
    useEffect(() => {
        const savedData = formPersistence.loadFormData();
        if (savedData) {
            setFormData(prev => ({ ...prev, ...savedData }));
            trackFormInteraction('form_restored', savedData);
        }
        setFormStartTime(Date.now());
    }, []);

    // Auto-save form data
    useEffect(() => {
        if (formData.name || formData.email || formData.phone) {
            const timeoutId = setTimeout(() => {
                formPersistence.saveFormData(formData);
            }, 1000); // Debounce auto-save

            return () => clearTimeout(timeoutId);
        }
    }, [formData]);

    // Track form engagement
    useEffect(() => {
        if (isInView) {
            trackFormInteraction('form_viewed');
            const timer = setInterval(() => {
                setCurrentStep((prev) => (prev + 1) % 3);
            }, 4000);
            return () => clearInterval(timer);
        }
    }, [isInView]);

    // Enhanced input change handler with real-time validation
    const handleInputChange = (field: string, value: string) => {
        let processedValue = value;

        // Format phone number in real-time
        if (field === 'phone') {
            processedValue = formatPhoneNumber(value);
        }

        setFormData(prev => ({ ...prev, [field]: processedValue }));

        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: '' }));
        }

        // Real-time validation for better UX
        if (validationMode === 'onBlur' && processedValue.trim() !== '') {
            const tempData = { ...formData, [field]: processedValue };
            const errors = validateForm(tempData);
            if (errors[field]) {
                setTimeout(() => {
                    setFormErrors(prev => ({ ...prev, [field]: errors[field] }));
                }, 500); // Debounced validation
            }
        }
    };

    // Enhanced blur handler
    const handleInputBlur = (field: string) => {
        setFocusedField(null);
        const errors = validateForm(formData);
        if (errors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: errors[field] }));
        }
    };    // Enhanced submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationMode('onSubmit');        // Check rate limiting
        if (!formSubmissionTracker.canSubmit()) {
            const remainingTime = Math.ceil(formSubmissionTracker.getRemainingTime() / 1000);
            addToast({
                type: 'warning',
                title: 'Aguarde um momento',
                message: `Tente novamente em ${remainingTime} segundos.`
            });
            return;
        }

        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            manageFocus.focusFirstError(errors);
            addToast({
                type: 'error',
                title: 'Verifique os dados',
                message: 'Alguns campos precisam ser corrigidos.'
            });
            trackFormInteraction('validation_failed', { errors: Object.keys(errors) });
            return;
        }

        setIsSubmitting(true);
        formSubmissionTracker.recordAttempt();

        const submitStartTime = Date.now();

        try {
            trackFormInteraction('form_submit_attempt', formData);

            const response = await fetch('/api/contato', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    formMetadata: {
                        timeToComplete: Date.now() - formStartTime,
                        userAgent: navigator.userAgent,
                        timestamp: new Date().toISOString()
                    }
                }),
            });

            if (response.ok) {
                const submitTime = Date.now() - submitStartTime;
                trackFormPerformance('submission_time', submitTime);
                trackFormInteraction('form_submit_success', formData);

                setSubmitSuccess(true);
                formPersistence.clearFormData();

                addToast({
                    type: 'success',
                    title: 'Mensagem enviada!',
                    message: 'Retornaremos em breve para iniciar nossa conversa.',
                    duration: 8000
                });

                // Reset form after success
                setTimeout(() => {
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        interest: '',
                        message: ''
                    });
                    setSubmitSuccess(false);
                    setFormStartTime(Date.now());
                }, 3000);
            } else {
                throw new Error('Erro no envio');
            }
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Erro no envio',
                message: 'Não foi possível enviar sua mensagem. Tente novamente ou entre em contato pelo WhatsApp.'
            });
            trackFormInteraction('form_submit_error', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const interestOptions = [
        { value: 'comprar', label: 'Comprar imóvel' },
        { value: 'vender', label: 'Vender meu imóvel' },
        { value: 'investir', label: 'Investimento imobiliário' },
        { value: 'alugar', label: 'Locação' },
        { value: 'avaliar', label: 'Avaliar propriedade' },
        { value: 'consulta', label: 'Consultoria geral' }
    ];

    const benefits = [
        {
            icon: <MapPin className="w-5 h-5" />,
            title: "Conhecimento Local",
            description: "15 anos de experiência especializada em Guararema"
        },
        {
            icon: <TrendingUp className="w-5 h-5" />,
            title: "Resultados Comprovados",
            description: "Histórico transparente de transações bem-sucedidas"
        },
        {
            icon: <Users className="w-5 h-5" />,
            title: "Atendimento Pessoal",
            description: "Relacionamento próximo e acompanhamento dedicado"
        }
    ];

    const steps = [
        "Conversamos sobre seus objetivos",
        "Analisamos as melhores opções",
        "Acompanhamos todo o processo"
    ]; return (
        <>
            <motion.section
                ref={sectionRef}
                className={`relative py-24 overflow-hidden ${className}`}
                style={{ backgroundColor: "#fafafa" }}
                role="region"
                aria-labelledby="contact-form-title"
            >
                {/* Background sutil com parallax */}
                <motion.div
                    className="absolute inset-0 opacity-40"
                    style={{
                        y: backgroundY,
                        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)"
                    }}
                />

                {/* Padrão de textura sutil */}
                <div className="absolute inset-0 opacity-5">
                    <div style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '30px 30px'
                    }} className="w-full h-full" />
                </div>

                <motion.div
                    className="container mx-auto px-6 lg:px-8 relative z-10"
                    style={{ y: contentY }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 max-w-7xl mx-auto">

                        {/* Left Column - Enhanced credibility content */}
                        <motion.div
                            className="lg:col-span-5"
                            initial={{ opacity: 0, x: -30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="space-y-8">
                                <div>
                                    <motion.div
                                        className="inline-flex items-center bg-slate-100 rounded-full px-4 py-2 text-sm text-slate-600 mb-4"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <Info className="w-4 h-4 mr-2 text-slate-500" />
                                        Atendimento especializado
                                    </motion.div>

                                    <h2 id="contact-form-title" className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4 leading-tight">
                                        Vamos conversar sobre seu
                                        <span className="text-slate-600 block">objetivo imobiliário?</span>
                                    </h2>

                                    <p className="text-lg text-slate-600 leading-relaxed">
                                        Cada situação é única. Compartilhe seus planos e vamos encontrar
                                        a melhor estratégia para você em Guararema e região.
                                    </p>
                                </div>

                                {/* Enhanced benefits section */}
                                <div className="space-y-6">
                                    {benefits.map((benefit, index) => (
                                        <motion.div
                                            key={benefit.title}
                                            className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                                            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                                            whileHover={{
                                                scale: 1.02,
                                                boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
                                            }}
                                        >
                                            <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                                                {benefit.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-800 mb-1">
                                                    {benefit.title}
                                                </h3>
                                                <p className="text-sm text-slate-600">
                                                    {benefit.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Process steps */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                                        <Clock className="w-5 h-5 mr-2 text-slate-500" />
                                        Como funciona
                                    </h3>
                                    <div className="space-y-3">
                                        {steps.map((step, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex items-center space-x-3"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                                            >
                                                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">
                                                    {index + 1}
                                                </div>
                                                <span className="text-slate-600">{step}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column - Enhanced form */}
                        <motion.div
                            className="lg:col-span-7"
                            initial={{ opacity: 0, x: 30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 lg:p-10">                                <AnimatePresence mode="wait">
                                {submitSuccess ? (
                                    <motion.div
                                        key="success-state"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="text-center py-12"
                                    >
                                        <motion.div
                                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring" }}
                                        >
                                            <CheckCircle className="w-10 h-10 text-green-600" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-4">
                                            Mensagem enviada com sucesso!
                                        </h3>
                                        <p className="text-slate-600 mb-6">
                                            Retornaremos em breve para iniciar nossa conversa.
                                            Obrigado pelo interesse!
                                        </p>
                                        <div className="text-sm text-slate-500">
                                            <p>📱 WhatsApp: (11) 99999-9999</p>
                                            <p>📧 E-mail: contato@novaipe.com.br</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                        noValidate
                                        aria-labelledby="contact-form-title"
                                    >
                                        {/* Form Progress Indicator */}
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                                                <span>Progresso do formulário</span>
                                                <span>{Math.round((Object.values(formData).filter(value => value.trim() !== '').length / 4) * 100)}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-slate-400 to-slate-600 rounded-full"
                                                    initial={{ width: "0%" }}
                                                    animate={{
                                                        width: `${(Object.values(formData).filter(value => value.trim() !== '').length / 4) * 100}%`
                                                    }}
                                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                                />
                                            </div>
                                        </div>

                                        {/* Form Header with better UX */}
                                        <div className="text-center mb-8">
                                            <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                                Conte-nos seus objetivos
                                            </h3>
                                            <p className="text-slate-600 text-sm">
                                                Todas as informações são tratadas com confidencialidade
                                            </p>
                                        </div>

                                        {/* Form fields with enhanced UX */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Name field */}
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="name"
                                                    className="block text-sm font-medium text-slate-700"
                                                >
                                                    Nome completo *
                                                </label>
                                                <div className="relative">
                                                    <motion.input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                                        onFocus={() => setFocusedField('name')}
                                                        onBlur={() => handleInputBlur('name')}
                                                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${formErrors.name
                                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                            : 'border-slate-200 focus:border-slate-400 focus:ring-slate-200'
                                                            } focus:ring-2 focus:ring-opacity-50 focus:outline-none`}
                                                        placeholder="Seu nome completo"
                                                        whileFocus={{ scale: 1.02 }}
                                                        aria-invalid={!!formErrors.name}
                                                        aria-describedby={formErrors.name ? "name-error" : undefined}
                                                    />
                                                    <User className={`absolute right-3 top-3 w-5 h-5 transition-colors ${focusedField === 'name' ? 'text-slate-400' : 'text-slate-300'
                                                        }`} />
                                                </div>
                                                {formErrors.name && (
                                                    <motion.p
                                                        id="name-error"
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-sm text-red-600 flex items-center"
                                                        role="alert"
                                                    >
                                                        <AlertCircle className="w-4 h-4 mr-1" />
                                                        {formErrors.name}
                                                    </motion.p>
                                                )}
                                            </div>

                                            {/* Email field */}
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="email"
                                                    className="block text-sm font-medium text-slate-700"
                                                >
                                                    E-mail *
                                                </label>
                                                <div className="relative">
                                                    <motion.input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                        onFocus={() => setFocusedField('email')}
                                                        onBlur={() => handleInputBlur('email')}
                                                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${formErrors.email
                                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                            : 'border-slate-200 focus:border-slate-400 focus:ring-slate-200'
                                                            } focus:ring-2 focus:ring-opacity-50 focus:outline-none`}
                                                        placeholder="seu@email.com"
                                                        whileFocus={{ scale: 1.02 }}
                                                        aria-invalid={!!formErrors.email}
                                                        aria-describedby={formErrors.email ? "email-error" : undefined}
                                                    />
                                                    <Mail className={`absolute right-3 top-3 w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-slate-400' : 'text-slate-300'
                                                        }`} />
                                                </div>
                                                {formErrors.email && (
                                                    <motion.p
                                                        id="email-error"
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-sm text-red-600 flex items-center"
                                                        role="alert"
                                                    >
                                                        <AlertCircle className="w-4 h-4 mr-1" />
                                                        {formErrors.email}
                                                    </motion.p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Phone field */}
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="phone"
                                                className="block text-sm font-medium text-slate-700"
                                            >
                                                Telefone/WhatsApp *
                                            </label>
                                            <div className="relative">
                                                <motion.input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    onFocus={() => setFocusedField('phone')}
                                                    onBlur={() => handleInputBlur('phone')}
                                                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${formErrors.phone
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                        : 'border-slate-200 focus:border-slate-400 focus:ring-slate-200'
                                                        } focus:ring-2 focus:ring-opacity-50 focus:outline-none`}
                                                    placeholder="(11) 99999-9999"
                                                    whileFocus={{ scale: 1.02 }}
                                                    aria-invalid={!!formErrors.phone}
                                                    aria-describedby={formErrors.phone ? "phone-error" : undefined}
                                                />
                                                <Phone className={`absolute right-3 top-3 w-5 h-5 transition-colors ${focusedField === 'phone' ? 'text-slate-400' : 'text-slate-300'
                                                    }`} />
                                            </div>
                                            {formErrors.phone && (
                                                <motion.p
                                                    id="phone-error"
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-sm text-red-600 flex items-center"
                                                    role="alert"
                                                >
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    {formErrors.phone}
                                                </motion.p>
                                            )}
                                        </div>

                                        {/* Interest dropdown */}
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="interest"
                                                className="block text-sm font-medium text-slate-700"
                                            >
                                                Qual seu interesse? *
                                            </label>
                                            <div className="relative">
                                                <motion.button
                                                    type="button"
                                                    onClick={() => setIsInterestDropdownOpen(!isInterestDropdownOpen)}
                                                    className={`w-full px-4 py-3 rounded-lg border text-left transition-all duration-200 ${formErrors.interest
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                        : 'border-slate-200 focus:border-slate-400 focus:ring-slate-200'
                                                        } focus:ring-2 focus:ring-opacity-50 focus:outline-none`}
                                                    whileTap={{ scale: 0.98 }}
                                                    aria-expanded={isInterestDropdownOpen}
                                                    aria-haspopup="listbox"
                                                    aria-invalid={!!formErrors.interest}
                                                    aria-describedby={formErrors.interest ? "interest-error" : undefined}
                                                >
                                                    <span className={formData.interest ? 'text-slate-700' : 'text-slate-400'}>
                                                        {formData.interest
                                                            ? interestOptions.find(opt => opt.value === formData.interest)?.label
                                                            : 'Selecione uma opção'
                                                        }
                                                    </span>
                                                    <ChevronDown className={`absolute right-3 top-3 w-5 h-5 transition-transform ${isInterestDropdownOpen ? 'rotate-180' : ''
                                                        } text-slate-400`} />
                                                </motion.button>

                                                <AnimatePresence>
                                                    {isInterestDropdownOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10"
                                                            role="listbox"
                                                        >
                                                            {interestOptions.map((option) => (
                                                                <motion.button
                                                                    key={option.value}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        handleInputChange('interest', option.value);
                                                                        setIsInterestDropdownOpen(false);
                                                                    }}
                                                                    className="w-full px-4 py-3 text-left hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                                                                    whileHover={{ backgroundColor: "#f8fafc" }}
                                                                    role="option"
                                                                    aria-selected={formData.interest === option.value}
                                                                >
                                                                    {option.label}
                                                                </motion.button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            {formErrors.interest && (
                                                <motion.p
                                                    id="interest-error"
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-sm text-red-600 flex items-center"
                                                    role="alert"
                                                >
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    {formErrors.interest}
                                                </motion.p>
                                            )}
                                        </div>

                                        {/* Optional message field */}
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="message"
                                                className="block text-sm font-medium text-slate-700"
                                            >
                                                Mensagem (opcional)
                                            </label>
                                            <motion.textarea
                                                id="message"
                                                name="message"
                                                value={formData.message || ''}
                                                onChange={(e) => handleInputChange('message', e.target.value)}
                                                onFocus={() => setFocusedField('message')}
                                                onBlur={() => setFocusedField(null)}
                                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:ring-opacity-50 focus:outline-none transition-all duration-200 resize-none"
                                                placeholder="Conte-nos mais sobre seus objetivos..."
                                                rows={4}
                                                whileFocus={{ scale: 1.01 }}
                                            />
                                        </div>

                                        {/* Submit button */}
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-slate-800 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <motion.div
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    Iniciar conversa
                                                    <ArrowRight className="w-5 h-5 ml-2" />
                                                </>
                                            )}
                                        </motion.button>

                                        {/* Error message */}
                                        {formErrors.submit && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-sm text-red-600 text-center flex items-center justify-center"
                                                role="alert"
                                            >
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {formErrors.submit}
                                            </motion.p>
                                        )}

                                        {/* Privacy note */}
                                        <div className="text-center">
                                            <p className="text-xs text-slate-500">
                                                <Shield className="w-3 h-3 inline mr-1" />
                                                Suas informações são tratadas com total sigilo e segurança
                                            </p>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>                        </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.section>

            {/* Toast Container */}
            <ToastContainer />
        </>
    );
};

export default FormularioContatoSubtil;
