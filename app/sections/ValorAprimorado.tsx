'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    Shield,
    Award,
    Clock,
    Target,
    Building2,
    CheckCircle,
    Users,
    FileCheck,
    Home,
    TrendingUp,
    Star,
    Phone,
    MessageSquare,
    ThumbsUp,
    BadgeCheck,
    Handshake
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Tipos
interface Service {
    id: string;
    title: string;
    description: string;
    features: string[];
    icon: React.ReactNode;
    color: string;
}

interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    avatarUrl?: string;
    location?: string;
}

interface ValorMetric {
    id: string;
    value: string;
    label: string;
    icon: React.ReactNode;
    color: string;
}

// Serviços com descrições aprimoradas para maio de 2025
const services: Service[] = [
    {
        id: "compra-venda",
        title: "Intermediação Consultiva Premium",
        description: "Um atendimento exclusivo que identifica as melhores oportunidades do mercado e assegura negociações vantajosas para todos os envolvidos.",
        features: [
            "Avaliação tecnológica avançada",
            "Marketing digital geolocalizado",
            "Negociação orientada a resultados",
            "Assessoria jurídica especializada"
        ],
        icon: <Home className="w-6 h-6" />,
        color: "amber"
    },
    {
        id: "consultoria",
        title: "Inteligência de Mercado Local",
        description: "Transformamos dados em decisões estratégicas com análises exclusivas do mercado de Guararema, baseadas em mais de 13 anos de histórico.",
        features: [
            "Projeções de retorno com IA",
            "Mapeamento de tendências locais",
            "Análise comparativa de ativos",
            "Estratégias de investimento personalizado"
        ],
        icon: <Target className="w-6 h-6" />,
        color: "blue"
    },
    {
        id: "documentacao",
        title: "Segurança Jurídica Garantida",
        description: "Eliminamos riscos e simplificamos a burocracia para que você tenha uma experiência imobiliária tranquila e segura do início ao fim.",
        features: [
            "Due diligence completa",
            "Regularização expressa",
            "Documentação digital certificada",
            "Acompanhamento jurídico integral"
        ],
        icon: <FileCheck className="w-6 h-6" />,
        color: "green"
    }
];

// Métricas de valor da empresa
const valorMetrics: ValorMetric[] = [
    {
        id: "experiencia",
        value: "13",
        label: "Anos de experiência",
        icon: <Clock className="w-7 h-7" />,
        color: "amber"
    },
    {
        id: "clientes",
        value: "1.400+",
        label: "Clientes satisfeitos",
        icon: <ThumbsUp className="w-7 h-7" />,
        color: "green"
    },
    {
        id: "negocios",
        value: "870+",
        label: "Negócios realizados",
        icon: <Handshake className="w-7 h-7" />,
        color: "blue"
    },
    {
        id: "avaliacao",
        value: "4.9",
        label: "Avaliação média",
        icon: <Star className="w-7 h-7" />,
        color: "amber"
    }
];

// Depoimentos de clientes
const testimonials: Testimonial[] = [
    {
        id: "depoimento-1",
        name: "Carlos Eduardo",
        role: "Comprou casa em Guararema",
        content: "A equipe da Ipê foi fundamental para encontrarmos nossa casa ideal em Guararema. Atendimento personalizado e conhecimento profundo da região facilitaram muito nossa decisão.",
        rating: 5,
        location: "Bairro Centro"
    },
    {
        id: "depoimento-2",
        name: "Maria Helena",
        role: "Vendeu sítio na região",
        content: "Consegui vender meu sítio por um valor justo e com toda a segurança jurídica graças ao trabalho excelente da Ipê. Resolveram tudo com agilidade e transparência.",
        rating: 5,
        location: "Chácara Guanabara"
    },
    {
        id: "depoimento-3",
        name: "Alexandre Ribeiro",
        role: "Investidor imobiliário",
        content: "Como investidor, valorizo o conhecimento de mercado e a consultoria especializada que a Ipê oferece. Já realizei três negócios com eles e todos superaram minhas expectativas de retorno.",
        rating: 4,
        location: "Residencial Alpes de Guararema"
    }
];

