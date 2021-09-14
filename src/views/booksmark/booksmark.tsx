import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import Seo from 'components/seo';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import { RouteParams } from 'routes';

const BookmarkView: React.FC = () => {
  const { bookmarkId } = useParams<RouteParams>();
  const location = useLocation<{ title?: string }>();
  const queryResult = useApiInfinite('bookmarkItems', [bookmarkId!]);
  const { title = queryResult?.data?.pages?.[0]?.folder?.title } = location.state || {};

  return (
    <>
      <Seo title={`Закладка: ${title}`} />
      <ItemsListInfinite title={title} queryResult={queryResult} />
    </>
  );
};

export default BookmarkView;
