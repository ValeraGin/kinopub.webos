import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { Bookmark } from 'api';
import ImageItem from 'components/imageItem';
import { PATHS, generatePath } from 'routes';

type Props = {
  bookmark?: Bookmark;
  className?: string;
};

const BookmarkItem: React.FC<Props> = ({ bookmark, className }) => {
  const history = useHistory();
  const source = useMemo(
    () => (bookmark ? `https://dummyimage.com/250x200/222/fff.png&text=${`Фильмов ${bookmark.count}`}` : ''),
    [bookmark],
  );
  const handleOnClick = useCallback(() => {
    if (bookmark?.id) {
      history.push(
        generatePath(PATHS.Bookmark, {
          bookmarkId: bookmark.id,
        }),
        {
          bookmark,
        },
      );
    }
  }, [bookmark, history]);

  return <ImageItem onClick={handleOnClick} source={source} caption={bookmark?.title} />;
};

export default BookmarkItem;
