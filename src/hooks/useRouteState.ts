import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

export type RouteStateOptions<T> = {
  useHistoryReplace?: boolean;
  deserialize?: (value: string) => T;
  serialize?: (value: T) => string;
};

const defaultOptions: Required<RouteStateOptions<any>> = {
  useHistoryReplace: false,
  deserialize: (value) => value,
  serialize: (value) => String(value),
};

type UseRouteStateResult<T> = [T, (value: T, useHistoryReplace?: boolean) => void, (useHistoryReplace?: boolean) => void];

function useRouteState<T, Key extends string>(key: Key, initialValue: T, options?: RouteStateOptions<T>): UseRouteStateResult<T> {
  const history = useHistory();
  const opts = useMemo(() => ({ ...defaultOptions, ...options } as Required<RouteStateOptions<T>>), [options]);

  const value = useMemo(() => {
    const params = new URLSearchParams(history.location.search);
    const param = params.get(key);

    if (param) {
      return opts.deserialize(param);
    }

    return initialValue;
  }, [key, initialValue, opts, history.location.search]);

  const handleChange = useCallback(
    (newValue: T, useHistoryReplace?: boolean) => {
      const location = history.location;
      const prevSearch = location.search;
      const params = new URLSearchParams(prevSearch);
      const serialized = opts.serialize(newValue);

      if (serialized) {
        params.set(key, serialized);
      } else {
        params.delete(key);
      }

      const newSearch = `?${params}`;

      if (prevSearch !== newSearch) {
        (useHistoryReplace || opts.useHistoryReplace ? history.replace : history.push)(
          // @ts-expect-error
          {
            search: newSearch,
            hash: location.hash,
            pathname: location.pathname,
          },
          location.state,
        );
      }
    },
    [key, opts, history],
  );
  const handleReset = useCallback(
    (useHistoryReplace?: boolean) => {
      handleChange(initialValue, useHistoryReplace);
    },
    [initialValue, handleChange],
  );

  return [value, handleChange, handleReset];
}

export default useRouteState;
