import Koa from 'koa';
import serve from 'koa-static';

import { Config, validateConfig } from './config';

// Load configs
let configPath: string;
if (process.argv.length == 2) {
  console.log("No config file specified. Using 'config_default.json'");
  configPath = "./config_default.json";
} else {
  configPath = "./" + process.argv[2];
  console.log("Loading configuration from '" + process.argv[2] + "'");
}
const config: Config = validateConfig(require(configPath));

// Start server
const app = new Koa();
app.use(serve('public'));
app.listen(config.port);
console.log(`Started cookbook server on port ${ config.port }`);
