import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import orderBy from 'lodash/orderBy';

import { Item } from 'api';
import Input from 'components/input';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import useRouteState from 'hooks/useRouteState';

function orderItems(items: Item[]) {
  return orderBy(items, 'year', 'desc');
}

const SearchView: React.FC = () => {
  const location = useLocation<{ type?: string; field?: string }>();
  const [query, setQuery] = useRouteState('q', '');
  const queryResult = useApiInfinite('itemsSearch', [
    {
      q: query,
      type: location.state?.type,
      field: location.state?.field,
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
      <div className="m-1 mb-3 mr-2">
        <Input autoFocus placeholder="Название фильма или сериала..." value={query} onChange={handleQueryChange} />
      </div>
      {query.length >= 3 && <ItemsListInfinite queryResult={queryResult} processItems={orderItems} />}
    </>
  );
};

export default SearchView;
