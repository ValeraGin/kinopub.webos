import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import map from 'lodash/map';

import Input from 'components/input';
import Link from 'components/link';
import Seo from 'components/seo';
import Text from 'components/text';
import CollectionsListInfinite from 'containers/collectionsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import { PATHS, RouteParams, generatePath } from 'routes';

const COLLECTION_TYPES = {
  created: 'Новые',
  watchers: 'Популярные',
  views: 'Просматриваемые',
} as const;

type CollectionsType = keyof typeof COLLECTION_TYPES;

const getGenreByType = (collectionType?: CollectionsType) => {
  return (collectionType ? COLLECTION_TYPES[collectionType] : collectionType) || '';
};

const CollectionsView: React.FC = () => {
  const { collectionType = 'created' } = useParams<RouteParams>();
  const [query, setQuery] = useState('');
  const queryResult = useApiInfinite('collections', [query, `${collectionType}-`]);
  const title = getGenreByType(collectionType as CollectionsType);

  const handleQueryChange = useCallback(
    (value) => {
      setQuery(value);
    },
    [setQuery],
  );

  return (
    <>
      <Seo title={`Подборки: ${title}`} />
      <CollectionsListInfinite
        title={
          <div className="w-full">
            <div className="flex justify-between items-center mb-3">
              <Text>{title}</Text>
              <div className="flex">
                {map(COLLECTION_TYPES, (collectionTypeName, collectionTypeKey) => (
                  <Link
                    key={collectionTypeKey}
                    className="mr-2"
                    replace
                    active={collectionType === collectionTypeKey}
                    href={generatePath(PATHS.Collections, { collectionType: collectionTypeKey })}
                  >
                    {collectionTypeName}
                  </Link>
                ))}
              </div>
            </div>
            <div className="-ml-1 mr-4">
              <Input placeholder="Название подборки..." value={query} onChange={handleQueryChange} />
            </div>
          </div>
        }
        queryResult={queryResult}
      />
    </>
  );
};

export default CollectionsView;
