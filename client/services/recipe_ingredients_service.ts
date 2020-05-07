import { recipeIngredientsEndpoints as endpoints } from '../../shared/endpoints/recipe_ingredients_endpoints';
import { QuantifiedIngredient } from '../../shared/entities/recipe';

import { call, simpleCall, callWithParams, callWithRequest } from './api_service';

export function setIngredients(
  recipeId: number,
  ingredients: QuantifiedIngredient[]
): Promise<QuantifiedIngredient[]> {
  return call(endpoints.set, {recipeId: '' + recipeId}, ingredients);
}
