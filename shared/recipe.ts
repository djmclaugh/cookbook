import { arraySanitizer, isArray, sanitizePositiveInteger, sanitizeString } from './util';
import { Quantity, isQuantity, sanitizeQuantity } from './quantity';

export type QuantifiedIngredient = {
  quantity: Quantity,
  ingredient: {
    name: string
  },
}

export function isQuantifiedIngredient(x: any): x is QuantifiedIngredient {
  return isQuantity(x.quanity) && typeof x.ingredient.name === 'string';
}

export function sanitizeQuantifiedIngredient(x: any, name: string): QuantifiedIngredient {
  return {
    quantity: sanitizeQuantity(x.quantity, name + '.quanity'),
    ingredient: {
      name: sanitizeString(x.ingredient.name, name + '.ingredient.name'),
    },
  };
}

export interface RecipeDraft {
  title: string,
  ingredients: QuantifiedIngredient[],
}

export function isRecipeDraft(x: any): x is RecipeDraft {
  return typeof x.title === 'string' && isArray(x, isQuantifiedIngredient);
}

const sanitizeQuantifiedIngredientArray = arraySanitizer(sanitizeQuantifiedIngredient);

export function sanitizeRecipeDraft(x: any, name: string): RecipeDraft {
  return {
    title: sanitizeString(x.title, name + '.title'),
    ingredients: sanitizeQuantifiedIngredientArray(x.ingredients, name + '.ingredients'),
  };
}

export interface Recipe extends RecipeDraft {
  readonly id: number,
}

export function isRecipe(x: any): x is Recipe {
  return typeof x.id === 'number' && isRecipeDraft(x);
}

export function sanitizeRecipe(x: any, name: string): Recipe {
  const draft = sanitizeRecipeDraft(x, name);
  return {
    id: sanitizePositiveInteger(x.id, name + '.id'),
    title: draft.title,
    ingredients: draft.ingredients,
  };
}
