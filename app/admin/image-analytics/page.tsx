import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Análise de Desempenho de Imagens | Ipê Imobiliária',
    description: 'Dashboard de análise de desempenho para imagens Sanity',
    robots: {
        index: false,
        follow: false,
    },
};

export default function ImageAnalyticsPage() {
    return (
        <main className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-2">Dashboard de Imagens</h1>
            <p className="text-gray-600 mb-8">
                Analytics dashboard temporariamente desativado. Funcionalidade será reimplementada com abordagem mais simples.
            </p>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Status</h2>
                <p className="text-sm text-gray-500">
                    Esta página foi simplificada como parte da remediação arquitetural.
                    A funcionalidade de analytics será restaurada em uma versão mais otimizada.
                </p>
            </div>
        </main>
    );
}
