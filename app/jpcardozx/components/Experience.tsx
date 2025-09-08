'use client';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';

const experiences = [
  {
    company: 'Soluções Empresariais',
    position: 'Desenvolvimento Full-Stack',
    period: '2023 - Presente',
    location: 'Digital',
    description: 'Criação de aplicações web estratégicas que impulsionam o crescimento de negócios em diversos setores, desde startups até empresas estabelecidas.',
    achievements: [
      'Aumento médio de 40% na conversão digital dos clientes',
      'Redução de 60% no tempo de processos manuais',
      'Implementação de sistemas de pagamento seguros',
      'Otimização que resultou em 50% menos tempo de carregamento'
    ],
    tech: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Supabase', 'Payment APIs']
  },
  {
    company: 'Inovação & Produto',
    position: 'Arquitetura de Soluções',
    period: '2022 - 2023',
    location: 'Projetos Estratégicos',
    description: 'Desenvolvimento de produtos digitais inovadores com foco em resolver problemas reais de mercado e gerar impacto mensurável.',
    achievements: [
      'Criação de MVP que validou modelo de negócio',
      'Dashboard analítico que otimizou tomada de decisões',
      'Sistema de gestão que reduziu custos operacionais em 30%',
      'Prototipagem rápida para validação de conceitos'
    ],
    tech: ['React', 'Python', 'Data Analytics', 'Firebase', 'Design Systems']
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export function Experience() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 mb-6">
            <div className="h-2 w-2 rounded-full bg-amber-600"></div>
            Resultados Comprovados
          </div>
          <h2 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            Impacto nos Negócios
          </h2>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
            Soluções que geram resultados mensuráveis e vantagem competitiva real para nossos parceiros.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-6 max-w-2xl mx-auto"
        >
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative pl-8 pb-12 last:pb-0"
            >
              {/* Timeline line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-amber-200 to-transparent" />

              {/* Timeline dot */}
              <div className="absolute left-0 top-2 w-2 h-2 -translate-x-1/2 bg-amber-600 rounded-full" />

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{exp.position}</h3>
                    <div className="flex items-center gap-2 text-amber-600 font-semibold mb-2">
                      <span>{exp.company}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex flex-col sm:text-right gap-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{exp.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {exp.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Resultados Entregues</h4>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Tecnologias Utilizadas</h4>
                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}