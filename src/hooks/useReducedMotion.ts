import { useEffect, useState } from 'react';

/**
 * Detecta prefers-reduced-motion. Se usa para desactivar animaciones
 * dirigidas por JS (p. ej. count-up) y mostrar el estado final directo.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}