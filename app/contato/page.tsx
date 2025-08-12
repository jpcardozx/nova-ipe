'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Mail, MapPin, Clock, Send, AlertCircle, CheckCircle,
  Shield, Award, Users, TrendingUp, Star, Calendar, MessageSquare,
  ArrowRight, Building2, Home, FileCheck
} from 'lucide-react';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  mensagem: string;
  interesse: string;
  orcamento?: string;
  prazo?: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  mensagem?: string;
  interesse?: string;
}

export default function ProfessionalContactPage() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    mensagem: '',
    interesse: '',
    orcamento: '',
    prazo: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.interesse) newErrors.interesse = 'Selecione seu interesse';
    if (!formData.mensagem.trim()) newErrors.mensagem = 'Mensagem é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        nome: '', email: '', telefone: '', cidade: '',
        mensagem: '', interesse: '', orcamento: '', prazo: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Professional contact methods - Ipê palette
  const contactMethods = [
    {
      icon: Phone,
      title: 'Telefone',
      content: '(11) 4693-8484',
      subtitle: 'Atendimento direto',
      href: 'tel:+551146938484'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contato@ipeimoveis.com.br',
      subtitle: 'Envie sua consulta',
      href: 'mailto:contato@ipeimoveis.com.br'
    },
    {
      icon: MapPin,
      title: 'Escritório',
      content: 'Guararema, SP',
      subtitle: 'Visite nosso escritório',
      href: 'https://maps.google.com/?q=Guararema,SP'
    },
    {
      icon: Calendar,
      title: 'Agendamento',
      content: 'Consulta Personalizada',
      subtitle: 'Marque uma reunião',
      href: '#form'
    }
  ];

  const serviceOptions = [
    {
      value: 'compra-casa',
      label: 'Compra de Casa'
    },
    {
      value: 'compra-apartamento',
      label: 'Compra de Apartamento'
    },
    {
      value: 'investimento',
      label: 'Investimento Imobiliário'
    },
    {
      value: 'venda',
      label: 'Venda de Imóvel'
    },
    {
      value: 'locacao',
      label: 'Locação'
    },
    {
      value: 'avaliacao',
      label: 'Avaliação de Imóvel'
    }
  ];

  const credentials = [
    {
      icon: Award,
      number: '15+',
      label: 'Anos',
      detail: 'de Experiência'
    },
    {
      icon: Shield,
      number: '98%',
      label: 'Satisfação',
      detail: 'dos Clientes'
    },
    {
      icon: TrendingUp,
      number: '500+',
      label: 'Imóveis',
      detail: 'Vendidos'
    },
    {
      icon: Users,
      number: '1000+',
      label: 'Famílias',
      detail: 'Atendidas'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">

      {/* Clean professional background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/60" />

        {/* Subtle Ipê-themed accents */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-amber-100/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-yellow-100/20 to-transparent" />

        {/* Professional grid - very subtle */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #d97706 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Hero Section */}
      <motion.section
        className="relative pt-24 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Professional badge */}
          <motion.div
            className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/90 backdrop-blur-sm border border-amber-200/60 rounded-full mb-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Shield className="w-4 h-4 text-amber-600" />
            <span className="text-slate-700 font-medium text-sm">Ipê Imóveis - Especialistas em Guararema</span>
            <Star className="w-4 h-4 text-amber-500" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Entre em{' '}
            <span className="font-semibold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
              Contato
            </span>
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl text-slate-600">
              conosco
            </span>
          </motion.h1>

          {/* Professional value proposition */}
          <motion.p
            className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Nossa equipe está preparada para auxiliar você em todas as etapas do seu projeto imobiliário,
            com 15 anos de experiência no mercado de Guararema e região.
          </motion.p>

          {/* Professional CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.a
              href="#form"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Enviar Mensagem</span>
            </motion.a>

            <motion.a
              href="tel:+551146938484"
              className="w-full sm:w-auto bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-slate-700 hover:text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all duration-300"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Phone className="w-5 h-5" />
              <span>Ligar Agora</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-start">

            {/* Contact Information */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >

              {/* Office image */}
              <div className="relative group">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-amber-100 to-yellow-100">
                  <img
                    src="/images/escritorioInterior.jpg"
                    alt="Escritório Ipê Imóveis"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-lg font-semibold mb-1">Nosso Escritório</h3>
                    <p className="text-white/90 text-sm">
                      Ambiente profissional para atendimento presencial
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                    DESDE 2008
                  </div>
                </div>
              </div>

              {/* Contact methods */}
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <motion.a
                      key={index}
                      href={method.href}
                      target={method.href.startsWith('http') ? '_blank' : '_self'}
                      className="group block p-5 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 hover:border-amber-200 transition-all duration-300 shadow-sm hover:shadow-md"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 mb-1">
                            {method.title}
                          </h3>
                          <p className="text-slate-900 font-medium text-sm mb-1">
                            {method.content}
                          </p>
                          <p className="text-slate-600 text-xs">
                            {method.subtitle}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all duration-300" />
                      </div>
                    </motion.a>
                  );
                })}
              </div>

              {/* Business hours */}
              <motion.div
                className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-lg">Horário de Funcionamento</h4>
                </div>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Segunda - Sexta</span>
                    <span className="text-white font-medium">8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Sábados</span>
                    <span className="text-white font-medium">8:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-700 pt-2.5">
                    <span className="text-gray-400 text-sm">WhatsApp</span>
                    <span className="text-amber-400 font-medium text-sm">Disponível sempre</span>
                  </div>
                </div>
              </motion.div>

              {/* Credentials */}
              <motion.div
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 shadow-sm"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                <h3 className="text-xl font-semibold text-slate-800 mb-5 text-center">
                  Nossa Experiência
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {credentials.map((credential, index) => (
                    <div key={index} className="text-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm flex items-center justify-center">
                        <credential.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-xl font-bold text-slate-800 mb-1">{credential.number}</div>
                      <div className="text-sm font-medium text-slate-700 mb-1">{credential.label}</div>
                      <div className="text-xs text-slate-600 leading-tight">{credential.detail}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                id="form"
              >
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-800">
                        Fale Conosco
                      </h2>
                      <p className="text-slate-600 text-sm mt-1">
                        Preencha o formulário e entraremos em contato
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status messages */}
                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div
                      className="mb-6 p-5 bg-green-50 border border-green-200 rounded-xl"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-green-800 font-medium">Mensagem Enviada</p>
                          <p className="text-green-700 text-sm mt-1">
                            Entraremos em contato em breve.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      className="mb-6 p-5 bg-red-50 border border-red-200 rounded-xl"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="text-red-800 font-medium">Erro no Envio</p>
                          <p className="text-red-700 text-sm mt-1">
                            Tente novamente ou entre em contato por telefone.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-6">

                  {/* Personal info */}
                  <div>
                    <h3 className="text-base font-medium text-slate-800 mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-600" />
                      Dados Pessoais
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={formData.nome}
                          onChange={(e) => handleInputChange('nome', e.target.value)}
                          onFocus={() => setFocusedField('nome')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 ${errors.nome
                            ? 'border-red-300 bg-red-50'
                            : focusedField === 'nome'
                              ? 'border-amber-400 bg-amber-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          placeholder="Seu nome completo"
                        />
                        {errors.nome && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.nome}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 ${errors.email
                            ? 'border-red-300 bg-red-50'
                            : focusedField === 'email'
                              ? 'border-amber-400 bg-amber-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          placeholder="seu@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div>
                    <h3 className="text-base font-medium text-slate-800 mb-4 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-amber-600" />
                      Contato
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          value={formData.telefone}
                          onChange={(e) => handleInputChange('telefone', e.target.value)}
                          onFocus={() => setFocusedField('telefone')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 ${errors.telefone
                            ? 'border-red-300 bg-red-50'
                            : focusedField === 'telefone'
                              ? 'border-amber-400 bg-amber-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          placeholder="(11) 99999-9999"
                        />
                        {errors.telefone && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.telefone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Cidade
                        </label>
                        <input
                          type="text"
                          value={formData.cidade}
                          onChange={(e) => handleInputChange('cidade', e.target.value)}
                          onFocus={() => setFocusedField('cidade')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 ${focusedField === 'cidade'
                            ? 'border-amber-400 bg-amber-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          placeholder="Guararema, SP"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Interest */}
                  <div>
                    <h3 className="text-base font-medium text-slate-800 mb-4 flex items-center gap-2">
                      <Home className="w-4 h-4 text-amber-600" />
                      Interesse
                    </h3>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Como podemos ajudá-lo? *
                      </label>
                      <select
                        value={formData.interesse}
                        onChange={(e) => handleInputChange('interesse', e.target.value)}
                        onFocus={() => setFocusedField('interesse')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 appearance-none cursor-pointer ${errors.interesse
                          ? 'border-red-300 bg-red-50'
                          : focusedField === 'interesse'
                            ? 'border-amber-400 bg-amber-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                      >
                        <option value="">Selecione uma opção</option>
                        {serviceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.interesse && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.interesse}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Orçamento
                        </label>
                        <select
                          value={formData.orcamento || ''}
                          onChange={(e) => handleInputChange('orcamento', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 bg-white hover:border-gray-300"
                        >
                          <option value="">Não informado</option>
                          <option value="ate-300k">Até R$ 300 mil</option>
                          <option value="300k-500k">R$ 300-500 mil</option>
                          <option value="500k-1mi">R$ 500mil-1mi</option>
                          <option value="1mi-plus">Acima R$ 1mi</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Prazo
                        </label>
                        <select
                          value={formData.prazo || ''}
                          onChange={(e) => handleInputChange('prazo', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 bg-white hover:border-gray-300"
                        >
                          <option value="">Flexível</option>
                          <option value="urgente">Até 30 dias</option>
                          <option value="rapido">2-3 meses</option>
                          <option value="normal">6 meses</option>
                          <option value="longo">Mais de 6 meses</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      value={formData.mensagem}
                      onChange={(e) => handleInputChange('mensagem', e.target.value)}
                      onFocus={() => setFocusedField('mensagem')}
                      onBlur={() => setFocusedField(null)}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 resize-none ${errors.mensagem
                        ? 'border-red-300 bg-red-50'
                        : focusedField === 'mensagem'
                          ? 'border-amber-400 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      placeholder="Conte-nos como podemos ajudá-lo com seu projeto imobiliário..."
                    />
                    {errors.mensagem && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.mensagem}
                      </p>
                    )}
                  </div>

                  {/* Submit button */}
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-lg font-medium text-base flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 disabled:cursor-not-allowed"
                    whileHover={!isSubmitting ? { y: -1 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Enviar Mensagem</span>
                      </>
                    )}
                  </motion.button>

                  {/* Trust message */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2 text-slate-600 text-sm">
                      <Shield className="w-4 h-4 text-amber-600" />
                      <span>
                        Seus dados estão protegidos e serão usados apenas para contato
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}