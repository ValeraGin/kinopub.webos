import { ItemDetails, Season, Video } from 'api';

export function getItemTitle(item?: ItemDetails, video?: Video, season?: Season) {
  const title = item?.title || '';

  return season ? `${title} (s${season.number}e${video?.number || 1})` : title;
}

export function getItemDescription(item?: ItemDetails, video?: Video, season?: Season) {
  const title = video?.title || '';

  return season ? `${title} (s${season.number}e${video?.number || 1})` : title;
}

export function getItemQualityIcon(item?: ItemDetails) {
  return item?.quality ? (item.quality === 2160 ? '4k' : item.quality === 1080 || item.quality === 720 ? 'hd' : 'sd') : null;
}
