"use client";

import React, { useState, useContext, createContext, useMemo, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Quote, Calendar, ArrowRight, ArrowLeft } from "lucide-react";

// Definição do tipo para um depoimento
interface Testimonial {
    id: string;
    nome: string;
    cargo: string;
    local: string;
    empreendimento: string;
    texto: string;
    imagem: string;
    data: string;
}

// Dados dos depoimentos
const depoimentos: Testimonial[] = [
    {
        id: "l1",
        nome: "Leonardo Costa",
        cargo: "Corretor Associado",
        local: "Guararema, SP",
        empreendimento: "Condomínio Portal das Araucárias",
        texto: "Trabalho há 15 anos no mercado imobiliário e raramente vejo clientes tão satisfeitos quanto a família Mendes. O que fez diferença foi entender que eles buscavam mais que uma casa - queriam um lugar onde pudessem receber amigos e ainda manter contato com a natureza. Acabamos encontrando uma propriedade que nem estava oficialmente no mercado ainda, mas que se encaixava perfeitamente no perfil.",
        imagem: "/images/leonardo.jpg",
        data: "Março de 2025"
    },
    {
        id: "l2",
        nome: "José Luiz Ferreira",
        cargo: "Empresário",
        local: "Guararema, SP",
        empreendimento: "Residencial Villa Verde",
        texto: "Depois de três meses procurando sem sucesso, um amigo recomendou a Ipê. A diferença foi notável desde o início. Em vez de nos mostrar dezenas de imóveis, nos fizeram perguntas específicas sobre nosso estilo de vida. Acabamos encontrando uma casa que nem consideraríamos inicialmente, mas que agora, seis meses depois, parece ter sido feita exatamente para nós. Apreciamos especialmente a transparência durante a negociação do valor final.",
        imagem: "/images/joseluiz.jpg",
        data: "Janeiro de 2025"
    },
    {
        id: "l3",
        nome: "Julia Andrade",
        cargo: "Consultora Imobiliária",
        local: "Mogi das Cruzes, SP",
        empreendimento: "Quinta dos Ipês",
        texto: "Um dos desafios do nosso trabalho é filtrar o que realmente importa para cada cliente. Quando atendi o Sr. Ricardo, percebi que ele dispensava luxos desnecessários, mas era inflexível quanto à qualidade da construção e localização. Visitamos apenas quatro imóveis em duas semanas. Hoje, seis meses após a mudança, ele me enviou fotos da reforma da varanda - pequena, mas com vista privilegiada para a serra, exatamente como ele queria.",
        imagem: "/images/julia.jpg",
        data: "Fevereiro de 2025"
    },
    {
        id: "l4",
        nome: "Ricardo e Ana Silva",
        cargo: "Clientes",
        local: "Guararema, SP",
        empreendimento: "Chácara Monte Sereno",
        texto: "Precisávamos de um lugar que acomodasse nossas necessidades de home office mas também fosse confortável para nossos dois filhos. Depois de uma experiência frustrante com outra imobiliária, a Ipê realmente ouviu o que precisávamos. Julia nos mostrou apenas três propriedades, todas dentro do nosso orçamento e com características bem específicas que tínhamos mencionado. O processo de documentação também foi surpreendentemente tranquilo.",
        imagem: "/images/cliente-placeholder.jpg",
        data: "Dezembro de 2024"
    },
];

// Definição do tipo para o contexto
interface TestimonialContextType {
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    currentTestimonial: Testimonial;
    isTransitioning: boolean;
    navigate: (direction: number) => void;
    totalTestimonials: number;
    handleTouchStart: (e: React.TouchEvent) => void;
    handleTouchEnd: (e: React.TouchEvent) => void;
    containerRef: any;
}

// Criação do contexto com valor inicial adequado
const TestimonialContext = createContext<TestimonialContextType | null>(null);

// Hook personalizado para acessar o contexto com tipagem
function useTestimonial(): TestimonialContextType {
    const context = useContext(TestimonialContext);
    if (!context) {
        throw new Error("useTestimonial deve ser usado dentro de TestimonialProvider");
    }
    return context;
}

