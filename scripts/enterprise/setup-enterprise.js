#!/usr/bin/env node
/**
 * Enterprise System Setup and Test
 * Prepares and validates the enterprise architecture system
 */

import { execSync } from 'child_process'
import { chmodSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '../..')

// Enterprise scripts to make executable
const ENTERPRISE_SCRIPTS = [
  'scripts/enterprise/architecture-validator.js',
  'scripts/enterprise/auto-remediation.js', 
  'scripts/enterprise/performance-monitor.js',
  'scripts/enterprise/enterprise-control.js'
]

async function setupEnterpriseSystem() {
  console.log(chalk.bold.cyan('\n🏗️  ENTERPRISE SYSTEM SETUP\n'))
  
  try {
    // 1. Make scripts executable
    console.log(chalk.blue('📁 Making scripts executable...'))
    for (const script of ENTERPRISE_SCRIPTS) {
      const scriptPath = join(rootDir, script)
      if (existsSync(scriptPath)) {
        chmodSync(scriptPath, '755')
        console.log(chalk.gray(`  ✓ ${script}`))
      } else {
        console.log(chalk.red(`  ❌ Missing: ${script}`))
      }
    }
    
    // 2. Install missing dependencies if needed
    console.log(chalk.blue('\n📦 Checking dependencies...'))
    
    try {
      // Check if chalk is available (used by enterprise scripts)
      const packageJson = JSON.parse(execSync('cat package.json', { cwd: rootDir, encoding: 'utf8' }))
      const hasChalk = packageJson.dependencies?.chalk || packageJson.devDependencies?.chalk
      
      if (!hasChalk) {
        console.log(chalk.yellow('  Installing chalk for enterprise scripts...'))
        execSync('npm install chalk --save-dev', { cwd: rootDir, stdio: 'inherit' })
      } else {
        console.log(chalk.green('  ✓ Dependencies OK'))
      }
    } catch (error) {
      console.log(chalk.yellow('  ⚠️  Dependency check skipped'))
    }
    
    // 3. Test enterprise scripts
    console.log(chalk.blue('\n🧪 Testing enterprise system...'))
    
    // Test architecture validator
    console.log(chalk.gray('  Testing architecture validator...'))
    try {
      execSync('node scripts/enterprise/architecture-validator.js --help > /dev/null 2>&1', { cwd: rootDir })
      console.log(chalk.green('  ✓ Architecture Validator'))
    } catch {
      console.log(chalk.red('  ❌ Architecture Validator'))
    }
    
    // Test auto-remediation
    console.log(chalk.gray('  Testing auto-remediation...'))
    try {
      execSync('node scripts/enterprise/auto-remediation.js --dry-run > /dev/null 2>&1', { cwd: rootDir })
      console.log(chalk.green('  ✓ Auto-Remediation Engine'))
    } catch {
      console.log(chalk.red('  ❌ Auto-Remediation Engine'))
    }
    
    // Test performance monitor
    console.log(chalk.gray('  Testing performance monitor...'))
    try {
      execSync('node scripts/enterprise/performance-monitor.js --skip-build > /dev/null 2>&1', { cwd: rootDir })
      console.log(chalk.green('  ✓ Performance Monitor'))
    } catch {
      console.log(chalk.red('  ❌ Performance Monitor'))
    }
    
    // Test control center
    console.log(chalk.gray('  Testing enterprise control center...'))
    try {
      execSync('node scripts/enterprise/enterprise-control.js --help > /dev/null 2>&1', { cwd: rootDir })
      console.log(chalk.green('  ✓ Enterprise Control Center'))
    } catch {
      console.log(chalk.red('  ❌ Enterprise Control Center'))
    }
    
    // 4. Validate npm scripts
    console.log(chalk.blue('\n📋 Validating npm scripts...'))
    const enterpriseScripts = [
      'enterprise:diagnostic',
      'enterprise:validate', 
      'enterprise:remediate',
      'enterprise:performance',
      'enterprise:monitor',
      'enterprise:health',
      'enterprise:score'
    ]
    
    for (const script of enterpriseScripts) {
      try {
        execSync(`npm run ${script} --help > /dev/null 2>&1`, { cwd: rootDir })
        console.log(chalk.green(`  ✓ npm run ${script}`))
      } catch {
        console.log(chalk.yellow(`  ⚠️  npm run ${script} (may require build)`))
      }
    }
    
    // 5. Success message
    console.log(chalk.green.bold('\n✅ ENTERPRISE SYSTEM SETUP COMPLETE!\n'))
    
    console.log(chalk.bold('🚀 Quick Start Commands:'))
    console.log(chalk.blue('  npm run enterprise:diagnostic   ') + chalk.gray('# Full architecture analysis'))
    console.log(chalk.blue('  npm run enterprise:validate     ') + chalk.gray('# Quick compliance check'))
    console.log(chalk.blue('  npm run enterprise:remediate    ') + chalk.gray('# Auto-fix critical issues'))
    console.log(chalk.blue('  npm run enterprise:performance  ') + chalk.gray('# Performance budget check'))
    
    console.log(chalk.bold('\n📚 Documentation:'))
    console.log(chalk.blue('  ENTERPRISE_ARCHITECTURE_RECORD.md  ') + chalk.gray('# Technical strategy'))
    console.log(chalk.blue('  ENTERPRISE_SYSTEM.md               ') + chalk.gray('# System guide'))
    
    console.log(chalk.bold('\n🎯 Next Steps:'))
    console.log(chalk.yellow('  1. Run enterprise diagnostic to assess current state'))
    console.log(chalk.yellow('  2. Execute critical remediations to fix major issues'))
    console.log(chalk.yellow('  3. Set up continuous monitoring for ongoing oversight'))
    
  } catch (error) {
    console.error(chalk.red('\n❌ Enterprise system setup failed:'), error.message)
    process.exit(1)
  }
}

