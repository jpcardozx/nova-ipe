/**
 * Sanity CMS - Configuração Simplificada
 * TOKEN ATUALIZADO: Novo token válido aplicado
 */

import { createClient } from 'next-sanity'

const sanityConfig = {
    projectId: '0nks58lj',
    dataset: 'production',
    apiVersion: '2023-05-03',
    useCdn: process.env.NODE_ENV === 'production',
    token: process.env.SANITY_API_TOKEN,
}

export const sanityClient = createClient(sanityConfig)

export async function sanityFetch<T>(
    query: string,
    params: Record<string, any> = {},
    revalidate: number = 3600
): Promise<T> {
    try {
        return await sanityClient.fetch<T>(query, params, {
            next: { revalidate, tags: ['sanity'] }
        })
    } catch (error) {
        console.error('Sanity fetch error:', error)
        throw error
    }
}

export async function testSanityConnection() {
    try {
        const result = await sanityClient.fetch('*[_type == "imovel"][0...5]')
        return {
            success: true,
            message: 'Connection successful',
            data: result
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            error
        }
    }
}