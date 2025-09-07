'use client';

import {
    MapPin,
    Phone,
    ExternalLink,
    Mail,
    Instagram,
    Facebook,
    Linkedin,
    Twitter,
    Clock,
    CheckCircle,
    ChevronRight,
    Home,
    Award,
    ArrowUp
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Links para navegação do rodapé
const footerLinks = [
    {
        title: "I M Ó V E I S",
        links: [
            { name: "Casas à venda", href: "/" },
            { name: "Apartamentos", href: "/comprar" },
            { name: "Imóveis para alugar", href: "/alugar" },
            { name: "Terrenos e lotes", href: "/bairros" },
            { name: "Imóveis comerciais", href: "/contato" }
        ]
    },
    {
        title: "S E R V I Ç O S",
        links: [
            { name: "Avaliação de imóveis", href: "/sobre" },
            { name: "Documentação", href: "/equipe" },
            { name: "Financiamento", href: "/avaliacoes" },
            { name: "Consultoria imobiliária", href: "/carreira" },
        ]
    },
    {
        title: "I N S T I T U C I O N A L",
        links: [
            { name: "Sobre a Ipê", href: "/servicos/compra-venda" },
            { name: "Nossa equipe", href: "/servicos/consultoria" },
            { name: "Casos de sucesso", href: "/servicos/avaliacao" },
            { name: "Trabalhe conosco", href: "/servicos/documentacao" }
        ]
    }
];

// Componente de link com animação
const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <span
        className="group flex items-center text-gray-300 hover:text-amber-400 transition-colors duration-300 cursor-pointer hover:underline underline-offset-2"
    >
        <ChevronRight className="w-3 h-3 mr-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        {children}
    </span>
);

// Componente de ícone social
const SocialIcon = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-amber-500 hover:scale-110 transition-all duration-300"
    >
        {icon}
    </a>
);

