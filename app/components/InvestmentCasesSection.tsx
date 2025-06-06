'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin, Users, ArrowRight } from 'lucide-react';

interface InvestmentCase {
    id: string;
    clientProfile: string;
    title: string;
    description: string;
    metrics: {
        before: string;
        after: string;
        roi: string;
    };
    icon: React.ReactNode;
    location: string;
}

const investmentCases: InvestmentCase[] = [
    {
        id: 'young-professionals',
        clientProfile: 'Profissionais de 28-35 anos',
        title: 'Primeira aquisição imobiliária estratégica',
        description: 'Casal de profissionais liberais migrou do aluguel em São Paulo para propriedade com valorização garantida em Guararema, mantendo acesso ao centro financeiro.',
        metrics: {
            before: 'Aluguel R$ 3.200/mês + condomínio',
            after: 'Financiamento R$ 1.800/mês',
            roi: '18% economia mensal + valorização 12% a.a.'
        },
        icon: <Users className="w-6 h-6" />,
        location: 'Condomínio Portal das Araucárias'
    },
    {
        id: 'family-expansion',
        clientProfile: 'Família estabelecida',
        title: 'Expansão patrimonial e qualidade de vida',
        description: 'Executivos realocaram investimentos imobiliários priorizando retorno financeiro e ambiente familiar. Estratégia resultou em diversificação de portfólio.',
        metrics: {
            before: 'Apartamento 85m² - R$ 650k',
            after: 'Casa 180m² + terreno 500m²',
            roi: '35% mais espaço, valorização regional 15% a.a.'
        },
        icon: <TrendingUp className="w-6 h-6" />,
        location: 'Quinta dos Ipês'
    },
    {
        id: 'retirement-planning',
        clientProfile: 'Pré-aposentadoria 50+',
        title: 'Realocação estratégica de patrimônio',
        description: 'Professora universitária otimizou portfólio imobiliário, convertendo imóvel urbano em propriedade com potencial de valorização e redução de custos operacionais.',
        metrics: {
            before: 'Apartamento centro SP - R$ 580k',
            after: 'Casa + R$ 180k para investimentos',
            roi: 'Liberação de 31% do capital + renda passiva'
        },
        icon: <MapPin className="w-6 h-6" />,
        location: 'Centro Histórico Guararema'
    }
];

export default function InvestmentCasesSection() {
    return (
        <section className="bg-gradient-to-br from-neutral-lightest to-primary-lightest/20 py-20 md:py-32">
            <div className="container mx-auto px-4">
                {/* Header Institucional */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-primary-darkest/10 text-primary-darkest px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        Casos de Sucesso
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-darkest mb-6 font-heading">
                        Estratégias de investimento que transformam patrimônios
                    </h2>
                    <p className="text-lg text-neutral-charcoal max-w-3xl mx-auto mb-8">
                        Conheça como nossa consultoria especializada tem orientado investidores na construção de portfólios imobiliários sólidos e rentáveis na região de Guararema.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-charcoal">
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary-darkest rounded-full"></div>
                            Valorização média 12-15% a.a.
                        </span>
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary-darkest rounded-full"></div>
                            ROI comprovado
                        </span>
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary-darkest rounded-full"></div>
                            Acompanhamento pós-venda
                        </span>
                    </div>
                </div>

                {/* Grid de Casos */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {investmentCases.map((case_, index) => (
                        <motion.div
                            key={case_.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-light/50"
                        >
                            {/* Header do Card */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary-light/20 rounded-lg flex items-center justify-center text-primary-darkest">
                                    {case_.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-primary-darkest font-medium mb-1">
                                        {case_.clientProfile}
                                    </div>
                                    <h3 className="text-lg font-bold text-neutral-darkest leading-tight">
                                        {case_.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Descrição */}
                            <p className="text-neutral-charcoal text-sm leading-relaxed mb-6">
                                {case_.description}
                            </p>

                            {/* Métricas Before/After */}
                            <div className="bg-neutral-lightest/50 rounded-lg p-4 mb-4">
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-xs text-neutral-charcoal/70 font-medium mb-1">SITUAÇÃO ANTERIOR</div>
                                        <div className="text-sm text-neutral-darkest">{case_.metrics.before}</div>
                                    </div>
                                    <div className="border-t border-neutral-light/50 pt-3">
                                        <div className="text-xs text-neutral-charcoal/70 font-medium mb-1">RESULTADO ATUAL</div>
                                        <div className="text-sm text-neutral-darkest">{case_.metrics.after}</div>
                                    </div>
                                    <div className="bg-primary-light/20 rounded px-3 py-2">
                                        <div className="text-xs text-primary-darkest font-bold mb-1">ROI ALCANÇADO</div>
                                        <div className="text-sm text-primary-darkest font-semibold">{case_.metrics.roi}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Localização */}
                            <div className="flex items-center text-sm text-neutral-charcoal">
                                <MapPin size={14} className="mr-2 text-primary-darkest" />
                                {case_.location}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-neutral-darkest mb-4">
                        Pronto para construir seu portfólio imobiliário?
                    </h3>
                    <p className="text-neutral-charcoal mb-6 max-w-2xl mx-auto">
                        Nossa equipe de consultores especializados está preparada para analisar seu perfil de investimento e apresentar as melhores oportunidades do mercado regional.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/consultoria"
                            className="inline-flex items-center justify-center gap-2 bg-primary-darkest hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold"
                        >
                            Agendar Consultoria Gratuita
                            <ArrowRight size={16} />
                        </a>
                        <a
                            href="/imoveis"
                            className="inline-flex items-center justify-center gap-2 bg-neutral-lightest hover:bg-neutral-light text-neutral-darkest px-6 py-3 rounded-lg transition-all duration-200 font-semibold border border-neutral-light"
                        >
                            Ver Oportunidades Disponíveis
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
