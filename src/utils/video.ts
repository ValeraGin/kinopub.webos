import filter from 'lodash/filter';
import map from 'lodash/map';
import toUpper from 'lodash/toUpper';

import { Audio, Subtitle } from '../api';
import { AudioSetting, SourceSetting, SubtitleSetting } from '../components/player/settings';

export function mapAudios(audios: Audio[]): AudioSetting[] {
  return map(audios, (audio) => ({
    id: `${audio.index}`,
    lang: audio.lang,
    label: filter([
      audio.type?.title && audio.author?.title ? `${audio.type?.title}.` : audio.type?.title,
      audio.author?.title,
      audio.type?.title || audio.author?.title ? `(${toUpper(audio.lang)})` : toUpper(audio.lang),
      audio.codec !== 'aac' && toUpper(audio.codec),
    ]).join(' '),
  }));
}

export function mapSources(files: { url: string | { http: string; hls4?: string }; quality?: string }[]): SourceSetting[] {
  return map(files, (file) => ({
    src: typeof file.url === 'string' ? file.url : file.url.http,
    hls: typeof file.url !== 'string' ? file.url.hls4 : null,
    type: 'video/mp4',
    quality: file.quality,
  }));
}

export function mapSubtitles(subtitles: Subtitle[]): SubtitleSetting[] {
  return map(subtitles, (subtitle, idx) => ({
    id: `${subtitle.lang}_${idx}`,
    src: subtitle.url,
    lang: subtitle.lang,
    label: toUpper(subtitle.lang),
  }));
}
