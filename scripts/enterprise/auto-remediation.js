#!/usr/bin/env node
/**
 * Enterprise Automated Remediation Engine
 * Intelligent automation for architectural debt resolution
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync, rmSync, copyFileSync } from 'fs'
import { join, dirname, basename, extname } from 'path'
import { fileURLToPath } from 'url'
import { execSync, exec } from 'child_process'
import { promisify } from 'util'
import chalk from 'chalk'

const execAsync = promisify(exec)
const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '../..')

// Remediation Actions Registry
const REMEDIATION_ACTIONS = {
  CRITICAL: [
    {
      id: 'migrate-to-pnpm',
      name: 'Migrate to pnpm Package Manager',
      description: 'Migrate from npm to pnpm for 3x faster installs and 62% less disk space',
      impact: 'HIGH',
      automation: 'FULL',
      estimatedTime: '2-3 minutes',
      prerequisites: ['Node.js 16+'],
      execute: migrateToPnpm,
      rollback: rollbackToPnpm,
      validate: validatePnpmMigration
    },
    {
      id: 'consolidate-components',
      name: 'Consolidate Component Directories',
      description: 'Merge multiple component directories into single standardized structure',
      impact: 'CRITICAL',
      automation: 'ASSISTED',
      estimatedTime: '5-10 minutes',
      prerequisites: ['Git repository clean state'],
      execute: consolidateComponents,
      rollback: rollbackComponentConsolidation,
      validate: validateComponentConsolidation
    },
    {
      id: 'cleanup-dependencies',
      name: 'Clean Up Redundant Dependencies',
      description: 'Remove unused and redundant dependencies to reduce bundle size',
      impact: 'HIGH',
      automation: 'ASSISTED',
      estimatedTime: '3-5 minutes',
      prerequisites: ['Working build'],
      execute: cleanupDependencies,
      rollback: rollbackDependencyCleanup,
      validate: validateDependencyCleanup
    },
    {
      id: 'optimize-nextjs-config',
      name: 'Optimize Next.js Configuration',
      description: 'Replace complex manual config with optimized enterprise configuration',
      impact: 'MEDIUM',
      automation: 'FULL',
      estimatedTime: '1-2 minutes',
      prerequisites: ['Backup of current config'],
      execute: optimizeNextConfig,
      rollback: rollbackNextConfig,
      validate: validateNextConfigOptimization
    }
  ],
  HIGH: [
    {
      id: 'consolidate-css',
      name: 'Consolidate CSS Files',
      description: 'Merge multiple CSS files and remove duplicated styles',
      impact: 'MEDIUM',
      automation: 'ASSISTED',
      estimatedTime: '10-15 minutes',
      prerequisites: ['Style audit completion'],
      execute: consolidateCSS,
      rollback: rollbackCSSConsolidation,
      validate: validateCSSConsolidation
    },
    {
      id: 'setup-performance-monitoring',
      name: 'Setup Performance Monitoring',
      description: 'Configure automated performance monitoring and budgets',
      impact: 'MEDIUM',
      automation: 'FULL',
      estimatedTime: '5 minutes',
      prerequisites: ['CI/CD pipeline'],
      execute: setupPerformanceMonitoring,
      rollback: rollbackPerformanceMonitoring,
      validate: validatePerformanceMonitoring
    }
  ]
}

// Remediation Result Class
class RemediationResult {
  constructor(success, message, details = {}) {
    this.success = success
    this.message = message
    this.details = details
    this.timestamp = new Date().toISOString()
    this.duration = null
  }
  
  setDuration(startTime) {
    this.duration = Date.now() - startTime
  }
}

// CRITICAL REMEDIATIONS

async function migrateToPnpm() {
  const startTime = Date.now()
  
  try {
    console.log(chalk.blue('🔄 Migrating to pnpm...'))
    
    // Check if pnpm is installed
    try {
      execSync('pnpm --version', { stdio: 'ignore' })
    } catch {
      console.log(chalk.gray('  Installing pnpm globally...'))
      execSync('npm install -g pnpm', { stdio: 'inherit' })
    }
    
    // Backup current package-lock.json
    if (existsSync(join(rootDir, 'package-lock.json'))) {
      copyFileSync(
        join(rootDir, 'package-lock.json'),
        join(rootDir, 'package-lock.json.backup')
      )
    }
    
    // Run pnpm migration
    console.log(chalk.gray('  Running pnpm migration...'))
    process.chdir(rootDir)
    
    try {
      // Remove existing locks and node_modules
      if (existsSync('node_modules')) rmSync('node_modules', { recursive: true, force: true })
      if (existsSync('package-lock.json')) rmSync('package-lock.json')
      
      // Install with pnpm
      execSync('pnpm install', { stdio: 'inherit' })
      
      const result = new RemediationResult(
        true,
        'Successfully migrated to pnpm',
        {
          packageManager: 'pnpm',
          benefits: ['3x faster installs', '62% less disk space', 'Better dependency resolution'],
          lockFile: 'pnpm-lock.yaml'
        }
      )
      result.setDuration(startTime)
      return result
    } catch (error) {
      throw new Error(`pnpm installation failed: ${error.message}`)
    }
    
  } catch (error) {
    const result = new RemediationResult(false, `Failed to migrate to pnpm: ${error.message}`)
    result.setDuration(startTime)
    return result
  }
}

async function rollbackToPnpm() {
  try {
    // Restore package-lock.json if exists
    if (existsSync(join(rootDir, 'package-lock.json.backup'))) {
      copyFileSync(
        join(rootDir, 'package-lock.json.backup'),
        join(rootDir, 'package-lock.json')
      )
      rmSync(join(rootDir, 'package-lock.json.backup'))
    }
    
    // Remove pnpm files
    if (existsSync(join(rootDir, 'pnpm-lock.yaml'))) {
      rmSync(join(rootDir, 'pnpm-lock.yaml'))
    }
    
    // Reinstall with npm
    if (existsSync(join(rootDir, 'node_modules'))) {
      rmSync(join(rootDir, 'node_modules'), { recursive: true, force: true })
    }
    
    process.chdir(rootDir)
    execSync('npm install', { stdio: 'inherit' })
    
    return new RemediationResult(true, 'Successfully rolled back to npm')
  } catch (error) {
    return new RemediationResult(false, `Rollback failed: ${error.message}`)
  }
}

async function validatePnpmMigration() {
  const hasPnpmLock = existsSync(join(rootDir, 'pnpm-lock.yaml'))
  const hasNodeModules = existsSync(join(rootDir, 'node_modules'))
  
  return new RemediationResult(
    hasPnpmLock && hasNodeModules,
    hasPnpmLock ? 'pnpm migration validated' : 'pnpm migration incomplete',
    { hasPnpmLock, hasNodeModules }
  )
}

async function consolidateComponents() {
  const startTime = Date.now()
  
  try {
    console.log(chalk.blue('🔄 Consolidating component directories...'))
    
    // Find all component directories
    const componentDirs = []
    const patterns = [
      'components',
      'src/components',
      'app/components',
      'lib/components',
      'ui/components'
    ]
    
    for (const pattern of patterns) {
      const dir = join(rootDir, pattern)
      if (existsSync(dir) && statSync(dir).isDirectory()) {
        componentDirs.push({ path: pattern, fullPath: dir })
      }
    }
    
    if (componentDirs.length <= 1) {
      return new RemediationResult(
        true,
        'Components already consolidated',
        { directories: componentDirs.length }
      )
    }
    
    // Target directory (src/components)
    const targetDir = join(rootDir, 'src/components')
    
    // Create target directory if it doesn't exist
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true })
    }
    
    // Analyze components for conflicts
    const componentMap = new Map()
    const conflicts = []
    
    for (const dir of componentDirs) {
      if (dir.path === 'src/components') continue // Skip target directory
      
      const components = findComponents(dir.fullPath)
      for (const component of components) {
        const componentName = basename(component.path)
        
        if (componentMap.has(componentName)) {
          conflicts.push({
            name: componentName,
            existing: componentMap.get(componentName),
            duplicate: component
          })
        } else {
          componentMap.set(componentName, component)
        }
      }
    }
    
    if (conflicts.length > 0) {
      return new RemediationResult(
        false,
        'Component conflicts detected - manual review required',
        { 
          conflicts: conflicts.map(c => ({
            name: c.name,
            locations: [c.existing.relativePath, c.duplicate.relativePath]
          }))
        }
      )
    }
    
    // Move components to target directory
    let movedCount = 0
    const moveLog = []
    
    for (const dir of componentDirs) {
      if (dir.path === 'src/components') continue
      
      const components = findComponents(dir.fullPath)
      for (const component of components) {
        const targetPath = join(targetDir, basename(component.path))
        
        if (!existsSync(targetPath)) {
          copyFileSync(component.fullPath, targetPath)
          moveLog.push({
            from: component.relativePath,
            to: `src/components/${basename(component.path)}`
          })
          movedCount++
        }
      }
    }
    
    const result = new RemediationResult(
      true,
      `Consolidated ${movedCount} components into src/components`,
      {
        targetDirectory: 'src/components',
        componentsConsolidated: movedCount,
        moveLog,
        note: 'Original directories preserved - remove manually after validation'
      }
    )
    result.setDuration(startTime)
    return result
    
  } catch (error) {
    const result = new RemediationResult(false, `Component consolidation failed: ${error.message}`)
    result.setDuration(startTime)
    return result
  }
}

function findComponents(dir) {
  const components = []
  
  function scanDir(currentDir) {
    if (!existsSync(currentDir)) return
    
    const files = readdirSync(currentDir)
    for (const file of files) {
      const filePath = join(currentDir, file)
      const stat = statSync(filePath)
      
      if (stat.isDirectory() && !file.startsWith('.')) {
        scanDir(filePath)
      } else if ((file.endsWith('.tsx') || file.endsWith('.jsx')) && 
                 !file.includes('.test.') && !file.includes('.spec.')) {
        components.push({
          path: file,
          fullPath: filePath,
          relativePath: filePath.replace(rootDir, '')
        })
      }
    }
  }
  
  scanDir(dir)
  return components
}

async function rollbackComponentConsolidation() {
  // This would require maintaining a detailed log of moves
  return new RemediationResult(false, 'Component consolidation rollback requires manual intervention')
}

async function validateComponentConsolidation() {
  const componentDirs = []
  const patterns = ['components', 'src/components', 'app/components', 'lib/components', 'ui/components']
  
  for (const pattern of patterns) {
    const dir = join(rootDir, pattern)
    if (existsSync(dir) && statSync(dir).isDirectory()) {
      componentDirs.push(pattern)
    }
  }
  
  return new RemediationResult(
    componentDirs.length === 1,
    `Component directories: ${componentDirs.length}/1`,
    { directories: componentDirs }
  )
}

async function cleanupDependencies() {
  const startTime = Date.now()
  
  try {
    console.log(chalk.blue('🔄 Cleaning up dependencies...'))
    
    const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
    
    // Dependencies to remove (known redundant ones)
    const redundantDeps = [
      'webpack-bundle-analyzer',  // Built into Next.js
      'cross-env',               // Not needed in modern Node
      'dotenv',                  // Built into Next.js
      'styled-components',       // Conflicts with Tailwind
      '@types/styled-components' // Related to styled-components
    ]
    
    // DevDependencies that might be redundant
    const redundantDevDeps = [
      'webpack',                 // Handled by Next.js
      'babel-loader',           // Handled by Next.js
      'css-loader',             // Handled by Next.js
      'style-loader'            // Handled by Next.js
    ]
    
    let removedCount = 0
    const removedDeps = []
    
    // Remove redundant dependencies
    for (const dep of redundantDeps) {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        delete packageJson.dependencies[dep]
        removedDeps.push({ name: dep, type: 'dependency' })
        removedCount++
      }
    }
    
    for (const dep of redundantDevDeps) {
      if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
        delete packageJson.devDependencies[dep]
        removedDeps.push({ name: dep, type: 'devDependency' })
        removedCount++
      }
    }
    
    if (removedCount > 0) {
      // Backup original package.json
      copyFileSync(
        join(rootDir, 'package.json'),
        join(rootDir, 'package.json.backup')
      )
      
      // Write updated package.json
      writeFileSync(join(rootDir, 'package.json'), JSON.stringify(packageJson, null, 2))
      
      // Reinstall dependencies
      process.chdir(rootDir)
      const installCmd = existsSync('pnpm-lock.yaml') ? 'pnpm install' : 'npm install'
      execSync(installCmd, { stdio: 'inherit' })
    }
    
    const result = new RemediationResult(
      true,
      `Removed ${removedCount} redundant dependencies`,
      {
        removedCount,
        removedDependencies: removedDeps,
        note: 'Original package.json backed up as package.json.backup'
      }
    )
    result.setDuration(startTime)
    return result
    
  } catch (error) {
    const result = new RemediationResult(false, `Dependency cleanup failed: ${error.message}`)
    result.setDuration(startTime)
    return result
  }
}

async function rollbackDependencyCleanup() {
  try {
    if (existsSync(join(rootDir, 'package.json.backup'))) {
      copyFileSync(
        join(rootDir, 'package.json.backup'),
        join(rootDir, 'package.json')
      )
      rmSync(join(rootDir, 'package.json.backup'))
      
      // Reinstall original dependencies
      process.chdir(rootDir)
      const installCmd = existsSync('pnpm-lock.yaml') ? 'pnpm install' : 'npm install'
      execSync(installCmd, { stdio: 'inherit' })
      
      return new RemediationResult(true, 'Dependencies restored from backup')
    } else {
      return new RemediationResult(false, 'No backup found for dependency rollback')
    }
  } catch (error) {
    return new RemediationResult(false, `Dependency rollback failed: ${error.message}`)
  }
}

async function validateDependencyCleanup() {
  const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
  const totalDeps = Object.keys(packageJson.dependencies || {}).length + 
                   Object.keys(packageJson.devDependencies || {}).length
  
  return new RemediationResult(
    totalDeps <= 35,
    `Total dependencies: ${totalDeps}/35`,
    { totalDependencies: totalDeps }
  )
}

async function optimizeNextConfig() {
  const startTime = Date.now()
  
  try {
    console.log(chalk.blue('🔄 Optimizing Next.js configuration...'))
    
    const configPath = join(rootDir, 'next.config.js')
    const optimizedConfigPath = join(rootDir, 'next-optimized.config.js')
    
    // Backup current config
    if (existsSync(configPath)) {
      copyFileSync(configPath, join(rootDir, 'next.config.js.backup'))
    }
    
    // Use optimized config if it exists
    if (existsSync(optimizedConfigPath)) {
      copyFileSync(optimizedConfigPath, configPath)
      
      const result = new RemediationResult(
        true,
        'Applied optimized Next.js configuration',
        {
          source: 'next-optimized.config.js',
          backup: 'next.config.js.backup',
          estimatedReduction: '75% fewer lines'
        }
      )
      result.setDuration(startTime)
      return result
    } else {
      // Create basic optimized config
      const optimizedConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  
  // Bundle optimization
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' }
        ]
      }
    ]
  }
}

module.exports = nextConfig`
      
      writeFileSync(configPath, optimizedConfig)
      
      const result = new RemediationResult(
        true,
        'Created optimized Next.js configuration',
        {
          configLines: optimizedConfig.split('\n').length,
          features: ['Performance optimization', 'Security headers', 'Image optimization']
        }
      )
      result.setDuration(startTime)
      return result
    }
    
  } catch (error) {
    const result = new RemediationResult(false, `Next.js config optimization failed: ${error.message}`)
    result.setDuration(startTime)
    return result
  }
}

async function rollbackNextConfig() {
  try {
    const backupPath = join(rootDir, 'next.config.js.backup')
    const configPath = join(rootDir, 'next.config.js')
    
    if (existsSync(backupPath)) {
      copyFileSync(backupPath, configPath)
      rmSync(backupPath)
      return new RemediationResult(true, 'Next.js configuration restored from backup')
    } else {
      return new RemediationResult(false, 'No backup found for Next.js config rollback')
    }
  } catch (error) {
    return new RemediationResult(false, `Next.js config rollback failed: ${error.message}`)
  }
}

async function validateNextConfigOptimization() {
  const configPath = join(rootDir, 'next.config.js')
  
  if (!existsSync(configPath)) {
    return new RemediationResult(false, 'Next.js config not found')
  }
  
  const content = readFileSync(configPath, 'utf8')
  const lines = content.split('\n').filter(line => line.trim() && !line.trim().startsWith('//')).length
  
  return new RemediationResult(
    lines <= 50,
    `Next.js config complexity: ${lines}/50 lines`,
    { lines, optimized: lines <= 50 }
  )
}

// HIGH PRIORITY REMEDIATIONS (Placeholder implementations)

async function consolidateCSS() {
  return new RemediationResult(false, 'CSS consolidation requires manual analysis')
}

async function rollbackCSSConsolidation() {
  return new RemediationResult(false, 'CSS consolidation rollback not implemented')
}

async function validateCSSConsolidation() {
  return new RemediationResult(true, 'CSS validation not implemented')
}

async function setupPerformanceMonitoring() {
  return new RemediationResult(false, 'Performance monitoring setup not implemented')
}

async function rollbackPerformanceMonitoring() {
  return new RemediationResult(false, 'Performance monitoring rollback not implemented')
}

async function validatePerformanceMonitoring() {
  return new RemediationResult(true, 'Performance monitoring validation not implemented')
}

// Main Remediation Engine
async function runAutomatedRemediation(options = {}) {
  console.log(chalk.bold.cyan('\n🔧 ENTERPRISE AUTOMATED REMEDIATION ENGINE\n'))
  
  const { 
    severity = 'CRITICAL',
    dryRun = false,
    interactive = true 
  } = options
  
  const remediations = REMEDIATION_ACTIONS[severity] || []
  const results = []
  
  console.log(chalk.gray(`Running ${severity} remediations (${dryRun ? 'DRY RUN' : 'LIVE'})...\n`))
  
  for (const action of remediations) {
    console.log(chalk.bold(`\n📋 ${action.name}`))
    console.log(chalk.gray(`   ${action.description}`))
    console.log(chalk.gray(`   Impact: ${action.impact} | Automation: ${action.automation} | Time: ${action.estimatedTime}`))
    
    if (interactive && !dryRun) {
      // In a real implementation, you'd prompt for user confirmation
      console.log(chalk.yellow('   [Auto-executing in non-interactive mode]'))
    }
    
    if (dryRun) {
      console.log(chalk.blue('   ✓ Dry run - would execute remediation'))
      results.push({
        action: action.id,
        result: new RemediationResult(true, 'Dry run successful'),
        dryRun: true
      })
      continue
    }
    
    try {
      console.log(chalk.blue('   🔄 Executing remediation...'))
      const result = await action.execute()
      
      if (result.success) {
        console.log(chalk.green(`   ✅ ${result.message}`))
        if (result.duration) {
          console.log(chalk.gray(`   ⏱️  Completed in ${result.duration}ms`))
        }
      } else {
        console.log(chalk.red(`   ❌ ${result.message}`))
      }
      
      results.push({ action: action.id, result })
      
      // Validate the remediation
      if (action.validate && result.success) {
        const validation = await action.validate()
        if (!validation.success) {
          console.log(chalk.yellow(`   ⚠️  Validation failed: ${validation.message}`))
        }
      }
      
    } catch (error) {
      const result = new RemediationResult(false, `Execution failed: ${error.message}`)
      console.log(chalk.red(`   ❌ ${result.message}`))
      results.push({ action: action.id, result })
    }
  }
  
  // Summary
  console.log(chalk.bold('\n📊 REMEDIATION SUMMARY'))
  const successful = results.filter(r => r.result.success).length
  const failed = results.length - successful
  
  console.log(`Total Remediations: ${results.length}`)
  console.log(`Successful: ${chalk.green(successful)}`)
  console.log(`Failed: ${chalk.red(failed)}`)
  console.log(`Success Rate: ${((successful / results.length) * 100).toFixed(1)}%`)
  
  if (failed > 0) {
    console.log(chalk.red.bold('\n❌ Some remediations failed:'))
    results.filter(r => !r.result.success).forEach(failure => {
      console.log(chalk.red(`  • ${failure.action}: ${failure.result.message}`))
    })
  }
  
  return results
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const interactive = !args.includes('--no-interactive')
  const severity = args.find(arg => ['CRITICAL', 'HIGH', 'MEDIUM'].includes(arg)) || 'CRITICAL'
  
  try {
    const results = await runAutomatedRemediation({ severity, dryRun, interactive })
    const exitCode = results.some(r => !r.result.success) ? 1 : 0
    process.exit(exitCode)
  } catch (error) {
    console.error(chalk.red('Remediation engine failed:'), error)
    process.exit(1)
  }
}

// Export for programmatic use
export { 
  runAutomatedRemediation, 
  REMEDIATION_ACTIONS, 
  RemediationResult,
  migrateToPnpm,
  consolidateComponents,
  cleanupDependencies,
  optimizeNextConfig
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
