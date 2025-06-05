#!/usr/bin/env node
/**
 * Enterprise Architecture Validator
 * Advanced validation system for enterprise-grade architecture compliance
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import chalk from 'chalk'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '../..')

// Enterprise Architecture Rules
const ENTERPRISE_RULES = {
  // CRITICAL RULES (Build Breaking)
  CRITICAL: [
    {
      id: 'max-dependencies',
      name: 'Maximum Dependencies Limit',
      description: 'Total dependencies must not exceed 35 packages',
      threshold: 35,
      validator: validateDependencyCount,
      impact: 'Reduces security surface area and bundle size'
    },
    {
      id: 'bundle-size-budget',
      name: 'Bundle Size Budget',
      description: 'Total bundle size must not exceed 800KB',
      threshold: 800_000,
      validator: validateBundleSize,
      impact: 'Ensures fast page loads and good user experience'
    },
    {
      id: 'single-component-dir',
      name: 'Single Component Directory',
      description: 'Must have exactly one component directory',
      threshold: 1,
      validator: validateComponentStructure,
      impact: 'Prevents component duplication and import confusion'
    },
    {
      id: 'config-complexity',
      name: 'Configuration Complexity',
      description: 'Next.js config must be under 50 lines',
      threshold: 50,
      validator: validateConfigComplexity,
      impact: 'Maintains simple, maintainable configuration'
    }
  ],

  // HIGH PRIORITY RULES (Warnings)
  HIGH: [
    {
      id: 'css-file-count',
      name: 'CSS File Count',
      description: 'Should have maximum 3 CSS files',
      threshold: 3,
      validator: validateCSSFileCount,
      impact: 'Reduces style conflicts and improves maintainability'
    },
    {
      id: 'typescript-coverage',
      name: 'TypeScript Coverage',
      description: 'TypeScript usage should be above 95%',
      threshold: 95,
      validator: validateTypeScriptCoverage,
      impact: 'Ensures type safety and better developer experience'
    },
    {
      id: 'package-manager',
      name: 'Package Manager',
      description: 'Must use pnpm for better performance',
      threshold: 'pnpm',
      validator: validatePackageManager,
      impact: '3x faster installs, 62% less disk space'
    }
  ],

  // MEDIUM PRIORITY RULES (Recommendations)
  MEDIUM: [
    {
      id: 'unused-dependencies',
      name: 'Unused Dependencies',
      description: 'Should have no unused dependencies',
      threshold: 0,
      validator: validateUnusedDependencies,
      impact: 'Reduces bundle size and security vulnerabilities'
    },
    {
      id: 'component-naming',
      name: 'Component Naming Convention',
      description: 'Components should follow PascalCase convention',
      threshold: 100,
      validator: validateComponentNaming,
      impact: 'Improves code readability and maintainability'
    }
  ]
}

// Validation Results Interface
class ValidationResult {
  constructor(passed, message, details = {}) {
    this.passed = passed
    this.message = message
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

// Core Validators
async function validateDependencyCount() {
  try {
    const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
    const deps = Object.keys(packageJson.dependencies || {})
    const devDeps = Object.keys(packageJson.devDependencies || {})
    const totalDeps = deps.length + devDeps.length
    
    return new ValidationResult(
      totalDeps <= 35,
      `Dependencies: ${totalDeps}/35 (${deps.length} prod, ${devDeps.length} dev)`,
      { 
        total: totalDeps, 
        production: deps.length, 
        development: devDeps.length,
        dependencies: deps,
        devDependencies: devDeps
      }
    )
  } catch (error) {
    return new ValidationResult(false, `Error reading package.json: ${error.message}`)
  }
}

async function validateBundleSize() {
  try {
    // Check if build exists
    const buildDir = join(rootDir, '.next')
    if (!existsSync(buildDir)) {
      return new ValidationResult(false, 'No build found. Run "npm run build" first.')
    }

    // Try to get bundle size from build
    const staticDir = join(buildDir, 'static')
    if (!existsSync(staticDir)) {
      return new ValidationResult(false, 'Build directory incomplete')
    }

    let totalSize = 0
    
    function calculateDirSize(dir) {
      const files = readdirSync(dir)
      for (const file of files) {
        const filePath = join(dir, file)
        const stat = statSync(filePath)
        
        if (stat.isDirectory()) {
          calculateDirSize(filePath)
        } else {
          totalSize += stat.size
        }
      }
    }
    
    calculateDirSize(staticDir)
    
    return new ValidationResult(
      totalSize <= 800_000,
      `Bundle size: ${formatBytes(totalSize)}/800KB`,
      { 
        bytes: totalSize,
        formatted: formatBytes(totalSize),
        budget: 800_000,
        ratio: (totalSize / 800_000 * 100).toFixed(1) + '%'
      }
    )
  } catch (error) {
    return new ValidationResult(false, `Error calculating bundle size: ${error.message}`)
  }
}

async function validateComponentStructure() {
  try {
    const componentDirs = []
    
    // Common component directory patterns
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
        componentDirs.push(pattern)
      }
    }
    
    return new ValidationResult(
      componentDirs.length === 1,
      `Component directories: ${componentDirs.length}/1 (${componentDirs.join(', ')})`,
      { 
        directories: componentDirs,
        count: componentDirs.length,
        recommended: 'src/components'
      }
    )
  } catch (error) {
    return new ValidationResult(false, `Error checking component structure: ${error.message}`)
  }
}

async function validateConfigComplexity() {
  try {
    const configFile = join(rootDir, 'next.config.js')
    if (!existsSync(configFile)) {
      return new ValidationResult(true, 'No Next.js config found (using defaults)')
    }
    
    const content = readFileSync(configFile, 'utf8')
    const lines = content.split('\n').filter(line => line.trim() && !line.trim().startsWith('//')).length
    
    return new ValidationResult(
      lines <= 50,
      `Next.js config complexity: ${lines}/50 lines`,
      { 
        lines,
        threshold: 50,
        file: configFile,
        recommendation: 'Consider using next-optimized.config.js'
      }
    )
  } catch (error) {
    return new ValidationResult(false, `Error reading Next.js config: ${error.message}`)
  }
}

async function validateCSSFileCount() {
  try {
    const cssFiles = []
    
    function findCSSFiles(dir) {
      if (!existsSync(dir)) return
      
      const files = readdirSync(dir)
      for (const file of files) {
        const filePath = join(dir, file)
        const stat = statSync(filePath)
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          findCSSFiles(filePath)
        } else if (file.endsWith('.css') || file.endsWith('.scss') || file.endsWith('.sass')) {
          cssFiles.push(filePath.replace(rootDir, ''))
        }
      }
    }
    
    findCSSFiles(rootDir)
    
    return new ValidationResult(
      cssFiles.length <= 3,
      `CSS files: ${cssFiles.length}/3`,
      { 
        files: cssFiles,
        count: cssFiles.length,
        recommendation: 'Use Tailwind for utility classes, minimize custom CSS'
      }
    )
  } catch (error) {
    return new ValidationResult(false, `Error counting CSS files: ${error.message}`)
  }
}

async function validateTypeScriptCoverage() {
  try {
    let tsFiles = 0
    let jsFiles = 0
    
    function countFiles(dir) {
      if (!existsSync(dir)) return
      
      const files = readdirSync(dir)
      for (const file of files) {
        const filePath = join(dir, file)
        const stat = statSync(filePath)
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          countFiles(filePath)
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          tsFiles++
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
          jsFiles++
        }
      }
    }
    
    countFiles(join(rootDir, 'src'))
    countFiles(join(rootDir, 'app'))
    countFiles(join(rootDir, 'components'))
    
    const total = tsFiles + jsFiles
    const coverage = total > 0 ? (tsFiles / total * 100) : 100
    
    return new ValidationResult(
      coverage >= 95,
      `TypeScript coverage: ${coverage.toFixed(1)}% (${tsFiles}/${total} files)`,
      { 
        typescript: tsFiles,
        javascript: jsFiles,
        total,
        coverage: coverage.toFixed(1)
      }
    )
  } catch (error) {
    return new ValidationResult(false, `Error calculating TypeScript coverage: ${error.message}`)
  }
}

async function validatePackageManager() {
  try {
    const hasPackageLock = existsSync(join(rootDir, 'package-lock.json'))
    const hasPnpmLock = existsSync(join(rootDir, 'pnpm-lock.yaml'))
    const hasYarnLock = existsSync(join(rootDir, 'yarn.lock'))
    
    let packageManager = 'unknown'
    if (hasPnpmLock) packageManager = 'pnpm'
    else if (hasYarnLock) packageManager = 'yarn'
    else if (hasPackageLock) packageManager = 'npm'
    
    return new ValidationResult(
      packageManager === 'pnpm',
      `Package manager: ${packageManager} (recommended: pnpm)`,
      { 
        current: packageManager,
        recommended: 'pnpm',
        benefits: ['3x faster installs', '62% less disk space', 'Better dependency resolution']
      }
    )
  } catch (error) {
    return new ValidationResult(false, `Error detecting package manager: ${error.message}`)
  }
}

async function validateUnusedDependencies() {
  try {
    // This is a simplified check - in a real implementation, you'd use tools like depcheck
    return new ValidationResult(
      true,
      'Unused dependencies check requires depcheck tool',
      { 
        note: 'Run "npx depcheck" for detailed unused dependency analysis',
        automated: false
      }
    )
  } catch (error) {
    return new ValidationResult(false, `Error checking unused dependencies: ${error.message}`)
  }
}

async function validateComponentNaming() {
  try {
    const componentFiles = []
    const invalidNames = []
    
    function checkComponentFiles(dir) {
      if (!existsSync(dir)) return
      
      const files = readdirSync(dir)
      for (const file of files) {
        const filePath = join(dir, file)
        const stat = statSync(filePath)
        
        if (stat.isDirectory() && !file.startsWith('.')) {
          checkComponentFiles(filePath)
        } else if ((file.endsWith('.tsx') || file.endsWith('.jsx')) && 
                   !file.includes('.test.') && !file.includes('.spec.')) {
          componentFiles.push(file)
          
          // Check if component name follows PascalCase
          const componentName = file.replace(/\.(tsx|jsx)$/, '')
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
            invalidNames.push(file)
          }
        }
      }
    }
    
    checkComponentFiles(join(rootDir, 'src'))
    checkComponentFiles(join(rootDir, 'app'))
    checkComponentFiles(join(rootDir, 'components'))
    
    const validPercentage = componentFiles.length > 0 ? 
      ((componentFiles.length - invalidNames.length) / componentFiles.length * 100) : 100
    
    return new ValidationResult(
      validPercentage >= 100,
      `Component naming: ${validPercentage.toFixed(1)}% compliant`,
      { 
        total: componentFiles.length,
        valid: componentFiles.length - invalidNames.length,
        invalid: invalidNames,
        percentage: validPercentage.toFixed(1)
      }
    )
  } catch (error) {
    return new ValidationResult(false, `Error checking component naming: ${error.message}`)
  }
}

// Utility Functions
function formatBytes(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

function getStatusIcon(passed) {
  return passed ? '✅' : '❌'
}

function getSeverityColor(severity) {
  switch (severity) {
    case 'CRITICAL': return chalk.red
    case 'HIGH': return chalk.yellow
    case 'MEDIUM': return chalk.blue
    default: return chalk.gray
  }
}

// Main Validation Runner
async function runEnterpriseValidation() {
  console.log(chalk.bold.cyan('\n🏗️  ENTERPRISE ARCHITECTURE VALIDATOR\n'))
  console.log(chalk.gray('Validating enterprise-grade architecture compliance...\n'))
  
  const results = {
    CRITICAL: [],
    HIGH: [],
    MEDIUM: []
  }
  
  let totalTests = 0
  let passedTests = 0
  
  // Run all validation rules
  for (const [severity, rules] of Object.entries(ENTERPRISE_RULES)) {
    console.log(getSeverityColor(severity)(`${severity} RULES:`))
    
    for (const rule of rules) {
      try {
        const result = await rule.validator()
        results[severity].push({ rule, result })
        totalTests++
        
        if (result.passed) {
          passedTests++
          console.log(`  ${getStatusIcon(true)} ${rule.name}: ${result.message}`)
        } else {
          console.log(`  ${getStatusIcon(false)} ${rule.name}: ${result.message}`)
          if (result.details && Object.keys(result.details).length > 0) {
            console.log(chalk.gray(`    Details: ${JSON.stringify(result.details, null, 2).slice(0, 200)}...`))
          }
        }
      } catch (error) {
        console.log(`  ${getStatusIcon(false)} ${rule.name}: Error - ${error.message}`)
        results[severity].push({ rule, result: new ValidationResult(false, error.message) })
        totalTests++
      }
    }
    console.log()
  }
  
  // Summary
  console.log(chalk.bold('\n📊 VALIDATION SUMMARY'))
  console.log(`Total Tests: ${totalTests}`)
  console.log(`Passed: ${chalk.green(passedTests)}`)
  console.log(`Failed: ${chalk.red(totalTests - passedTests)}`)
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)
  
  // Critical failures
  const criticalFailures = results.CRITICAL.filter(r => !r.result.passed)
  if (criticalFailures.length > 0) {
    console.log(chalk.red.bold('\n🚨 CRITICAL FAILURES (BUILD BREAKING):'))
    criticalFailures.forEach(failure => {
      console.log(chalk.red(`  ❌ ${failure.rule.name}`))
      console.log(chalk.red(`     ${failure.result.message}`))
      console.log(chalk.gray(`     Impact: ${failure.rule.impact}`))
    })
  }
  
  // Recommendations
  const highFailures = results.HIGH.filter(r => !r.result.passed)
  if (highFailures.length > 0) {
    console.log(chalk.yellow.bold('\n⚠️  HIGH PRIORITY RECOMMENDATIONS:'))
    highFailures.forEach(failure => {
      console.log(chalk.yellow(`  ⚠️  ${failure.rule.name}`))
      console.log(chalk.yellow(`     ${failure.result.message}`))
    })
  }
  
  // Exit code based on critical failures
  const exitCode = criticalFailures.length > 0 ? 1 : 0
  
  if (exitCode === 0) {
    console.log(chalk.green.bold('\n✅ ENTERPRISE ARCHITECTURE VALIDATION PASSED'))
  } else {
    console.log(chalk.red.bold('\n❌ ENTERPRISE ARCHITECTURE VALIDATION FAILED'))
    console.log(chalk.red('Fix critical issues before proceeding with build/deployment.'))
  }
  
  return exitCode
}

// Export for programmatic use
export { runEnterpriseValidation, ENTERPRISE_RULES, ValidationResult }

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  runEnterpriseValidation()
    .then(exitCode => process.exit(exitCode))
    .catch(error => {
      console.error(chalk.red('Validation failed:'), error)
      process.exit(1)
    })
}
