import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import ApiClient, { PaginationResponse } from 'api';

import { Method, Methods } from './useApi';

function useApiInfinite<T extends Method>(method: T, ...params: Parameters<ApiClient[T]>) {
  const client = useMemo(() => new ApiClient(), []);
  const query = useInfiniteQuery<Methods[T], string, Methods[T]>(
    [method, ...params],
    ({ pageParam }) => {
      // @ts-expect-error
      return client[method](...params, pageParam) as Methods[T];
    },
    {
      // @ts-expect-error
      getNextPageParam: (lastPage: PaginationResponse) => {
        return lastPage?.pagination?.current + 1 || 1;
      },
    },
  );

  return query;
}

export default useApiInfinite;