// Componente de cartão de serviço aprimorado
const ServiceCard = ({ service }: { service: Service }) => {
    const colorMap: Record<string, string> = {
        amber: "bg-amber-50 text-amber-700 border-amber-100",
        blue: "bg-blue-50 text-blue-700 border-blue-100",
        green: "bg-green-50 text-green-700 border-green-100"
    };

    const gradientMap: Record<string, string> = {
        amber: "from-amber-500 to-yellow-500",
        blue: "from-blue-500 to-cyan-500",
        green: "from-green-500 to-emerald-500"
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 relative overflow-hidden"
        >
            {/* Faixa de cor no topo */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientMap[service.color]}`} />

            {/* Ícone com fundo colorido */}
            <div className={`inline-flex items-center justify-center p-3 rounded-xl mb-5 ${colorMap[service.color]}`}>
                {service.icon}
            </div>

            <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
            <p className="text-gray-600 mb-5">{service.description}</p>

            <ul className="space-y-2">
                {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <CheckCircle className={`w-5 h-5 mr-2 flex-shrink-0 ${colorMap[service.color].split(' ')[1]}`} />
                        <span className="text-gray-700">{feature}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};

// Componente de cartão de métrica
const MetricCard = ({ metric }: { metric: ValorMetric }) => {
    const colorMap: Record<string, string> = {
        amber: "text-amber-600",
        blue: "text-blue-600",
        green: "text-green-600"
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center p-5 bg-white rounded-xl shadow-sm border border-gray-100"
        >
            <div className={`mb-3 ${colorMap[metric.color]}`}>
                {metric.icon}
            </div>
            <h3 className="text-3xl font-bold mb-1 text-gray-900">{metric.value}</h3>
            <p className="text-gray-600 text-sm text-center">{metric.label}</p>
        </motion.div>
    );
};

// Componente de cartão de depoimento
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white p-6 rounded-2xl shadow-md"
        >
            {/* Classificação por estrelas */}
            <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={18}
                        className={i < testimonial.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                    />
                ))}
            </div>

            {/* Conteúdo do depoimento */}
            <p className="text-gray-700 mb-5 italic">"{testimonial.content}"</p>

            {/* Informações do cliente */}
            <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                </div>
                <div className="ml-3">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center text-sm">
                        <span className="text-gray-600">{testimonial.role}</span>
                        {testimonial.location && (
                            <>
                                <span className="mx-2 text-gray-400">•</span>
                                <span className="text-gray-500 flex items-center">
                                    <MapPin size={12} className="mr-1" />
                                    {testimonial.location}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Seção de depoimentos com carrossel automático
const TestimonialCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % testimonials.length);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gradient-to-tr from-amber-50 to-white rounded-3xl p-8 shadow-sm border border-amber-100">
            <div className="flex items-center mb-6">
                <BadgeCheck className="w-5 h-5 text-amber-500 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">O que nossos clientes dizem</h3>
            </div>

            <div className="relative h-[280px]">
                <AnimatePresence mode="wait">
                    <TestimonialCard key={testimonials[activeIndex].id} testimonial={testimonials[activeIndex]} />
                </AnimatePresence>
            </div>

            {/* Indicadores de slides */}
            <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-amber-500 w-6' : 'bg-gray-300'}`}
                        aria-label={`Ver depoimento ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

// Componente principal com nova estrutura
export default function ValorAprimorado() {
    const [activeTab, setActiveTab] = useState<string>("why-us");

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                {/* Cabeçalho da seção */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold mb-4">
                        Nossa Proposta
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Imobiliária Ipê: especialistas em Guararema
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Nos dedicamos a entender as características únicas de cada região de Guararema para oferecer o melhor atendimento e as melhores oportunidades para nossos clientes.
                    </p>
                </div>

                {/* Tabs para diferentes seções */}
                <div className="mb-12 flex flex-wrap justify-center gap-3">
                    <TabButton
                        active={activeTab === "why-us"}
                        onClick={() => setActiveTab("why-us")}
                    >
                        <Shield className="w-4 h-4 mr-1.5" />
                        Por que nos escolher
                    </TabButton>
                    <TabButton
                        active={activeTab === "services"}
                        onClick={() => setActiveTab("services")}
                    >
                        <Award className="w-4 h-4 mr-1.5" />
                        Nossos serviços
                    </TabButton>
                    <TabButton
                        active={activeTab === "testimonials"}
                        onClick={() => setActiveTab("testimonials")}
                    >
                        <MessageSquare className="w-4 h-4 mr-1.5" />
                        Depoimentos
                    </TabButton>
                </div>

                {/* Conteúdo baseado na tab ativa */}
                <AnimatePresence mode="wait">
                    {activeTab === "why-us" && (
                        <motion.div
                            key="why-us"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        Conhecimento local incomparável
                                    </h3>
                                    <p className="text-gray-700 mb-6">
                                        Nossa equipe vive e respira Guararema. Conhecemos cada bairro, cada característica única e acompanhamos de perto as tendências do mercado local.
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex">
                                            <CheckCircle className="w-6 h-6 text-amber-500 mr-3" />
                                            <div>
                                                <h4 className="font-semibold text-gray-800">Foco especializado</h4>
                                                <p className="text-gray-600">Atuamos exclusivamente em Guararema e conhecemos profundamente o mercado local.</p>
                                            </div>
                                        </li>
                                        <li className="flex">
                                            <CheckCircle className="w-6 h-6 text-amber-500 mr-3" />
                                            <div>
                                                <h4 className="font-semibold text-gray-800">Equipe comprometida</h4>
                                                <p className="text-gray-600">Consultores treinados e certificados, dedicados a oferecer o melhor atendimento.</p>
                                            </div>
                                        </li>
                                        <li className="flex">
                                            <CheckCircle className="w-6 h-6 text-amber-500 mr-3" />
                                            <div>
                                                <h4 className="font-semibold text-gray-800">Transparência total</h4>
                                                <p className="text-gray-600">Informações claras e objetivas em todas as etapas do processo.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {valorMetrics.map(metric => (
                                        <MetricCard key={metric.id} metric={metric} />
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center mb-6">
                                    <Building2 className="w-6 h-6 text-amber-600 mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-900">A Ipê é certificada e reconhecida</h3>
                                </div>
                                <div className="flex flex-wrap gap-8 justify-center">
                                    <div className="text-center">
                                        <div className="text-amber-600 font-bold text-xl mb-1">CRECI-SP</div>
                                        <p className="text-gray-600 text-sm">Registro ativo desde 2010</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-amber-600 font-bold text-xl mb-1">COFECI</div>
                                        <p className="text-gray-600 text-sm">Certificação nacional</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-amber-600 font-bold text-xl mb-1">ABMI</div>
                                        <p className="text-gray-600 text-sm">Membro associado</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "services" && (
                        <motion.div
                            key="services"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            {services.map(service => (
                                <ServiceCard key={service.id} service={service} />
                            ))}
                        </motion.div>
                    )}

                    {activeTab === "testimonials" && (
                        <motion.div
                            key="testimonials"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            {testimonials.map(testimonial => (
                                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Chamada para ação */}
                <motion.div
                    className="mt-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden"
                    whileInView={{ opacity: [0, 1], y: [20, 0] }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {/* Elementos decorativos */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            Pronto para encontrar seu lugar ideal em Guararema?
                        </h3>
                        <p className="text-white/90 mb-8 text-lg">
                            Nós podemos ajudar! Entre em contato agora e deixe-nos encontrar o imóvel perfeito para suas necessidades.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <Link href="/contato" className="inline-flex items-center justify-center px-6 py-3 bg-white text-amber-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-md">
                                <MessageSquare className="w-5 h-5 mr-2" />
                                Fale conosco
                            </Link>
                            <Link href="https://wa.me/55XXXXXXXXXXX" target="_blank" className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-md">
                                <Phone className="w-5 h-5 mr-2" />
                                WhatsApp direto
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// Componente auxiliar para tabs
interface TabButtonProps {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}

const TabButton = ({ children, active, onClick }: TabButtonProps) => (
    <button
        onClick={onClick}
        className={cn(
            "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center",
            active
                ? "bg-amber-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-amber-50"
        )}
    >
        {children}
    </button>
);

// Componente ícone de MapPin
function MapPin({ size = 24, className = "" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}