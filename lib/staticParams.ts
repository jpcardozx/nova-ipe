import { sanityClient } from "lib/sanity"

export async function fetchImovelSlugs() {
  const slugs = await sanityClient.fetch(`*[_type == "imovel" && defined(slug.current)][].slug.current`)
  return slugs.map((slug: string) => ({ slug }))
}
