// app/alugar/AlugarPage.tsx
'use client';

import { useState, useEffect } from 'react';

import ImovelCard from '@components/ImovelCard';
import { ImovelClient } from '@/types/imovel-client'; // type import
import { getImoveisParaAlugar } from '@lib/sanity/fetchImoveis';
import Footer from '@sections/Footer';
import NavBar from '@sections/NavBar';
import Valor from '@sections/Valor'; // Corrected path

export default function AlugarPage() {
    const [imoveis, setImoveis] = useState<ImovelClient[]>([]);

    useEffect(() => {
        getImoveisParaAlugar()
            .then((data: ImovelClient[]) => setImoveis(data))
            .catch((err: any) => console.error('Erro ao buscar imóveis:', err));
    }, []);

    return (
        <>
            <NavBar />
            <main className="pt-28 pb-20 bg-neutral-50 text-neutral-900">
                <section className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-extrabold">Imóveis para Alugar</h1>
                        <p className="mt-4 text-neutral-600 text-lg">
                            Confira os imóveis disponíveis com boa localização, segurança e excelente custo-benefício.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {imoveis.map((imovel: ImovelClient) => (
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
