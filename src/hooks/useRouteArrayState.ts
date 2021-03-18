import { useCallback, useMemo } from 'react';

import useRouteState, { RouteStateOptions } from './useRouteState';

export const ROUTER_ARRAY_SEPARATOR = ';';

export type RouteArrayStateOptions<T> = {
  useHistoryReplace?: boolean;
  deserializeItem?: (value: string) => T;
  serializeItem?: (value: T) => string;
};

const defaultOptions: Required<RouteArrayStateOptions<any>> = {
  useHistoryReplace: false,
  deserializeItem: (value) => value,
  serializeItem: (value) => String(value),
};

export function serializeArray<T>(values: T[], serializeItem: (value: T) => string = defaultOptions.serializeItem) {
  return values.map(serializeItem).join(ROUTER_ARRAY_SEPARATOR);
}

// eslint-disable-next-line no-shadow
export function deserializeArray<T>(value: string, deserializeItem: (value: string) => T = defaultOptions.deserializeItem) {
  return value.split(ROUTER_ARRAY_SEPARATOR).map(deserializeItem);
}

function useRouteArrayState<T, Key extends string>(
  key: Key,
  initialValue: T[],
  options?: RouteArrayStateOptions<T>,
): [T[], (value: T[], useHistoryReplace?: boolean) => void, (useHistoryReplace?: boolean) => void] {
  const opts = useMemo(() => ({ ...defaultOptions, ...options } as Required<RouteArrayStateOptions<T>>), [options]);
  const serialize = useCallback((values: T[]) => serializeArray(values, opts.serializeItem), [opts]);
  const deserialize = useCallback((value: string) => deserializeArray(value, opts.deserializeItem), [opts]);
  const routeStateOptions = useMemo(
    () =>
      ({
        serialize,
        deserialize,
        useHistoryReplace: opts.useHistoryReplace,
      } as RouteStateOptions<T[]>),
    [opts, serialize, deserialize],
  );

  return useRouteState(key, initialValue, routeStateOptions);
}

export default useRouteArrayState;
