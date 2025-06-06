// lib/sanity/client.ts
import { createClient } from 'next-sanity'

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-04-17', // use a versão mais recente disponível
    useCdn: false,
    token: process.env.SANITY_API_TOKEN // se necessário
})
