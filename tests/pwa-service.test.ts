/**
 * Unit tests for PWA Service utilities
 * 
 * This file tests the PWA service functionality without needing actual service worker registration
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePWAStatus, type PWAStatus } from '../app/utils/pwa-service';
import { renderHook, act } from '@testing-library/react';

// Mock service worker utilities
vi.mock('../app/utils/service-worker-utils', () => ({
    isServiceWorkerActive: vi.fn().mockReturnValue(false),
    sendMessageToServiceWorker: vi.fn().mockResolvedValue({ success: true, data: { version: '1.4.0' } }),
    getServiceWorkerVersion: vi.fn().mockResolvedValue({ version: '1.4.0', cacheName: 'test-cache', timestamp: 123456789 })
}));

// Mock navigator and window properties for testing
const setupServiceWorkerMock = (isRegistered = true, isActive = false) => {
    const mockServiceWorkerContainer = {
        controller: isActive ? {} : null,
        getRegistrations: vi.fn().mockResolvedValue(isRegistered ? [{}] : []),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
    };

    // Persist any existing navigator functions we need to restore later
    const originalNavigator = { ...navigator };
    const originalWindow = { ...window };

    // Mock navigator for testing
    Object.defineProperty(global, 'navigator', {
        value: {
            ...originalNavigator,
            onLine: true,
            serviceWorker: mockServiceWorkerContainer
        },
        writable: true
    });

    // Mock the window object
    Object.defineProperty(global, 'window', {
        value: {
            ...originalWindow,
            matchMedia: vi.fn().mockReturnValue({ matches: false })
        },
        writable: true
    });    // Add caches API
    global.caches = {
        open: vi.fn().mockImplementation((cacheName: string) => {
            return Promise.resolve({
                keys: vi.fn().mockResolvedValue([
                    { url: 'http://localhost/test1' } as Request,
                    { url: 'http://localhost/test2' } as Request
                ]),
                match: vi.fn().mockResolvedValue(undefined),
                matchAll: vi.fn().mockResolvedValue([]),
                put: vi.fn().mockResolvedValue(undefined),
                add: vi.fn().mockResolvedValue(undefined),
                addAll: vi.fn().mockResolvedValue(undefined),
                delete: vi.fn().mockResolvedValue(true)
            } as unknown as Cache);
        }),
        keys: vi.fn().mockImplementation(() => Promise.resolve(['cache1', 'cache2'])),
        match: vi.fn().mockResolvedValue(undefined),
        has: vi.fn().mockResolvedValue(true),
        delete: vi.fn().mockResolvedValue(true)
    } as unknown as CacheStorage;

    return {
        restore: () => {
            Object.defineProperty(global, 'navigator', {
                value: originalNavigator,
                writable: true
            }); Object.defineProperty(global, 'window', {
                value: originalWindow,
                writable: true
            });
            // Make caches optional before deleting it
            Object.defineProperty(global, 'caches', {
                value: undefined,
                configurable: true,
                writable: true
            });
        }
    };
};

describe('PWA Service', () => {
    let mockRestore: { restore: () => void };

    beforeEach(() => {
        mockRestore = setupServiceWorkerMock();
        vi.useFakeTimers();
    });

    afterEach(() => {
        mockRestore.restore();
        vi.useRealTimers();
        vi.resetAllMocks();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => usePWAStatus());

        expect(result.current[0]).toMatchObject({
            isOnline: true,
            serviceWorkerActive: false,
            serviceWorkerRegistered: false,
            canInstall: false
        });
    });

    it('should track online status changes', async () => {
        const { result } = renderHook(() => usePWAStatus());

        // Simulate going offline
        act(() => {
            Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
            window.dispatchEvent(new Event('offline'));
        });

        expect(result.current[0].isOnline).toBe(false);

        // Simulate going back online
        act(() => {
            Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
            window.dispatchEvent(new Event('online'));
        });

        expect(result.current[0].isOnline).toBe(true);
    });

    it('should attempt to clear cache when clearCache is called', async () => {
        const { result } = renderHook(() => usePWAStatus());

        await act(async () => {
            const success = await result.current[1].clearCache();
            expect(success).toBe(true);
        });
    });
});
