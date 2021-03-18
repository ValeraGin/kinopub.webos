import { generatePath as baseGeneratePath } from 'react-router-dom';

export const PATHS = {
  Index: '/',
  Search: '/search',
  Watching: '/watching',
  Category: '/category/:categoryId',
  Channels: '/channels',
  Channel: '/channels/:channelId',
  Bookmarks: '/bookmarks',
  Bookmark: '/bookmarks/:bookmarkId',
  Collections: '/collections',
  Collection: '/collections/:collectionId',
  History: '/history',
  Item: '/item/:itemId',
  Video: '/video/:videoId',
  Trailer: '/trailer/:trailerId',
  Pair: '/pair',
  Settings: '/settings',
};

export type PathValuesType = typeof PATHS[keyof typeof PATHS];

export type RouteParams = {
  categoryId?: string;
  channelId?: string;
  collectionId?: string;
  bookmarkId?: string;
  itemId?: string;
  videoId?: string;
  trailerId?: string;
};

export function generatePath(pattern: PathValuesType, params?: RouteParams, search?: Record<string, string | number>) {
  // @ts-expect-error
  const query = search ? `?${new URLSearchParams(search)}` : '';

  return baseGeneratePath(pattern, params) + query;
}
