import { useDebounce as useBaseDebounce } from 'use-debounce';

function useDebounce<T>(
  value: T,
  delay: number = 1000,
  options?: {
    maxWait?: number;
    leading?: boolean;
    trailing?: boolean;
    equalityFn?: (left: T, right: T) => boolean;
  },
) {
  return useBaseDebounce(value, delay, options);
}

export default useDebounce;
