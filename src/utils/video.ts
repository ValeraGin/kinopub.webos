import filter from 'lodash/filter';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import toUpper from 'lodash/toUpper';

import { Audio, Streaming, Subtitle } from 'api';
import { AudioTrack, SourceTrack, SubtitleTrack } from 'components/media';

const formatIdx = (idx: number) => (idx < 10 ? `0${idx}` : idx);

export function mapAudios(audios: Audio[]): AudioTrack[] {
  return map(audios, (audio, idx) => ({
    lang: audio.lang,
    name: filter([
      `${formatIdx(idx + 1)}.`,
      audio.type?.title && audio.author?.title ? `${audio.type?.title}.` : audio.type?.title,
      audio.author?.title,
      audio.type?.title || audio.author?.title ? `(${toUpper(audio.lang)})` : toUpper(audio.lang),
      audio.codec !== 'aac' && toUpper(audio.codec),
    ]).join(' '),
  }));
}

export function mapSources(
  files: { url: string | { [key in Streaming]?: string }; quality?: string }[],
  streamingType?: Streaming,
): SourceTrack[] {
  return orderBy(
    map(files, (file) => ({
      src: (typeof file.url === 'string' ? file.url : file.url[streamingType!] || file.url.http) as string,
      name: file.quality!,
    })),
    ({ name }) => +name,
  );
}

export function mapSubtitles(subtitles: Subtitle[]): SubtitleTrack[] {
  return map(subtitles, (subtitle, idx) => ({
    src: subtitle.url,
    lang: subtitle.lang,
    name: `${toUpper(subtitle.lang)} #${formatIdx(idx + 1)}`,
  }));
}
