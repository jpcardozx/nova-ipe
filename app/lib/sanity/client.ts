
// app/lib/sanity/client.ts

import { createClient, type SanityClient } from 'next-sanity';
import FallbackDataService from '../../../lib/fallback-data/fallback-service';

// 1. Centralized Configuration
// ==========================================================================

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: process.env.NODE_ENV === 'production',
};

// Basic validation
if (!sanityConfig.projectId || !sanityConfig.dataset || !sanityConfig.apiVersion) {
  console.warn('Sanity configuration is incomplete. Check environment variables.');
}

// 2. The "Strong" Enhanced Sanity Client Class
// ==========================================================================

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
}

interface EnhancedClientConfig {
  enableFallback: boolean;
  logErrors: boolean;
  retryConfig: RetryConfig;
}

export interface AuthValidationResult {
  isValid: boolean;
  hasToken: boolean;
  error?: string;
}

export interface FetchResult<T> {
  data: T;
  success: boolean;
  error?: string;
  fromFallback: boolean;
  retryCount: number;
}

class EnhancedSanityClient {
  private client: SanityClient;
  private config: EnhancedClientConfig;

  constructor(client: SanityClient, config?: Partial<EnhancedClientConfig>) {
    this.client = client;
    this.config = {
      enableFallback: true,
      logErrors: true,
      retryConfig: { maxRetries: 2, baseDelay: 500 },
      ...config,
    };
  }

  private shouldNotRetry(error: Error): boolean {
    const msg = error.message.toLowerCase();
    return [
      'unauthorized',
      'forbidden',
      'invalid query',
      'syntax error',
      'project not found',
      'dataset not found',
    ].some(keyword => msg.includes(keyword));
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetch<T>(query: string, params: Record<string, any> = {}): Promise<FetchResult<T>> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.retryConfig.maxRetries; attempt++) {
      try {
        const data = await this.client.fetch<T>(query, params);
        return { data, success: true, fromFallback: false, retryCount: attempt };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (this.config.logErrors) {
          console.error(`Sanity fetch attempt ${attempt + 1} failed: ${lastError.message}`);
        }
        if (this.shouldNotRetry(lastError)) break;
        if (attempt < this.config.retryConfig.maxRetries) {
          await this.sleep(this.config.retryConfig.baseDelay * (attempt + 1));
        }
      }
    }

    if (this.config.enableFallback) {
      if (this.config.logErrors) {
        console.warn(`Sanity fetch failed. Using fallback data for query: ${query.substring(0, 50)}...`);
      }
      // NOTE: This is a simplified fallback. A real implementation would need to map the query to a specific fallback method.
      const fallbackData = FallbackDataService.getAllImoveis() as unknown as T;
      return { data: fallbackData, success: false, error: lastError?.message, fromFallback: true, retryCount: this.config.retryConfig.maxRetries };
    }

    const emptyResult = (Array.isArray(null) ? [] : {}) as T;
    return { data: emptyResult, success: false, error: lastError?.message || 'Unknown error', fromFallback: false, retryCount: this.config.retryConfig.maxRetries };
  }

  async testAuthentication(): Promise<AuthValidationResult> {
    if (!sanityConfig.token) {
      return { isValid: false, hasToken: false, error: 'SANITY_API_TOKEN is not configured' };
    }
    try {
      // Use a simple query that requires authentication
      await this.client.fetch('*[_type == "sanity.imageAsset"][0]._id');
      return { isValid: true, hasToken: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { isValid: false, hasToken: true, error: `Authentication failed: ${message}` };
    }
  }
}

// 3. Client Instantiation
// ==========================================================================

// Public client for browser-side usage (uses CDN, no token)
export const client = createClient({
  ...sanityConfig,
  useCdn: true,
  token: undefined,
});

// Authenticated client for server-side usage (no CDN, uses token)
const serverSideClient = createClient({
  ...sanityConfig,
  useCdn: false,
});

// The "Strong" client instance for server-side operations
export const enhancedServerClient = new EnhancedSanityClient(serverSideClient);

// 4. Unified Fetch Function and Exports
// ==========================================================================

/**
 * Performs a Sanity fetch, using the enhanced server client on the server
 * and the public client on the browser.
 */
export async function sanityFetch<T>(query: string, params: Record<string, any> = {}): Promise<FetchResult<T>> {
  if (typeof window === 'undefined') {
    // Server-side: use the enhanced client
    return enhancedServerClient.fetch<T>(query, params);
  }
  // Client-side: use the public client (no retry/fallback logic here for simplicity)
  try {
    const data = await client.fetch<T>(query, params);
    return { data, success: true, fromFallback: false, retryCount: 0 };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Sanity client-side fetch failed:', message);
    return { data: {} as T, success: false, error: message, fromFallback: false, retryCount: 0 };
  }
}

/**
 * Tests the authentication of the server-side client.
 */
export async function testSanityAuth(): Promise<AuthValidationResult> {
  return enhancedServerClient.testAuthentication();
}
