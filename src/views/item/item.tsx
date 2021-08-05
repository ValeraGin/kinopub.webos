import React, { useCallback, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import map from 'lodash/map';

import { WatchingStatus } from 'api';
import Button from 'components/button';
import ItemsList from 'components/itemsList';
import Popup from 'components/popup';
import Scrollable from 'components/scrollable';
import SeasonsList from 'components/seasonsList';
import Text from 'components/text';
import Bookmarks from 'containers/bookmarks';
import useApi from 'hooks/useApi';
import useApiMutation from 'hooks/useApiMutation';
import useButtonEffect from 'hooks/useButtonEffect';
import useStreamingTypeEffect from 'hooks/useStreamingTypeEffect';
import { PATHS, RouteParams, generatePath } from 'routes';

import { getItemTitle } from 'utils/item';

const SimilarItems: React.FC<{ itemId: string }> = ({ itemId }) => {
  const { data } = useApi('itemSmiliar', [itemId]);

  if (data && data.items.length > 0) {
    return (
      <div className="p-8">
        <ItemsList title="Похожие" items={data.items} scrollable={false} />
      </div>
    );
  }

  return null;
};

const ItemView: React.FC = () => {
  const history = useHistory();
  const { itemId } = useParams<RouteParams>();
  const [bookmarksPopupVisible, setBookmarksPopupVisible] = useState(false);
  const { data, refetch } = useApi('itemMedia', [itemId!], { staleTime: 0 });

  const { watchingToggleWatchlistAsync } = useApiMutation('watchingToggleWatchlist');

  const video = useMemo(
    () => data?.item.videos?.find(({ watching }) => watching.status !== WatchingStatus.Watched) || data?.item.videos?.[0],
    [data?.item],
  );
  const season = useMemo(
    () => data?.item.seasons?.find(({ watching }) => watching.status !== WatchingStatus.Watched) || data?.item.seasons?.[0],
    [data?.item],
  );
  const episode = useMemo(
    () => season?.episodes.find(({ watching }) => watching.status !== WatchingStatus.Watched) || season?.episodes[0],
    [season],
  );
  const trailer = useMemo(() => data?.item.trailer, [data?.item]);
  const videoToPlay = video || episode;
  const title = useMemo(() => getItemTitle(data?.item, videoToPlay, season), [data?.item, season, videoToPlay]);

  const handleOnPlayClick = useCallback(() => {
    if (videoToPlay?.id) {
      history.push(
        generatePath(PATHS.Video, {
          videoId: videoToPlay.id,
        }),
        {
          item: data?.item,
          video: videoToPlay,
          season,
        },
      );
    }
  }, [history, data?.item, season, videoToPlay]);

  const handleOnTrailerClick = useCallback(() => {
    if (trailer?.id) {
      history.push(
        generatePath(PATHS.Trailer, {
          trailerId: trailer.id,
        }),
        {
          item: data?.item,
          trailer,
        },
      );
    }
  }, [history, data?.item, trailer]);

  const handleOnBookmarksClick = useCallback(() => {
    setBookmarksPopupVisible(true);
  }, []);
  const handleBookmarksPopupClose = useCallback(() => {
    setBookmarksPopupVisible(false);
  }, []);

  const handleOnVisibilityClick = useCallback(async () => {
    await watchingToggleWatchlistAsync([itemId!]);
    refetch();
  }, [itemId, watchingToggleWatchlistAsync, refetch]);

  useStreamingTypeEffect();
  useButtonEffect('Play', handleOnPlayClick);

  return (
    <Scrollable>
      <div className="relative w-screen h-screen">
        <img
          className="absolute w-screen h-screen object-cover -z-1"
          src={(data?.item?.posters.wide || data?.item?.posters.big)!}
          alt={title}
        />

        <Text className="p-4 absolute top-0">{title}</Text>

        <div className="absolute flex bottom-8 left-4 right-4">
          <div>
            <Button icon="play_circle_outline" onClick={handleOnPlayClick} className="mr-2">
              Смотреть
            </Button>

            <Button icon="bookmark" onClick={handleOnBookmarksClick} className="mr-2">
              В закладки
            </Button>

            <Popup visible={bookmarksPopupVisible} onClose={handleBookmarksPopupClose}>
              <Bookmarks key={`${itemId}-${bookmarksPopupVisible}`} itemId={itemId!} />
            </Popup>
          </div>

          <div>
            {trailer && (
              <Button icon="videocam" onClick={handleOnTrailerClick}>
                Трейлер
              </Button>
            )}

            {typeof data?.item?.subscribed === 'boolean' && (
              <Button icon={data?.item?.subscribed ? 'visibility_off' : 'visibility'} onClick={handleOnVisibilityClick}>
                {data?.item.subscribed ? 'Не буду смотреть' : 'Буду смотреть'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <SeasonsList item={data?.item!} seasons={data?.item?.seasons} />

      <div className="flex flex-col p-8 whitespace-pre-wrap">
        <Text>{data?.item.plot}</Text>

        {!!data?.item.tracklist?.length && (
          <>
            <Text className="my-4">Треклист</Text>
            <div className="flex flex-wrap flex-col h-96">
              {map(data?.item.tracklist, (track, idx) => (
                <Text key={idx}>
                  {idx + 1}. {track.title}
                </Text>
              ))}
            </div>
          </>
        )}
      </div>

      <SimilarItems itemId={itemId!} />
    </Scrollable>
  );
};

export default ItemView;
