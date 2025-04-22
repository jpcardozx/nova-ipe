"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, A11y } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import { ChevronLeft, ChevronRight } from "lucide-react"
import ImovelCard from "@/app/components/ImovelCard"
import { ImovelExtended as Extended } from "@/src/types/imovel-extended"
import type { Imovel } from "@/src/types/sanity-schema"
import { useRef, useEffect, useState } from "react"
import { sanityClient } from "@/lib/sanity"

export default function SecaoImoveisAVenda() {
    const [destaques, setDestaques] = useState<Extended[]>([])
    const prevRef = useRef<HTMLButtonElement>(null)
    const nextRef = useRef<HTMLButtonElement>(null)
    const [ready, setReady] = useState(false)

    // Carrega os imóveis em destaque
    useEffect(() => {
        sanityClient
            .fetch<Extended[]>(`
        *[_type=="imovel" && status=="disponivel" && destaque==true && finalidade=="Venda"][0...6]{
          _id, slug, titulo, cidade, bairro, preco,
          categoria->{titulo, slug},
          imagem{asset->{url}},
          area, aceitaFinanciamento, destaque
        }
      `)
            .then((res) => setDestaques(res))
            .catch(console.error)
    }, [])

    // Ativa Swiper só no client
    useEffect(() => setReady(true), [])

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
                        <strong className="text-neutral-800">potencial de valorização</strong>
                        , localização e simbologia única.
                    </p>
                </header>

                {destaques.length === 0 ? (
                    <p className="text-center text-neutral-500">Carregando ou nenhum imóvel.</p>
                ) : (
                    <>
                        {ready && (
                            <Swiper
                                modules={[Navigation, Pagination, A11y]}
                                navigation={{
                                    prevEl: prevRef.current!,
                                    nextEl: nextRef.current!,
                                }}
                                pagination={{ clickable: true }}
                                spaceBetween={32}
                                slidesPerView={1.05}
                                breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
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
                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow ring-1 ring-neutral-200 hover:bg-amber-100 transition"
                        >
                            <ChevronLeft className="text-amber-600" />
                        </button>
                        <button
                            ref={nextRef}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow ring-1 ring-neutral-200 hover:bg-amber-100 transition"
                        >
                            <ChevronRight className="text-amber-600" />
                        </button>
                    </>
                )}
            </div>
        </section>
    )
}
