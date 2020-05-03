import { arraySanitizer, sanitizePositiveInteger, sanitizeString } from '../util';

import { Quantity, sanitizeQuantity } from './quantity';

export type QuantifiedIngredient = {
  quantity: Quantity,
  ingredient: {
    name: string
  },
}

export function sanitizeQuantifiedIngredient(x: any, name: string): QuantifiedIngredient {
  if (x === undefined) {
    throw new Error(`Expected property "${name}" to not be of type QuantifiedIngredient`);
  }
  return {
    quantity: sanitizeQuantity(x.quantity, name + '.quanity'),
    ingredient: {
      name: sanitizeString(x.ingredient.name, name + '.ingredient.name'),
    },
  };
}

export interface RecipeDraft {
  title: string,
}

export const sanitizeQuantifiedIngredientArray = arraySanitizer(sanitizeQuantifiedIngredient);

export function sanitizeRecipeDraft(x: any, name: string): RecipeDraft {
  if (x === undefined) {
    throw new Error(`Expected property "${name}" to be of type RecipeDraft`);
  }
  return {
    title: sanitizeString(x.title, name + '.title'),
  };
}

export interface Recipe extends RecipeDraft {
  readonly id: number,
}

export function sanitizeRecipe(x: any, name: string): Recipe {
  const draft = sanitizeRecipeDraft(x, name);
  return {
    id: sanitizePositiveInteger(x.id, name + '.id'),
    title: draft.title,
  };
}

export interface RecipeWithIngredients extends Recipe {
  ingredients: QuantifiedIngredient[],
}

export function sanitizeRecipeWithIngredients(x: any, name: string): RecipeWithIngredients {
  const recipe = sanitizeRecipe(x, name);
  return {
    id: recipe.id,
    title: recipe.title,
    ingredients: sanitizeQuantifiedIngredientArray(x.ingredients, name + '.ingredients'),
  };
}
