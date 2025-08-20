import React from 'react';

export default function JuliaLayout({ children }: { children:React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
