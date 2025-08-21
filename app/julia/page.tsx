import { Metadata } from 'next'
import JuliaLinktreeEnhanced from '../components/JuliaLinktreeEnhanced'

export const metadata: Metadata = {
  title: 'Julia de Mello - Corretora Imobiliária',
  description: 'Especialista em imóveis em Guararema e região. Entre em contato e realize o sonho do seu imóvel ideal.',
  openGraph: {
    title: 'Julia de Mello - Corretora Imobiliária',
    description: 'Especialista em imóveis em Guararema e região',
    images: ['/images/julia.png'],
  },
}

export default function JuliaPage() {
  return <JuliaLinktreeEnhanced />
}