import React, { useCallback, useMemo, useState } from 'react';
import map from 'lodash/map';

import { Bookmark } from 'api';
import Button from 'components/button';
import Checkbox from 'components/checkbox';
import Input from 'components/input';
import useApi from 'hooks/useApi';
import useApiMutation from 'hooks/useApiMutation';
import useButtonEffect from 'hooks/useButtonEffect';

import { isKey } from 'utils/keyboard';

type Props = {
  itemId: string;
};

const Bookmarks: React.FC<Props> = ({ itemId }) => {
  const [createNew, setCreateNew] = useState(false);
  const [newBookmark, setNewBookmark] = useState('');
  const { data, refetch: refetchBookmarks } = useApi('bookmarks');
  const { data: itemBookmarks, dataUpdatedAt, refetch } = useApi('itemBookmarks', [itemId]);
  const { bookmarkToggleItemAsync } = useApiMutation('bookmarkToggleItem');
  const { bookmarkCreateAsync } = useApiMutation('bookmarkCreate');
  const bookmarksIds = useMemo(() => itemBookmarks?.folders.map((bookmark) => bookmark.id) || [], [itemBookmarks?.folders]);

  const handleCheckboxToggle = useCallback(
    (bookmark: Bookmark) => async () => {
      await bookmarkToggleItemAsync([itemId, bookmark.id]);
      refetch();
    },
    [itemId, bookmarkToggleItemAsync, refetch],
  );
  const handleCreateNewBookmark = useCallback(async () => {
    if (newBookmark) {
      const data = (await bookmarkCreateAsync([newBookmark])) as unknown as { folder: Bookmark };

      await bookmarkToggleItemAsync([itemId, data.folder.id]);
      await refetchBookmarks();
      await refetch();
    }
    setCreateNew(false);
    setNewBookmark('');
    return false;
  }, [itemId, newBookmark, bookmarkCreateAsync, refetch, refetchBookmarks, bookmarkToggleItemAsync]);

  const handleKeyDown = useCallback<React.KeyboardEventHandler>(
    (e) => {
      if (isKey(e, 'Enter')) {
        handleCreateNewBookmark();
      }
    },
    [handleCreateNewBookmark],
  );

  useButtonEffect('Green', handleCreateNewBookmark);

  return (
    <>
      <div className="flex flex-wrap" key={dataUpdatedAt}>
        {map(data?.items, (bookmark) => (
          <div className="w-1/5 p-1" key={bookmark.updated}>
            <Checkbox defaultChecked={bookmarksIds.includes(bookmark.id)} onChange={handleCheckboxToggle(bookmark)}>
              {bookmark.title}
            </Checkbox>
          </div>
        ))}
      </div>

      <div className="flex h-10">
        {createNew ? (
          <div className="flex">
            <Input autoFocus placeholder="Новая закладка" value={newBookmark} onChange={setNewBookmark} onKeyDown={handleKeyDown} />
            <Button icon="done" className="ml-1 text-green-600" onClick={handleCreateNewBookmark} />
          </div>
        ) : (
          <Button icon="bookmark" onClick={() => setCreateNew(true)}>
            Новая закладка
          </Button>
        )}
      </div>
    </>
  );
};

export default Bookmarks;
