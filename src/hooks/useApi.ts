import { useMemo } from 'react';
import { UseQueryOptions, useQuery } from 'react-query';

import ApiClient from 'api';

type Unpromise<T> = T extends Promise<infer U> ? U : T;

export type Methods = {
  [method in keyof ApiClient]: ApiClient[method] extends Function ? Unpromise<ReturnType<ApiClient[method]>> : never;
};

export type Method = keyof ApiClient & string;

function useApi<T extends Method>(
  method: T,
  params: Parameters<ApiClient[T]> = [] as Parameters<ApiClient[T]>,
  options?: UseQueryOptions<Methods[T]>,
) {
  const client = useMemo(() => new ApiClient(), []);
  const query = useQuery<Methods[T]>(
    [method, ...params],
    () =>
      // @ts-expect-error
      client[method](...params) as Methods[T],
    options,
  );

  return query;
}

export default useApi;
