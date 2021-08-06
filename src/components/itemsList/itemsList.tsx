import React from 'react';
import cx from 'classnames';
import map from 'lodash/map';

import { Item } from 'api';
import Scrollable from 'components/scrollable';
import Title from 'components/title';
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
      <Title title={title} />
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
