'use client';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-16 pb-16">
      <div className="absolute inset-0 z-0">
        {/* Placeholder for a cool background video or animation */}
        <div className="absolute inset-0 bg-gray-950/75 backdrop-blur-sm" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          poster="https://images.unsplash.com/photo-1522252234503-e356532cafd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
        >
          <source src="https://cdn.coverr.co/videos/coverr-coding-on-a-laptop-at-night-4823/1080p.mp4" type="video/mp4" />
        </video>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center"
      >
        <div className="mt-12 mb-6 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-amber-500/20 backdrop-blur-md px-6 py-3 text-sm font-semibold text-amber-300 border border-amber-400/40">
            <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-amber-400/50"></div>
            Disponível para Projetos
          </div>
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl mb-8" style={{ textShadow: '0 2px 30px rgba(0,0,0,0.9)' }}>
          Transformamos Sua Ideia em
          <span className="block text-transparent bg-gradient-to-tr from-amber-300 via-amber-400 to-amber-300 bg-clip-text">Aplicação Profissional</span>
        </h1>
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-2xl sm:text-3xl text-white font-light leading-tight">
            Desenvolvedor Full-Stack com
            <span className="text-amber-300 font-semibold"> 3+ anos de experiência</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-amber-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span>Projetos entregues: <strong className="text-white">25+</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span>Satisfação: <strong className="text-white">100%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              <span>Prazo médio: <strong className="text-white">30 dias</strong></span>
            </div>
          </div>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Criador da plataforma <span className="text-amber-300 font-semibold">Ipe Imóveis</span> •
            Especialista em <span className="text-amber-300 font-semibold">Next.js, React e TypeScript</span>
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row gap-6 mt-12 mx-auto justify-center max-w-lg">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-emerald-500/30 transition-all hover:shadow-3xl hover:shadow-emerald-500/50 hover:scale-105 hover:from-emerald-500 hover:to-emerald-400"
            >
              <span>🚀 Criar Meu Projeto</span>
            </a>
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-emerald-400/60 bg-emerald-950/40 backdrop-blur-md px-10 py-5 text-lg font-semibold text-emerald-100 transition-all hover:bg-emerald-900/60 hover:border-emerald-300 hover:scale-105 hover:text-white"
            >
              <span>Ver Portfolio</span>
              <ArrowDown className="h-5 w-5" />
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-emerald-200">
            <span className="text-sm">🔒 Consulta gratuita • 💰 Orçamento em 24h • ⚡ Entrega rápida</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
