'use client';

import { motion } from 'framer-motion';
import { Code2, Database, Palette, Server } from 'lucide-react';

/**
 * TechStack - Stack técnico organizado por camada
 */

interface StackCategory {
  title: string;
  icon: any;
  description: string;
  technologies: {
    name: string;
    usage: string;
  }[];
}

const stackCategories: StackCategory[] = [
  {
    title: 'Front-end',
    icon: Code2,
    description: 'Interface e experiência do usuário',
    technologies: [
      { name: 'React 18', usage: 'Component architecture, hooks, server components' },
      { name: 'Next.js 14', usage: 'App router, SSR, ISR, API routes' },
      { name: 'TypeScript', usage: 'Type safety, interfaces, generics' },
      { name: 'Tailwind CSS', usage: 'Utility-first styling, responsive design' }
    ]
  },
  {
    title: 'Back-end',
    icon: Server,
    description: 'APIs e lógica de negócio',
    technologies: [
      { name: 'Node.js', usage: 'Runtime environment, async operations' },
      { name: 'Supabase', usage: 'Auth, database, storage, real-time' },
      { name: 'Sanity CMS', usage: 'Headless CMS, content management' },
      { name: 'REST APIs', usage: 'RESTful design, endpoint architecture' }
    ]
  },
  {
    title: 'Database',
    icon: Database,
    description: 'Persistência e modelagem de dados',
    technologies: [
      { name: 'PostgreSQL', usage: 'Relational database, complex queries' },
      { name: 'Supabase DB', usage: 'RLS policies, triggers, functions' },
      { name: 'Prisma', usage: 'ORM, migrations, type generation' },
      { name: 'Redis', usage: 'Caching, session management' }
    ]
  },
  {
    title: 'Design & Tools',
    icon: Palette,
    description: 'Design e ferramentas auxiliares',
    technologies: [
      { name: 'Figma', usage: 'UI/UX design, prototyping' },
      { name: 'Framer Motion', usage: 'Animations, transitions' },
      { name: 'Lucide Icons', usage: 'Icon system' },
      { name: 'Zod', usage: 'Schema validation' }
    ]
  }
];

export function ExpertiseShowcase() {
  return (
    <section className="relative py-24 px-6 sm:px-12 lg:px-20 bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <h2 className="text-2xl font-normal text-white">
              Stack técnico
            </h2>
            <p className="text-sm text-slate-500">
              Tecnologias organizadas por camada de aplicação
            </p>
          </motion.div>
        </div>

        {/* Stack Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {stackCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 border border-slate-800/50 rounded-lg bg-slate-900/20"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded bg-slate-800/50">
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-white">
                      {category.title}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-3">
                  {category.technologies.map((tech) => (
                    <div key={tech.name} className="group">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span className="text-sm font-mono text-slate-300">
                          {tech.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {tech.usage}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
