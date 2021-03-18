import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import GridListImageItem from '@enact/moonstone/GridListImageItem';
import styled from 'styled-components';

import { Bookmark } from '../../api';
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
  bookmark?: Bookmark;
};

const BookmarkItem: React.FC<Props> = ({ bookmark }) => {
  const history = useHistory();
  const source = useMemo(() => (bookmark ? `https://dummyimage.com/250x200/222/fff.png&text=${`Фильмов ${bookmark.count}`}` : ''), [
    bookmark,
  ]);
  const handleOnClick = useCallback(() => {
    if (bookmark?.id) {
      history.push(
        generatePath(PATHS.Bookmark, {
          bookmarkId: bookmark.id,
        }),
        {
          bookmark,
        },
      );
    }
  }, [bookmark, history]);

  return (
    <Wrapper>
      <GridItem source={source} caption={bookmark?.title} onClick={handleOnClick} />
    </Wrapper>
  );
};

export default BookmarkItem;
