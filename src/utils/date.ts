import formatDuration from 'format-duration';

export function secondsToDuration(seconds?: number) {
  return formatDuration((seconds || 0) * 1000, { leading: true });
}
