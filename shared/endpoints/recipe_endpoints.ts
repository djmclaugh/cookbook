import { arraySanitizer, identity } from '../util';

import {
  Recipe, RecipeDraft, RecipeWithIngredients,
  sanitizeRecipe, sanitizeRecipeDraft, sanitizeRecipeWithIngredients
} from '../entities/recipe';

import { Endpoint, Verb, simpleEndpoint } from './endpoints';

/**
 * Returns a list of all recipes.
 * Currently, no filter parameters are supported.
 */
const listRecipes: Endpoint<undefined, undefined, Recipe[]> = {
  path: '/recipes',
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
  path: '/recipes',
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
const getRecipe: Endpoint<{recipeId: string}, undefined, RecipeWithIngredients> = {
  path: '/recipes/:recipeId',
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
const updateRecipe: Endpoint<{recipeId: string}, RecipeDraft, Recipe> = {
  path: '/recipes/:recipeId',
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
const deleteRecipe: Endpoint<{recipeId: string}, undefined, undefined> = {
  path: '/recipes/:recipeId',
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
    simpleEndpoint('/recipes', Verb.PUT),
    simpleEndpoint('/recipes', Verb.DELETE),
    simpleEndpoint('/recipes/:recipeId', Verb.POST),
  ],
};
