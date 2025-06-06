"use client"

import Image from "next/image"
import Link from "next/link"

const links = [
    { label: "Início", href: "/" },
    { label: "Comprar", href: "/comprar" },
    { label: "Alugar", href: "/alugar" },
    { label: "Contato", href: "#contato" },
]

export default function CriticalNavBar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/images/logo.png"
                            alt="Nova IPE"
                            width={120}
                            height={40}
                            className="h-8 w-auto"
                            priority
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button className="text-gray-700 hover:text-emerald-600">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
