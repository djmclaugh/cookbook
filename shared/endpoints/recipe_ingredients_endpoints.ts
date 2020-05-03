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
} from './recipe_endpoints';

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

const createIngredient: Endpoint<CollectionParams, QuantifiedIngredient, QuantifiedIngredient> = {
  path: COLLECTION_PATH,
  verb: Verb.POST,
  sanitizeRequest: sanitizeQuantifiedIngredient,
  sanitizeResponse: sanitizeQuantifiedIngredient,
}

const setIngredients: Endpoint<CollectionParams, QuantifiedIngredient[], QuantifiedIngredient[]> = {
  path: COLLECTION_PATH,
  verb: Verb.PUT,
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
  sanitizeRequest: sanitizeQuantifiedIngredient,
  sanitizeResponse: sanitizeQuantifiedIngredient,
}

// Collection of all endpoints related to recipes.
export const recipeIngredientsEndpoints = {
  list: listIngredients,
  create: createIngredient,
  set: setIngredients,
  get: getIngredient,
  update: updateIngredient,
  methodNotAllowed: [
    simpleEndpoint(COLLECTION_PATH, Verb.DELETE),
    simpleEndpoint(SINGLETON_PATH, Verb.POST),
    // Delete is not supported because the id of the ingredient is actually the index of the
    // ingredient in the recipe's ingredients array. Therefore calling delete on
    // /recipes/123/ingredients/0 twice will first delete the first element and then the element
    // that element that was originally second, but is now first. This is not idempotent.
    // To delete an ingredient, the put verb on the collection path can be used.
    simpleEndpoint(SINGLETON_PATH, Verb.DELETE),
  ],
};
