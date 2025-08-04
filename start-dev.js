const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando Next.js Development Server...');
console.log('📁 Diretório:', process.cwd());

// Limpar cache antes de iniciar
const fs = require('fs');
const cacheDir = path.join(process.cwd(), '.next');
if (fs.existsSync(cacheDir)) {
    console.log('🧹 Limpando cache...');
    fs.rmSync(cacheDir, { recursive: true, force: true });
}

// Iniciar Next.js
const nextProcess = spawn('npx', ['next', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' }
});

nextProcess.on('error', (err) => {
    console.error('❌ Erro ao iniciar:', err);
});

nextProcess.on('close', (code) => {
    console.log(`📊 Processo encerrado com código: ${code}`);
});
