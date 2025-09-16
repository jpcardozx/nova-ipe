'use client'

import { createClient } from 'next-sanity'

export const sanityClient = createClient({
    projectId: '0nks58lj',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
    token: process.env.SANITY_API_TOKEN,
})

export async function clientFetch<T>(
    query: string,
    params: Record<string, any> = {}
): Promise<T> {
    try {
        return await sanityClient.fetch<T>(query, params)
    } catch (error) {
        console.error('Sanity client fetch error:', error)
        throw error
    }
}