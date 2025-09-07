/**
 * Simple Authentication Test Runner
 * 
 * This script runs basic authentication tests to validate the system
 */

// Load environment variables
require('dotenv').config()
require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env.development' })

const { createClient } = require('next-sanity')

// Test environment configuration
function testEnvironmentConfig() {
    console.log('🔧 Testing Environment Configuration...')
    
    const requiredVars = [
        'NEXT_PUBLIC_SANITY_PROJECT_ID',
        'NEXT_PUBLIC_SANITY_DATASET', 
        'NEXT_PUBLIC_SANITY_API_VERSION',
        'SANITY_API_TOKEN',
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ]
    
    const missing = []
    const present = []
    
    requiredVars.forEach(varName => {
        if (process.env[varName]) {
            present.push(varName)
            console.log(`✅ ${varName}: Present`)
        } else {
            missing.push(varName)
            console.log(`❌ ${varName}: Missing`)
        }
    })
    
    console.log(`\nSummary: ${present.length}/${requiredVars.length} variables configured`)
    
    if (missing.length > 0) {
        console.log('❌ Missing variables:', missing.join(', '))
        return false
    }
    
    console.log('✅ All environment variables are configured')
    return true
}

// Test Sanity client creation
function testSanityClient() {
    console.log('\n🎨 Testing Sanity Client...')
    
    try {
        const client = createClient({
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
            dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
            apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
            token: process.env.SANITY_API_TOKEN,
            useCdn: false
        })
        
        console.log('✅ Sanity client created successfully')
        console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
        console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`)
        console.log(`   API Version: ${process.env.NEXT_PUBLIC_SANITY_API_VERSION}`)
        console.log(`   Token: ${process.env.SANITY_API_TOKEN ? 'Present' : 'Missing'}`)
        
        return true
    } catch (error) {
        console.log('❌ Failed to create Sanity client:', error.message)
        return false
    }
}

// Test Supabase configuration
function testSupabaseConfig() {
    console.log('\n🗄️ Testing Supabase Configuration...')
    
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!url) {
        console.log('❌ Supabase URL is missing')
        return false
    }
    
    if (!key) {
        console.log('❌ Supabase anonymous key is missing')
        return false
    }
    
    if (!url.startsWith('https://')) {
        console.log('❌ Supabase URL must start with https://')
        return false
    }
    
    console.log('✅ Supabase configuration is valid')
    console.log(`   URL: ${url}`)
    console.log(`   Key: ${key.substring(0, 20)}...`)
    
    return true
}

// Main test function
async function runTests() {
    console.log('🚀 Starting Authentication System Tests...\n')
    
    const tests = [
        { name: 'Environment Configuration', fn: testEnvironmentConfig },
        { name: 'Sanity Client', fn: testSanityClient },
        { name: 'Supabase Configuration', fn: testSupabaseConfig }
    ]
    
    const results = []
    
    for (const test of tests) {
        try {
            const result = await test.fn()
            results.push({ name: test.name, success: result })
        } catch (error) {
            console.log(`❌ ${test.name} test failed:`, error.message)
            results.push({ name: test.name, success: false, error })
        }
    }
    
    // Print summary
    console.log('\n📊 Test Summary:')
    console.log('================')
    
    const passed = results.filter(r => r.success).length
    const total = results.length
    
    results.forEach(result => {
        const status = result.success ? '✅' : '❌'
        console.log(`${status} ${result.name}`)
    })
    
    console.log(`\nPassed: ${passed}/${total} tests`)
    
    if (passed === total) {
        console.log('🎉 All tests passed! Authentication system is properly configured.')
    } else {
        console.log('⚠️  Some tests failed. Please check the configuration above.')
    }
    
    return passed === total
}

// Run tests
runTests().catch(console.error)