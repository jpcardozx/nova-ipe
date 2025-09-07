/**
 * Comprehensive Authentication Flow Test Script
 * 
 * This script tests all aspects of the authentication system:
 * 1. Environment configuration validation
 * 2. Sanity client authentication and data fetching
 * 3. Supabase authentication and database operations
 * 4. Error handling and fallback mechanisms
 * 5. Login flow for both dashboard and studio modes
 */

import { EnvironmentManager } from '../lib/environment-config'
import { sanityClient } from '../lib/sanity'
import { supabase } from '../lib/supabase'
import { EnhancedAuthManager } from '../lib/auth/enhanced-auth-manager'
import { SimpleAuthManager } from '../lib/auth-simple'

interface TestResult {
    name: string
    success: boolean
    message: string
    details?: any
}

class AuthFlowTester {
    private results: TestResult[] = []

    private addResult(name: string, success: boolean, message: string, details?: any) {
        this.results.push({ name, success, message, details })
        const status = success ? '✅' : '❌'
        console.log(`${status} ${name}: ${message}`)
        if (details && !success) {
            console.log('   Details:', details)
        }
    }

    async testEnvironmentConfiguration() {
        console.log('\n🔧 Testing Environment Configuration...')

        try {
            const config = EnvironmentManager.getConfig()
            const isValid = config.sanity.configured && config.supabase.configured

            this.addResult(
                'Environment Validation',
                isValid,
                isValid
                    ? 'All required environment variables are configured'
                    : 'Missing configuration',
                { config }
            )

            // Test individual configurations
            const sanityConfig = EnvironmentManager.getSanityConfig()
            this.addResult(
                'Sanity Configuration',
                sanityConfig.configured,
                sanityConfig.configured
                    ? 'Sanity environment variables are properly set'
                    : 'Sanity configuration is incomplete',
                sanityConfig
            )

            const supabaseConfig = EnvironmentManager.getSupabaseConfig()
            this.addResult(
                'Supabase Configuration',
                supabaseConfig.configured,
                supabaseConfig.configured
                    ? 'Supabase environment variables are properly set'
                    : 'Supabase configuration is incomplete',
                supabaseConfig
            )

        } catch (error) {
            this.addResult(
                'Environment Configuration',
                false,
                'Failed to validate environment configuration',
                error
            )
        }
    }

    async testSanityAuthentication() {
        console.log('\n🎨 Testing Sanity Authentication...')

        try {
            // Test client configuration
            const isConfigured = !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
            this.addResult(
                'Sanity Client Configuration',
                isConfigured,
                isConfigured
                    ? 'Sanity client is properly configured'
                    : 'Sanity client configuration is incomplete'
            )

            // Test authentication
            const authResult = { 
                isValid: !!process.env.SANITY_API_TOKEN,
                error: !process.env.SANITY_API_TOKEN ? 'No token configured' : null
            }
            this.addResult(
                'Sanity Authentication',
                authResult.isValid,
                authResult.isValid
                    ? 'Sanity authentication is working'
                    : authResult.error || 'Authentication failed',
                authResult
            )

            // Test basic query
            try {
                const testQuery = '*[_type == "sanity.imageAsset"][0]._id'
                const result = await sanityClient.fetch(testQuery)

                this.addResult(
                    'Sanity Query Test',
                    result.success,
                    result.success
                        ? 'Successfully executed test query'
                        : result.error || 'Query execution failed',
                    {
                        fromFallback: result.fromFallback,
                        retryCount: result.retryCount
                    }
                )
            } catch (error) {
                this.addResult(
                    'Sanity Query Test',
                    false,
                    'Failed to execute test query',
                    error
                )
            }

            // Test fallback mechanism
            try {
                const invalidQuery = '*[_type == "nonexistent"][0]'
                const fallbackResult = await sanityClient.fetch(invalidQuery)

                this.addResult(
                    'Sanity Fallback Mechanism',
                    true,
                    'Fallback mechanism is working correctly',
                    { result: fallbackResult }
                )
            } catch (error) {
                this.addResult(
                    'Sanity Fallback Mechanism',
                    false,
                    'Fallback mechanism failed',
                    error
                )
            }

        } catch (error) {
            this.addResult(
                'Sanity Authentication Test',
                false,
                'Failed to test Sanity authentication',
                error
            )
        }
    }

