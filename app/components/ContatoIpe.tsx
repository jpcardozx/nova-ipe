"use client";

import { useState, useRef } from "react";
import { Montserrat } from "next/font/google";
import { PhoneCall, Mail, MapPin, Clock, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

// Configuração de fonte
const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-montserrat",
});

export default function ContatoRefinadoIpe() {
    // Estados do formulário
    const [form, setForm] = useState({
        nome: "",
        telefone: "",
        email: "",
        assunto: "",
        mensagem: "",
        preferencia: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Hook de interseção para animações sutis
    const { ref: sectionRef, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    // Validação de campo individual
    const validateField = (name: string, value: string) => {
        if (!value.trim()) {
            return `Campo obrigatório`;
        }

        if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
            return 'E-mail inválido';
        }

        if (name === 'telefone' && !/^\(\d{2}\)\s\d{5}-\d{4}$/.test(value)) {
            return 'Formato: (00) 00000-0000';
        }

        return '';
    };

    // Handler para alteração de campos
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));

        // Remove erro quando o usuário começa a corrigir o campo
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handler para formatação de telefone
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';

        if (value.length <= 2) {
            formattedValue = value;
        } else if (value.length <= 7) {
            formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else {
            formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
        }

        handleChange({
            ...e,
            target: {
                ...e.target,
                value: formattedValue
            }
        } as React.ChangeEvent<HTMLInputElement>);
    };

    // Validação do formulário completo
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        // Validar campos obrigatórios
        const requiredFields = ['nome', 'telefone', 'email', 'assunto', 'mensagem'];

        requiredFields.forEach(field => {
            const error = validateField(field, form[field as keyof typeof form]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    // Handler de envio do formulário
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulação de envio para API
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);

            // Reset do formulário após 3 segundos
            setTimeout(() => {
                setForm({
                    nome: "",
                    telefone: "",
                    email: "",
                    assunto: "",
                    mensagem: "",
                    preferencia: ""
                });
                setIsSuccess(false);
            }, 5000);
        }, 1500);
    };

    return (
        <section
            ref={sectionRef}
            className={`py-16 md:py-20 bg-white ${montserrat.variable}`}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header da seção com copy engajante */}
                <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        Converse com quem realmente entende de Guararema
                    </h2>
                    <p className="text-lg text-gray-700">
                        Mais que uma imobiliária, somos seus consultores locais. Nossa equipe nasceu e cresceu aqui, conhecendo cada canto da região como a palma da mão.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Coluna do formulário */}
                    <div
                        className={`lg:col-span-7 bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100 
            transform transition-all duration-500 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    >
                        <div className="mb-6 md:mb-8">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                Como podemos ajudar?
                            </h3>
                            <p className="text-gray-600">
                                Envie sua mensagem e um especialista responderá em até 3 horas nos dias úteis.
                            </p>
                        </div>

                        {isSuccess ? (
                            <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full text-green-600 mb-4">
                                    <Check className="w-6 h-6" />
                                </div>                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                    Solicitação recebida com sucesso!
                                </h4>                                <p className="text-gray-700">
                                    Obrigado pelo interesse! Nossa equipe de especialistas em investimentos imobiliários entrará em contato em até 2 horas úteis com análise personalizada para você.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Nome */}
                                    <div>
                                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nome completo <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="nome"
                                            name="nome"
                                            value={form.nome}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-opacity-50 transition-colors
                        ${errors.nome ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200 focus:border-amber-500'}`}
                                            placeholder="Seu nome"
                                        />
                                        {errors.nome && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
                                        )}
                                    </div>

                                    {/* Telefone */}
                                    <div>
                                        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                                            Telefone/WhatsApp <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="telefone"
                                            name="telefone"
                                            value={form.telefone}
                                            onChange={handlePhoneChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-opacity-50 transition-colors
                        ${errors.telefone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200 focus:border-amber-500'}`}
                                            placeholder="(00) 00000-0000"
                                        />
                                        {errors.telefone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        E-mail <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-opacity-50 transition-colors
                      ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200 focus:border-amber-500'}`}
                                        placeholder="seu@email.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Assunto */}
                                <div>
                                    <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-1">
                                        Assunto <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="assunto"
                                        name="assunto"
                                        value={form.assunto}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-opacity-50 transition-colors
                      ${errors.assunto ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200 focus:border-amber-500'}`}
                                    >                                        <option value="">Escolha seu objetivo principal</option>
                                        <option value="Compra">Quero investir em imóvel para valorização</option>
                                        <option value="Venda">Quero vender meu imóvel com agilidade</option>
                                        <option value="Avaliação">Quero avaliar potencial do meu imóvel</option>
                                        <option value="Financiamento">Preciso de orientação sobre financiamento</option>
                                        <option value="Outros">Consultoria personalizada</option>
                                    </select>
                                    {errors.assunto && (
                                        <p className="mt-1 text-sm text-red-600">{errors.assunto}</p>
                                    )}
                                </div>

                                {/* Mensagem */}
                                <div>
                                    <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mensagem <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="mensagem"
                                        name="mensagem"
                                        value={form.mensagem}
                                        onChange={handleChange}
                                        rows={4} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-opacity-50 transition-colors
                      ${errors.mensagem ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200 focus:border-amber-500'}`}
                                        placeholder="Conte-nos sobre seu perfil, orçamento e objetivos de investimento..."
                                    />
                                    {errors.mensagem && (
                                        <p className="mt-1 text-sm text-red-600">{errors.mensagem}</p>
                                    )}
                                </div>

                                {/* Preferência de contato */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Como prefere ser contatado?
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Telefone', 'WhatsApp', 'Email'].map((option) => (
                                            <label
                                                key={option}
                                                className={`flex items-center justify-center px-4 py-2 border rounded-md cursor-pointer transition-colors
                          ${form.preferencia === option
                                                        ? 'bg-amber-50 border-amber-500 text-amber-800'
                                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="preferencia"
                                                    value={option}
                                                    checked={form.preferencia === option}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Botão de envio */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-lg 
                    transition-colors flex items-center justify-center
                    ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Enviando...
                                        </>
                                    ) : (<>
                                        Garantir minha consultoria especializada
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Coluna de informações */}
                    <div className="lg:col-span-5 space-y-6 md:space-y-8">
                        {/* Card de contatos */}
                        <div
                            className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 
              transform transition-all duration-500 delay-150 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        >
                            <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center">
                                <span className="w-8 h-1 bg-amber-500 mr-3"></span>
                                Fale com a gente
                            </h3>

                            <div className="space-y-5">
                                {/* Telefone */}
                                <div className="flex items-start">
                                    <div className="bg-amber-50 p-3 rounded-lg text-amber-600 flex-shrink-0 mr-4">
                                        <PhoneCall className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">
                                            Atendimento direto
                                        </div>
                                        <a
                                            href="tel:+551197123456"
                                            className="text-lg font-medium text-gray-900 hover:text-amber-600 transition-colors"
                                        >
                                            (11) 98184-5016
                                        </a>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Segunda a sábado, 9h às 18h
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start">
                                    <div className="bg-amber-50 p-3 rounded-lg text-amber-600 flex-shrink-0 mr-4">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">
                                            E-mail
                                        </div>
                                        <a
                                            href="mailto:contato@ipeimobiliaria.com.br"
                                            className="text-lg font-medium text-gray-900 hover:text-amber-600 transition-colors"
                                        >
                                            fernandesleonardo@terra.com.br
                                        </a>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Resposta em até 1 dia útil
                                        </div>
                                    </div>
                                </div>

                                {/* Endereço */}
                                <div className="flex items-start">
                                    <div className="bg-amber-50 p-3 rounded-lg text-amber-600 flex-shrink-0 mr-4">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">
                                            Endereço
                                        </div>
                                        <a
                                            href="https://maps.google.com/?q=Rua+XV+de+Novembro,+123,+Centro,+Guararema,+SP"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lg font-medium text-gray-900 hover:text-amber-600 transition-colors"
                                        >
                                            Praça IX de Julho, 65 - Centro
                                        </a>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Guararema/SP - Em frente à Igreja Matriz
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mapa com localização */}
                        <div
                            className={`relative rounded-xl overflow-hidden shadow-md h-[280px] 
              transform transition-all duration-500 delay-300 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        >
                            <div className="absolute inset-0 bg-gray-200">
                                {/* Seria substituído por um mapa real, usando Google Maps ou outro */}
                                <div className="relative w-full h-full overflow-hidden">
                                    <Image
                                        src="/images/mapa-guararema.jpg"
                                        alt="Localização da Ipê Imobiliária em Guararema"
                                        fill
                                        className="object-cover" />
                                    <div className="absolute inset-0 bg-black/40"></div>
                                </div>
                            </div>

                            {/* Pin de localização no mapa */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center shadow-lg">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-sm whitespace-nowrap">
                                    Ipê Imobiliária
                                </div>
                            </div>

                            {/* Badge de credencial */}
                            <div className="absolute bottom-3 right-3 bg-white rounded-lg shadow p-3 flex items-center">
                                <div className="bg-amber-100 p-1.5 rounded-full mr-2">
                                    <Image
                                        src="/images/ipeLogo.png"
                                        alt="Ipê Imobiliária"
                                        width={20}
                                        height={20}
                                        priority
                                    />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-900">CRECI 24.588-J</p>
                                    <p className="text-xs text-gray-500">Desde 2008</p>
                                </div>
                            </div>
                        </div>

                        {/* Horários de funcionamento */}
                        <div
                            className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 
              transform transition-all duration-500 delay-450 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        >
                            <div className="flex items-center mb-4">
                                <Clock className="w-5 h-5 text-amber-600 mr-2" />
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Horários de atendimento
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-800">Segunda à Sexta</span>
                                    <span className="text-amber-700 bg-amber-50 px-3 py-1 rounded-md">8:30 - 18:00</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-800">Sábados</span>
                                    <span className="text-amber-700 bg-amber-50 px-3 py-1 rounded-md">9:00 - 13:00</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="font-medium text-gray-800">Domingos e Feriados</span>
                                    <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-md">Plantão</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}