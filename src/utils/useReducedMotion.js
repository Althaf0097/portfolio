import { useEffect, useState } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * Returns true if user prefers reduced motion
 *
 * BOLT OPTIMIZATION: Uses lazy initialization in useState to avoid 'cascading render' warnings during hydration/effects.
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

export default useReducedMotion;
