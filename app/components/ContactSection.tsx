'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

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
                message: 'Perfeito! Sua solicitação foi recebida. Nossa equipe entrará em contato em até 2 horas úteis com informações exclusivas para você.'
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
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
                <div className="space-y-6">
                    <div className="flex items-start">                        <div className="bg-primary-50 p-3 rounded-full mr-4">
                        <Phone className="h-5 w-5 text-primary-600" />
                    </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Telefone</h3>
                            <p className="text-neutral-600">(11) 99999-9999</p>
                            <p className="text-neutral-600">(11) 5555-5555</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="bg-primary-50 p-3 rounded-full mr-4">
                            <Mail className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Email</h3>
                            <p className="text-neutral-600">contato@novaiperimoveis.com.br</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="bg-primary-50 p-3 rounded-full mr-4">
                            <MapPin className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Endereço</h3>
                            <p className="text-neutral-600">Rua Principal, 123 - Centro</p>
                            <p className="text-neutral-600">Guararema - SP</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="bg-primary-50 p-3 rounded-full mr-4">
                            <Clock className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Horário de Atendimento</h3>
                            <p className="text-neutral-600">Segunda a Sexta: 9h às 18h</p>
                            <p className="text-neutral-600">Sábados: 9h às 13h</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-xl mb-4">Garanta atendimento prioritário</h3>

                {submitResult && (
                    <div className={`p-4 rounded-md mb-4 ${submitResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {submitResult.message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="name" className="block mb-1 text-sm font-medium">Nome</label>                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-neutral-50 focus:bg-white transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-1 text-sm font-medium">Email</label>                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-neutral-50 focus:bg-white transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="phone" className="block mb-1 text-sm font-medium">Telefone</label>                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-neutral-50 focus:bg-white transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="interest" className="block mb-1 text-sm font-medium">Interesse</label>                            <select
                                id="interest"
                                name="interest"
                                value={formData.interest}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-neutral-50 focus:bg-white transition-all"
                            >
                                <option value="compra">Quero investir em imóvel</option>
                                <option value="venda">Preciso vender com rapidez</option>
                                <option value="aluguel">Busco renda passiva</option>
                                <option value="outro">Consultoria personalizada</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="message" className="block mb-1 text-sm font-medium">Mensagem</label>                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-neutral-50 focus:bg-white transition-all"
                            required
                        ></textarea>
                    </div>                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-md hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-70 shadow-md hover:shadow-lg"
                    >
                        {isSubmitting ? 'Garantindo seu atendimento...' : (
                            <>
                                Receber consultoria especializada
                                <Send className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactSection;
