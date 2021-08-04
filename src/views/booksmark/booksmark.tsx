import React from 'react';
import { useParams } from 'react-router-dom';

import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import { RouteParams } from 'routes';

const BookmarkView: React.FC = () => {
  const { bookmarkId } = useParams<RouteParams>();
  const queryResult = useApiInfinite('bookmarkItems', [bookmarkId!]);

  return <ItemsListInfinite title={queryResult?.data?.pages?.[0]?.folder?.title} queryResult={queryResult} />;
};

export default BookmarkView;
