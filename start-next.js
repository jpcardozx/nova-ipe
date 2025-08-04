const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Iniciando diagnóstico do Next.js...');

// Verificar se .next existe e remove se existir
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
    console.log('🧹 Limpando cache .next...');
    fs.rmSync(nextDir, { recursive: true, force: true });
}

// Verificar node_modules/.cache
const cacheDir = path.join(process.cwd(), 'node_modules', '.cache');
if (fs.existsSync(cacheDir)) {
    console.log('🧹 Limpando cache node_modules...');
    fs.rmSync(cacheDir, { recursive: true, force: true });
}

console.log('🚀 Iniciando Next.js...');

// Iniciar Next.js com mais verbose logging
const nextProcess = spawn('npx', ['next', 'dev', '--turbo'], {
    stdio: 'inherit',
    shell: true,
    env: { 
        ...process.env, 
        NODE_ENV: 'development',
        NEXT_TELEMETRY_DISABLED: '1'
    }
});

nextProcess.on('error', (err) => {
    console.error('❌ Erro ao iniciar Next.js:', err);
    process.exit(1);
});

nextProcess.on('exit', (code) => {
    console.log(`📊 Next.js finalizou com código: ${code}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando servidor...');
    nextProcess.kill('SIGINT');
});
