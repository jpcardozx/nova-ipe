#!/usr/bin/env node

/**
 * Performance Optimization Script for Nova Ipê
 * Analyzes and optimizes build performance and runtime metrics
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Performance configuration
const PERFORMANCE_CONFIG = {
  bundleSizeThresholds: {
    warning: 500 * 1024, // 500KB
    error: 1024 * 1024,  // 1MB
  },
  webVitalsTargets: {
    LCP: 2500,
    FID: 100,
    CLS: 0.1,
    FCP: 1800,
    TTFB: 600,
  }
};

class PerformanceOptimizer {
  constructor() {
    this.projectRoot = process.cwd();
    this.buildDir = path.join(this.projectRoot, '.next');
    this.reports = [];
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = level === 'error' ? '❌' : level === 'warning' ? '⚠️' : '✅';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  // Analyze bundle sizes
  analyzeBundleSizes() {
    this.log('📊 Analyzing bundle sizes...');
    
    try {
      const statsPath = path.join(this.buildDir, '.next-server-stats.json');
      if (!fs.existsSync(statsPath)) {
        this.log('Bundle stats not found. Run build first.', 'warning');
        return;
      }

      const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
      const chunks = stats.chunks || [];
      
      let totalSize = 0;
      const largeChunks = [];

      chunks.forEach(chunk => {
        const size = chunk.size || 0;
        totalSize += size;
        
        if (size > PERFORMANCE_CONFIG.bundleSizeThresholds.warning) {
          largeChunks.push({
            name: chunk.names?.join(', ') || chunk.id,
            size: (size / 1024).toFixed(2) + 'KB',
            rawSize: size
          });
        }
      });

      this.reports.push({
        type: 'bundle-analysis',
        totalSize: (totalSize / 1024).toFixed(2) + 'KB',
        largeChunks,
        status: totalSize < PERFORMANCE_CONFIG.bundleSizeThresholds.error ? 'good' : 'needs-improvement'
      });

      if (largeChunks.length > 0) {
        this.log(`Found ${largeChunks.length} large chunks that could be optimized`, 'warning');
        largeChunks.forEach(chunk => {
          this.log(`  - ${chunk.name}: ${chunk.size}`);
        });
      }

    } catch (error) {
      this.log(`Error analyzing bundle sizes: ${error.message}`, 'error');
    }
  }

  // Check for unused dependencies
  checkUnusedDependencies() {
    this.log('🔍 Checking for unused dependencies...');
    
    try {
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      const unusedDeps = [];
      
      // Simple check - look for imports in source files
      Object.keys(dependencies).forEach(dep => {
        try {
          const result = execSync(`grep -r "from ['\"]${dep}" app/ lib/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx"`, { encoding: 'utf8' });
          if (!result.trim()) {
            unusedDeps.push(dep);
          }
        } catch {
          // Dependency might be unused
          unusedDeps.push(dep);
        }
      });

      this.reports.push({
        type: 'unused-dependencies',
        unused: unusedDeps,
        count: unusedDeps.length,
        status: unusedDeps.length === 0 ? 'good' : 'needs-improvement'
      });

      if (unusedDeps.length > 0) {
        this.log(`Found ${unusedDeps.length} potentially unused dependencies`, 'warning');
        this.log(`Consider removing: ${unusedDeps.join(', ')}`);
      } else {
        this.log('No unused dependencies found');
      }

    } catch (error) {
      this.log(`Error checking dependencies: ${error.message}`, 'error');
    }
  }

  // Optimize imports
  optimizeImports() {
    this.log('⚡ Analyzing import optimizations...');
    
    const optimizations = [];
    
    try {
      // Check for barrel imports that could be optimized
      const result = execSync(`grep -r "from ['\"]lucide-react['\"]" app/ --include="*.tsx" --include="*.ts"`, { encoding: 'utf8' });
      const lucideImports = result.split('\n').filter(line => line.trim());
      
      if (lucideImports.length > 5) {
        optimizations.push({
          type: 'lucide-react',
          suggestion: 'Consider using individual imports from lucide-react for better tree shaking',
          impact: 'high',
          files: lucideImports.length
        });
      }

      // Check for framer-motion imports
      const framerResult = execSync(`grep -r "from ['\"]framer-motion['\"]" app/ --include="*.tsx" --include="*.ts"`, { encoding: 'utf8' });
      const framerImports = framerResult.split('\n').filter(line => line.trim());
      
      if (framerImports.length > 3) {
        optimizations.push({
          type: 'framer-motion',
          suggestion: 'Consider lazy loading framer-motion components',
          impact: 'medium',
          files: framerImports.length
        });
      }

    } catch (error) {
      // No matches found is actually good
    }

    this.reports.push({
      type: 'import-optimization',
      optimizations,
      status: optimizations.length === 0 ? 'good' : 'needs-improvement'
    });

    if (optimizations.length > 0) {
      this.log('Import optimization opportunities:', 'warning');
      optimizations.forEach(opt => {
        this.log(`  - ${opt.type}: ${opt.suggestion} (${opt.impact} impact)`);
      });
    }
  }

  // Generate recommendations
  generateRecommendations() {
    this.log('📝 Generating performance recommendations...');
    
    const recommendations = [];
    
    this.reports.forEach(report => {
      if (report.status === 'needs-improvement') {
        switch (report.type) {
          case 'bundle-analysis':
            if (report.largeChunks.length > 0) {
              recommendations.push({
                priority: 'high',
                action: 'Implement code splitting for large chunks',
                details: `Found ${report.largeChunks.length} chunks over 500KB`
              });
            }
            break;
            
          case 'unused-dependencies':
            if (report.count > 0) {
              recommendations.push({
                priority: 'medium',
                action: 'Remove unused dependencies',
                details: `${report.count} potentially unused packages found`
              });
            }
            break;
            
          case 'import-optimization':
            if (report.optimizations.length > 0) {
              recommendations.push({
                priority: 'medium',
                action: 'Optimize library imports',
                details: 'Use tree-shaking friendly imports for better bundle size'
              });
            }
            break;
        }
      }
    });

    // Always recommend these best practices
    recommendations.push(
      {
        priority: 'low',
        action: 'Enable Next.js experimental optimizePackageImports',
        details: 'Already configured in next.config.js for major libraries'
      },
      {
        priority: 'low',
        action: 'Use dynamic imports for heavy components',
        details: 'Consider lazy loading non-critical components'
      },
      {
        priority: 'low',
        action: 'Optimize images with next/image',
        details: 'Ensure all images use Next.js Image component with proper sizing'
      }
    );

    return recommendations;
  }

  // Generate performance report
  generateReport() {
    const recommendations = this.generateRecommendations();
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total_checks: this.reports.length,
        issues_found: this.reports.filter(r => r.status !== 'good').length,
        recommendations: recommendations.length
      },
      details: this.reports,
      recommendations: recommendations.sort((a, b) => {
        const priority = { high: 3, medium: 2, low: 1 };
        return priority[b.priority] - priority[a.priority];
      })
    };

    // Save report
    const reportPath = path.join(this.projectRoot, 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`📊 Performance report saved to: ${reportPath}`);
    
    // Print summary
    console.log('\n📊 Performance Analysis Summary');
    console.log('================================');
    console.log(`Total checks: ${report.summary.total_checks}`);
    console.log(`Issues found: ${report.summary.issues_found}`);
    console.log(`Recommendations: ${report.summary.recommendations}`);
    
    if (recommendations.length > 0) {
      console.log('\n🔧 Top Recommendations:');
      recommendations.slice(0, 5).forEach((rec, index) => {
        console.log(`${index + 1}. [${rec.priority.toUpperCase()}] ${rec.action}`);
        console.log(`   ${rec.details}\n`);
      });
    }

    return report;
  }

  // Run all optimizations
  async run() {
    this.log('🚀 Starting performance optimization analysis...');
    
    this.analyzeBundleSizes();
    this.checkUnusedDependencies();
    this.optimizeImports();
    
    const report = this.generateReport();
    
    this.log('✨ Performance optimization analysis complete!');
    
    return report;
  }
}

// Run if called directly
if (require.main === module) {
  const optimizer = new PerformanceOptimizer();
  optimizer.run().catch(error => {
    console.error('❌ Performance optimization failed:', error);
    process.exit(1);
  });
}

module.exports = PerformanceOptimizer;