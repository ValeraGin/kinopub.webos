import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import GridListImageItem from '@enact/moonstone/GridListImageItem';
import styled from 'styled-components';

import { Channel } from '../../api';
import { PATHS, generatePath } from '../../routes';

const Wrapper = styled.div`
  display: inline-flex;
  position: relative;
  height: 10rem !important;
  width: 20%;
`;

const GridItem = styled(GridListImageItem)`
  width: 100%;
`;

type Props = {
  channel?: Channel;
};

const ChannelItem: React.FC<Props> = ({ channel }) => {
  const history = useHistory();
  const handleOnClick = useCallback(() => {
    if (channel?.id) {
      history.push(
        generatePath(PATHS.Channel, {
          channelId: channel.id,
        }),
        {
          channel,
        },
      );
    }
  }, [channel, history]);

  return (
    <Wrapper>
      <GridItem source={channel?.logos.s} caption={channel?.title} onClick={handleOnClick} />
    </Wrapper>
  );
};

export default ChannelItem;
