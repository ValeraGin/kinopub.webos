import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import ExpandableItem from '@enact/moonstone/ExpandableItem';
import GridListImageItem from '@enact/moonstone/GridListImageItem';
import map from 'lodash/map';
import styled, { css } from 'styled-components';

import { Item, Season, Video, WatchingStatus } from '../../api';
import { PATHS, generatePath } from '../../routes';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const EpisodeItem = styled(GridListImageItem)<{ watched?: boolean }>`
  width: 9rem;
  height: 15rem !important;

  [role='img'] {
    position: relative;
    ${(props) =>
      props.watched &&
      css`
        :before {
          content: 'Просмотрено';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          padding-left: 1rem;
          padding-top: 5rem;
          background: rgba(0, 0, 0, 0.5);
        }
      `}
  }
`;

type Props = {
  item: Item;
  season: Season;
};

const SeasonItem: React.FC<Props> = ({ item, season }) => {
  const history = useHistory();
  const handleEpisodeClick = useCallback(
    (episode: Video) => () => {
      if (episode?.id) {
        history.push(
          generatePath(PATHS.Video, {
            videoId: episode.id,
          }),
          {
            item,
            video: episode,
            season,
          },
        );
      }
    },
    [item, season, history],
  );

  return (
    <Wrapper>
      <ExpandableItem title={`Сезон ${season.number}`}>
        {map(season.episodes, (episode) => (
          <EpisodeItem
            key={episode.id}
            source={episode.thumbnail}
            caption={`Эпизод ${episode.number}`}
            onClick={handleEpisodeClick(episode)}
            watched={episode.watched === WatchingStatus.Watched}
          />
        ))}
      </ExpandableItem>
    </Wrapper>
  );
};

export default SeasonItem;
