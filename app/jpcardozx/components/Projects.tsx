'use client';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const projects = [
  {
    title: 'Ipe Imóveis',
    subtitle: 'Plataforma Imobiliária Completa',
    description: 'Sistema completo de gestão imobiliária desenvolvido do zero, incluindo autenticação, dashboard administrativo, busca avançada e integração WhatsApp.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6164a83639?auto=format&fit=crop&w=800&q=80',
    liveUrl: 'https://nova-ipe.vercel.app',
    githubUrl: 'https://github.com/jpcardozx/nova-ipe',
    status: 'Em Produção',
    tech: ['Next.js 14', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    highlights: [
      'Autenticação segura com múltiplos perfis',
      'Dashboard com métricas em tempo real',
      'Sistema de filtros avançados',
      'Responsive design mobile-first',
      'Otimizado para SEO'
    ],
    metrics: {
      development: '3 meses',
      pages: '15+ páginas',
      features: '20+ funcionalidades'
    }
  },
  {
    title: 'Analytics Dashboard',
    subtitle: 'Visualização de Dados Empresariais',
    description: 'Dashboard interativo para análise de dados complexos com gráficos em tempo real, relatórios automatizados e exports personalizáveis.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    liveUrl: '#',
    githubUrl: '#',
    status: 'Desenvolvimento',
    tech: ['React 18', 'D3.js', 'Node.js', 'PostgreSQL'],
    highlights: [
      'Gráficos interativos com D3.js',
      'API RESTful robusta',
      'Processamento de big data',
      'Interface intuitiva',
      'Relatórios PDF automatizados'
    ],
    metrics: {
      development: '4 meses',
      dataPoints: '1M+ registros',
      charts: '12 tipos'
    }
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 }
  }
};

const projectVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

export function Projects() {
  return (
    <section id="projects" className="bg-white pt-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 mb-6">
            <div className="h-2 w-2 rounded-full bg-amber-600"></div>
            Portfolio
          </div>
          <h2 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl mb-6">
            Projetos que Demonstram
            <span className="block text-amber-600">Competência Técnica</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cada projeto é uma prova concreta da minha capacidade de entregar soluções completas,
            desde o planejamento até a implementação final.
          </p>
        </div>

        {/* Projects */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-32 px-24"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={projectVariants}
              className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
            >
              {/* Project Image */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-emerald-600/20 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
                  <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={800}
                      height={600}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'Em Produção'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-lg text-amber-600 font-medium mb-4">{project.subtitle}</p>
                  <p className="text-gray-600 text-lg leading-relaxed">{project.description}</p>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Principais Características</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {project.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Informações do Projeto</h4>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    {Object.entries(project.metrics).map(([key, value], i) => (
                      <div key={i}>
                        <p className="text-2xl font-bold text-amber-600">{value}</p>
                        <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Stack Tecnológico</h4>
                  <div className="flex flex-wrap gap-3">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver Projeto
                  </a>
                  {project.githubUrl !== '#' && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                    >
                      <Github className="h-4 w-4" />
                      Código
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Precisa de uma solução similar?
            </h3>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Posso desenvolver a solução ideal para seu negócio,
              com a mesma qualidade e atenção aos detalhes demonstradas aqui.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Vamos Discutir Seu Projeto
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}