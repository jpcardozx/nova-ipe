# 🔧 Fix: Login Redirect Issue

**Date:** October 11, 2025  
**Issue:** Fluxo quebrado em /login voltando para dashboard apos credencias, quebrando em redirecionamento pra estudio e dashboard e sem debugging responsivo

## 🎯 Root Cause Analysis

### Problem 1: Race Condition in Authentication Flow

The `useSupabaseAuth` hook had an `onAuthStateChange` listener that called `router.refresh()` on every auth state change, including `SIGNED_IN`. This created a race condition:

1. User submits login form
2. Supabase authentication succeeds
3. `onAuthStateChange` fires → `router.refresh()` is called
4. Login page tries to redirect with `router.push('/dashboard')` or `router.push('/studio')`
5. The `router.refresh()` interferes with the redirect, causing:
   - Redirect to fail
   - User stays on login page
   - Or redirect loops back

### Problem 2: Incorrect Studio Authentication Flow

The login page was using **only** Supabase authentication for both Dashboard and Studio modes. However:

- **Dashboard mode** → Should use Supabase Auth (user credentials)
- **Studio mode** → Should use Admin Password via `/api/login` endpoint

The code was not differentiating between these two modes, causing studio authentication to fail.

### Problem 3: Poor Error Handling

When `setIsLoading(false)` was in the `finally` block, it would execute even after successful login, potentially causing UI issues or interfering with redirects.

## ✅ Solutions Implemented

### Solution 1: Fix Race Condition in `useSupabaseAuth`

**File:** `lib/hooks/useSupabaseAuth.ts`

**Change:** Modified `onAuthStateChange` to only call `router.refresh()` on `SIGNED_OUT` event:

```typescript
// Before
supabase.auth.onAuthStateChange((_event, session) => {
  setUser(session?.user ?? null)
  setLoading(false)
  router.refresh() // ⚠️ Causes race condition
})

// After
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔄 Auth state change:', event)
  setUser(session?.user ?? null)
  setLoading(false)
  
  // Only refresh on SIGN_OUT to avoid interfering with redirects during SIGN_IN
  if (event === 'SIGNED_OUT') {
    router.refresh()
  }
})
```

**Benefits:**
- No more race condition during login
- Redirects work smoothly
- Page still refreshes on logout as expected

### Solution 2: Separate Authentication Flows

**File:** `app/login/page.tsx`

**Change:** Split authentication logic based on `loginMode`:

```typescript
if (loginMode === 'studio') {
  // Studio Mode: Use Admin Password
  // 1. Authenticate via /api/login with admin password
  // 2. Create studio session via /api/studio/session
  // 3. Redirect to /studio
} else {
  // Dashboard Mode: Use Supabase Auth
  // 1. Authenticate via Supabase
  // 2. Sync user profile (async)
  // 3. Redirect to /dashboard
}
```

**Studio Flow:**
1. ✅ Validate credentials against `ADMIN_PASS` via `/api/login`
2. ✅ Create studio session cookie via `/api/studio/session`
3. ✅ Redirect to `/studio`

**Dashboard Flow:**
1. ✅ Authenticate via Supabase Auth
2. ✅ Sync user profile (non-blocking)
3. ✅ Redirect to `/dashboard`

### Solution 3: Better Error Handling

**Change:** Move `setIsLoading(false)` to specific error paths instead of `finally` block:

```typescript
try {
  // Authentication logic
  if (error) {
    setIsLoading(false) // ✅ Only on error
    return
  }
  
  // Success - redirect happens here
  // isLoading stays true during redirect
  setTimeout(() => {
    router.push(redirectPath)
  }, 100)
} catch (error) {
  setErrorMessage('...')
  setIsLoading(false) // ✅ Only on exception
}
```

### Solution 4: Enhanced Debugging

Added comprehensive console logging:
- 🔄 Login flow start
- 🎬 Studio authentication steps
- 🔐 Dashboard authentication steps
- ✅ Success messages
- ❌ Error messages with context
- 🚀 Redirect confirmation

## 🧪 Testing

### Test Case 1: Dashboard Login
1. Navigate to `/login`
2. Select "Dashboard" mode
3. Enter valid credentials
4. Click "Acessar Plataforma"

**Expected Result:**
- ✅ Authenticates via Supabase
- ✅ Redirects to `/dashboard`
- ✅ No redirect loops
- ✅ No console errors

### Test Case 2: Studio Login
1. Navigate to `/login`
2. Select "Estúdio" mode
3. Enter admin credentials
4. Click "Acessar Plataforma"

**Expected Result:**
- ✅ Authenticates via Admin Password
- ✅ Creates studio session
- ✅ Redirects to `/studio`
- ✅ No redirect loops
- ✅ No console errors

### Test Case 3: Invalid Credentials
1. Enter invalid credentials
2. Click "Acessar Plataforma"

**Expected Result:**
- ✅ Shows appropriate error message
- ✅ Stays on login page
- ✅ Loading state returns to normal

## 📊 Technical Details

### Files Modified
- `app/login/page.tsx` - Split authentication flows, improved error handling
- `lib/hooks/useSupabaseAuth.ts` - Fixed race condition in onAuthStateChange

### Authentication APIs Used
- `/api/login` - Studio admin authentication
- `/api/studio/session` - Studio session management
- Supabase Auth - Dashboard user authentication

### Key Improvements
1. ✅ No more race condition between router.push and router.refresh
2. ✅ Proper authentication flow separation (Studio vs Dashboard)
3. ✅ Better error handling and user feedback
4. ✅ Enhanced debugging with console logs
5. ✅ Smooth redirects without loops

## 🔮 Future Improvements

- Consider adding loading indicators during redirect
- Add retry logic for failed authentications
- Implement rate limiting for failed login attempts
- Add more granular error messages
- Consider using a state machine for authentication flow

## 📝 Notes

- The 100ms timeout before redirect ensures state updates are processed
- Studio mode requires `ADMIN_PASS` environment variable
- Dashboard mode requires Supabase configuration
- Both modes now work independently and correctly
