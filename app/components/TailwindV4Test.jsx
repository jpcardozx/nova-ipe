'use client';

/**
 * TailwindV4Test
 * 
 * Componente para testar visualmente a aplicação de classes do Tailwind CSS v4
 */
export default function TailwindV4Test() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-blue-500 text-white rounded">
          bg-blue-500
        </div>
        <div className="p-4 bg-green-500 text-white rounded">
          bg-green-500
        </div>
        <div className="p-4 bg-red-500 text-white rounded">
          bg-red-500
        </div>
        <div className="p-4 bg-yellow-500 text-white rounded">
          bg-yellow-500
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 border border-gray-300 rounded">
          border + rounded
        </div>
        <div className="p-4 shadow-lg bg-white">
          shadow-lg
        </div>
        <div className="p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
          gradient
        </div>
        <div className="p-4 hover:bg-purple-500 border border-purple-500 text-purple-500 hover:text-white transition-colors">
          hover:bg-purple-500
        </div>
      </div>
      
      <div className="bg-white p-4 rounded border border-gray-200">
        <div className="text-lg font-bold text-center">Teste de Tipografia</div>
        <p className="text-sm text-gray-600 mt-2">
          Este é um parágrafo de texto para testar as propriedades tipográficas do Tailwind CSS.
        </p>
        <div className="flex justify-center space-x-2 mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Botão Primário
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
            Botão Secundário
          </button>
        </div>
      </div>
    </div>
  );
}
