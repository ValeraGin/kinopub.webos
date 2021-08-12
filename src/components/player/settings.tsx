import { useCallback, useEffect, useMemo, useState } from 'react';
import { VideoPlayerBase } from '@enact/moonstone/VideoPlayer';
import map from 'lodash/map';

import { AudioTrack, SourceTrack, SubtitleTrack } from 'components/media';
import Popup from 'components/popup';
import Select from 'components/select';

const NONE = 'NONE';

type Props = {
  visible: boolean;
  onClose: () => void;
  player: React.MutableRefObject<VideoPlayerBase | undefined>;
};

const Settings: React.FC<Props> = ({ visible, onClose, player }) => {
  const [isOpen, setIsOpen] = useState(visible);
  const [audios, setAudios] = useState<AudioTrack[]>([]);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [sources, setSources] = useState<SourceTrack[]>([]);
  const [currentSource, setCurrentSource] = useState<string | null>(null);
  const [subtitles, setSubtitles] = useState<SubtitleTrack[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<string | null>(NONE);

  const audioOptions = useMemo(() => map(audios, (audio) => ({ title: `${audio.number} ${audio.name}`, value: audio.name })), [audios]);
  const sourceOptions = useMemo(() => map(sources, (source) => ({ title: source.name, value: source.name })), [sources]);
  const subtitleOptions = useMemo(
    () => [{ title: 'Нет', value: NONE }, ...map(subtitles, (subtitle) => ({ title: subtitle.name, value: subtitle.name }))],
    [subtitles],
  );

  const handleVideoUpdate = useCallback(
    (name: string, value: string) => {
      if (player.current) {
        const video: any = player.current.getVideoNode();

        video[name] = value;
      }
    },
    [player],
  );

  const handleAudioChange = useCallback(
    (audio: string) => {
      setCurrentAudio(audio);
      handleVideoUpdate('audioTrack', audio);
    },
    [handleVideoUpdate],
  );
  const handleSourceChange = useCallback(
    (source: string) => {
      setCurrentSource(source);
      handleVideoUpdate('sourceTrack', source);
    },
    [handleVideoUpdate],
  );
  const handleSubtitleChange = useCallback(
    (subtitle: string) => {
      setCurrentSubtitle(subtitle);
      handleVideoUpdate('subtitleTrack', subtitle);
    },
    [handleVideoUpdate],
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (visible && player.current) {
      const video: any = player.current.getVideoNode();
      const { audioTracks, audioTrack, sourceTracks, sourceTrack, subtitleTracks, subtitleTrack } = video;

      if (audioTracks?.length > 1 || sourceTracks?.length > 1 || subtitleTracks?.length > 0) {
        setAudios(audioTracks);
        setCurrentAudio(audioTrack);

        setSources(sourceTracks);
        setCurrentSource(sourceTrack);

        setSubtitles(subtitleTracks);
        setCurrentSubtitle(subtitleTrack || NONE);
      } else {
        handleClose();
      }
    }
  }, [visible, player, handleClose]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (visible) {
      timeoutId = setTimeout(() => {
        setIsOpen(true);
      }, 100);
    } else {
      setIsOpen(false);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [visible]);

  return (
    <Popup visible={isOpen} onClose={handleClose}>
      {audioOptions.length > 1 && (
        <Select
          className="my-4"
          label="Звук"
          value={currentAudio}
          options={audioOptions}
          onChange={handleAudioChange}
          splitIn={2}
          closeOnChange
        />
      )}
      {sourceOptions.length > 1 && (
        <Select
          className="my-4"
          label="Качество"
          value={currentSource}
          options={sourceOptions}
          onChange={handleSourceChange}
          splitIn={5}
          closeOnChange
        />
      )}
      {subtitleOptions.length > 1 && (
        <Select
          className="my-4"
          label="Субтитры"
          value={currentSubtitle}
          options={subtitleOptions}
          onChange={handleSubtitleChange}
          splitIn={5}
          closeOnChange
        />
      )}
    </Popup>
  );
};

export default Settings;
