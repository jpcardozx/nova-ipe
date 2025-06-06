#!/usr/bin/env node
/**
 * Enterprise Architecture Control Center
 * Main orchestrator for enterprise-grade architecture management
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import { runEnterpriseValidation } from './architecture-validator.js'
import { runAutomatedRemediation } from './auto-remediation.js'
import { runPerformanceMonitoring } from './performance-monitor.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '../..')

// Enterprise Architecture Control Center
class ArchitectureControlCenter {
  constructor() {
    this.state = {
      lastValidation: null,
      lastRemediation: null,
      lastPerformanceCheck: null,
      architectureScore: 0,
      trends: []
    }
    
    this.loadState()
  }
  
  loadState() {
    const stateFile = join(rootDir, '.enterprise-state.json')
    if (existsSync(stateFile)) {
      try {
        this.state = JSON.parse(readFileSync(stateFile, 'utf8'))
      } catch {
        // Use default state if file is corrupted
      }
    }
  }
  
  saveState() {
    const stateFile = join(rootDir, '.enterprise-state.json')
    writeFileSync(stateFile, JSON.stringify(this.state, null, 2))
  }
  
  async runFullDiagnostic() {
    console.log(chalk.bold.cyan('\n🏗️  ENTERPRISE ARCHITECTURE CONTROL CENTER\n'))
    console.log(chalk.gray('Running comprehensive architecture diagnostic...\n'))
    
    const diagnosticResults = {
      timestamp: new Date().toISOString(),
      validation: null,
      performance: null,
      remediationPlan: null,
      overallScore: 0,
      recommendations: []
    }
    
    try {
      // 1. Architecture Validation
      console.log(chalk.bold('🔍 PHASE 1: ARCHITECTURE VALIDATION'))
      console.log(chalk.gray('Validating enterprise architecture compliance...\n'))
      
      const validationExitCode = await runEnterpriseValidation()
      diagnosticResults.validation = {
        passed: validationExitCode === 0,
        exitCode: validationExitCode
      }
      
      // 2. Performance Analysis
      console.log(chalk.bold('\n📊 PHASE 2: PERFORMANCE ANALYSIS'))
      console.log(chalk.gray('Analyzing performance metrics and budgets...\n'))
      
      const performanceExitCode = await runPerformanceMonitoring({ 
        skipBuild: false,
        failOnViolations: false 
      })
      diagnosticResults.performance = {
        passed: performanceExitCode === 0,
        exitCode: performanceExitCode
      }
      
      // 3. Calculate Overall Score
      const architectureScore = this.calculateArchitectureScore(diagnosticResults)
      diagnosticResults.overallScore = architectureScore
      
      // 4. Generate Remediation Plan
      const remediationPlan = this.generateRemediationPlan(diagnosticResults)
      diagnosticResults.remediationPlan = remediationPlan
      
      // 5. Update State
      this.state.lastValidation = diagnosticResults.validation
      this.state.lastPerformanceCheck = diagnosticResults.performance
      this.state.architectureScore = architectureScore
      this.state.trends.push({
        timestamp: new Date().toISOString(),
        score: architectureScore
      })
      
      // Keep only last 30 trend points
      if (this.state.trends.length > 30) {
        this.state.trends = this.state.trends.slice(-30)
      }
      
      this.saveState()
      
      // 6. Display Summary
      this.displayDiagnosticSummary(diagnosticResults)
      
      return diagnosticResults
      
    } catch (error) {
      console.error(chalk.red('Diagnostic failed:'), error.message)
      throw error
    }
  }
  
  calculateArchitectureScore(results) {
    let score = 100
    
    // Validation score (40% weight)
    if (!results.validation?.passed) {
      score -= 40
    }
    
    // Performance score (35% weight)
    if (!results.performance?.passed) {
      score -= 35
    }
    
    // Complexity penalties (25% weight)
    try {
      const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
      const totalDeps = Object.keys(packageJson.dependencies || {}).length + 
                       Object.keys(packageJson.devDependencies || {}).length
      
      // Dependency penalty
      if (totalDeps > 35) {
        const penalty = Math.min(15, (totalDeps - 35) * 0.5)
        score -= penalty
      }
      
      // Config complexity penalty
      const configFile = join(rootDir, 'next.config.js')
      if (existsSync(configFile)) {
        const content = readFileSync(configFile, 'utf8')
        const lines = content.split('\n').filter(line => line.trim() && !line.trim().startsWith('//')).length
        
        if (lines > 50) {
          const penalty = Math.min(10, (lines - 50) * 0.2)
          score -= penalty
        }
      }
      
    } catch {
      // Ignore errors in score calculation
    }
    
    return Math.max(0, Math.round(score))
  }
  
  generateRemediationPlan(results) {
    const plan = {
      priority: 'MEDIUM',
      actions: [],
      estimatedTime: '0 minutes',
      impactLevel: 'LOW'
    }
    
    // Critical actions
    if (!results.validation?.passed) {
      plan.priority = 'CRITICAL'
      plan.impactLevel = 'HIGH'
      plan.actions.push({
        id: 'run-critical-remediation',
        name: 'Execute Critical Architecture Fixes',
        description: 'Run automated remediation for critical architecture violations',
        command: 'node scripts/enterprise/auto-remediation.js CRITICAL',
        estimatedTime: '10-15 minutes'
      })
    }
    
    // Performance actions
    if (!results.performance?.passed) {
      if (plan.priority !== 'CRITICAL') plan.priority = 'HIGH'
      plan.actions.push({
        id: 'optimize-performance',
        name: 'Performance Optimization',
        description: 'Address performance budget violations',
        command: 'node scripts/enterprise/auto-remediation.js HIGH',
        estimatedTime: '15-20 minutes'
      })
    }
    
    // Maintenance actions
    plan.actions.push({
      id: 'dependency-audit',
      name: 'Dependency Security Audit',
      description: 'Audit dependencies for security vulnerabilities',
      command: 'npm audit --audit-level moderate',
      estimatedTime: '2-3 minutes'
    })
    
    // Calculate total estimated time
    const totalMinutes = plan.actions.reduce((total, action) => {
      const timeStr = action.estimatedTime
      const minutes = parseInt(timeStr.match(/(\d+)-?/)?.[1] || '0')
      return total + minutes
    }, 0)
    
    plan.estimatedTime = `${totalMinutes}-${totalMinutes + 10} minutes`
    
    return plan
  }
  
  displayDiagnosticSummary(results) {
    console.log(chalk.bold.cyan('\n📋 ENTERPRISE DIAGNOSTIC SUMMARY\n'))
    
    // Overall Score
    const score = results.overallScore
    const scoreColor = score >= 90 ? chalk.green : score >= 70 ? chalk.yellow : chalk.red
    const scoreIcon = score >= 90 ? '🏆' : score >= 70 ? '⚠️' : '🚨'
    
    console.log(`${scoreIcon} Architecture Score: ${scoreColor.bold(score)}/100`)
    
    if (score >= 90) {
      console.log(chalk.green('   ✅ Enterprise-grade architecture achieved!'))
    } else if (score >= 70) {
      console.log(chalk.yellow('   ⚠️  Good architecture with room for improvement'))
    } else {
      console.log(chalk.red('   🚨 Critical architecture issues require immediate attention'))
    }
    
    // Component Status
    console.log(chalk.bold('\n📊 Component Status:'))
    console.log(`  Architecture Validation: ${results.validation?.passed ? chalk.green('✅ PASSED') : chalk.red('❌ FAILED')}`)
    console.log(`  Performance Analysis: ${results.performance?.passed ? chalk.green('✅ PASSED') : chalk.red('❌ FAILED')}`)
    
    // Trends
    if (this.state.trends.length > 1) {
      const currentScore = this.state.trends[this.state.trends.length - 1].score
      const previousScore = this.state.trends[this.state.trends.length - 2].score
      const trend = currentScore - previousScore
      
      if (trend > 0) {
        console.log(`  Trend: ${chalk.green(`↗️ +${trend} points`)} (Improving)`)
      } else if (trend < 0) {
        console.log(`  Trend: ${chalk.red(`↘️ ${trend} points`)} (Declining)`)
      } else {
        console.log(`  Trend: ${chalk.gray('→ No change')}`)
      }
    }
    
    // Remediation Plan
    if (results.remediationPlan && results.remediationPlan.actions.length > 0) {
      const plan = results.remediationPlan
      const priorityColor = plan.priority === 'CRITICAL' ? chalk.red : 
                           plan.priority === 'HIGH' ? chalk.yellow : chalk.blue
      
      console.log(chalk.bold('\n🔧 Recommended Actions:'))
      console.log(`  Priority: ${priorityColor(plan.priority)}`)
      console.log(`  Estimated Time: ${chalk.gray(plan.estimatedTime)}`)
      console.log(`  Impact Level: ${chalk.gray(plan.impactLevel)}`)
      
      console.log(chalk.bold('\n📝 Action Plan:'))
      plan.actions.forEach((action, index) => {
        console.log(`  ${index + 1}. ${chalk.bold(action.name)}`)
        console.log(`     ${chalk.gray(action.description)}`)
        console.log(`     ${chalk.blue(`Command: ${action.command}`)}`)
        console.log(`     ${chalk.gray(`Time: ${action.estimatedTime}`)}`)
        console.log()
      })
      
      // Quick execution commands
      console.log(chalk.bold('🚀 Quick Actions:'))
      if (plan.priority === 'CRITICAL') {
        console.log(chalk.red('  npm run enterprise:remediate-critical'))
        console.log(chalk.gray('  ↳ Execute critical architecture fixes'))
      }
      
      console.log(chalk.blue('  npm run enterprise:monitor'))
      console.log(chalk.gray('  ↳ Run continuous monitoring'))
      
      console.log(chalk.blue('  npm run enterprise:validate'))
      console.log(chalk.gray('  ↳ Validate architecture compliance'))
    } else {
      console.log(chalk.green.bold('\n🎉 No immediate actions required!'))
      console.log(chalk.green('Your architecture meets enterprise standards.'))
    }
  }
  
  async executeRemediationPlan(severity = 'CRITICAL') {
    console.log(chalk.bold.cyan('\n🔧 EXECUTING REMEDIATION PLAN\n'))
    
    try {
      const results = await runAutomatedRemediation({ 
        severity, 
        dryRun: false, 
        interactive: false 
      })
      
      this.state.lastRemediation = {
        timestamp: new Date().toISOString(),
        severity,
        results: results.length,
        successful: results.filter(r => r.result.success).length
      }
      
      this.saveState()
      
      return results
    } catch (error) {
      console.error(chalk.red('Remediation execution failed:'), error.message)
      throw error
    }
  }
  
  async startContinuousMonitoring(interval = 300000) { // 5 minutes default
    console.log(chalk.bold.cyan('\n👁️  STARTING CONTINUOUS MONITORING\n'))
    console.log(chalk.gray(`Monitoring interval: ${interval / 1000}s\n`))
    
    const monitor = async () => {
      try {
        console.log(chalk.blue(`[${new Date().toISOString()}] Running architecture check...`))
        
        const validationExitCode = await runEnterpriseValidation()
        const performanceExitCode = await runPerformanceMonitoring({ 
          skipBuild: true, 
          failOnViolations: false 
        })
        
        if (validationExitCode !== 0 || performanceExitCode !== 0) {
          console.log(chalk.red('🚨 Architecture violations detected!'))
          
          // Auto-remediate if configured
          if (process.env.ENTERPRISE_AUTO_REMEDIATE === 'true') {
            console.log(chalk.blue('🔧 Auto-remediation enabled, executing fixes...'))
            await this.executeRemediationPlan('CRITICAL')
          }
        } else {
          console.log(chalk.green('✅ Architecture check passed'))
        }
        
      } catch (error) {
        console.error(chalk.red('Monitoring cycle failed:'), error.message)
      }
    }
    
    // Initial check
    await monitor()
    
    // Set up interval
    setInterval(monitor, interval)
    
    console.log(chalk.green('🎯 Continuous monitoring active. Press Ctrl+C to stop.'))
  }
  
  generateHealthReport() {
    const report = {
      timestamp: new Date().toISOString(),
      architectureScore: this.state.architectureScore,
      lastValidation: this.state.lastValidation,
      lastPerformanceCheck: this.state.lastPerformanceCheck,
      lastRemediation: this.state.lastRemediation,
      trends: this.state.trends,
      recommendations: this.generateRecommendations()
    }
    
    return report
  }
  
  generateRecommendations() {
    const recommendations = []
    
    if (this.state.architectureScore < 90) {
      recommendations.push({
        category: 'Architecture',
        priority: 'HIGH',
        title: 'Improve Architecture Score',
        description: 'Focus on dependency optimization and configuration simplification'
      })
    }
    
    if (!this.state.lastValidation?.passed) {
      recommendations.push({
        category: 'Validation',
        priority: 'CRITICAL',
        title: 'Fix Architecture Violations',
        description: 'Address critical architecture compliance issues'
      })
    }
    
    if (!this.state.lastPerformanceCheck?.passed) {
      recommendations.push({
        category: 'Performance',
        priority: 'HIGH',
        title: 'Optimize Performance',
        description: 'Address performance budget violations'
      })
    }
    
    // Trend-based recommendations
    if (this.state.trends.length >= 3) {
      const recentTrends = this.state.trends.slice(-3)
      const isDeClining = recentTrends.every((trend, index) => 
        index === 0 || trend.score < recentTrends[index - 1].score
      )
      
      if (isDeClining) {
        recommendations.push({
          category: 'Maintenance',
          priority: 'MEDIUM',
          title: 'Architecture Debt Increasing',
          description: 'Recent trend shows declining architecture quality - review and address'
        })
      }
    }
    
    return recommendations
  }
}

// CLI Commands
async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'diagnostic'
  
  const controlCenter = new ArchitectureControlCenter()
  
  try {
    switch (command) {
      case 'diagnostic':
      case 'diag':
        await controlCenter.runFullDiagnostic()
        break
        
      case 'remediate':
        const severity = args[1] || 'CRITICAL'
        await controlCenter.executeRemediationPlan(severity)
        break
        
      case 'monitor':
        const interval = parseInt(args[1]) || 300000
        await controlCenter.startContinuousMonitoring(interval)
        break
        
      case 'health':
        const report = controlCenter.generateHealthReport()
        console.log(JSON.stringify(report, null, 2))
        break
        
      case 'score':
        console.log(`Architecture Score: ${controlCenter.state.architectureScore}/100`)
        break
        
      default:
        console.log(chalk.bold.cyan('🏗️  Enterprise Architecture Control Center\n'))
        console.log('Available commands:')
        console.log('  diagnostic    - Run full architecture diagnostic')
        console.log('  remediate     - Execute remediation plan')
        console.log('  monitor       - Start continuous monitoring')
        console.log('  health        - Generate health report')
        console.log('  score         - Show current architecture score')
        console.log()
        console.log('Examples:')
        console.log('  node enterprise-control.js diagnostic')
        console.log('  node enterprise-control.js remediate CRITICAL')
        console.log('  node enterprise-control.js monitor 600000')
    }
    
  } catch (error) {
    console.error(chalk.red('Control center error:'), error.message)
    process.exit(1)
  }
}

// Export for programmatic use
export { ArchitectureControlCenter }

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
