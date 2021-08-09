import { useCallback } from 'react';
import orderBy from 'lodash/orderBy';

import { Item } from 'api';
import Input from 'components/input';
import Seo from 'components/seo';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import useRouteState from 'hooks/useRouteState';
import useSearchParams from 'hooks/useSearchParams';

function orderItems(items: Item[]) {
  return orderBy(items, 'year', 'desc');
}

const SearchView: React.FC = () => {
  const searchParams = useSearchParams();
  const [query, setQuery] = useRouteState('q', '');
  const queryResult = useApiInfinite('itemsSearch', [
    {
      ...searchParams,
      q: query,
    },
  ]);
  const handleQueryChange = useCallback(
    (value) => {
      setQuery(value);
    },
    [setQuery],
  );

  return (
    <>
      <Seo title="Поиск" />
      <div className="m-1 mb-3 mr-2">
        <Input autoFocus placeholder="Название фильма или сериала..." value={query} onChange={handleQueryChange} />
      </div>
      {query.length >= 3 && <ItemsListInfinite queryResult={queryResult} processItems={orderItems} />}
    </>
  );
};

export default SearchView;
