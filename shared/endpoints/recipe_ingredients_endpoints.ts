import { arraySanitizer, identity } from '../util';

import {
  QuantifiedIngredient,
  sanitizeQuantifiedIngredient,
  sanitizeQuantifiedIngredientArray,
} from '../entities/recipe';

import { Endpoint, Verb, simpleEndpoint } from './endpoints';
import {
  SINGLETON_PATH as RECIPE_SINGLETON_PATH,
  SingletonParams as RecipeSingletonParams
} from './endpoints';

// Recipe ingredients are ingredients that are part of a specific recipe. The recipe must therefor
// be specified in the path.
export const COLLECTION_PATH = RECIPE_SINGLETON_PATH + '/ingredients'
export const SINGLETON_PATH = COLLECTION_PATH + '/:ingredientIndex'

export type CollectionParams = RecipeSingletonParams;

export interface SingletonParams extends CollectionParams {
  ingredientIndex: string,
}

const listIngredients: Endpoint<CollectionParams, undefined, QuantifiedIngredient[]> = {
  path: COLLECTION_PATH,
  verb: Verb.GET,
  sanitizeRequest: identity,
  sanitizeResponse: sanitizeQuantifiedIngredientArray,
}

const createIngredients: Endpoint<CollectionParams, QuantifiedIngredient[], QuantifiedIngredient[]> = {
  path: COLLECTION_PATH,
  verb: Verb.POST,
  sanitizeRequest: sanitizeQuantifiedIngredientArray,
  sanitizeResponse: sanitizeQuantifiedIngredientArray,
}

const setIngredients: Endpoint<CollectionParams, QuantifiedIngredient[], QuantifiedIngredient[]> = {
  path: COLLECTION_PATH,
  verb: Verb.POST,
  sanitizeRequest: sanitizeQuantifiedIngredientArray,
  sanitizeResponse: sanitizeQuantifiedIngredientArray,
}

const getIngredient: Endpoint<SingletonParams, undefined, QuantifiedIngredient> = {
  path: SINGLETON_PATH,
  verb: Verb.GET,
  sanitizeRequest: identity,
  sanitizeResponse: sanitizeQuantifiedIngredient,
}

const updateIngredient: Endpoint<SingletonParams, QuantifiedIngredient, QuantifiedIngredient> = {
  path: SINGLETON_PATH,
  verb: Verb.PUT,
  sanitizeResponse: sanitizeQuantifiedIngredient,
  sanitizeResponse: sanitizeQuantifiedIngredient,
}

const deleteIngredient: Endpoint<SingletonParams, undefined, undefined> = {
  path: SINGLETON_PATH,
  verb: Verb.DELETE,
  sanitizeRequest: identity,
  sanitizeResponse: identity,
}

// Collection of all endpoints related to recipes.
export const recipeEndpoints = {
  list: listIngredients,
  create: createIngredients,
  set: setIngredients,
  get: getIngredient,
  update: updateIngredient,
  delete: deleteIngredient,
  methodNotAllowed: [
    simpleEndpoint(COLLECTION_PATH, Verb.DELETE),
    simpleEndpoint(SINGLETON_PATH, Verb.POST),
  ],
};
