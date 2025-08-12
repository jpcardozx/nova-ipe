'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  User, 
  MapPin, 
  Send, 
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  Users,
  Building
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

const EnhancedContactForm = () => {
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
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.1)",
      transition: { duration: 0.2 }
    },
    blur: {
      scale: 1,
      boxShadow: "0 0 0 0px rgba(245, 158, 11, 0)",
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

  const stats = [
    { icon: Award, value: '25+', label: 'Anos de Experiência' },
    { icon: Users, value: '2000+', label: 'Clientes Satisfeitos' },
    { icon: Building, value: '500+', label: 'Imóveis Vendidos' }
  ];

  return (
    <>
      {/* Hero Section with Office Images */}
      <section className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-amber-50 via-white to-slate-50">
        <div className="absolute inset-0">
          <div className="grid grid-cols-2 h-full">
            <motion.div
              className="relative overflow-hidden"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
            >
              <Image
                src="/images/escritorioInterior.jpg"
                alt="Interior do Escritório Nova Ipê"
                fill
                className="object-cover scale-110 hover:scale-100 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-900/40 to-transparent" />
            </motion.div>
            <motion.div
              className="relative overflow-hidden"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <Image
                src="/images/escritorioInteriorInferior.jpg"
                alt="Espaço de Atendimento Nova Ipê"
                fill
                className="object-cover scale-110 hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-slate-900/50 to-transparent" />
            </motion.div>
          </div>
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 flex items-center justify-center min-h-[70vh] px-4">
          <motion.div
            className="text-center text-white max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-5xl lg:text-7xl font-light mb-6 drop-shadow-lg"
            >
              Visite Nosso
              <span className="block font-bold text-amber-300">Escritório</span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-xl lg:text-2xl mb-8 text-slate-100 max-w-3xl mx-auto leading-relaxed drop-shadow"
            >
              Um ambiente acolhedor e profissional onde seus sonhos imobiliários 
              se tornam realidade. Nossa equipe especializada está pronta para atendê-lo.
            </motion.p>
            
            {/* Stats Grid */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring" as const, stiffness: 300 }}
                  >
                    <div className="w-16 h-16 bg-amber-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-300/30">
                      <Icon className="w-8 h-8 text-amber-300" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-200">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-br from-white to-slate-50 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Section Header */}
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-light text-slate-900 mb-4">
                Entre em <span className="font-bold text-amber-600">Contato</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Nossa equipe de especialistas está pronta para transformar seus objetivos 
                imobiliários em realidade. Agende uma visita ou fale conosco.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Contact Information */}
              <motion.div variants={itemVariants} className="space-y-8">
                {/* Office Showcase */}
                <motion.div 
                  className="relative rounded-3xl overflow-hidden shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring" as const, stiffness: 300 }}
                >
                  <Image
                    src="/images/escritorioInterior.jpg"
                    alt="Ambiente de Atendimento Nova Ipê"
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-semibold mb-2">Nosso Espaço</h3>
                    <p className="text-slate-200">Ambiente profissional e acolhedor</p>
                  </div>
                </motion.div>

                {/* Contact Details */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                    Informações de Contato
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Phone,
                        title: 'Telefone',
                        content: '(11) 4693-8484',
                        href: 'tel:+551146938484',
                        description: 'Atendimento especializado'
                      },
                      {
                        icon: Mail,
                        title: 'Email',
                        content: 'contato@novaipe.com.br',
                        href: 'mailto:contato@novaipe.com.br',
                        description: 'Resposta em até 2 horas'
                      },
                      {
                        icon: MapPin,
                        title: 'Localização',
                        content: 'Guararema, SP',
                        href: '#',
                        description: 'Fácil acesso e estacionamento'
                      }
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.a
                          key={index}
                          href={item.href}
                          className="flex items-center gap-4 p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all group border border-slate-100"
                          whileHover={{ x: 5, scale: 1.02 }}
                          transition={{ type: "spring" as const, stiffness: 400 }}
                        >
                          <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 text-lg">{item.title}</div>
                            <div className="text-amber-600 font-medium">{item.content}</div>
                            <div className="text-sm text-slate-500">{item.description}</div>
                          </div>
                        </motion.a>
                      );
                    })}
                  </div>
                </div>

                {/* Business Hours */}
                <motion.div 
                  className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring" as const, stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-8 h-8 text-amber-400" />
                    <h4 className="font-semibold text-xl">Horário de Atendimento</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-700">
                      <span className="text-slate-300">Segunda - Sexta</span>
                      <span className="font-semibold text-amber-400">8:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-700">
                      <span className="text-slate-300">Sábados</span>
                      <span className="font-semibold text-amber-400">8:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-400">Domingos</span>
                      <span className="text-slate-500">Fechado</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Enhanced Contact Form */}
              <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                      Envie sua Mensagem
                    </h3>
                    <p className="text-slate-600">
                      Preencha o formulário e retornaremos em breve
                    </p>
                  </div>

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
                            : 'border-slate-300 focus:border-amber-500 bg-white'
                        }`}
                        placeholder="Digite seu nome completo"
                        variants={inputVariants}
                        whileFocus="focus"
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
                            : 'border-slate-300 focus:border-amber-500 bg-white'
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
                            : 'border-slate-300 focus:border-amber-500 bg-white'
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
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 bg-white transition-all"
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
                          : 'border-slate-300 focus:border-amber-500 bg-white'
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
                          : 'border-slate-300 focus:border-amber-500 bg-white'
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
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 text-lg font-medium relative rounded-xl shadow-lg"
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
    </>
  );
};

export default EnhancedContactForm;

