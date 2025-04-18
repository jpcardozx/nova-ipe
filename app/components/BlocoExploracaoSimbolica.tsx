"use client"

import { Home, MapPin } from "lucide-react"

const filtros = [
    { label: "Casas", icon: <Home className="w-4 h-4" /> },
    { label: "Terrenos", icon: <MapPin className="w-4 h-4" /> },
    { label: "Comerciais", icon: <Home className="w-4 h-4" /> },
    { label: "Centro", icon: <MapPin className="w-4 h-4" /> },
    { label: "Itapema", icon: <MapPin className="w-4 h-4" /> },
    { label: "Rural", icon: <Home className="w-4 h-4" /> },
]

export default function BlocoExploracaoSimbolica() {
    return (
        <section className="w-full py-16 px-6 md:px-12 bg-white border-b border-[#0D1F2D]/10">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-semibold text-[#0D1F2D] mb-6">
                    🗺️ Explore por tipo ou localização
                </h2>
                <p className="text-sm text-[#0D1F2D]/60 mb-8">
                    Nossa curadoria agrupa os imóveis por categoria e região para facilitar sua busca.
                </p>
                <div className="flex flex-wrap gap-4">
                    {filtros.map((filtro, idx) => (
                        <div
                            key={idx}
                            className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-[#FFAD43]/10 text-[#0D1F2D] rounded-full border border-[#FFAD43]/30 hover:bg-[#FFAD43]/20 cursor-pointer transition"
                        >
                            {filtro.icon} {filtro.label}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}