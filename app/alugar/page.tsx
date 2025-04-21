import { sanityClient } from "@/lib/sanity"
import { queryTodosImoveis } from "@/lib/queries"
import AlugarPage from "./AlugarPage"

export const revalidate = 60

export default async function Page() {
    const imoveis = await sanityClient.fetch(queryTodosImoveis)
    return <AlugarPage imoveis={imoveis} />
}
