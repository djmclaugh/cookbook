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
function identitySanitizer(x: any) {
  return x;
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

export const listRecipes: Endpoint<undefined, undefined, Recipe[]> = {
  path: '/recipes',
  verb: Verb.GET,
  sanitizeRequest: identitySanitizer,
  sanitizeResponse: arraySanitizer(sanitizeRecipe),
}

export const getRecipe: Endpoint<{recipeId: string}, undefined, Recipe> = {
  path: '/recipes/:recipeId',
  verb: Verb.GET,
  sanitizeRequest: identitySanitizer,
  sanitizeResponse: sanitizeRecipe,
}

export const createRecipe: Endpoint<undefined, RecipeDraft, Recipe> = {
  path: '/recipes',
  verb: Verb.POST,
  sanitizeRequest: sanitizeRecipeDraft,
  sanitizeResponse: sanitizeRecipe,
}
