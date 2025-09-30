import { NextRequest, NextResponse } from 'next/server'

const WORDPRESS_BASE_URL = 'http://187.45.193.173'
const PORTAL_HOST = 'portal.imobiliariaipe.com.br'

// Cache simples em memória (para desenvolvimento)
const cache = new Map<string, { data: string, timestamp: number, headers: Record<string, string> }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

// Tentar diferentes abordagens para bypass do suPHP
const BYPASS_STRATEGIES = [
  { path: '', headers: {} }, // Tentativa padrão
  { path: '/index.html', headers: {} }, // Tentativa com index.html
  { path: '', headers: { 'X-Forwarded-Proto': 'http' } }, // Forçar HTTP
]

// Contador de tentativas para estratégias
let strategyIndex = 0

// Função para gerar fallback HTML funcional
function generateWordPressFallback(path: string, request: NextRequest) {
  const isAdmin = path.includes('wp-admin')
  const isLogin = path.includes('wp-login')

  if (isAdmin || isLogin) {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Portal IPÊ - Acesso Administrativo</title>
        <style>
          body { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif; background: #f1f1f1; margin: 0; padding: 40px; }
          .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.13); }
          .logo { text-align: center; margin-bottom: 30px; color: #0073aa; font-size: 24px; font-weight: bold; }
          .alert { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
          .btn { background: #0073aa; color: white; padding: 12px 24px; border: none; border-radius: 4px; text-decoration: none; display: inline-block; margin: 5px; cursor: pointer; }
          .btn:hover { background: #005a87; }
          .info { font-size: 14px; color: #666; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🏢 Portal IPÊ</div>
          <div class="alert">
            <strong>Servidor em Manutenção</strong><br>
            O sistema WordPress está temporariamente indisponível devido a problemas técnicos.
          </div>
          <p>Enquanto isso, você pode:</p>
          <a href="/" class="btn">← Voltar ao Site Principal</a>
          <a href="/dashboard" class="btn">Acessar Novo Dashboard</a>
          <div class="info">
            <strong>Para administradores:</strong><br>
            • Erro: suPHP UID mismatch<br>
            • Status: Notificado para correção<br>
            • ETA: 2-24 horas
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Fallback para páginas públicas do WordPress
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Portal IPÊ Imóveis</title>
      <style>
        body { font-family: system-ui, sans-serif; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); text-align: center; max-width: 500px; }
        .logo { font-size: 3rem; margin-bottom: 20px; }
        h1 { color: #333; margin-bottom: 20px; }
        p { color: #666; line-height: 1.6; margin-bottom: 30px; }
        .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
        .feature { padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .feature h3 { margin: 0 0 10px 0; color: #495057; }
        .feature p { margin: 0; font-size: 14px; }
        .btn { background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 15px 30px; border: none; border-radius: 8px; text-decoration: none; display: inline-block; margin: 10px; font-weight: bold; transition: transform 0.2s; }
        .btn:hover { transform: translateY(-2px); }
        .status { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; text-align: left; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🏢</div>
        <h1>Portal IPÊ Imóveis</h1>
        <p>Bem-vindo ao portal da IPÊ Imóveis. Estamos em processo de migração para uma nova plataforma mais moderna e eficiente.</p>

        <div class="features">
          <div class="feature">
            <h3>🔒 Mais Seguro</h3>
            <p>SSL válido e criptografia completa</p>
          </div>
          <div class="feature">
            <h3>⚡ Mais Rápido</h3>
            <p>Performance otimizada</p>
          </div>
          <div class="feature">
            <h3>📱 Responsivo</h3>
            <p>Funciona em todos os dispositivos</p>
          </div>
          <div class="feature">
            <h3>🎨 Moderno</h3>
            <p>Interface renovada</p>
          </div>
        </div>

        <div class="status">
          <strong>🔧 Status Técnico:</strong><br>
          Sistema legado temporariamente indisponível.<br>
          Nova plataforma já está funcionando!
        </div>

        <a href="/" class="btn">🏠 Acessar Novo Site</a>
        <a href="/dashboard" class="btn">⚡ Dashboard Moderno</a>
      </div>
    </body>
    </html>
  `
}

// Função para tentar diferentes estratégias de bypass
async function tryWordPressAccess(targetUrl: string, headers: Record<string, string>) {
  const strategies = [
    // Estratégia 1: Tentar acesso direto
    () => fetch(targetUrl, { headers }),

    // Estratégia 2: Tentar index.html em vez de index.php
    () => fetch(targetUrl.replace('/index.php', '/index.html'), { headers }),

    // Estratégia 3: Tentar acesso via diferentes User-Agents
    () => fetch(targetUrl, {
      headers: {
        ...headers,
        'User-Agent': 'Mozilla/5.0 (compatible; PortalProxy/1.0; +https://imobiliariaipe.com.br/portal)'
      }
    }),

    // Estratégia 4: Tentar sem host header customizado
    () => fetch(targetUrl, {
      headers: {
        ...headers,
        'Host': undefined
      }
    }),
  ]

  for (let i = 0; i < strategies.length; i++) {
    try {
      const response = await strategies[i]()
      if (response && response.status !== 500) {
        console.log(`[PORTAL PROXY] Estratégia ${i + 1} funcionou: ${response.status}`)
        return response
      }
      console.log(`[PORTAL PROXY] Estratégia ${i + 1} falhou: ${response?.status || 'erro'}`)
    } catch (error) {
      console.log(`[PORTAL PROXY] Estratégia ${i + 1} erro:`, error)
    }
  }

  return null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params
  const path = resolvedParams?.path?.join('/') || ''
  const searchParams = request.nextUrl.searchParams.toString()
  const fullPath = path + (searchParams ? `?${searchParams}` : '')

  // Verificar cache primeiro
  const cacheKey = `GET:${fullPath}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[PORTAL PROXY] Cache hit: ${cacheKey}`)
    return new NextResponse(cached.data, {
      headers: cached.headers
    })
  }

  const targetUrl = `${WORDPRESS_BASE_URL}/${fullPath}`
  console.log(`[PORTAL PROXY] GET ${request.url} -> ${targetUrl}`)

  const requestHeaders = {
    'Host': PORTAL_HOST,
    'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0 (compatible; PortalProxy/1.0)',
    'Accept': request.headers.get('accept') || '*/*',
    'Accept-Language': request.headers.get('accept-language') || 'pt-BR,pt;q=0.9,en;q=0.8',
    'X-Forwarded-For': request.headers.get('x-forwarded-for') || '127.0.0.1',
    'X-Forwarded-Proto': 'https',
    'X-Forwarded-Host': request.headers.get('host') || 'imobiliariaipe.com.br',
    'X-Real-IP': request.headers.get('x-forwarded-for') || '127.0.0.1'
  }

  try {
    // Tentar múltiplas estratégias de acesso
    const response = await tryWordPressAccess(targetUrl, requestHeaders)

    // Se nenhuma estratégia funcionou, retornar fallback
    if (!response || response.status === 500 || response.status >= 400) {
      console.log(`[PORTAL PROXY] Todas estratégias falharam, usando fallback HTML`)

      const fallbackHtml = generateWordPressFallback(fullPath, request)

      // Cache do fallback por menos tempo
      const fallbackHeaders = {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Proxy-Status': 'fallback',
        'X-Proxy-Reason': response ? `HTTP ${response.status}` : 'Connection failed'
      }

      cache.set(cacheKey, {
        data: fallbackHtml,
        timestamp: Date.now(),
        headers: fallbackHeaders
      })

      return new NextResponse(fallbackHtml, {
        status: 503,
        headers: fallbackHeaders
      })
    }

    // Para outros tipos de erro, também retornar página informativa
    if (!response.ok) {
      console.log(`[PORTAL PROXY] Erro ${response.status}: ${response.statusText}`)
      return new NextResponse(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Portal IPÊ - Erro ${response.status}</title>
          <style>
            body {
              font-family: system-ui, sans-serif;
              background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
              margin: 0;
              padding: 2rem;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container {
              background: white;
              padding: 3rem;
              border-radius: 1rem;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 500px;
            }
            .icon { font-size: 4rem; margin-bottom: 1rem; }
            h1 { color: #1f2937; margin-bottom: 1rem; }
            p { color: #6b7280; margin-bottom: 2rem; line-height: 1.6; }
            .error {
              background: #fef2f2;
              color: #dc2626;
              padding: 1rem;
              border-radius: 0.5rem;
              margin: 1rem 0;
              font-size: 0.9rem;
              border-left: 4px solid #dc2626;
            }
            .btn {
              background: #3b82f6;
              color: white;
              padding: 0.75rem 2rem;
              border: none;
              border-radius: 0.5rem;
              text-decoration: none;
              display: inline-block;
              margin: 0.5rem;
            }
            .btn:hover { background: #2563eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">❌</div>
            <h1>Portal Indisponível</h1>
            <p>Não foi possível conectar ao portal legado no momento.</p>

            <div class="error">
              <strong>Erro ${response.status}:</strong> ${response.statusText}<br>
              <strong>URL:</strong> ${targetUrl}<br>
              <strong>Horário:</strong> ${new Date().toLocaleString('pt-BR')}
            </div>

            <p>Tente novamente em alguns minutos ou use o link direto abaixo:</p>

            <a href="/" class="btn">← Voltar ao Site Principal</a>
            <a href="https://portal.imobiliariaipe.com.br" target="_blank" class="btn">🔗 Acesso Direto</a>
          </div>
        </body>
        </html>
      `, {
        status: response.status,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      })
    }

    // Sucesso - processar o conteúdo
    const contentType = response.headers.get('content-type') || 'text/html'

    if (contentType.includes('text/html')) {
      let html = await response.text()

      // Substituir URLs internas do WordPress para usar o proxy
      html = html
        .replace(/https?:\/\/portal\.imobiliariaipe\.com\.br/g, `${request.nextUrl.origin}/portal`)
        .replace(/https?:\/\/187\.45\.193\.173/g, `${request.nextUrl.origin}/portal`)
        .replace(/href="\/(?!portal)/g, `href="/portal/`)
        .replace(/src="\/(?!portal)/g, `src="/portal/`)
        .replace(/action="\/(?!portal)/g, `action="/portal/`)

      return new NextResponse(html, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Proxy-Status': 'success'
        }
      })
    }

    // Para outros tipos de conteúdo (CSS, JS, imagens, etc.)
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': response.headers.get('cache-control') || 'public, max-age=3600',
        'X-Proxy-Status': 'success'
      }
    })

  } catch (error) {
    console.error('[PORTAL PROXY] Erro na requisição:', error)

    return new NextResponse(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Portal IPÊ - Erro de Conexão</title>
        <style>
          body {
            font-family: system-ui, sans-serif;
            background: linear-gradient(135deg, #7c2d12 0%, #dc2626 100%);
            margin: 0;
            padding: 2rem;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            background: white;
            padding: 3rem;
            border-radius: 1rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 500px;
          }
          .icon { font-size: 4rem; margin-bottom: 1rem; }
          h1 { color: #1f2937; margin-bottom: 1rem; }
          p { color: #6b7280; margin-bottom: 2rem; line-height: 1.6; }
          .error {
            background: #fef2f2;
            color: #dc2626;
            padding: 1rem;
            border-radius: 0.5rem;
            margin: 1rem 0;
            font-size: 0.9rem;
            border-left: 4px solid #dc2626;
            font-family: monospace;
          }
          .btn {
            background: #3b82f6;
            color: white;
            padding: 0.75rem 2rem;
            border: none;
            border-radius: 0.5rem;
            text-decoration: none;
            display: inline-block;
            margin: 0.5rem;
          }
          .btn:hover { background: #2563eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">🔌</div>
          <h1>Erro de Conexão</h1>
          <p>Não foi possível estabelecer conexão com o servidor do portal.</p>

          <div class="error">
            <strong>Erro:</strong> ${error instanceof Error ? error.message : 'Erro desconhecido'}<br>
            <strong>URL:</strong> ${targetUrl}<br>
            <strong>Horário:</strong> ${new Date().toLocaleString('pt-BR')}
          </div>

          <p>O servidor pode estar offline ou com problemas de rede.</p>

          <a href="/" class="btn">← Voltar ao Site Principal</a>
          <a href="javascript:location.reload()" class="btn">🔄 Tentar Novamente</a>
        </div>
      </body>
      </html>
    `, {
      status: 500,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params
  const path = resolvedParams?.path?.join('/') || ''
  const targetUrl = `${WORDPRESS_BASE_URL}/${path}`

  console.log(`[PORTAL PROXY] POST ${request.url} -> ${targetUrl}`)

  try {
    const body = await request.text()

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Host': PORTAL_HOST,
        'Content-Type': request.headers.get('content-type') || 'application/x-www-form-urlencoded',
        'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0',
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || '127.0.0.1',
        'X-Forwarded-Proto': 'https',
        'X-Forwarded-Host': request.headers.get('host') || 'imobiliariaipe.com.br'
      },
      body
    })

    if (response.headers.get('content-type')?.includes('text/html')) {
      let html = await response.text()
      html = html
        .replace(/https?:\/\/portal\.imobiliariaipe\.com\.br/g, `${request.nextUrl.origin}/portal`)
        .replace(/https?:\/\/187\.45\.193\.173/g, `${request.nextUrl.origin}/portal`)
        .replace(/href="\/(?!portal)/g, `href="/portal/`)
        .replace(/src="\/(?!portal)/g, `src="/portal/`)
        .replace(/action="\/(?!portal)/g, `action="/portal/`)

      return new NextResponse(html, {
        status: response.status,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Proxy-Status': 'success'
        }
      })
    }

    const buffer = await response.arrayBuffer()
    const responseHeaders = new Headers()
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value)
    })

    return new NextResponse(buffer, {
      status: response.status,
      headers: responseHeaders
    })

  } catch (error) {
    console.error('[PORTAL PROXY] Erro no POST:', error)
    return NextResponse.json(
      { error: 'Erro interno do proxy', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}