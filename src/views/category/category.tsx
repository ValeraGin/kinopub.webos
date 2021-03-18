import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import flatMap from 'lodash/flatMap';
import uniqBy from 'lodash/uniqBy';

import ItemsList from '../../components/itemsList';
import useApiInfinite from '../../hooks/useApiInfinite';
import MainLayout from '../../layouts/main';
import { RouteParams } from '../../routes';

type Props = {};

const CategoryView: React.FC<Props> = () => {
  const { categoryId } = useParams<RouteParams>();
  const [canFetchNextPage, setCanFetchNextPage] = useState(false);
  const { data, isLoading, isFetchingNextPage, fetchNextPage } = useApiInfinite('items', {
    type: categoryId,
  });
  const items = useMemo(
    () =>
      uniqBy(
        flatMap(data?.pages, (page) => page.items),
        'id',
      ),
    [data?.pages],
  );

  const handleLoadMore = useCallback(() => {
    if (canFetchNextPage) {
      fetchNextPage();
    }
  }, [canFetchNextPage, fetchNextPage]);

  useEffect(() => {
    setCanFetchNextPage(true);
  }, [items.length]);

  return (
    <MainLayout>
      <ItemsList items={items} loading={isLoading || isFetchingNextPage} onLoadMore={handleLoadMore} />
    </MainLayout>
  );
};

export default CategoryView;
