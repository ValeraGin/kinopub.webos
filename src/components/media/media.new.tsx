import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import HLS from 'hls.js';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import uniqBy from 'lodash/uniqBy';

import useStorageState from 'hooks/useStorageState';

import { convertToVTT } from 'utils/subtitles';

export type AudioTrack = {
  name: string;
  lang: string;
};

export type SourceTrack = {
  src: string;
  type: string;
  name: string;
};

export type SubtitleTrack = {
  src: string;
  name: string;
  lang: string;
};

export type StreamingType = 'http' | 'hls' | 'hls2' | 'hls4';

type OwnProps = {
  autoPlay?: boolean;
  audioTracks?: AudioTrack[];
  sourceTracks?: SourceTrack[];
  subtitleTracks?: SubtitleTrack[];
  streamingType?: StreamingType;
  isSettingsOpen?: boolean;
  onUpdate?: () => void;
  mediaComponent?: string;
};

export type MediaRef = {
  play: () => Promise<void>;
  pause: () => void;
  playPause: () => Promise<void>;
  load: () => void;
  currentTime: number;
  playbackRate: number;
  audioTracks?: AudioTrack[];
  audioTrack?: string;
  sourceTracks?: SourceTrack[];
  sourceTrack?: string;
  subtitleTracks?: SubtitleTrack[];
  subtitleTrack?: string;
  readonly duration: number;
  readonly error: boolean;
  readonly loading: boolean;
  readonly paused: boolean;
  readonly proportionLoaded: number;
  readonly proportionPlayed: number;
};

