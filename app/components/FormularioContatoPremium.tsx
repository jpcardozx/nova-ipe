'use client';

import React, { useState } from 'react';
import { Shield, Phone, User, Mail, Star, TrendingUp, Award, CheckCircle, Clock, Users, ArrowRight, Target, Zap } from 'lucide-react';

interface ContactFormProps {
    className?: string;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    message?: string;
    investmentRange?: string;
    timeframe?: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
}

const FormularioContatoPremium: React.FC<ContactFormProps> = ({ className = '' }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        message: '',
        investmentRange: '',
        timeframe: '',
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
                investmentRange: '',
                timeframe: '',
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
        <section className={`py-20 bg-gradient-to-b from-neutral-50 via-white to-neutral-50 ${className}`}>
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header Premium */}
                <div className="text-center mb-16">                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full text-amber-800 font-medium mb-6">
                    <Award className="w-5 h-5" />
                    <span>Consultoria Especializada em Investimentos</span>
                </div>

                    <h2 className="text-4xl md:text-5xl font-playfair text-neutral-900 mb-6 leading-tight">
                        Descubra oportunidades que podem
                        <span className="block bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-transparent mt-2">
                            multiplicar seu patrimônio
                        </span>
                    </h2>

                    <p className="text-xl text-neutral-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                        Análise personalizada dos melhores investimentos imobiliários em Guararema.
                        <strong className="text-neutral-800"> ROI médio de 18% ao ano</strong> em nossa carteira selecionada.
                    </p>

                    {/* Social Proof */}
                    <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
                        <div className="flex items-center gap-3 text-neutral-700">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
                                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full border-2 border-white"></div>
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full border-2 border-white"></div>
                            </div>
                            <span className="font-medium">200+ investidores atendidos</span>
                        </div>

                        <div className="flex items-center gap-2 text-neutral-700">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                            <span className="font-medium">4.9/5 em satisfação</span>
                        </div>

                        <div className="flex items-center gap-2 text-neutral-700">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span className="font-medium">R$ 50M+ transacionados</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    {/* Benefícios e Credibilidade - Coluna Esquerda */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-gradient-to-br from-neutral-50 to-white p-8 rounded-2xl border border-neutral-100 shadow-sm">
                            <h3 className="text-2xl font-playfair text-neutral-900 mb-6">
                                Por que escolher a Ipê Imóveis?
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                                        <TrendingUp className="w-6 h-6 text-amber-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-neutral-900 mb-1">ROI Comprovado</h4>
                                        <p className="text-neutral-600 text-sm">Histórico de 18% de retorno médio anual em nossa carteira selecionada</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
                                        <Users className="w-6 h-6 text-blue-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-neutral-900 mb-1">Especialistas Locais</h4>
                                        <p className="text-neutral-600 text-sm">15+ anos mapeando as melhores oportunidades em Guararema</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                                        <Shield className="w-6 h-6 text-green-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-neutral-900 mb-1">Assessoria Completa</h4>
                                        <p className="text-neutral-600 text-sm">Desde a análise até a escritura, acompanhamos todo o processo</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gradient-to-r from-purple-100 to-violet-100 rounded-xl">
                                        <Award className="w-6 h-6 text-purple-700" />
                                    </div>
                                    <div>                                        <h4 className="font-semibold text-neutral-900 mb-1">Oportunidades Selecionadas</h4>
                                        <p className="text-neutral-600 text-sm">Acesso a imóveis selecionados antes de chegarem ao mercado geral</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="w-6 h-6 text-amber-700" />
                                <h4 className="font-semibold text-amber-900">Resposta Rápida</h4>
                            </div>
                            <p className="text-amber-800 text-sm mb-4">
                                Nossa equipe responde em até <strong>2 horas</strong> nos dias úteis com análise personalizada.
                            </p>
                            <div className="flex items-center gap-2 text-amber-700 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                <span>100% sem compromisso</span>
                            </div>
                        </div>                        {/* Atendimento Especializado */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Target className="w-6 h-6 text-amber-700" />
                                <h4 className="font-semibold text-amber-900">Atendimento Especializado</h4>
                            </div>
                            <p className="text-amber-800 text-sm mb-4">
                                Nossa equipe oferece <strong>consultoria personalizada</strong> para encontrar a melhor oportunidade para seu perfil.
                            </p>
                            <div className="flex items-center gap-2 text-amber-700 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                <span>Análise detalhada sem compromisso</span>
                            </div>
                        </div>
                    </div>

                    {/* Formulário Premium - Coluna Direita */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl p-10 shadow-xl border border-neutral-100 relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-50 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-50 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>

                            <div className="relative z-10">
                                <div className="text-center mb-8">
                                    <h3 className="text-3xl font-playfair text-neutral-900 mb-3">
                                        Receba sua análise personalizada
                                    </h3>
                                    <p className="text-neutral-600 text-lg">
                                        Oportunidades selecionadas com base no seu perfil e orçamento
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Nome */}
                                    <div>
                                        <label htmlFor="contact-name" className="block text-sm font-semibold text-neutral-700 mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg">
                                                    <User className="w-4 h-4 text-amber-700" />
                                                </div>
                                                Nome completo
                                            </div>
                                        </label>
                                        <input
                                            id="contact-name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className={`w-full px-5 py-4 bg-neutral-50 border-2 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-white transition-all text-lg ${formErrors.name ? 'border-red-400' : 'border-neutral-200'}`}
                                            placeholder="Seu nome completo"
                                        />
                                        {formErrors.name && (
                                            <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
                                                <div className="w-4 h-4 text-white bg-red-500 rounded-full flex items-center justify-center text-xs">!</div>
                                                <span>{formErrors.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Email e Telefone */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="contact-email" className="block text-sm font-semibold text-neutral-700 mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg">
                                                        <Mail className="w-4 h-4 text-blue-700" />
                                                    </div>
                                                    E-mail
                                                </div>
                                            </label>
                                            <input
                                                id="contact-email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className={`w-full px-5 py-4 bg-neutral-50 border-2 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-white transition-all text-lg ${formErrors.email ? 'border-red-400' : 'border-neutral-200'}`}
                                                placeholder="seu@email.com"
                                            />
                                            {formErrors.email && (
                                                <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
                                                    <div className="w-4 h-4 text-white bg-red-500 rounded-full flex items-center justify-center text-xs">!</div>
                                                    <span>{formErrors.email}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="contact-phone" className="block text-sm font-semibold text-neutral-700 mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                                                        <Phone className="w-4 h-4 text-green-700" />
                                                    </div>
                                                    WhatsApp
                                                </div>
                                            </label>
                                            <input
                                                id="contact-phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className={`w-full px-5 py-4 bg-neutral-50 border-2 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-white transition-all text-lg ${formErrors.phone ? 'border-red-400' : 'border-neutral-200'}`}
                                                placeholder="(11) 99999-9999"
                                            />
                                            {formErrors.phone && (
                                                <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
                                                    <div className="w-4 h-4 text-white bg-red-500 rounded-full flex items-center justify-center text-xs">!</div>
                                                    <span>{formErrors.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Faixa de Investimento e Prazo */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 mb-3">
                                                Faixa de investimento
                                            </label>
                                            <select
                                                value={formData.investmentRange}
                                                onChange={(e) => setFormData({ ...formData, investmentRange: e.target.value })}
                                                className="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-white transition-all text-lg"
                                            >
                                                <option value="">Selecione sua faixa</option>
                                                <option value="ate-300k">Até R$ 300.000</option>
                                                <option value="300k-500k">R$ 300.000 - R$ 500.000</option>
                                                <option value="500k-1mi">R$ 500.000 - R$ 1.000.000</option>
                                                <option value="1mi-2mi">R$ 1.000.000 - R$ 2.000.000</option>
                                                <option value="acima-2mi">Acima de R$ 2.000.000</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 mb-3">
                                                Prazo de decisão
                                            </label>
                                            <select
                                                value={formData.timeframe}
                                                onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                                                className="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-white transition-all text-lg"
                                            >
                                                <option value="">Quando pretende investir?</option>
                                                <option value="imediato">Imediatamente</option>
                                                <option value="30-dias">Nos próximos 30 dias</option>
                                                <option value="3-meses">Em até 3 meses</option>
                                                <option value="6-meses">Em até 6 meses</option>
                                                <option value="futuro">Futuramente</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Mensagem */}
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-3">
                                            Objetivos e preferências (opcional)
                                        </label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-5 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-white transition-all text-lg"
                                            rows={4}
                                            placeholder="Ex: Busco apartamento para renda passiva, terreno para construir, casa para morar e valorizar..."
                                        />
                                    </div>

                                    {/* Mensagens de Status */}
                                    {submitSuccess && (
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                                            <div className="flex items-center gap-3 text-green-800">
                                                <CheckCircle className="w-6 h-6" />
                                                <div>
                                                    <div className="font-semibold">Análise solicitada com sucesso!</div>
                                                    <div className="text-sm">Nossa equipe entrará em contato em até 2 horas com sua análise personalizada.</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {submitError && (
                                        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-5">
                                            <div className="flex items-center gap-3 text-red-800">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                                </svg>
                                                <div>
                                                    <div className="font-semibold">Erro ao enviar solicitação</div>
                                                    <div className="text-sm">Tente novamente ou entre em contato via WhatsApp: (11) 98184-5016</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Garantia */}
                                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                                        <div className="flex items-center gap-3 text-amber-800 text-sm">
                                            <Shield className="w-5 h-5" />
                                            <span><strong>100% Seguro:</strong> Seus dados são protegidos e usados apenas para envio da análise personalizada.</span>
                                        </div>
                                    </div>

                                    {/* Botão CTA Premium */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-5 px-6 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white rounded-xl font-bold text-lg hover:from-amber-700 hover:via-orange-600 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-70 transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Preparando sua análise...
                                            </div>
                                        ) : (
                                            <span className="flex items-center justify-center gap-3">
                                                Quero receber minha análise GRATUITA
                                                <ArrowRight className="w-6 h-6" />
                                            </span>
                                        )}
                                    </button>

                                    {/* Sub-CTA */}
                                    <p className="text-center text-sm text-neutral-500">
                                        ⚡ Resposta em até 2 horas • 🎯 Análise personalizada • 🔒 Sem spam
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FormularioContatoPremium;
