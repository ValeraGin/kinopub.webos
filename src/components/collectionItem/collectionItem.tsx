import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import GridListImageItem from '@enact/moonstone/GridListImageItem';
import styled from 'styled-components';

import { Collection } from '../../api';
import { PATHS, generatePath } from '../../routes';

const Wrapper = styled.div`
  display: inline-flex;
  position: relative;
  height: 20rem !important;
  width: 20%;
`;

const GridItem = styled(GridListImageItem)`
  width: 100%;
`;

type Props = {
  collection?: Collection;
};

const CollectionItem: React.FC<Props> = ({ collection }) => {
  const history = useHistory();
  const handleOnClick = useCallback(() => {
    if (collection?.id) {
      history.push(
        generatePath(PATHS.Collection, {
          collectionId: collection.id,
        }),
      );
    }
  }, [collection?.id, history]);

  return (
    <Wrapper>
      <GridItem source={collection?.posters.medium} caption={collection?.title} onClick={handleOnClick} />
    </Wrapper>
  );
};

export default CollectionItem;
