import { createClient } from 'next-sanity'

export const sanityClient = createClient({
  projectId: '0nks58lj',
  dataset: 'production',
  apiVersion: '2024-04-01',
  useCdn: false // true se for apenas leitura pública
})
