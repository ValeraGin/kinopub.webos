import React from 'react';
import { useParams } from 'react-router-dom';

import Text from 'components/text';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import { RouteParams } from 'routes';

const BookmarkView: React.FC = () => {
  const { bookmarkId } = useParams<RouteParams>();
  const queryResult = useApiInfinite('bookmarkItems', bookmarkId!);

  return (
    <>
      <Text>{queryResult?.data?.pages?.[0]?.folder?.title}</Text>
      <ItemsListInfinite queryResult={queryResult} />
    </>
  );
};

export default BookmarkView;
