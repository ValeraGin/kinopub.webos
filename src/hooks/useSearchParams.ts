import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { queryToObject } from 'utils/url';

function useSearchParams() {
  const location = useLocation();
  return useMemo(() => queryToObject(location.search), [location.search]);
}

export default useSearchParams;
