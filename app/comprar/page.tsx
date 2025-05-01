// app/comprar/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/app/sections/NavBar';
import Footer from '@/app/sections/Footer';
import Valor from '@/app/sections/Valor';
import ImovelCard from '@/app/components/ImovelCard';
import { getImoveisParaVenda } from '@/lib/sanity/fetchImoveis';
import type { ImovelClient } from '@/src/types/imovel-client';

export default function Page() {
    const [imoveis, setImoveis] = useState<ImovelClient[]>([]);

    useEffect(() => {
        getImoveisParaVenda()
            .then((data) => setImoveis(data))
            .catch((err) => console.error('Erro ao buscar imóveis para venda:', err));
    }, []);

    return (
        <>
            <Navbar />

            <main className="bg-gradient-to-b from-white to-neutral-50 text-neutral-900 pt-24 pb-32">
                {/* Hero da seção */}
                <section className="max-w-4xl mx-auto px-6 text-center mb-20">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                        Imóveis para <span className="text-amber-500">compra</span> com curadoria simbólica
                    </h1>
                    <p className="mt-4 text-lg text-neutral-600">
                        Selecionados por sua <strong>potencial valorização</strong>, localização estratégica
                        e <span className="italic">significado institucional</span> em Guararema e região.
                    </p>
                </section>

                {/* Listagem de imóveis */}
                <section className="max-w-7xl mx-auto px-6">
                    {imoveis.length === 0 ? (
                        <p className="text-center text-neutral-500 text-lg">
                            Nenhum imóvel disponível para compra no momento.
                        </p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {imoveis.map((imovel) => (
                                <ImovelCard key={imovel._id} imovel={imovel} finalidade="Venda" />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Valor />
            <Footer />
        </>
    );
}
