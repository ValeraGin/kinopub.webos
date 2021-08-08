import React, { useCallback, useEffect, useRef, useState } from 'react';
import VideoPlayer, { VideoPlayerBase, VideoPlayerBaseProps } from '@enact/moonstone/VideoPlayer';

import Button from 'components/button';
import Media, { AudioTrack, SourceTrack, StreamingType, SubtitleTrack } from 'components/media';
import Text from 'components/text';
import useButtonEffect from 'hooks/useButtonEffect';

import Settings from './settings';
import StartFrom from './startFrom';

export type PlayerProps = {
  title: string;
  description?: string;
  poster: string;
  audios?: AudioTrack[];
  sources: SourceTrack[];
  subtitles?: SubtitleTrack[];
  startTime?: number;
  timeSyncInterval?: number;
  streamingType?: StreamingType;
  onPlay?: () => void;
  onPause?: (currentTime: number) => void;
  onEnded?: (currentTime: number) => void;
  onTimeSync?: (currentTime: number) => void | Promise<void>;
} & VideoPlayerBaseProps;

const Player: React.FC<PlayerProps> = ({
  title,
  description,
  poster,
  audios,
  sources,
  subtitles,
  startTime,
  timeSyncInterval = 30,
  streamingType,
  onPlay,
  onPause,
  onEnded,
  onTimeSync,
  ...props
}) => {
  const playerRef = useRef<VideoPlayerBase>();
  const [isPaused, setIsPaused] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handlePlay = useCallback(() => {
    setIsPaused(false);
    setIsSettingsOpen(false);
    onPlay?.();
  }, [onPlay]);
  const handlePause = useCallback(
    (e) => {
      setIsPaused(true);
      onPause?.(e.currentTime);
    },
    [onPause],
  );
  const handleEnded = useCallback(
    (e) => {
      onEnded?.(e.target.currentTime);
    },
    [onEnded],
  );
  const handleTimeSync = useCallback(async () => {
    if (playerRef.current && onTimeSync) {
      const video: any = playerRef.current.getVideoNode();

      const currentTime = video['currentTime'];

      await onTimeSync(currentTime);
    }
  }, [onTimeSync, playerRef]);
  const handleLoadedMetadata = useCallback(() => {
    setIsLoaded(true);
  }, []);
  const handleSettingsOpen = useCallback(() => {
    if (playerRef.current) {
      setIsSettingsOpen(true);

      const video: any = playerRef.current.getVideoNode();
      video.pause();
    }
  }, [playerRef]);
  const handleSettingsClose = useCallback(() => {
    if (playerRef.current) {
      setIsSettingsOpen(false);

      const video: any = playerRef.current.getVideoNode();
      video.play();
    }
  }, []);
  const handlePauseButton = useCallback(() => {
    if (playerRef.current) {
      const video: any = playerRef.current.getVideoNode();
      video.pause();
    }
  }, [playerRef]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isPaused) {
      timeoutId = setTimeout(() => {
        setIsPaused(false);
      }, 5 * 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isPaused]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (onTimeSync) {
      intervalId = setInterval(handleTimeSync, timeSyncInterval * 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timeSyncInterval, onTimeSync, handleTimeSync]);

  useButtonEffect('Back', handleTimeSync);
  useButtonEffect('Blue', handleSettingsOpen);
  useButtonEffect('Play', handleSettingsClose);
  useButtonEffect('Pause', handlePauseButton);
  useButtonEffect('ArrowUp', handleSettingsOpen);

  return (
    <>
      <Settings visible={isSettingsOpen} onClose={handleSettingsClose} player={playerRef} />
      {isPaused && <Text className="absolute z-10 top-0 p-4">{title}</Text>}
      {isPaused && (
        <Button className="absolute z-101 bottom-8 right-10 text-blue-600" icon="settings" iconOnly onClick={handleSettingsOpen} />
      )}
      {isLoaded && startTime! > 0 && <StartFrom startTime={startTime} player={playerRef} />}

      <VideoPlayer
        {...props}
        //@ts-expect-error
        ref={playerRef}
        poster={poster}
        title={description}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
        streamingType={streamingType}
        isSettingsOpen={isSettingsOpen}
        audioTracks={audios}
        sourceTracks={sources}
        subtitleTracks={subtitles}
        videoComponent={<Media />}
      />
    </>
  );
};

export default Player;
