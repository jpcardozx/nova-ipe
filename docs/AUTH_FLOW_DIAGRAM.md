# Authentication Flow Diagram

## Login Flow with Cookie Configuration

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User Login Process                               │
└─────────────────────────────────────────────────────────────────────────┘

1. User visits /login page
   │
   ├─→ Middleware checks if /login is in PUBLIC_ROUTES
   │   └─→ ✅ YES → Add cache control headers → Continue
   │
   └─→ Page renders LoginPageContent (Client Component)

2. User enters credentials and submits
   │
   └─→ useAuth.login() hook called (client-side)
       │
       └─→ Calls serverLogin() Server Action
           │
           ├─→ Creates Supabase client with getCookieOptions()
           │   │
           │   ├─→ Development: { domain: undefined, secure: false }
           │   ├─→ Prod (Vercel): { domain: undefined, secure: true }
           │   └─→ Prod (Custom): { domain: '.imobiliariaipe.com.br', secure: true }
           │
           ├─→ supabase.auth.signInWithPassword()
           │   └─→ Sets cookies with proper configuration
           │
           └─→ revalidatePath('/', 'layout')

3. Client receives success response
   │
   └─→ window.location.href = '/dashboard'
       └─→ Hard navigation (browser reload)

4. Browser navigates to /dashboard
   │
   └─→ Middleware intercepts request
       │
       ├─→ Checks if path in PUBLIC_ROUTES
       │   └─→ ✅ NO → Continue
       │
       ├─→ Checks if path matches PROTECTED_ROUTES
       │   └─→ ✅ YES → Continue
       │
       ├─→ Calls updateSession(request)
       │   │
       │   ├─→ Creates Supabase client with getCookieOptions()
       │   ├─→ Reads cookies from request
       │   ├─→ Calls supabase.auth.getUser() (validates token)
       │   └─→ Returns mutated response with updated cookies
       │
       ├─→ Verifies user exists
       │   └─→ ✅ YES → Continue
       │
       ├─→ Checks user role permissions
       │   └─→ ✅ HAS PERMISSION → Continue
       │
       └─→ Adds headers and returns response
           ├─→ x-user-id
           ├─→ x-user-email
           ├─→ x-user-role
           └─→ Cache-Control: private, no-cache, no-store, must-revalidate

5. Dashboard page renders
   │
   └─→ Client Component (DashboardLayout)
       └─→ useCurrentUser() hook reads session
           └─→ ✅ User authenticated → Show dashboard
```

## OAuth Flow with exchangeCodeForSession

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         OAuth Login Flow                                 │
└─────────────────────────────────────────────────────────────────────────┘

1. User clicks "Login with Google" (or other provider)
   │
   └─→ supabase.auth.signInWithOAuth({ provider: 'google' })
       └─→ Redirects to Google OAuth page

2. User authorizes app on Google
   │
   └─→ Google redirects to: /auth/callback?code=xxx

3. OAuth callback route handler (NEW!)
   │
   ├─→ Extracts code from query params
   │
   ├─→ Creates Supabase client with getCookieOptions()
   │
   ├─→ ✅ CRITICAL: supabase.auth.exchangeCodeForSession(code)
   │   │
   │   ├─→ Exchanges OAuth code for session
   │   ├─→ Sets server-side cookies with proper domain
   │   └─→ Returns session data
   │
   └─→ Redirects to /dashboard (or requested page)

4. Browser navigates to /dashboard
   │
   └─→ [Same as Login Flow step 4]
       └─→ Middleware validates session → User authenticated ✅
```

## Cookie Configuration by Environment

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Cookie Configuration Matrix                          │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┬────────────────────┬─────────┬─────────┬────────────┐
│   Environment    │      Domain        │ Secure  │  Path   │  SameSite  │
├──────────────────┼────────────────────┼─────────┼─────────┼────────────┤
│ Development      │ undefined          │  false  │   /     │    lax     │
│ (localhost)      │                    │         │         │            │
├──────────────────┼────────────────────┼─────────┼─────────┼────────────┤
│ Production       │ undefined          │  true   │   /     │    lax     │
│ (Vercel preview) │                    │         │         │            │
├──────────────────┼────────────────────┼─────────┼─────────┼────────────┤
│ Production       │.imobiliariaipe.    │  true   │   /     │    lax     │
│ (Custom domain)  │    com.br          │         │         │            │
└──────────────────┴────────────────────┴─────────┴─────────┴────────────┘

