'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, TrendingUp, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/button';
import Image from 'next/image';

const FormalHero = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const stats = [
    { number: "500+", label: "Imóveis Vendidos", icon: TrendingUp },
    { number: "15+", label: "Anos de Experiência", icon: MapPin },
    { number: "98%", label: "Clientes Satisfeitos", icon: Search }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Nova Ipê - Imóveis de Luxo"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-800/60" />
      </div>

      {/* Geometric Patterns */}
      <div className="absolute top-20 right-20 w-64 h-64 border border-amber-400/20 rotate-45 animate-pulse" />
      <div className="absolute bottom-40 left-10 w-32 h-32 border-2 border-amber-400/30 rotate-12" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Content Column */}
          <motion.div 
            className="space-y-8"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring" as const, stiffness: 400 }}
              >
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                Imobiliária Premium em Guararema
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-light text-white leading-tight">
                Sua Casa dos
                <span className="block font-semibold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Sonhos
                </span>
                Te Espera
              </h1>
              
              <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
                Há mais de 15 anos conectando famílias aos imóveis perfeitos em Guararema 
                e região, com transparência, profissionalismo e dedicação.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 text-lg font-medium group"
              >
                Ver Imóveis Disponíveis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-slate-600 text-slate-200 hover:bg-slate-800 px-8 py-4 text-lg"
              >
                Agendar Visita
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="text-center space-y-2"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring" as const, stiffness: 300 }}
                  >
                    <Icon className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Visual Column */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Main Image */}
              <motion.div 
                className="relative z-10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring" as const, stiffness: 300 }}
              >
                <Image
                  src="/images/escritorioInterior.jpg"
                  alt="Nova Ipê - Escritório"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-900/50 to-transparent" />
              </motion.div>

              {/* Floating Cards */}
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl max-w-sm"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Localização Premium</div>
                    <div className="text-sm text-slate-600">Guararema e Região</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -top-6 -right-6 bg-slate-900/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl text-white"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                whileHover={{ y: 5 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">R$ 2.5M+</div>
                  <div className="text-sm text-slate-300">Em Vendas Realizadas</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div 
          className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-1 h-2 bg-slate-400 rounded-full mt-2"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FormalHero;

