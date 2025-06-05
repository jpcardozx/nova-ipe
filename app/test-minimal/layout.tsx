// Layout de teste mínimo - polyfills removidos
// Usar apenas o polyfill central do next.config.js

export default function MinimalTestLayout({
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
