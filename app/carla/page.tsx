import { Metadata } from 'next'
import CarlaLinktreeEnhanced from '../components/CarlaLinktreeEnhanced'

export const metadata: Metadata = {
    title: 'Carla - Corretora Imobiliária',
    description: 'Especialista em imóveis. Entre em contato e realize o sonho do seu imóvel ideal.',
    openGraph: {
        title: 'Carla - Corretora Imobiliária',
        description: 'Especialista em imóveis',
        images: ['/images/carla.png'],
    },
}

export default function CarlaPage() {
    return <CarlaLinktreeEnhanced />
}