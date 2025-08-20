import { Metadata } from 'next'
import JuliaLinktree from './julia-component'

export const metadata: Metadata = {
    title: 'Julia de Mello - Corretora Imobiliária | Ipê Imóveis Guararema',
    description: 'Julia de Mello, corretora imobiliária especializada em Guararema e região. Entre em contato para encontrar o imóvel ideal.',
    keywords: 'Julia de Mello, corretora, Guararema, imóveis, Ipê Imóveis, corretora imobiliária',
    openGraph: {
        title: 'Julia de Mello - Corretora Imobiliária',
        description: 'Especialista em imóveis em Guararema e região',
        type: 'profile',
        locale: 'pt_BR',
    },
    robots: {
        index: true,
        follow: true,
    }
}

export default function JuliaPage() {
    return <JuliaLinktree />
}