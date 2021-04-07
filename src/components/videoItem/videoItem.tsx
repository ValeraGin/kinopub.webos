import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import GridListImageItem from '@enact/moonstone/GridListImageItem';
import styled from 'styled-components';

import { Item } from 'api';
import Lazy from 'components/lazy';
import { PATHS, generatePath } from 'routes';

const Wrapper = styled(Lazy)`
  display: inline-flex;
  position: relative;
  height: 20rem !important;
  width: 20%;
`;

const GridItem = styled(GridListImageItem)`
  width: 100%;
`;

const New = styled.div`
  position: absolute;
  background: var(--main-color);
  right: 0;
  z-index: 1;
  padding: 0 0.5em;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  margin-right: 0.25rem;
`;

type Props = {
  item?: Item;
};

const VideoItem: React.FC<Props> = ({ item }) => {
  const history = useHistory();

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
    <Wrapper height="20rem">
      <New>{item?.new}</New>
      <GridItem source={item?.posters.medium} caption={item?.title} onClick={handleOnClick} />
    </Wrapper>
  );
};

export default VideoItem;
