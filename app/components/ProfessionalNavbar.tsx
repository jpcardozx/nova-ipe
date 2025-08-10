'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';

export default function ProfessionalNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/comprar', label: 'Comprar' },
    { href: '/alugar', label: 'Alugar' },
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/sobre', label: 'Sobre Nós' },
    { href: '/contato', label: 'Contato' },
  ];

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-green-800 text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-6">
            <a href="tel:(11)99999-9999" className="flex items-center hover:text-yellow-300 transition-colors">
              <Phone className="h-4 w-4 mr-1" />
              (11) 99999-9999
            </a>
            <a href="mailto:contato@ipeimoveis.com.br" className="flex items-center hover:text-yellow-300 transition-colors">
              <Mail className="h-4 w-4 mr-1" />
              contato@ipeimoveis.com.br
            </a>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>Guararema, SP - Atendimento Local</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">Ipê Imóveis</div>
                <div className="text-xs text-gray-600">Guararema & Região</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300 py-2 border-b-2 border-transparent hover:border-green-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <a
                href="tel:(11)99999-9999"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center space-x-2"
              >
                <Phone className="h-4 w-4" />
                <span>Ligar Agora</span>
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-700 hover:text-green-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <a
                  href="tel:(11)99999-9999"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold text-center transition-colors"
                >
                  📞 Ligar Agora
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}