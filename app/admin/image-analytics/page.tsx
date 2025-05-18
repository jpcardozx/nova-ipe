import { Metadata } from 'next';
import ImagePerformanceDashboard from '@/app/components/ImagePerformanceDashboard';
import { ImageAnalyticsProvider } from '@/app/providers/ImageAnalyticsProvider';

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
                Visualize métricas de desempenho para otimizar as imagens do Sanity
            </p>

            <ImageAnalyticsProvider
                enableAnalytics={true}
                debug={true}
            >
                <div className="space-y-12">
                    <ImagePerformanceDashboard />

                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Sobre o Dashboard</h2>
                        <p className="mb-4">
                            Esta ferramenta coleta dados de desempenho das imagens da Sanity em todo o site para ajudar a:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                            <li>Identificar componentes com carregamento lento de imagens</li>
                            <li>Detectar imagens com alta taxa de falha</li>
                            <li>Comparar diferentes técnicas de otimização</li>
                            <li>Monitorar métricas de Core Web Vitals relacionadas a imagens</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-3">Como usar os dados</h3>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Compare o tempo médio de carregamento entre componentes</li>
                            <li>Identifique imagens com falhas frequentes</li>
                            <li>Analise o impacto do tamanho das imagens no desempenho</li>
                            <li>Use estas métricas para refinar suas estratégias de otimização de imagens</li>
                        </ol>
                    </div>
                </div>
            </ImageAnalyticsProvider>
        </main>
    );
}
