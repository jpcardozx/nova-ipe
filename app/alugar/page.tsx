// app/alugar/page.tsx
import { sanityClient } from "@/lib/sanity"
import { queryImoveisParaAlugar } from "@/lib/queries"
import type { Imovel } from "@/src/types/sanity-schema"
import AlugarPage from "./AlugarPage"

export const revalidate = 0

export const metadata = {
    title: "Alugar | Ipê Imóveis",
    description: "Veja nossos imóveis disponíveis para aluguel",
}

export default async function Page() {
    const imoveis: Imovel[] = await sanityClient.fetch(queryImoveisParaAlugar)
    return <AlugarPage />
}