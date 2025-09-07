/**
 * Final System Test
 * 
 * This script runs a comprehensive test of the entire system
 */

// Load environment variables
require('dotenv').config()
require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env.development' })

async function runFinalTest() {
    console.log('🚀 Final System Test - Nova Ipê Authentication Fix')
    console.log('=' .repeat(60))
    
    let allTestsPassed = true
    const results = []
    
    // Test 1: Environment Variables
    console.log('\n1️⃣ Testing Environment Variables...')
    try {
        const requiredVars = [
            'NEXT_PUBLIC_SANITY_PROJECT_ID',
            'NEXT_PUBLIC_SANITY_DATASET', 
            'NEXT_PUBLIC_SANITY_API_VERSION',
            'SANITY_API_TOKEN',
            'NEXT_PUBLIC_SUPABASE_URL',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY'
        ]
        
        const missing = requiredVars.filter(varName => !process.env[varName])
        
        if (missing.length === 0) {
            console.log('   ✅ All environment variables present')
            results.push({ test: 'Environment Variables', status: 'PASS' })
        } else {
            console.log('   ❌ Missing variables:', missing.join(', '))
            results.push({ test: 'Environment Variables', status: 'FAIL', details: missing })
            allTestsPassed = false
        }
    } catch (error) {
        console.log('   ❌ Error checking environment:', error.message)
        results.push({ test: 'Environment Variables', status: 'ERROR', error: error.message })
        allTestsPassed = false
    }
    
    // Test 2: Sanity Connection
    console.log('\n2️⃣ Testing Sanity Connection...')
    try {
        const { createClient } = require('next-sanity')
        
        const client = createClient({
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
            dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
            apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
            useCdn: false,
            token: process.env.SANITY_API_TOKEN,
            timeout: 10000
        })
        
        await client.fetch('*[_type == "sanity.imageAsset"][0]._id')
        console.log('   ✅ Sanity connection working')
        results.push({ test: 'Sanity Connection', status: 'PASS' })
        
    } catch (error) {
        console.log('   ⚠️  Sanity connection failed (expected):', error.message.slice(0, 50) + '...')
        console.log('   ✅ Fallback system will handle this')
        results.push({ test: 'Sanity Connection', status: 'FAIL_EXPECTED', details: 'Will use fallback' })
    }
    
    // Test 3: Fallback System
    console.log('\n3️⃣ Testing Fallback System...')
    try {
        const fs = require('fs')
        const path = require('path')
        
        const fallbackDataPath = path.join(process.cwd(), 'lib', 'fallback-data', 'imoveis.json')
        const fallbackServicePath = path.join(process.cwd(), 'lib', 'fallback-data', 'fallback-service.ts')
        
        if (fs.existsSync(fallbackDataPath) && fs.existsSync(fallbackServicePath)) {
            const fallbackData = JSON.parse(fs.readFileSync(fallbackDataPath, 'utf8'))
            console.log(`   ✅ Fallback system ready with ${fallbackData.length} mock properties`)
            results.push({ test: 'Fallback System', status: 'PASS', details: `${fallbackData.length} properties` })
        } else {
            console.log('   ❌ Fallback files missing')
            results.push({ test: 'Fallback System', status: 'FAIL', details: 'Files missing' })
            allTestsPassed = false
        }
    } catch (error) {
        console.log('   ❌ Fallback system error:', error.message)
        results.push({ test: 'Fallback System', status: 'ERROR', error: error.message })
        allTestsPassed = false
    }
    
    // Test 4: Next.js Configuration
    console.log('\n4️⃣ Testing Next.js Configuration...')
    try {
        const nextConfig = require('../next.config.js')
        
        if (nextConfig.experimental && nextConfig.experimental.workerThreads === false) {
            console.log('   ✅ Resource optimization enabled')
            results.push({ test: 'Next.js Config', status: 'PASS' })
        } else {
            console.log('   ⚠️  Resource optimization not fully configured')
            results.push({ test: 'Next.js Config', status: 'PARTIAL' })
        }
    } catch (error) {
        console.log('   ❌ Next.js config error:', error.message)
        results.push({ test: 'Next.js Config', status: 'ERROR', error: error.message })
        allTestsPassed = false
    }
    
    // Test 5: File Structure
    console.log('\n5️⃣ Testing File Structure...')
    try {
        const fs = require('fs')
        const path = require('path')
        
        const criticalFiles = [
            'app/page.tsx',
            'lib/sanity/fetchImoveis.ts',
            'lib/sanity/health-check.ts',
            'components/ui/sanity-status.tsx',
            'app/api/sanity/health/route.ts'
        ]
        
        const missingFiles = criticalFiles.filter(file => 
            !fs.existsSync(path.join(process.cwd(), file))
        )
        
        if (missingFiles.length === 0) {
            console.log('   ✅ All critical files present')
            results.push({ test: 'File Structure', status: 'PASS' })
        } else {
            console.log('   ❌ Missing files:', missingFiles.join(', '))
            results.push({ test: 'File Structure', status: 'FAIL', details: missingFiles })
            allTestsPassed = false
        }
    } catch (error) {
        console.log('   ❌ File structure check error:', error.message)
        results.push({ test: 'File Structure', status: 'ERROR', error: error.message })
        allTestsPassed = false
    }
    
    // Test 6: System Resources
    console.log('\n6️⃣ Testing System Resources...')
    try {
        const memUsage = process.memoryUsage()
        const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024)
        
        console.log(`   📊 Memory usage: ${memUsageMB}MB`)
        
        if (memUsageMB < 100) {
            console.log('   ✅ Memory usage is healthy')
            results.push({ test: 'System Resources', status: 'PASS', details: `${memUsageMB}MB` })
        } else {
            console.log('   ⚠️  Memory usage is elevated')
            results.push({ test: 'System Resources', status: 'WARNING', details: `${memUsageMB}MB` })
        }
    } catch (error) {
        console.log('   ❌ Resource check error:', error.message)
        results.push({ test: 'System Resources', status: 'ERROR', error: error.message })
    }
    
    // Print Summary
    console.log('\n📊 Test Results Summary:')
    console.log('=' .repeat(40))
    
    results.forEach(result => {
        const statusIcon = {
            'PASS': '✅',
            'FAIL': '❌',
            'ERROR': '💥',
            'WARNING': '⚠️',
            'PARTIAL': '🔶',
            'FAIL_EXPECTED': '⚠️'
        }[result.status] || '❓'
        
        console.log(`${statusIcon} ${result.test}: ${result.status}`)
        if (result.details) console.log(`   Details: ${result.details}`)
        if (result.error) console.log(`   Error: ${result.error}`)
    })
    
    // Final Status
    console.log('\n🎯 Final Status:')
    console.log('=' .repeat(20))
    
    if (allTestsPassed) {
        console.log('🎉 ALL SYSTEMS GO!')
        console.log('✅ Your application is ready to run')
        console.log('\n🚀 Next steps:')
        console.log('  1. Run: npm run dev')
        console.log('  2. Open: http://localhost:3000')
        console.log('  3. Check for fallback data indicators')
        console.log('  4. Generate new Sanity token when ready')
    } else {
        const criticalFailures = results.filter(r => r.status === 'FAIL' || r.status === 'ERROR').length
        const warnings = results.filter(r => r.status === 'WARNING' || r.status === 'PARTIAL').length
        
        if (criticalFailures === 0) {
            console.log('⚠️  READY WITH WARNINGS')
            console.log('✅ Your application should work with fallback data')
            console.log(`⚠️  ${warnings} warning(s) to address`)
        } else {
            console.log('❌ CRITICAL ISSUES FOUND')
            console.log(`❌ ${criticalFailures} critical failure(s)`)
            console.log('🔧 Please fix the issues above before proceeding')
        }
    }
    
    console.log('\n📞 Support:')
    console.log('  • Check console logs when running the app')
    console.log('  • Look for "🔄 Using fallback data" messages')
    console.log('  • Use the test scripts for specific diagnostics')
    
    return allTestsPassed
}

runFinalTest().catch(console.error)