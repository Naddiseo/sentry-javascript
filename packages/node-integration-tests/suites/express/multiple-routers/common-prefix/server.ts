import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import cors from 'cors';
import express from 'express';

const app = express();

Sentry.init({
  dsn: 'https://public@dsn.ingest.sentry.io/1337',
  release: '1.0',
  integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app })],
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(cors());

const APIv1 = express.Router();

APIv1.get('/test', function (_req, res) {
  Sentry.captureMessage('Custom Message');
  res.send('Success');
});

const root = express.Router();

app.use('/api', root);
app.use('/api/v1', APIv1);

app.use(Sentry.Handlers.errorHandler());

export default app;