function useVideoPlayer({ autoPlay, audioTracks, sourceTracks, subtitleTracks, streamingType, isSettingsOpen }: OwnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<HLS | null>(null);
  const startTimeRef = useRef(0);
  const isSettingsOpenRef = useRef(false);
  const [isHLSJSActive] = useStorageState<boolean>('is_hls.js_active');
  const [currentAudioTrack, setCurrentAudioTrack] = useState<AudioTrack>(audioTracks?.[0]!);
  const [currentSourceTrack, setCurrentSourceTrack] = useState<SourceTrack>(sourceTracks?.[0]!);
  const [currentSubtitleTrack, setCurrentSubtitleTrack] = useState<SubtitleTrack | null>(null);

  const getAudioTracks = useCallback(() => (streamingType === 'hls2' ? [] : audioTracks), [audioTracks, streamingType]);
  const getAudioTrack = useCallback(() => currentAudioTrack?.name, [currentAudioTrack]);
  const setAudioTrack = useCallback(
    (audioTrackName: string) => {
      const audioTrack = audioTracks?.find((audioTrack) => audioTrack.name === audioTrackName);
      if (audioTrack) {
        setCurrentAudioTrack(audioTrack);
      }
    },
    [audioTracks],
  );
  const getSourceTracks = useCallback(() => uniqBy(sourceTracks, 'src'), [sourceTracks]);
  const getSourceTrack = useCallback(() => currentSourceTrack?.name, [currentSourceTrack]);
  const setSourceTrack = useCallback(
    (sourceTrackName: string) => {
      const sourceTrack = sourceTracks?.find((sourceTrack) => sourceTrack.name === sourceTrackName);
      if (sourceTrack) {
        setCurrentSourceTrack(sourceTrack);
      }
    },
    [sourceTracks],
  );
  const getSubtitleTracks = useCallback(() => subtitleTracks, [subtitleTracks]);
  const getSubtitleTrack = useCallback(() => currentSubtitleTrack?.name, [currentSubtitleTrack]);
  const setSubtitleTrack = useCallback(
    (subtitleTrackName?: string) => {
      const subtitleTrack = subtitleTracks?.find((subtitleTrack) => subtitleTrack.name === subtitleTrackName);
      setCurrentSubtitleTrack(subtitleTrack || null);
    },
    [subtitleTracks],
  );

  const currentAudioTrackIndex = useMemo(
    () => audioTracks?.findIndex((audioTrack) => audioTrack.name === currentAudioTrack.name) ?? 0,
    [audioTracks, currentAudioTrack],
  );
  const currentSrc = useMemo(
    () =>
      streamingType === 'hls'
        ? currentSourceTrack?.src.replace(/master-v1a\d/, `master-v1a${currentAudioTrackIndex + 1}`)
        : currentSourceTrack?.src,
    [streamingType, currentAudioTrackIndex, currentSourceTrack?.src],
  );

  const handleMediaLoaded = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.removeEventListener('canplay', handleMediaLoaded);

      // clear existing subtitles
      while (videoRef.current.firstChild) {
        // @ts-expect-error
        videoRef.current.lastChild.track.mode = 'disabled';
        videoRef.current.removeChild(videoRef.current.lastChild!);
      }

      if (hlsRef.current) {
        const audioTrack = find(hlsRef.current.audioTracks, (audioTrack) => audioTrack.name === currentAudioTrack?.name);

        if (audioTrack) {
          hlsRef.current.audioTrack = audioTrack.id;
        }
      } else {
        // Do not change audio if we don't have it (mostly on HLS)
        // @ts-expect-error
        if (videoRef.current.audioTracks?.[currentAudioTrackIndex]) {
          // @ts-expect-error
          forEach(videoRef.current.audioTracks, (audioTrack, idx: number) => {
            audioTrack.enabled = idx === currentAudioTrackIndex;
          });
        }
      }

      if (startTimeRef.current > 0) {
        videoRef.current.currentTime = startTimeRef.current;

        if (isSettingsOpenRef.current) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
      } else if (autoPlay) {
        videoRef.current.play();
      }

      if (currentSubtitleTrack) {
        const addSubtitleTrack = (src: string) => {
          if (videoRef.current) {
            const track = document.createElement('track');
            videoRef.current.appendChild(track);

            track.src = src;
            track.kind = 'captions';
            track.id = currentSubtitleTrack.name;
            track.label = currentSubtitleTrack.name;
            track.srclang = currentSubtitleTrack.lang;

            track.track.mode = 'showing';
          }
        };

        if (currentSubtitleTrack.src.endsWith('.srt')) {
          convertToVTT(currentSubtitleTrack.src).then(addSubtitleTrack);
        } else {
          addSubtitleTrack(currentSubtitleTrack.src);
        }
      }
    }
  }, [autoPlay, currentAudioTrackIndex, currentAudioTrack?.name, currentSubtitleTrack]);

  useEffect(() => {
    if (videoRef.current && currentSrc) {
      if (isHLSJSActive && currentSrc.includes('.m3u8') && HLS.isSupported()) {
        const hls = (hlsRef.current = new HLS({
          enableWebVTT: false,
          enableCEA708Captions: false,
        }));
        hls.attachMedia(videoRef.current);
        hls.on(HLS.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(currentSrc);
        });
      } else {
        videoRef.current.src = currentSrc;
      }

      videoRef.current.addEventListener('canplay', handleMediaLoaded);
    }

    return () => {
      if (videoRef.current) {
        if (videoRef.current.currentTime > 0) {
          // eslint-disable-next-line
          startTimeRef.current = videoRef.current.currentTime;
        }
        // eslint-disable-next-line
        videoRef.current.removeEventListener('canplay', handleMediaLoaded);
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [
    currentSrc,
    videoRef,
    startTimeRef,
    handleMediaLoaded,
    isHLSJSActive,
    streamingType,
    currentAudioTrack,
    currentSourceTrack,
    currentSubtitleTrack,
    currentAudioTrackIndex,
    audioTracks,
  ]);

  useEffect(() => {
    isSettingsOpenRef.current = Boolean(isSettingsOpen);
  }, [isSettingsOpen]);

  return useMemo(
    () => ({
      videoRef: videoRef,
      getAudioTracks,
      getAudioTrack,
      setAudioTrack,
      getSourceTracks,
      getSourceTrack,
      setSourceTrack,
      getSubtitleTracks,
      getSubtitleTrack,
      setSubtitleTrack,
    }),
    [
      videoRef,
      getAudioTracks,
      getAudioTrack,
      setAudioTrack,
      getSourceTracks,
      getSourceTrack,
      setSourceTrack,
      getSubtitleTracks,
      getSubtitleTrack,
      setSubtitleTrack,
    ],
  );
}

function useVideoPlayerApi(ref: React.ForwardedRef<MediaRef>, props: OwnProps) {
  const player = useVideoPlayer(props);
  const videoRef = player.videoRef;

  const getCurrentTime = useCallback(() => {
    if (videoRef.current) {
      return videoRef.current.currentTime;
    }
    return 0;
  }, [videoRef]);
  const setCurrentTime = useCallback(
    (currentTime: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = currentTime;
      }
    },
    [videoRef],
  );
  const getPlaybackRate = useCallback(() => {
    if (videoRef.current) {
      return videoRef.current.playbackRate;
    }
    return 1;
  }, [videoRef]);
  const setPlaybackRate = useCallback(
    (playbackRate: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = playbackRate;
      }
    },
    [videoRef],
  );
  const getPaused = useCallback(() => {
    if (videoRef.current) {
      return videoRef.current.paused;
    }
    return false;
  }, [videoRef]);
  const getDuration = useCallback(() => {
    if (videoRef.current) {
      return videoRef.current.duration;
    }
    return 0;
  }, [videoRef]);
  const getError = useCallback(() => {
    if (videoRef.current) {
      return videoRef.current.networkState === videoRef.current.NETWORK_NO_SOURCE;
    }
    return false;
  }, [videoRef]);
  const getLoading = useCallback(() => {
    if (videoRef.current) {
      return videoRef.current.readyState < videoRef.current.HAVE_ENOUGH_DATA;
    }
    return true;
  }, [videoRef]);
  const getProportionLoaded = useCallback(() => {
    if (videoRef.current) {
      return (
        videoRef.current.buffered.length && videoRef.current.buffered.end(videoRef.current.buffered.length - 1) / videoRef.current.duration
      );
    }
    return 0;
  }, [videoRef]);
  const getProportionPlayed = useCallback(() => {
    if (videoRef.current) {
      return videoRef.current.currentTime / videoRef.current.duration;
    }
    return 0;
  }, [videoRef]);
  const play = useCallback(async () => {
    await videoRef.current?.play();
  }, [videoRef]);
  const pause = useCallback(() => {
    videoRef.current?.pause();
  }, [videoRef]);
  const playPause = useCallback(async () => {
    if (getPaused()) {
      await play();
    } else {
      pause();
    }
  }, [play, pause, getPaused]);
  const load = useCallback(() => {
    videoRef.current?.load();
  }, [videoRef]);

  const api = useMemo<MediaRef>(
    () => ({
      play,
      pause,
      playPause,
      load,
      get currentTime() {
        return getCurrentTime();
      },
      set currentTime(currentTime) {
        setCurrentTime(currentTime);
      },
      get audioTracks() {
        return player.getAudioTracks();
      },
      get audioTrack() {
        return player.getAudioTrack();
      },
      set audioTrack(audioTrack) {
        player.setAudioTrack(audioTrack);
      },
      get sourceTracks() {
        return player.getSourceTracks();
      },
      get sourceTrack() {
        return player.getSourceTrack();
      },
      set sourceTrack(sourceTrack) {
        player.setSourceTrack(sourceTrack);
      },
      get subtitleTracks() {
        return player.getSubtitleTracks();
      },
      get subtitleTrack() {
        return player.getSubtitleTrack();
      },
      set subtitleTrack(subtitleTrack) {
        player.setSubtitleTrack(subtitleTrack);
      },
      get playbackRate() {
        return getPlaybackRate();
      },
      set playbackRate(playbackRate) {
        setPlaybackRate(playbackRate);
      },
      get paused() {
        return getPaused();
      },
      get duration() {
        return getDuration();
      },
      get error() {
        return getError();
      },
      get loading() {
        return getLoading();
      },
      get proportionLoaded() {
        return getProportionLoaded();
      },
      get proportionPlayed() {
        return getProportionPlayed();
      },
    }),
    [
      player,
      play,
      pause,
      playPause,
      load,
      getCurrentTime,
      setCurrentTime,
      getPlaybackRate,
      setPlaybackRate,
      getPaused,
      getDuration,
      getError,
      getLoading,
      getProportionLoaded,
      getProportionPlayed,
    ],
  );

  useImperativeHandle(ref, () => api, [api]);

  return useMemo(
    () => ({
      api,
      player,
    }),
    [api, player],
  );
}

