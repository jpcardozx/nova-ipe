'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { X, Check, Phone, Mail, Calendar, MapPin, Star, User, MessageCircle, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface PropertyContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    property?: {
        id: string;
        title: string;
        image?: string;
        price?: string;
        address?: string;
    };
    className?: string;
}

export default function PropertyContactModal({
    isOpen,
    onClose,
    property,
    className,
}: PropertyContactModalProps) {
    // Estados para o formulário
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [preferredContact, setPreferredContact] = useState<'email' | 'phone' | 'whatsapp'>('whatsapp');
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Referência para o elemento modal para fechamento com ESC
    const modalRef = useRef<HTMLDivElement>(null);    // Efeito para detectar ESC para fechar o modal
    useEffect(() => {
        const handleEscape = (e: Event) => {
            // Type assertion to access key property
            if ((e as KeyboardEvent).key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    // Efeito para prevenir o scroll quando o modal está aberto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Slots de tempo disponíveis para visita
    const timeSlots = [
        '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
    ];

    // Validação do formulário
    const validateForm = (currentStep: number) => {
        const newErrors: Record<string, string> = {};

        if (currentStep === 1) {
            if (!name.trim()) newErrors.name = 'Nome é obrigatório';
            if (!email.trim()) {
                newErrors.email = 'Email é obrigatório';
            } else if (!/^\S+@\S+\.\S+$/.test(email)) {
                newErrors.email = 'Email inválido';
            }
            if (!phone.trim()) {
                newErrors.phone = 'Telefone é obrigatório';
            } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(phone)) {
                newErrors.phone = 'Formato esperado: (00) 00000-0000';
            }
        } else if (currentStep === 2) {
            if (!selectedDate) newErrors.date = 'Data é obrigatória';
            if (!selectedTime) newErrors.time = 'Horário é obrigatório';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Formatar o número de telefone automaticamente
    const formatPhone = (value: string) => {
        // Remove todos os caracteres não numéricos
        const numbers = value.replace(/\D/g, '');

        // Formata o número de acordo com a quantidade de dígitos
        if (numbers.length <= 2) {
            return `(${numbers}`;
        } else if (numbers.length <= 7) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        } else if (numbers.length <= 11) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
        } else {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
        }
    };

    // Manipuladores de eventos
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(formatPhone(e.target.value));
    };

    const handleNextStep = () => {
        if (validateForm(step)) {
            setStep(step + 1);
        }
    };

    const handlePrevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm(step)) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simula o envio do formulário
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSuccess(true);
            // Reset form after success
            setTimeout(() => {
                setIsSuccess(false);
                setName('');
                setEmail('');
                setPhone('');
                setMessage('');
                setSelectedDate(null);
                setSelectedTime(null);
                setStep(1);
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            setErrors({ submit: 'Ocorreu um erro ao enviar sua mensagem. Tente novamente.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Animação do overlay
    const overlayAnimation = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };

    // Animação do modal
    const modalAnimation = {
        initial: { scale: 0.9, opacity: 0, y: 20 },
        animate: { scale: 1, opacity: 1, y: 0 },
        exit: { scale: 0.9, opacity: 0, y: 20 },
        transition: { type: 'spring', damping: 20, stiffness: 300 }
    };    // Progress bar animation using framer-motion
    const progressWidth = useSpring(isOpen ? (step / 3) * 100 : 0, {
        stiffness: 200,
        damping: 20
    });

    // Datas disponíveis (próximos 7 dias, exceto domingos)
    const getAvailableDates = () => {
        const dates: Date[] = [];
        const today = new Date();

        for (let i = 0; i < 14; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);

            // Skip Sundays (0 is Sunday in JavaScript's getDay())
            if (date.getDay() !== 0) {
                dates.push(date);
            }
        }

        return dates;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => !isSubmitting && onClose()}
                    {...overlayAnimation}
                >
                    <motion.div
                        ref={modalRef}
                        className={cn(
                            "relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden",
                            className
                        )}
                        onClick={(e) => e.stopPropagation()}
                        {...modalAnimation}
                    >                        {/* Progress bar */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '4px',
                                backgroundColor: 'var(--primary-500)',
                                zIndex: 10,
                                width: `${progressWidth}%`
                            }}
                        />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-neutral-100 transition-colors z-10"
                            disabled={isSubmitting}
                            aria-label="Fechar"
                        >
                            <X className="h-5 w-5 text-neutral-500" />
                        </button>                        {/* Header */}
                        <div className="p-6 pb-2">
                            <h2 className="text-xl font-bold text-neutral-900">
                                {step === 1 ? 'Análise de investimento personalizada' :
                                    step === 2 ? 'Agendar visita estratégica' :
                                        'Confirme sua análise exclusiva'}
                            </h2>
                            <p className="text-neutral-600 text-sm mt-1">
                                {step === 1 ? 'Receba análise de ROI, documentação e estratégias de valorização' :
                                    step === 2 ? 'Visita técnica focada no potencial de investimento deste imóvel' :
                                        'Especialista entrará em contato em até 2 horas úteis'}
                            </p>
                        </div>

                        {/* Property info */}
                        {property && (
                            <div className="flex items-center p-4 border-b border-neutral-200 bg-neutral-50">
                                {property.image && (
                                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden mr-4">
                                        <img
                                            src={property.image}
                                            alt={property.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-grow">
                                    <h3 className="font-medium text-neutral-900 line-clamp-1">{property.title}</h3>
                                    {property.price && <p className="text-primary-600 font-medium">{property.price}</p>}
                                    {property.address && (
                                        <div className="flex items-center text-neutral-500 text-sm">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            <span className="truncate">{property.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                                <AnimatePresence mode="wait">
                                    {/* Step 1 - Dados pessoais */}
                                    {step === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                                                        Nome completo
                                                    </label>
                                                    <input
                                                        id="name"
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className={cn(
                                                            "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all",
                                                            errors.name ? "border-red-400" : "border-neutral-300"
                                                        )}
                                                        placeholder="Como você gostaria de ser chamado?"
                                                        disabled={isSubmitting}
                                                    />
                                                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                                                        Email
                                                    </label>
                                                    <input
                                                        id="email"
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className={cn(
                                                            "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all",
                                                            errors.email ? "border-red-400" : "border-neutral-300"
                                                        )}
                                                        placeholder="seu.email@preferido.com"
                                                        disabled={isSubmitting}
                                                    />
                                                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                                                        Telefone
                                                    </label>
                                                    <input
                                                        id="phone"
                                                        type="text"
                                                        value={phone}
                                                        onChange={handlePhoneChange}
                                                        className={cn(
                                                            "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all",
                                                            errors.phone ? "border-red-400" : "border-neutral-300"
                                                        )}
                                                        placeholder="(00) 00000-0000"
                                                        maxLength={15}
                                                        disabled={isSubmitting}
                                                    />
                                                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                                                </div>

                                                <div>                                                    <p className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Como prefere que entremos em contato?
                                                </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['whatsapp', 'phone', 'email'].map((option) => (
                                                            <button
                                                                key={option}
                                                                type="button"
                                                                onClick={() => setPreferredContact(option as any)}
                                                                className={cn(
                                                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all",
                                                                    preferredContact === option
                                                                        ? "bg-primary-100 text-primary-800 ring-1 ring-primary-500"
                                                                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                                                                )}
                                                                disabled={isSubmitting}
                                                            >
                                                                {option === 'whatsapp' && <MessageCircle size={14} />}
                                                                {option === 'phone' && <Phone size={14} />}
                                                                {option === 'email' && <Mail size={14} />}
                                                                {option === 'whatsapp' ? 'WhatsApp' : option === 'phone' ? 'Telefone' : 'Email'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 2 - Agendamento */}
                                    {step === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="space-y-4">
                                                <div>                                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Quando você gostaria de visitar?
                                                </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {getAvailableDates().slice(0, 7).map((date) => (
                                                            <button
                                                                key={date.toISOString()}
                                                                type="button"
                                                                onClick={() => setSelectedDate(date)}
                                                                className={cn(
                                                                    "flex flex-col items-center justify-center py-2 px-3 rounded-lg border transition-all",
                                                                    selectedDate && date.toDateString() === selectedDate.toDateString()
                                                                        ? "bg-primary-50 border-primary-300 shadow-sm"
                                                                        : "border-neutral-200 hover:border-primary-200"
                                                                )}
                                                                disabled={isSubmitting}
                                                            >
                                                                <span className="text-xs font-medium text-neutral-500 uppercase">
                                                                    {format(date, 'EEE', { locale: ptBR })}
                                                                </span>
                                                                <span className="text-lg font-bold">
                                                                    {format(date, 'dd')}
                                                                </span>
                                                                <span className="text-xs">
                                                                    {format(date, 'MMM', { locale: ptBR })}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                                                </div>

                                                <div>                                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Qual horário funciona melhor para você?
                                                </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {timeSlots.map((time) => (
                                                            <button
                                                                key={time}
                                                                type="button"
                                                                onClick={() => setSelectedTime(time)}
                                                                className={cn(
                                                                    "py-2 px-4 rounded-lg border transition-all",
                                                                    selectedTime === time
                                                                        ? "bg-primary-50 border-primary-300 text-primary-700"
                                                                        : "border-neutral-200 hover:border-neutral-300"
                                                                )}
                                                                disabled={isSubmitting}
                                                            >
                                                                {time}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time}</p>}
                                                </div>                                                <div>                                                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                                                    Objetivos de investimento específicos?
                                                </label>
                                                    <textarea
                                                        id="message"
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                                        placeholder="Ex: ROI mínimo esperado, prazo de retorno, tipo de renda (aluguel/valorização)..."
                                                        rows={3}
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 3 - Confirmação */}
                                    {step === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="space-y-4">
                                                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                                                    <h3 className="text-lg font-medium mb-3 text-neutral-900">Sua análise de investimento está sendo preparada</h3>

                                                    <div className="space-y-3">
                                                        <div className="flex items-start gap-3">
                                                            <User className="w-5 h-5 text-neutral-400 mt-0.5" />
                                                            <div>
                                                                <p className="text-sm text-neutral-500">Seus dados de contato</p>
                                                                <p className="font-medium">{name}</p>
                                                                <p className="text-sm">{email}</p>
                                                                <p className="text-sm">{phone}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-3">
                                                            <Calendar className="w-5 h-5 text-neutral-400 mt-0.5" />
                                                            <div>
                                                                <p className="text-sm text-neutral-500">Sua visita agendada</p>
                                                                <p className="font-medium">
                                                                    {selectedDate && format(selectedDate, "dd 'de' MMMM (EEEE)", { locale: ptBR })}
                                                                </p>
                                                                <p className="text-sm">
                                                                    {selectedTime} {selectedTime && 'horas'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-3">
                                                            <MessageCircle className="w-5 h-5 text-neutral-400 mt-0.5" />                                                                <div>
                                                                <p className="text-sm text-neutral-500">Como vamos entrar em contato</p>
                                                                <p className="font-medium">
                                                                    {preferredContact === 'whatsapp' ? 'WhatsApp prioritário' :
                                                                        preferredContact === 'phone' ? 'Ligação direta' : 'Email executivo'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {message && (<div className="flex items-start gap-3">
                                                            <MessageCircle className="w-5 h-5 text-neutral-400 mt-0.5" />
                                                            <div>
                                                                <p className="text-sm text-neutral-500">Seus objetivos de investimento</p>
                                                                <p className="text-sm">{message}</p>
                                                            </div>
                                                        </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {errors.submit && (
                                                    <p className="text-sm text-red-500 text-center p-2 bg-red-50 rounded-lg border border-red-100">
                                                        {errors.submit}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer with buttons */}
                            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-between items-center">
                                {step > 1 ? (
                                    <button
                                        type="button"
                                        onClick={handlePrevStep}
                                        className="px-4 py-2 text-neutral-600 hover:text-neutral-900 font-medium text-sm transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Voltar
                                    </button>
                                ) : (
                                    <div></div>
                                )}                                {step < 3 ? (<button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors flex items-center"
                                    disabled={isSubmitting}
                                >
                                    {step === 1 ? 'Solicitar análise de investimento' : 'Confirmar visita estratégica'}
                                </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className={cn(
                                            "bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2",
                                            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                                        )}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                                                <span>Enviando...</span>
                                            </>
                                        ) : isSuccess ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                <span>Enviado!</span>
                                            </>) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                <span>Garantir minha análise de investimento</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 