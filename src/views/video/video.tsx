import { useCallback, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { ItemDetails, Season, Streaming, Video, WatchingStatus } from 'api';
import Player, { PlayerProps } from 'components/player';
import Seo from 'components/seo';
import useApi from 'hooks/useApi';
import useApiMutation from 'hooks/useApiMutation';
import useStorageState from 'hooks/useStorageState';

import { getItemDescription, getItemTitle } from 'utils/item';
import { mapAudios, mapSources, mapSubtitles } from 'utils/video';

const useNextVideo = (item: ItemDetails, season: Season, video: Video) =>
  useMemo(() => {
    const nextVideo = (item.videos || season?.episodes)?.find(({ number }) => number === video.number + 1);

    if (nextVideo) {
      return nextVideo;
    }

    const nextSeason = item.seasons?.find(({ number }) => number === season.number + 1);
    if (nextSeason) {
      return nextSeason.episodes[0];
    }
  }, [item, season, video]);

const usePreviousVideo = (item: ItemDetails, season: Season, video: Video) =>
  useMemo(() => {
    const previousVideo = (item.videos || season?.episodes)?.find(({ number }) => number === video.number - 1);

    if (previousVideo) {
      return previousVideo;
    }

    const previousSeason = item.seasons?.find(({ number }) => number === season.number - 1);
    if (previousSeason) {
      return previousSeason.episodes[previousSeason.episodes.length - 1];
    }
  }, [item, season, video]);

const usePrevNextVideos = (item: ItemDetails, season: Season, video: Video) => {
  const nextVideo = useNextVideo(item, season, video);
  const previousVideo = usePreviousVideo(item, season, video);

  return [previousVideo, nextVideo] as const;
};

const VideoView: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{ title: string; item: ItemDetails; video: Video; season: Season }>();
  const { watchingMarkTimeAsync } = useApiMutation('watchingMarkTime');
  const [streamingType] = useStorageState<Streaming>('streaming_type');
  const { item, video, season } = location.state || {};

  const [currentVideo, setCurrentVideo] = useState(video);
  const [previousVideo, nextVideo] = usePrevNextVideos(item, season, currentVideo);

  const currentVideoLinks = useApi('itemMediaLinks', [currentVideo.id]);

  const saveCurrentTime = useCallback(
    async ({ number }: Video, currentTime: number) => {
      await watchingMarkTimeAsync([item.id, currentTime, number, season?.number]);
    },
    [watchingMarkTimeAsync, item, season],
  );

  const playerProps = useMemo<PlayerProps | null>(
    () =>
      currentVideoLinks?.data
        ? {
            title: getItemTitle(item, currentVideo, season),
            description: getItemDescription(item, currentVideo, season),
            poster: item.posters.wide || item.posters.big,
            audios: mapAudios(currentVideo.audios),
            sources: mapSources(currentVideoLinks.data.files, streamingType),
            subtitles: mapSubtitles(currentVideoLinks.data.subtitles),
            startTime: currentVideo.watching.status === WatchingStatus.Watching ? currentVideo.watching.time : 0,
          }
        : null,
    [item, season, currentVideo, currentVideoLinks?.data, streamingType],
  );

  const handlePause = useCallback(
    (currentTime: number) => {
      saveCurrentTime(currentVideo, currentTime);
    },
    [saveCurrentTime, currentVideo],
  );

  const handleOnEnded = useCallback(
    (currentTime: number) => {
      saveCurrentTime(currentVideo, currentTime);

      if (nextVideo) {
        setCurrentVideo(nextVideo);
        return;
      }

      history.goBack();
    },
    [saveCurrentTime, history, currentVideo, nextVideo],
  );

  const handleJumpBackward = useCallback(
    ({ currentTime }: { currentTime: number }) => {
      saveCurrentTime(currentVideo, currentTime);

      if (previousVideo) {
        setCurrentVideo(previousVideo);
      }
    },
    [saveCurrentTime, currentVideo, previousVideo],
  );

  const handleJumpForward = useCallback(
    ({ currentTime }: { currentTime: number }) => {
      saveCurrentTime(currentVideo, currentTime);

      if (nextVideo) {
        setCurrentVideo(nextVideo);
      }
    },
    [saveCurrentTime, currentVideo, nextVideo],
  );

  const handleTimeSync = useCallback(
    async (currentTime: number) => {
      await saveCurrentTime(currentVideo, currentTime);
    },
    [saveCurrentTime, currentVideo],
  );

  return (
    <>
      <Seo title={`Просмотр: ${item.title} - Видео`} />
      {playerProps && (
        <Player
          key={currentVideo.id}
          {...playerProps}
          streamingType={streamingType}
          onPause={handlePause}
          onEnded={handleOnEnded}
          onJumpBackward={handleJumpBackward}
          onJumpForward={handleJumpForward}
          onTimeSync={handleTimeSync}
        />
      )}
    </>
  );
};

export default VideoView;
