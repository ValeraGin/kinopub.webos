import React, { useCallback, useEffect, useRef, useState } from 'react';
import VideoPlayer, { VideoPlayerBase, VideoPlayerBaseProps } from '@enact/moonstone/VideoPlayer';
import styled from 'styled-components';

import Media, { AudioTrack, SourceTrack, SubtitleTrack } from 'components/media';
import Text from 'components/text';

import Settings from './settings';

const Wrapper = styled.div`
  video {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;

const Title = styled(Text)<{ visible?: boolean }>`
  position: absolute;
  padding: 0 1rem;
  z-index: 1;
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
`;

export type PlayerProps = {
  title: string;
  description?: string;
  poster: string;
  audios?: AudioTrack[];
  sources: SourceTrack[];
  subtitles?: SubtitleTrack[];
  onPlay?: () => void;
  onPause?: (currentTime: number) => void;
  onEnded?: (currentTime: number) => void;
} & VideoPlayerBaseProps;

const Player: React.FC<PlayerProps> = ({ title, description, poster, audios, sources, subtitles, onPlay, onPause, onEnded, ...props }) => {
  const playerRef = useRef<VideoPlayerBase>();
  const [titleVisible, setTitleVisible] = useState(true);

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

  useEffect(() => {
    if (titleVisible) {
      setTimeout(() => {
        setTitleVisible(false);
      }, 5 * 1000);
    }
  }, [titleVisible]);

  return (
    <Wrapper>
      <Title visible={titleVisible}>{title}</Title>
      <Settings player={playerRef} />

      {
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
          audioTracks={audios}
          sourceTracks={sources}
          subtitleTracks={subtitles}
          videoComponent={Media}
        />
      }
    </Wrapper>
  );
};

export default Player;
