// Componente de teste para verificar se o Tailwind v4 está funcionando
"use client";

import { useState } from 'react';

export default function TailwindV4Test() {
    const [activeTab, setActiveTab] = useState('basic');

    return (
        <div className="p-4 m-4 bg-blue-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Teste do Tailwind CSS v4</h2>

            <div className="border-b border-gray-200 mb-4">
                <nav className="flex -mb-px">
                    <button
                        onClick={() => setActiveTab('basic')}
                        className={`py-2 px-4 text-sm font-medium ${activeTab === 'basic'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Elementos Básicos
                    </button>
                    <button
                        onClick={() => setActiveTab('colors')}
                        className={`ml-4 py-2 px-4 text-sm font-medium ${activeTab === 'colors'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Cores
                    </button>
                    <button
                        onClick={() => setActiveTab('layout')}
                        className={`ml-4 py-2 px-4 text-sm font-medium ${activeTab === 'layout'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Layout
                    </button>
                    <button
                        onClick={() => setActiveTab('custom')}
                        className={`ml-4 py-2 px-4 text-sm font-medium ${activeTab === 'custom'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Classes Customizadas
                    </button>
                </nav>
            </div>

            {activeTab === 'basic' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Tipografia e Botões</h3>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">Texto pequeno</p>
                        <p className="text-base text-gray-800">Texto normal</p>
                        <p className="text-lg text-gray-900">Texto grande</p>
                        <p className="text-xl font-bold">Texto extra grande e negrito</p>
                    </div>

                    <div className="space-x-2">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
                            Botão Padrão
                        </button>
                        <button className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-400 px-4 py-2 rounded">
                            Botão Secundário
                        </button>
                    </div>

                    <div className="p-4 border rounded-lg bg-white">
                        <p className="mb-2">Card com borda e arredondamento</p>
                        <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                    </div>
                </div>
            )}

            {activeTab === 'colors' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Paleta de Cores</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="p-4 bg-blue-500 text-white text-center rounded">blue-500</div>
                        <div className="p-4 bg-red-500 text-white text-center rounded">red-500</div>
                        <div className="p-4 bg-green-500 text-white text-center rounded">green-500</div>
                        <div className="p-4 bg-yellow-500 text-white text-center rounded">yellow-500</div>
                        <div className="p-4 bg-purple-500 text-white text-center rounded">purple-500</div>
                        <div className="p-4 bg-pink-500 text-white text-center rounded">pink-500</div>
                        <div className="p-4 bg-indigo-500 text-white text-center rounded">indigo-500</div>
                        <div className="p-4 bg-gray-500 text-white text-center rounded">gray-500</div>
                    </div>

                    <div className="space-y-2">
                        <div className="h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded"></div>
                        <div className="h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                        <div className="h-8 bg-gradient-to-r from-yellow-500 to-red-500 rounded"></div>
                    </div>
                </div>
            )}

            {activeTab === 'layout' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Layout e Espaçamento</h3>

                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                        <div className="flex-1 p-4 bg-gray-100 rounded">
                            Coluna 1
                        </div>
                        <div className="flex-1 p-4 bg-gray-200 rounded">
                            Coluna 2
                        </div>
                        <div className="flex-1 p-4 bg-gray-300 rounded">
                            Coluna 3
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <div className="p-3 bg-blue-100 rounded">Item 1</div>
                        <div className="p-3 bg-blue-200 rounded">Item 2</div>
                        <div className="p-3 bg-blue-300 rounded">Item 3</div>
                        <div className="p-3 bg-blue-400 rounded">Item 4</div>
                        <div className="p-3 bg-blue-100 rounded">Item 5</div>
                        <div className="p-3 bg-blue-200 rounded">Item 6</div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                        <div>Alinhado à esquerda</div>
                        <div>Centralizado</div>
                        <div>Alinhado à direita</div>
                    </div>
                </div>
            )}

            {activeTab === 'custom' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Classes Customizadas (tailwind-compat.css)</h3>

                    <div className="space-x-2 mb-4">
                        <button className="btn btn-primary">
                            Botão Primário
                        </button>
                        <button className="btn btn-secondary">
                            Botão Secundário
                        </button>
                    </div>

                    <div className="card">
                        <h4 className="text-lg font-medium mb-2">Card Personalizado</h4>
                        <p className="text-gray-600">Este card usa a classe customizada 'card' definida no arquivo tailwind-compat.css</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded">
                        <p className="mb-2">A seguir estão classes customizadas:</p>
                        <ul className="list-disc pl-5 text-sm">
                            <li>.btn - Estilo básico de botão</li>
                            <li>.btn-primary - Botão primário azul</li>
                            <li>.btn-secondary - Botão secundário cinza</li>
                            <li>.card - Container com sombra e cantos arredondados</li>
                            <li>.tailwind-v4-fix - Correções específicas para o Tailwind v4</li>
                        </ul>
                    </div>
                </div>
            )}

            <div className="mt-8 pt-4 border-t text-sm text-gray-500">
                <p>
                    Status: ✅ Se você estiver vendo esta caixa estilizada corretamente, o Tailwind v4 está funcionando!
                </p>
                <p>
                    Versão do Tailwind: <strong>4.x</strong> - Usando <code>@import "tailwindcss/preflight"</code> em vez de <code>@tailwind base</code>
                </p>
            </div>
        </div>
    );
}
