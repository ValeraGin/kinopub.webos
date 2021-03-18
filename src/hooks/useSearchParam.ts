import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

function useSearchParam(param: string) {
  const location = useLocation<{ param: string }>();
  const value = useMemo(() => new URLSearchParams(location.search).get(param), [param, location.search]);

  return value;
}

export default useSearchParam;
