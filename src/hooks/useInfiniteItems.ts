import { useCallback, useEffect, useMemo, useState } from 'react';
import filter from 'lodash/filter';
import flatMap from 'lodash/flatMap';
import uniqBy from 'lodash/uniqBy';

import useApiInfinite from 'hooks/useApiInfinite';

type PageWithItems<T, K extends string> = {
  [key in K]: T[];
};

export type QueryResult = ReturnType<typeof useApiInfinite>;

function useInfiniteItems<T, K extends string>(
  queryResult: QueryResult,
  processItems?: (items: T[]) => T[],
  // @ts-expect-error
  key: K = 'items',
  uniqKey: string = 'id',
) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage } = queryResult;
  const [canFetchNextPage, setCanFetchNextPage] = useState(false);

  const items = useMemo(
    () => uniqBy(filter(flatMap<PageWithItems<T, K>, T>(data?.pages as unknown as PageWithItems<T, K>[], (page) => page[key])), uniqKey),
    [data?.pages, key, uniqKey],
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
