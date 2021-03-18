import { useCallback } from 'react';
import CheckboxItem from '@enact/moonstone/CheckboxItem';
import map from 'lodash/map';
import styled from 'styled-components';

import Text from '../text';

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

export type SourceSetting = {
  src: string;
  hls?: string;
  type: string;
  quality?: string;
};

export type SubtitleSetting = {
  id: string;
  src: string;
  lang: string;
  default?: boolean;
  label?: string;
};

export type AudioSetting = {
  id: string;
  lang: string;
  label?: string;
};

type Props = {
  audios?: AudioSetting[];
  currentAudio: AudioSetting;
  onAudioChange: (audio: AudioSetting) => void;
  sources: SourceSetting[];
  currentSource: SourceSetting;
  onSourceChange: (source: SourceSetting) => void;
  subtitles?: SubtitleSetting[];
  currentSubtitle?: SubtitleSetting;
  onSubtitleChange?: (subtitle: SubtitleSetting) => void;
};

const formatIdx = (idx: number) => (idx < 10 ? `0${idx}` : idx);

const Settings: React.FC<Props> = ({
  audios,
  currentAudio,
  onAudioChange,
  sources,
  currentSource,
  onSourceChange,
  subtitles,
  currentSubtitle,
  onSubtitleChange,
}) => {
  const handleAudioChange = useCallback(
    (audio: AudioSetting) => () => {
      if (audio !== currentAudio) {
        onAudioChange(audio);
      }
    },
    [currentAudio, onAudioChange],
  );
  const handleSourceChange = useCallback(
    (source: SourceSetting) => () => {
      if (source !== currentSource) {
        onSourceChange(source);
      }
    },
    [currentSource, onSourceChange],
  );
  const handleSubtitleChange = useCallback(
    (subtitle: SubtitleSetting) => () => {
      if (subtitle !== currentSubtitle) {
        onSubtitleChange(subtitle);
      }
    },
    [currentSubtitle, onSubtitleChange],
  );

  return (
    <Wrapper>
      {audios?.length > 1 && (
        <Section>
          <SectionTitle>Звук</SectionTitle>

          <SectionContent>
            {map(audios, (audio, idx) => (
              <SectionContentItem key={audio.id} width="50%">
                <CheckboxItem selected={audio.id === currentAudio.id} onToggle={handleAudioChange(audio)}>
                  {formatIdx(idx + 1)}. {audio.label}
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
            {map(sources, (source, idx) => (
              <SectionContentItem key={source.quality} width="15%">
                <CheckboxItem selected={source.quality === currentSource.quality} onToggle={handleSourceChange(source)}>
                  {formatIdx(idx + 1)}. {source.quality}
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
              <CheckboxItem selected={!currentSubtitle} onToggle={handleSubtitleChange(null)}>
                Нет
              </CheckboxItem>
            </SectionContentItem>

            {map(subtitles, (subtitle, idx) => (
              <SectionContentItem key={subtitle.id} width="15%">
                <CheckboxItem selected={subtitle.id === currentSubtitle?.id} onToggle={handleSubtitleChange(subtitle)}>
                  {formatIdx(idx + 1)}. {subtitle.label}
                </CheckboxItem>
              </SectionContentItem>
            ))}
          </SectionContent>
        </Section>
      )}
    </Wrapper>
  );
};

export default Settings;
