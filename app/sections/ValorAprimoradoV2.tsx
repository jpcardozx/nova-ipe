'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, TrendingUp, Users, MapPin, Home, Calendar, Info, CheckCircle, DollarSign, PercentCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingCardProps {
    title: string;
    description: string;
    price: string;
    frequency: string;
    features: string[];
    highlight?: boolean;
    onClick?: () => void;
}

interface ComparisonItemProps {
    title: string;
    benefit: string;
    icon: React.ReactNode;
}

// Hook para animação de números quando visível
const useCountUp = (end: number, duration = 2000) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            setCount(Math.floor(end * progress));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return [ref, count] as const;
};

const PricingCard: React.FC<PricingCardProps> = ({
    title,
    description,
    price,
    frequency,
    features,
    highlight = false,
    onClick
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "flex flex-col p-6 sm:p-8 rounded-2xl shadow-lg h-full",
                highlight
                    ? "bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300"
                    : "bg-white border border-gray-200"
            )}
        >
            <h3 className={cn(
                "text-xl font-bold mb-3",
                highlight ? "text-amber-800" : "text-gray-800"
            )}>
                {title}
            </h3>
            <p className="text-gray-600 mb-6 text-sm">{description}</p>

            <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold text-gray-900">{price}</span>
                <span className="text-sm text-gray-500 ml-2">{frequency}</span>
            </div>

            <div className="space-y-3 mb-6 flex-grow">
                {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <CheckCircle className={cn(
                            "w-5 h-5 shrink-0 mt-0.5",
                            highlight ? "text-amber-600" : "text-green-600"
                        )} />
                        <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={onClick}
                className={cn(
                    "mt-auto py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors",
                    highlight
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                )}
            >
                Saiba mais
                <ArrowRight className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

// Componente de comparação
const ComparisonItem: React.FC<ComparisonItemProps> = ({ title, benefit, icon }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="flex gap-4 p-4 rounded-lg bg-white shadow-sm border border-gray-200"
        >
            <div className="bg-amber-100 rounded-full p-2 h-10 w-10 flex items-center justify-center text-amber-700 shrink-0">
                {icon}
            </div>
            <div>
                <h4 className="font-medium text-gray-900">{title}</h4>
                <p className="text-sm text-gray-600">{benefit}</p>
            </div>
        </motion.div>
    );
};

