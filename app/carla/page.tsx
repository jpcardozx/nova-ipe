import { Metadata } from 'next'
import CarlaLinktreeEnhanced from '../components/CarlaLinktreeEnhanced'

export const metadata: Metadata = {
    title: 'Carla Santos - Corretora Imobiliária Especialista | Guararema',
    description: 'Carla Santos, corretora imobiliária com 10+ anos de experiência em Guararema e região. Especialista em casas de alto padrão, sítios e investimentos. Atendimento humanizado e personalizado.',
    openGraph: {
        title: 'Carla Santos - Corretora Imobiliária Especialista',
        description: 'Especialista em imóveis de alto padrão em Guararema e região',
        images: ['/images/carla/perfilCarla.png'],
    },
}

export default function CarlaPage() {
    return <CarlaLinktreeEnhanced />
}
