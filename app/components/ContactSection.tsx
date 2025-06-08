'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Calendar } from 'lucide-react';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        interest: 'compra'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false); setSubmitResult({
                success: true,
                message: 'Perfeito! Sua solicitação foi recebida. Nossa equipe entrará em contato em até 2 horas úteis com informações personalizadas para você.'
            });

            // Reset form after successful submission
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
                interest: 'compra'
            });

            // Hide success message after 5 seconds
            setTimeout(() => {
                setSubmitResult(null);
            }, 5000);
        }, 1500);
    }; return (
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-orange-900/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100/10 via-transparent to-transparent"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Methods Cards */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Phone Card */}
                    <div className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-xl shadow-lg">
                                <Phone className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">Telefone</h3>
                        <div className="space-y-1 text-white/80">
                            <p className="hover:text-green-300 cursor-pointer transition-colors">(11) 99999-9999</p>
                            <p className="hover:text-green-300 cursor-pointer transition-colors">(11) 5555-5555</p>
                        </div>
                        <p className="text-xs text-white/60 mt-2">Disponível 24h via WhatsApp</p>
                    </div>

                    {/* Email Card */}
                    <div className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-xl shadow-lg">
                                <Mail className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">Email</h3>
                        <p className="text-white/80 hover:text-blue-300 cursor-pointer transition-colors break-all">
                            contato@novaiperimoveis.com.br
                        </p>
                        <p className="text-xs text-white/60 mt-2">Resposta em até 2h úteis</p>
                    </div>

                    {/* Location Card */}
                    <div className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-3 rounded-xl shadow-lg">
                                <MapPin className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">Localização</h3>
                        <div className="space-y-1 text-white/80">
                            <p>Rua Principal, 123 - Centro</p>
                            <p>Guararema - SP</p>
                        </div>
                        <p className="text-xs text-white/60 mt-2">Atendimento presencial</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
                    <h3 className="font-bold text-2xl text-slate-800 mb-6">Garanta atendimento prioritário</h3>

                    {submitResult && (
                        <div className={`p-4 rounded-xl mb-6 ${submitResult.success
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                            {submitResult.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-semibold text-slate-700">
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white/50 focus:bg-white transition-all duration-300"
                                    placeholder="Seu nome completo"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-semibold text-slate-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white/50 focus:bg-white transition-all duration-300"
                                    placeholder="seu.email@exemplo.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="phone" className="block mb-2 text-sm font-semibold text-slate-700">
                                    WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white/50 focus:bg-white transition-all duration-300"
                                    placeholder="(11) 99999-9999"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="interest" className="block mb-2 text-sm font-semibold text-slate-700">
                                    Interesse
                                </label>
                                <select
                                    id="interest"
                                    name="interest"
                                    value={formData.interest}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white/50 focus:bg-white transition-all duration-300"
                                >
                                    <option value="compra">Quero investir em imóvel</option>
                                    <option value="venda">Preciso vender com rapidez</option>
                                    <option value="aluguel">Busco renda passiva</option>
                                    <option value="outro">Consultoria personalizada</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="message" className="block mb-2 text-sm font-semibold text-slate-700">
                                Mensagem
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white/50 focus:bg-white transition-all duration-300 resize-none"
                                placeholder="Conte-nos mais sobre seus objetivos..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 disabled:opacity-70 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                    Garantindo seu atendimento...
                                </>
                            ) : (
                                <>
                                    Receber consultoria especializada
                                    <Send className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Hours Section */}
            <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-3 rounded-xl shadow-lg mr-4">
                        <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-white">Horários de Atendimento</h3>
                        <p className="text-white/70">Estamos aqui para ajudar você</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h4 className="font-semibold text-white mb-2">Segunda a Sexta</h4>
                        <p className="text-white/80 text-sm">9h às 18h</p>
                        <p className="text-green-300 text-xs mt-1">● Online</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h4 className="font-semibold text-white mb-2">Sábados</h4>
                        <p className="text-white/80 text-sm">9h às 13h</p>
                        <p className="text-green-300 text-xs mt-1">● Online</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h4 className="font-semibold text-white mb-2">WhatsApp</h4>
                        <p className="text-white/80 text-sm">24h por dia</p>
                        <p className="text-green-300 text-xs mt-1">● Sempre disponível</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h4 className="font-semibold text-white mb-2">Emergências</h4>
                        <p className="text-white/80 text-sm">24h por dia</p>
                        <p className="text-amber-300 text-xs mt-1">● Suporte prioritário</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSection;
