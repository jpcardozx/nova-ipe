// app/alugar/page.tsx
import { sanityClient } from "@/lib/sanity"
import { queryImoveisParaAlugar } from "@/lib/queries"
import type { ImovelExtended } from "@/src/types/imovel-extended"
import AlugarPage from "./AlugarPage"

export const revalidate = 0

export const metadata = {
    title: "Alugar | Ipê Imóveis",
    description: "Veja nossos imóveis disponíveis para aluguel",
}

export default async function Page() {
    const imoveis: ImovelExtended[] = await sanityClient.fetch(queryImoveisParaAlugar)
    return <AlugarPage imoveis={imoveis} />
}