'use client';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight, Clock, Users, Zap } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Landing Page',
    description: 'Perfeito para apresentar seu negócio',
    price: 'R$ 2.500',
    timeline: '5-7 dias',
    popular: false,
    features: [
      'Design responsivo profissional',
      'Otimização para conversão',
      'Formulário de contato integrado',
      'SEO básico otimizado',
      'Google Analytics',
      '3 revisões incluídas',
      'Hospedagem por 1 ano',
      'Suporte por 30 dias'
    ],
    ideal: 'Freelancers, consultores, pequenos negócios',
    includes: {
      pages: '1 página',
      revisions: '3 revisões',
      support: '30 dias',
      delivery: '5-7 dias'
    }
  },
  {
    name: 'Site Institucional',
    description: 'Solução completa para empresas',
    price: 'R$ 6.500',
    timeline: '2-3 semanas',
    popular: true,
    features: [
      'Até 8 páginas personalizadas',
      'CMS para edição de conteúdo',
      'Blog integrado',
      'Galeria de produtos/serviços',
      'Formulários avançados',
      'SEO avançado',
      'Integração redes sociais',
      'Certificado SSL',
      'Backup automático',
      '5 revisões incluídas',
      'Treinamento incluído',
      'Suporte por 60 dias'
    ],
    ideal: 'Empresas, corporações, negócios estabelecidos',
    includes: {
      pages: 'Até 8 páginas',
      revisions: '5 revisões',
      support: '60 dias',
      delivery: '2-3 semanas'
    }
  },
  {
    name: 'Aplicação Web',
    description: 'Sistema personalizado para seu negócio',
    price: 'A partir de R$ 15.000',
    timeline: '4-8 semanas',
    popular: false,
    features: [
      'Aplicação web completa',
      'Dashboard administrativo',
      'Sistema de autenticação',
      'Banco de dados integrado',
      'API REST personalizada',
      'Painel de métricas',
      'Integração com APIs terceiras',
      'Testes automatizados',
      'Deploy e configuração',
      'Documentação completa',
      'Revisões ilimitadas',
      'Suporte por 90 dias'
    ],
    ideal: 'Startups, empresas tech, sistemas complexos',
    includes: {
      pages: 'Ilimitadas',
      revisions: 'Ilimitadas',
      support: '90 dias',
      delivery: '4-8 semanas'
    }
  }
];

const addOns = [
  { name: 'E-commerce Integration', price: 'R$ 2.000', icon: '🛒' },
  { name: 'Multi-idioma', price: 'R$ 1.500', icon: '🌐' },
  { name: 'Integração CRM', price: 'R$ 1.200', icon: '📊' },
  { name: 'Chatbot WhatsApp', price: 'R$ 800', icon: '💬' },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-gradient-to-b from-white to-gray-50 py-24 sm:py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 mb-6">
            <div className="h-2 w-2 rounded-full bg-green-600"></div>
            Investimento Transparente
          </div>
          <h2 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl mb-6">
            Preços Claros e
            <span className="block text-emerald-600">Sem Surpresas</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Investimento justo baseado no valor entregue. Todos os preços incluem tudo que você precisa para ter sucesso online.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-24 sm:mx-auto mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 ${plan.popular
                ? 'bg-gradient-to-b from-emerald-50 to-emerald-100 border-2 border-emerald-300 shadow-xl'
                : 'bg-white border border-gray-200 shadow-lg'
                } hover:shadow-xl transition-shadow duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <Star className="h-4 w-4 fill-current" />
                    Mais Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== 'A partir de R$ 15.000' && (
                    <span className="text-gray-500 text-lg ml-1">à vista</span>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium">
                  <Clock className="h-4 w-4" />
                  <span>Entrega em {plan.timeline}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Includes Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Resumo do Pacote:</h4>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div>📄 {plan.includes.pages}</div>
                  <div>🔄 {plan.includes.revisions}</div>
                  <div>⏰ {plan.includes.delivery}</div>
                  <div>🛠️ {plan.includes.support}</div>
                </div>
              </div>

              {/* Ideal for */}
              <div className="text-center mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Ideal Para:</p>
                <p className="text-sm text-gray-700">{plan.ideal}</p>
              </div>

              {/* CTA Button */}
              <a
                href="#contact"
                className={`block w-full text-center py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${plan.popular
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
              >
                {plan.price === 'A partir de R$ 15.000' ? 'Solicitar Orçamento' : 'Escolher Este Plano'}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Process & Guarantee */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Processo Rápido</h3>
            <p className="text-gray-600">
              Aprovação em 48h. Desenvolvimento ágil com entregas semanais. Revisões ilimitadas até sua satisfação total.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Garantia Total</h3>
            <p className="text-gray-600">
              Se não ficar 100% satisfeito, refazemos até acertar. Seu sucesso online é minha prioridade número 1.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pronto para dar o próximo passo?
            </h3>
            <p className="text-lg text-gray-700 mb-8">
              Vamos conversar sobre seu projeto e encontrar a solução perfeita para suas necessidades.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Solicitar Proposta Personalizada
              <ArrowRight className="h-5 w-5" />
            </a>
            <p className="text-sm text-gray-500 mt-4">
              💬 Resposta em até 2 horas • 📋 Proposta detalhada • 💰 Orçamento sem compromisso
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}