import React from 'react';
import cx from 'classnames';
import map from 'lodash/map';

import { Item } from 'api';
import Scrollable from 'components/scrollable';
import Text from 'components/text';
import VideoItem from 'components/videoItem';

type Props = {
  title?: string;
  items?: Item[];
  loading?: boolean;
  onScrollToEnd?: () => void;
  scrollable?: boolean;
  className?: string;
};

const ItemsList: React.FC<Props> = ({ title, items, loading, onScrollToEnd, scrollable = true, className }) => {
  const content = (
    <div>
      {title && <Text className="m-1 mb-3">{title}</Text>}
      <div className={cx('flex flex-wrap', className)}>
        {map(items, (item) => (
          <VideoItem key={item.id} item={item} />
        ))}
        {loading && map([...new Array(15)], (_, idx) => <VideoItem key={idx} />)}
      </div>
    </div>
  );

  return scrollable ? <Scrollable onScrollToEnd={onScrollToEnd}>{content}</Scrollable> : content;
};

export default ItemsList;
