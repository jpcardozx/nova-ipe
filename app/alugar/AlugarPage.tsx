// app/alugar/AlugarPage.tsx
'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/app/sections/NavBar';
import Footer from '@/app/sections/Footer';
import Valor from '@/app/sections/Valor';
import ImovelCard from '@/app/components/ImovelCard';
import { getImoveisParaAlugar } from '@/lib/sanity/fetchImoveis';
import type { ImovelClient } from '@/src/types/imovel-client';

export default function AlugarPage() {
    const [imoveis, setImoveis] = useState<ImovelClient[]>([]);

    useEffect(() => {
        getImoveisParaAlugar()
            .then((data) => setImoveis(data))
            .catch((err) => console.error('Erro ao buscar imóveis:', err));
    }, []);

    return (
        <>
            <Navbar />
            <main className="pt-28 pb-20 bg-neutral-50 text-neutral-900">
                <section className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-extrabold">Imóveis para Alugar</h1>
                        <p className="mt-4 text-neutral-600 text-lg">
                            Confira os imóveis disponíveis com boa localização, segurança e excelente custo-benefício.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {imoveis.map((imovel) => (
                            <ImovelCard key={imovel._id} imovel={imovel} finalidade="Aluguel" />
                        ))}
                    </div>
                </section>

                <Valor />
            </main>
            <Footer />
        </>
    );
}
