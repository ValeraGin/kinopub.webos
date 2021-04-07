import { ItemDetails, Season, Video } from 'api';

export function getItemTitle(item?: ItemDetails, video?: Video, season?: Season) {
  return season ? `${item?.title} (s${season.number}e${video?.number || 1})` : item?.title!;
}
