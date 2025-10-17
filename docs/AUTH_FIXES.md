# Authentication and Cookie Configuration Fixes

## Overview

This document describes the fixes implemented to resolve authentication and session management issues in the application.

## Issues Addressed

### 1. Cookie Domain Configuration ✅

**Problem**: Cookies were being set for `ipeimoveis-...vercel.app` which are not sent when accessing `imobiliariaipe.com.br`.

**Solution**: 
- Implemented environment-aware cookie configuration
- Production cookies now use:
  - `domain: .imobiliariaipe.com.br` (only on non-Vercel production)
  - `secure: true` (HTTPS only)
  - `path: /` (available site-wide)
  - `sameSite: 'lax'` (CSRF protection)

**Files Modified**:
- `lib/supabase/middleware.ts`
- `lib/supabase/server.ts`
- `lib/auth/supabase-auth.ts`

### 2. OAuth Callback Missing exchangeCodeForSession ✅

**Problem**: OAuth flow wasn't calling `exchangeCodeForSession`, causing client-side success but server-side failure.

**Solution**:
- Created `/app/auth/callback/route.ts`
- Properly exchanges OAuth code for server session
- Persists cookies with correct domain configuration

**Implementation**:
```typescript
const { data, error } = await supabase.auth.exchangeCodeForSession(code)
```

### 3. Middleware Response Handling ✅

**Problem**: Middleware was creating new response instead of returning the mutated one from `updateSession`.

**Solution**:
- Removed unnecessary response cloning
- Now directly returns the mutated response from `updateSession`
- Ensures cookie updates are preserved

**Before**:
```typescript
const updatedResponse = NextResponse.next({
  request: { headers: new Headers(response.headers) }
})
// Copy cookies manually...
return updatedResponse
```

**After**:
```typescript
// response already has updated cookies from updateSession
response.headers.set('x-user-id', user.id)
return response
```

### 4. Dashboard Static Caching ✅

**Problem**: Dashboard could be statically cached, showing stale data.

**Solution**:
- Dashboard is already a Client Component (`'use client'`)
- Added cache control headers to prevent CDN caching
- Headers: `Cache-Control: private, no-cache, no-store, must-revalidate`

### 5. Cloudflare Caching Prevention ✅

**Problem**: CDN/proxy was caching authentication pages.

**Solution**:
- Added comprehensive cache control headers to middleware
- Protected routes get: `Cache-Control: private, no-cache, no-store, must-revalidate`
- Also added `Pragma: no-cache` and `Expires: 0` for older proxies
- Login page specifically gets cache headers

### 6. Client-Side Redirect Flow ✅

**Problem**: Using `router.refresh()` before `router.replace()` causes infinite loops.

**Solution**:
- Verified existing code uses `window.location.href` (correct approach)
- No changes needed - implementation already correct
- Hard navigation ensures middleware validates new session

**Current Implementation** (in `useAuth.ts`):
```typescript
window.location.href = redirectPath
```

### 7. Middleware Asset Filtering ✅

**Problem**: Middleware was intercepting requests for `manifest.webmanifest` and `sounds/notification.mp3`.

**Solution**:
- Updated middleware to exclude:
  - `.webmanifest` files
  - `/sounds/` directory
  - Audio files: `.mp3`, `.wav`, `.ogg`
- Updated matcher regex to be more comprehensive

**Implementation**:
```typescript
if (
  pathname.startsWith('/_next') ||
  pathname.startsWith('/api/public') ||
  pathname.includes('/sounds/') ||
  pathname.endsWith('.webmanifest') ||
  pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|mp3|wav|ogg)$/)
) {
  return NextResponse.next()
}
```

## Cookie Configuration Logic

The cookie configuration automatically adapts to the environment:

| Environment | Domain | Secure | Notes |
|------------|---------|--------|-------|
| Development | `undefined` | `false` | Works with localhost |
| Production (Vercel) | `undefined` | `true` | For preview deployments |
| Production (Custom) | `.imobiliariaipe.com.br` | `true` | For production domain |

The logic checks:
1. `NODE_ENV === 'production'` - Are we in production?
2. `VERCEL === '1'` - Are we on Vercel platform?
3. If production AND not Vercel → Use custom domain

## Testing

### Test Cookie Configuration
```bash
npm run test:cookies
```

### Manual Testing Checklist

1. **Development**:
   - [ ] Login works on localhost
   - [ ] Cookies are set without domain
   - [ ] Session persists across page refreshes

2. **Production (Vercel Preview)**:
   - [ ] Login works on preview URLs
   - [ ] Cookies are secure but no domain restriction
   - [ ] OAuth flow works

3. **Production (Custom Domain)**:
   - [ ] Login works on imobiliariaipe.com.br
   - [ ] Cookies are set with `.imobiliariaipe.com.br` domain
   - [ ] Session persists across subdomains
   - [ ] OAuth callback properly exchanges code
   - [ ] No Cloudflare caching issues

4. **Assets**:
   - [ ] Manifest loads without auth check
   - [ ] Sound files load without auth check
   - [ ] Images load normally
   - [ ] No unnecessary middleware calls

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NODE_ENV=production  # Auto-set by hosting platform
VERCEL=1             # Auto-set by Vercel (optional)
```

## Deployment Notes

### Vercel Deployment
- Environment detection is automatic
- Preview deployments use secure cookies without domain
- Production deployment to custom domain will use `.imobiliariaipe.com.br`

### Custom Server Deployment
- Set `NODE_ENV=production`
- Do NOT set `VERCEL=1`
- Cookies will automatically use `.imobiliariaipe.com.br` domain

### Cloudflare Configuration
No special configuration needed - cache headers are set by middleware:
- Protected routes: `Cache-Control: private, no-cache, no-store, must-revalidate`
- Login page: Same cache headers
- Public routes: Default caching (can be customized)

## OAuth Provider Configuration

When setting up OAuth providers (Google, GitHub, etc.) in Supabase:

1. Add redirect URL: `https://imobiliariaipe.com.br/auth/callback`
2. Also add preview URLs if needed: `https://*.vercel.app/auth/callback`
3. The callback route will handle the code exchange automatically

## Troubleshooting

### Cookies not persisting
- Check browser dev tools → Application → Cookies
- Verify domain matches (`.imobiliariaipe.com.br` in production)
- Ensure `secure: true` only on HTTPS

### OAuth failing
- Check Supabase logs for errors
- Verify callback URL matches OAuth provider config
- Ensure `exchangeCodeForSession` is being called

### Session lost on redirect
- Verify middleware returns the mutated response
- Check that cookies have correct `sameSite` and `path`
- Ensure no cache is interfering (check response headers)

### Assets triggering auth
- Check middleware logs
- Verify matcher regex excludes the asset type
- Add new patterns to exclude list if needed

## Related Files

- `middleware.ts` - Main middleware with auth logic
- `lib/supabase/middleware.ts` - Session update helper
- `lib/supabase/server.ts` - Server-side Supabase client
- `lib/auth/supabase-auth.ts` - Auth server actions
- `app/auth/callback/route.ts` - OAuth callback handler
- `lib/hooks/useAuth.ts` - Client-side auth hook

## References

- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [HTTP Cookie Specification](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
