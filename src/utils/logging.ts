import * as Sentry from '@sentry/browser';
import { Integrations as TracingIntegrations } from '@sentry/tracing';

import { APP_VERSION } from 'utils/app';

Sentry.init({
  release: APP_VERSION,
  dsn: 'https://d3a635962cb2440ca6754cdc6ff9af5b@o946544.ingest.sentry.io/5895550',
  integrations: [new TracingIntegrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

export function logError(message: string) {
  Sentry.captureMessage(message);
}

export function logException(exception: any) {
  Sentry.captureException(exception);
}
