'use client';

import React, { useState, useCallback } from 'react';
import {
  Phone, Mail, MapPin, Clock, Send, AlertCircle, CheckCircle,
  Shield, Award, Users, TrendingUp, MessageSquare, ArrowRight
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
  mensagem?: string;
  interesse?: string;
}

export default function ContactPage() {
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

  const contactMethods = [
    {
      icon: Phone,
      title: 'Telefone',
      content: '(11) 4693-3003',
      subtitle: 'Atendimento comercial',
      href: 'tel:+551146933003'
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
      title: 'Endereço',
      content: 'Praca 9 de Julho, 65 | Guararema, SP',
      subtitle: 'Atendimento presencial',
      href: 'https://maps.google.com/?q=Guararema,SP'
    }
  ];

  const serviceOptions = [
    { value: 'compra-residencial', label: 'Compra de Imóvel Residencial' },
    { value: 'venda-residencial', label: 'Venda de Imóvel Residencial' },
    { value: 'locacao', label: 'Locação' },
    { value: 'investimento', label: 'Consultoria para Investimento' },
    { value: 'avaliacao', label: 'Avaliação de Imóvel' },
    { value: 'outros', label: 'Outros Serviços' }
  ];

  const credentials = [
    { icon: Award, number: '15+', label: 'Anos de Atuação' },
    { icon: Shield, number: '98%', label: 'Clientes Satisfeitos' },
    { icon: TrendingUp, number: '500+', label: 'Transações Realizadas' },
    { icon: Users, number: '1000+', label: 'Clientes Atendidos' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <section className="bg-white border-b border-gray-200 pt-6 sm:pt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-amber-100 text-amber-800 text-sm font-medium rounded-lg mb-6">
              Ipê Imóveis • Especialistas em Guararema desde 2008
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Fale com Nossa Equipe
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Entre em contato para consultoria especializada em compra, venda e locação de imóveis em Guararema e região.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {credentials.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index}>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Contact Info */}
            <div className="lg:col-span-2">

              {/* Office Image */}
              <div className="relative mb-8 rounded-md overflow-hidden shadow-lg">
                <div className="h-64 rounded-md overflow-hidden bg-gray-200">
                  <img
                    src="/images/escritorioInterior.jpg"
                    alt="Escritório Ipê Imóveis"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">Nosso Escritório</h3>
                    <p className="text-sm opacity-60">Seja atendido presencialmente</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded text-xs font-medium">
                    Desde 2008
                  </div>
                </div>
              </div>

              {/* Contact Methods */}
              <div className="space-y-4 mb-8">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <a
                      key={index}
                      href={method.href}
                      target={method.href.startsWith('http') ? '_blank' : '_self'}
                      className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-amber-300 transition-colors"
                    >
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{method.title}</h4>
                        <p className="text-gray-600">{method.content}</p>
                        <p className="text-sm text-gray-500">{method.subtitle}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </a>
                  );
                })}
              </div>

              {/* Business Hours */}
              <div className="bg-gray-900 text-white p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <h4 className="font-semibold">Horário de Atendimento</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Segunda - Sexta</span>
                    <span>9:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábados</span>
                    <span>9:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-700">
                    <span>Atendimento via WhatsApp</span>
                    <span className="text-amber-400">Disponível</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg border border-gray-200 p-8" id="form">

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Solicitar Atendimento
                  </h2>
                  <p className="text-gray-600">
                    Preencha o formulário abaixo. Nossa equipe entrará em contato em até 24 horas.
                  </p>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900">Mensagem enviada com sucesso</h4>
                        <p className="text-green-700 text-sm">Nossa equipe entrará em contato em breve.</p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-900">Erro no envio</h4>
                        <p className="text-red-700 text-sm">Tente novamente ou entre em contato por telefone.</p>
                      </div>
                    </div>
                  </div>
                )}

                <form className="space-y-6">

                  {/* Personal Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Dados de Contato</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={formData.nome}
                          onChange={(e) => handleInputChange('nome', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${errors.nome ? 'border-red-300' : 'border-gray-300'
                            }`}
                          placeholder="Seu nome completo"
                        />
                        {errors.nome && (
                          <p className="text-red-600 text-sm mt-1">{errors.nome}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${errors.email ? 'border-red-300' : 'border-gray-300'
                            }`}
                          placeholder="seu@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          value={formData.telefone}
                          onChange={(e) => handleInputChange('telefone', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${errors.telefone ? 'border-red-300' : 'border-gray-300'
                            }`}
                          placeholder="(11) 99999-9999"
                        />
                        {errors.telefone && (
                          <p className="text-red-600 text-sm mt-1">{errors.telefone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cidade de Interesse
                        </label>
                        <input
                          type="text"
                          value={formData.cidade}
                          onChange={(e) => handleInputChange('cidade', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          placeholder="Guararema, Mogi das Cruzes..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Service Interest */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Serviço de Interesse</h3>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Serviço *
                      </label>
                      <select
                        value={formData.interesse}
                        onChange={(e) => handleInputChange('interesse', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${errors.interesse ? 'border-red-300' : 'border-gray-300'
                          }`}
                      >
                        <option value="">Selecione o tipo de serviço</option>
                        {serviceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.interesse && (
                        <p className="text-red-600 text-sm mt-1">{errors.interesse}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Faixa de Orçamento
                        </label>
                        <select
                          value={formData.orcamento || ''}
                          onChange={(e) => handleInputChange('orcamento', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                          <option value="">Não informado</option>
                          <option value="ate-300k">Até R$ 300 mil</option>
                          <option value="300k-500k">R$ 300 - 500 mil</option>
                          <option value="500k-1mi">R$ 500 mil - 1 milhão</option>
                          <option value="1mi-plus">Acima de R$ 1 milhão</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prazo
                        </label>
                        <select
                          value={formData.prazo || ''}
                          onChange={(e) => handleInputChange('prazo', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                          <option value="">Flexível</option>
                          <option value="urgente">Até 30 dias</option>
                          <option value="medio">2-6 meses</option>
                          <option value="longo">Mais de 6 meses</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      value={formData.mensagem}
                      onChange={(e) => handleInputChange('mensagem', e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none ${errors.mensagem ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="Descreva suas necessidades e preferências sobre o imóvel..."
                    />
                    {errors.mensagem && (
                      <p className="text-red-600 text-sm mt-1">{errors.mensagem}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Enviar Solicitação</span>
                      </>
                    )}
                  </button>

                  {/* Privacy Notice */}
                  <div className="text-center pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-amber-600" />
                      <span>Seus dados são tratados de acordo com a LGPD</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}