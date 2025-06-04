import { Metadata } from 'next'
import { Poppins, Inter, Raleway } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './providers/ThemeProvider'
import { metadata } from './metadata' // Import metadata

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins', // For headings
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter', // For body text
});

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-raleway', // For accent text
});

export { metadata }; // Export metadata to be used by Next.js

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable} ${raleway.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        {/* Metadata will be handled by Next.js through the exported object */}
        {/* Removed direct preconnect/dns-prefetch for cdn.sanity.io, Next.js handles this with Image component usage */}
        {/* Removed direct preconnect for fonts.googleapis.com, Next/Font handles this */}
        {/* Any other critical, non-font/image preloads can be added here if necessary */}
      </head>
      <body className="font-body antialiased bg-background text-foreground transition-colors duration-300 dark:bg-neutral-charcoal dark:text-neutral-soft-white relative">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
