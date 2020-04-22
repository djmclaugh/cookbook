import Koa from 'koa';
import serve from 'koa-static';

import { getConfig, Config } from './config';
import { onConnect } from './db/db';

const config: Config = getConfig();

// Start server
const app = new Koa();
app.use(serve('public'));
app.listen(config.port);
console.log(`Started cookbook server on port ${ config.port }.`);

onConnect(() => {});
