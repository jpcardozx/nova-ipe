// app/comprar/page.tsx
import { sanityClient } from "@/lib/sanity"
import { queryImoveisParaVenda } from "@/lib/queries"
import type { ImovelExtended } from "@/src/types/imovel-extended"
import ComprarPage from "./ComprarPage"

export const revalidate = 0

export const metadata = {
    title: "Comprar | Nova Ipê",
    description: "Veja os imóveis disponíveis para compra com curadoria simbólica da Nova Ipê.",
}

export default async function Page() {
    const imoveis: ImovelExtended[] = await sanityClient.fetch(queryImoveisParaVenda)
    return <ComprarPage imoveis={imoveis} />
}