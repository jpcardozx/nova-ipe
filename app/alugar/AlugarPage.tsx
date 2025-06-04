// app/alugar/AlugarPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// Removed next-intl dependency - using simple text instead

import ImovelCard from '@components/ImovelCard';
import PropertyCardUnified from '@/app/components/ui/property/PropertyCardUnified';
import { ImovelClient } from '@/src/types/imovel-client'; // type import
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
                    </div>                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">                        {imoveis.map((imovel: ImovelClient) => (
                        <PropertyCardUnified
                            key={imovel._id}
                            id={imovel._id}
                            title={imovel.titulo || ''}
                            slug={imovel.slug || ''}
                            location={imovel.endereco || ''}
                            city={imovel.cidade || ''}
                            price={imovel.preco || 0}
                            propertyType="rent"
                            area={imovel.areaUtil || undefined}
                            bedrooms={imovel.dormitorios || undefined}
                            bathrooms={imovel.banheiros || undefined}
                            parkingSpots={imovel.vagas || undefined}
                            mainImage={{
                                url: imovel.imagem?.imagemUrl || imovel.galeria?.[0]?.imagemUrl || '',
                                alt: imovel.titulo || '',
                                sanityImage: imovel.imagem
                            }}
                            isHighlight={imovel.destaque || false}
                            isNew={Boolean(imovel.dataPublicacao && new Date(imovel.dataPublicacao) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))}
                        />
                    ))}
                    </div>
                </section>

                <Valor />
            </main>
            <Footer />
        </>
    );
}
