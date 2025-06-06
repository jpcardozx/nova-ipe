// src/lib/sanity.ts
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

const sanityConfig = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-06-01',
    useCdn: process.env.NODE_ENV === 'production',
}

export const sanityClient = createClient(sanityConfig)
const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
    return builder.image(source)
}
