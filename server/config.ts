export interface Config {
  port: number,
}

export function validateConfig(config: any): Config {
  if (!config.port || !Number.isInteger(config.port)) {
    throw new Error("A port number has to be specified. See config_default.json for an example");
  }
  const port: number = config.port;

  return {
    port: port,
  }
}
