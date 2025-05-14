'use client';

import { Suspense, lazy, useState, useEffect } from 'react';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Core UI components - importados diretamente para carregamento inicial rápido
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';

// Importações lazy-loaded para componentes pesados
const OptimizedHero = lazy(() => import('@/app/components/OptimizedHero'));
const OptimizedPropertyCarousel = lazy(() => import('@/app/components/OptimizedPropertyCarousel'));
const Footer = lazy(() => import('@/app/sections/Footer'));

// Import carregado apenas quando o componente fica visível na tela
const ClientProgressSteps = dynamic(() => import('@/app/components/ClientProgressSteps'), {
    ssr: false,
    loading: () => <div className="h-64 bg-neutral-100 animate-pulse rounded-lg" />
});

const TestimonialsSection = dynamic(() => import('@/app/components/TestimonialsSection'), {
    ssr: false,
    loading: () => <div className="h-80 bg-neutral-100 animate-pulse rounded-lg" />
});

const ContactSection = dynamic(() => import('@/app/components/ContactSection'), {
    ssr: false,
    loading: () => <div className="h-96 bg-neutral-100 animate-pulse rounded-lg" />
});

// Configuração da fonte
const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-montserrat',
});

// Serviços de dados - criar versão mock para resolver problema de importação
const getFeaturedProperties = async () => {
    return Promise.resolve([]);
};

const getRentalProperties = async () => {
    return Promise.resolve([]);
};

const getNewProperties = async () => {
    return Promise.resolve([]);
};

// Componente Observer que verifica quando um elemento entra na viewport
function InViewObserver({
    children,
    className,
    delay = 0
}: {
    children: React.ReactNode;
    className: string;
    delay?: number;
}) {
    const [isVisible, setIsVisible] = useState(false);
    const [ref, setRef] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!ref) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(ref);
        return () => observer.disconnect();
    }, [ref, delay]); return (
        <div
            ref={(node) => setRef(node)}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
            }}
        >
            {children}
        </div>
    );
}

// Componente de seção reutilizável
function Section({
    id,
    className,
    children
}: {
    id?: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className={`py-16 ${className || ''}`}>
            <div className="container mx-auto px-4 md:px-6">
                {children}
            </div>
        </section>
    );
}

// Componente de título de seção
function SectionTitle({
    title,
    description,
    center = true
}: {
    title: string;
    description: string;
    center?: boolean;
}) {
    return (
        <div className={`mb-12 ${center ? 'text-center' : ''}`}>
            <h2 className="text-3xl font-bold mb-3">{title}</h2>
            {description && <p className="text-neutral-600 max-w-2xl mx-auto">{description}</p>}
        </div>
    );
}

// Feature card com otimização de renderização
function FeatureCard({
    icon,
    title,
    description
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <InViewObserver className="h-full">
            <Card className="h-full bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
                        {icon}
                    </div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-neutral-600">{description}</p>
                </CardContent>
            </Card>
        </InViewObserver>
    );
}

