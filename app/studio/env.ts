export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "0nks58lj"
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"
export const useCdn = process.env.NODE_ENV === "production"