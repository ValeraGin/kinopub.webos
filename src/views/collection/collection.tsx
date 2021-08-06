import React from 'react';
import { useParams } from 'react-router-dom';

import ItemsList from 'components/itemsList';
import Seo from 'components/seo';
import useApi from 'hooks/useApi';
import { RouteParams } from 'routes';

const CollectionView: React.FC = () => {
  const { collectionId } = useParams<RouteParams>();
  const { data, isLoading } = useApi('collectionItems', [collectionId!]);
  const title = data?.collection.title;

  return (
    <>
      <Seo title={`Коллекция ${title}`} />
      <ItemsList title={title} items={data?.items} loading={isLoading} />
    </>
  );
};

export default CollectionView;
