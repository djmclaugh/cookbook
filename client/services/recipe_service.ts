import { recipeEndpoints } from '../../shared/endpoints/recipe_endpoints';
import { Recipe, RecipeDraft, RecipeWithIngredients } from '../../shared/entities/recipe';

import { call, simpleCall, callWithParams, callWithRequest } from './api_service';

export function listRecipes(): Promise<Recipe[]> {
  return simpleCall(recipeEndpoints.list);
}

export function createRecipe(draft: RecipeDraft): Promise<Recipe> {
  return callWithRequest(recipeEndpoints.create, draft);
}

export function getRecipe(recipeId: number): Promise<RecipeWithIngredients> {
  return callWithParams(recipeEndpoints.get, {recipeId: '' + recipeId});
}

export function updateRecipe(recipe: Recipe): Promise<Recipe> {
  return call(recipeEndpoints.update, {recipeId: '' + recipe.id}, recipe);
}

export function deleteRecipe(recipe: Recipe): Promise<undefined> {
  return callWithParams(recipeEndpoints.delete, {recipeId: '' + recipe.id});
}
