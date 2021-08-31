import { useCallback, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { ItemDetails, Season, Streaming, Video, WatchingStatus } from 'api';
import { AudioTrack, SubtitleTrack } from 'components/media';
import { SourceTrack } from 'components/media/media';
import Player, { PlayerProps } from 'components/player';
import Seo from 'components/seo';
import useApi from 'hooks/useApi';
import useApiMutation from 'hooks/useApiMutation';
import useDeepMemo from 'hooks/useDeepMemo';
import useSearchParam from 'hooks/useSearchParam';
import useStorageState from 'hooks/useStorageState';

import { getItemDescription, getItemTitle, getItemVideoToPlay } from 'utils/item';
import { mapAudios, mapSources, mapSubtitles } from 'utils/video';

const useNextVideo = (item: ItemDetails, video: Video, season?: Season) =>
  useMemo(() => {
    const nextVideo = (item.videos || season?.episodes)?.find(({ number }) => number === video.number + 1);

    if (nextVideo) {
      return nextVideo;
    }

    const nextSeason = item.seasons?.find(({ number }) => number === (season?.number || 0) + 1);
    if (nextSeason) {
      return nextSeason.episodes[0];
    }
  }, [item, season, video]);

const usePreviousVideo = (item: ItemDetails, video: Video, season?: Season) =>
  useMemo(() => {
    const previousVideo = (item.videos || season?.episodes)?.find(({ number }) => number === video.number - 1);

    if (previousVideo) {
      return previousVideo;
    }

    const previousSeason = item.seasons?.find(({ number }) => number === (season?.number || 0) - 1);
    if (previousSeason) {
      return previousSeason.episodes[previousSeason.episodes.length - 1];
    }
  }, [item, season, video]);

const usePrevNextVideos = (item: ItemDetails, video: Video, season?: Season) => {
  const nextVideo = useNextVideo(item, video, season);
  const previousVideo = usePreviousVideo(item, video, season);

  return [previousVideo, nextVideo] as const;
};

const VideoView: React.FC = () => {
  const history = useHistory();
  const episodeId = useSearchParam('episodeId');
  const seasonId = useSearchParam('seasonId');
  const location = useLocation<{ title: string; item: ItemDetails; video: Video; season: Season }>();
  const { item } = location.state || {};

  const [video, season] = useMemo(() => getItemVideoToPlay(item, episodeId, seasonId), [item, episodeId, seasonId]);
  const { watchingMarkTimeAsync } = useApiMutation('watchingMarkTime');
  const [streamingType] = useStorageState<Streaming>('streaming_type');
  const [isAC3ByDefaultActive] = useStorageState<boolean>('is_ac3_by_default_active');
  const [isForcedByDefaultActive] = useStorageState<boolean>('is_forced_by_default_active');
  const [savedAudioName, setSavedAudioName] = useStorageState<string>(`item_${item.id}_saved_audio_name`);
  const [savedSourceName, setSavedSourceName] = useStorageState<string>(`item_${item.id}_saved_source_name`);
  const [savedSubtitleName, setSavedSubtitleName] = useStorageState<string>(`item_${item.id}_saved_subtitle_name`);

  const [currentVideo, setCurrentVideo] = useState(video);
  const [previousVideo, nextVideo] = usePrevNextVideos(item, currentVideo, season);

  const currentVideoLinks = useApi('itemMediaLinks', [currentVideo.id]);

  const saveCurrentTime = useCallback(
    async ({ number }: Video, currentTime: number) => {
      await watchingMarkTimeAsync([item.id, currentTime, number, season?.number]);
    },
    [watchingMarkTimeAsync, item, season],
  );

  const playerProps = useDeepMemo(
    () =>
      currentVideoLinks?.data
        ? ({
            title: getItemTitle(item, currentVideo, season),
            description: getItemDescription(item, currentVideo, season),
            poster: item.posters.wide || item.posters.big,
            audios: mapAudios(currentVideo.audios, isAC3ByDefaultActive, savedAudioName),
            sources: mapSources(currentVideoLinks.data.files, streamingType, savedSourceName),
            subtitles: mapSubtitles(currentVideoLinks.data.subtitles, isForcedByDefaultActive, savedSubtitleName),
            startTime: currentVideo.watching.status === WatchingStatus.Watching ? currentVideo.watching.time : 0,
          } as PlayerProps)
        : null,
    [
      item,
      season,
      currentVideo,
      currentVideoLinks?.data,
      streamingType,
      isAC3ByDefaultActive,
      isForcedByDefaultActive,
      savedAudioName,
      savedSourceName,
      savedSubtitleName,
    ],
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

  const handleAudioChange = useCallback(
    (audioTrack: AudioTrack) => {
      setSavedAudioName(audioTrack?.name);
    },
    [setSavedAudioName],
  );

  const handleSourceChange = useCallback(
    (sourceTrack: SourceTrack) => {
      setSavedSourceName(sourceTrack?.name);
    },
    [setSavedSourceName],
  );

  const handleSubtitleChange = useCallback(
    (subtitleTrack: SubtitleTrack) => {
      setSavedSubtitleName(subtitleTrack?.name);
    },
    [setSavedSubtitleName],
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
          // @ts-expect-error
          onAudioChange={handleAudioChange}
          onSourceChange={handleSourceChange}
          onSubtitleChange={handleSubtitleChange}
        />
      )}
    </>
  );
};

export default VideoView;
