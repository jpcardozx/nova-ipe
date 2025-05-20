'use client';

import ClientSafeTailwindDiagnostic from '../components/ClientSafeTailwindDiagnostic';

/**
 * Página de Diagnóstico do Tailwind
 * 
 * Esta página fornece ferramentas avançadas para diagnóstico e correção
 * de problemas com a integração do Tailwind CSS v4 e Next.js 15.
 */
export default function TailwindDiagnosticPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Diagnóstico do Tailwind CSS</h1>
        <p className="text-gray-600">
          Análise completa da integração do Tailwind CSS v4 com Next.js 15
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="space-y-8">
            <section>
              <ClientSafeTailwindDiagnostic />
            </section>
            
            <section>
              <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 p-4">
                  <h2 className="text-lg font-semibold text-gray-800">Teste Visual do Tailwind CSS</h2>
                  <p className="text-sm text-gray-600">
                    Esta seção mostra se as classes do Tailwind estão sendo aplicadas corretamente
                  </p>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium mb-2">Cores e Espaçamento</h3>
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded"></div>
                        <div className="w-8 h-8 bg-green-500 rounded"></div>
                        <div className="w-8 h-8 bg-red-500 rounded"></div>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium mb-2">Tipografia</h3>
                      <p className="text-sm font-light">Text Small Light</p>
                      <p className="text-base font-normal">Text Base Normal</p>
                      <p className="text-lg font-bold">Text Large Bold</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-md sticky top-4">
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800">Guia Rápido</h2>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Problemas Comuns:</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li>Diretivas incorretas no globals.css</li>
                  <li>Configuração PostCSS incompatível</li>
                  <li>Dependências em versões conflitantes</li>
                  <li>Importações CSS duplicadas</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Sintaxe Correta para v4:</h3>
                <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                  <div className="text-green-600">@import "tailwindcss/preflight";</div>
                  <div className="text-green-600">@tailwind utilities;</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Soluções:</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li>Execute o script <span className="text-blue-600 font-semibold">fix-tailwind-v4.ps1</span></li>
                  <li>Verifique o arquivo <span className="text-blue-600 font-semibold">TAILWIND-V4-GUIA.md</span></li>
                  <li>Limpe o cache: <span className="font-mono text-xs bg-gray-200 px-1 py-0.5 rounded">npx rimraf .next</span></li>
                </ul>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Links úteis:</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <a href="https://tailwindcss.com/docs" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                      Documentação do Tailwind CSS v4
                    </a>
                  </li>
                  <li>
                    <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                      Documentação do Next.js 15
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
