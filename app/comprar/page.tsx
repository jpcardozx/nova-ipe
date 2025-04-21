// app/comprar/page.tsx
import { sanityClient } from "@/lib/sanity"
import { queryTodosImoveis } from "@/lib/queries"
import ComprarPage from "./ComprarPage"

export const revalidate = 60 // ISR para novo conteúdo

export default async function Page() {
    const imoveis = await sanityClient.fetch(queryTodosImoveis)
    return <ComprarPage imoveis={imoveis} />
}
