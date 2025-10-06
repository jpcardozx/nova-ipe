// scripts/check-seo-playwright.js
// Smoke test headless para validar SEO no DOM renderizado

const { chromium } = require('playwright');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.imobiliariaipe.com.br';
const GOOGLEBOT_UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

async function checkSEO() {
  console.log('🤖 Starting SEO check with Playwright...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: GOOGLEBOT_UA,
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log(`📍 Navigating to: ${SITE_URL}`);
    await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // 1. Check meta robots tag
    console.log('\n1️⃣ Checking <meta name="robots">...');
    const robotsMeta = await page.$('meta[name="robots"]');
    
    if (robotsMeta) {
      const content = await robotsMeta.getAttribute('content');
      console.log(`   Found: <meta name="robots" content="${content}">`);
      
      if (content && content.toLowerCase().includes('noindex')) {
        console.error('   ❌ ERROR: noindex found in meta robots!');
        process.exit(1);
      } else {
        console.log('   ✅ No noindex in meta robots');
      }
    } else {
      console.log('   ℹ️  No meta robots tag found (OK, using default)');
    }
    
    // 2. Check canonical
    console.log('\n2️⃣ Checking canonical link...');
    const canonical = await page.$('link[rel="canonical"]');
    
    if (canonical) {
      const href = await canonical.getAttribute('href');
      console.log(`   Found: ${href}`);
      
      if (href && href.includes('vercel.app')) {
        console.warn('   ⚠️  WARNING: Canonical points to Vercel preview domain!');
      } else if (href && href.includes('imobiliariaipe.com.br')) {
        console.log('   ✅ Canonical points to production domain');
      }
    } else {
      console.warn('   ⚠️  WARNING: No canonical tag found');
    }
    
    // 3. Check Open Graph
    console.log('\n3️⃣ Checking Open Graph tags...');
    const ogUrl = await page.$('meta[property="og:url"]');
    
    if (ogUrl) {
      const content = await ogUrl.getAttribute('content');
      console.log(`   og:url = ${content}`);
      
      if (content && content.includes('vercel.app')) {
        console.warn('   ⚠️  WARNING: OG URL points to Vercel domain!');
      } else {
        console.log('   ✅ OG URL correct');
      }
    }
    
    // 4. Check title
    console.log('\n4️⃣ Checking page title...');
    const title = await page.title();
    console.log(`   Title: ${title}`);
    
    if (!title || title.length < 10) {
      console.error('   ❌ ERROR: Title too short or missing!');
      process.exit(2);
    } else {
      console.log('   ✅ Title OK');
    }
    
    // 5. Check meta description
    console.log('\n5️⃣ Checking meta description...');
    const description = await page.$('meta[name="description"]');
    
    if (description) {
      const content = await description.getAttribute('content');
      console.log(`   Description: ${content?.substring(0, 80)}...`);
      
      if (!content || content.length < 50) {
        console.warn('   ⚠️  WARNING: Description too short');
      } else {
        console.log('   ✅ Description OK');
      }
    } else {
      console.error('   ❌ ERROR: No meta description!');
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ SEO check completed successfully!');
    
  } catch (error) {
    console.error('\n❌ ERROR during SEO check:');
    console.error(error);
    process.exit(3);
  } finally {
    await browser.close();
  }
}

checkSEO();
