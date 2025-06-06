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
import { motion, useScroll, useTransform } from "framer-motion";
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
            { name: "Administração predial", href: "/blog" }
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
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-amber-500 transition-colors duration-300"
    >
        {icon}
    </motion.a>
);

export default function FooterAprimorado() {
    const [year] = useState(new Date().getFullYear());
    const { scrollYProgress } = useScroll({ layoutEffect: false });
    const opacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1]);

    // Estado para controle de scroll-to-top
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollToTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }; return (
        <footer className="relative w-full bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-hidden font-body">            {/* Fundo com textura e gradiente */}
            <div className="absolute inset-0">
                <div className="relative w-full h-full">
                    <Image
                        src="/images/wood-pattern.svg"
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
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
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
                                        href="https://instagram.com/ipe.imoveis"
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
                            </motion.div>
                        </div>

                        {/* Colunas de links */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {footerLinks.map((column, idx) => (
                                <motion.div
                                    key={column.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
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
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter e confiança */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-gray-800 pt-12 pb-6">
                        {/* Newsletter */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
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
                        </motion.div>

                        {/* Selos de confiança */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col"
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
                        </motion.div>
                    </div>

                    {/* Rodapé final */}
                    <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm text-center md:text-left">
                            © {year} Ipê Imóveis. Todos os direitos reservados. CRECI-SP 12.345-J.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link href="/privacidade" className="text-gray-400 hover:text-white transition-colors">
                                Política de Privacidade
                            </Link>
                            <Link href="/termos" className="text-gray-400 hover:text-white transition-colors">
                                Termos de Uso
                            </Link>
                            <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botão de voltar ao topo */}
            <motion.button
                style={{ opacity }}
                onClick={scrollToTop}
                className={cn(
                    "fixed bottom-8 right-8 w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg hover:bg-amber-600 transition-all z-50",
                    !showScrollToTop && "pointer-events-none opacity-0"
                )}
                aria-label="Voltar ao topo"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <ArrowUp className="w-5 h-5" />
            </motion.button>
        </footer>
    );
}