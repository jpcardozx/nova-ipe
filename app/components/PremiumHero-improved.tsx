'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Search,
  Home,
  MapPin,
  TrendingUp,
  Star,
  Award,
  Users,
  ArrowRight,
  Building2,
  Shield,
  Target,
  CheckCircle,
  Play,
  Pause,
  ChevronDown
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  highlight: string;
  description: string;
  image: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary: { text: string; href: string };
}

const heroSlides: HeroSlide[] = [
  {
    id: 'expertise',
    title: 'Excelência Imobiliária',
    subtitle: 'Há 15 anos conectando famílias aos imóveis ideais',
    highlight: 'Mais de 1.200 famílias atendidas',
    description: 'Especialistas em mercado imobiliário de Guararema e região, oferecendo assessoria completa com transparência e profissionalismo reconhecidos.',
    image: '/images/escritorioInterior.jpg',
    ctaPrimary: { text: 'Ver Portfólio', href: '/imoveis' },
    ctaSecondary: { text: 'Agendar Consulta', href: '/contato' }
  },
  {
    id: 'investment',
    title: 'Oportunidades de Investimento',
    subtitle: 'Análise estratégica do mercado imobiliário',
    highlight: 'R$ 120M+ em transações realizadas',
    description: 'Identificamos oportunidades de investimento com potencial de valorização através de análise técnica e conhecimento aprofundado do mercado local.',
    image: '/images/hero-investimento.jpg',
    ctaPrimary: { text: 'Analisar Mercado', href: '/investimentos' },
    ctaSecondary: { text: 'Consultoria Especializada', href: '/analise' }
  },
  {
    id: 'results',
    title: 'Resultados Comprovados',
    subtitle: 'Histórico de sucesso e satisfação do cliente',
    highlight: '98% de índice de satisfação',
    description: 'Nossa abordagem personalizada e dedicação em cada etapa do processo garantem resultados excepcionais e relacionamentos duradouros.',
    image: '/images/hero-resultados.jpg',
    ctaPrimary: { text: 'Nossos Cases', href: '/sobre' },
    ctaSecondary: { text: 'Depoimentos', href: '/depoimentos' }
  }
];

const stats = [
  {
    label: 'Imóveis Negociados',
    value: '1.200+',
    icon: Home,
    description: 'Transações bem-sucedidas'
  },
  {
    label: 'Índice de Satisfação',
    value: '98%',
    icon: Star,
    description: 'Clientes recomendariam'
  },
  {
    label: 'Anos de Experiência',
    value: '15+',
    icon: Award,
    description: 'Expertise consolidada'
  },
  {
    label: 'Volume Negociado',
    value: 'R$ 120M+',
    icon: TrendingUp,
    description: 'Em transações realizadas'
  }
];

export default function PremiumHeroImproved() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { scrollY } = useScroll();

  // Parallax e scroll effects mais sutis
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.9]);

  // Auto-slide com intervalo maior para leitura
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000); // 8 segundos para leitura confortável

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentSlideData = heroSlides[currentSlide];

  // Animações mais refinadas
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background com tratamento profissional */}
      <motion.div style={{ y }} className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={currentSlideData.image}
              alt={currentSlideData.title}
              fill
              className="object-cover"
              priority
              quality={95}
            />
            {/* Overlay profissional para legibilidade */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-800/70 to-slate-900/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-800/40" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Elementos geométricos discretos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 border border-amber-400/10 rotate-45" />
        <div className="absolute bottom-40 left-10 w-32 h-32 border border-amber-400/15 rotate-12" />

        {/* Partículas sutis */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/20 rounded-full"
            animate={{
              y: [-20, -600],
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 4 + 6,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: '100%'
            }}
          />
        ))}
      </div>

      {/* Conteúdo principal */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 container mx-auto px-6 lg:px-8 py-20"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* Coluna de conteúdo */}
          <motion.div
            className="space-y-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 30, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Badge profissional */}
                <motion.div
                  variants={fadeInUp}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-sm font-medium backdrop-blur-sm"
                >
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  {currentSlideData.highlight}
                </motion.div>

                {/* Título principal */}
                <motion.h1
                  variants={fadeInUp}
                  className="text-4xl lg:text-6xl font-light text-white leading-tight"
                >
                  <span className="font-normal">
                    {currentSlideData.title.split(' ').slice(0, -1).join(' ')}
                  </span>
                  <span className="block font-semibold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                    {currentSlideData.title.split(' ').slice(-1)}
                  </span>
                </motion.h1>

                {/* Subtítulo */}
                <motion.p
                  variants={fadeInUp}
                  className="text-xl text-slate-300 font-medium leading-relaxed"
                >
                  {currentSlideData.subtitle}
                </motion.p>

                {/* Descrição */}
                <motion.p
                  variants={fadeInUp}
                  className="text-lg text-slate-400 leading-relaxed max-w-2xl"
                >
                  {currentSlideData.description}
                </motion.p>

                {/* Botões de ação */}
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 text-base font-medium group transition-all duration-300"
                    asChild
                  >
                    <Link href={currentSlideData.ctaPrimary.href}>
                      {currentSlideData.ctaPrimary.text}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-600 text-slate-200 hover:bg-slate-800/50 hover:border-slate-500 px-8 py-4 text-base backdrop-blur-sm transition-all duration-300"
                    asChild
                  >
                    <Link href={currentSlideData.ctaSecondary.href}>
                      {currentSlideData.ctaSecondary.text}
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Coluna visual com estatísticas */}
          <motion.div
            className="relative space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Imagem principal com overlay sutil */}
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="/images/escritorioInterior.jpg"
                alt="Nova Ipê - Escritório Profissional"
                width={600}
                height={400}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-800/20" />

              {/* Card flutuante com informação premium */}
              <motion.div
                className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 rounded-xl shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Guararema e Região</div>
                      <div className="text-sm text-slate-600">Especialização Local</div>
                    </div>
                  </div>
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </motion.div>
            </motion.div>

            {/* Grid de estatísticas profissionais */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Icon className="h-4 w-4 text-amber-400" />
                      </div>
                    </div>
                    <div className="text-xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-300 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-slate-400">
                      {stat.description}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* Navegação de slides refinada */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsAutoPlaying(false);
                  setTimeout(() => setIsAutoPlaying(true), 5000);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'w-8 bg-amber-500'
                  : 'w-2 bg-slate-500 hover:bg-slate-400'
                  }`}
              />
            ))}
          </div>

          <div className="text-xs text-slate-400 ml-2">
            {currentSlide + 1} / {heroSlides.length}
          </div>
        </motion.div>

        {/* Indicador de scroll elegante */}
        <motion.div
          className="absolute bottom-8 right-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center cursor-pointer hover:border-slate-300 transition-colors"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-2 bg-slate-400 rounded-full mt-2"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}