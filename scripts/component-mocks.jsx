/**
 * Este arquivo fornece mocks para todos os componentes que estão causando problemas no deploy
 * na Vercel. É usado somente durante o build e não afeta o funcionamento da aplicação.
 */

import React from 'react';

// Mocks básicos para os componentes de layout
export const NavBarMock = () => (
  <header className="w-full py-4 bg-white shadow-sm">
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold text-primary-600">Nova Ipê</div>
        <nav>
          <ul className="flex gap-4">
            <li>Home</li>
            <li>Imóveis</li>
            <li>Contato</li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
);

export const FooterMock = () => (
  <footer className="w-full py-8 bg-gray-900 text-white">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Nova Ipê</h3>
          <p>Imóveis de alto padrão em Guararema</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Contato</h3>
          <p>contato@novaipe.com.br</p>
          <p>(11) 9999-9999</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Social</h3>
          <div className="flex gap-4">
            <span>Facebook</span>
            <span>Instagram</span>
            <span>WhatsApp</span>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p>&copy; {new Date().getFullYear()} Nova Ipê Imobiliária. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
);

export const ValorMock = () => (
  <section className="py-16 bg-gray-100">
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Qualidade</h3>
          <p>Trabalhamos apenas com os melhores imóveis da região.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Transparência</h3>
          <p>Clareza e honestidade em todas as negociações.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Excelência</h3>
          <p>Atendimento personalizado em todos os detalhes.</p>
        </div>
      </div>
    </div>
  </section>
);

// Exporte os mocks com nomes padrão para substituir importações problemáticas
export default {
  NavBar: NavBarMock,
  Footer: FooterMock,
  Valor: ValorMock
};
