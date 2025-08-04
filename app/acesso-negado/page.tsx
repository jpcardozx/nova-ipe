// app/acesso-negado/page.tsx

import Link from "next/link";
import { Metadata } from "next";

// Importando componentes usando caminho relativo para garantir compatibilidade
import Footer from "../sections/Footer";

export const metadata: Metadata = {
    title: "Acesso restrito - Ipê Imóveis",
    description: "Somente administradores autorizados podem acessar esta seção.",
};

export default function AcessoNegadoPage() {
    return (
        <div style={{ paddingTop: '80px' }}> {/* Offset para navbar fixa */}
            <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-[#f7f6f3] to-white text-[#0D1F2D]">
                <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Acesso restrito 🔒
                    </h1>
                    <p className="text-lg text-[#0D1F2D]/80">
                        Esta área é reservada para os administradores da <strong>Ipê Imóveis</strong>.
                        Se você recebeu este link por engano ou não possui autorização, por favor, volte para a página inicial.
                    </p>
                    <Link
                        href="/"
                        className="mt-8 inline-block px-6 py-3 bg-[#FFAD43] text-white rounded-full font-medium shadow hover:brightness-110 transition"
                    >
                        Voltar para o site
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
