#!/usr/bin/env node
/**
 * Enterprise Performance Monitor
 * Real-time performance tracking and budget enforcement
 */

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import chalk from 'chalk'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '../..')

// Performance Budgets Configuration
const PERFORMANCE_BUDGETS = {
  // BUNDLE SIZE BUDGETS (bytes)
  bundleSize: {
    total: 800_000,        // 800KB total
    javascript: 200_000,   // 200KB JS
    css: 50_000,          // 50KB CSS
    images: 400_000,      // 400KB images
    fonts: 100_000,       // 100KB fonts
    other: 50_000         // 50KB other assets
  },
  
  // PERFORMANCE METRICS (milliseconds)
  webVitals: {
    fcp: 1200,            // First Contentful Paint
    lcp: 2500,            // Largest Contentful Paint
    fid: 100,             // First Input Delay
    cls: 0.1,             // Cumulative Layout Shift (score)
    ttfb: 600             // Time to First Byte
  },
  
  // BUILD PERFORMANCE (milliseconds)
  buildMetrics: {
    coldBuild: 12_000,    // 12 seconds
    hotReload: 500,       // 500ms
    typeCheck: 5_000      // 5 seconds
  },
  
  // RESOURCE COUNTS
  resourceCounts: {
    totalRequests: 20,    // Max HTTP requests
    thirdPartyScripts: 3, // Max 3rd party scripts
    cssFiles: 2,          // Max CSS files
    jsChunks: 8           // Max JS chunks
  }
}

