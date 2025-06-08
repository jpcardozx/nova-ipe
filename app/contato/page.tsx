// app/contato/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Navbar from '../sections/NavBar';
import Footer from '../sections/Footer';
import Valor from '../sections/Valor';
import { PropertyCardUnified } from '@/app/components/ui/property/PropertyCardUnified';
import { getImoveisParaVenda } from '@lib/sanity/fetchImoveis';
import type { ImovelClient } from '../../src/types/imovel-client';
import FormalContactForm from '@/app/components/FormalContactForm';

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
            <FormalContactForm />
            <Valor />
            <Footer />
        </>
    );
}
