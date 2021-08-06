import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Channel } from 'api';
import Player, { PlayerProps } from 'components/player';
import Seo from 'components/seo';

import { mapSources } from 'utils/video';

const ChannelView: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{ channel: Channel }>();
  const { channel } = location.state;

  const playerProps = useMemo<PlayerProps>(() => {
    return {
      title: channel.title,
      poster: channel.logos.m,
      sources: mapSources([
        {
          url: {
            http: channel.stream,
            hls4: channel.stream,
          },
        },
      ]),
    };
  }, [channel]);

  const handleOnEnded = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <>
      <Seo title={`Канал: ${channel.title}`} />
      <Player {...playerProps} onEnded={handleOnEnded} />
    </>
  );
};

export default ChannelView;
