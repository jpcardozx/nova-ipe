/**
 * Test Sanity authentication and data fetching
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

console.log('🧪 Testing Sanity Authentication and Data Fetching');
console.log('================================================');

// Check environment variables
console.log('\n1. Checking environment variables...');
const requiredVars = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET', 'SANITY_API_TOKEN'];
const missingVars = [];

requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
        missingVars.push(varName);
        console.log(`   ❌ ${varName}: Missing`);
    } else {
        console.log(`   ✅ ${varName}: ${value.substring(0, 10)}...`);
    }
});

if (missingVars.length > 0) {
    console.log(`\n❌ Missing required environment variables: ${missingVars.join(', ')}`);
    console.log('Please check your .env files');
    process.exit(1);
}

// Create Sanity client
console.log('\n2. Creating Sanity client...');
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
    timeout: 10000
});

console.log('   ✅ Sanity client created');

// Test authentication
async function testAuthentication() {
    console.log('\n3. Testing authentication...');
    
    try {
        // Try to fetch a simple query to test authentication
        const result = await client.fetch('*[_type == "imovel"][0...1]');
        console.log('   ✅ Authentication successful');
        console.log(`   📊 Fetched ${Array.isArray(result) ? result.length : 0} items`);
        return true;
    } catch (error) {
        console.log('   ❌ Authentication failed:', error.message);
        
        if (error.message.includes('Unauthorized')) {
            console.log('   💡 This appears to be an authentication issue');
            console.log('   💡 Check your SANITY_API_TOKEN');
        } else if (error.message.includes('timeout')) {
            console.log('   💡 Request timed out - network or server issue');
        } else {
            console.log('   💡 Unexpected error - check configuration');
        }
        
        return false;
    }
}

// Test data fetching
async function testDataFetching() {
    console.log('\n4. Testing data fetching...');
    
    const queries = [
        { name: 'Properties', query: '*[_type == "imovel"][0...3]' },
        { name: 'Property count', query: 'count(*[_type == "imovel"])' },
        { name: 'Featured properties', query: '*[_type == "imovel" && destaque == true][0...2]' }
    ];
    
    const results = {};
    
    for (const { name, query } of queries) {
        try {
            console.log(`   Testing ${name}...`);
            const result = await client.fetch(query);
            results[name] = { success: true, data: result };
            console.log(`   ✅ ${name}: Success (${Array.isArray(result) ? result.length + ' items' : typeof result})`);
        } catch (error) {
            results[name] = { success: false, error: error.message };
            console.log(`   ❌ ${name}: Failed - ${error.message}`);
        }
    }
    
    return results;
}

// Test error scenarios
async function testErrorScenarios() {
    console.log('\n5. Testing error scenarios...');
    
    const errorTests = [
        { name: 'Invalid query syntax', query: 'invalid groq syntax [[[' },
        { name: 'Non-existent type', query: '*[_type == "nonexistent"]' },
        { name: 'Complex query', query: '*[_type == "imovel" && defined(preco) && preco > 0]' }
    ];
    
    for (const { name, query } of errorTests) {
        try {
            console.log(`   Testing ${name}...`);
            const result = await client.fetch(query);
            console.log(`   ✅ ${name}: Success (${Array.isArray(result) ? result.length + ' items' : typeof result})`);
        } catch (error) {
            if (name === 'Invalid query syntax') {
                console.log(`   ✅ ${name}: Correctly caught error - ${error.message.substring(0, 50)}...`);
            } else {
                console.log(`   ❌ ${name}: Unexpected error - ${error.message}`);
            }
        }
    }
}

// Test fallback mechanism
async function testFallbackMechanism() {
    console.log('\n6. Testing fallback mechanism...');
    
    // Create a client with invalid token to test fallback
    const invalidClient = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        apiVersion: '2024-01-01',
        token: 'invalid-token',
        useCdn: false,
        timeout: 5000
    });
    
    try {
        console.log('   Testing with invalid token...');
        await invalidClient.fetch('*[_type == "imovel"][0...1]');
        console.log('   ❌ Expected authentication error but got success');
    } catch (error) {
        console.log('   ✅ Correctly failed with invalid token');
        console.log('   💡 Fallback mechanism should handle this scenario');
    }
}

// Generate report
function generateReport(authSuccess, dataResults) {
    console.log('\n📊 Test Summary');
    console.log('===============');
    
    console.log(`Authentication: ${authSuccess ? '✅ PASS' : '❌ FAIL'}`);
    
    const dataTests = Object.entries(dataResults);
    const successfulTests = dataTests.filter(([_, result]) => result.success).length;
    console.log(`Data Fetching: ${successfulTests}/${dataTests.length} tests passed`);
    
    dataTests.forEach(([name, result]) => {
        console.log(`  - ${name}: ${result.success ? '✅' : '❌'}`);
    });
    
    console.log('\n🎯 Recommendations:');
    if (!authSuccess) {
        console.log('  - Fix Sanity authentication configuration');
        console.log('  - Verify SANITY_API_TOKEN is valid and has proper permissions');
    } else {
        console.log('  - Sanity authentication is working correctly');
    }
    
    if (successfulTests === dataTests.length) {
        console.log('  - All data fetching tests passed');
    } else {
        console.log('  - Some data fetching tests failed - check query syntax and data structure');
    }
    
    console.log('  - Implement proper error handling and fallback mechanisms');
    console.log('  - Monitor authentication status in production');
}

// Run all tests
async function runAllTests() {
    try {
        const authSuccess = await testAuthentication();
        const dataResults = await testDataFetching();
        await testErrorScenarios();
        await testFallbackMechanism();
        
        generateReport(authSuccess, dataResults);
        
        console.log('\n✅ Sanity authentication and data fetching tests completed!');
        
    } catch (error) {
        console.error('\n❌ Test execution failed:', error);
        process.exit(1);
    }
}

// Run the tests
runAllTests();