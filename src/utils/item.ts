import { ItemDetails, Season, Video, WatchingStatus } from 'api';

export function getItemVideoToPlay(item?: ItemDetails, episodeId?: string, seasonId?: string) {
  const video =
    item?.videos?.find(({ number, watching }) => (episodeId ? +episodeId === +number : watching.status !== WatchingStatus.Watched)) ||
    item?.videos?.[0];
  const season =
    item?.seasons?.find(({ number, watching }) => (seasonId ? +seasonId === +number : watching.status !== WatchingStatus.Watched)) ||
    item?.seasons?.[0];
  const episode =
    season?.episodes.find(({ number, watching }) => (episodeId ? +episodeId === +number : watching.status !== WatchingStatus.Watched)) ||
    season?.episodes[0];

  return [(video || episode)!, season] as const;
}

export function getItemTitle(item?: ItemDetails, video?: Video, season?: Season) {
  const title = item?.title || '';

  return season ? `${title} (s${season.number}e${video?.number || 1})` : title;
}

export function getItemDescription(item?: ItemDetails, video?: Video, season?: Season) {
  const title = video?.title || '';
  const episode = `s${season?.number || 1}e${video?.number || 1}`;

  return season ? (title ? `${title} (${episode})` : episode) : title;
}

export function getItemQualityIcon(item?: ItemDetails) {
  return item?.quality ? (item.quality === 2160 ? '4k' : item.quality === 1080 || item.quality === 720 ? 'hd' : 'sd') : null;
}
