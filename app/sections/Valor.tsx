"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Shield, TrendingUp, Key, ChevronRight } from "lucide-react";

// Fonte configurada com subset latino
const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-montserrat",
});

// Tipagem limpa
interface Diferencial {
    id: string;
    titulo: string;
    descricao: string;
    icon: any;
    metrica: string;
}

export default function SecaoExcelenciaIpe() {
    const [activeTab, setActiveTab] = useState<string>("seguranca");
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hovered, setHovered] = useState<string | null>(null);

    // Observação com threshold mais sensível
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Desconecta após ativação
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -100px 0px" }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Diferenciais atualizados com informações mais autênticas
    const diferenciais: Diferencial[] = [
        {
            id: "seguranca",
            titulo: "Conhecimento local",
            descricao: "Nossa equipe nasceu e cresceu em Guararema. Conhecemos cada rua, cada bairro e as particularidades que fazem cada região valorizar de forma diferente.",
            icon: <Shield className="w-5 h-5" />,
            metrica: "15 anos"
        },
        {
            id: "valorizacao",
            titulo: "Dados de mercado",
            descricao: "Mantemos o maior banco de dados de transações imobiliárias da região, com histórico de preços desde 2008 que nos permite avaliar seu imóvel com precisão.",
            icon: <TrendingUp className="w-5 h-5" />,
            metrica: "450+"
        },
        {
            id: "exclusividade",
            titulo: "Rede exclusiva",
            descricao: "Temos acesso a compradores e vendedores que não acessam os grandes portais. Muitas das melhores oportunidades em Guararema nunca são anunciadas publicamente.",
            icon: <Key className="w-5 h-5" />,
            metrica: "62%"
        }
    ];

    // Diferencial ativo
    const diferencialAtivo = diferenciais.find(d => d.id === activeTab) || diferenciais[0];

    return (
        <section
            ref={sectionRef}
            className={`bg-white py-16 md:py-24 overflow-hidden ${montserrat.variable}`}
        >
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                {/* Layout aprimorado para destacar a imagem vertical */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Coluna de texto - copy mais impactante e layout refinado */}
                    <div className={`lg:col-span-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                        }`}>
                        <div className="mb-10">
                            {/* Copy aprimorado com maior impacto e estrutura clara */}
                            <div className="border-l-4 border-amber-500 pl-4 mb-6">
                                <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                                    Conhecimento local que faz toda diferença
                                </h2>
                                <p className="text-amber-600 font-medium mt-1">
                                    A referência em imóveis em Guararema
                                </p>
                            </div>

                            <p className="text-lg text-gray-700 leading-relaxed">
                                Desde 2008, somos os guardiões da história imobiliária de <span className="font-semibold">Guararema</span>. Com raízes profundas na região,
                                nossa equipe não apenas acompanha o mercado — nós o moldamos. Por isso,
                                <span className="font-semibold"> 3 em cada 5 negociações</span> imobiliárias locais passam por nossas mãos.
                            </p>

                            <div className="mt-4 inline-flex items-center text-amber-700 font-medium cursor-pointer group">
                                <span>Conheça nossa história</span>
                                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>

                        {/* Seleção de diferenciais - design refinado e mais interativo */}
                        <div className="mb-6">
                            <div className="flex space-x-1 md:space-x-2 border-b border-gray-200">
                                {diferenciais.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        onMouseEnter={() => setHovered(item.id)}
                                        onMouseLeave={() => setHovered(null)}
                                        className={`pb-3 pt-1 px-4 relative text-base font-medium transition-all rounded-t-lg ${activeTab === item.id
                                            ? "text-amber-700 bg-amber-50"
                                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className="relative z-10">{item.titulo}</span>
                                        {activeTab === item.id && (
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600"></span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Conteúdo do diferencial - layout aprimorado */}
                        <div className="mb-10 bg-gray-50 rounded-xl p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="bg-amber-100 p-3 rounded-lg text-amber-700 flex-shrink-0 mt-1">
                                    {diferencialAtivo.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                        {diferencialAtivo.titulo}
                                    </h3>
                                    <p className="text-gray-600">
                                        {diferencialAtivo.descricao}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-baseline gap-3 border-t border-gray-200 pt-4">
                                <span className="text-3xl font-bold text-amber-700">
                                    {diferencialAtivo.metrica}
                                </span>

                                {activeTab === "seguranca" && (
                                    <span className="text-gray-700">atuando exclusivamente em Guararema</span>
                                )}

                                {activeTab === "valorizacao" && (
                                    <span className="text-gray-700">imóveis vendidos nos últimos 12 meses</span>
                                )}

                                {activeTab === "exclusividade" && (
                                    <span className="text-gray-700">dos nossos imóveis não estão em portais</span>
                                )}
                            </div>
                        </div>

                        {/* Banner CTA redesenhado - mais impactante visualmente */}
                        <div className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl p-6 shadow-lg relative overflow-hidden">
                            {/* Elementos decorativos */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-400/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Descubra o verdadeiro potencial do seu imóvel
                                </h3>
                                <p className="text-amber-50 mb-4">
                                    Solicite uma avaliação estratégica gratuita e receba um relatório detalhado com o valor real de mercado e oportunidades de otimização.
                                </p>
                                <a
                                    href="/avaliacao-gratuita"
                                    className="inline-block bg-white text-amber-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Solicitar avaliação gratuita
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Coluna da imagem - redesenhada para valorizar a imagem vertical */}
                    <div className={`lg:col-span-6 relative transition-all duration-700 delay-100 h-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}>
                        {/* Container que permite a imagem vertical respirar */}
                        <div className="relative h-[500px] md:h-[600px] lg:h-[720px] rounded-xl overflow-hidden shadow-xl">
                            <Image
                                src="/images/predioIpe.png"
                                alt="Sede da Ipê Imobiliária em Guararema"
                                fill
                                className="object-cover object-center"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 50vw"
                                priority
                            />

                            {/* Overlay sutil para melhorar legibilidade do badge */}
                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>

                        {/* Badge reposicionado e redesenhado */}
                        <div className="absolute bottom-6 right-6 bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 backdrop-blur-sm">
                            <div className="bg-amber-100 p-2 rounded-full">
                                <Image
                                    src="/images/ipeLogo.png"
                                    alt="Ipê Imobiliária"
                                    width={36}
                                    height={36}
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">CRECI 24.588-J</p>
                                <p className="text-xs text-gray-500">Excelência imobiliária desde 2008</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}