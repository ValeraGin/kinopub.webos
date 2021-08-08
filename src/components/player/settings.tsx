import { useCallback, useEffect, useState } from 'react';
import { VideoPlayerBase } from '@enact/moonstone/VideoPlayer';
import map from 'lodash/map';

import { AudioTrack, SourceTrack, SubtitleTrack } from 'components/media';
import Popup from 'components/popup';
import Radio from 'components/radio';
import Text from 'components/text';

const NONE = 'NONE';

type Props = {
  visible: boolean;
  onClose: () => void;
  player: React.MutableRefObject<VideoPlayerBase | undefined>;
};

const Settings: React.FC<Props> = ({ visible, onClose, player }) => {
  const [audios, setAudios] = useState<AudioTrack[]>([]);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [sources, setSources] = useState<SourceTrack[]>([]);
  const [currentSource, setCurrentSource] = useState<string | null>(null);
  const [subtitles, setSubtitles] = useState<SubtitleTrack[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<string | null>(null);

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
    (audio: string) => () => {
      setCurrentAudio(audio);
      handleVideoUpdate('audioTrack', audio);
    },
    [handleVideoUpdate],
  );
  const handleSourceChange = useCallback(
    (source: string) => () => {
      setCurrentSource(source);
      handleVideoUpdate('sourceTrack', source);
    },
    [handleVideoUpdate],
  );
  const handleSubtitleChange = useCallback(
    (subtitle: string) => () => {
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
        setCurrentSubtitle(subtitleTrack);
      } else {
        handleClose();
      }
    }
  }, [visible, player, handleClose]);

  return (
    <Popup visible={visible} onClose={handleClose}>
      <div className="flex flex-col">
        {audios?.length > 1 && (
          <div className="flex flex-col py-4">
            <Text>Звук</Text>

            <div className="flex flex-wrap mt-2">
              {map(audios, ({ name: audio }) => (
                <div key={audio} className="w-1/2">
                  <Radio checked={audio === currentAudio} onChange={handleAudioChange(audio)}>
                    {audio}
                  </Radio>
                </div>
              ))}
            </div>
          </div>
        )}
        {sources?.length > 1 && (
          <div className="flex flex-col py-4">
            <Text>Качество</Text>

            <div className="flex flex-wrap mt-2">
              {map(sources, ({ name: source }) => (
                <div key={source} className="w-1/6">
                  <Radio checked={source === currentSource} onChange={handleSourceChange(source)}>
                    {source}
                  </Radio>
                </div>
              ))}
            </div>
          </div>
        )}
        {subtitles?.length > 0 && (
          <div className="flex flex-col py-4">
            <Text>Субтитры</Text>

            <div className="flex flex-wrap mt-2">
              <div className="w-1/6">
                <Radio checked={!currentSubtitle || currentSubtitle === NONE} onChange={handleSubtitleChange(NONE)}>
                  Нет
                </Radio>
              </div>

              {map(subtitles, ({ name: subtitle }) => (
                <div key={subtitle} className="w-1/6">
                  <Radio checked={subtitle === currentSubtitle} onChange={handleSubtitleChange(subtitle)}>
                    {subtitle}
                  </Radio>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Popup>
  );
};

export default Settings;
