import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Channel } from 'api';

import Player, { PlayerProps } from '../../components/player';
import FillLayout from '../../layouts/fill';

import { mapSources } from '../../utils/video';

type Props = {};

const ChannelView: React.FC<Props> = () => {
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
    <FillLayout>
      <Player {...playerProps} onEnded={handleOnEnded} />
    </FillLayout>
  );
};

export default ChannelView;
