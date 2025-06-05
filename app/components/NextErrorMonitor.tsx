'use client';

/**
 * Next.js Error Monitor
 * 
 * This component specifically monitors for the errors we're trying to fix:
 * 1. Error: Invariant: Missing ActionQueueContext
 * 2. TypeError: Cannot read properties of undefined (reading 'userAgent')
 * 
 * It creates a floating indicator showing if errors are detected in development mode.
 */

import React, { useEffect, useState } from 'react';

interface ErrorStatus {
  actionQueue: boolean;
  userAgent: boolean;
  lastDetectedTime: number | null;
  errorsCount: number;
}

export default function NextErrorMonitor() {
  const [status, setStatus] = useState<ErrorStatus>({
    actionQueue: false,
    userAgent: false,
    lastDetectedTime: null,
    errorsCount: 0
  });

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Create an error listener
    const originalConsoleError = console.error;
    const originalWindowOnError = window.onerror;

    // Track errors through console.error
    console.error = (...args: any[]) => {
      // Check for our targeted errors
      if (args && args.length > 0) {
        const errorMessage = String(args[0]);
        
        // Check for ActionQueueContext error
        if (errorMessage.includes('Missing ActionQueueContext')) {
          setStatus(prev => ({
            ...prev,
            actionQueue: true,
            lastDetectedTime: Date.now(),
            errorsCount: prev.errorsCount + 1
          }));
        }
        
        // Check for userAgent error
        if (errorMessage.includes('userAgent') && errorMessage.includes('undefined')) {
          setStatus(prev => ({
            ...prev,
            userAgent: true,
            lastDetectedTime: Date.now(),
            errorsCount: prev.errorsCount + 1
          }));
        }
      }
      
      // Call the original console.error
      originalConsoleError.apply(console, args);
    };

    // Track errors through window.onerror
    window.onerror = function(message, source, lineno, colno, error) {
      const errorMessage = String(message);
      
      // Check for ActionQueueContext error
      if (errorMessage.includes('Missing ActionQueueContext')) {
        setStatus(prev => ({
          ...prev,
          actionQueue: true,
          lastDetectedTime: Date.now(),
          errorsCount: prev.errorsCount + 1
        }));
      }
      
      // Check for userAgent error
      if (errorMessage.includes('userAgent') && errorMessage.includes('undefined')) {
        setStatus(prev => ({
          ...prev,
          userAgent: true,
          lastDetectedTime: Date.now(),
          errorsCount: prev.errorsCount + 1
        }));
      }
      
      // Call the original handler if it exists
      if (typeof originalWindowOnError === 'function') {
        return originalWindowOnError.apply(window, [message, source, lineno, colno, error]);
      }
      return false;
    };

    // Show success message if no errors after 5 seconds
    const successTimer = setTimeout(() => {
      if (!status.actionQueue && !status.userAgent && status.errorsCount === 0) {
        console.log('✅ Next.js error fixes are working correctly! No errors detected.');
      }
    }, 5000);

    // Clean up
    return () => {
      console.error = originalConsoleError;
      window.onerror = originalWindowOnError;
      clearTimeout(successTimer);
    };
  }, [status.errorsCount]);

  // Don't render anything in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const hasErrors = status.actionQueue || status.userAgent;
  const timeAgo = status.lastDetectedTime 
    ? `${Math.round((Date.now() - status.lastDetectedTime) / 1000)}s ago` 
    : 'none detected';

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      backgroundColor: hasErrors ? 'rgba(255,0,0,0.9)' : 'rgba(0,128,0,0.9)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999,
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      maxWidth: '300px',
      fontFamily: 'monospace'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        Next.js Error Monitor
      </div>
      <div style={{ fontSize: '11px' }}>
        ActionQueueContext Error: {status.actionQueue ? '🔴 Detected' : '🟢 Fixed'}
      </div>
      <div style={{ fontSize: '11px' }}>
        UserAgent Error: {status.userAgent ? '🔴 Detected' : '🟢 Fixed'}
      </div>
      <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8 }}>
        Last error: {timeAgo}
      </div>
    </div>
  );
}
