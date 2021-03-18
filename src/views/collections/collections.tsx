import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import CollectionsList from '../../components/collectionsList';
import Input from '../../components/input';
import useApi from '../../hooks/useApi';
import MainLayout from '../../layouts/main';

type Props = {};

const SearchInput = styled(Input)`
  margin-bottom: 1rem;
`;

const CollectionsView: React.FC<Props> = () => {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useApi('collections', query, 'watchers-');

  const handleQueryChange = useCallback(
    ({ value }) => {
      setQuery(value);
    },
    [setQuery],
  );

  return (
    <MainLayout>
      <SearchInput placeholder="Название подборки..." value={query} onChange={handleQueryChange} />
      <CollectionsList collections={data?.items} loading={isLoading} />
    </MainLayout>
  );
};

export default CollectionsView;