// Performance Monitoring Class
class PerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.violations = []
    this.trends = []
  }
  
  async measureBundleSize() {
    console.log(chalk.blue('📊 Analyzing bundle size...'))
    
    const buildDir = join(rootDir, '.next')
    if (!existsSync(buildDir)) {
      throw new Error('Build not found. Run "npm run build" first.')
    }
    
    const staticDir = join(buildDir, 'static')
    const sizes = {
      javascript: 0,
      css: 0,
      images: 0,
      fonts: 0,
      other: 0,
      total: 0
    }
    
    function analyzeDirectory(dir, category = 'other') {
      if (!existsSync(dir)) return
      
      const files = readdirSync(dir)
      for (const file of files) {
        const filePath = join(dir, file)
        const stat = statSync(filePath)
        
        if (stat.isDirectory()) {
          let subCategory = category
          if (file === 'chunks') subCategory = 'javascript'
          else if (file === 'css') subCategory = 'css'
          else if (file === 'media') subCategory = 'images'
          
          analyzeDirectory(filePath, subCategory)
        } else {
          const size = stat.size
          const ext = file.split('.').pop().toLowerCase()
          
          // Categorize by extension
          if (['js', 'mjs'].includes(ext)) {
            sizes.javascript += size
          } else if (['css', 'scss', 'sass'].includes(ext)) {
            sizes.css += size
          } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'].includes(ext)) {
            sizes.images += size
          } else if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(ext)) {
            sizes.fonts += size
          } else {
            sizes.other += size
          }
          
          sizes.total += size
        }
      }
    }
    
    analyzeDirectory(staticDir)
    
    // Check violations
    const violations = []
    Object.entries(PERFORMANCE_BUDGETS.bundleSize).forEach(([category, budget]) => {
      if (sizes[category] > budget) {
        violations.push({
          category,
          actual: sizes[category],
          budget,
          overage: sizes[category] - budget,
          percentage: ((sizes[category] / budget) * 100).toFixed(1)
        })
      }
    })
    
    this.metrics.bundleSize = sizes
    this.violations.push(...violations.map(v => ({ type: 'bundleSize', ...v })))
    
    return {
      sizes,
      violations,
      passed: violations.length === 0
    }
  }
  
  async measureBuildPerformance() {
    console.log(chalk.blue('⏱️  Measuring build performance...'))
    
    const startTime = Date.now()
    
    try {
      // Cold build measurement
      console.log(chalk.gray('  Running cold build...'))
      execSync('npm run build', { stdio: 'ignore', cwd: rootDir })
      const coldBuildTime = Date.now() - startTime
      
      // Type check measurement (if available)
      let typeCheckTime = 0
      try {
        const typeStartTime = Date.now()
        execSync('npx tsc --noEmit', { stdio: 'ignore', cwd: rootDir })
        typeCheckTime = Date.now() - typeStartTime
      } catch {
        // TypeScript check might fail, that's ok for measurement
        typeCheckTime = Date.now() - typeStartTime
      }
      
      const buildMetrics = {
        coldBuild: coldBuildTime,
        typeCheck: typeCheckTime,
        hotReload: null // Would need dev server integration
      }
      
      // Check violations
      const violations = []
      Object.entries(PERFORMANCE_BUDGETS.buildMetrics).forEach(([metric, budget]) => {
        if (buildMetrics[metric] && buildMetrics[metric] > budget) {
          violations.push({
            metric,
            actual: buildMetrics[metric],
            budget,
            overage: buildMetrics[metric] - budget
          })
        }
      })
      
      this.metrics.buildPerformance = buildMetrics
      this.violations.push(...violations.map(v => ({ type: 'buildPerformance', ...v })))
      
      return {
        metrics: buildMetrics,
        violations,
        passed: violations.length === 0
      }
      
    } catch (error) {
      throw new Error(`Build performance measurement failed: ${error.message}`)
    }
  }
  
  async measureResourceCounts() {
    console.log(chalk.blue('🔢 Counting resources...'))
    
    const buildDir = join(rootDir, '.next')
    const staticDir = join(buildDir, 'static')
    
    const counts = {
      jsChunks: 0,
      cssFiles: 0,
      totalRequests: 0,
      thirdPartyScripts: 0
    }
    
    function countFiles(dir, extensions, counter) {
      if (!existsSync(dir)) return
      
      const files = readdirSync(dir)
      for (const file of files) {
        const filePath = join(dir, file)
        const stat = statSync(filePath)
        
        if (stat.isDirectory()) {
          countFiles(filePath, extensions, counter)
        } else {
          const ext = file.split('.').pop().toLowerCase()
          if (extensions.includes(ext)) {
            counts[counter]++
            counts.totalRequests++
          }
        }
      }
    }
    
    // Count JS chunks
    countFiles(staticDir, ['js', 'mjs'], 'jsChunks')
    
    // Count CSS files
    countFiles(staticDir, ['css'], 'cssFiles')
    
    // Check for third-party scripts (simplified check)
    try {
      const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
      const thirdPartyIndicators = [
        'google-analytics', 'gtag', 'facebook-pixel', 'hotjar', 'intercom',
        'zendesk', 'crisp', 'drift', 'mixpanel', 'segment'
      ]
      
      const deps = Object.keys(packageJson.dependencies || {})
      counts.thirdPartyScripts = deps.filter(dep => 
        thirdPartyIndicators.some(indicator => dep.includes(indicator))
      ).length
    } catch {
      // Ignore if package.json can't be read
    }
    
    // Check violations
    const violations = []
    Object.entries(PERFORMANCE_BUDGETS.resourceCounts).forEach(([metric, budget]) => {
      if (counts[metric] > budget) {
        violations.push({
          metric,
          actual: counts[metric],
          budget,
          overage: counts[metric] - budget
        })
      }
    })
    
    this.metrics.resourceCounts = counts
    this.violations.push(...violations.map(v => ({ type: 'resourceCounts', ...v })))
    
    return {
      counts,
      violations,
      passed: violations.length === 0
    }
  }
  
  async measureWebVitals() {
    console.log(chalk.blue('🎯 Checking Web Vitals (simulated)...'))
    
    // In a real implementation, this would use Lighthouse CI or real user monitoring
    // For now, we'll simulate based on bundle size and complexity
    
    const bundleSize = this.metrics.bundleSize?.total || 0
    const jsSize = this.metrics.bundleSize?.javascript || 0
    
    // Rough estimates based on bundle size (simplified model)
    const simulatedMetrics = {
      fcp: Math.max(800, bundleSize / 1000),      // Rough correlation
      lcp: Math.max(1500, bundleSize / 500),      // Larger bundles = slower LCP
      fid: Math.max(50, jsSize / 4000),           // JS size impacts interactivity
      cls: Math.min(0.05, bundleSize / 16000000), // Layout shift correlation
      ttfb: Math.max(200, bundleSize / 4000)      // Server response time
    }
    
    // Check violations
    const violations = []
    Object.entries(PERFORMANCE_BUDGETS.webVitals).forEach(([metric, budget]) => {
      if (simulatedMetrics[metric] > budget) {
        violations.push({
          metric,
          actual: simulatedMetrics[metric],
          budget,
          overage: simulatedMetrics[metric] - budget
        })
      }
    })
    
    this.metrics.webVitals = simulatedMetrics
    this.violations.push(...violations.map(v => ({ type: 'webVitals', ...v })))
    
    return {
      metrics: simulatedMetrics,
      violations,
      passed: violations.length === 0,
      note: 'Simulated values - use Lighthouse CI for accurate measurements'
    }
  }
  
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalViolations: this.violations.length,
        passed: this.violations.length === 0,
        categories: {
          bundleSize: this.violations.filter(v => v.type === 'bundleSize').length,
          buildPerformance: this.violations.filter(v => v.type === 'buildPerformance').length,
          resourceCounts: this.violations.filter(v => v.type === 'resourceCounts').length,
          webVitals: this.violations.filter(v => v.type === 'webVitals').length
        }
      },
      metrics: this.metrics,
      violations: this.violations,
      budgets: PERFORMANCE_BUDGETS
    }
    
    return report
  }
  
  printReport() {
    console.log(chalk.bold.cyan('\n📊 ENTERPRISE PERFORMANCE REPORT\n'))
    
    // Summary
    const passed = this.violations.length === 0
    console.log(`Status: ${passed ? chalk.green('✅ PASSED') : chalk.red('❌ FAILED')}`)
    console.log(`Total Violations: ${chalk.red(this.violations.length)}`)
    console.log(`Timestamp: ${chalk.gray(new Date().toISOString())}\n`)
    
    // Bundle Size Analysis
    if (this.metrics.bundleSize) {
      console.log(chalk.bold('📦 Bundle Size Analysis:'))
      const sizes = this.metrics.bundleSize
      
      Object.entries(sizes).forEach(([category, size]) => {
        const budget = PERFORMANCE_BUDGETS.bundleSize[category]
        if (budget) {
          const percentage = (size / budget * 100).toFixed(1)
          const status = size <= budget ? '✅' : '❌'
          const color = size <= budget ? chalk.green : chalk.red
          
          console.log(`  ${status} ${category}: ${color(this.formatBytes(size))}/${this.formatBytes(budget)} (${percentage}%)`)
        } else {
          console.log(`  📊 ${category}: ${this.formatBytes(size)}`)
        }
      })
      console.log()
    }
    
    // Build Performance
    if (this.metrics.buildPerformance) {
      console.log(chalk.bold('⏱️  Build Performance:'))
      const build = this.metrics.buildPerformance
      
      Object.entries(build).forEach(([metric, time]) => {
        if (time !== null) {
          const budget = PERFORMANCE_BUDGETS.buildMetrics[metric]
          if (budget) {
            const status = time <= budget ? '✅' : '❌'
            const color = time <= budget ? chalk.green : chalk.red
            
            console.log(`  ${status} ${metric}: ${color(this.formatTime(time))}/${this.formatTime(budget)}`)
          } else {
            console.log(`  📊 ${metric}: ${this.formatTime(time)}`)
          }
        }
      })
      console.log()
    }
    
    // Resource Counts
    if (this.metrics.resourceCounts) {
      console.log(chalk.bold('🔢 Resource Counts:'))
      const counts = this.metrics.resourceCounts
      
      Object.entries(counts).forEach(([metric, count]) => {
        const budget = PERFORMANCE_BUDGETS.resourceCounts[metric]
        if (budget) {
          const status = count <= budget ? '✅' : '❌'
          const color = count <= budget ? chalk.green : chalk.red
          
          console.log(`  ${status} ${metric}: ${color(count)}/${budget}`)
        }
      })
      console.log()
    }
    
    // Web Vitals
    if (this.metrics.webVitals) {
      console.log(chalk.bold('🎯 Core Web Vitals (Simulated):'))
      const vitals = this.metrics.webVitals
      
      Object.entries(vitals).forEach(([metric, value]) => {
        const budget = PERFORMANCE_BUDGETS.webVitals[metric]
        const status = value <= budget ? '✅' : '❌'
        const color = value <= budget ? chalk.green : chalk.red
        const unit = metric === 'cls' ? '' : 'ms'
        
        console.log(`  ${status} ${metric.toUpperCase()}: ${color(value.toFixed(1))}${unit}/${budget}${unit}`)
      })
      console.log()
    }
    
    // Violations Summary
    if (this.violations.length > 0) {
      console.log(chalk.red.bold('🚨 PERFORMANCE BUDGET VIOLATIONS:'))
      this.violations.forEach(violation => {
        const overage = violation.overage
        const unit = violation.type === 'bundleSize' ? 'bytes' : 
                    violation.type === 'buildPerformance' ? 'ms' : ''
        
        console.log(chalk.red(`  ❌ ${violation.category || violation.metric}: Over budget by ${this.formatValue(overage, unit)}`))
      })
      console.log()
    }
    
    // Recommendations
    if (this.violations.length > 0) {
      console.log(chalk.yellow.bold('💡 OPTIMIZATION RECOMMENDATIONS:'))
      
      const bundleViolations = this.violations.filter(v => v.type === 'bundleSize')
      if (bundleViolations.length > 0) {
        console.log(chalk.yellow('  📦 Bundle Size:'))
        console.log(chalk.yellow('    • Run bundle analyzer: npm run analyze'))
        console.log(chalk.yellow('    • Enable dynamic imports for large components'))
        console.log(chalk.yellow('    • Remove unused dependencies'))
        console.log(chalk.yellow('    • Optimize images and fonts'))
      }
      
      const buildViolations = this.violations.filter(v => v.type === 'buildPerformance')
      if (buildViolations.length > 0) {
        console.log(chalk.yellow('  ⏱️  Build Performance:'))
        console.log(chalk.yellow('    • Enable SWC compiler'))
        console.log(chalk.yellow('    • Use incremental TypeScript compilation'))
        console.log(chalk.yellow('    • Optimize webpack configuration'))
      }
      
      console.log()
    } else {
      console.log(chalk.green.bold('🎉 ALL PERFORMANCE BUDGETS PASSED!'))
      console.log(chalk.green('Your application meets enterprise performance standards.'))
    }
  }
  
  formatBytes(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }
  
  formatTime(ms) {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }
  
  formatValue(value, unit) {
    if (unit === 'bytes') return this.formatBytes(value)
    if (unit === 'ms') return this.formatTime(value)
    return value.toString()
  }
}