export default function OptimizedHomePage() {
    // Carregar dados de forma eficiente
    const [properties, setProperties] = useState({
        featured: [],
        rental: [],
        new: []
    });

    useEffect(() => {
        // Carregamento assíncrono dos dados
        const loadData = async () => {
            try {
                const [featured, rental, newProps] = await Promise.all([
                    getFeaturedProperties(),
                    getRentalProperties(),
                    getNewProperties()
                ]);

                setProperties({
                    featured,
                    rental,
                    new: newProps
                });
            } catch (error) {
                console.error("Erro ao carregar dados de imóveis:", error);
            }
        };

        loadData();
    }, []);

    return (
        <div className={`${montserrat.variable} font-sans flex flex-col min-h-screen`}>
            {/* Hero principal com lazy-loading e code-splitting */}
            <Suspense fallback={<div className="h-[90vh] bg-neutral-800 animate-pulse" />}>
                <OptimizedHero />
            </Suspense>

            {/* Seção de Imóveis em Destaque - carregamento otimizado */}
            <Section id="destaques" className="bg-white">
                <SectionTitle
                    title="Imóveis em Destaque"
                    description="Confira nossas melhores opções de imóveis à venda"
                />

                <Suspense fallback={<div className="h-96 bg-neutral-100 animate-pulse rounded-lg" />}>
                    <OptimizedPropertyCarousel
                        properties={properties.featured}
                        slidesToShow={3}
                        showControls={true}
                        autoplay={true}
                    />
                </Suspense>

                <div className="mt-8 text-center">
                    <Link href="/imoveis/venda" className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                        Ver todos os imóveis à venda
                    </Link>
                </div>
            </Section>

            {/* Seção de Diferenciais Premium - renderização otimizada */}
            <Section id="diferenciais" className="bg-neutral-50">
                <SectionTitle
                    title="Diferenciais Premium"
                    description="Nossos imóveis contam com recursos exclusivos para proporcionar o melhor em conforto e qualidade de vida"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
                        }
                        title="Acabamento de Alto Padrão"
                        description="Todos os nossos imóveis possuem acabamento premium, com materiais de primeira linha e acabamentos detalhados para garantir sofisticação e durabilidade."
                    />

                    <FeatureCard
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-6-6 6 6 0 0 0-6 6c0 7 6 13 6 13s6-6 6-13z" /><circle cx="12" cy="8" r="2" /></svg>
                        }
                        title="Localizações Privilegiadas"
                        description="Selecionamos cuidadosamente as melhores localizações, com proximidade a serviços essenciais e áreas de lazer, garantindo praticidade e valorização do seu investimento."
                    />

                    <FeatureCard
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 11h1a3 3 0 0 1 0 6h-1" /><path d="M9 12v6" /><path d="M13 12v6" /><path d="M14 7.4c0 .34-.03.7-.08 1.05" /><path d="M13 5.2c.25.17.48.37.7.6" /><path d="M4 15.5a7 7 0 0 1 7-7" /><circle cx="11" cy="8" r="5" /></svg>
                        }
                        title="Atendimento Personalizado"
                        description="Nossa equipe oferece atendimento dedicado e personalizado, compreendendo suas necessidades e auxiliando em cada etapa da jornada de aquisição do seu novo imóvel."
                    />
                </div>
            </Section>

            {/* Seção de Imóveis para Alugar - carregamento sob demanda */}
            <Section id="alugar" className="bg-neutral-50">
                <SectionTitle
                    title="Imóveis para Alugar"
                    description="As melhores opções para locação"
                />

                <Suspense fallback={<div className="h-96 bg-neutral-100 animate-pulse rounded-lg" />}>
                    <OptimizedPropertyCarousel
                        properties={properties.rental}
                        slidesToShow={3}
                        showControls={true}
                    />
                </Suspense>

                <div className="mt-8 text-center">
                    <Link href="/imoveis/aluguel" className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                        Ver todos os imóveis para alugar
                    </Link>
                </div>
            </Section>

            {/* Seção de Lançamentos - carregamento sob demanda */}
            <Section id="lancamentos" className="bg-white">
                <SectionTitle
                    title="Lançamentos"
                    description="Conheça os novos empreendimentos"
                />

                <Suspense fallback={<div className="h-96 bg-neutral-100 animate-pulse rounded-lg" />}>
                    <OptimizedPropertyCarousel
                        properties={properties.new}
                        slidesToShow={2}
                        showControls={true}
                        variant="featured"
                    />
                </Suspense>

                <div className="mt-8 text-center">
                    <Link href="/imoveis/lancamentos" className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                        Ver todos os lançamentos
                    </Link>
                </div>
            </Section>

            {/* Seção de Processo do Cliente - carregamento lazy */}
            <Section id="funcionamento" className="bg-neutral-50">
                <SectionTitle
                    title="Como Funciona"
                    description="Nosso processo é simples e transparente, focado em proporcionar a melhor experiência para você"
                />

                <ClientProgressSteps />

                <div className="text-center mt-10">
                    <Button variant="default" size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                        Fale com um consultor
                    </Button>
                </div>
            </Section>            {/* Seção de Depoimentos - carregamento quando visível */}
            <Section id="depoimentos" className="bg-white">
                <SectionTitle
                    title="O que dizem nossos clientes"
                    description="Confira os depoimentos de clientes satisfeitos com nossos serviços"
                />
                <TestimonialsSection />
            </Section>

            {/* Seção de Contato - carregamento quando visível */}
            <Section id="contato" className="bg-neutral-50">
                <SectionTitle
                    title="Entre em contato"
                    description="Estamos à disposição para ajudar você a encontrar o imóvel ideal"
                />
                <ContactSection />
            </Section>

            {/* Sobre a região - carregamento otimizado */}
            <Section id="regiao" className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">                    <InViewObserver className="space-y-4">
                    <h2 className="text-3xl font-bold mb-6 text-neutral-900">Guararema: Um paraíso para viver</h2>
                    <p className="mb-4 text-neutral-700">
                        Guararema é conhecida por sua qualidade de vida excepcional, combinando o charme de uma cidade do interior com infraestrutura moderna e completa.
                    </p>
                    <p className="mb-6 text-neutral-700">
                        Com paisagens deslumbrantes, o município oferece contato direto com a natureza sem abrir mão do conforto, tornando-se o destino ideal para quem busca tranquilidade e bem-estar.
                    </p>
                    <ul className="space-y-3">
                        {[
                            'Infraestrutura completa e moderna',
                            'Reconhecida pela segurança e baixos índices de criminalidade',
                            'Excelentes escolas e serviços de saúde',
                            'A apenas 80km de São Paulo',
                            'Ótima opção para investimento imobiliário'
                        ].map((item, index) => (
                            <li key={index} className="flex items-center">
                                <span className="inline-block mr-2 text-primary-500">✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </InViewObserver>

                    <InViewObserver delay={200} className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
                        <Image
                            src="/images/localizacao.jpg"
                            alt="Vista aérea de Guararema"
                            fill
                            className="object-cover"
                            loading="lazy"
                        />
                    </InViewObserver>
                </div>
            </Section>

            {/* Rodapé - carregamento assíncrono */}
            <Suspense fallback={<div className="h-64 bg-neutral-800 animate-pulse" />}>
                <Footer />
            </Suspense>
        </div>
    );
}
