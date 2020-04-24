export interface ServerConfig {
  hostname: string,
  port: number,
}

export interface Config {
  server: ServerConfig,
}

function validateServerConfig(serverConfig: any): ServerConfig {
  if (typeof serverConfig.hostname !== 'string') {
    throw new Error('hostname for server needs to be specified');
  }
  const hostname: string = serverConfig.hostname;

  if (!serverConfig.port || !Number.isInteger(serverConfig.port)) {
    throw new Error('A port number for the server needs to be specified.');
  }
  const port: number = serverConfig.port;

  return {
    hostname: hostname,
    port: port,
  }
}

function validateConfig(config: any): Config {
  if (!config.server) {
    throw new Error('Server config has to be specified.');
  }

  return {
    server: validateServerConfig(config.server),
  }
}

// This assumes that a variable with the name cookbook_config has already been loaded within the
// <head> secion of the webpage.
declare const cookbook_config: any;
let chosenConfig: Config = validateConfig(cookbook_config);

export function getConfig(): Config {
  return Object.assign({}, chosenConfig);
}
