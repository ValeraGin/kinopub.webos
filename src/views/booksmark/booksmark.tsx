import React from 'react';
import { useParams } from 'react-router-dom';

import ItemsList from '../../components/itemsList';
import Text from '../../components/text';
import useApi from '../../hooks/useApi';
import MainLayout from '../../layouts/main';
import { RouteParams } from '../../routes';

type Props = {};

const BookmarkView: React.FC<Props> = () => {
  const { bookmarkId } = useParams<RouteParams>();
  const { data, isLoading } = useApi('bookmarkItems', bookmarkId);

  return (
    <MainLayout>
      <Text>{data?.folder.title}</Text>
      <ItemsList items={data?.items} loading={isLoading} />
    </MainLayout>
  );
};

export default BookmarkView;
