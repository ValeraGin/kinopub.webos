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
  const [isLoaded, setIsLoaded] = useState(false);
  const [titleVisible, setTitleVisible] = useState(true);
  const [settingsAreOpen, setSettingsAreOpen] = useState(false);

  const handlePlay = useCallback(() => {
    setTitleVisible(false);
    onPlay?.();
  }, [onPlay]);
  const handlePause = useCallback(
    (e) => {
      setTitleVisible(true);
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
      const video: any = playerRef.current.getVideoNode();

      video.pause();
      setSettingsAreOpen(true);
    }
  }, [playerRef]);
  const handleSettingsClose = useCallback(() => {
    if (playerRef.current) {
      const video: any = playerRef.current.getVideoNode();

      video.play();
      setSettingsAreOpen(false);
    }
  }, []);
  const handleBlueButton = useCallback(() => {
    !settingsAreOpen && handleSettingsOpen();
  }, [settingsAreOpen, handleSettingsOpen]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (titleVisible) {
      timeoutId = setTimeout(() => {
        setTitleVisible(false);
      }, 5 * 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [titleVisible]);

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
  useButtonEffect('Blue', handleBlueButton);
  useButtonEffect('Play', handleSettingsClose);
  useButtonEffect('ArrowUp', handleSettingsOpen);

  return (
    <>
      <Settings visible={settingsAreOpen} onClose={handleSettingsClose} player={playerRef} />
      {titleVisible && <Text className="absolute z-10 top-0 p-4">{title}</Text>}
      {titleVisible && <Button className="absolute z-101 bottom-8 right-10" icon="settings" iconOnly onClick={handleSettingsOpen} />}
      {isLoaded && startTime! > 0 && <StartFrom startTime={startTime} player={playerRef} />}

      <VideoPlayer
        {...props}
        //@ts-expect-error
        ref={playerRef}
        title={description}
        poster={poster}
        jumpBy={10}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
        streamingType={streamingType}
        settingsAreOpen={settingsAreOpen}
        audioTracks={audios}
        sourceTracks={sources}
        subtitleTracks={subtitles}
        videoComponent={<Media />}
      />
    </>
  );
};

export default Player;
