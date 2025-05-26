// Remove React import as it's not needed in this script
/**
 * @file diagnostics.ts
 * Utilitário para diagnóstico de problemas comuns no projeto Nova Ipê
 * Use para identificar e solucionar problemas rapidamente
 * 
 * @usage
 * Importe este arquivo em um componente temporário ou execute via Node.js
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

interface DiagnosticResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: string;
  fix?: string;
}

// Função para verificar problemas de Server/Client Components
async function checkServerClientIssues(): Promise<DiagnosticResult> {
  try {
    // Verifica se há imports de Server Components em Client Components
    // Esta é uma versão simplificada - a implementação real seria mais robusta
    return {
      name: 'Server/Client Component Separation',
      status: 'warn',
      message: 'Verifique manualmente se há imports de Server Components em Client Components',
      details: 'Server Components não podem ser importados diretamente em Client Components',
      fix: 'Use adaptadores client-side conforme documentado em RESOLUCAO-PROBLEMAS-MAIO-2025.md'
    };
  } catch (error) {
    return {
      name: 'Server/Client Component Separation',
      status: 'fail',
      message: `Erro ao verificar separation: ${error}`,
      fix: 'Execute a verificação manualmente'
    };
  }
}

// Função para verificar configurações experimentais incompatíveis
async function checkExperimentalConfig(): Promise<DiagnosticResult> {
  try {
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    const nextConfig = fs.readFileSync(nextConfigPath, 'utf-8');
    
    const hasPPR = nextConfig.includes('ppr:') && !nextConfig.includes('// ppr:');
    const isCanary = false; // Implementação real verificaria package.json
    
    if (hasPPR && !isCanary) {
      return {
        name: 'Experimental Features',
        status: 'fail',
        message: 'Uso de PPR detectado sem versão canary do Next.js',
        details: 'PPR (Partial Pre-Rendering) requer versão canary do Next.js',
        fix: 'Comente a linha com ppr: no next.config.js ou atualize para canary'
      };
    }
    
    return {
      name: 'Experimental Features',
      status: 'pass',
      message: 'Configurações experimentais compatíveis'
    };
  } catch (error) {
    return {
      name: 'Experimental Features',
      status: 'fail',
      message: `Erro ao verificar configurações experimentais: ${error}`,
      fix: 'Verifique next.config.js manualmente'
    };
  }
}

// Função para verificar problemas de tipagem TypeScript
async function checkTypeScriptIssues(): Promise<DiagnosticResult> {
  try {
    // Esta seria uma implementação real que executaria o TypeScript compiler
    // e verificaria os resultados
    return {
      name: 'TypeScript Validation',
      status: 'warn',
      message: 'Execute npm run typecheck para verificação completa',
      fix: 'Adicione tipos explícitos a todos os componentes e funções'
    };
  } catch (error) {
    return {
      name: 'TypeScript Validation',
      status: 'fail',
      message: `Erro ao verificar tipagem: ${error}`,
      fix: 'Execute npm run typecheck manualmente'
    };
  }
}

// Função para verificar problemas de instrumentação
async function checkInstrumentation(): Promise<DiagnosticResult> {
  try {
    const instrumentationPath = path.join(process.cwd(), 'src/lib/instrumentation.ts');
    const instrumentation = fs.readFileSync(instrumentationPath, 'utf-8');
      const hasProperChecks = 
      instrumentation.includes("process.env['NEXT_RUNTIME'] === 'nodejs'") &&
      instrumentation.includes("if (process.env['OTEL_EXPORTER_OTLP_ENDPOINT'])");
    
    if (!hasProperChecks) {
      return {
        name: 'OpenTelemetry Configuration',
        status: 'warn',
        message: 'Verificações de ambiente podem estar incompletas na instrumentação',
        fix: 'Adicione verificações adequadas antes de inicializar o SDK'
      };
    }
    
    return {
      name: 'OpenTelemetry Configuration',
      status: 'pass',
      message: 'Configuração de instrumentação parece correta'
    };
  } catch (error) {
    return {
      name: 'OpenTelemetry Configuration',
      status: 'fail',
      message: `Erro ao verificar instrumentação: ${error}`,
      fix: 'Verifique src/lib/instrumentation.ts manualmente'
    };
  }
}

// Função para verificar problemas de Error Boundary
async function checkErrorBoundaries(): Promise<DiagnosticResult> {
  try {
    const errorBoundaryPath = path.join(process.cwd(), 'app/components/ui/ErrorBoundary.tsx');
    const errorBoundary = fs.readFileSync(errorBoundaryPath, 'utf-8');
    
    const hasProperReporting = 
      errorBoundary.includes('onError') && 
      (errorBoundary.includes('gtag') || errorBoundary.includes('Sentry'));
    
    if (!hasProperReporting) {
      return {
        name: 'Error Boundaries',
        status: 'warn',
        message: 'Error boundaries podem não estar reportando erros adequadamente',
        fix: 'Implemente integração com serviços de analytics nas error boundaries'
      };
    }
    
    return {
      name: 'Error Boundaries',
      status: 'pass',
      message: 'Error boundaries parecem configurados corretamente'
    };
  } catch (error) {
    return {
      name: 'Error Boundaries',
      status: 'fail',
      message: `Erro ao verificar error boundaries: ${error}`,
      fix: 'Verifique app/components/ui/ErrorBoundary.tsx manualmente'
    };
  }
}

// Função principal para executar todos os diagnósticos
export async function runDiagnostics() {
  console.log(chalk.blue('=== Diagnóstico Nova Ipê ==='));
  
  try {
    const results = await Promise.all([
      checkServerClientIssues(),
      checkExperimentalConfig(),
      checkTypeScriptIssues(),
      checkInstrumentation(),
      checkErrorBoundaries()
    ]);
    
    let passCount = 0;
    let warnCount = 0;
    let failCount = 0;
    
    results.forEach(result => {
      switch (result.status) {
        case 'pass':
          console.log(chalk.green(`✓ ${result.name}: ${result['message']}`));
          passCount++;
          break;
        case 'warn':
          console.log(chalk.yellow(`⚠ ${result.name}: ${result['message']}`));
          if (result.details) {
            console.log(chalk.gray(`   Details: ${result.details}`));
          }
          if (result.fix) {
            console.log(chalk.gray(`   Fix: ${result.fix}`));
          }
          warnCount++;
          break;
        case 'fail':
          console.log(chalk.red(`✗ ${result.name}: ${result['message']}`));
          if (result.details) {
            console.log(chalk.gray(`   Details: ${result.details}`));
          }
          if (result.fix) {
            console.log(chalk.gray(`   Fix: ${result.fix}`));
          }
          failCount++;
          break;
      }
    });
    
    console.log(chalk.blue('\n=== Resumo ==='));
    console.log(chalk.green(`${passCount} checks passaram`));
    console.log(chalk.yellow(`${warnCount} avisos`));
    console.log(chalk.red(`${failCount} falhas`));
    
    return { passCount, warnCount, failCount, results };
  } catch (error) {
    console.error(chalk.red('Erro ao executar diagnóstico:'), error);
    throw error;
  }
}

// Se este arquivo for executado diretamente via Node.js
if (require.main === module) {
  runDiagnostics().catch(error => {
    console.error(chalk.red('Falha no diagnóstico:'), error);
    process.exit(1);
  });
}

export default {
  runDiagnostics,
  checkServerClientIssues,
  checkExperimentalConfig,
  checkTypeScriptIssues,
  checkInstrumentation,
  checkErrorBoundaries
};
