import { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        template: '%s | Blog Ipê Imóveis',
        default: 'Blog Ipê Imóveis',
    },
    description: 'Artigos e conteúdos educativos sobre mercado imobiliário, estratégias de marketing e dicas para corretores.',
}

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    )
}
