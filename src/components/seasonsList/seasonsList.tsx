import { useCallback, useState } from 'react';
import map from 'lodash/map';

import { Item, Season, Video } from 'api';
import SeasonItem from 'components/seasonItem';
import Text from 'components/text';
import useButtonEffect from 'hooks/useButtonEffect';

type Props = {
  item: Item;
  seasons?: Season[];
  className?: string;
  onSeasonToggle?: (season: Season) => void;
  onEpisodeToggle?: (episode: Video, season?: Season | null) => void;
};

const SeasonsList: React.FC<Props> = ({ item, seasons, className, onSeasonToggle, onEpisodeToggle }) => {
  const [focusedSeason, setFocusedSeason] = useState<Season | null>(null);
  const [focusedEpisode, setFocusedEpisode] = useState<Video | null>(null);
  const handleEpisodeFocus = useCallback(
    (season: Season) => (episode: Video) => {
      setFocusedSeason(season);
      setFocusedEpisode(episode);
    },
    [],
  );
  const handleEpisodeBlur = useCallback(() => {
    setFocusedSeason(null);
    setFocusedEpisode(null);
  }, []);

  const handleYellowButton = useCallback(() => {
    if (focusedSeason && onSeasonToggle) {
      onSeasonToggle(focusedSeason);

      return false;
    }
  }, [focusedSeason, onSeasonToggle]);
  const handleBlueButton = useCallback(() => {
    if (focusedEpisode && onEpisodeToggle) {
      onEpisodeToggle(focusedEpisode, focusedSeason);

      return false;
    }
  }, [focusedEpisode, focusedSeason, onEpisodeToggle]);

  useButtonEffect('Yellow', handleYellowButton);
  useButtonEffect('Blue', handleBlueButton);

  if (!seasons?.length) {
    return null;
  }

  return (
    <div className={className}>
      <Text>Список сезонов</Text>

      {map(seasons, (season) => (
        <SeasonItem
          key={season.id}
          item={item}
          season={season}
          onEpisodeFocus={handleEpisodeFocus(season)}
          onEpisodeBlur={handleEpisodeBlur}
        />
      ))}
    </div>
  );
};

export default SeasonsList;
