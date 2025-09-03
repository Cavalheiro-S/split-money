'use client';

import { useEffect, useRef } from 'react';

export function useApiDebug() {
  const apiCalls = useRef<Map<string, number>>(new Map());
  const lastCallTime = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const url = args[0] as string;
      const now = Date.now();
      
      const currentCount = apiCalls.current.get(url) || 0;
      apiCalls.current.set(url, currentCount + 1);
      
      const lastCall = lastCallTime.current.get(url) || 0;
      const timeSinceLastCall = now - lastCall;
      
      if (timeSinceLastCall < 1000 && currentCount > 5) {
        console.warn(`🚨 Possível loop detectado para ${url}: ${currentCount} chamadas em ${timeSinceLastCall}ms`);
      }
      
      lastCallTime.current.set(url, now);
      
      console.log(`🌐 API Call: ${url} (${currentCount + 1}ª chamada)`);
      
      try {
        const response = await originalFetch(...args);
        return response;
      } catch (error) {
        console.error(`❌ API Error for ${url}:`, error);
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const clearCounters = () => {
    apiCalls.current.clear();
    lastCallTime.current.clear();
  };

  const getStats = () => {
    const stats: Record<string, { count: number; lastCall: number }> = {};
    
    apiCalls.current.forEach((count, url) => {
      const lastCall = lastCallTime.current.get(url) || 0;
      stats[url] = { count, lastCall };
    });
    
    return stats;
  };

  return { clearCounters, getStats };
}
