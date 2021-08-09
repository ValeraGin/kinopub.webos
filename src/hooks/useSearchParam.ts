import useSearchParams from './useSearchParams';

function useSearchParam(param: string) {
  const searchParams = useSearchParams();

  return searchParams[param];
}

export default useSearchParam;