const MEDIA_EVENTS = [
  'onAbort',
  'onCanPlay',
  'onCanPlayThrough',
  'onDurationChange',
  'onEmptied',
  'onEncrypted',
  'onEnded',
  'onError',
  'onLoadedData',
  'onLoadedMetadata',
  'onLoadStart',
  'onPause',
  'onPlay',
  'onPlaying',
  'onProgress',
  'onRateChange',
  'onSeeked',
  'onSeeking',
  'onStalled',
  'onSuspend',
  'onTimeUpdate',
  'onVolumeChange',
  'onWaiting',
] as const;

type MediaEvents = keyof typeof MEDIA_EVENTS;

export type MediaProps = OwnProps & React.HTMLAttributes<HTMLVideoElement>;

const Media = React.forwardRef<MediaRef, MediaProps>(
  (
    { autoPlay, audioTracks, sourceTracks, subtitleTracks, streamingType, isSettingsOpen, onUpdate, className, mediaComponent, ...props },
    ref,
  ) => {
    const handleUpdate = useCallback(() => {
      onUpdate?.();
    }, [onUpdate]);
    const eventProps = useMemo(
      () =>
        MEDIA_EVENTS.reduce<Partial<Record<MediaEvents, Function>>>(
          (result, event) => ({
            ...result,
            [event]: (...args: any[]) => {
              handleUpdate();
              // @ts-expect-error
              props[event]?.(...args);
            },
          }),
          {},
        ),
      [props, handleUpdate],
    );
    const { player } = useVideoPlayerApi(ref, { autoPlay, audioTracks, sourceTracks, subtitleTracks, streamingType, isSettingsOpen });

    return <video {...props} {...eventProps} autoPlay={false} className={cx('w-screen h-screen', className)} ref={player.videoRef} />;
  },
);

export default Media;
