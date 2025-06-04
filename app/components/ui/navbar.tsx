'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from './button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
            }`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className={`text-2xl font-semibold ${isScrolled ? 'text-neutral-900' : 'text-white'
                        }`}>
                        Ipê
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink href="/comprar" isScrolled={isScrolled}>Comprar</NavLink>
                        <NavLink href="/alugar" isScrolled={isScrolled}>Alugar</NavLink>
                        <NavLink href="/lancamentos" isScrolled={isScrolled}>Lançamentos</NavLink>
                        <Button variant={isScrolled ? 'default' : 'outline'} className={
                            isScrolled
                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                : 'border-white text-white hover:bg-white hover:text-neutral-900'
                        }>
                            Contato
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className={isScrolled ? 'text-neutral-900' : 'text-white'} />
                        ) : (
                            <Menu className={isScrolled ? 'text-neutral-900' : 'text-white'} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4">
                        <div className="flex flex-col space-y-4 px-4">
                            <MobileNavLink href="/comprar">Comprar</MobileNavLink>
                            <MobileNavLink href="/alugar">Alugar</MobileNavLink>
                            <MobileNavLink href="/lancamentos">Lançamentos</MobileNavLink>
                            <Button className="w-full bg-primary-600 text-white hover:bg-primary-700">
                                Contato
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

const NavLink = ({ href, children, isScrolled }: { href: string; children: React.ReactNode; isScrolled: boolean }) => (
    <Link
        href={href}
        className={`text-sm font-medium hover:opacity-80 transition-colors ${isScrolled ? 'text-neutral-900' : 'text-white'
            }`}
    >
        {children}
    </Link>
);

const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
        href={href}
        className="block text-neutral-900 text-sm font-medium hover:text-primary-600 transition-colors"
    >
        {children}
    </Link>
);

export default Navbar;
