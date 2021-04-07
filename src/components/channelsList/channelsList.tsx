import React from 'react';
import map from 'lodash/map';

import { Channel } from 'api';
import ChannelItem from 'components/channelItem';
import Scrollable from 'components/scrollable';

type Props = {
  channels?: Channel[];
  loading?: boolean;
};

const ChannelsList: React.FC<Props> = ({ channels, loading }) => {
  return (
    <Scrollable>
      {map(channels, (channel) => (
        <ChannelItem key={channel.id} channel={channel} />
      ))}
      {loading && map([...new Array(20)], (_, idx) => <ChannelItem key={idx} />)}
    </Scrollable>
  );
};

export default ChannelsList;
