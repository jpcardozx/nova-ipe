/**
 * 🔍 Script de Teste de Performance - Studio Page
 * Mede o tempo real de carregamento do /studio
 */

const http = require('http');

const TEST_URL = 'http://localhost:3001/studio';
const TIMEOUT = 90000; // 90 segundos

console.log('🚀 Iniciando teste de performance do /studio...\n');
console.log(`📍 URL: ${TEST_URL}`);
console.log(`⏱️  Timeout: ${TIMEOUT}ms\n`);

const startTime = Date.now();

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/studio',
  method: 'GET',
  timeout: TIMEOUT,
  headers: {
    'User-Agent': 'Performance-Test-Script/1.0'
  }
};

const req = http.request(options, (res) => {
  const endTime = Date.now();
  const duration = endTime - startTime;

  console.log(`\n📊 Resposta recebida em ${duration}ms`);
  console.log(`📡 Status Code: ${res.statusCode}`);
  console.log(`📦 Headers:`, JSON.stringify(res.headers, null, 2));

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const htmlSize = Buffer.byteLength(data, 'utf8');
    console.log(`\n📄 HTML Size: ${(htmlSize / 1024).toFixed(2)} KB`);

    // Análise do HTML
    const hasNextScript = data.includes('/_next/static/');
    const hasSanity = data.toLowerCase().includes('sanity');

    console.log(`\n🔍 Análise do HTML:`);
    console.log(`  ✓ Contém scripts Next.js: ${hasNextScript}`);
    console.log(`  ✓ Contém referências Sanity: ${hasSanity}`);

    // Determinar resultado
    if (duration < 3000) {
      console.log('\n✅ EXCELENTE: Carregamento rápido (<3s)');
    } else if (duration < 5000) {
      console.log('\n✅ BOM: Carregamento aceitável (3-5s)');
    } else if (duration < 10000) {
      console.log('\n⚠️  LENTO: Carregamento demorado (5-10s)');
    } else {
      console.log('\n🚨 CRÍTICO: Carregamento muito lento (>10s)');
    }

    console.log('\n📝 NOTA: Este teste mede apenas o HTML inicial.');
    console.log('   O Sanity Studio carrega via JavaScript (dynamic import).');
    console.log('   Verifique o console do browser para tempos completos.\n');

    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error(`\n❌ Erro na requisição: ${error.message}`);
  process.exit(1);
});

req.on('timeout', () => {
  console.error(`\n🚨 TIMEOUT: Requisição excedeu ${TIMEOUT}ms`);
  req.destroy();
  process.exit(1);
});

req.end();

// Progress indicator
const progressInterval = setInterval(() => {
  const elapsed = Date.now() - startTime;
  process.stdout.write(`\r⏳ Aguardando resposta... ${(elapsed / 1000).toFixed(1)}s`);
}, 500);

process.on('exit', () => {
  clearInterval(progressInterval);
});
