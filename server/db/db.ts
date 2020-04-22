import { Entity, PrimaryColumn, Column, Connection, createConnection } from 'typeorm';

import { getConfig, Config } from '../config';
import Recipe from './recipe_model';

const dbConfig = getConfig().database;
let connection: Connection|null = null;

const callbacks: ((connection: Connection) => void)[] = [];

export function onConnect(cb: (connection: Connection) => void) {
  if (connection) {
    cb(connection);
  } else {
    callbacks.push(cb);
  }
}

createConnection({
  type: dbConfig.type,
  database: dbConfig.location,
  entities: [
    Recipe,
  ],
  synchronize: true,
}).then(c => {
  console.log(`Successfully connected to ${dbConfig.type} database at ${dbConfig.location}.`);
  connection = c;
  for (const cb of callbacks) {
    cb(connection);
  }
  callbacks.splice(0, callbacks.length);
}).catch(error => {
  console.log('Error connecting to database:');
  console.log(error);
});
