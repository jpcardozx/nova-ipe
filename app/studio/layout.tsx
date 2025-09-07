import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
    title: 'Sanity Studio | Ipê Imóveis',
    description: 'Sistema de gerenciamento de conteúdo',
    robots: {
        index: false,
        follow: false,
    },
};

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="font-sans antialiased bg-white text-gray-900">
            {/* Studio do Sanity sem navbar, footer ou outros elementos que possam conflitar */}
            <main role="main" className="min-h-screen">
                {children}
            </main>
        </div>
    );
}
