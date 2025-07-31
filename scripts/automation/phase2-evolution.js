/**
 * Phase 2: Component Architecture - EVOLUTIONARY APPROACH
 * 
 * PRINCÍPIOS:
 * 1. CONSERVAR primeiro, destruir só se necessário
 * 2. MAPEAR e CATALOGAR antes de mover
 * 3. REFATORAR gradualmente, mantendo funcionalidade
 * 4. APROVEITAR o que já funciona bem
 */

const fs = require('fs');
const path = require('path');

class Phase2ComponentEvolution {
  constructor() {
    this.rootDir = process.cwd();
    this.logFile = path.join(this.rootDir, 'phase2-evolution.log');
    
    this.results = {
      startTime: null,
      endTime: null,
      analysis: {
        totalComponents: 0,
        qualityComponents: [],
        needsRefactoring: [],
        duplicates: [],
        canBeReused: []
      },
      changes: {
        catalogued: [],
        improved: [],
        deduplicated: [],
        created: []
      },
      errors: [],
      warnings: []
    };
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [PHASE2-EVOLUTION] [${level.toUpperCase()}] ${message}`;
    
    console.log(logEntry);
    fs.appendFileSync(this.logFile, logEntry + '\n');
  }

  async catalogueExistingComponents() {
    this.log('🔍 CATALOGUING existing components (no destruction)...');
    
    const componentDirs = [
      'components',
      'app/components', 
      'components/ui',
      'components/modern'
    ];

    const catalog = {
      highQuality: [],
      needsMinorRefactor: [],
      needsMajorRefactor: [],
      duplicates: [],
      unused: []
    };

    for (const dir of componentDirs) {
      const fullPath = path.join(this.rootDir, dir);
      if (fs.existsSync(fullPath)) {
        const analysis = await this.analyzeComponentQuality(fullPath, dir);
        
        // Categorize based on QUALITY, not location
        catalog.highQuality.push(...analysis.highQuality);
        catalog.needsMinorRefactor.push(...analysis.needsMinor);
        catalog.needsMajorRefactor.push(...analysis.needsMajor);
        catalog.duplicates.push(...analysis.duplicates);
      }
    }

    this.results.analysis = catalog;
    
    this.log(`📊 CATALOGUE COMPLETE:`);
    this.log(`  🟢 High Quality: ${catalog.highQuality.length} components`);
    this.log(`  🟡 Minor Refactor: ${catalog.needsMinorRefactor.length} components`);
    this.log(`  🟠 Major Refactor: ${catalog.needsMajorRefactor.length} components`);
    this.log(`  🔴 Duplicates: ${catalog.duplicates.length} components`);

    // Generate detailed catalog file
    this.generateComponentCatalog(catalog);
    
    return catalog;
  }

  async analyzeComponentQuality(dirPath, relativePath) {
    const analysis = {
      highQuality: [],
      needsMinor: [],
      needsMajor: [],
      duplicates: []
    };

    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          const subAnalysis = await this.analyzeComponentQuality(itemPath, path.join(relativePath, item));
          // Merge sub-analyses
          Object.keys(analysis).forEach(key => {
            analysis[key].push(...subAnalysis[key]);
          });
        } else if (/\.(tsx|jsx)$/.test(item) && !/\.(test|spec|stories)/.test(item)) {
          const component = await this.evaluateComponent(itemPath, relativePath, item);
          
          // Smart categorization based on actual quality
          if (component.qualityScore >= 8) {
            analysis.highQuality.push(component);
          } else if (component.qualityScore >= 6) {
            analysis.needsMinor.push(component);
          } else if (component.qualityScore >= 4) {
            analysis.needsMajor.push(component);
          }

          // Check for duplicates
          if (component.isDuplicate) {
            analysis.duplicates.push(component);
          }
        }
      }
    } catch (error) {
      this.log(`Error analyzing ${dirPath}: ${error.message}`, 'warning');
    }
    
    return analysis;
  }

  async evaluateComponent(filePath, directory, filename) {
    const content = fs.readFileSync(filePath, 'utf8');
    const name = path.basename(filename, path.extname(filename));
    
    let qualityScore = 10; // Start optimistic
    const issues = [];
    const strengths = [];

    // POSITIVE indicators (what's already good)
    if (/interface\s+\w+Props/.test(content)) {
      strengths.push('Has TypeScript interfaces');
    } else {
      qualityScore -= 2;
      issues.push('Missing TypeScript interfaces');
    }

    if (/export\s+(default\s+)?(?:function|const)\s+\w+/.test(content)) {
      strengths.push('Proper exports');
    } else {
      qualityScore -= 1;
      issues.push('Export pattern unclear');
    }

    if (/forwardRef/.test(content)) {
      strengths.push('Uses forwardRef (advanced)');
      qualityScore += 1;
    }

    if (/use\w+/.test(content)) {
      strengths.push('Uses React hooks');
    }

    if (/className.*\{.*\}/.test(content)) {
      strengths.push('Dynamic className handling');
    }

    if (/tailwind|tw-|class/.test(content)) {
      strengths.push('Tailwind integration');
    }

    // NEGATIVE indicators (needs work)
    if (content.length > 5000) {
      qualityScore -= 2;
      issues.push('Component too large (>5000 chars)');
    }

    if (!/\/\*\*|\*\/|\/\//.test(content)) {
      qualityScore -= 1;
      issues.push('Missing documentation');
    }

    // Check for duplicates by name similarity
    const isDuplicate = this.checkForDuplicates(name, directory);

    return {
      name,
      path: filePath,
      directory,
      qualityScore: Math.max(0, qualityScore),
      strengths,
      issues,
      isDuplicate,
      size: content.length,
      hasTypes: /interface|type/.test(content),
      hasTests: fs.existsSync(filePath.replace(/\.(tsx|jsx)$/, '.test.$1')),
      reusePotential: this.calculateReusePotential(content, name)
    };
  }

  checkForDuplicates(componentName, directory) {
    // Simple duplicate detection - can be enhanced
    const commonNames = ['Button', 'Card', 'Modal', 'Input', 'Form'];
    return commonNames.includes(componentName);
  }

  calculateReusePotential(content, name) {
    let potential = 'medium';
    
    // High reuse potential indicators
    if (/props\s*:/.test(content) && !/hardcoded|fixed/.test(content)) {
      potential = 'high';
    }
    
    // Low reuse potential indicators  
    if (/specific|custom|unique/.test(content.toLowerCase())) {
      potential = 'low';
    }
    
    return potential;
  }

  generateComponentCatalog(catalog) {
    const catalogPath = path.join(this.rootDir, 'COMPONENT_CATALOG.md');
    
    const catalogContent = `# Nova Ipê - Component Catalog
**Generated:** ${new Date().toISOString()}
**Purpose:** Inventory existing components before evolutionary improvements

## 🟢 High Quality Components (Keep & Enhance)
${catalog.highQuality.map(c => `
### ${c.name}
- **Path:** \`${c.path}\`
- **Quality Score:** ${c.qualityScore}/10
- **Strengths:** ${c.strengths.join(', ')}
- **Reuse Potential:** ${c.reusePotential}
`).join('')}

## 🟡 Minor Refactor Needed (Improve)
${catalog.needsMinorRefactor.map(c => `
### ${c.name}
- **Path:** \`${c.path}\`
- **Quality Score:** ${c.qualityScore}/10
- **Issues:** ${c.issues.join(', ')}
- **Action:** Light refactoring to improve quality
`).join('')}

## 🟠 Major Refactor Needed (Rebuild)
${catalog.needsMajorRefactor.map(c => `
### ${c.name}
- **Path:** \`${c.path}\`
- **Quality Score:** ${c.qualityScore}/10
- **Issues:** ${c.issues.join(', ')}
- **Action:** Significant refactoring or replacement
`).join('')}

## 🔴 Duplicates Found (Consolidate)
${catalog.duplicates.map(c => `
### ${c.name}
- **Path:** \`${c.path}\`
- **Directory:** ${c.directory}
- **Action:** Merge with best version
`).join('')}

## 📋 Recommended Actions

### Phase 2A: Preserve & Enhance (1-2 days)
1. **Backup high-quality components** to \`components/verified/\`
2. **Document component APIs** for reuse
3. **Add missing TypeScript types** to good components

### Phase 2B: Intelligent Deduplication (1 day)
1. **Compare duplicate components** functionality
2. **Choose best version** based on quality score
3. **Gradually redirect imports** to chosen version

### Phase 2C: Strategic Refactoring (2-3 days)
1. **Minor refactors first** (low risk, high value)
2. **Test thoroughly** after each improvement
3. **Major refactors last** (high risk, plan carefully)

### Phase 2D: New Structure (1 day)
1. **Create logical grouping** based on actual usage
2. **Add barrel exports** for clean imports
3. **Update documentation** for new structure
`;

    fs.writeFileSync(catalogPath, catalogContent);
    this.results.changes.catalogued.push(catalogPath);
    
    this.log(`📋 Component catalog generated: ${catalogPath}`);
  }

  async preserveHighQualityComponents(catalog) {
    this.log('🛡️ PRESERVING high-quality components...');
    
    const preservedDir = path.join(this.rootDir, 'components', 'verified');
    if (!fs.existsSync(preservedDir)) {
      fs.mkdirSync(preservedDir, { recursive: true });
    }

    for (const component of catalog.highQuality) {
      // Create enhanced version with better exports
      const enhancedPath = path.join(preservedDir, `${component.name}.tsx`);
      const originalContent = fs.readFileSync(component.path, 'utf8');
      
      // Add proper exports if missing
      let enhancedContent = originalContent;
      if (!enhancedContent.includes('export type')) {
        enhancedContent += `\n// Auto-generated type exports\nexport type { ${component.name}Props } from './${component.name}';`;
      }
      
      fs.writeFileSync(enhancedPath, enhancedContent);
      this.results.changes.improved.push(enhancedPath);
      
      this.log(`✅ Preserved: ${component.name} (score: ${component.qualityScore})`);
    }
  }

  async createBarrelExports() {
    this.log('📦 Creating CONSERVATIVE barrel exports...');
    
    // Only create exports for verified components
    const verifiedDir = path.join(this.rootDir, 'components', 'verified');
    const indexPath = path.join(verifiedDir, 'index.ts');
    
    if (fs.existsSync(verifiedDir)) {
      const components = fs.readdirSync(verifiedDir)
        .filter(file => file.endsWith('.tsx'))
        .map(file => path.basename(file, '.tsx'));
      
      const exportContent = `// Auto-generated barrel exports for verified components
// These components passed quality assessment
${components.map(name => `export { default as ${name} } from './${name}';`).join('\n')}

// Re-export types
${components.map(name => `export type { ${name}Props } from './${name}';`).join('\n')}
`;

      fs.writeFileSync(indexPath, exportContent);
      this.results.changes.created.push(indexPath);
      
      this.log(`📦 Barrel exports created for ${components.length} verified components`);
    }
  }

  generateEvolutionReport() {
    this.results.endTime = new Date();
    
    const report = {
      phase: '2-Evolution',
      name: 'Component Architecture - Evolutionary Approach',
      startTime: this.results.startTime,
      endTime: this.results.endTime,
      duration: this.results.endTime - this.results.startTime,
      approach: 'Conservative Evolution (Preserve First)',
      
      analysis: this.results.analysis,
      
      preservationStats: {
        highQualityPreserved: this.results.analysis.highQuality.length,
        totalComponentsAnalyzed: this.results.analysis.totalComponents,
        preservationRate: `${Math.round((this.results.analysis.highQuality.length / this.results.analysis.totalComponents) * 100)}%`
      },
      
      changes: this.results.changes,
      errors: this.results.errors,
      warnings: this.results.warnings,
      
      nextSteps: [
        '1. Review COMPONENT_CATALOG.md for detailed analysis',
        '2. Decide on specific refactoring priorities',
        '3. Implement gradual improvements to medium-quality components',
        '4. Plan consolidation strategy for duplicates',
        '5. Create migration plan for major refactors'
      ],
      
      philosophyApplied: {
        conservationFirst: 'Analyzed and preserved all quality components',
        gradualEvolution: 'No destructive changes, only additive improvements',
        dataDrivern: 'Quality scores guide refactoring priorities',
        reuseMaximization: 'Identified reuse potential before any changes'
      }
    };

    const reportPath = path.join(this.rootDir, 'phase2-evolution-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.log('📊 Phase 2 Evolution Report Generated');
    console.log('\n' + '='.repeat(70));
    console.log('PHASE 2 COMPONENT EVOLUTION COMPLETE');
    console.log('='.repeat(70));
    console.log(`Approach: EVOLUTIONARY (Preserve First)`);
    console.log(`Components Analyzed: ${this.results.analysis.totalComponents}`);
    console.log(`High Quality Preserved: ${this.results.analysis.highQuality.length}`);
    console.log(`Minor Refactor Candidates: ${this.results.analysis.needsMinorRefactor.length}`);
    console.log(`Major Refactor Candidates: ${this.results.analysis.needsMajorRefactor.length}`);
    console.log(`Duplicates Identified: ${this.results.analysis.duplicates.length}`);
    console.log(`\n📋 Next: Review COMPONENT_CATALOG.md for detailed action plan`);
    console.log('='.repeat(70));

    return report;
  }

  async execute() {
    try {
      this.results.startTime = new Date();
      this.log('🌱 Starting Phase 2: Component Evolution (Conservative Approach)');

      // Step 1: Catalog everything (no destruction)
      const catalog = await this.catalogueExistingComponents();

      // Step 2: Preserve the good stuff
      await this.preserveHighQualityComponents(catalog);

      // Step 3: Create conservative infrastructure
      await this.createBarrelExports();

      // Step 4: Generate actionable report
      const report = this.generateEvolutionReport();

      this.log('✅ Phase 2 Evolution completed - Zero destruction, maximum preservation');
      return report;

    } catch (error) {
      this.log(`❌ Phase 2 Evolution failed: ${error.message}`, 'error');
      this.results.errors.push(error.message);
      throw error;
    }
  }
}

module.exports = { Phase2ComponentEvolution };

// Execute if run directly
if (require.main === module) {
  async function main() {
    const evolution = new Phase2ComponentEvolution();
    
    try {
      const report = await evolution.execute();
      console.log('\n✅ Phase 2 Evolution completed successfully!');
      console.log('📋 Check COMPONENT_CATALOG.md for detailed analysis');
      process.exit(0);
    } catch (error) {
      console.error('❌ Phase 2 Evolution failed:', error.message);
      process.exit(1);
    }
  }
  
  main();
}
