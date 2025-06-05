import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Você está offline | Nova Ipê Imobiliária',
    description: 'Parece que você está sem conexão com a internet. Verifique sua conexão e tente novamente.'
};

export default function OfflineLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="offline-container">
            {children}
        </div>
    );
}
