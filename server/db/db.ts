import { Entity, PrimaryColumn, Column, Connection, createConnection } from 'typeorm';

import { getConfig, Config } from '../config';

import IngredientModel from './ingredient_model';
import RecipeIngredientRelationModel from './recipe_ingredient_relation_model';
import RecipeModel from './recipe_model';

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
    IngredientModel,
    RecipeIngredientRelationModel,
    RecipeModel,
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
