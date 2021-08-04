import React from 'react';
import map from 'lodash/map';

import { Channel } from 'api';
import ChannelItem from 'components/channelItem';
import Scrollable from 'components/scrollable';

type Props = {
  channels?: Channel[];
  loading?: boolean;
  onScrollToEnd?: () => void;
  scrollable?: boolean;
};

const ChannelsList: React.FC<Props> = ({ channels, loading, onScrollToEnd, scrollable = true }) => {
  const content = (
    <div className="flex flex-wrap pr-2">
      {map(channels, (channel) => (
        <ChannelItem key={channel.id} channel={channel} />
      ))}
      {loading && map([...new Array(20)], (_, idx) => <ChannelItem key={idx} />)}
    </div>
  );

  return scrollable ? <Scrollable onScrollToEnd={onScrollToEnd}>{content}</Scrollable> : content;
};

export default ChannelsList;
