import { useState, useEffect } from 'react';

/**
 * ClientOnly component to prevent hydration mismatches
 * Renders children only after client-side hydration is complete
 */
export function ClientOnly({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return children;
}

/**
 * Hook to safely check if we're on the client side
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook for safe window access during SSR
 */
export function useWindow() {
  const [windowObj, setWindowObj] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowObj(window);
    }
  }, []);

  return windowObj;
}
