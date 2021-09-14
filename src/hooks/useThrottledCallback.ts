import { useThrottledCallback as useBaseThrottledCallback } from 'use-debounce';
import type { CallOptions } from 'use-debounce/lib/useDebouncedCallback';

function useThrottledCallback<T extends (...args: any[]) => ReturnType<T>>(func: T, wait: number = 500, options?: CallOptions) {
  return useBaseThrottledCallback(func, wait, options);
}

export default useThrottledCallback;
