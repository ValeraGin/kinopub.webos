import React from 'react';
import map from 'lodash/map';

import { Bookmark } from 'api';
import BookmarkItem from 'components/bookmarkItem';
import Scrollable from 'components/scrollable';

type Props = {
  bookmarks?: Bookmark[];
  loading?: boolean;
};

const BookmarksList: React.FC<Props> = ({ bookmarks, loading }) => {
  return (
    <Scrollable>
      {map(bookmarks, (bookmark) => (
        <BookmarkItem key={bookmark.id} bookmark={bookmark} />
      ))}
      {loading && map([...new Array(20)], (_, idx) => <BookmarkItem key={idx} />)}
    </Scrollable>
  );
};

export default BookmarksList;
