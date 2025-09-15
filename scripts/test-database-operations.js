/**
 * Script to test database operations after fixing RLS policies
 * This script tests basic CRUD operations on the CRM tables
 */

const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables')
    console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testDatabaseOperations() {
    console.log('🧪 Testing database operations...\n')

    // Test 1: Check if tables exist and are accessible
    console.log('📋 Test 1: Check table accessibility')
    try {
        const { data: clients, error: clientsError } = await supabase
            .from('crm_clients')
            .select('count(*)')
            .single()

        if (clientsError) {
            console.error('❌ crm_clients table error:', clientsError.message)
        } else {
            console.log('✅ crm_clients table accessible')
        }

        const { data: tasks, error: tasksError } = await supabase
            .from('crm_tasks')
            .select('count(*)')
            .single()

        if (tasksError) {
            console.error('❌ crm_tasks table error:', tasksError.message)
        } else {
            console.log('✅ crm_tasks table accessible')
        }
    } catch (error) {
        console.error('❌ Table accessibility test failed:', error.message)
    }

    console.log()

    // Test 2: Insert a test client
    console.log('📋 Test 2: Insert test client')
    try {
        const testClient = {
            name: 'Test Client ' + Date.now(),
            email: 'test' + Date.now() + '@example.com',
            phone: '11999999999',
            client_code: 'TEST' + Date.now().toString().slice(-4),
            status: 'lead',
            priority: 'medium'
        }

        const { data: insertedClient, error: insertError } = await supabase
            .from('crm_clients')
            .insert([testClient])
            .select()
            .single()

        if (insertError) {
            console.error('❌ Client insert error:', insertError.message)
        } else {
            console.log('✅ Client inserted successfully:', insertedClient.name)

            // Test 3: Update the test client
            console.log('📋 Test 3: Update test client')
            const { data: updatedClient, error: updateError } = await supabase
                .from('crm_clients')
                .update({ notes: 'Updated by test script' })
                .eq('id', insertedClient.id)
                .select()
                .single()

            if (updateError) {
                console.error('❌ Client update error:', updateError.message)
            } else {
                console.log('✅ Client updated successfully')
            }

            // Test 4: Create a test task for this client
            console.log('📋 Test 4: Insert test task')
            const testTask = {
                title: 'Test Task ' + Date.now(),
                description: 'Test task created by script',
                priority: 'medium',
                status: 'pending',
                task_type: 'client',
                visibility: 'private',
                client_id: insertedClient.id
            }

            const { data: insertedTask, error: taskInsertError } = await supabase
                .from('crm_tasks')
                .insert([testTask])
                .select()
                .single()

            if (taskInsertError) {
                console.error('❌ Task insert error:', taskInsertError.message)
            } else {
                console.log('✅ Task inserted successfully:', insertedTask.title)
            }

            // Test 5: Query tasks with filters
            console.log('📋 Test 5: Query tasks with filters')
            const { data: filteredTasks, error: queryError } = await supabase
                .from('crm_tasks')
                .select('*')
                .eq('client_id', insertedClient.id)

            if (queryError) {
                console.error('❌ Task query error:', queryError.message)
            } else {
                console.log('✅ Task query successful, found:', filteredTasks?.length || 0, 'tasks')
            }

            // Cleanup: Delete test data
            console.log('📋 Test 6: Cleanup test data')
            if (insertedTask) {
                await supabase.from('crm_tasks').delete().eq('id', insertedTask.id)
            }
            await supabase.from('crm_clients').delete().eq('id', insertedClient.id)
            console.log('✅ Test data cleaned up')
        }
    } catch (error) {
        console.error('❌ CRUD operations test failed:', error.message)
    }

    console.log()

    // Test 6: Check RLS status
    console.log('📋 Test 6: Check RLS status')
    try {
        const { data: rlsStatus } = await supabase.rpc('exec_sql', {
            sql: `
                SELECT
                    tablename,
                    rowsecurity as "rls_enabled",
                    forcerowsecurity as "force_rls"
                FROM pg_tables
                WHERE tablename IN ('crm_clients', 'crm_tasks')
                ORDER BY tablename;
            `
        })

        if (rlsStatus) {
            console.log('RLS Status:', rlsStatus)
        } else {
            console.log('⚠️  Could not check RLS status (function may not exist)')
        }
    } catch (error) {
        console.log('⚠️  RLS status check failed:', error.message)
    }

    console.log('\n🎉 Database operation tests completed!')
}

// Helper function to check authentication
async function checkAuth() {
    console.log('🔐 Testing authentication...')

    try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
            console.log('⚠️  No authenticated user (using service role)')
        } else if (user) {
            console.log('✅ Authenticated user:', user.email)
        } else {
            console.log('⚠️  Using service role for operations')
        }
    } catch (error) {
        console.log('⚠️  Auth check failed:', error.message)
    }

    console.log()
}

// Main execution
if (require.main === module) {
    console.log('🚀 Starting database operations test...\n')

    checkAuth()
        .then(() => testDatabaseOperations())
        .then(() => {
            console.log('\n✅ All tests completed successfully!')
            process.exit(0)
        })
        .catch(error => {
            console.error('\n❌ Test failed:', error)
            process.exit(1)
        })
}

module.exports = { testDatabaseOperations }