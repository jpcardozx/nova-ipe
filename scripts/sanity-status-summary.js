/**
 * Sanity Status Summary
 * 
 * This script provides a comprehensive summary of the Sanity authentication fix
 */

// Load environment variables
require('dotenv').config()
require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env.development' })

const { createClient } = require('next-sanity')

async function checkCurrentStatus() {
    console.log('📊 Sanity Authentication Status Summary')
    console.log('=' .repeat(50))
    
    // Environment check
    console.log('\n🔧 Environment Configuration:')
    const envVars = {
        'NEXT_PUBLIC_SANITY_PROJECT_ID': process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        'NEXT_PUBLIC_SANITY_DATASET': process.env.NEXT_PUBLIC_SANITY_DATASET,
        'NEXT_PUBLIC_SANITY_API_VERSION': process.env.NEXT_PUBLIC_SANITY_API_VERSION,
        'SANITY_API_TOKEN': process.env.SANITY_API_TOKEN ? 'Present' : 'Missing',
        'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing'
    }
    
    Object.entries(envVars).forEach(([key, value]) => {
        const status = value && value !== 'Missing' ? '✅' : '❌'
        console.log(`  ${status} ${key}: ${value || 'Missing'}`)
    })
    
    // Sanity connection test
    console.log('\n🎨 Sanity Connection Test:')
    try {
        const client = createClient({
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
            dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
            apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
            useCdn: false,
            token: process.env.SANITY_API_TOKEN,
            timeout: 5000
        })
        
        await client.fetch('*[_type == "sanity.imageAsset"][0]._id')
        console.log('  ✅ Sanity connection: WORKING')
        console.log('  ✅ Authentication: VALID')
        return { sanityWorking: true }
        
    } catch (error) {
        console.log('  ❌ Sanity connection: FAILED')
        console.log('  ❌ Authentication: INVALID')
        console.log(`  📝 Error: ${error.message}`)
        return { sanityWorking: false, error: error.message }
    }
}

async function checkFallbackSystem() {
    console.log('\n🔄 Fallback System Status:')
    
    const fs = require('fs')
    const path = require('path')
    
    const files = {
        'Fallback Data': path.join(process.cwd(), 'lib', 'fallback-data', 'imoveis.json'),
        'Fallback Service': path.join(process.cwd(), 'lib', 'fallback-data', 'fallback-service.ts'),
        'Health Check': path.join(process.cwd(), 'lib', 'sanity', 'health-check.ts'),
        'Status Component': path.join(process.cwd(), 'components', 'ui', 'sanity-status.tsx'),
        'Health API': path.join(process.cwd(), 'app', 'api', 'sanity', 'health', 'route.ts')
    }
    
    let allFilesExist = true
    Object.entries(files).forEach(([name, filePath]) => {
        const exists = fs.existsSync(filePath)
        console.log(`  ${exists ? '✅' : '❌'} ${name}: ${exists ? 'Ready' : 'Missing'}`)
        if (!exists) allFilesExist = false
    })
    
    if (allFilesExist) {
        // Check fallback data
        try {
            const fallbackData = JSON.parse(fs.readFileSync(files['Fallback Data'], 'utf8'))
            console.log(`  📦 Mock properties available: ${fallbackData.length}`)
        } catch (error) {
            console.log('  ❌ Fallback data corrupted')
            allFilesExist = false
        }
    }
    
    return allFilesExist
}

function printInstructions(sanityWorking, fallbackReady) {
    console.log('\n📋 Current Situation:')
    console.log('=' .repeat(30))
    
    if (sanityWorking) {
        console.log('🎉 GREAT NEWS! Sanity is working properly.')
        console.log('✅ Your app should be fully functional with live data.')
        console.log('\n🚀 You can now:')
        console.log('  • Start your development server: npm run dev')
        console.log('  • Access live property data from Sanity')
        console.log('  • All features should work normally')
        
    } else if (fallbackReady) {
        console.log('⚠️  Sanity authentication is currently failing.')
        console.log('✅ But fallback system is ready!')
        console.log('\n🔄 Your app will:')
        console.log('  • Show mock property data instead of live data')
        console.log('  • Display a status indicator about offline mode')
        console.log('  • Continue working normally for development/testing')
        
        console.log('\n🔑 To fix Sanity authentication:')
        console.log('  1. Go to: https://sanity.io/manage')
        console.log(`  2. Select project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
        console.log('  3. Go to "API" tab')
        console.log('  4. Click "Add API token"')
        console.log('  5. Choose "Editor" permissions')
        console.log('  6. Copy the new token')
        console.log('  7. Update SANITY_API_TOKEN in your .env files')
        console.log('  8. Restart your development server')
        
    } else {
        console.log('❌ Both Sanity and fallback system have issues.')
        console.log('\n🔧 To fix:')
        console.log('  1. Run: node scripts/fix-sanity-auth.js')
        console.log('  2. Follow the token generation instructions')
        console.log('  3. Restart your development server')
    }
    
    console.log('\n🧪 Available test scripts:')
    console.log('  • node scripts/run-auth-tests.js - Test all authentication')
    console.log('  • node scripts/test-sanity-connection.js - Test Sanity connection')
    console.log('  • node scripts/test-fallback-system.js - Test fallback system')
    console.log('  • node scripts/sanity-status-summary.js - This summary')
}

async function main() {
    console.log('🚀 Analyzing Sanity authentication status...\n')
    
    const { sanityWorking } = await checkCurrentStatus()
    const fallbackReady = await checkFallbackSystem()
    
    printInstructions(sanityWorking, fallbackReady)
    
    console.log('\n' + '=' .repeat(50))
    console.log('📞 Need help? Check the console logs when running npm run dev')
    console.log('🔍 Look for messages like "🔄 Using fallback data" or "✅ Sanity OK"')
}

main().catch(console.error)