'use client';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Users, DollarSign } from 'lucide-react';
import Image from 'next/image';

const projects = [
  {
    title: 'Ipe Imóveis',
    description: 'Plataforma imobiliária completa com sistema de busca avançada, gestão de propriedades e portal do corretor',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6164a83639?auto=format&fit=crop&w=600&q=80',
    features: [
      'Sistema de autenticação e autorização',
      'Dashboard administrativo completo',
      'Filtros de busca avançados',
      'Integração com WhatsApp'
    ]
  },
  {
    title: 'Dashboard Analytics',
    description: 'Painel interativo para visualização de métricas em tempo real com gráficos e relatórios automatizados',
    tech: ['React', 'D3.js', 'Node.js', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    features: [
      'Gráficos interativos em tempo real',
      'Relatórios automatizados',
      'Export de dados em múltiplos formatos',
      'Notificações personalizadas'
    ]
  },
  {
    title: 'Mobile Task Manager',
    description: 'Aplicativo de produtividade com sincronização offline e integração com calendários externos',
    tech: ['React Native', 'Expo', 'Firebase', 'TypeScript'],
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80',
    features: [
      'Sincronização offline-first',
      'Notificações push inteligentes',
      'Integração com Google Calendar',
      'Interface intuitiva e acessível'
    ]
  }
];

export function Projects() {
  return (
    <section id="results" className="bg-gradient-to-b from-gray-900 to-gray-800 py-24 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/20 px-6 py-3 text-sm font-medium text-emerald-300 mb-8 border border-emerald-500/30">
            <TrendingUp className="h-4 w-4" />
            Resultados Comprovados
          </div>
          <h2 className="font-display text-4xl font-bold mb-6 sm:text-5xl lg:text-6xl text-white">
            Projetos em
            <span className="block text-emerald-400">Destaque</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Uma seleção de projetos que demonstram minha capacidade técnica e foco em soluções elegantes
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700 hover:border-emerald-500/50 transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={600}
                  height={300}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{project.description}</p>
                
                <div className="space-y-3 mb-6">
                  <h4 className="text-emerald-400 text-sm font-semibold uppercase tracking-wide">Funcionalidades</h4>
                  <ul className="space-y-1">
                    {project.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <div className="w-1 h-1 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-blue-400 text-sm font-semibold uppercase tracking-wide">Stack Técnico</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-300 mb-6">
              Interessado em conhecer mais sobre meu trabalho?
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
            >
              Vamos Conversar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}