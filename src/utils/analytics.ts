import type { Metric } from 'web-vitals';

export function sendWebVitalsToGoogleAnalytics({ name, delta, value, id }: Metric) {
  // Assumes the global `gtag()` function exists, see:
  // https://developers.google.com/analytics/devguides/collection/ga4
  gtag?.('event', name, {
    // Built-in params:
    value: delta, // Use `delta` so the value can be summed.
    // Custom params:
    metric_id: id, // Needed to aggregate events.
    metric_value: value, // Optional.
    metric_delta: delta, // Optional.

    // OPTIONAL: any additional params or debug info here.
    // See: https://web.dev/debug-web-vitals-in-the-field/
    // metric_rating: 'good' | 'ni' | 'poor',
    // debug_info: '...',
    // ...
  });
}
