import { Sanitizer, arraySanitizer } from './util';
import { Recipe, RecipeDraft, sanitizeRecipe, sanitizeRecipeDraft } from './recipe';

/**
 * HTTP verbs used between the the back and front end.
 */
export enum Verb {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

/**
 * Bundle of information that describes the expected types for interactions between the back and
 * front end at the endpoint specified by the `path` and `verb`. The generics help catch error at
 * compile time. Sanitizers help catch errors at run time. Runtime errors can still happen even with
 * the compile time checks since the front and back ends might not be at the same verison. Runtime
 * errors can also happen if tools are used (like postman or browser developer tool) to interact
 * with either ends.
 *
 * P is the expected type for the request parameters - undefined if no parameters are expected
 * REQ is the expected type for the request body - undefined if no body is expected
 * RES is the expected type for the response body - undefined if no body is expected
 *
 * Each end point should also have an associated comment on the expected behaviour of the RPC and
 * should mention any potential reasons the RPC could fail (other than 400 for not conforming to
 * the enpoint specifications or 500 for unexpected server error).
 */
export interface Endpoint<P, REQ, RES> {
  path: string,
  verb: Verb,
  sanitizeRequest: Sanitizer<REQ>,
  sanitizeResponse: Sanitizer<RES>,
}

// Useful for when there is no request or response types.
function identity(x: any, name: string) {
  return x;
}

// Used to specify an endpoint with no parameters, request, nor response.
// Mostly used by unusable paths (i.e. 405 status).
function simpleEndpoint(path: string, verb: Verb): Endpoint<any, any, any> {
  return {
    path: path,
    verb: verb,
    sanitizeRequest: identity,
    sanitizeResponse: identity,
  };
}

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
const getRecipe: Endpoint<{recipeId: string}, undefined, Recipe> = {
  path: '/recipes/:recipeId',
  verb: Verb.GET,
  sanitizeRequest: identity,
  sanitizeResponse: sanitizeRecipe,
}

/**
 * Updates and returns the recipe with the specified id using the data in the request body.
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
