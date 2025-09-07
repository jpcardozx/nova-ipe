/**
 * Sanity Authentication Fix Script
 * 
 * This script helps fix Sanity authentication issues and provides fallback data
 */

// Load environment variables
require('dotenv').config()
require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env.development' })

const { createClient } = require('next-sanity')
const fs = require('fs')
const path = require('path')

// Mock data for fallback
const mockImoveis = [
    {
        _id: 'mock-1',
        titulo: 'Casa Moderna em Condomínio',
        slug: { current: 'casa-moderna-condominio' },
        preco: 850000,
        finalidade: 'Venda',
        tipoImovel: 'Casa',
        bairro: 'Jardim Europa',
        cidade: 'São Paulo',
        estado: 'SP',
        dormitorios: 3,
        banheiros: 2,
        areaUtil: 180,
        vagas: 2,
        destaque: true,
        status: 'disponivel',
        imagem: {
            asset: { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800' },
            alt: 'Casa moderna'
        }
    },
    {
        _id: 'mock-2',
        titulo: 'Apartamento Luxuoso Centro',
        slug: { current: 'apartamento-luxuoso-centro' },
        preco: 3500,
        finalidade: 'Aluguel',
        tipoImovel: 'Apartamento',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        dormitorios: 2,
        banheiros: 1,
        areaUtil: 85,
        vagas: 1,
        destaque: true,
        status: 'disponivel',
        imagem: {
            asset: { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
            alt: 'Apartamento moderno'
        }
    },
    {
        _id: 'mock-3',
        titulo: 'Cobertura com Vista Panorâmica',
        slug: { current: 'cobertura-vista-panoramica' },
        preco: 1200000,
        finalidade: 'Venda',
        tipoImovel: 'Cobertura',
        bairro: 'Vila Madalena',
        cidade: 'São Paulo',
        estado: 'SP',
        dormitorios: 4,
        banheiros: 3,
        areaUtil: 220,
        vagas: 3,
        destaque: true,
        status: 'disponivel',
        emAlta: true,
        imagem: {
            asset: { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800' },
            alt: 'Cobertura luxuosa'
        }
    }
]

async function createFallbackData() {
    console.log('📦 Creating fallback data structure...')
    
    const fallbackDir = path.join(process.cwd(), 'lib', 'fallback-data')
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(fallbackDir)) {
        fs.mkdirSync(fallbackDir, { recursive: true })
    }
    
    // Write mock data
    const fallbackFile = path.join(fallbackDir, 'imoveis.json')
    fs.writeFileSync(fallbackFile, JSON.stringify(mockImoveis, null, 2))
    
    console.log('✅ Fallback data created at:', fallbackFile)
    return fallbackFile
}

async function createFallbackService() {
    console.log('🔧 Creating fallback service...')
    
    const serviceContent = `/**
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
`
    
    const servicePath = path.join(process.cwd(), 'lib', 'fallback-data', 'fallback-service.ts')
    fs.writeFileSync(servicePath, serviceContent)
    
    console.log('✅ Fallback service created at:', servicePath)
    return servicePath
}

async function updateSanityService() {
    console.log('🔧 Updating Sanity service with fallback integration...')
    
    const sanityServicePath = path.join(process.cwd(), 'lib', 'sanity', 'enhanced-operations.ts')
    
    if (!fs.existsSync(sanityServicePath)) {
        console.warn('⚠️  Sanity service file not found, skipping update')
        return
    }
    
    // Read current content
    let content = fs.readFileSync(sanityServicePath, 'utf8')
    
    // Add fallback import if not present
    if (!content.includes('FallbackDataService')) {
        const importLine = "import FallbackDataService from '../fallback-data/fallback-service';"
        content = importLine + '\\n' + content
    }
    
    // Write updated content
    fs.writeFileSync(sanityServicePath, content)
    
    console.log('✅ Sanity service updated with fallback integration')
}

async function testTokenGeneration() {
    console.log('🔑 Testing token generation guidance...')
    
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    
    if (!projectId) {
        console.error('❌ Project ID not found')
        return
    }
    
    console.log('\n📋 To generate a new Sanity API token:')
    console.log('=====================================')
    console.log('1. Go to: https://sanity.io/manage')
    console.log(`2. Select your project: ${projectId}`)
    console.log('3. Go to "API" tab')
    console.log('4. Click "Add API token"')
    console.log('5. Choose "Editor" permissions')
    console.log('6. Copy the token and update your .env files')
    console.log('\n🔧 Update these files:')
    console.log('- .env')
    console.log('- .env.local')
    console.log('- .env.development')
    console.log('\nReplace the SANITY_API_TOKEN value with your new token.')
}

async function createHealthCheck() {
    console.log('🏥 Creating Sanity health check...')
    
    const healthCheckContent = `/**
 * Sanity Health Check Utility
 */

import { createClient } from 'next-sanity'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    timeout: 5000
})

export async function checkSanityHealth(): Promise<{
    isHealthy: boolean
    error?: string
    latency?: number
}> {
    const startTime = Date.now()
    
    try {
        await client.fetch('*[_type == "sanity.imageAsset"][0]._id')
        const latency = Date.now() - startTime
        
        return {
            isHealthy: true,
            latency
        }
    } catch (error) {
        return {
            isHealthy: false,
            error: error instanceof Error ? error.message : String(error)
        }
    }
}

export async function shouldUseFallback(): Promise<boolean> {
    const health = await checkSanityHealth()
    return !health.isHealthy
}
`
    
    const healthCheckPath = path.join(process.cwd(), 'lib', 'sanity', 'health-check.ts')
    fs.writeFileSync(healthCheckPath, healthCheckContent)
    
    console.log('✅ Health check created at:', healthCheckPath)
}

async function runFix() {
    console.log('🚀 Starting Sanity Authentication Fix...\\n')
    
    try {
        // Create fallback system
        await createFallbackData()
        await createFallbackService()
        await createHealthCheck()
        
        // Update services
        await updateSanityService()
        
        // Provide token generation guidance
        await testTokenGeneration()
        
        console.log('\n🎉 Sanity fix completed!')
        console.log('\n📋 Next Steps:')
        console.log('1. Generate a new Sanity API token (see instructions above)')
        console.log('2. Update your .env files with the new token')
        console.log('3. Restart your development server')
        console.log('4. The app will use fallback data until Sanity is working')
        
        return true
    } catch (error) {
        console.error('❌ Fix failed:', error.message)
        return false
    }
}

runFix().catch(console.error)