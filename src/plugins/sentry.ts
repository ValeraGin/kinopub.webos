import * as Sentry from '@sentry/browser';
import { Integrations as TracingIntegrations } from '@sentry/tracing';

Sentry.init({
  dsn: 'https://d3a635962cb2440ca6754cdc6ff9af5b@o946544.ingest.sentry.io/5895550',
  integrations: [new TracingIntegrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});
