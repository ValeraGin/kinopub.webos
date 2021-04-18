import { useCallback, useEffect, useMemo, useState } from 'react';
import filter from 'lodash/filter';
import flatMap from 'lodash/flatMap';
import uniqBy from 'lodash/uniqBy';

import useApiInfinite from 'hooks/useApiInfinite';

type PageWithItems<T> = {
  items: T[];
};

export type QueryResult = ReturnType<typeof useApiInfinite>;

function useInfiniteItems<T>(queryResult: QueryResult, processItems?: (items: T[]) => T[]) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage } = queryResult;
  const [canFetchNextPage, setCanFetchNextPage] = useState(false);

  const items = useMemo(
    () => uniqBy(filter(flatMap<PageWithItems<T>, T>((data?.pages as unknown) as PageWithItems<T>[], (page) => page.items)), 'id'),
    [data?.pages],
  );
  const processedItems = useMemo(() => (processItems ? processItems(items) : items), [items, processItems]);

  const handleLoadMore = useCallback(() => {
    if (canFetchNextPage) {
      fetchNextPage();
      setCanFetchNextPage(false);
    }
  }, [canFetchNextPage, fetchNextPage]);

  useEffect(() => {
    setCanFetchNextPage(true);
  }, [items.length]);

  return [processedItems, isLoading || isFetchingNextPage, handleLoadMore] as const;
}

export default useInfiniteItems;
