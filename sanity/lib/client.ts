/**
 * Sanity Client Configuration
 * Clean, simple, and reliable
 */

import { createClient } from 'next-sanity'

const projectId = '0nks58lj'
const dataset = 'production'
const apiVersion = '2023-05-03'
const token = process.env.SANITY_API_TOKEN || ''

console.log('🔧 Sanity Client Config:', {
    projectId,
    dataset,
    apiVersion,
    hasToken: !!token,
    tokenStart: token?.slice(0, 10)
})

// Client for data fetching (with CDN for better performance)
export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true, // Enable CDN for better performance on read operations
    perspective: 'published',
})

// Client for mutations (no CDN, with token)
export const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
    perspective: 'published',
})

// Export config for reference
export const config = {
    projectId,
    dataset,
    apiVersion,
    token: !!token,
}