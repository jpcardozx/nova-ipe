// Test script to debug Studio authentication
// Run: node scripts/debug-studio-auth.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Debugging Studio Authentication Setup...\n');

// 1. Check .env.local file
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    console.log('✅ .env.local exists');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const hasAdminPass = envContent.includes('ADMIN_PASS=');
    const hasSanityProjectId = envContent.includes('NEXT_PUBLIC_SANITY_PROJECT_ID=');
    const hasSanityDataset = envContent.includes('NEXT_PUBLIC_SANITY_DATASET=');
    
    console.log(`   - ADMIN_PASS: ${hasAdminPass ? '✅' : '❌'}`);
    console.log(`   - NEXT_PUBLIC_SANITY_PROJECT_ID: ${hasSanityProjectId ? '✅' : '❌'}`);
    console.log(`   - NEXT_PUBLIC_SANITY_DATASET: ${hasSanityDataset ? '✅' : '❌'}`);
} else {
    console.log('❌ .env.local does not exist');
}

// 2. Check API endpoints
const apiPaths = [
    'app/api/login/route.ts',
    'app/api/auth/check-studio/route.ts',
    'app/api/logout/route.ts'
];

console.log('\n📁 API Endpoints:');
apiPaths.forEach(apiPath => {
    const exists = fs.existsSync(apiPath);
    console.log(`   - ${apiPath}: ${exists ? '✅' : '❌'}`);
});

// 3. Check auth files
const authPaths = [
    'lib/auth/enhanced-auth-manager.ts',
    'lib/auth.ts',
    'lib/environment-config.ts'
];

console.log('\n🔐 Auth Files:');
authPaths.forEach(authPath => {
    const exists = fs.existsSync(authPath);
    console.log(`   - ${authPath}: ${exists ? '✅' : '❌'}`);
});

// 4. Check Studio files
const studioPaths = [
    'app/studio/page.tsx',
    'app/structure/page.tsx',
    'sanity.config.ts'
];

console.log('\n🎬 Studio Files:');
studioPaths.forEach(studioPath => {
    const exists = fs.existsSync(studioPath);
    console.log(`   - ${studioPath}: ${exists ? '✅' : '❌'}`);
});

console.log('\n🧪 Test Instructions:');
console.log('1. Navigate to: http://localhost:3000/login?mode=studio');
console.log('2. Use email: admin@imobiliariaipe.com.br');
console.log('3. Use password: ipeplataformadigital');
console.log('4. Check browser console for detailed logs');
console.log('\n📊 If still not working, check browser Network tab for failed requests');