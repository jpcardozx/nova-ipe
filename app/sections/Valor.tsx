"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { Phone, MapPin, PieChart, Users } from "lucide-react";

// Font configuration
const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-montserrat",
});

// Types
interface Estatistica {
    valor: string;
    legenda: string;
    destaque?: boolean;
}

interface Diferencial {
    id: string;
    titulo: string;
    descricao: string;
    icon: React.ReactNode;
    estatisticas: Estatistica[];
}

export default function SecaoExcelenciaIpe() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Dados concretos com enfoque em valor real para o cliente
    const diferenciais: Diferencial[] = [
        {
            id: "local",
            titulo: "Especialistas locais",
            descricao: "Equipe com 15 anos de experiência exclusiva em Guararema, especializada nos bairros Itapema, Centro e Itaóca.",
            icon: <MapPin className="w-5 h-5" />,
            estatisticas: [
                { valor: "97%", legenda: "taxa de satisfação dos clientes", destaque: true },
                { valor: "3x", legenda: "mais rápido que a média do mercado" }
            ]
        },
        {
            id: "dados",
            titulo: "Análise de mercado",
            descricao: "Banco de dados proprietário com histórico de vendas desde 2008 e análise comparativa de mais de 2.500 imóveis.",
            icon: <PieChart className="w-5 h-5" />,
            estatisticas: [
                { valor: "12%", legenda: "preço médio acima do mercado" },
                { valor: "100+", legenda: "imóveis negociados de maneira segura", destaque: true }
            ]
        },
        {
            id: "network",
            titulo: "Rede premium",
            descricao: "Acesso a rede qualificada de compradores e experiência de atendimento personalizada de acordo com as demandas emergentes no processo de compra e venda.",
            icon: <Users className="w-5 h-5" />,
            estatisticas: [
                { valor: "62%", legenda: "das vendas por indicação", destaque: true },
                { valor: "45", legenda: "dias aproximadamente de tempo médio de negociação" }
            ]
        }
    ];

    return (
        <section
            ref={sectionRef}
            className={`bg-white py-10 ${montserrat.variable}`}
            aria-label="Por que escolher a Ipê Imobiliária"
        >
            <div className="max-w-6xl mx-auto px-4">
                {/* Layout repensado com grid responsivo e densidade de informação adequada */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* Cabeçalho superior com título, descrição e CTA */}
                    <div className="lg:col-span-12 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <div className="mb-6 sm:mb-0 max-w-2xl">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                                    Por que a Ipê é a imobiliária mais bem avaliada em Guararema?
                                </h2>
                                <p className="text-gray-700 mt-2">
                                    <span className="font-medium">3 em cada 5 negociações</span> passam por nossa equipe. Entenda o porquê!
                                </p>
                            </div>

                            <Link
                                href="/avaliacao-gratuita"
                                className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-5 py-3 rounded-lg transition-colors whitespace-nowrap text-center flex items-center justify-center gap-2"
                            >
                                <Phone className="w-4 h-4" />
                                <span>Avaliar meu imóvel</span>
                            </Link>
                        </div>

                        <div className="border-b border-gray-200 mt-6"></div>
                    </div>

                    {/* Coluna de imagem à esquerda */}
                    <div className={`lg:col-span-5 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="relative aspect-[3/4] h-full rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                            <Image
                                src="/images/predioIpe.png"
                                alt="Sede da Ipê Imobiliária em Guararema"
                                fill
                                className="object-cover object-center"
                                sizes="(max-width: 1024px) 100vw, 33vw"
                                priority
                            />

                            {/* Badge de credencial */}
                            <div className="absolute top-4 left-4 bg-white/90 py-1 px-3 rounded-md text-sm font-medium text-gray-800 backdrop-blur-sm">
                                CRECI @@@.@@@
                            </div>
                        </div>
                    </div>

                    {/* Coluna de conteúdo à direita */}
                    <div className={`lg:col-span-7 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Diferenciais em cards horizontais */}
                        <div className="space-y-6">
                            {diferenciais.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-5 bg-gray-50 rounded-lg border border-gray-100"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="bg-amber-600 p-2 rounded-lg text-white flex-shrink-0">
                                            {item.icon}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {item.titulo}
                                            </h3>
                                            <p className="text-gray-600 mb-3 text-sm">
                                                {item.descricao}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4">
                                                {item.estatisticas.map((stat, index) => (
                                                    <div key={index} className="flex flex-col">
                                                        <span className={`text-2xl font-bold ${stat.destaque ? 'text-amber-600' : 'text-gray-700'}`}>
                                                            {stat.valor}
                                                        </span>
                                                        <span className="text-gray-500 text-sm">
                                                            {stat.legenda}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Área de depoimento com informação social proof */}
                        <div className="mt-8 p-5 bg-amber-50 rounded-lg border border-amber-100">
                            <div className="flex items-start gap-4">
                                <div className="rounded-full overflow-hidden w-12 h-12 flex-shrink-0 border-2 border-amber-200">
                                    <Image
                                        src="/images/ipeLogo.png"
                                        alt="Logo da Ipê Imobiliária"
                                        width={48}
                                        height={48}
                                        className="object-cover"
                                    />
                                </div>

                                <div>
                                    <p className="text-gray-700 italic mb-2 text-sm">
                                        "Conhecemos a Ipê pela indicação de amigos e fomos surpreendidos. Nossa casa foi vendida em apenas 26 dias e com valor acima do que esperávamos."
                                    </p>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="font-medium text-gray-900">Ricardo e Ana Oliveira</p>
                                            <p className="text-xs text-gray-500">Venderam imóvel no Itapema</p>
                                        </div>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg key={star} className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Call-to-action secundário */}
                        <div className="mt-8 text-center sm:text-left">
                            <Link
                                href="/sobre-nos"
                                className="text-amber-700 font-medium hover:text-amber-800 underline-offset-4 hover:underline transition-colors"
                            >
                                Precisa de ajuda? Fale conosco!
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}