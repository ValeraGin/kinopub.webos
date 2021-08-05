import { useCallback, useState } from 'react';
import { VideoPlayerBase } from '@enact/moonstone/VideoPlayer';
import map from 'lodash/map';

import Button from 'components/button';
import Popup from 'components/popup';
import Radio from 'components/radio';
import Text from 'components/text';
import useButtonEffect from 'hooks/useButtonEffect';

const NONE = 'NONE';

type Props = {
  player: React.MutableRefObject<VideoPlayerBase | undefined>;
  showButton?: boolean;
};

const Settings: React.FC<Props> = ({ player, showButton }) => {
  const [popupVisible, setPopupVisible] = useState(false);

  const [audios, setAudios] = useState<string[]>([]);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [currentSource, setCurrentSource] = useState<string | null>(null);
  const [subtitles, setSubtitles] = useState<string[]>([]);
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

  const handlePopupOpen = useCallback(() => {
    if (player.current && !popupVisible) {
      const video: any = player.current.getVideoNode();
      const { audioTracks, audioTrack, sourceTracks, sourceTrack, subtitleTracks, subtitleTrack } = video;

      if (audioTracks?.length > 1 || sourceTracks?.length > 1 || subtitleTracks?.length > 0) {
        setAudios(audioTracks);
        setCurrentAudio(audioTrack);

        setSources(sourceTracks);
        setCurrentSource(sourceTrack);

        setSubtitles(subtitleTracks);
        setCurrentSubtitle(subtitleTrack);

        player.current.pause();

        setPopupVisible(true);
      }
    }
  }, [popupVisible, player]);

  const handlePopupClose = useCallback(() => {
    setPopupVisible(false);

    if (player.current) {
      player.current.play();
    }
  }, [player]);

  const handleBlueButton = useCallback(() => {
    (popupVisible ? handlePopupClose : handlePopupOpen)();
  }, [popupVisible, handlePopupOpen, handlePopupClose]);

  useButtonEffect('Blue', handleBlueButton);
  useButtonEffect('Play', handlePopupClose);
  useButtonEffect('ArrowUp', handlePopupOpen);

  return (
    <>
      {showButton && <Button className="absolute z-101 bottom-8 right-10" icon="settings" iconOnly onClick={handlePopupOpen} />}
      <Popup visible={popupVisible} onClose={handlePopupClose}>
        <div className="flex flex-col">
          {audios?.length > 1 && (
            <div className="flex flex-col py-4">
              <Text>Звук</Text>

              <div className="flex flex-wrap mt-2">
                {map(audios, (audio) => (
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
                {map(sources, (source) => (
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

                {map(subtitles, (subtitle) => (
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
    </>
  );
};

export default Settings;
