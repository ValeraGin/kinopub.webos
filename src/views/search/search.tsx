import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import filter from 'lodash/filter';
import flatMap from 'lodash/flatMap';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import styled from 'styled-components';

import { Item } from '../../api';
import Input from '../../components/input';
import ItemsList from '../../components/itemsList';
import useApiInfinite from '../../hooks/useApiInfinite';
import useRouteState from '../../hooks/useRouteState';
import MainLayout from '../../layouts/main';

type Props = {};

const SearchInput = styled(Input)`
  margin-bottom: 1rem;
`;

const SearchView: React.FC<Props> = () => {
  const location = useLocation<{ type?: string; field?: string }>();
  const [canFetchNextPage, setCanFetchNextPage] = useState(false);
  const [query, setQuery] = useRouteState('q', '');
  const { data, isLoading, isFetchingNextPage, fetchNextPage } = useApiInfinite('itemsSearch', {
    q: query,
    type: location.state?.type,
    field: location.state?.field,
  });
  const items = useMemo(() => uniqBy(filter(flatMap(data?.pages, (page) => page.items as Item[])), 'id'), [data?.pages]);
  const orderedItems = useMemo(() => orderBy(items, 'year', 'desc'), [items]);
  const handleQueryChange = useCallback(
    ({ value }) => {
      setQuery(value);
    },
    [setQuery],
  );
  const handleLoadMore = useCallback(() => {
    if (canFetchNextPage) {
      fetchNextPage();
      setCanFetchNextPage(false);
    }
  }, [canFetchNextPage, fetchNextPage]);

  useEffect(() => {
    setCanFetchNextPage(true);
  }, [items.length]);

  return (
    <MainLayout>
      <SearchInput placeholder="Название фильма или сериала..." value={query} onChange={handleQueryChange} />
      <ItemsList items={orderedItems} loading={(isLoading || isFetchingNextPage) && query.length >= 3} onLoadMore={handleLoadMore} />
    </MainLayout>
  );
};

export default SearchView;
