import filter from 'lodash/filter';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import toUpper from 'lodash/toUpper';

import { Audio, Streaming, Subtitle } from 'api';
import { AudioTrack, SourceTrack, SubtitleTrack } from 'components/media';

const formatIdx = (idx: number) => (idx < 10 ? `0${idx}` : idx);

export function mapAudios(audios: Audio[], ac3ByDefault?: boolean, savedAudioName?: string): AudioTrack[] {
  return map(audios, (audio, idx) => {
    const name = filter([
      audio.type?.title && audio.author?.title ? `${audio.type?.title}.` : audio.type?.title,
      audio.author?.title,
      audio.type?.title || audio.author?.title ? `(${toUpper(audio.lang)})` : toUpper(audio.lang),
      audio.codec === 'ac3' && toUpper(audio.codec),
    ]).join(' ');
    const number = `${formatIdx(idx + 1)}.`;

    return {
      name,
      number,
      lang: audio.lang,
      default: (savedAudioName && savedAudioName === name) || (!savedAudioName && ac3ByDefault && audio.codec === 'ac3'),
    };
  });
}

export function mapSources(
  files: { url: string | { [key in Streaming]?: string }; quality?: string }[],
  streamingType?: Streaming,
  savedSourceName?: string,
): SourceTrack[] {
  return orderBy(
    map(files, (file) => {
      const src = (typeof file.url === 'string' ? file.url : file.url[streamingType!] || file.url.http!) as string;
      const name = file.quality!;

      return {
        src,
        name,
        type: src.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4',
        default: savedSourceName === name,
      };
    }),
    ({ name }) => parseInt(name),
    'desc',
  );
}

export function mapSubtitles(subtitles: Subtitle[], forcedByDefault?: boolean, savedSubtitleName?: string): SubtitleTrack[] {
  return map(subtitles, (subtitle, idx) => {
    const name = `${toUpper(subtitle.lang)}${subtitle.forced ? ' Forced' : ''}`;
    const number = `${formatIdx(idx + 1)}.`;

    return {
      name,
      number,
      src: subtitle.url,
      lang: subtitle.lang,
      default:
        (savedSubtitleName && savedSubtitleName === name) ||
        (!savedSubtitleName && forcedByDefault && subtitle.forced && subtitle.lang === 'rus'),
    };
  });
}
