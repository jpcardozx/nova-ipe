"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { ChevronLeft, ChevronRight } from "lucide-react";
import ImovelCard from "@/app/components/ImovelCard";
import type { ImovelExtended } from "@/src/types/imovel-extended";
import { getImoveisParaVenda } from "@/lib/sanity/fetchImoveis";
import { motion } from "framer-motion";

export default function SecaoImoveisAVenda(): React.ReactElement {
    const [destaques, setDestaques] = useState<ImovelExtended[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(false);
    const [ready, setReady] = useState(false);

    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        getImoveisParaVenda()
            .then((res) => setDestaques(res.filter((i) => i.destaque)))
            .catch(() => setErro(true))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => setReady(true), []);

    return (
        <section className="relative py-24 bg-gradient-to-b from-white to-neutral-100">
            <div className="max-w-7xl mx-auto px-6">
                {/* Heading */}
                <header className="mb-16 text-center">
                    <h2 className="text-4xl font-extrabold">
                        Imóveis em <span className="text-amber-600">destaque</span> à venda
                    </h2>
                    <p className="mt-3 text-neutral-600 max-w-2xl mx-auto">
                        Selecionados pela equipe Ipê por seu{" "}
                        <strong className="text-neutral-800">potencial de valorização</strong>, localização e
                        simbologia única.
                    </p>
                </header>

                {loading ? (
                    <p className="text-center text-neutral-400 italic">Carregando imóveis em destaque...</p>
                ) : erro ? (
                    <p className="text-center text-red-500">Erro ao carregar imóveis. Tente novamente.</p>
                ) : destaques.length === 0 ? (
                    <p className="text-center text-neutral-500">Nenhum imóvel em destaque no momento.</p>
                ) : destaques.length === 1 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <ImovelCard imovel={destaques[0]} finalidade="Venda" />
                    </motion.div>
                ) : (
                    <>
                        {ready && prevRef.current && nextRef.current && (
                            <Swiper
                                modules={[Navigation, Pagination, A11y]}
                                navigation={{
                                    prevEl: prevRef.current,
                                    nextEl: nextRef.current,
                                }}
                                pagination={{ clickable: true }}
                                spaceBetween={32}
                                slidesPerView={1.05}
                                breakpoints={{
                                    768: { slidesPerView: 2 },
                                    1024: { slidesPerView: 3 },
                                }}
                                className="pb-12"
                            >
                                {destaques.map((im) => (
                                    <SwiperSlide key={im._id}>
                                        <ImovelCard imovel={im} finalidade="Venda" />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}

                        {/* Navegação manual */}
                        <button
                            ref={prevRef}
                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow ring-1 ring-neutral-200 hover:bg-amber-100 transition z-10"
                        >
                            <ChevronLeft className="text-amber-600" />
                        </button>
                        <button
                            ref={nextRef}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow ring-1 ring-neutral-200 hover:bg-amber-100 transition z-10"
                        >
                            <ChevronRight className="text-amber-600" />
                        </button>
                    </>
                )}
            </div>
        </section>
    );
}
