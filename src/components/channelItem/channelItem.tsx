import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Channel } from 'api';
import ImageItem from 'components/imageItem';
import { PATHS, generatePath } from 'routes';

type Props = {
  channel?: Channel;
  className?: string;
};

const ChannelItem: React.FC<Props> = ({ channel, className }) => {
  const history = useHistory();
  const handleOnClick = useCallback(() => {
    if (channel?.id) {
      history.push(
        generatePath(PATHS.Channel, {
          channelId: channel.id,
        }),
        {
          channel,
          title: channel.name,
        },
      );
    }
  }, [channel, history]);

  return <ImageItem onClick={handleOnClick} source={channel?.logos.s} caption={channel?.title} className={className} />;
};

export default ChannelItem;
