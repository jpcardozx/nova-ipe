// app/alugar/page.tsx
import type { ImovelClient } from "../../src/types/imovel-client"
import { sanityClient } from "../../lib/sanity"
import { queryImoveisParaAlugar } from "../../lib/queries"
import AlugarPage from "./AlugarPage"

export const revalidate = 0

export const metadata = {
    title: "Alugar | Ipê Imóveis",
    description: "Veja nossos imóveis disponíveis para aluguel",
}

export default async function Page() {
    const imoveis: ImovelClient[] = await sanityClient.fetch(queryImoveisParaAlugar)
    return <AlugarPage />
}