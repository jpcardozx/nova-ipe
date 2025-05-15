'use client';

import ImageFixDemo from '../components/ImageFixDemo';
import { useState } from 'react';

export default function FixedImagesPage() {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8 bg-white shadow-md rounded-lg p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Solução para Imagens do Sanity</h1>
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        {showInfo ? 'Ocultar Explicação' : 'Ver Explicação'}
                    </button>
                </div>

                {showInfo && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-md">
                        <h2 className="text-lg font-semibold mb-2">Como a Solução Funciona:</h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>
                                <strong>Problema:</strong> As imagens do Sanity perdem suas referências de asset durante a
                                serialização entre o servidor e o cliente no Next.js.
                            </li>
                            <li>
                                <strong>Solução:</strong> Implementamos a função <code>fixSanityImageReferences</code> que
                                processa cada objeto de imagem para garantir que suas propriedades sejam serializáveis.
                            </li>
                            <li>
                                <strong>EnhancedImage:</strong> Desenvolvemos um componente robusto que lida com diferentes
                                formatos de imagem e extrai URLs mesmo quando a estrutura está incompleta.
                            </li>
                            <li>
                                <strong>URL Fallback:</strong> Implementamos uma lógica para reconstruir URLs do Sanity diretamente
                                a partir da referência de asset quando necessário.
                            </li>
                        </ol>

                        <h3 className="text-md font-semibold mt-4 mb-2">Implementação:</h3>
                        <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
                            {`// Processar objeto de imagem antes de passar ao componente
const fixedImage = fixSanityImageReferences(imovel.imagem);

// Uso do componente melhorado 
<EnhancedImage
  image={fixedImage}
  alt={imovel.titulo}
  fill
/>`}
                        </pre>
                    </div>
                )}
            </div>

            {/* Componente de demonstração */}
            <ImageFixDemo />
        </div>
    );
}
