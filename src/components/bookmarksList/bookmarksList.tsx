import React from 'react';
import map from 'lodash/map';

import { Bookmark } from 'api';
import BookmarkItem from 'components/bookmarkItem';
import Scrollable from 'components/scrollable';

type Props = {
  bookmarks?: Bookmark[];
  loading?: boolean;
  onScrollToEnd?: () => void;
  scrollable?: boolean;
};

const BookmarksList: React.FC<Props> = ({ bookmarks, loading, onScrollToEnd, scrollable = true }) => {
  const content = (
    <div className="flex flex-wrap pr-2">
      {map(bookmarks, (bookmark) => (
        <BookmarkItem key={bookmark.id} bookmark={bookmark} />
      ))}
      {loading && map([...new Array(20)], (_, idx) => <BookmarkItem key={idx} />)}
    </div>
  );

  return scrollable ? <Scrollable onScrollToEnd={onScrollToEnd}>{content}</Scrollable> : content;
};

export default BookmarksList;
