import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import ItemsList from 'components/itemsList';
import Seo from 'components/seo';
import useApi from 'hooks/useApi';
import { RouteParams } from 'routes';

const CollectionView: React.FC = () => {
  const { collectionId } = useParams<RouteParams>();
  const location = useLocation<{ title?: string }>();
  const { data, isLoading } = useApi('collectionItems', [collectionId!]);
  const { title = data?.collection.title } = location.state || {};

  return (
    <>
      <Seo title={`Подборка: ${title}`} />
      <ItemsList title={title} items={data?.items} loading={isLoading} />
    </>
  );
};

export default CollectionView;
