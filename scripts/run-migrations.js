const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables')
    console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigrations() {
    console.log('🚀 Starting database migrations...\n')

    // Create migrations table if it doesn't exist
    console.log('📋 Creating migrations tracking table...')
    const createMigrationsTableSQL = `
        CREATE TABLE IF NOT EXISTS migrations (
            id SERIAL PRIMARY KEY,
            filename VARCHAR(255) UNIQUE NOT NULL,
            executed_at TIMESTAMPTZ DEFAULT NOW(),
            checksum VARCHAR(64)
        );
    `

    try {
        await supabase.rpc('exec_sql', { sql: createMigrationsTableSQL })
        console.log('✅ Migrations table ready\n')
    } catch (error) {
        console.error('❌ Failed to create migrations table:', error.message)
        return
    }

    // Get list of migration files
    const migrationsDir = path.join(__dirname, '../sql')
    const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort()

    console.log(`📁 Found ${migrationFiles.length} migration files\n`)

    // Get already executed migrations
    const { data: executedMigrations, error: fetchError } = await supabase
        .from('migrations')
        .select('filename')

    if (fetchError) {
        console.error('❌ Failed to fetch executed migrations:', fetchError.message)
        return
    }

    const executedFilenames = new Set(executedMigrations?.map(m => m.filename) || [])

    // Execute each migration
    for (const filename of migrationFiles) {
        if (executedFilenames.has(filename)) {
            console.log(`⏭️  Skipping ${filename} (already executed)`)
            continue
        }

        console.log(`🔧 Executing migration: ${filename}`)

        try {
            // Read migration file
            const filePath = path.join(migrationsDir, filename)
            const sql = fs.readFileSync(filePath, 'utf8')

            // Calculate checksum
            const crypto = require('crypto')
            const checksum = crypto.createHash('sha256').update(sql).digest('hex')

            // Execute migration
            const { error: execError } = await supabase.rpc('exec_sql', { sql })

            if (execError) {
                throw new Error(`Migration execution failed: ${execError.message}`)
            }

            // Record migration as executed
            const { error: insertError } = await supabase
                .from('migrations')
                .insert({
                    filename,
                    checksum
                })

            if (insertError) {
                throw new Error(`Failed to record migration: ${insertError.message}`)
            }

            console.log(`✅ Migration ${filename} completed successfully`)

        } catch (error) {
            console.error(`❌ Migration ${filename} failed:`, error.message)
            console.error('🛑 Stopping migration process')
            process.exit(1)
        }
    }

    console.log('\n🎉 All migrations completed successfully!')
    console.log('\n📊 Migration Summary:')
    console.log(`   • Total files: ${migrationFiles.length}`)
    console.log(`   • Executed: ${migrationFiles.filter(f => !executedFilenames.has(f)).length}`)
    console.log(`   • Skipped: ${migrationFiles.filter(f => executedFilenames.has(f)).length}`)
}

// Helper function to execute raw SQL (needs to be created in Supabase)
async function createExecSqlFunction() {
    console.log('🔧 Creating exec_sql helper function...')

    const execSqlFunction = `
        CREATE OR REPLACE FUNCTION exec_sql(sql text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
            EXECUTE sql;
        END;
        $$;
    `

    try {
        // This needs to be executed directly in Supabase SQL editor first
        console.log('⚠️  Please execute the following SQL in your Supabase SQL editor first:')
        console.log(execSqlFunction)
        console.log('\nThen run this script again.')
    } catch (error) {
        console.error('❌ Error:', error.message)
    }
}

// Main execution
if (require.main === module) {
    runMigrations().catch(error => {
        console.error('❌ Migration failed:', error)
        process.exit(1)
    })
}

module.exports = { runMigrations }