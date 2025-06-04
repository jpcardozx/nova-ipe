const http = require('http');
const url = require('url');

const testEndpoints = [
  'http://localhost:3001/',
  'http://localhost:3001/_next/static/css/',
  'http://localhost:3001/_next/static/chunks/',
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const options = url.parse(endpoint);
    options.method = 'GET';
    
    const req = http.request(options, (res) => {
      console.log(`\n🔍 Testing: ${endpoint}`);
      console.log(`Status: ${res.statusCode}`);
      console.log(`Content-Type: ${res.headers['content-type'] || 'Not set'}`);
      console.log(`Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          url: endpoint,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          headers: res.headers,
          bodyLength: data.length
        });
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Error testing ${endpoint}:`, error.message);
      resolve({
        url: endpoint,
        error: error.message
      });
    });
    
    req.setTimeout(5000, () => {
      console.log(`⏰ Timeout testing ${endpoint}`);
      req.destroy();
      resolve({
        url: endpoint,
        error: 'Timeout'
      });
    });
    
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing MIME types and server responses...\n');
  
  const results = [];
  for (const endpoint of testEndpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
  
  console.log('\n📊 Summary:');
  results.forEach(result => {
    if (result.error) {
      console.log(`❌ ${result.url}: ${result.error}`);
    } else {
      console.log(`✅ ${result.url}: ${result.status} - ${result.contentType || 'No content-type'}`);
    }
  });
  
  console.log('\n🎯 Test completed!');
}

runTests().catch(console.error);
