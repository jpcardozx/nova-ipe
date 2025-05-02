"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

import { OptimizedCarousel } from "@components/OptimizedCarousel";
import {
    CarouselCard,
    ImovelHero,
    LoadingState,
    ErrorState,
    EmptyState
} from "@components/ImoveisAluguelComponents";

import {
    useImoveisAluguel,
    ImoveisAluguelProvider
} from "@components/ImoveisAluguelContext";

/* ---------------- Componente de conteúdo interno ---------------- */
function ImoveisAluguelContent() {
    const {
        state,
        fetchImoveis,
        setActiveImovel,
        isActiveImovel,
    } = useImoveisAluguel();

    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin: "200px"
    });

    useEffect(() => {
        if (inView && state.status === "idle") {
            fetchImoveis();
        }
    }, [inView, fetchImoveis, state.status]);

    const renderCarouselItem = (imovel: any) => (
        <CarouselCard
            key={imovel._id}
            imovel={imovel}
            isActive={isActiveImovel(imovel._id)}
            onClick={() => setActiveImovel(imovel._id)}
        />
    );

    const carouselOptions = {
        slidesPerView: 1.2,
        spacing: 16,
        loop: state.imoveis.length > 3,
        breakpoints: {
            "(min-width: 640px)": { slidesPerView: 2, spacing: 16 },
            "(min-width: 768px)": { slidesPerView: 2.5, spacing: 20 },
            "(min-width: 1024px)": { slidesPerView: 3, spacing: 24 },
            "(min-width: 1280px)": { slidesPerView: 4, spacing: 24 }
        },
        autoplay: true,
        autoplayInterval: 7000
    };

    const accentColor = {
        primary: "bg-blue-600 text-white",
        secondary: "bg-blue-100 text-blue-800",
        highlight: "bg-blue-500/10",
        ring: "focus:ring-blue-400",
        accent: "text-blue-600"
    };

    return (
        <section
            ref={ref}
            className="relative py-16 bg-gradient-to-b from-stone-50 via-white to-stone-100"
            aria-labelledby="secao-destaques-aluguel-titulo"
        >
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

            <div className="container mx-auto px-4">
                {/* Loading, erro e vazio */}
                {state.status === "loading" && <LoadingState />}
                {state.status === "error" && <ErrorState />}
                {state.status === "success" && state.imoveis.length === 0 && <EmptyState />}

                {/* Dados carregados */}
                {state.status === "success" && state.imoveis.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Cabeçalho */}
                        <div className="mb-8">
                            <h2
                                id="secao-destaques-aluguel-titulo"
                                className="text-3xl font-bold text-stone-800 mb-2"
                            >
                                Destaques para Aluguel
                            </h2>
                            <p className="text-stone-600">
                                Conheça imóveis com ótima localização e alto potencial de valorização.
                            </p>
                        </div>

                        {/* Imóvel em foco */}
                        <ImovelHero />

                        {/* Carousel */}
                        {state.imoveis.length > 1 && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-medium text-stone-800">
                                        Mais opções para você
                                    </h3>
                                </div>

                                <OptimizedCarousel
                                    items={state.imoveis}
                                    getKey={(imovel) => imovel._id}
                                    renderItem={renderCarouselItem}
                                    options={carouselOptions}
                                    accentColor={accentColor}
                                    title="Imóveis para Alugar"
                                    subtitle={`${state.imoveis.length} disponíveis`}
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </section>
    );
}

/* ---------------- Wrapper externo ---------------- */
export default function DestaquesAluguel() {
    return (
        <ImoveisAluguelProvider>
            <ImoveisAluguelContent />
        </ImoveisAluguelProvider>
    );
}
