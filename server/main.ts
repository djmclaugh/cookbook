import Koa from 'koa';
import send from 'koa-send';
import serve from 'koa-static';

import { getConfig, Config } from './config';
import { onConnect } from './db/db';
import { router } from './router/router';

const config: Config = getConfig();

// Start server
const app = new Koa();
app.use(serve('public'));
app.use(router.routes());
// Catch-all to support Vue's Router
app.use(async (ctx) => {
  await send(ctx, 'index.html', {root: 'public'});
});

onConnect(async () => {
  app.listen(config.port);
  console.log(`Started cookbook server on port ${ config.port }.`);
});
