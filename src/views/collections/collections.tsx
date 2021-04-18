import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import Input from 'components/input';
import CollectionsListInfinite from 'containers/collectionsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';

const SearchInput = styled(Input)`
  margin-bottom: 1rem;
`;

const CollectionsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const queryResult = useApiInfinite('collections', [query, 'watchers-']);

  const handleQueryChange = useCallback(
    ({ value }) => {
      setQuery(value);
    },
    [setQuery],
  );

  return (
    <>
      <SearchInput placeholder="Название подборки..." value={query} onChange={handleQueryChange} />
      <CollectionsListInfinite queryResult={queryResult} />
    </>
  );
};

export default CollectionsView;
