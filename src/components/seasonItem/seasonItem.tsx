import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import map from 'lodash/map';

import { Item, Season, Video, WatchingStatus } from 'api';
import Accordion from 'components/accordion';
import ImageItem from 'components/imageItem';
import { PATHS, generatePath } from 'routes';

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
    <div className="flex flex-col">
      <Accordion title={`Сезон ${season.number}`}>
        <div className="flex flex-wrap">
          {map(season.episodes, (episode) => (
            <ImageItem
              key={episode.id}
              source={episode.thumbnail}
              caption={`Эпизод ${episode.number}`}
              onClick={handleEpisodeClick(episode)}
            >
              {episode.watched === WatchingStatus.Watched && (
                <div className="absolute flex justify-center items-center rounded-xl bg-black bg-opacity-60 top-0 bottom-0 left-0 right-0">
                  Просмотрено
                </div>
              )}
            </ImageItem>
          ))}
        </div>
      </Accordion>
    </div>
  );
};

export default SeasonItem;
