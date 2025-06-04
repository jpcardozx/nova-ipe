import { Suspense } from 'react';

// Versão minimal para teste de SSR
export default async function MinimalPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Ipê Imóveis - Teste SSR
                </h1>

                <div className="text-center space-y-4">
                    <p>Página de teste para verificar se o SSR está funcionando sem erros de Framer Motion.</p>

                    <div className="bg-gray-100 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Status do Sistema</h2>
                        <p className="text-green-600">✅ Next.js funcionando</p>
                        <p className="text-green-600">✅ SSR ativo</p>
                        <p className="text-green-600">✅ Sem componentes Framer Motion</p>
                    </div>

                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => console.log('Teste de interatividade')}
                    >
                        Teste de Clique
                    </button>
                </div>
            </div>
        </main>
    );
}
