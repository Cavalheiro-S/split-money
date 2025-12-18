import { useEffect, useState } from "react";

/**
 * Hook para debounce de valores
 * Útil para evitar chamadas excessivas de API em inputs de busca/filtros
 *
 * @param value - Valor a ser debounced
 * @param delay - Delay em milissegundos (default: 500ms)
 * @returns Valor debounced
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState('')
 * const debouncedSearch = useDebounce(search, 500)
 *
 * useEffect(() => {
 *   // Esta função será chamada apenas 500ms após o usuário parar de digitar
 *   fetchResults(debouncedSearch)
 * }, [debouncedSearch])
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Criar timer que atualiza o valor após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancelar o timer se value mudar antes do delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
