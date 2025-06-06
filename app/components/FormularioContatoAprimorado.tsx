'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, User, Mail, ArrowRight, CheckCircle, Calendar, Home, MapPin } from 'lucide-react';

interface FormData {
    name: string;
    email: string;
    phone: string;
    interest: string;
    message: string;
}

export default function FormularioContatoAprimorado() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        interest: 'compra',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const formRef = useRef<HTMLFormElement>(null);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Por favor, informe seu nome';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Por favor, informe seu email';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Por favor, informe um email válido';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Por favor, informe seu telefone';
        } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
            newErrors.phone = 'Formato: (99) 99999-9999';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Formatação do telefone
        if (name === 'phone') {
            const cleaned = value.replace(/\D/g, '');
            let formatted = '';

            if (cleaned.length <= 11) {
                if (cleaned.length > 2) {
                    formatted += `(${cleaned.substring(0, 2)}) `;

                    if (cleaned.length > 7) {
                        formatted += `${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
                    } else {
                        formatted += cleaned.substring(2);
                    }
                } else {
                    formatted = cleaned;
                }
            }

            setFormData((prev) => ({ ...prev, [name]: formatted || value }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        // Limpa o erro quando o usuário começa a digitar
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Simulação de envio - aqui seria a chamada real para a API
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSubmitted(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                interest: 'compra',
                message: ''
            });

        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            setErrors({
                submit: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section
            id="contato"
            className="py-20 relative bg-gradient-to-br from-gray-50 to-amber-50/50"
        >
            {/* Padrão decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
                <div className="absolute h-full w-full bg-[url('/images/bg-outlines.svg')] bg-repeat opacity-10" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Coluna de informações */}
                        <div className="lg:w-2/5 bg-gradient-to-br from-amber-700 to-amber-900 text-white p-8 lg:p-12">
                            <div className="h-full flex flex-col">
                                <div>
                                    <span className="inline-block px-3 py-1 text-xs font-medium bg-white/20 text-white rounded-full mb-4">
                                        Atendimento Premium
                                    </span>

                                    <h2 className="text-2xl lg:text-3xl font-bold mb-6">
                                        Realize seu investimento imobiliário com quem entende do mercado local
                                    </h2>

                                    <p className="text-amber-100 mb-8">
                                        Entre em contato e conheça como podemos ajudar você a encontrar o imóvel
                                        ideal em Guararema, seja para morar ou investir.
                                    </p>
                                </div>

                                <div className="space-y-6 mt-auto">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-2 rounded-full">
                                            <MapPin className="w-6 h-6 text-amber-200" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white">Nosso escritório</h4>
                                            <p className="text-sm text-amber-100">Praça 9 de Julho, 65 - Centro</p>
                                            <p className="text-sm text-amber-100">Guararema - SP, 08900-000</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-2 rounded-full">
                                            <Phone className="w-6 h-6 text-amber-200" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white">Contato direto</h4>
                                            <p className="text-sm text-amber-100">(11) 98184-50166</p>
                                            <p className="text-sm text-amber-100">contato@ipeimoveis.com.br - pendente</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-2 rounded-full">
                                            <Calendar className="w-6 h-6 text-amber-200" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white">Horário de atendimento</h4>
                                            <p className="text-sm text-amber-100">Segunda à Sexta: 8h às 18h</p>
                                            <p className="text-sm text-amber-100">Sábados: 9h às 13h</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Formulário */}
                        <div className="lg:w-3/5 p-8 lg:p-12">
                            {!isSubmitted ? (
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Fale com um especialista</h3>

                                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                Nome completo
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <User className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                                        } focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                                                    placeholder="Digite seu nome completo"
                                                />
                                            </div>
                                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                        <Mail className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                            } focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                                                        placeholder="seu@email.com"
                                                    />
                                                </div>
                                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Telefone
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                        <Phone className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        id="phone"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                            } focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                                                        placeholder="(11) 99999-9999"
                                                        maxLength={15}
                                                    />
                                                </div>
                                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
                                                Principal interesse
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <Home className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <select
                                                    id="interest"
                                                    name="interest"
                                                    value={formData.interest}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-[url('/images/chevron-down.svg')] bg-no-repeat bg-[center_right_1rem]"
                                                >
                                                    <option value="compra">Comprar um imóvel</option>
                                                    <option value="venda">Vender meu imóvel</option>
                                                    <option value="aluguel">Alugar um imóvel</option>
                                                    <option value="investimento">Investimento imobiliário</option>
                                                    <option value="avaliacao">Avaliação de imóvel</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                                Mensagem (opcional)
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={4}
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                                                placeholder="Compartilhe mais detalhes sobre o que você busca..."
                                            />
                                        </div>

                                        {errors.submit && (
                                            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                                {errors.submit}
                                            </div>
                                        )}

                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`w-full py-3 px-6 flex items-center justify-center gap-2 text-white font-medium rounded-lg transition ${isSubmitting
                                                    ? 'bg-amber-400 cursor-not-allowed'
                                                    : 'bg-amber-600 hover:bg-amber-700 focus:ring-4 focus:ring-amber-500/20'
                                                    }`}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span>Enviando...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Enviar mensagem</span>
                                                        <ArrowRight className="w-5 h-5" />
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-xs text-gray-500 mt-3 text-center">
                                                Seus dados estão seguros e jamais serão compartilhados com terceiros.
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="h-full flex flex-col justify-center items-center text-center py-10"
                                >
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Mensagem enviada!</h3>
                                    <p className="text-gray-600 max-w-md">
                                        Agradecemos seu contato. Um de nossos especialistas entrará em contato em até 24 horas úteis.
                                    </p>
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="mt-8 py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium flex items-center gap-2"
                                    >
                                        <span>Enviar nova mensagem</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
