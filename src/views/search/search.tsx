import { useCallback } from 'react';
import orderBy from 'lodash/orderBy';

import { Item } from 'api';
import Input from 'components/input';
import Seo from 'components/seo';
import Text from 'components/text';
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

      <ItemsListInfinite
        title={
          <div className="w-full">
            <div className="flex justify-between items-center mb-3 h-9">
              <Text>Поиск</Text>
            </div>
            <Input autoFocus placeholder="Название фильма или сериала..." value={query} onChange={handleQueryChange} />
          </div>
        }
        showResult={query.length > 3}
        queryResult={queryResult}
        processItems={orderItems}
      />
    </>
  );
};

export default SearchView;