// Main Performance Monitoring Function
async function runPerformanceMonitoring(options = {}) {
  const { 
    skipBuild = false,
    outputFile = null,
    failOnViolations = true 
  } = options
  
  const monitor = new PerformanceMonitor()
  
  try {
    // Bundle Size Analysis
    await monitor.measureBundleSize()
    
    // Build Performance (skip if requested)
    if (!skipBuild) {
      await monitor.measureBuildPerformance()
    }
    
    // Resource Counts
    await monitor.measureResourceCounts()
    
    // Web Vitals (simulated)
    await monitor.measureWebVitals()
    
    // Generate and display report
    const report = monitor.generateReport()
    monitor.printReport()
    
    // Save report to file if requested
    if (outputFile) {
      writeFileSync(outputFile, JSON.stringify(report, null, 2))
      console.log(chalk.gray(`Report saved to: ${outputFile}`))
    }
    
    // Return exit code based on violations
    return failOnViolations && monitor.violations.length > 0 ? 1 : 0
    
  } catch (error) {
    console.error(chalk.red('Performance monitoring failed:'), error.message)
    return 1
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2)
  
  const options = {
    skipBuild: args.includes('--skip-build'),
    outputFile: args.find(arg => arg.startsWith('--output='))?.split('=')[1],
    failOnViolations: !args.includes('--no-fail')
  }
  
  const exitCode = await runPerformanceMonitoring(options)
  process.exit(exitCode)
}

// Export for programmatic use
export { 
  runPerformanceMonitoring, 
  PerformanceMonitor, 
  PERFORMANCE_BUDGETS 
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
