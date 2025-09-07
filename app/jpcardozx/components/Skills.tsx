'use client';
import { motion } from 'framer-motion';
import { Code, Database, Palette, Server, Wind } from 'lucide-react';

const skillCategories = [
  {
    title: 'Frontend & UI',
    description: 'Criando interfaces modernas e responsivas',
    skills: [
      { name: 'TypeScript', level: 'Avançado', icon: <Code className="h-5 w-5 text-emerald-600" /> },
      { name: 'React & Next.js', level: 'Avançado', icon: <Code className="h-5 w-5 text-emerald-600" /> },
      { name: 'Tailwind CSS', level: 'Avançado', icon: <Wind className="h-5 w-5 text-emerald-600" /> },
      { name: 'Framer Motion', level: 'Intermediário', icon: <motion.div className="h-5 w-5 bg-emerald-600 rounded" /> },
    ],
  },
  {
    title: 'Backend & Database',
    description: 'Arquiteturas escaláveis e performantes',
    skills: [
      { name: 'Node.js & Express', level: 'Avançado', icon: <Server className="h-5 w-5 text-emerald-600" /> },
      { name: 'Python & FastAPI', level: 'Intermediário', icon: <Server className="h-5 w-5 text-emerald-600" /> },
      { name: 'PostgreSQL', level: 'Avançado', icon: <Database className="h-5 w-5 text-emerald-600" /> },
      { name: 'Supabase', level: 'Avançado', icon: <Database className="h-5 w-5 text-emerald-600" /> },
    ],
  },
  {
    title: 'Design & UX',
    description: 'Design centrado no usuário e acessibilidade',
    skills: [
      { name: 'Figma', level: 'Avançado', icon: <Palette className="h-5 w-5 text-emerald-600" /> },
      { name: 'Design Systems', level: 'Avançado', icon: <Palette className="h-5 w-5 text-emerald-600" /> },
      { name: 'Prototipagem', level: 'Avançado', icon: <Palette className="h-5 w-5 text-emerald-600" /> },
      { name: 'Acessibilidade', level: 'Intermediário', icon: <Palette className="h-5 w-5 text-emerald-600" /> },
    ],
  },
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export function Skills() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 mb-6">
            <div className="h-2 w-2 rounded-full bg-amber-600"></div>
            Habilidades
          </div>
          <h2 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">Stack Tecnológico</h2>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
            Tecnologias e ferramentas que domino para transformar ideias em soluções digitais robustas e elegantes.
          </p>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-3 max-w-6xl mx-auto">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-amber-200">
                <h3 className="text-2xl font-bold font-display text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-6 text-sm">{category.description}</p>
                <motion.div variants={listVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="space-y-4">
                  {category.skills.map((skill) => (
                    <motion.div key={skill.name} variants={itemVariants} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {skill.icon}
                        <span className="font-medium text-gray-800">{skill.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${skill.level === 'Avançado' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {skill.level}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 p-8 lg:p-12">
            <h3 className="text-2xl font-bold font-display text-gray-900 mb-4">Metodologia de Trabalho</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Combino design centrado no usuário com desenvolvimento ágil. Priorizo código limpo, testes automatizados e documentação clara.
              Cada projeto é uma oportunidade de aprender e aplicar as melhores práticas da indústria.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
