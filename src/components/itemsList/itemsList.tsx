import React from 'react';
import map from 'lodash/map';

import { Item } from 'api';
import Scrollable from 'components/scrollable';
import VideoItem from 'components/videoItem';

type Props = {
  items?: Item[];
  loading?: boolean;
  onLoadMore?: () => void;
  scrollable?: boolean;
};

const ItemsList: React.FC<Props> = ({ items, loading, onLoadMore, scrollable = true }) => {
  const content = (
    <>
      {map(items, (item) => (
        <VideoItem key={item.id} item={item} />
      ))}
      {loading && map([...new Array(15)], (_, idx) => <VideoItem key={idx} />)}
    </>
  );

  return scrollable ? <Scrollable onScrollToFooter={onLoadMore}>{content}</Scrollable> : content;
};

export default ItemsList;
