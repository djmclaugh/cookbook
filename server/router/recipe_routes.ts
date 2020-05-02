import { recipeEndpoints, SingletonParams } from '../../shared/endpoints/recipe_endpoints';
import { QuantifiedIngredient, Recipe, RecipeDraft } from '../../shared/entities/recipe';

import IngredientModel from '../db/ingredient_model';
import RecipeIngredientRelationModel from '../db/recipe_ingredient_relation_model';
import RecipeModel from '../db/recipe_model';

import {
  EndpointRouter,
  Result,
  METHOD_NOT_ALLOWED,
  NOT_FOUND,
  NO_CONTENT
} from './endpoint_router';

export const router = new EndpointRouter();

router.addEndpoint(recipeEndpoints.list, async () => {
  const allRecipes = await RecipeModel.fetchAllRecipes();
  return {
    status: 200,
    response: allRecipes
  };
});

router.addEndpoint(recipeEndpoints.create, async (params: undefined, req: RecipeDraft) => {
  if (await RecipeModel.doesRecipeWithTitleExist(req.title)) {
    return {
      status: 409,
      errorMessage: `Recipe with title "${ req.title }" already exists.`
    };
  }
  const newRecipe = new RecipeModel();
  newRecipe.title = req.title;
  await newRecipe.save();
  return {
    status: 200,
    response: newRecipe,
  };
});

router.addEndpoint(recipeEndpoints.get, async (params: SingletonParams) => {
  const recipe = await RecipeModel.fetchRecipeById(Number.parseInt(params.recipeId));
  return !recipe ? NOT_FOUND : {
    status: 200,
    response: recipe,
  }
});

router.addEndpoint(recipeEndpoints.update, async (params: SingletonParams, req: RecipeDraft) => {
  const recipe = await RecipeModel.findOne(Number.parseInt(params.recipeId));
  if (!recipe) {
    return NOT_FOUND;
  }
  // Only title can be updated for now
  recipe.title = req.title;
  await recipe.save();
  return {
    status: 200,
    response: recipe,
  };
});

router.addEndpoint(recipeEndpoints.delete, async (params: SingletonParams) => {
  const recipe = await RecipeModel.findOne(Number.parseInt(params.recipeId));
  if (!recipe) {
    return NOT_FOUND;
  }
  await recipe.remove();
  return NO_CONTENT;
});

for (let endpoint of recipeEndpoints.methodNotAllowed) {
  router.addEndpoint(endpoint, async () => {
    return METHOD_NOT_ALLOWED;
  });
}