Detection Logic:
  const isProd = process.env.NODE_ENV === 'production'
  const isVercel = process.env.VERCEL === '1'
  const domain = isProd && !isVercel ? '.imobiliariaipe.com.br' : undefined
```

## Middleware Asset Filtering

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Middleware Request Flow                               │
└─────────────────────────────────────────────────────────────────────────┘

Request → Middleware
          │
          ├─→ Check if asset/static file
          │   │
          │   ├─→ /_next/static/* → ✅ SKIP
          │   ├─→ /_next/image/* → ✅ SKIP
          │   ├─→ /api/public/* → ✅ SKIP
          │   ├─→ /sounds/* → ✅ SKIP (NEW!)
          │   ├─→ *.webmanifest → ✅ SKIP (NEW!)
          │   ├─→ *.mp3, *.wav, *.ogg → ✅ SKIP (NEW!)
          │   ├─→ *.svg, *.png, *.jpg → ✅ SKIP
          │   ├─→ *.css, *.js → ✅ SKIP
          │   └─→ else → Continue to auth check
          │
          ├─→ Check if PUBLIC_ROUTE
          │   │
          │   ├─→ /, /login, /sobre, etc. → ✅ SKIP (with cache headers for /login)
          │   └─→ else → Continue to auth check
          │
          ├─→ Check if PROTECTED_ROUTE
          │   │
          │   ├─→ /dashboard, /studio → Require auth
          │   └─→ else → ✅ SKIP (not protected)
          │
          └─→ Require Authentication
              │
              ├─→ updateSession(request)
              ├─→ Validate user exists
              ├─→ Check role permissions
              ├─→ Add cache headers (no-cache)
              └─→ Return mutated response
```

## Cache Control Strategy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Cache Control Headers                                │
└─────────────────────────────────────────────────────────────────────────┘

Public Routes (except /login):
  → Default Next.js caching
  → Can be cached by CDN

/login Page:
  Cache-Control: private, no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0
  → Prevents stale login forms
  → Forces fresh render

Protected Routes (/dashboard, /studio):
  Cache-Control: private, no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0
  x-user-id: [user-id]
  x-user-email: [user-email]
  x-user-role: [user-role]
  → No CDN caching
  → Private to user
  → Fresh data every time

Static Assets:
  → Standard caching (long TTL)
  → Bypasses middleware
  → Optimized delivery
```

## Before vs After

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Before Fixes                                     │
└─────────────────────────────────────────────────────────────────────────┘

❌ Cookies set with wrong domain
   → ipeimoveis-xxx.vercel.app
   → Not sent to imobiliariaipe.com.br

❌ OAuth flow incomplete
   → Code received but not exchanged
   → Client thinks logged in, server disagrees

❌ Middleware response cloned
   → Cookie updates lost
   → Session not persisted

❌ CDN caching protected pages
   → Stale user data
   → Wrong user sees cached content

❌ Middleware intercepting assets
   → Unnecessary auth checks
   → Performance impact

┌─────────────────────────────────────────────────────────────────────────┐
│                         After Fixes                                      │
└─────────────────────────────────────────────────────────────────────────┘

✅ Cookies with correct domain
   → .imobiliariaipe.com.br in production
   → Works across subdomains
   → Proper secure flag

✅ OAuth flow complete
   → exchangeCodeForSession called
   → Server session established
   → Cookies persisted correctly

✅ Middleware returns mutated response
   → Cookie updates preserved
   → Session persists across requests

✅ No CDN caching of auth pages
   → Fresh data every time
   → No stale content
   → Cache headers prevent caching

✅ Assets bypass middleware
   → Fast asset delivery
   → No unnecessary auth checks
   → Better performance
```
