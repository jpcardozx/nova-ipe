// lib/sanity/types.ts
import type { SanityDocument as BaseSanityDocument } from 'next-sanity'

// Extend o tipo base do Sanity se necessário
export interface SanityDocument extends BaseSanityDocument {
    _id: string
    _type: string
    _createdAt: string
    _updatedAt: string
    _rev: string
}

// Outros tipos compartilhados do Sanity
export interface SanityImageAsset {
    _type: 'image'
    asset: {
        _ref: string
        _type: 'reference'
    }
    hotspot?: {
        x: number
        y: number
        height: number
        width: number
    }
    crop?: {
        top: number
        bottom: number
        left: number
        right: number
    }
}