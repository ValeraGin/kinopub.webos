import React, { useCallback, useState } from 'react';

import Input from 'components/input';
import Seo from 'components/seo';
import CollectionsListInfinite from 'containers/collectionsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';

const CollectionsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const queryResult = useApiInfinite('collections', [query, 'watchers-']);

  const handleQueryChange = useCallback(
    (value) => {
      setQuery(value);
    },
    [setQuery],
  );

  return (
    <>
      <Seo title="Коллекции" />
      <div className="m-1 mb-3 mr-2">
        <Input placeholder="Название подборки..." value={query} onChange={handleQueryChange} />
      </div>
      <CollectionsListInfinite queryResult={queryResult} />
    </>
  );
};

export default CollectionsView;
