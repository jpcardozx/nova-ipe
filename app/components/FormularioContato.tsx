'use client';

import React, { useState } from 'react';
import { Shield, Phone, User, Mail } from 'lucide-react';

interface ContactFormProps {
    className?: string;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    message?: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
}

const FormularioContatoAprimorado: React.FC<ContactFormProps> = ({ className = '' }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(false);

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

    return (
        <section className={`py-12 ${className}`}>
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">                    <div>                        <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
                    Solicite uma consultoria
                </span>                    <h2 className="text-display-2 text-gray-900 mb-6">
                        Atendimento personalizado
                        <span className="block text-amber-600 mt-1">
                            para sua necessidade imobiliária
                        </span>
                    </h2>                    <p className="text-body-large text-gray-600 mb-8 leading-relaxed">
                        Complete o formulário para receber análises e oportunidades selecionadas de acordo com seu perfil de investimento ou moradia. Consultoria sem compromisso.
                    </p>

                    <div className="space-y-6">                            <div className="flex gap-3 items-start">
                        <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                            <User className="w-5 h-5" />
                        </div>                            <div>
                            <h3 className="text-heading-3 text-gray-900 mb-1">Consultoria especializada</h3>
                            <p className="text-body text-gray-600">Análise personalizada de objetivos e requisitos</p>
                        </div>
                    </div>

                        <div className="flex gap-3 items-start">
                            <div className="p-2 bg-green-100 rounded-lg text-green-700">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>                                <h3 className="text-heading-3 text-gray-900 mb-1">Segurança jurídica</h3>
                                <p className="text-body text-gray-600">Assessoria documental e compliance imobiliário</p>
                            </div>
                        </div>

                        <div className="flex gap-3 items-start">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>                                <h3 className="text-heading-3 text-gray-900 mb-1">Atendimento em 24h</h3>
                                <p className="text-body text-gray-600">Agilidade e compromisso em todas as interações</p>
                            </div>
                        </div>
                    </div>
                </div>

                    <div>                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">                            <div className="mb-6">                        <h3 className="text-heading-1 text-gray-900 mb-2">
                        Solicite uma avaliação especializada
                    </h3>
                        <p className="text-body text-gray-600">
                            Assessoria completa para decisões estratégicas no mercado imobiliário
                        </p>
                    </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>                                <label className="block text-caption medium-text text-gray-700 mb-2">
                                <div className="flex items-center">
                                    <div className="p-1 bg-amber-100 rounded-md mr-2">
                                        <User className="w-3.5 h-3.5 text-amber-700" />
                                    </div>
                                    Nome completo
                                </div>
                            </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all ${formErrors.name ? 'border-red-500' : 'border-gray-200'}`}
                                    placeholder="Digite seu nome completo"
                                />
                                {formErrors.name && (
                                    <div className="mt-1 text-sm text-red-600">
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 text-white bg-red-500 rounded-full text-center leading-4">!</div>
                                            <span>{formErrors.name}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center">
                                            <div className="p-1 bg-amber-100 rounded-md mr-2">
                                                <Mail className="w-3.5 h-3.5 text-amber-700" />
                                            </div>
                                            E-mail
                                        </div>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all ${formErrors.email ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="seu@email.com"
                                    />
                                    {formErrors.email && (
                                        <div className="mt-1 text-sm text-red-600">
                                            <div className="flex items-center gap-1">
                                                <div className="w-4 h-4 text-white bg-red-500 rounded-full text-center leading-4">!</div>
                                                <span>{formErrors.email}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center">
                                            <div className="p-1 bg-amber-100 rounded-md mr-2">
                                                <Phone className="w-3.5 h-3.5 text-amber-700" />
                                            </div>
                                            Celular/WhatsApp
                                        </div>
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all ${formErrors.phone ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="(11) 99999-9999"
                                    />
                                    {formErrors.phone && (
                                        <div className="mt-1 text-sm text-red-600">
                                            <div className="flex items-center gap-1">
                                                <div className="w-4 h-4 text-white bg-red-500 rounded-full text-center leading-4">!</div>
                                                <span>{formErrors.phone}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center">
                                        <div className="p-1 bg-amber-100 rounded-md mr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-amber-700">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
                                            </svg>
                                        </div>
                                        O que você procura? (opcional)
                                    </div>
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all"
                                    rows={3}
                                    placeholder="Conte-nos o que está buscando..."
                                />
                            </div>

                            {submitSuccess && (
                                <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-green-700">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <div>Mensagem enviada com sucesso! Logo entraremos em contato.</div>
                                    </div>
                                </div>
                            )}

                            {submitError && (
                                <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-sm text-red-700">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                        </svg>
                                        <div>Ocorreu um erro. Por favor, tente novamente ou entre em contato por telefone.</div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-800">
                                <div className="flex items-center gap-1.5">
                                    <Shield className="w-4 h-4 text-amber-600" />
                                    <span>Seus dados estão seguros e serão usados apenas para contato.</span>
                                </div>
                            </div>                                <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg font-semibold hover:from-amber-700 hover:to-amber-600 shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Enviando...
                                    </div>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Quero ver imóveis exclusivos
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FormularioContatoAprimorado;