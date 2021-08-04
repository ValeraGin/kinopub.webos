import React from 'react';
import { useParams } from 'react-router-dom';

import ItemsList from 'components/itemsList';
import useApi from 'hooks/useApi';
import { RouteParams } from 'routes';

const CollectionView: React.FC = () => {
  const { collectionId } = useParams<RouteParams>();
  const { data, isLoading } = useApi('collectionItems', [collectionId!]);

  return <ItemsList title={data?.collection.title} items={data?.items} loading={isLoading} />;
};

export default CollectionView;
