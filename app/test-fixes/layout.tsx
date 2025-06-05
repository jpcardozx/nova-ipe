// Layout de teste para fixes - polyfills centralizados
// Usando apenas o polyfill central do next.config.js

// Uses a minimal layout just for testing fixes
export default function TestFixesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body>
                {children}
            </body>
        </html>
    );
}
