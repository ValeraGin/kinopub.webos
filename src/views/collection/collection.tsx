import React from 'react';
import { useParams } from 'react-router-dom';

import ItemsList from '../../components/itemsList';
import Text from '../../components/text';
import useApi from '../../hooks/useApi';
import MainLayout from '../../layouts/main';
import { RouteParams } from '../../routes';

type Props = {};

const CollectionView: React.FC<Props> = () => {
  const { collectionId } = useParams<RouteParams>();
  const { data, isLoading } = useApi('collectionItems', collectionId);

  return (
    <MainLayout>
      <Text>{data?.collection.title}</Text>
      <ItemsList items={data?.items} loading={isLoading} />
    </MainLayout>
  );
};

export default CollectionView;