export default function ValorAprimorado() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
    const [activeTab, setActiveTab] = useState('compra');

    // Estatísticas animadas
    const [marketGrowthRef, marketGrowthCount] = useCountUp(27, 2000);
    const [avgTimeRef, avgTimeCount] = useCountUp(34, 2000);
    const [valueIncreaseRef, valueIncreaseCount] = useCountUp(42, 2000);

    // Dados dos planos
    const pricingPlans = {
        compra: [
            {
                title: "Avaliação Básica",
                description: "Ideal para ter uma ideia do valor de mercado do seu imóvel",
                price: "Gratuito",
                frequency: "consulta inicial",
                features: [
                    "Análise comparativa simples",
                    "Estimativa de valor de mercado",
                    "Sugestões gerais para valorização"
                ]
            },
            {
                title: "Avaliação Premium",
                description: "Nossa solução mais completa para precificação inteligente",
                price: "Sob consulta",
                frequency: "por avaliação",
                features: [
                    "Análise detalhada do imóvel",
                    "Comparativo com vendas recentes",
                    "Relatório técnico completo",
                    "Estratégia de precificação personalizada",
                    "Assessoria para negociação"
                ],
                highlight: true
            },
            {
                title: "Consultoria de Investimento",
                description: "Para quem busca rentabilidade a longo prazo",
                price: "Sob consulta",
                frequency: "por projeto",
                features: [
                    "Análise de potencial de valorização",
                    "Projeção de retorno financeiro",
                    "Análise de riscos do investimento",
                    "Estratégia de diversificação"
                ]
            }
        ], aluguel: [
            {
                title: "Administração Essencial",
                description: "Gestão simples para proprietários",
                price: "Sob consulta",
                frequency: "personalizado",
                features: [
                    "Busca de inquilinos qualificados",
                    "Contrato de locação padrão",
                    "Gestão de pagamentos mensais",
                    "Suporte básico ao proprietário"
                ]
            },
            {
                title: "Administração Completa",
                description: "Nossa solução premium para proprietários",
                price: "Sob consulta",
                frequency: "personalizado",
                features: [
                    "Análise rigorosa de candidatos",
                    "Vistoria detalhada com relatório",
                    "Manutenção preventiva",
                    "Assessoria jurídica especializada",
                    "Garantia de pagamento ao proprietário"
                ],
                highlight: true
            },
            {
                title: "Gestão Patrimonial",
                description: "Para múltiplos imóveis e investidores",
                price: "Sob consulta",
                frequency: "personalizado",
                features: [
                    "Gestão integrada de múltiplos imóveis",
                    "Relatórios consolidados mensais",
                    "Estratégia de valorização patrimonial",
                    "Consultoria tributária especializada"
                ]
            }
        ]
    };

    // Comparações de benefícios
    const comparisons = [
        {
            title: "Avaliação precisa",
            benefit: "Preço justo baseado em dados reais do mercado local",
            icon: <DollarSign className="w-5 h-5" />
        },
        {
            title: "Transparência",
            benefit: "Você entende exatamente como seu imóvel foi precificado",
            icon: <Info className="w-5 h-5" />
        },
        {
            title: "Negociação estratégica",
            benefit: "Maximize seus ganhos com técnicas avançadas",
            icon: <TrendingUp className="w-5 h-5" />
        },
        {
            title: "Velocidade de venda",
            benefit: "Imóveis com preço adequado vendem 40% mais rápido",
            icon: <Calendar className="w-5 h-5" />
        },
        {
            title: "Segurança",
            benefit: "Análises completas para evitar riscos ocultos",
            icon: <CheckCircle className="w-5 h-5" />
        },
        {
            title: "Valorização futura",
            benefit: "Entenda o potencial de valorização do seu investimento",
            icon: <PercentCircle className="w-5 h-5" />
        }
    ];

    return (
        <section
            ref={sectionRef}
            className="py-20 bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50"
            id="servicos-pricing"
        >
            <div className="container mx-auto px-4">
                {/* Cabeçalho da seção */}
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Precificação inteligente para o seu{" "}
                        <span className="text-amber-600">investimento imobiliário</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Utilizamos métodos avançados para definir o valor ideal do seu imóvel,
                        garantindo o melhor retorno financeiro e velocidade de negociação.
                    </p>
                </div>

                {/* Estatísticas do mercado */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
                    <motion.div
                        ref={marketGrowthRef}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100"
                    >
                        <div className="text-4xl font-bold text-amber-600 mb-2">{marketGrowthCount}%</div>
                        <p className="text-gray-800 font-medium">Crescimento do mercado</p>
                        <p className="text-sm text-gray-500">Nos últimos 24 meses em Guararema</p>
                    </motion.div>

                    <motion.div
                        ref={avgTimeRef}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100"
                    >
                        <div className="text-4xl font-bold text-amber-600 mb-2">{avgTimeCount}</div>
                        <p className="text-gray-800 font-medium">Dias em média</p>
                        <p className="text-sm text-gray-500">Para vender um imóvel bem precificado</p>
                    </motion.div>

                    <motion.div
                        ref={valueIncreaseRef}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100"
                    >
                        <div className="text-4xl font-bold text-amber-600 mb-2">{valueIncreaseCount}%</div>
                        <p className="text-gray-800 font-medium">Valorização média</p>
                        <p className="text-sm text-gray-500">Em imóveis com localização premium</p>
                    </motion.div>
                </div>

                {/* Navegação entre tipos de serviços */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('compra')}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                                activeTab === 'compra'
                                    ? "bg-amber-600 text-white shadow-sm"
                                    : "text-gray-700 hover:bg-gray-200"
                            )}
                        >
                            Compra e Venda
                        </button>
                        <button
                            onClick={() => setActiveTab('aluguel')}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                                activeTab === 'aluguel'
                                    ? "bg-amber-600 text-white shadow-sm"
                                    : "text-gray-700 hover:bg-gray-200"
                            )}
                        >
                            Aluguel
                        </button>
                    </div>
                </div>

                {/* Cards de preços */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {pricingPlans[activeTab === 'compra' ? 'compra' : 'aluguel'].map((plan, index) => (
                        <PricingCard
                            key={index}
                            title={plan.title}
                            description={plan.description}
                            price={plan.price}
                            frequency={plan.frequency}
                            features={plan.features}
                            highlight={plan.highlight}
                            onClick={() => { }} // Aqui poderia abrir um modal ou redirecionar
                        />
                    ))}
                </div>

                {/* Comparações de benefício */}
                <div className="max-w-3xl mx-auto mb-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Por que nossa precificação é diferente?
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {comparisons.map((item, index) => (
                            <ComparisonItem
                                key={index}
                                title={item.title}
                                benefit={item.benefit}
                                icon={item.icon}
                            />
                        ))}
                    </div>
                </div>

                {/* CTA final */}
                <div className="text-center">
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-amber-600 hover:bg-amber-700 transition-colors text-white font-medium px-8 py-3 rounded-lg inline-flex items-center gap-2"
                    >
                        Agendar avaliação gratuita
                        <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        </section>
    );
}
