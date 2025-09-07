'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Github } from 'lucide-react';
import Image from 'next/image';

const projects = [
  {
    title: 'Nova IPE',
    description: 'Plataforma imobiliária moderna com busca avançada, tours virtuais e integração com APIs de geolocalização.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6164a83639?auto=format&fit=crop&w=800&q=60',
    liveUrl: 'https://nova-ipe.vercel.app',
    githubUrl: 'https://github.com/jpcardozx/nova-ipe',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind'],
    status: 'Ativo',
    year: '2024'
  },
  {
    title: 'Analytics Dashboard',
    description: 'Dashboard interativo para visualização de métricas em tempo real com gráficos customizáveis e relatórios automatizados.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=60',
    liveUrl: '#',
    githubUrl: '#',
    tags: ['React', 'D3.js', 'Node.js', 'PostgreSQL'],
    status: 'Em desenvolvimento',
    year: '2024'
  },
  {
    title: 'TaskFlow Mobile',
    description: 'Aplicativo de produtividade com sincronização offline, notificações inteligentes e integração com calendários.',
    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=60',
    liveUrl: '#',
    githubUrl: '#',
    tags: ['React Native', 'Expo', 'Firebase', 'TypeScript'],
    status: 'Concluído',
    year: '2023'
  },
];

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

export function ProjectHighlight() {
  return (
    <section id="projects" className="container mx-auto px-4">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800 mb-6">
          <div className="h-2 w-2 rounded-full bg-emerald-600"></div>
          Portfolio
        </div>
        <h2 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">Projetos Selecionados</h2>
        <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
          Cada projeto representa uma jornada única de resolver problemas reais através de código limpo e design intuitivo.
        </p>
      </div>

      <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            className="group overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl"
          >
            <div className="relative overflow-hidden">
              <Image
                src={project.imageUrl}
                alt={project.title}
                width={800}
                height={600}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-emerald-600">{project.year}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  project.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                  project.status === 'Em desenvolvimento' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {project.status}
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => (
                  <span key={tag} className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                >
                  Ver Projeto <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  Código
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
