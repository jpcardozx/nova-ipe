import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Clock } from 'lucide-react';

export default function ProfessionalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <div>
                <div className="text-xl font-bold">Ipê Imóveis</div>
                <div className="text-sm text-gray-400">Guararema & Região</div>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Especialistas em imóveis em Guararema há 15 anos. 
              Mais de 500 imóveis vendidos e 400 famílias atendidas.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/ipeimoveis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/ipeimoveis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/comprar" className="text-gray-300 hover:text-white transition-colors">
                  Comprar Imóvel
                </Link>
              </li>
              <li>
                <Link href="/alugar" className="text-gray-300 hover:text-white transition-colors">
                  Alugar Imóvel
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="text-gray-300 hover:text-white transition-colors">
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-300 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-300 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nossos Serviços</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Compra e Venda de Imóveis</li>
              <li>Locação Residencial</li>
              <li>Avaliação Imobiliária</li>
              <li>Consultoria Imobiliária</li>
              <li>Documentação Completa</li>
              <li>Financiamento Imobiliário</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <a 
                    href="tel:(11)99999-9999" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    (11) 99999-9999
                  </a>
                  <p className="text-sm text-gray-400">WhatsApp disponível</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <a 
                  href="mailto:contato@ipeimoveis.com.br"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  contato@ipeimoveis.com.br
                </a>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>Rua Principal, 123</p>
                  <p>Centro - Guararema, SP</p>
                  <p>CEP: 08900-000</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>Segunda à Sexta: 8h às 18h</p>
                  <p>Sábado: 8h às 14h</p>
                  <p>Domingo: Plantão</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Ipê Imóveis. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacidade" className="text-gray-400 hover:text-white text-sm transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/termos" className="text-gray-400 hover:text-white text-sm transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}