'use client';

import { motion } from 'framer-motion';
import { FileCode, Shield, Zap, GitBranch } from 'lucide-react';

/**
 * ArchitectureSection - Implementações técnicas do projeto Ipê Imóveis
 */

interface ArchitectureFeature {
  title: string;
  icon: any;
  implementation: string;
  details: string[];
}

const features: ArchitectureFeature[] = [
  {
    title: 'Autenticação & Autorização',
    icon: Shield,
    implementation: 'Sistema multi-role com Supabase Auth e middleware customizado',
    details: [
      'JWT validation com API middleware',
      'Role-based access control (admin/realtor/client)',
      '4 usuários configurados com níveis de acesso',
      'Protected routes com authenticated fetch helper'
    ]
  },
  {
    title: 'CMS & Content Management',
    icon: FileCode,
    implementation: 'Headless CMS com Sanity + integração Next.js',
    details: [
      '761 propriedades gerenciadas via Sanity Studio',
      'GROQ queries otimizadas para listagem',
      'Image optimization com next/image',
      'Real-time preview e draft content'
    ]
  },
  {
    title: 'Performance & Optimization',
    icon: Zap,
    implementation: 'Web Vitals monitoring e otimizações progressivas',
    details: [
      'Server-side rendering (SSR) para SEO',
      'Image optimization e lazy loading',
      'Code splitting e bundle optimization',
      'PropertyCardOptimized com memoization'
    ]
  },
  {
    title: 'Database Architecture',
    icon: GitBranch,
    implementation: 'PostgreSQL com Supabase + schema migrations',
    details: [
      'Tabelas: rent_adjustments, crm_clients, properties',
      'RLS policies para segurança',
      'Triggers automáticos e history logging',
      'Views otimizadas para queries complexas'
    ]
  }
];

export function ArchitectureSection() {
  return (
    <section className="relative py-24 px-6 sm:px-12 lg:px-20 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <h2 className="text-2xl font-normal text-white">
              Implementações técnicas
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl">
              Arquitetura e features implementadas no projeto Ipê Imóveis
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="space-y-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 border border-slate-800/50 rounded-lg bg-slate-900/20 hover:border-slate-700/50 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {feature.implementation}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="ml-14 space-y-2">
                  {feature.details.map((detail, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-slate-600 mt-2 flex-shrink-0" />
                      <span className="text-xs text-slate-500 leading-relaxed">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-slate-800/50"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-mono text-slate-600">
                Stack: Next.js 14 • TypeScript • Supabase • Sanity CMS
              </p>
              <p className="text-xs text-slate-700">
                761 propriedades • 4 usuários autenticados • PostgreSQL database
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-xs font-mono text-slate-600">Production</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
