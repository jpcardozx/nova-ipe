'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  User, 
  MapPin, 
  Send, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/button';

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

const FormalContactForm = () => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
      transition: { duration: 0.2 }
    },
    blur: {
      scale: 1,
      boxShadow: "0 0 0 0px rgba(59, 130, 246, 0)",
      transition: { duration: 0.2 }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.interesse) {
      newErrors.interesse = 'Selecione seu interesse';
    }

    if (!formData.mensagem.trim()) {
      newErrors.mensagem = 'Mensagem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cidade: '',
        mensagem: '',
        interesse: ''
      });
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
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-light text-slate-900 mb-4">
              Fale com Nossos <span className="font-semibold text-amber-600">Especialistas</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Nossa equipe está pronta para ajudar você a encontrar o imóvel perfeito 
              ou realizar a melhor negociação.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                  Entre em Contato
                </h3>
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
                      title: 'Endereço',
                      content: 'Guararema, SP',
                      href: '#'
                    }
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.a
                        key={index}
                        href={item.href}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                          <Icon className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{item.title}</div>
                          <div className="text-slate-600">{item.content}</div>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* Business Hours */}
              <motion.div 
                className="bg-slate-900 text-white p-6 rounded-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h4 className="font-semibold mb-4">Horário de Atendimento</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Segunda - Sexta</span>
                    <span>8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábados</span>
                    <span>8:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Domingos</span>
                    <span>Fechado</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nome Completo *
                    </label>
                    <motion.input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all ${
                        errors.nome 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-slate-300 focus:border-blue-500 bg-white'
                      }`}
                      placeholder="Digite seu nome completo"
                      variants={inputVariants}
                      whileFocus="focus"
                      onBlur={() => inputVariants.blur}
                    />
                    <AnimatePresence>
                      {errors.nome && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.nome}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <motion.input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all ${
                        errors.email 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-slate-300 focus:border-blue-500 bg-white'
                      }`}
                      placeholder="seu@email.com"
                      variants={inputVariants}
                      whileFocus="focus"
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Telefone */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Telefone *
                    </label>
                    <motion.input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all ${
                        errors.telefone 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-slate-300 focus:border-blue-500 bg-white'
                      }`}
                      placeholder="(11) 99999-9999"
                      variants={inputVariants}
                      whileFocus="focus"
                    />
                    <AnimatePresence>
                      {errors.telefone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.telefone}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Cidade */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cidade
                    </label>
                    <motion.input
                      type="text"
                      value={formData.cidade}
                      onChange={(e) => handleInputChange('cidade', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white transition-all"
                      placeholder="Sua cidade"
                      variants={inputVariants}
                      whileFocus="focus"
                    />
                  </div>
                </div>

                {/* Interesse */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Como podemos ajudar? *
                  </label>
                  <motion.select
                    value={formData.interesse}
                    onChange={(e) => handleInputChange('interesse', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all ${
                      errors.interesse 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-slate-300 focus:border-blue-500 bg-white'
                    }`}
                    variants={inputVariants}
                    whileFocus="focus"
                  >
                    <option value="">Selecione uma opção</option>
                    {interesseOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </motion.select>
                  <AnimatePresence>
                    {errors.interesse && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.interesse}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mensagem */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mensagem *
                  </label>
                  <motion.textarea
                    value={formData.mensagem}
                    onChange={(e) => handleInputChange('mensagem', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all resize-none ${
                      errors.mensagem 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-slate-300 focus:border-blue-500 bg-white'
                    }`}
                    placeholder="Conte-nos mais sobre o que você procura..."
                    variants={inputVariants}
                    whileFocus="focus"
                  />
                  <AnimatePresence>
                    {errors.mensagem && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.mensagem}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 text-lg font-medium relative"
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Enviando...
                        </motion.div>
                      ) : (
                        <motion.div
                          key="send"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Send className="w-5 h-5" />
                          Enviar Mensagem
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>

                {/* Success/Error Messages */}
                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-800"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Mensagem enviada com sucesso!</p>
                        <p className="text-sm">Em breve entraremos em contato.</p>
                      </div>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-800"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Erro ao enviar mensagem</p>
                        <p className="text-sm">Tente novamente ou entre em contato por telefone.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FormalContactForm;