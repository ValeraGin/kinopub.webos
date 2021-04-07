import React from 'react';
import { useParams } from 'react-router-dom';

import ItemsList from 'components/itemsList';
import Text from 'components/text';
import useApi from 'hooks/useApi';
import { RouteParams } from 'routes';

const CollectionView: React.FC = () => {
  const { collectionId } = useParams<RouteParams>();
  const { data, isLoading } = useApi('collectionItems', collectionId!);

  return (
    <>
      <Text>{data?.collection.title}</Text>
      <ItemsList items={data?.items} loading={isLoading} />
    </>
  );
};

export default CollectionView;
