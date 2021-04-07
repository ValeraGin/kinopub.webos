import React from 'react';
import { useParams } from 'react-router-dom';

import ItemsList from 'components/itemsList';
import Text from 'components/text';
import useApi from 'hooks/useApi';
import { RouteParams } from 'routes';

const BookmarkView: React.FC = () => {
  const { bookmarkId } = useParams<RouteParams>();
  const { data, isLoading } = useApi('bookmarkItems', bookmarkId!);

  return (
    <>
      <Text>{data?.folder.title}</Text>
      <ItemsList items={data?.items} loading={isLoading} />
    </>
  );
};

export default BookmarkView;
