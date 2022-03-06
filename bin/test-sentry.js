import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

Sentry.init({
  dsn: "https://bf0bea5eaac64be2b43a47b0bb201701@o1157921.ingest.sentry.io/6240650",
  tracesSampleRate: 1.0,
  autoSessionTracking: true
});

console.log(Tracing);

const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
});

setTimeout(() => {
  try {
    foo();
  } catch (e) {
    Sentry.captureException(e);
  } finally {
    transaction.finish();
  }
}, 99);
