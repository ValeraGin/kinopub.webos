import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import orderBy from 'lodash/orderBy';
import styled from 'styled-components';

import { Item } from 'api';
import Input from 'components/input';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import useRouteState from 'hooks/useRouteState';

const SearchInput = styled(Input)`
  margin-bottom: 1rem;
`;

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
    ({ value }) => {
      setQuery(value);
    },
    [setQuery],
  );

  return (
    <>
      <SearchInput autoFocus placeholder="Название фильма или сериала..." value={query} onChange={handleQueryChange} />
      {query.length >= 3 && <ItemsListInfinite queryResult={queryResult} processItems={orderItems} />}
    </>
  );
};

export default SearchView;
