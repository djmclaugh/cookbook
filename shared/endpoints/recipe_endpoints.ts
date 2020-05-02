import { arraySanitizer, identity } from '../util';

import {
  Recipe, RecipeDraft, RecipeWithIngredients,
  sanitizeRecipe, sanitizeRecipeDraft, sanitizeRecipeWithIngredients
} from '../entities/recipe';

import { Endpoint, Verb, simpleEndpoint } from './endpoints';

// Path for the resource collection
export const COLLECTION_PATH = '/recipes'
// Path for one of the resource singletons
export const SINGLETON_PATH = COLLECTION_PATH + '/:recipeId'

// Parameters to specify which singleton to access
export interface SingletonParams {
  recipeId: string;
}

/**
 * Returns a list of all recipes.
 * Currently, no filter parameters are supported.
 */
const listRecipes: Endpoint<undefined, undefined, Recipe[]> = {
  path: COLLECTION_PATH,
  verb: Verb.GET,
  sanitizeRequest: identity,
  sanitizeResponse: arraySanitizer(sanitizeRecipe),
}

/**
 * Creates and returns a new recipe based on the data in the body of the request.
 *
 * Possible errors:
 * 409 - if the specified recipe as the same title as an existing one.
 */
const createRecipe: Endpoint<undefined, RecipeDraft, Recipe> = {
  path: COLLECTION_PATH,
  verb: Verb.POST,
  sanitizeRequest: sanitizeRecipeDraft,
  sanitizeResponse: sanitizeRecipe,
}

/**
 * Returns the recipe with the specified id.
 *
 * Possible errors:
 * 404 - if no recipe with the specified id exist.
 */
const getRecipe: Endpoint<SingletonParams, undefined, RecipeWithIngredients> = {
  path: SINGLETON_PATH,
  verb: Verb.GET,
  sanitizeRequest: identity,
  sanitizeResponse: sanitizeRecipeWithIngredients,
}

/**
 * Updates and returns the recipe with the specified id using the data in the request body.
 * Only properties of the recipe itself can be updated. To update the list of ingredents, the
 * "/recipes/:recipeId/ingredients" should be called instead.
 *
 * Possible errors:
 * 404 - if no recipe with the specified id exist.
 */
const updateRecipe: Endpoint<SingletonParams, RecipeDraft, Recipe> = {
  path: SINGLETON_PATH,
  verb: Verb.PUT,
  sanitizeRequest: sanitizeRecipeDraft,
  sanitizeResponse: sanitizeRecipe,
}

/**
 * Removes the specified recipe from the database and returns with satus 204 on success.
 *
 * Possible errors:
 * 404 - if no recipe with the specified id exist.
 */
const deleteRecipe: Endpoint<SingletonParams, undefined, undefined> = {
  path: SINGLETON_PATH,
  verb: Verb.DELETE,
  sanitizeRequest: identity,
  sanitizeResponse: identity,
}

// Collection of all endpoints related to recipes.
export const recipeEndpoints = {
  list: listRecipes,
  create: createRecipe,
  get: getRecipe,
  update: updateRecipe,
  delete: deleteRecipe,
  methodNotAllowed: [
    simpleEndpoint(COLLECTION_PATH, Verb.PUT),
    simpleEndpoint(COLLECTION_PATH, Verb.DELETE),
    simpleEndpoint(SINGLETON_PATH, Verb.POST),
  ],
};
