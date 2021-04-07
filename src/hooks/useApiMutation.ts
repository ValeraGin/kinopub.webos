import { useMemo } from 'react';
import { useMutation } from 'react-query';

import ApiClient from 'api';

import { Method, Methods } from './useApi';

function useApiMutation<TMethod extends Method, TData = Methods[TMethod], TError = string, TVariables = Parameters<ApiClient[TMethod]>>(
  method: TMethod,
) {
  const client = useMemo(() => new ApiClient(), []);

  // @ts-expect-error
  const mutation = useMutation<TData, TError, TVariables>([client, method], (params) => client[method](...params));

  return Object.assign({}, mutation, {
    [method]: mutation.mutate,
    [`${method}Async`]: mutation.mutateAsync,
  });
}

export default useApiMutation;
