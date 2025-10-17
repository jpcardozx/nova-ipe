'use client';

import { Github, Linkedin, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ParticleField } from './ParticleField';
import { useRef } from 'react';

/**
 * HeroSection - Design Institucional Sofisticado (PT-BR)
 * 
 * Filosofia de design aprimorada:
 * - Elegância minimalista com profundidade visual
 * - Tom institucional e profissional
 * - Three.js para sofisticação sutil
 * - Layout assimétrico responsivo com grid fluido
 * - Esquema de cores premium com gradientes sutis
 * - Tipografia dinâmica e hierarquia clara
 * - Micro-interações refinadas
 */

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.9,
      delay,
      ease: [0.16, 1, 0.3, 1] as const
    }
  })
};

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    >
      {/* Three.js Particle Field - Múltiplas camadas com movimento */}
      <div className="absolute inset-0 -z-20">
        <ParticleField density={1200} color="#60a5fa" opacity={0.3} />
      </div>
      
      {/* Segunda camada com cor diferente para profundidade */}
      <div className="absolute inset-0 -z-19 opacity-60">
        <ParticleField density={600} color="#818cf8" opacity={0.2} />
      </div>
      
      {/* Terceira camada sutil */}
      <div className="absolute inset-0 -z-18 opacity-40">
        <ParticleField density={300} color="#a78bfa" opacity={0.15} />
      </div>

      {/* Gradientes de fundo reduzidos */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-500/[0.06] rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-indigo-500/[0.04] rounded-full blur-[160px]" />
      </div>

      {/* Linhas Geométricas de Acento - Mais Dinâmicas */}
      <div className="absolute inset-0 -z-5 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
        <div className="absolute bottom-1/3 right-0 w-3/4 h-px bg-gradient-to-l from-transparent via-indigo-400/30 to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-1/2 h-px bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-transparent" />
      </div>

      <motion.div 
        style={{ opacity, scale }}
        className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center"
      >
        {/* Coluna Esquerda - Conteúdo Principal (Assimétrico 7/12) */}
        <div className="lg:col-span-7 space-y-8 md:space-y-10 lg:space-y-12">
          {/* Identificação */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <div className="text-xs tracking-wider uppercase text-slate-600 font-mono">
              João Pedro Cardozo
            </div>
          </motion.div>

          {/* Título e Stack */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="space-y-5"
          >
            <h1 className="text-[clamp(2rem,5vw,3rem)] font-normal leading-[1.15] text-white">
              Full-stack developer
            </h1>
            
            {/* Stack principal */}
            <div className="flex flex-wrap items-center gap-2">
              {['Next.js 14', 'React 18', 'TypeScript', 'Supabase'].map((tech, i) => (
                <span 
                  key={tech}
                  className="px-2.5 py-1 text-xs font-mono text-slate-400 bg-slate-900/50 border border-slate-800/50 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Descrição técnica */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="max-w-xl space-y-5"
          >
            <p className="text-sm leading-relaxed text-slate-400">
              Especializado em arquitetura de aplicações web escaláveis, 
              sistemas de autenticação robustos e otimização de performance.
            </p>
          </motion.div>

          {/* Highlights técnicos */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="space-y-2.5"
          >
            {[
              'JWT auth + role-based access control',
              'PostgreSQL + RLS policies + migrations',
              'Sanity CMS + GROQ queries optimization'
            ].map((highlight, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-1 h-1 rounded-full bg-blue-400/60 mt-2 flex-shrink-0" />
                <span className="text-xs text-slate-500 leading-relaxed">
                  {highlight}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Links */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="flex items-center gap-3 pt-2"
          >
            <a
              href="https://github.com/jpcardozx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono"
            >
              GitHub
            </a>
            <span className="text-slate-800">•</span>
            <a
              href="https://linkedin.com/in/jpcardozocm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono"
            >
              LinkedIn
            </a>
            <span className="text-slate-800">•</span>
            <a
              href="mailto:contato@consultingarco.com"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono"
            >
              Email
            </a>
          </motion.div>
        </div>

        {/* Coluna Direita - Mockup modernizado */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="lg:col-span-5 relative space-y-6"
        >
          {/* Container do mockup - sem moldura, mais limpo */}
          <div className="relative group">
            {/* Glow sutil no hover */}
            <div className="absolute -inset-8 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            {/* Imagem com aspect ratio preservado */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900/20 backdrop-blur-sm shadow-2xl shadow-black/20">
              <img 
                src="/mockup.png" 
                alt="Ipê Imóveis Platform"
                className="w-full h-full object-contain"
              />
              
              {/* Overlay mínimo apenas nas bordas */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-slate-950/10 pointer-events-none" />
            </div>

            {/* Badge minimalista */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-950/90 backdrop-blur-md border border-slate-800/50 shadow-2xl">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-400">Ipê Imóveis • Production</span>
              </div>
            </div>
          </div>

          {/* Tech stack minimalista */}
          <div className="space-y-3 pt-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-mono">
              Stack
            </div>
            <div className="flex flex-wrap gap-2">
              {['Next.js 14', 'Supabase', 'Sanity', 'PostgreSQL', 'TypeScript'].map((tech) => (
                <span 
                  key={tech}
                  className="px-2.5 py-1 text-xs font-mono text-slate-500 bg-slate-900/30 border border-slate-800/30 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Footer limpo */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/30">
            <div className="flex items-center gap-3">
              {[
                { icon: Github, href: 'https://github.com/jpcardozx', label: 'GitHub' },
                { icon: Linkedin, href: 'https://linkedin.com/in/jpcardozocm', label: 'LinkedIn' }
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-400 transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-green-500" />
              <span className="text-xs font-mono text-slate-600">Rio de Janeiro, RJ</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Acento Inferior - Gradiente Melhorado */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      
      {/* Corner Accents - Detalhes Visuais */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-blue-500/10 rounded-tl-3xl" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-indigo-500/10 rounded-br-3xl" />
    </section>
  );
}
