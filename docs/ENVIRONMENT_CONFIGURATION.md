# Environment Configuration Guide

## Overview

This document explains the new centralized environment configuration system implemented to fix authentication and Sanity integration issues.

## Key Features

- **Centralized Configuration Management**: All environment variables are managed through a single system
- **Validation and Error Reporting**: Clear error messages for missing or invalid configuration
- **Graceful Fallbacks**: Application continues to work with limited functionality when possible
- **Development-Friendly**: Detailed error messages and configuration help in development mode

## Configuration Files

### Required Environment Variables

#### Sanity CMS Configuration

Add these to your `.env.development` file:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_TOKEN=your_api_token
```

#### Supabase Configuration

Add these to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

#### Additional Configuration

Add these to your `.env` or `.env.development` file:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Usage

### Automatic Initialization

The configuration system initializes automatically when the application starts. No manual setup is required.

### Checking Configuration Status

```typescript
import { EnvironmentManager } from '@/lib/environment-config';

// Check if services are configured
const isSanityReady = EnvironmentManager.isSanityConfigured();
const isSupabaseReady = EnvironmentManager.isSupabaseConfigured();

// Get full configuration
const config = EnvironmentManager.getConfig();
console.log('Sanity configured:', config.sanity.configured);
console.log('Supabase configured:', config.supabase.configured);
```

### Validation

```typescript
import { validateAppConfig } from '@/lib/config-validator';

// Validate configuration (throws error if invalid)
validateAppConfig();

// Or get validation results without throwing
const validation = EnvironmentManager.validateConfig();
if (!validation.isValid) {
  console.error('Configuration errors:', validation.errors);
}
```

## Error Handling

### Development Mode

In development, the application will show detailed error messages and configuration help when environment variables are missing or invalid.

### Production Mode

In production, the application will:

- Log errors to the console
- Show user-friendly error messages
- Continue with limited functionality when possible
- Gracefully degrade features that require missing services

## Troubleshooting

### Common Issues

1. **"Sanity configuration is incomplete"**
   - Check that all Sanity environment variables are set in `.env.development`
   - Verify the project ID and dataset are correct
   - Ensure the API token has the necessary permissions

2. **"Supabase configuration is incomplete"**
   - Check that Supabase URL and anon key are set in `.env.local`
   - Verify the URL starts with `https://`
   - Ensure the anon key is valid

3. **"Configuration validation failed"**
   - Run the application in development mode to see detailed error messages
   - Check all environment files for typos or missing variables
   - Restart the development server after making changes

### Debug Commands

```bash
# Check configuration status
npm run dev

# The application will log configuration status on startup
```

### Configuration Status Check

You can check the configuration status programmatically:

```typescript
import { getConfigStatus } from '@/lib/config-validator';

const status = getConfigStatus();
console.log('Configuration Status:', status);
```

## Migration from Old System

The new configuration system is backward compatible. Existing code will continue to work, but you'll get better error handling and validation.

### What Changed

1. **Sanity Client**: Now uses centralized configuration with better error handling
2. **Supabase Client**: Now validates configuration before creating client
3. **Environment Variables**: Same variables, but now validated centrally
4. **Error Handling**: Better error messages and graceful fallbacks

### What Stayed the Same

1. **API**: All existing functions and components work the same way
2. **Environment Files**: Same file structure and variable names
3. **Functionality**: All features work as before, just with better error handling

## Best Practices

1. **Environment Files**: Keep sensitive tokens in `.env.local` (not committed to git)
2. **Development**: Use `.env.development` for development-specific configuration
3. **Production**: Ensure all required variables are set in your deployment environment
4. **Validation**: The system will validate configuration automatically
5. **Error Handling**: Check configuration status before performing critical operations

## Support

If you encounter issues with the configuration system:

1. Check the console for detailed error messages
2. Verify all environment variables are correctly set
3. Restart the development server after making changes
4. Consult this documentation for troubleshooting steps
