#!/usr/bin/env node

/**
 * CORS Configuration Script for Sanity
 * This script helps configure CORS origins for local development
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ID = '0nks58lj';
const DEVELOPMENT_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
];

console.log('🔧 Sanity CORS Configuration Tool');
console.log('=====================================\n');

// Check if Sanity CLI is installed
function checkSanityCLI() {
    try {
        execSync('sanity --version', { stdio: 'pipe' });
        console.log('✅ Sanity CLI is installed');
        return true;
    } catch (error) {
        console.log('❌ Sanity CLI not found');
        console.log('\n📦 Installing Sanity CLI...');
        try {
            execSync('npm install -g @sanity/cli', { stdio: 'inherit' });
            console.log('✅ Sanity CLI installed successfully');
            return true;
        } catch (installError) {
            console.error('❌ Failed to install Sanity CLI:', installError.message);
            return false;
        }
    }
}

// Check if user is logged in to Sanity
function checkSanityLogin() {
    try {
        const result = execSync('sanity debug --json', { stdio: 'pipe', encoding: 'utf8' });
        const debug = JSON.parse(result);
        if (debug.user) {
            console.log(`✅ Logged in as: ${debug.user.name || debug.user.email}`);
            return true;
        }
    } catch (error) {
        console.log('❌ Not logged in to Sanity');
        console.log('\n🔐 Please login to Sanity:');
        console.log('   npx sanity login');
        return false;
    }
    return false;
}

// List current CORS origins
function listCORSOrigins() {
    try {
        console.log('\n📋 Current CORS Origins:');
        const result = execSync(`sanity cors list --project ${PROJECT_ID}`, { 
            stdio: 'pipe', 
            encoding: 'utf8' 
        });
        console.log(result);
        return true;
    } catch (error) {
        console.error('❌ Failed to list CORS origins:', error.message);
        return false;
    }
}

// Add CORS origins for development
function addDevelopmentOrigins() {
    console.log('\n🌐 Adding development CORS origins...');
    
    for (const origin of DEVELOPMENT_ORIGINS) {
        try {
            console.log(`   Adding: ${origin}`);
            execSync(`sanity cors add "${origin}" --project ${PROJECT_ID}`, { 
                stdio: 'pipe' 
            });
            console.log(`   ✅ Added: ${origin}`);
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log(`   ℹ️  Already exists: ${origin}`);
            } else {
                console.log(`   ❌ Failed to add: ${origin} - ${error.message}`);
            }
        }
    }
}

// Main function
async function main() {
    // Step 1: Check Sanity CLI
    if (!checkSanityCLI()) {
        console.log('\n❌ Cannot proceed without Sanity CLI');
        process.exit(1);
    }

    // Step 2: Check login status
    if (!checkSanityLogin()) {
        console.log('\n❌ Please login first: npx sanity login');
        console.log('   Then run this script again');
        process.exit(1);
    }

    // Step 3: List current origins
    listCORSOrigins();

    // Step 4: Add development origins
    addDevelopmentOrigins();

    // Step 5: List updated origins
    console.log('\n📋 Updated CORS Origins:');
    listCORSOrigins();

    console.log('\n✅ CORS configuration complete!');
    console.log('\n🚀 You can now restart your development server:');
    console.log('   npm run dev');
    console.log('\n💡 Manual configuration alternative:');
    console.log('   Visit: https://www.sanity.io/manage/personal/project/0nks58lj/api/cors-origins');
}

// Run the script
main().catch(error => {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
});
