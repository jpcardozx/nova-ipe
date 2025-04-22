// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import { Montserrat } from 'next/font/google'

const mserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata = { title: 'Nova Ipê', description: 'Gestão Imobiliária e Consultoria' }

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="pt-BR"
      className={`
        ${mserrat.className}
      `}
    >
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  )
}
