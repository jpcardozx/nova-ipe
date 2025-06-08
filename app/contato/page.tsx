// app/contato/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import Navbar from '../sections/NavBar';
import Footer from '../sections/Footer';
import { Button } from '@/components/ui/button';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  mensagem: string;
  interesse: 'compra' | 'venda' | 'aluguel' | 'avaliacao' | '';
}

interface FormErrors {
  [key: string]: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    mensagem: '',
    interesse: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({ nome: '', email: '', telefone: '', cidade: '', mensagem: '', interesse: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const interesseOptions = [
    { value: 'compra', label: 'Comprar Imóvel' },
    { value: 'venda', label: 'Vender Imóvel' },
    { value: 'aluguel', label: 'Alugar Imóvel' },
    { value: 'avaliacao', label: 'Avaliar Imóvel' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h1 className="text-5xl lg:text-6xl font-light text-slate-900 mb-6">
              Entre em <span className="font-bold text-amber-600">Contato</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Nossa equipe está pronta para transformar seus objetivos imobiliários em realidade
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Office Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/escritorioInterior.jpg"
                  alt="Escritório Nova Ipê"
                  width={600}
                  height={400}
                  className="w-full h-80 object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-semibold mb-1">Nosso Escritório</h3>
                  <p className="text-slate-200">Ambiente acolhedor e profissional</p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                {[
                  {
                    icon: Phone,
                    title: 'Telefone',
                    content: '(11) 4693-8484',
                    href: 'tel:+551146938484'
                  },
                  {
                    icon: Mail,
                    title: 'Email',
                    content: 'contato@novaipe.com.br',
                    href: 'mailto:contato@novaipe.com.br'
                  },
                  {
                    icon: MapPin,
                    title: 'Localização',
                    content: 'Guararema, SP',
                    href: '#'
                  }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={index}
                      href={item.href}
                      className="flex items-center gap-4 p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow border border-slate-100"
                    >
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{item.title}</div>
                        <div className="text-amber-600 font-medium">{item.content}</div>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Business Hours */}
              <div className="bg-slate-900 text-white p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-amber-400" />
                  <h4 className="font-semibold text-lg">Horário de Atendimento</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Segunda - Sexta</span>
                    <span className="text-amber-400 font-medium">8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábados</span>
                    <span className="text-amber-400 font-medium">8:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Domingos</span>
                    <span>Fechado</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                  Envie sua Mensagem
                </h3>
                <p className="text-slate-600">
                  Preencha o formulário e retornaremos em breve
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                        errors.nome ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="Digite seu nome"
                    />
                    {errors.nome && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.nome}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                        errors.email ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Telefone */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                        errors.telefone ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="(11) 99999-9999"
                    />
                    {errors.telefone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.telefone}
                      </p>
                    )}
                  </div>

                  {/* Cidade */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={formData.cidade}
                      onChange={(e) => handleInputChange('cidade', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                      placeholder="Sua cidade"
                    />
                  </div>
                </div>

                {/* Interesse */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Como podemos ajudar? *
                  </label>
                  <select
                    value={formData.interesse}
                    onChange={(e) => handleInputChange('interesse', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                      errors.interesse ? 'border-red-300' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Selecione uma opção</option>
                    {interesseOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.interesse && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.interesse}
                    </p>
                  )}
                </div>

                {/* Mensagem */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    value={formData.mensagem}
                    onChange={(e) => handleInputChange('mensagem', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none ${
                      errors.mensagem ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="Conte-nos mais sobre o que você procura..."
                  />
                  {errors.mensagem && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.mensagem}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-medium rounded-lg transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Enviar Mensagem
                    </div>
                  )}
                </Button>

                {/* Success/Error Messages */}
                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 text-green-800"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Mensagem enviada com sucesso!</p>
                        <p className="text-sm">Retornaremos em breve.</p>
                      </div>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-800"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Erro ao enviar mensagem</p>
                        <p className="text-sm">Tente novamente ou ligue para nós.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
