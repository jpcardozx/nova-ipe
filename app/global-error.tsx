'use client'

// EXTREMELY MINIMAL GLOBAL ERROR COMPONENT
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    // console.error('Global error caught by app/global-error.tsx:', error);

    return (
        <html lang="pt-BR">
            <head>
                <title>Erro Crítico na Aplicação</title>
            </head>
            <body>
                <div>
                    <h1>Ocorreu um Erro Crítico</h1>
                    <p>Lamentamos o inconveniente. Nossa equipe foi notificada.</p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: '10px 20px',
                            margin: '10px',
                            cursor: 'pointer'
                        }}
                    >
                        Tentar Novamente
                    </button>
                    <a
                        href="/"
                        style={{
                            padding: '10px 20px',
                            margin: '10px',
                            cursor: 'pointer',
                            display: 'inline-block',
                            border: '1px solid black'
                        }}
                    >
                        Página Inicial
                    </a>
                </div>
            </body>
        </html>
    );
}
