import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';

import { Item } from 'api';
import ImageItem from 'components/imageItem';
import { PATHS, generatePath } from 'routes';

type Props = {
  item?: Item;
  className?: string;
};

const VideoItem: React.FC<Props> = ({ item, className }) => {
  const history = useHistory();
  const title = useMemo(() => item?.title?.split('/')[0], [item?.title]);

  const handleOnClick = useCallback(() => {
    if (item?.id) {
      history.push(
        generatePath(PATHS.Item, {
          itemId: item.id,
        }),
      );
    }
  }, [item?.id, history]);

  return (
    <ImageItem onClick={handleOnClick} source={item?.posters.medium} caption={title} className={cx('h-72', className)}>
      {item?.new && (
        <div className="absolute bg-red-600 border-gray-300 border-t-2 border-r-2 text-gray-200 px-2 py-1 rounded-bl rounded-tr-xl top-0 right-0">
          {item?.new}
        </div>
      )}
    </ImageItem>
  );
};

export default VideoItem;
