/**
 * Fallback Data Service
 * Provides mock data when Sanity is unavailable
 */

import mockImoveis from './imoveis.json'
import type { ImovelClient } from '../../src/types/imovel-client'

export class FallbackDataService {
    private static mockData = mockImoveis as any[]

    static getAllImoveis(): any[] {
        console.log('🔄 Using fallback data for all properties')
        return this.mockData
    }

    static getImoveisParaVenda(): any[] {
        console.log('🔄 Using fallback data for sale properties')
        return this.mockData.filter(item => item.finalidade === 'Venda')
    }

    static getImoveisParaAluguel(): any[] {
        console.log('🔄 Using fallback data for rental properties')
        return this.mockData.filter(item => item.finalidade === 'Aluguel')
    }

    static getImoveisDestaque(): any[] {
        console.log('🔄 Using fallback data for featured properties')
        return this.mockData.filter(item => item.destaque === true)
    }

    static getImoveisEmAlta(): any[] {
        console.log('🔄 Using fallback data for hot properties')
        return this.mockData.filter(item => item.emAlta === true)
    }

    static getImovelBySlug(slug: string): any | null {
        console.log('🔄 Using fallback data for property by slug:', slug)
        return this.mockData.find(item => item.slug.current === slug) || null
    }

    static isUsingFallback(): boolean {
        return true
    }
}

export default FallbackDataService