export default function FooterAprimorado() {
    const [year] = useState(new Date().getFullYear());
    const pathname = usePathname();

    // Estado para controle de scroll-to-top
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    // Não mostra scroll to top em páginas do studio/admin
    const isStudioPage = pathname?.startsWith('/studio') || pathname?.startsWith('/admin');

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const footerHeight = 400; // Altura estimada do footer
            
            // Mostra o botão quando o usuário scrollou mais de 500px
            // mas esconde quando está próximo do final da página (no footer)
            const nearFooter = scrollY + windowHeight > documentHeight - footerHeight;
            setShowScrollToTop(scrollY > 500 && !nearFooter);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Se estiver em página do studio, não renderiza o footer
    if (isStudioPage) {
        return null;
    }

    return (
        <footer className="relative w-full bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-hidden font-body">            {/* Fundo com textura e gradiente */}
            <div className="absolute inset-0">
                <div className="relative w-full h-full">
                    <Image
                        src="/images/wood-pattern.png"
                        alt="Textura de fundo do rodapé"
                        fill
                        className="object-cover object-center opacity-10"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-950/90" />
            </div>

            {/* Detalhe decorativo superior */}
            <div className="relative z-10">
                <div className="h-1.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" />

                {/* Conteúdo principal do rodapé */}
                <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
                    {/* Seção superior */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
                        {/* Coluna de informações da empresa */}
                        <div className="lg:col-span-2">
                            <div
                                className="animate-fade-in-up"
                            >
                                <Image
                                    src="/images/writtenLogo.png"
                                    alt="Logo Ipê Imóveis"
                                    width={200}
                                    height={100}
                                    className="mb-6"
                                />                                <p className="text-gray-300 mb-6 leading-relaxed max-w-md text-body">
                                    Há mais de 15 anos realizando sonhos em Guararema. Oferecemos atendimento personalizado em compra, venda, locação e avaliação de imóveis, com conhecimento profundo do mercado local.
                                </p>

                                <div className="flex flex-col gap-4 mb-8">
                                    <div className="flex items-start">
                                        <MapPin className="w-5 h-5 text-amber-400 mr-3 mt-0.5" />
                                        <div>                                            <h4 className="medium-text text-white text-body">Nosso Endereço</h4>
                                            <address className="text-gray-300 not-italic text-body-small">
                                                Praça Nove de Julho, 65<br />
                                                Centro, Guararema - SP, 08900-000
                                            </address>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <Clock className="w-5 h-5 text-amber-400 mr-3 mt-0.5" />
                                        <div>                                            <h4 className="medium-text text-white text-body">Horário de Atendimento</h4>
                                            <p className="text-gray-300 text-body-small">
                                                Segunda a Sexta: 8:30 - 18:00<br />
                                                Sábado: 9:00 - 13:00
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <SocialIcon
                                        href="https://instagram.com/ipe_imoveis_guararema"
                                        icon={<Instagram className="w-5 h-5" />}
                                        label="Instagram da Ipê Imóveis"
                                    />
                                    <SocialIcon
                                        href="https://facebook.com/ipe.imoveis"
                                        icon={<Facebook className="w-5 h-5" />}
                                        label="Facebook da Ipê Imóveis"
                                    />
                                    <SocialIcon
                                        href="https://linkedin.com/company/ipe.imoveis"
                                        icon={<Linkedin className="w-5 h-5" />}
                                        label="LinkedIn da Ipê Imóveis"
                                    />
                                    <SocialIcon
                                        href="https://wa.me/5511981845016"
                                        icon={<Phone className="w-5 h-5" />}
                                        label="WhatsApp da Ipê Imóveis"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Colunas de links */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {footerLinks.map((column, idx) => (
                                <div
                                    key={column.title}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                >                            <h4 className="text-amber-400 semibold-text mb-6 pb-2 border-b border-gray-700 text-heading-3">
                                        {column.title}
                                    </h4>
                                    <ul className="space-y-3">
                                        {column.links.map((link) => (
                                            <li key={link.name}>
                                                <FooterLink href={link.href}>
                                                    {link.name}
                                                </FooterLink>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter e confiança */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-gray-800 pt-12 pb-6">
                        {/* Newsletter */}
                        <div
                            className="animate-fade-in-left"
                        >                            <h4 className="text-amber-400 bold mb-4 text-heading-2">
                                Novidades Selecionadas
                            </h4>
                            <p className="text-gray-300 mb-6 text-body">
                                Receba informações sobre as melhores oportunidades e novidades da Ipê. Inscreva-se e fique por dentro das novidades do mercado imobiliário em Guararema.
                            </p>
                            <form className="flex gap-2 max-w-md">
                                <input
                                    type="email"
                                    placeholder="Seu melhor e-mail"
                                    className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-md flex-grow focus:outline-none focus:border-amber-400"
                                    aria-label="Seu endereço de email"
                                    required
                                />                                <button
                                    type="submit"
                                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                                >
                                    Inscrever-se
                                </button>
                            </form>
                        </div>

                        {/* Selos de confiança */}
                        <div
                            className="flex flex-col animate-fade-in-right"
                        >
                            <h4 className="text-white font-semibold mb-4 text-xl">
                                Confiança e credibilidade
                            </h4>                            <div className="grid grid-cols-2 gap-4">                                <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
                                <Award className="text-amber-400 w-6 h-6" />
                                <div>                                        <h5 className="medium-text text-white text-body-small">CRECI-SP</h5>
                                    <p className="text-gray-400 text-caption">Corretores habilitados</p>
                                </div>
                            </div>                                <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
                                    <CheckCircle className="text-amber-400 w-6 h-6" />
                                    <div>
                                        <h5 className="font-medium text-white text-sm">Experiência</h5>
                                        <p className="text-gray-400 text-xs">15+ anos no mercado</p>
                                    </div>
                                </div>                                <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
                                    <Home className="text-amber-400 w-6 h-6" />
                                    <div>
                                        <h5 className="font-medium text-white text-sm">Imóveis</h5>
                                        <p className="text-gray-400 text-xs">500+ negócios realizados</p>
                                    </div>
                                </div>                                <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
                                    <Clock className="text-amber-400 w-6 h-6" />
                                    <div>
                                        <h5 className="font-medium text-white text-sm">Atendimento</h5>
                                        <p className="text-gray-400 text-xs">Segunda a sábado</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rodapé final */}
                    <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                            <p className="text-gray-400 text-sm text-center md:text-left">
                                © {year} Ipê Imóveis. Todos os direitos reservados. CRECI-SP 12.345-J.
                            </p>
                            {/* Developer Credit - S-Tier Elegant Design */}
                            <div className="group relative flex items-center gap-1.5 opacity-50 hover:opacity-100 transition-all duration-700 ease-out">
                                {/* Subtle glow effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-amber-400/0 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                {/* Left decorative dot */}
                                <div className="relative w-1 h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full group-hover:scale-150 group-hover:shadow-amber-400/50 group-hover:shadow-md transition-all duration-500 ease-out"></div>

                                {/* Main text with elegant typography */}
                                <span className="relative text-xs text-gray-500 group-hover:text-gray-300 transition-colors duration-500 font-mono tracking-wider leading-relaxed">
                                    desenvolvido por{' '}
                                    <a
                                        href="https://github.com/jpcardozx"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative text-amber-400/90 hover:text-amber-300 transition-all duration-300 font-medium tracking-normal group-hover:tracking-wide"
                                    >
                                        <span className="relative z-10">@jpcardozx</span>
                                        {/* Subtle underline effect */}
                                        <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-amber-400 to-amber-500 group-hover:w-full transition-all duration-500 ease-out"></span>
                                    </a>
                                </span>

                                {/* Right decorative dot */}
                                <div className="relative w-1 h-1 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full group-hover:scale-150 group-hover:shadow-amber-400/50 group-hover:shadow-md transition-all duration-500 ease-out delay-75"></div>
                            </div>
                        </div>
                        <div className="flex gap-6 text-sm items-center mr-20">
                            <Link href="/privacidade" className="text-gray-400 hover:text-white transition-colors">
                                Política de Privacidade
                            </Link>
                            <Link href="/termos" className="text-gray-400 hover:text-white transition-colors">
                                Termos de Uso
                            </Link>
                            <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                                Cookies
                            </Link>

                            {/* Separador discreto */}
                            <div className="w-px h-4 bg-gray-600"></div>

                            {/* Botão de Login para Sócios - Discreto e Elegante */}
                            <Link
                                href="/login"
                                className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-800/50 border border-gray-700/50 hover:border-amber-400/50 hover:bg-gray-800/80 transition-all duration-300 opacity-75 hover:opacity-100"
                                aria-label="Acesso exclusivo para sócios e associados"
                            >
                                {/* Ícone de chave discreto */}
                                <div className="w-3 h-3 relative">
                                    <div className="w-2 h-2 border border-gray-500 group-hover:border-amber-400 rounded-full transition-colors duration-300"></div>
                                    <div className="absolute top-1 left-1.5 w-1.5 h-px bg-gray-500 group-hover:bg-amber-400 transition-colors duration-300"></div>
                                </div>

                                {/* Texto elegante */}
                                <span className="text-xs text-gray-500 group-hover:text-amber-400 transition-colors duration-300 font-medium tracking-wide">
                                    Sócios
                                </span>

                                {/* Indicador sutil de acesso */}
                                <div className="w-1 h-1 bg-amber-400/60 rounded-full group-hover:bg-amber-400 group-hover:scale-125 transition-all duration-300"></div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botão de voltar ao topo - não mostra em páginas do studio */}
            {!isStudioPage && (
                <button
                    onClick={scrollToTop}
                    className={cn(
                        "fixed bottom-8 right-8 w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg hover:bg-amber-600 hover:scale-110 transition-all z-30",
                        !showScrollToTop && "pointer-events-none opacity-0"
                    )}
                    aria-label="Voltar ao topo"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            )}
        </footer>
    );
}