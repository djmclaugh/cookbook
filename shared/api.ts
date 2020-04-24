import { Recipe, RecipeDraft, sanitizeRecipeDraft, sanitizeRecipe } from './recipe';

export enum Verb {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export interface Endpoint<P, REQ, RES> {
  path: string,
  verb: Verb,
  sanitizeRequest: (request: any) => REQ,
  sanitizeResponse: (request: any) => RES,
}

// Useful for when there is no request or response types.
function identity(x: any) {
  return x;
}

function simpleEndpoint(path: string, verb: Verb): Endpoint<any, any, any> {
  return {
    path: path,
    verb: verb,
    sanitizeRequest: identity,
    sanitizeResponse: identity,
  };
}

function arraySanitizer<T>(itemSanitizer: (item: any) => T) {
  return (x: any) => {
    if (!Array.isArray(x)) {
      throw new Error('Expected an array');
    }
    return x.map((item: any) => {
      return itemSanitizer(item);
    });
  };
}

const listRecipes: Endpoint<undefined, undefined, Recipe[]> = {
  path: '/recipes',
  verb: Verb.GET,
  sanitizeRequest: identity,
  sanitizeResponse: arraySanitizer(sanitizeRecipe),
}

const createRecipe: Endpoint<undefined, RecipeDraft, Recipe> = {
  path: '/recipes',
  verb: Verb.POST,
  sanitizeRequest: sanitizeRecipeDraft,
  sanitizeResponse: sanitizeRecipe,
}

const getRecipe: Endpoint<{recipeId: string}, undefined, Recipe> = {
  path: '/recipes/:recipeId',
  verb: Verb.GET,
  sanitizeRequest: identity,
  sanitizeResponse: sanitizeRecipe,
}

const updateRecipe: Endpoint<{recipeId: string}, RecipeDraft, Recipe> = {
  path: '/recipes/:recipeId',
  verb: Verb.PUT,
  sanitizeRequest: sanitizeRecipeDraft,
  sanitizeResponse: sanitizeRecipe,
}

const deleteRecipe: Endpoint<{recipeId: string}, undefined, undefined> = {
  path: '/recipes/:recipeId',
  verb: Verb.DELETE,
  sanitizeRequest: identity,
  sanitizeResponse: identity,
}

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
