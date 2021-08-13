import { ExtractRouteParams } from 'react-router';
import { generatePath as baseGeneratePath } from 'react-router-dom';

export const PATHS = {
  Index: '/',
  Home: '/home',
  Search: '/search',
  Watching: '/watching/:watchingType?',
  Releases: '/releases/:releaseType?',
  Category: '/category/:categoryType',
  Genre: '/genres/:genreType',
  Channels: '/channels',
  Channel: '/channels/id:channelId',
  Bookmarks: '/bookmarks',
  Bookmark: '/bookmarks/id:bookmarkId',
  Collections: '/collections/:collectionType?',
  Collection: '/collections/id:collectionId',
  History: '/history',
  Item: '/item/id:itemId',
  Video: '/video/id:videoId',
  Trailer: '/trailer/id:trailerId',
  Pair: '/pair',
  Donate: '/donate',
  Speed: '/speed',
  Settings: '/settings',
};

export type PathValuesType = typeof PATHS[keyof typeof PATHS];

export type RouteParams = {
  channelId?: string;
  collectionId?: string;
  bookmarkId?: string;
  itemId?: string;
  videoId?: string;
  trailerId?: string;
  genreType?: string;
  releaseType?: string;
  categoryType?: string;
  watchingType?: string;
  collectionType?: string;
};

export function generatePath<S extends PathValuesType>(
  pattern: S,
  params?: ExtractRouteParams<S>,
  search?: Record<string, string> | string,
) {
  const query = search ? `?${new URLSearchParams(search)}` : '';

  return baseGeneratePath(pattern, params) + query;
}
