import { useCallback, useEffect, useState } from 'react';
import CheckboxItem from '@enact/moonstone/CheckboxItem';
import { VideoPlayerBase } from '@enact/moonstone/VideoPlayer';
import map from 'lodash/map';
import styled from 'styled-components';

import Popup from 'components/popup';
import Text from 'components/text';

import { isArrowUpButton, isPlayButton } from 'utils/keyboard';

const NONE = 'NONE';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Section = styled.div`
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled(Text)`
  width: 5rem;
`;

const SectionContent = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const SectionContentItem = styled.div<{ width?: string | number }>`
  width: ${(props) => props.width};
  padding-right: 1rem;
  box-sizing: border-box;
`;

type Props = {
  player: React.MutableRefObject<VideoPlayerBase | undefined>;
};

const Settings: React.FC<Props> = ({ player }) => {
  const [visible, setVisible] = useState(false);

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

  const handleVisibilityChange = useCallback(
    (newVisible: boolean) => {
      setVisible(newVisible);

      if (player.current && !newVisible) {
        player.current.play();
      }
    },
    [player],
  );

  useEffect(() => {
    const listiner = (e: KeyboardEvent) => {
      if (isArrowUpButton(e)) {
        if (player.current) {
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

            setVisible(true);
          }
        }
      } else if (isPlayButton(e)) {
        setVisible(false);
      }
    };

    window.addEventListener('keydown', listiner);

    return () => {
      window.removeEventListener('keydown', listiner);
    };
  }, [visible, player]);

  return (
    <Popup visible={visible} onVisibilityChange={handleVisibilityChange}>
      <Wrapper>
        {audios?.length > 1 && (
          <Section>
            <SectionTitle>Звук</SectionTitle>

            <SectionContent>
              {map(audios, (audio) => (
                <SectionContentItem key={audio} width="50%">
                  <CheckboxItem selected={audio === currentAudio} onToggle={handleAudioChange(audio)}>
                    {audio}
                  </CheckboxItem>
                </SectionContentItem>
              ))}
            </SectionContent>
          </Section>
        )}
        {sources?.length > 1 && (
          <Section>
            <SectionTitle>Качество</SectionTitle>

            <SectionContent>
              {map(sources, (source) => (
                <SectionContentItem key={source} width="15%">
                  <CheckboxItem selected={source === currentSource} onToggle={handleSourceChange(source)}>
                    {source}
                  </CheckboxItem>
                </SectionContentItem>
              ))}
            </SectionContent>
          </Section>
        )}
        {subtitles?.length > 0 && (
          <Section>
            <SectionTitle>Субтитры</SectionTitle>

            <SectionContent>
              <SectionContentItem width="15%">
                <CheckboxItem selected={!currentSubtitle || currentSubtitle === NONE} onToggle={handleSubtitleChange(NONE)}>
                  Нет
                </CheckboxItem>
              </SectionContentItem>

              {map(subtitles, (subtitle) => (
                <SectionContentItem key={subtitle} width="15%">
                  <CheckboxItem selected={subtitle === currentSubtitle} onToggle={handleSubtitleChange(subtitle)}>
                    {subtitle}
                  </CheckboxItem>
                </SectionContentItem>
              ))}
            </SectionContent>
          </Section>
        )}
      </Wrapper>
    </Popup>
  );
};

export default Settings;
