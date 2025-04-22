"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import ImovelCard from "@/app/components/ImovelCard"
import { getImoveisAluguelDestaque } from "@/lib/sanity/fetchImoveis"
import type { ImovelExtended } from "@/src/types/imovel-extended"

export default function SecaoImoveisParaAlugar() {
    const [imoveis, setImoveis] = useState<ImovelExtended[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getImoveisAluguelDestaque()
            .then(setImoveis)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    return (
        <section className="py-24 bg-gradient-to-b from-neutral-100 to-neutral-200">
            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-12 text-center">
                    <h2 className="text-4xl font-extrabold">
                        Imóveis em <span className="text-amber-600">destaque</span> para aluguel
                    </h2>
                    <p className="mt-3 text-neutral-600">
                        Selecionados por alta demanda, facilidade de locação e conforto imediato.
                    </p>
                </header>

                {loading ? (
                    <p className="text-center text-neutral-500">Carregando imóveis...</p>
                ) : imoveis.length === 0 ? (
                    <p className="text-center text-neutral-500">Nenhum disponível no momento.</p>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {imoveis.map((im) => (
                            <ImovelCard key={im._id} imovel={im} finalidade="Aluguel" />
                        ))}
                    </div>
                )}

                <div className="mt-14 text-center">
                    <Link
                        href="/alugar"
                        className="inline-flex items-center gap-2 bg-amber-400 px-6 py-3 font-semibold text-[#0D1F2D] rounded-full shadow hover:bg-amber-500 transition"
                    >
                        Ver todos os imóveis para alugar
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
