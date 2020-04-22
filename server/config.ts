interface DatabaseConfig {
  // All databases that TypeORM support could be supported, but right now, only the sqlite module
  // is added as a dependency.
  type: 'sqlite',
  location: string,
}

export interface Config {
  port: number,
  database: DatabaseConfig,
}

let configPath: string;
if (process.argv.length == 2) {
  console.log("No config file specified. Using 'config_default.json'.");
  configPath = "./config_default.json";
} else {
  configPath = "./" + process.argv[2];
}
console.log("Loading configuration from '" + configPath + "'.");
const chosenConfig = validateConfig(require(configPath));

function validateDatabase(dbConfig: any): DatabaseConfig {
  if (dbConfig.type !== 'sqlite') {
    throw new Error('Database type has to be "sqlite"');
  }
  const type = 'sqlite';

  if (!dbConfig.location || typeof(dbConfig.location) !== 'string') {
    throw new Error('Path to database file must be specified.');
  }
  const location: string = dbConfig.location;

  return {
    type: type,
    location: location
  }
}

function validateConfig(config: any): Config {
  if (!config.port || !Number.isInteger(config.port)) {
    throw new Error("A port number has to be specified. See config_default.json for an example.");
  }
  const port: number = config.port;

  if (!config.database) {
    throw new Error("Database config has to be specified. See config_default.json for an example.");
  }

  return {
    port: port,
    database: validateDatabase(config.database),
  }
}

export function getConfig(): Config {
  return Object.assign({}, chosenConfig);
}
