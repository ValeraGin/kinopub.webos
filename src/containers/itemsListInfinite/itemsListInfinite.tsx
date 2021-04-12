import { useCallback, useEffect, useMemo, useState } from 'react';
import filter from 'lodash/filter';
import flatMap from 'lodash/flatMap';
import uniqBy from 'lodash/uniqBy';

import { Item } from 'api';
import ItemsList from 'components/itemsList';
import useApiInfinite from 'hooks/useApiInfinite';

type Props = {
  queryResult: ReturnType<typeof useApiInfinite>;
  processItems?: (items: Item[]) => Item[];
};

type PageWithItems = {
  items: Item[];
};

const ItemsListInfinite: React.FC<Props> = ({ queryResult, processItems }) => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage } = queryResult;
  const [canFetchNextPage, setCanFetchNextPage] = useState(false);

  const items = useMemo(() => uniqBy(filter(flatMap<PageWithItems, Item>(data?.pages as PageWithItems[], (page) => page.items)), 'id'), [
    data?.pages,
  ]);
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

  return <ItemsList items={processedItems} loading={isLoading || isFetchingNextPage} onScrollToEnd={handleLoadMore} />;
};

export default ItemsListInfinite;