// Quick validation function
async function validateSystem() {
  console.log(chalk.bold.cyan('\n🔍 ENTERPRISE SYSTEM VALIDATION\n'))
  
  const checks = [
    {
      name: 'Enterprise Scripts',
      check: () => ENTERPRISE_SCRIPTS.every(script => existsSync(join(rootDir, script)))
    },
    {
      name: 'Package.json Scripts',
      check: () => {
        try {
          const pkg = JSON.parse(execSync('cat package.json', { cwd: rootDir, encoding: 'utf8' }))
          return pkg.scripts['enterprise:diagnostic'] && pkg.scripts['enterprise:validate']
        } catch {
          return false
        }
      }
    },
    {
      name: 'Documentation',
      check: () => existsSync(join(rootDir, 'ENTERPRISE_ARCHITECTURE_RECORD.md')) && 
                  existsSync(join(rootDir, 'ENTERPRISE_SYSTEM.md'))
    }
  ]
  
  let allPassed = true
  
  for (const check of checks) {
    const passed = check.check()
    console.log(`${passed ? '✅' : '❌'} ${check.name}`)
    if (!passed) allPassed = false
  }
  
  console.log(chalk.bold(`\n${allPassed ? '✅' : '❌'} System Status: ${allPassed ? 'READY' : 'INCOMPLETE'}`))
  
  return allPassed
}

// CLI interface
async function main() {
  const command = process.argv[2] || 'setup'
  
  switch (command) {
    case 'setup':
      await setupEnterpriseSystem()
      break
      
    case 'validate':
      const isValid = await validateSystem()
      process.exit(isValid ? 0 : 1)
      break
      
    case 'test':
      // Run a quick diagnostic
      console.log(chalk.bold.cyan('\n🧪 ENTERPRISE SYSTEM TEST\n'))
      try {
        execSync('npm run enterprise:validate', { cwd: rootDir, stdio: 'inherit' })
        console.log(chalk.green.bold('\n✅ Enterprise system test passed!'))
      } catch (error) {
        console.log(chalk.red.bold('\n❌ Enterprise system test failed!'))
        process.exit(1)
      }
      break
      
    default:
      console.log(chalk.bold.cyan('🏗️  Enterprise System Setup\n'))
      console.log('Commands:')
      console.log('  setup      - Set up enterprise system (default)')
      console.log('  validate   - Validate system completeness') 
      console.log('  test       - Run enterprise system test')
      console.log()
      console.log('Usage:')
      console.log('  node setup-enterprise.js setup')
      console.log('  node setup-enterprise.js validate')
      console.log('  node setup-enterprise.js test')
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(chalk.red('Setup failed:'), error)
    process.exit(1)
  })
}
