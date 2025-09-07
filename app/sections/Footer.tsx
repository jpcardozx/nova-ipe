"use client";

import { MapPin, Phone, ExternalLink, Mail, Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [year, setYear] = useState(2025);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        const elements = document.querySelectorAll(".footer-animate");
        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                entries.forEach((entry: IntersectionObserverEntry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("footer-visible");
                    }
                });
            },
            { threshold: 0.1 }
        );

        elements.forEach((el: Element) => observer.observe(el));
        return () => elements.forEach((el: Element) => observer.unobserve(el));
    }, []); return (
        <footer className="relative w-full bg-[#0D1F2D] text-[#F7D7A3] overflow-hidden font-body">
            {/* Fundo com textura e gradiente */}
            <div className="absolute inset-0">
                <div className="relative w-full h-full">
                    <Image
                        src="/images/black-felt.png"
                        alt="Textura de fundo do rodapé"
                        fill
                        className="object-cover object-center opacity-60"
                        loading="lazy"
                        sizes="100vw"
                    />
                </div>
                <div className="absolute inset-0 bg-[#0D1F2D]/80" />
            </div>


            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12">
                <div className="footer-animate opacity-0 translate-y-4 transition-all duration-700 ease-out text-center md:text-left max-w-xl">
                    <Image
                        src="/images/writtenLogo.png"
                        alt="Logo Ipê Imóveis"
                        width={230}
                        height={120}
                        className="mx-auto md:mx-0 object-contain"
                    />                    <p className="text-body-small md:text-body text-[#F7D7A3] mt-4 thin-text leading-relaxed">
                        Consultoria estratégica em investimentos imobiliários com foco em ROI e valorização de ativos.
                    </p>

                    <div className="mt-6 flex justify-center md:justify-start">                        <a
                        href="https://wa.me/5511981845016"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#FFAD43] text-[#0D1F2D] hover:bg-[#e89c36] transition-all text-sm font-medium shadow-md hover:shadow-lg"
                    >
                        Análise gratuita de investimento
                        <ExternalLink className="w-4 h-4" />
                    </a>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/10 pt-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
                    {/* Coluna 1 */}
                    <div className="footer-animate opacity-0 translate-y-4 transition-all duration-700">                        <h4 className="text-[#FFAD43] text-caption uppercase mb-4 tracking-widest semibold-text">Oportunidades de Investimento</h4>
                        <ul className="space-y-3">
                            {["Propriedades com alto ROI", "Imóveis para renda", "Áreas em valorização", "Consultoria financeira", "Relatórios de mercado"].map((text, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={`/${text.toLowerCase().replace(/\s+/g, "-")}`}
                                        className="hover:text-[#FFAD43] transition-colors"
                                    >
                                        {text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Coluna 2 */}
                    <div className="footer-animate opacity-0 translate-y-4 transition-all duration-700 delay-100">
                        <h4 className="text-[#FFAD43] text-xs uppercase mb-4 tracking-widest font-semibold">Localização</h4>
                        <div className="flex gap-3 mb-4">
                            <MapPin className="w-5 h-5 text-[#FFAD43]" />
                            <p>
                                Praça 9 de Julho, 65 <br />
                                Centro, Guararema - SP
                            </p>
                        </div>
                        <div
                            className={`relative w-full h-48 rounded-md overflow-hidden ${!mapLoaded ? "bg-[#F7D7A3]/10" : ""
                                }`}
                            onClick={() => setMapLoaded(true)}
                        >
                            {!mapLoaded ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-center text-[#F7D7A3] text-sm">
                                    <MapPin className="w-8 h-8 text-[#FFAD43]" />
                                    <p className="mt-2">Clique para carregar o mapa</p>
                                </div>
                            ) : (
                                <iframe
                                    className="w-full h-full border-0"
                                    loading="lazy"
                                    title="Mapa"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.319508788956!2d-46.04293482461033!3d-23.520388259330564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce89bce85031d5%3A0xd5e4f7a2b29ef2c4!2sPra%C3%A7a%209%20de%20Julho%2C%2065%20-%20Centro%2C%20Guararema%20-%20SP%2C%2008990-000!5e0!3m2!1spt-BR!2sbr!4v1712119568911!5m2!1spt-BR!2sbr"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            )}
                        </div>
                    </div>

                    {/* Coluna 3 */}
                    <div className="footer-animate opacity-0 translate-y-4 transition-all duration-700 delay-200">
                        <h4 className="text-[#FFAD43] text-xs uppercase mb-4 tracking-widest font-semibold">Contato</h4>
                        <ul className="space-y-3">
                            {[
                                { nome: "WhatsApp", tel: "21990051961" },
                            ].map((contato, idx) => (
                                <li key={idx}>
                                    <a
                                        href={`tel:+55${contato.tel}`}
                                        className="flex items-center gap-2 hover:text-[#FFAD43] transition-colors"
                                    >
                                        <Phone className="w-4 h-4 text-[#FFAD43]" />
                                        ({contato.tel.slice(0, 2)}) {contato.tel.slice(2, 7)}-{contato.tel.slice(7)} — {contato.nome}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-[#F7D7A3]/60">
                © {year} Ipê Imóveis • Desenvolvido por{" "}
                <a
                    href="https://github.com/jpcardozx"
                    target="_blank"
                    className="hover:text-[#FFAD43] transition-colors"
                >
                    @jpcardozx
                </a>
            </div>

            <style>{`
        .footer-animate {
          transition-property: opacity, transform;
        }
        .footer-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
        </footer>
    );
}
