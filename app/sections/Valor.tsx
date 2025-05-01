"use client";

import { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { MapPin, TrendingUp, Shield, ChevronRight } from "lucide-react";

// Fonte refinada com pesos estratégicos
const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
    variable: "--font-montserrat",
});

// Definição de tipos para resolver os erros TypeScript
type DiferencialKey = 'seguranca' | 'valorizacao' | 'exclusividade';

interface DiferencialItem {
    titulo: string;
    descricao: string;
    icon: ReactNode;
    metrica: string;
    subtexto: string;
}

type DiferenciaisData = {
    [key in DiferencialKey]: DiferencialItem;
};

export default function SecaoExcelenciaIpe() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<DiferencialKey>("seguranca");

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        const section = document.getElementById("secao-excelencia");
        if (section) observer.observe(section);

        return () => observer.disconnect();
    }, []);

    const diferenciais: DiferenciaisData = {
        seguranca: {
            titulo: "Segurança jurídica absoluta",
            descricao: "Análise detalhada da documentação e certidões com verificação de 37 pontos críticos antes de cada negociação. Histórico de zero contestações legais em 10 anos.",
            icon: <Shield className="w-6 h-6" />,
            metrica: "100%",
            subtexto: "das transações com segurança completa"
        },
        valorizacao: {
            titulo: "Potencial de investimento elevado",
            descricao: "Seleção criteriosa de imóveis em áreas estratégicas de Guararema com histórico de valorização consistente. Análise de tendências urbanísticas e planos diretores.",
            icon: <TrendingUp className="w-6 h-6" />,
            metrica: "8,5%",
            subtexto: "valorização anual média nas áreas premium"
        },
        exclusividade: {
            titulo: "Portfólio exclusivo e curado",
            descricao: "Acesso a propriedades não disponíveis no mercado amplo. Relações consolidadas com proprietários locais e empreendedores de alto padrão.",
            icon: <MapPin className="w-6 h-6" />,
            metrica: "43%",
            subtexto: "do nosso catálogo em oferta exclusiva"
        }
    };

    // Função auxiliar tipada para acessar os diferenciais com segurança
    const getDiferencial = (key: DiferencialKey): DiferencialItem => {
        return diferenciais[key];
    };

    // Array tipado para as iterações
    const diferencialKeys: DiferencialKey[] = ['seguranca', 'valorizacao', 'exclusividade'];

    return (
        <section
            id="secao-excelencia"
            className={`relative w-full py-20 md:py-28 overflow-hidden ${montserrat.variable} font-sans`}
        >
            {/* Background refinado */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-slate-50 to-white z-0" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-amber-50/20 to-transparent z-0" />
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-100/30 filter blur-3xl z-0" />

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                {/* Indicador de credibilidade */}
                <div
                    className={`inline-flex items-center gap-2 mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <span className="h-px w-12 bg-amber-400"></span>
                    <span className="text-amber-800 text-sm font-medium tracking-wider uppercase">Excelência reconhecida</span>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Área de conteúdo com animação sutil */}
                    <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-slate-800">
                            Expertise que <span className="text-amber-500 relative inline-block">
                                transforma
                                <span className="absolute -bottom-1 left-0 w-full h-1 bg-amber-300/60"></span>
                            </span> cada negociação
                        </h2>

                        <p className="text-lg text-slate-600 leading-relaxed font-light">
                            Na Ipê, elevamos a experiência imobiliária além do convencional. Nossa abordagem combina profundo conhecimento local, análise técnica rigorosa e atendimento verdadeiramente personalizado – garantindo segurança, valorização e exclusividade em cada etapa.
                        </p>

                        {/* Sistema de abas interativo */}
                        <div className="pt-4">
                            <div className="flex space-x-1 mb-8 border-b border-slate-200">
                                {diferencialKeys.map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={`px-4 py-3 text-sm font-medium transition-all relative ${activeTab === key
                                            ? "text-amber-600"
                                            : "text-slate-500 hover:text-slate-800"
                                            }`}
                                    >
                                        {getDiferencial(key).titulo}
                                        {activeTab === key && (
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500"></span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="min-h-[180px] relative">
                                {diferencialKeys.map((key) => (
                                    <div
                                        key={key}
                                        className={`transition-all duration-500 ${activeTab === key
                                            ? "opacity-100 translate-y-0 relative"
                                            : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
                                            }`}
                                    >
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="p-3 bg-amber-100 rounded-lg text-amber-600 flex-shrink-0">
                                                {getDiferencial(key).icon}
                                            </div>
                                            <div>
                                                <p className="text-slate-600">{getDiferencial(key).descricao}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-end gap-3 mt-6">
                                            <span className="text-3xl font-bold text-amber-500">{getDiferencial(key).metrica}</span>
                                            <span className="text-sm text-slate-600 pb-1">{getDiferencial(key).subtexto}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA premium */}
                        <div className="pt-6">
                            <a
                                href="/consultoria"
                                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-all focus:ring-2 focus:ring-slate-800 focus:ring-offset-2"
                            >
                                <span>Agendar consultoria personalizada</span>
                                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Composição visual de impacto */}
                    <div className={`relative transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] z-10">
                            <Image
                                src="/images/mirante.png"
                                alt="Mirante do Alto do Vale em Guararema"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 40vw"
                                priority
                            />

                            {/* Sobreposição refinada */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                            {/* Overlay informativo */}
                            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                                <h3 className="text-xl font-semibold mb-1">Alto do Vale</h3>
                                <p className="text-sm font-light text-slate-100">O setor exclusivo com maior valorização em 2024</p>

                                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm">
                                    <TrendingUp className="w-4 h-4 text-amber-300" />
                                    <span>12,7% valorização no último ano</span>
                                </div>
                            </div>
                        </div>

                        {/* Elemento visual adicional flutuante */}
                        <div className="absolute -bottom-10 -left-10 w-64 h-44 bg-white rounded-lg shadow-xl p-4 z-20 hidden lg:block">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="p-2 bg-amber-100 rounded-md text-amber-600 flex-shrink-0">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-slate-800">Segurança em números</h4>
                                    <p className="text-xs text-slate-500">Acompanhamento completo em cada etapa</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="bg-slate-50 p-2 rounded">
                                    <p className="text-xs text-slate-500">Transações</p>
                                    <p className="text-lg font-semibold text-slate-800">200+</p>
                                </div>
                                <div className="bg-slate-50 p-2 rounded">
                                    <p className="text-xs text-slate-500">Satisfação</p>
                                    <p className="text-lg font-semibold text-slate-800">98%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}