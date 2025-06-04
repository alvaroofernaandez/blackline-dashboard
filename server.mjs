import { startServer } from './dist/server/entry.mjs';

startServer({
  hostname: '0.0.0.0',
  port: 4321,
});