// Provider principal que encapsula a lógica do componente
function TestimonialProvider({ children }: { children: React.ReactNode }): React.ReactElement {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    // Fix: corrige a tipagem do containerRef
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const touchRef = useRef<{ startX: number; startY: number }>({ startX: 0, startY: 0 });

    const currentTestimonial = useMemo<Testimonial>(() =>
        depoimentos[activeIndex], [activeIndex]);

    // Navegação com debounce para evitar cliques múltiplos
    const navigate = useCallback((direction: number): void => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        const newIndex = (activeIndex + direction + depoimentos.length) % depoimentos.length;
        setActiveIndex(newIndex);

        // Reset do estado de transição após a animação
        timeoutRef.current = setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    }, [activeIndex, isTransitioning]);

    // Event handlers para controle de touch/swipe
    const handleTouchStart = useCallback((e: React.TouchEvent): void => {
        touchRef.current.startX = e.touches[0].clientX;
        touchRef.current.startY = e.touches[0].clientY;
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent): void => {
        if (isTransitioning) return;

        const deltaX = touchRef.current.startX - e.changedTouches[0].clientX;
        const deltaY = touchRef.current.startY - e.changedTouches[0].clientY;

        // Se o movimento horizontal for mais significativo que o vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            navigate(deltaX > 0 ? 1 : -1);
        }
    }, [navigate, isTransitioning]);

    // Cleanup de timeouts ao desmontar
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Valor do contexto
    const value = useMemo<TestimonialContextType>(() => ({
        activeIndex,
        setActiveIndex,
        currentTestimonial,
        isTransitioning,
        navigate,
        totalTestimonials: depoimentos.length,
        handleTouchStart,
        handleTouchEnd,
        containerRef
    }), [
        activeIndex,
        setActiveIndex,
        currentTestimonial,
        isTransitioning,
        navigate,
        handleTouchStart,
        handleTouchEnd
    ]);

    return (
        <TestimonialContext.Provider value={value}>
            {children}
        </TestimonialContext.Provider>
    );
}

// Componente de navegação com indicadores de progresso
function TestimonialNavigation(): React.ReactElement {
    const { activeIndex, setActiveIndex, navigate, totalTestimonials, isTransitioning } = useTestimonial();

    return (
        <div className="flex items-center justify-between">
            <button
                onClick={() => navigate(-1)}
                disabled={isTransitioning}
                className={`p-3 rounded-full transition-all duration-300 ${isTransitioning
                    ? 'bg-[#18344A] cursor-not-allowed'
                    : 'bg-[#2C4D68] hover:bg-[#E6AA2C]'
                    }`}
                aria-label="Depoimento anterior"
            >
                <ArrowLeft size={18} className="text-white" />
            </button>

            <div className="flex items-center gap-2">
                {Array.from({ length: totalTestimonials }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => !isTransitioning && activeIndex !== idx && setActiveIndex(idx)}
                        className={`transition-all duration-300 rounded-full ${idx === activeIndex
                            ? 'w-8 h-2 bg-[#E6AA2C]'
                            : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                            }`}
                        disabled={isTransitioning || idx === activeIndex}
                        aria-label={`Depoimento ${idx + 1}`}
                        aria-current={idx === activeIndex}
                    />
                ))}
            </div>

            <button
                onClick={() => navigate(1)}
                disabled={isTransitioning}
                className={`p-3 rounded-full transition-all duration-300 ${isTransitioning
                    ? 'bg-[#18344A] cursor-not-allowed'
                    : 'bg-[#2C4D68] hover:bg-[#E6AA2C]'
                    }`}
                aria-label="Próximo depoimento"
            >
                <ArrowRight size={18} className="text-white" />
            </button>
        </div>
    );
}

