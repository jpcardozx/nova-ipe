import type { Metadata } from 'next'
import { Montserrat as Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ipê Imóveis - Encontre seu Imóvel dos Sonhos',
  description: 'Descobra imóveis incríveis em Guararema e região com a Ipê Imóveis. Especialistas em venda e locação de propriedades.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body>
        {children}
      </body>
    </html>
  )
}