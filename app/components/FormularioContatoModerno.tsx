'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Send, CheckCircle, Phone, Mail, MapPin, Calendar, Clock } from 'lucide-react';

interface FormularioContatoModernoProps {
    variant?: 'default' | 'premium' | 'compact' | 'side-by-side';
    title?: string;
    subtitle?: string;
    showInvestmentFields?: boolean;
    backgroundColor?: string;
}

export default function FormularioContatoModerno({
    variant = 'default',
    title = "Entre em contato conosco",
    subtitle = "Estamos prontos para atender você e encontrar o imóvel ideal para suas necessidades",
    showInvestmentFields = false,
    backgroundColor = "bg-white"
}: FormularioContatoModernoProps) {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        investmentRange: '',
        preferredLocation: '',
        visitDate: '',
    });

    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulando envio do formulário
            await new Promise(resolve => setTimeout(resolve, 1200));

            console.log('Form submitted:', formData);
            setSubmitted(true);

            // Resetar o formulário
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                investmentRange: '',
                preferredLocation: '',
                visitDate: '',
            });

            // Após 5 segundos, ocultar a mensagem de sucesso
            setTimeout(() => {
                setSubmitted(false);
            }, 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Variantes de animação
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    // Configurações específicas para cada variante
    const variantConfigs = {
        default: {
            container: "max-w-4xl mx-auto p-8 rounded-xl shadow-lg",
            grid: "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6",
            accent: "from-amber-600 to-amber-800",
        },
        premium: {
            container: "max-w-5xl mx-auto p-10 rounded-2xl shadow-xl border border-amber-100",
            grid: "grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8",
            accent: "from-amber-700 to-amber-900",
        },
        compact: {
            container: "max-w-xl mx-auto p-6 rounded-lg shadow-md",
            grid: "grid grid-cols-1 gap-y-4",
            accent: "from-amber-600 to-amber-700",
        },
        'side-by-side': {
            container: "max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-xl overflow-hidden shadow-lg",
            grid: "grid grid-cols-1 gap-y-6",
            accent: "from-amber-600 to-amber-800",
        },
    };

    const config = variantConfigs[variant];

    // Informações de contato
    const contactInfo = [
        {
            icon: <Phone className="w-5 h-5" />,
            label: "Telefone",
            value: "(11) 4693-1234"
        },
        {
            icon: <Mail className="w-5 h-5" />,
            label: "Email",
            value: "contato@ipeimoveis.com.br"
        },
        {
            icon: <MapPin className="w-5 h-5" />,
            label: "Endereço",
            value: "Av. Principal, 1250 - Centro, Guararema/SP"
        },
        {
            icon: <Clock className="w-5 h-5" />,
            label: "Horário",
            value: "Seg-Sex: 9h às 18h | Sáb: 9h às 13h"
        }
    ];

    // Renderização condicional do formulário ou mensagem de sucesso
    const renderFormContent = () => {
        if (submitted) {
            return (
                <div className="text-center py-12">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Mensagem Enviada!</h3>
                        <p className="text-gray-600 mb-6">
                            Agradecemos seu contato. Nossa equipe retornará em breve.
                        </p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="text-amber-700 hover:text-amber-800 font-medium"
                        >
                            Enviar nova mensagem
                        </button>
                    </motion.div>
                </div>
            );
        }

        // Side-by-side layout é diferente dos outros
        if (variant === 'side-by-side') {
            return (
                <>
                    <div className="lg:col-span-2 bg-gradient-to-br from-amber-700 to-amber-900 text-white p-8">
                        <h3 className="text-2xl font-bold mb-6">Informações de Contato</h3>
                        <div className="space-y-6">
                            {contactInfo.map((item, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="bg-white/20 p-2 rounded-lg mr-4">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-amber-200 text-sm">{item.label}</p>
                                        <p className="font-medium">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12">
                            <p className="text-amber-200 mb-2 text-sm">Horário de Atendimento</p>
                            <p>Segunda à Sexta: 9h às 18h</p>
                            <p>Sábados: 9h às 13h</p>
                        </div>
                    </div>

                    <div className="lg:col-span-3 p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
                        <p className="text-gray-600 mb-6">{subtitle}</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome completo
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Telefone
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                        Assunto
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                                        required
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Compra">Interesse em Compra</option>
                                        <option value="Aluguel">Interesse em Aluguel</option>
                                        <option value="Venda">Quero Vender</option>
                                        <option value="Avaliação">Avaliação de Imóvel</option>
                                        <option value="Outro">Outro Assunto</option>
                                    </select>
                                </div>

                                {showInvestmentFields && (
                                    <>
                                        <div>
                                            <label htmlFor="investmentRange" className="block text-sm font-medium text-gray-700 mb-1">
                                                Faixa de Investimento
                                            </label>
                                            <select
                                                id="investmentRange"
                                                name="investmentRange"
                                                value={formData.investmentRange}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                                            >
                                                <option value="">Selecione...</option>
                                                <option value="até 300k">Até R$ 300.000</option>
                                                <option value="300k-500k">R$ 300.000 - R$ 500.000</option>
                                                <option value="500k-800k">R$ 500.000 - R$ 800.000</option>
                                                <option value="800k-1.2M">R$ 800.000 - R$ 1.200.000</option>
                                                <option value="acima 1.2M">Acima de R$ 1.200.000</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="preferredLocation" className="block text-sm font-medium text-gray-700 mb-1">
                                                Localização de Preferência
                                            </label>
                                            <input
                                                type="text"
                                                id="preferredLocation"
                                                name="preferredLocation"
                                                value={formData.preferredLocation}
                                                onChange={handleChange}
                                                placeholder="Ex: Centro, Itapema, etc."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="md:col-span-2">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mensagem
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                                >
                                    {loading ? (
                                        <>
                                            <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                            <span>Enviando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>Enviar Mensagem</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => window.location.href = 'tel:+551146931234'}
                                    className="text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span>Ligar Agora</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            );
        }

        // Default layout para as outras variantes
        return (
            <>
                <div className="text-center mb-8">
                    <h3 className={`text-2xl ${variant === 'premium' ? 'md:text-3xl' : ''} font-bold text-gray-900 mb-2`}>{title}</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className={config.grid}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nome completo
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Telefone
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                Assunto
                            </label>
                            <select
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                                required
                            >
                                <option value="">Selecione...</option>
                                <option value="Compra">Interesse em Compra</option>
                                <option value="Aluguel">Interesse em Aluguel</option>
                                <option value="Venda">Quero Vender</option>
                                <option value="Avaliação">Avaliação de Imóvel</option>
                                <option value="Outro">Outro Assunto</option>
                            </select>
                        </div>

                        {showInvestmentFields && (
                            <>
                                <div>
                                    <label htmlFor="investmentRange" className="block text-sm font-medium text-gray-700 mb-1">
                                        Faixa de Investimento
                                    </label>
                                    <select
                                        id="investmentRange"
                                        name="investmentRange"
                                        value={formData.investmentRange}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="até 300k">Até R$ 300.000</option>
                                        <option value="300k-500k">R$ 300.000 - R$ 500.000</option>
                                        <option value="500k-800k">R$ 500.000 - R$ 800.000</option>
                                        <option value="800k-1.2M">R$ 800.000 - R$ 1.200.000</option>
                                        <option value="acima 1.2M">Acima de R$ 1.200.000</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Data Preferencial de Visita
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <input
                                            type="date"
                                            id="visitDate"
                                            name="visitDate"
                                            value={formData.visitDate}
                                            onChange={handleChange}
                                            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className={variant === 'compact' ? '' : 'md:col-span-2'}>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                Mensagem
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                                required
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r ${config.accent} hover:opacity-95 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg`}
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                    <span>Enviando...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Enviar Mensagem</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </>
        );
    };

    return (
        <section className="py-16 px-4">
            <div className="container mx-auto">
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className={`${backgroundColor} ${variant === 'side-by-side' ? config.container : config.container
                        }`}
                >
                    {renderFormContent()}
                </motion.div>
            </div>
        </section>
    );
}