// Componente de cabeçalho da seção
function SectionHeader(): React.ReactElement {
    return (
        <div className="mb-12">
            <h2 className="text-[#E6AA2C] text-3xl md:text-4xl font-light mb-4">
                O que dizem nossos <span className="font-medium">clientes</span>
            </h2>
            <p className="text-white/80 max-w-2xl">
                Histórias reais de pessoas que encontraram o imóvel ideal para suas necessidades.
            </p>
        </div>
    );
}

// Componente do card de depoimento
function TestimonialContent(): React.ReactElement {
    const { currentTestimonial } = useTestimonial();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10 h-full"
        >
            <div className="flex items-start gap-3 mb-5">
                <Quote size={24} className="text-[#E6AA2C]/50 mt-1 flex-shrink-0" />
                <blockquote className="text-white/90 text-base leading-relaxed">
                    {currentTestimonial.texto}
                </blockquote>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <div>
                    <div className="text-[#E6AA2C] font-medium">
                        {currentTestimonial.cargo}
                    </div>
                    <div className="text-white/70 text-sm">
                        {currentTestimonial.empreendimento}
                    </div>
                </div>

                <div className="flex items-center text-sm text-white/60">
                    <Calendar size={14} className="mr-1 text-[#E6AA2C]/70" />
                    {currentTestimonial.data}
                </div>
            </div>
        </motion.div>
    );
}

// Componente da foto do cliente
function ClientImage(): React.ReactElement {
    const { currentTestimonial } = useTestimonial();
    const [imageError, setImageError] = useState<boolean>(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-full min-h-[300px] md:min-h-[400px] rounded-lg overflow-hidden"
        >
            <Image
                src={imageError ? "/images/default-avatar.jpg" : currentTestimonial.imagem}
                alt={`Foto de ${currentTestimonial.nome}`}
                fill
                className="object-cover"
                priority
                onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D2638]/80 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white font-medium text-xl mb-1">
                    {currentTestimonial.nome}
                </h3>
                <div className="flex items-center text-white/80 text-sm">
                    <MapPin size={14} className="mr-1 text-[#E6AA2C]" />
                    {currentTestimonial.local}
                </div>
            </div>
        </motion.div>
    );
}

// Container com suporte a touch/swipe
function TestimonialContainer({ children }: { children: React.ReactNode }): React.ReactElement {
    const { handleTouchStart, handleTouchEnd, containerRef, currentTestimonial } = useTestimonial();

    return (
        <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="md:col-span-5 lg:col-span-7 grid md:grid-cols-5 lg:grid-cols-7 gap-6 md:gap-8"
        >
            <AnimatePresence mode="wait" key={currentTestimonial.id}>
                {children}
            </AnimatePresence>
        </div>
    );
}

// Componente principal que integra tudo
export default function SecaoDepoimentos(): React.ReactElement {
    return (
        <TestimonialProvider>
            <section className="bg-gradient-to-b from-[#0D2638] to-[#18344A] py-20 overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    <SectionHeader />

                    {/* Grid layout responsivo */}
                    <div className="grid md:grid-cols-5 lg:grid-cols-7 gap-6 md:gap-8 mb-8">
                        {/* Navegação (visível apenas em desktop) */}
                        <div className="hidden md:flex md:col-span-5 lg:col-span-7 justify-between mb-4">
                            <TestimonialNavigation />
                        </div>

                        {/* Container principal com suporte a touch */}
                        <TestimonialContainer>
                            <div className="md:col-span-2 lg:col-span-3 h-full">
                                <ClientImage />
                            </div>

                            <div className="md:col-span-3 lg:col-span-4 h-full">
                                <TestimonialContent />
                            </div>
                        </TestimonialContainer>

                        {/* Navegação mobile */}
                        <div className="md:hidden col-span-1 mt-2">
                            <TestimonialNavigation />
                        </div>
                    </div>

                    {/* CTA simples e efetivo */}
                    <div className="mt-16 text-center">
                        <a
                            href="/imoveis"
                            className="inline-flex items-center gap-2 bg-[#E6AA2C] hover:bg-[#d19720] text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Ver imóveis disponíveis
                            <ArrowRight size={16} />
                        </a>
                    </div>
                </div>
            </section>
        </TestimonialProvider>
    );
}