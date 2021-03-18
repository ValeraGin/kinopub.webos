import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import ApiClient from '../api/client';
import { Method, Methods } from './useApi';

function useApiInfinite<T extends Method>(method: T, ...params: Parameters<ApiClient[T]>) {
  const client = useMemo(() => new ApiClient(), []);
  const query = useInfiniteQuery<Methods[T]>(
    [method, ...params],
    ({ pageParam }) => {
      // @ts-expect-error
      return client[method](...params, pageParam) as Methods[T];
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage['pagination']?.current + 1 || 1;
      },
    },
  );

  return query;
}

export default useApiInfinite;
