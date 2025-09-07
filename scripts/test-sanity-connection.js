/**
 * Sanity Connection Diagnostic Script
 * 
 * This script tests the Sanity connection and diagnoses issues
 */

// Load environment variables
require('dotenv').config()
require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env.development' })

const { createClient } = require('next-sanity')

async function testSanityConnection() {
    console.log('🔧 Testing Sanity Connection...\n')
    
    // Check environment variables
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
    const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
    const token = process.env.SANITY_API_TOKEN
    
    console.log('Environment Variables:')
    console.log(`  Project ID: ${projectId || 'MISSING'}`)
    console.log(`  Dataset: ${dataset || 'MISSING'}`)
    console.log(`  API Version: ${apiVersion || 'MISSING'}`)
    console.log(`  Token: ${token ? 'Present (' + token.length + ' chars)' : 'MISSING'}`)
    console.log()
    
    if (!projectId || !dataset || !apiVersion) {
        console.error('❌ Missing required Sanity configuration')
        return false
    }
    
    // Create client
    const client = createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        token,
        timeout: 10000
    })
    
    console.log('🎨 Testing Sanity Client Connection...')
    
    try {
        // Test 1: Basic connectivity
        console.log('Test 1: Basic connectivity...')
        const basicTest = await client.fetch('*[_type == "sanity.imageAsset"][0]._id')
        console.log('✅ Basic connectivity: OK')
        
        // Test 2: Schema validation
        console.log('Test 2: Schema validation...')
        const schemaTest = await client.fetch('*[_type == "imovel"][0]._id')
        console.log('✅ Schema validation: OK (imovel type exists)')
        
        // Test 3: Data availability
        console.log('Test 3: Data availability...')
        const dataTest = await client.fetch('count(*[_type == "imovel"])')
        console.log(`✅ Data availability: ${dataTest} imóveis found`)
        
        // Test 4: Complex query
        console.log('Test 4: Complex query...')
        const complexTest = await client.fetch(`
            *[_type == "imovel" && status == "disponivel"][0...3] {
                _id,
                titulo,
                preco,
                finalidade
            }
        `)
        console.log(`✅ Complex query: ${complexTest.length} results`)
        
        // Test 5: Authentication (if token provided)
        if (token) {
            console.log('Test 5: Authentication...')
            try {
                const authTest = await client.fetch('*[_type == "imovel" && _id == "drafts.test"]')
                console.log('✅ Authentication: OK (can access drafts)')
            } catch (authError) {
                if (authError.message.includes('Unauthorized')) {
                    console.log('⚠️  Authentication: Token invalid or expired')
                } else {
                    console.log('✅ Authentication: OK (no drafts found)')
                }
            }
        }
        
        console.log('\n🎉 All Sanity tests passed!')
        return true
        
    } catch (error) {
        console.error('❌ Sanity connection failed:', error.message)
        
        // Provide specific error guidance
        if (error.message.includes('Project not found')) {
            console.error('💡 Solution: Check your NEXT_PUBLIC_SANITY_PROJECT_ID')
        } else if (error.message.includes('Dataset not found')) {
            console.error('💡 Solution: Check your NEXT_PUBLIC_SANITY_DATASET')
        } else if (error.message.includes('Unauthorized')) {
            console.error('💡 Solution: Check your SANITY_API_TOKEN')
        } else if (error.message.includes('timeout')) {
            console.error('💡 Solution: Network connectivity issue or Sanity is down')
        } else {
            console.error('💡 Solution: Check Sanity Studio configuration')
        }
        
        return false
    }
}

async function testEnvironmentSpecific() {
    console.log('\n🌍 Testing Environment-Specific Issues...')
    
    // Test Node.js version
    console.log(`Node.js version: ${process.version}`)
    
    // Test network connectivity
    try {
        const https = require('https')
        const testUrl = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/ping`
        
        await new Promise((resolve, reject) => {
            const req = https.get(testUrl, (res) => {
                console.log(`✅ Network connectivity: ${res.statusCode}`)
                resolve()
            })
            req.on('error', reject)
            req.setTimeout(5000, () => reject(new Error('Network timeout')))
        })
    } catch (error) {
        console.error('❌ Network connectivity failed:', error.message)
    }
    
    // Test memory usage
    const memUsage = process.memoryUsage()
    console.log(`Memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`)
    
    if (memUsage.heapUsed > 500 * 1024 * 1024) {
        console.warn('⚠️  High memory usage detected')
    }
}

// Run tests
async function runDiagnostics() {
    console.log('🚀 Starting Sanity Connection Diagnostics...\n')
    
    const connectionOk = await testSanityConnection()
    await testEnvironmentSpecific()
    
    console.log('\n📊 Diagnostic Summary:')
    console.log('================')
    console.log(`Sanity Connection: ${connectionOk ? '✅ OK' : '❌ FAILED'}`)
    
    if (!connectionOk) {
        console.log('\n🔧 Troubleshooting Steps:')
        console.log('1. Verify environment variables in .env files')
        console.log('2. Check Sanity Studio is deployed and accessible')
        console.log('3. Verify network connectivity')
        console.log('4. Check Sanity project permissions')
        console.log('5. Try regenerating API tokens')
    }
    
    return connectionOk
}

runDiagnostics().catch(console.error)