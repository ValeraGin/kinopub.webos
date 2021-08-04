import React, { useCallback, useMemo } from 'react';
import map from 'lodash/map';

import { Bookmark } from 'api';
import Checkbox from 'components/checkbox';
import useApi from 'hooks/useApi';
import useApiMutation from 'hooks/useApiMutation';

type Props = {
  itemId: string;
};

const Bookmarks: React.FC<Props> = ({ itemId }) => {
  const { data } = useApi('bookmarks');
  const { data: itemBookmarks, dataUpdatedAt, refetch } = useApi('itemBookmarks', [itemId]);
  const { bookmarkToggleItemAsync } = useApiMutation('bookmarkToggleItem');
  const bookmarksIds = useMemo(() => itemBookmarks?.folders.map((bookmark) => bookmark.id) || [], [itemBookmarks?.folders]);

  const handleCheckboxToggle = useCallback(
    (bookmark: Bookmark) => async () => {
      await bookmarkToggleItemAsync([itemId, bookmark.id]);
      refetch();
    },
    [itemId, bookmarkToggleItemAsync, refetch],
  );

  return (
    <div className="flex flex-wrap" key={dataUpdatedAt}>
      {map(data?.items, (bookmark) => (
        <div className="w-1/5 p-1" key={bookmark.updated}>
          <Checkbox defaultChecked={bookmarksIds.includes(bookmark.id)} onChange={handleCheckboxToggle(bookmark)}>
            {bookmark.title}
          </Checkbox>
        </div>
      ))}
    </div>
  );
};

export default Bookmarks;
