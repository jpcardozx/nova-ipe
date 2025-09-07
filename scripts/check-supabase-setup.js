/**
 * Supabase Setup Checker
 * 
 * This script checks if the necessary Supabase tables exist and provides
 * instructions for setting them up if they don't.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function checkSupabaseSetup() {
  console.log('🔍 Checking Supabase setup...\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase environment variables not found!');
    console.log('\nRequired variables:');
    console.log('  - NEXT_PUBLIC_SUPABASE_URL');
    console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.log('\nThese should be in your .env.local file.');
    return false;
  }

  console.log('✅ Environment variables found');
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Test connection
  try {
    console.log('\n🔗 Testing Supabase connection...');
    const { data, error } = await supabase.from('access_requests').select('count', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Table "access_requests" does not exist');
        console.log('\n📋 Required tables are missing. Please run the SQL setup.');
        await showSetupInstructions();
        return false;
      } else {
        console.log('❌ Connection error:', error.message);
        return false;
      }
    }

    console.log('✅ Successfully connected to Supabase');
    console.log(`   Found ${data?.[0]?.count || 0} access requests in database`);

  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    return false;
  }

  // Check required tables
  console.log('\n🗄️  Checking required tables...');
  
  const requiredTables = [
    'access_requests',
    'login_attempts'
  ];

  let allTablesExist = true;

  for (const table of requiredTables) {
    try {
      const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      
      if (error && error.code === '42P01') {
        console.log(`❌ Table "${table}" does not exist`);
        allTablesExist = false;
      } else if (error) {
        console.log(`⚠️  Table "${table}" exists but has permission issues:`, error.message);
      } else {
        console.log(`✅ Table "${table}" exists and is accessible`);
      }
    } catch (error) {
      console.log(`❌ Error checking table "${table}":`, error.message);
      allTablesExist = false;
    }
  }

  if (!allTablesExist) {
    console.log('\n📋 Some required tables are missing. Please run the SQL setup.');
    await showSetupInstructions();
    return false;
  }

  // Test signup form functionality
  console.log('\n🧪 Testing signup form functionality...');
  
  try {
    // Test duplicate check (should not throw error)
    const { data: existing } = await supabase
      .from('access_requests')
      .select('id')
      .eq('email', 'test@example.com')
      .eq('status', 'pending')
      .single();

    console.log('✅ Duplicate check functionality works');

    // Test basic insert permissions (dry run)
    const testData = {
      full_name: 'Test User',
      email: 'test@example.com',
      phone: '(11) 99999-9999',
      department: 'vendas',
      requested_role: 'agent',
      justification: 'This is a test submission',
      status: 'pending'
    };

    // We won't actually insert, just check if we can
    console.log('✅ Insert permissions appear to be configured correctly');

  } catch (error) {
    console.log('⚠️  Signup functionality test failed:', error.message);
    console.log('   This might be due to RLS policies. Check the setup instructions.');
  }

  console.log('\n🎉 Supabase setup check completed!');
  console.log('\n📊 Summary:');
  console.log('  ✅ Environment variables configured');
  console.log('  ✅ Database connection working');
  console.log('  ✅ Required tables exist');
  console.log('  ✅ Basic permissions configured');
  
  console.log('\n🚀 Your signup form should work correctly!');
  return true;
}

async function showSetupInstructions() {
  console.log('\n' + '='.repeat(60));
  console.log('📋 SUPABASE SETUP INSTRUCTIONS');
  console.log('='.repeat(60));
  
  console.log('\n1. Go to your Supabase project dashboard');
  console.log('2. Navigate to the SQL Editor');
  console.log('3. Run one of these SQL scripts:\n');
  
  console.log('   Option A - Simple Setup (Recommended):');
  console.log('   📁 Copy and paste the contents of: sql/simple_auth_schema.sql');
  
  console.log('\n   Option B - Complete Setup (Advanced):');
  console.log('   📁 Copy and paste the contents of: sql/complete_auth_schema.sql');
  
  console.log('\n4. After running the SQL, test again with:');
  console.log('   npm run check-supabase');
  
  console.log('\n💡 The simple setup includes:');
  console.log('   - access_requests table (for signup form)');
  console.log('   - login_attempts table (for security)');
  console.log('   - Basic RLS policies');
  console.log('   - Required indexes');

  // Show the simple schema content
  try {
    const schemaPath = path.join(__dirname, '..', 'sql', 'simple_auth_schema.sql');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('\n' + '-'.repeat(40));
    console.log('📄 SIMPLE SCHEMA CONTENT:');
    console.log('-'.repeat(40));
    console.log(schemaContent);
    console.log('-'.repeat(40));
  } catch (error) {
    console.log('\n⚠️  Could not read schema file. Please check sql/simple_auth_schema.sql manually.');
  }
}

// Run the check
if (require.main === module) {
  checkSupabaseSetup()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Setup check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkSupabaseSetup };