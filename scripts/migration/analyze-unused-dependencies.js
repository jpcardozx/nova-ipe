/**
 * Analisador de Dependências Não Utilizadas
 * 
 * Este script analisa o projeto para identificar dependências que podem 
 * estar sendo importadas no package.json, mas não utilizadas no código.
 * 
 * Execução: node analyze-unused-dependencies.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);

// Cores para o console
const colors = {
  green: text => `\x1b[32m${text}\x1b[0m`,
  red: text => `\x1b[31m${text}\x1b[0m`,
  yellow: text => `\x1b[33m${text}\x1b[0m`,
  blue: text => `\x1b[34m${text}\x1b[0m`,
  magenta: text => `\x1b[35m${text}\x1b[0m`,
  cyan: text => `\x1b[36m${text}\x1b[0m`,
  bold: text => `\x1b[1m${text}\x1b[0m`,
};

// Dependências que devem estar em devDependencies, não em dependencies
const shouldBeDevDependencies = [
  'typescript',
  'eslint',
  'prettier',
  'jest',
  'mocha',
  'chai',
  'babel',
  '@babel/',
  'webpack',
  'rollup',
  'postcss',
  'autoprefixer',
  'sanity-codegen',
];

// Dependências que são comumente usadas indiretamente (não via import)
const indirectlyUsedDependencies = [
  'postcss',
  'autoprefixer',
  'tailwindcss',
  'typescript',
  'eslint',
  '@eslint/',
  'rimraf',
  'sharp',
];

// Principal função de análise
async function analyzeUnusedDependencies() {
  console.log(colors.bold(colors.blue('\n📦 Analisador de Dependências Nova Ipê')));
  console.log(colors.yellow('=======================================\n'));
  
  try {
    // 1. Ler o package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    console.log(`Total de dependências: ${colors.bold(Object.keys(dependencies).length + Object.keys(devDependencies).length)}`);
    console.log(`- Dependências regulares: ${colors.bold(Object.keys(dependencies).length)}`);
    console.log(`- Dependências de desenvolvimento: ${colors.bold(Object.keys(devDependencies).length)}\n`);
    
    // 2. Analisar cada dependência regular
    console.log(colors.bold('Analisando dependências regulares...\n'));
    
    const unusedDependencies = [];
    const usedOnlyInDemo = [];
    const wrongCategory = [];
    const canBeOptimized = [];
    
    for (const dependency of Object.keys(dependencies)) {
      process.stdout.write(`Verificando ${dependency}... `);
      
      // Verificar se é uma dependência que deveria estar em devDependencies
      const shouldBeDevDep = shouldBeDevDependencies.some(prefix => 
        dependency === prefix || dependency.startsWith(prefix)
      );
      
      if (shouldBeDevDep) {
        process.stdout.write(colors.yellow('DEV!\n'));
        wrongCategory.push(dependency);
        continue;
      }
      
      // Verificar se é usada indiretamente (sem import)
      const isIndirectlyUsed = indirectlyUsedDependencies.some(prefix => 
        dependency === prefix || dependency.startsWith(prefix)
      );
      
      if (isIndirectlyUsed) {
        process.stdout.write(colors.blue('Uso indireto ✓\n'));
        continue;
      }
      
      // Procurar uso da dependência em todo o projeto (excluindo node_modules e .next)
      try {
        // Normalizar nome para busca em imports
        let searchPattern = dependency;
        // Remover prefixos comuns para busca
        if (searchPattern.startsWith('@')) {
          const parts = searchPattern.split('/');
          if (parts.length > 1) {
            searchPattern = parts.slice(0, 2).join('/');
          }
        }
        
        // Executar grep para encontrar imports
        const { stdout } = await execAsync(
          `powershell -Command "Get-ChildItem -Path . -Recurse -File -Include *.js,*.jsx,*.ts,*.tsx | Where-Object { $_.FullName -notmatch 'node_modules|.next|dist|build|archive' } | Select-String -Pattern 'from [\\'\\\"]${searchPattern}[\\'\\\"]|require\\([\\'\\\"]${searchPattern}[\\'\\\"]\\)' | Measure-Object | Select-Object -ExpandProperty Count"`
        );
        
        const count = parseInt(stdout.trim(), 10);
        
        if (count === 0) {
          process.stdout.write(colors.red('Não encontrado! ❌\n'));
          unusedDependencies.push(dependency);
        } else {
          // Verificar se é usado apenas em arquivos de demonstração
          const { stdout: demoUsage } = await execAsync(
            `powershell -Command "Get-ChildItem -Path ./app/demo-* -Recurse -File -Include *.js,*.jsx,*.ts,*.tsx | Select-String -Pattern 'from [\\'\\\"]${searchPattern}[\\'\\\"]|require\\([\\'\\\"]${searchPattern}[\\'\\\"]\\)' | Measure-Object | Select-Object -ExpandProperty Count"`
          );
          
          const demoCount = parseInt(demoUsage.trim(), 10);
          
          if (demoCount === count) {
            process.stdout.write(colors.yellow('Usado apenas em demos! ⚠️\n'));
            usedOnlyInDemo.push(dependency);
          } else {
            process.stdout.write(colors.green('Usado ✓\n'));
            
            // Verificar se há mais de uma biblioteca para a mesma funcionalidade
            if (dependency === 'react-icons' && dependencies['lucide-react']) {
              canBeOptimized.push({ 
                name: dependency, 
                reason: 'Duplicação com lucide-react' 
              });
            }
            else if (dependency === 'embla-carousel' && 
                (dependencies['embla-carousel-react'] || dependencies['embla-carousel-autoplay'])) {
              canBeOptimized.push({ 
                name: dependency, 
                reason: 'Parte de um grupo de pacotes relacionados que podem ser otimizados' 
              });
            }
          }
        }
      } catch (error) {
        process.stdout.write(colors.red(`Erro! ${error.message}\n`));
      }
    }
    
    // 3. Mostrar resultados
    console.log(colors.yellow('\n======================================='));
    console.log(colors.bold('RESULTADOS DA ANÁLISE'));
    console.log(colors.yellow('=======================================\n'));
    
    console.log(colors.bold(colors.red('Dependências não utilizadas:'))); 
    if (unusedDependencies.length > 0) {
      unusedDependencies.forEach(dep => console.log(`- ${dep}`));
    } else {
      console.log('Nenhuma dependência completamente não utilizada encontrada.');
    }
    
    console.log(colors.bold(colors.yellow('\nDependências usadas apenas em demos:'))); 
    if (usedOnlyInDemo.length > 0) {
      usedOnlyInDemo.forEach(dep => console.log(`- ${dep}`));
    } else {
      console.log('Nenhuma dependência usada apenas em demos.');
    }
    
    console.log(colors.bold(colors.magenta('\nDependências na categoria errada:'))); 
    if (wrongCategory.length > 0) {
      wrongCategory.forEach(dep => console.log(`- ${dep} (mover para devDependencies)`));
    } else {
      console.log('Nenhuma dependência na categoria errada.');
    }
    
    console.log(colors.bold(colors.blue('\nDependências que podem ser otimizadas:'))); 
    if (canBeOptimized.length > 0) {
      canBeOptimized.forEach(dep => console.log(`- ${dep.name}: ${dep.reason}`));
    } else {
      console.log('Nenhuma dependência com oportunidade de otimização identificada.');
    }
    
    console.log(colors.yellow('\n======================================='));
    console.log(colors.bold('RECOMENDAÇÕES'));
    console.log(colors.yellow('=======================================\n'));
    
    const totalIssues = unusedDependencies.length + usedOnlyInDemo.length + 
                       wrongCategory.length + canBeOptimized.length;
    
    if (totalIssues > 0) {
      console.log(`Total de ${totalIssues} problemas encontrados que podem ser otimizados.`);
      console.log('\nPróximos passos recomendados:');
      
      if (unusedDependencies.length > 0) {
        console.log(colors.bold('1. Remover dependências não utilizadas:'));
        console.log(`   npm uninstall ${unusedDependencies.join(' ')}`);
      }
      
      if (wrongCategory.length > 0) {
        console.log(colors.bold('\n2. Mover para devDependencies:'));
        console.log(`   npm uninstall ${wrongCategory.join(' ')}`);
        console.log(`   npm install --save-dev ${wrongCategory.join(' ')}`);
      }
      
      if (usedOnlyInDemo.length > 0) {
        console.log(colors.bold('\n3. Considerar a remoção ou isolamento de dependências usadas apenas em demos'));
      }
      
      if (canBeOptimized.length > 0) {
        console.log(colors.bold('\n4. Otimizar dependências duplicadas ou relacionadas'));
      }
    } else {
      console.log(colors.green('Parabéns! Suas dependências parecem bem otimizadas.'));
    }
    
  } catch (error) {
    console.error(colors.red(`Erro ao analisar dependências: ${error.message}`));
  }
}

// Execução do script
analyzeUnusedDependencies();
