# CORS Configuration Guide for Sanity Studio

## Problem

The application shows CORS policy errors when trying to access Sanity API from localhost (both port 3000 and 3001).

## Solution Steps

### 1. Configure CORS in Sanity Studio Dashboard

1. **Access Sanity Management Dashboard:**

   - Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
   - Login with your Sanity account
   - Select your project: `0nks58lj` (nova-ipe)

2. **Navigate to API Settings:**

   - In the project dashboard, go to **API** → **CORS Origins**
   - Or directly access: https://www.sanity.io/manage/personal/project/0nks58lj/api/cors-origins

3. **Add Development Origins:**
   Add the following origins to allow local development:

   ```
   http://localhost:3000
   http://localhost:3001
   http://127.0.0.1:3000
   http://127.0.0.1:3001
   ```

4. **Add Production Origins (when needed):**
   ```
   https://your-production-domain.com
   https://www.your-production-domain.com
   ```

### 2. Environment Configuration

Ensure these environment variables are set in `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=0nks58lj
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-04-17
```

### 3. Proxy Fallback (Already Implemented)

Our application includes a proxy fallback at `/api/sanity-proxy` that:

- Handles CORS issues automatically
- Provides server-side Sanity queries
- Falls back to mock data if needed

### 4. Development Workflow

1. **Primary**: Configure CORS in Sanity Dashboard (recommended)
2. **Fallback**: Use the built-in proxy system
3. **Emergency**: Mock data system for development

### 5. Testing CORS Configuration

After configuring CORS origins in Sanity:

1. Restart the development server:

   ```bash
   npm run dev
   ```

2. Open browser DevTools and check for CORS errors in Console
3. Verify that Sanity API calls are successful
4. Test the `/api/debug/sanity` endpoint for diagnostics

### 6. Common CORS Issues

**Issue**: `Access to fetch at 'https://0nks58lj.api.sanity.io/...' from origin 'http://localhost:3001' has been blocked by CORS policy`

**Solution**: Add `http://localhost:3001` to CORS origins in Sanity Dashboard

**Issue**: CORS works for 3000 but not 3001 (or vice versa)

**Solution**: Add both ports to CORS origins

### 7. Production Deployment

When deploying to production:

1. Add your production domain to CORS origins
2. Update environment variables for production
3. Test thoroughly before going live

## Alternative: Using Sanity CLI

You can also configure CORS using Sanity CLI:

```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Login to Sanity
sanity login

# Add CORS origin
sanity cors add http://localhost:3001 --project 0nks58lj

# List current CORS origins
sanity cors list --project 0nks58lj
```

## Status

- ✅ Proxy system implemented
- ✅ CORS headers added to proxy
- ⏳ **Pending**: CORS origins configuration in Sanity Dashboard
- ⏳ **Pending**: Testing after CORS configuration

## Next Steps

1. Configure CORS origins in Sanity Dashboard
2. Test the application after CORS configuration
3. Remove or disable proxy system once CORS is properly configured
