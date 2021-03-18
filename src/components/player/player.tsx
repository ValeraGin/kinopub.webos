import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import VideoPlayer, { Video, VideoPlayerBase, VideoPlayerBaseProps } from '@enact/moonstone/VideoPlayer';
import Hls from 'hls.js';
import VTTConverter from 'srt-webvtt';
import styled from 'styled-components';

import Popup from '../popup';
import Text from '../text';
import Settings, { AudioSetting, SourceSetting, SubtitleSetting } from './settings';

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

const useCurrentAudio = (audios: AudioSetting[], nodeRef: React.MutableRefObject<HTMLDivElement>) => {
  const [currentAudio, setCurrentAudio] = useState<AudioSetting>(audios?.[0]);

  useEffect(() => {
    if (nodeRef.current) {
      const videoTag = nodeRef.current.querySelector('video');
      for (let i = 0, ln = videoTag?.['audioTracks']?.length; i < ln; i++) {
        const track = videoTag?.['audioTracks'][i];

        if (track.id === currentAudio.id) {
          track.enabled = true;
        }
      }
    }
  }, [currentAudio, nodeRef]);

  return [currentAudio, setCurrentAudio] as const;
};

const useCurrentSource = (sources: SourceSetting[], nodeRef: React.MutableRefObject<HTMLDivElement>) => {
  const [currentSource, setCurrentSource] = useState<SourceSetting>(sources[0]);

  useEffect(() => {
    let hls: Hls;
    if (nodeRef.current && currentSource.hls) {
      const videoTag = nodeRef.current.querySelector('video');

      if (videoTag) {
        if (Hls.isSupported()) {
          hls = new Hls();

          hls.loadSource(currentSource.hls);
          hls.attachMedia(videoTag);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoTag.play();
          });
        } else if (videoTag.canPlayType('application/vnd.apple.mpegurl')) {
          videoTag.src = currentSource.hls;
          videoTag.addEventListener('loadedmetadata', () => {
            videoTag.play();
          });
        }
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [currentSource, nodeRef]);

  return [currentSource, setCurrentSource] as const;
};

const useCurrentSubtitle = (subtitles: SubtitleSetting[], nodeRef: React.MutableRefObject<HTMLDivElement>) => {
  const [currentSubtitle, setCurrentSubtitle] = useState<SubtitleSetting>(null);

  useEffect(() => {
    if (nodeRef.current) {
      const videoTag = nodeRef.current.querySelector('video');

      if (videoTag) {
        for (let i = 0, ln = videoTag['textTracks'].length; i < ln; i++) {
          const track = videoTag['textTracks'][i];

          track.mode = track.id === currentSubtitle?.id ? 'showing' : 'disabled';
        }
      }
    }
  }, [currentSubtitle, nodeRef]);

  useEffect(() => {
    if (nodeRef.current) {
      const videoTag = nodeRef.current.querySelector('video');
      if (videoTag) {
        const trackTags = videoTag.querySelectorAll('track');

        trackTags.forEach((trackTag) => {
          videoTag.removeChild(trackTag);
        });

        subtitles?.forEach(async (subtitle) => {
          const track = document.createElement('track');

          track.kind = 'captions';
          track.id = subtitle.id;
          track.srclang = subtitle.lang;
          track.label = subtitle.label;

          if (subtitle.src.endsWith('.srt')) {
            const file = await (await fetch(subtitle.src)).blob();
            const converter = new VTTConverter(file);
            track.src = await converter.getURL();
          } else {
            track.src = subtitle.src;
          }

          videoTag.appendChild(track);
        });
      }
    }
  }, [subtitles, nodeRef]);

  return [currentSubtitle, setCurrentSubtitle] as const;
};

const usePopup = (playerRef: React.MutableRefObject<VideoPlayerBase>, hasSettings: boolean) => {
  const [visible, setVisible] = useState(false);

  const handleVisibilityChange = useCallback(
    (newVisible: boolean) => {
      setVisible(newVisible);

      if (playerRef.current && !newVisible) {
        playerRef.current.play();
      }
    },
    [playerRef],
  );

  useEffect(() => {
    const listiner = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp') {
        if (hasSettings) {
          setVisible(true);

          if (playerRef.current) {
            playerRef.current.pause();
          }
        }
      }
    };

    window.addEventListener('keydown', listiner);

    return () => {
      window.removeEventListener('keydown', listiner);
    };
  }, [visible, playerRef, hasSettings]);

  return [visible, handleVisibilityChange] as const;
};

export type PlayerProps = {
  title: string;
  description?: string;
  poster: string;
  audios?: AudioSetting[];
  sources: SourceSetting[];
  subtitles?: SubtitleSetting[];
  onPlay?: () => void;
  onPause?: (currentTime: number) => void;
  onEnded?: (currentTime: number) => void;
} & VideoPlayerBaseProps;

const Player: React.FC<PlayerProps> = ({ title, description, poster, audios, sources, subtitles, onPlay, onPause, onEnded, ...props }) => {
  const playerRef = useRef<VideoPlayerBase>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(true);
  const hasSettings = useMemo(() => sources.length > 1 || audios?.length > 1 || subtitles?.length > 0, [audios, sources, subtitles]);
  const [popupVisible, setPopupVisible] = usePopup(playerRef, hasSettings);

  const [currentAudio, setCurrentAudio] = useCurrentAudio(audios, wrapperRef);
  const [currentSource, setCurrentSource] = useCurrentSource(sources, wrapperRef);
  const [currentSubtitle, setCurrentSubtitle] = useCurrentSubtitle(subtitles, wrapperRef);

  const handlePlay = useCallback(() => {
    setTitleVisible(false);
    setPopupVisible(false);
    onPlay?.();
  }, [onPlay, setPopupVisible]);
  const handlePause = useCallback(
    (e) => {
      setTitleVisible(true);
      onPause?.(e.target.currentTime);
    },
    [onPause],
  );
  const handleEnded = useCallback(
    (e) => {
      onEnded?.(e.target.currentTime);
    },
    [onEnded],
  );

  return (
    <Wrapper ref={wrapperRef}>
      <Title visible={titleVisible}>{title}</Title>
      <Popup visible={popupVisible} onVisibilityChange={setPopupVisible}>
        {hasSettings && (
          <Settings
            audios={audios}
            currentAudio={currentAudio}
            onAudioChange={setCurrentAudio}
            sources={sources}
            currentSource={currentSource}
            onSourceChange={setCurrentSource}
            subtitles={subtitles}
            currentSubtitle={currentSubtitle}
            onSubtitleChange={setCurrentSubtitle}
          />
        )}
      </Popup>

      {
        //@ts-expect-error
        <VideoPlayer {...props} title={description} poster={poster} ref={playerRef}>
          <Video onPlay={handlePlay} onPause={handlePause} onEnded={handleEnded}>
            <source src={currentSource.src} type={currentSource.type} />
          </Video>
        </VideoPlayer>
      }
    </Wrapper>
  );
};

export default Player;
