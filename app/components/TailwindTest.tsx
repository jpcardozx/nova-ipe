// Componente de teste para verificar se o Tailwind está funcionando
"use client";

import { useEffect, useState } from 'react';

export default function TailwindTest() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="p-4 m-4 bg-blue-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Teste do Tailwind CSS</h2>
            <p className="text-gray-700">Se você estiver vendo esta caixa com estilo, o Tailwind CSS está funcionando corretamente!</p>

            {/* Exemplos de classes Tailwind */}
            <div className="mt-4 flex gap-2 flex-wrap">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Botão Azul
                </button>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Botão Verde
                </button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Botão Vermelho
                </button>
            </div>

            {/* Exemplos de responsividade */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-purple-100 p-4 rounded">Item 1</div>
                <div className="bg-purple-100 p-4 rounded">Item 2</div>
                <div className="bg-purple-100 p-4 rounded">Item 3</div>
            </div>
        </div>
    );
}
