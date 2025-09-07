'use client';
import { motion } from 'framer-motion';
import { MessageSquare, Lightbulb, Code, Rocket, CheckCircle2 } from 'lucide-react';

const processSteps = [
  {
    step: '01',
    title: 'Descoberta & Estratégia',
    description: 'Analisamos seu negócio, objetivos e público-alvo para criar a estratégia perfeita.',
    icon: <MessageSquare className="h-8 w-8" />,
    duration: '1-2 dias',
    deliverables: ['Briefing detalhado', 'Análise de concorrência', 'Proposta técnica', 'Cronograma'],
    color: 'bg-blue-500'
  },
  {
    step: '02',
    title: 'Design & Prototipagem',
    description: 'Criamos wireframes e protótipos interativos para validar a experiência do usuário.',
    icon: <Lightbulb className="h-8 w-8" />,
    duration: '3-5 dias',
    deliverables: ['Wireframes', 'Design system', 'Protótipo navegável', 'Aprovação visual'],
    color: 'bg-purple-500'
  },
  {
    step: '03',
    title: 'Desenvolvimento',
    description: 'Codifico sua aplicação usando as melhores práticas e tecnologias modernas.',
    icon: <Code className="h-8 w-8" />,
    duration: '2-4 semanas',
    deliverables: ['Código limpo', 'Testes automatizados', 'Versão de homologação', 'Documentação'],
    color: 'bg-emerald-500'
  },
  {
    step: '04',
    title: 'Launch & Suporte',
    description: 'Publicamos sua aplicação e fornecemos suporte contínuo para garantir o sucesso.',
    icon: <Rocket className="h-8 w-8" />,
    duration: 'Contínuo',
    deliverables: ['Deploy em produção', 'Treinamento', 'Documentação', '30 dias de suporte'],
    color: 'bg-orange-500'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const stepVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export function Process() {
  return (
    <section id="process" className="bg-gradient-to-b from-gray-50 to-white py-24 sm:py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 mb-6">
            <div className="h-2 w-2 rounded-full bg-amber-600"></div>
            Metodologia
          </div>
          <h2 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl mb-6">
            Como Trabalho
            <span className="block text-amber-600">Do Briefing ao Launch</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Um processo transparente e eficiente que garante resultados excepcionais em cada etapa do projeto.
          </p>
        </div>

        {/* Process Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="grid gap-8 lg:gap-12">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={stepVariants}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                  }`}
              >
                {/* Step Visual */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="relative">
                    <div className="w-24 h-24 bg-amber-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                      {step.icon}
                    </div>
                    <div className="absolute top-4 -right-4 bg-white rounded-full px-4 py-2 shadow-md">
                      <span className="text-2xl font-bold text-gray-400">{step.step}</span>
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                    </div>

                    {/* Deliverables */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">O que você recebe:</h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {step.deliverables.map((deliverable, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-amber-600 flex-shrink-0" />
                            <span className="text-gray-700">{deliverable}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector Line - except for last item */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block col-span-2 relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-16 bg-gray-200"></div>
                    <div className="absolute left-1/2 top-8 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 rounded-full"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pronto para começar seu projeto?
            </h3>
            <p className="text-lg text-gray-700 mb-8">
              Vamos conversar sobre sua ideia e criar um plano personalizado para transformá-la em realidade.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Iniciar Meu Projeto
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}