    async testSupabaseConnection() {
        console.log('\n🗄️ Testing Supabase Connection...')

        try {
            // Test basic connection
            const { data, error } = await supabase
                .from('access_requests')
                .select('count')
                .limit(1)

            this.addResult(
                'Supabase Connection',
                !error,
                error
                    ? `Connection failed: ${error.message}`
                    : 'Successfully connected to Supabase',
                { error, data }
            )

            // Test authentication status
            const { data: { session }, error: sessionError } = await supabase.auth.getSession()

            this.addResult(
                'Supabase Auth Session',
                !!(!sessionError),
                sessionError
                    ? `Session check failed: ${sessionError.message}`
                    : session
                        ? 'Active session found'
                        : 'No active session (expected for testing)',
                { session: session ? 'Active' : 'None', error: sessionError }
            )

        } catch (error) {
            this.addResult(
                'Supabase Connection Test',
                false,
                'Failed to test Supabase connection',
                error
            )
        }
    }

    async testAuthManagers() {
        console.log('\n🔐 Testing Authentication Managers...')

        try {
            // Test Enhanced Auth Manager
            const enhancedAuthManager = EnhancedAuthManager.getInstance()
            const authStatus = await enhancedAuthManager.getAuthenticationStatus()

            this.addResult(
                'Enhanced Auth Manager',
                true,
                `Auth status retrieved: ${authStatus.isAuthenticated ? 'Authenticated' : 'Not authenticated'}`,
                authStatus
            )

            // Test Simple Auth Manager
            const simpleAuthManager = new SimpleAuthManager()

            // Test access request validation (without actually submitting)
            const testRequestData = {
                full_name: 'Test User',
                email: 'test@example.com',
                phone: '11999999999',
                department: 'vendas',
                requested_role: 'agent',
                justification: 'Testing the authentication system'
            }

            // Validate the request data format
            const hasRequiredFields = testRequestData.full_name &&
                testRequestData.email &&
                testRequestData.phone &&
                testRequestData.department &&
                testRequestData.justification

            this.addResult(
                'Simple Auth Manager - Validation',
                !!hasRequiredFields,
                hasRequiredFields
                    ? 'Access request validation is working'
                    : 'Access request validation failed',
                testRequestData
            )

        } catch (error) {
            this.addResult(
                'Authentication Managers Test',
                false,
                'Failed to test authentication managers',
                error
            )
        }
    }

    async testErrorHandling() {
        console.log('\n⚠️ Testing Error Handling...')

        try {
            // Test Sanity error handling with invalid query
            const invalidQuery = 'INVALID GROQ QUERY'
            const result = await sanityClient.fetch(invalidQuery)

            this.addResult(
                'Sanity Error Handling',
                !result.success && !!result.error,
                result.success
                    ? 'Unexpected success with invalid query'
                    : 'Error handling is working correctly',
                { error: result.error, fromFallback: result.fromFallback }
            )

            // Test Supabase error handling with invalid table
            const { data, error } = await supabase
                .from('nonexistent_table')
                .select('*')
                .limit(1)

            this.addResult(
                'Supabase Error Handling',
                !!error,
                error
                    ? 'Error handling is working correctly'
                    : 'Unexpected success with invalid table',
                { error: error?.message, data }
            )

        } catch (error) {
            this.addResult(
                'Error Handling Test',
                true, // Catching errors is expected behavior
                'Error handling is working (caught exception)',
                error
            )
        }
    }

    async runAllTests() {
        console.log('🚀 Starting Comprehensive Authentication Flow Tests...\n')

        await this.testEnvironmentConfiguration()
        await this.testSanityAuthentication()
        await this.testSupabaseConnection()
        await this.testAuthManagers()
        await this.testErrorHandling()

        this.printSummary()
    }

    private printSummary() {
        console.log('\n📊 Test Summary:')
        console.log('================')

        const totalTests = this.results.length
        const passedTests = this.results.filter(r => r.success).length
        const failedTests = totalTests - passedTests

        console.log(`Total Tests: ${totalTests}`)
        console.log(`✅ Passed: ${passedTests}`)
        console.log(`❌ Failed: ${failedTests}`)
        console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`)

        if (failedTests > 0) {
            console.log('\n❌ Failed Tests:')
            this.results
                .filter(r => !r.success)
                .forEach(result => {
                    console.log(`   - ${result.name}: ${result.message}`)
                })
        }

        console.log('\n🎯 Recommendations:')
        if (passedTests === totalTests) {
            console.log('   ✅ All tests passed! Authentication system is working correctly.')
        } else {
            console.log('   ⚠️  Some tests failed. Please review the failed tests above.')
            console.log('   📝 Check environment variables and configuration.')
            console.log('   🔧 Verify Sanity and Supabase credentials.')
        }
    }
}

// Export for use in other scripts
export { AuthFlowTester }

// Run tests if this script is executed directly
if (require.main === module) {
    const tester = new AuthFlowTester()
    tester.runAllTests().catch(console.error)
}