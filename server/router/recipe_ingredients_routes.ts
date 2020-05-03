import {
  CollectionParams,
  SingletonParams,
  recipeIngredientsEndpoints as endpoints,
} from '../../shared/endpoints/recipe_ingredients_endpoints';
import { QuantifiedIngredient } from '../../shared/entities/recipe';

import RecipeIngredientRelationModel from '../db/recipe_ingredient_relation_model';
import RecipeModel from '../db/recipe_model';

import {
  EndpointRouter,
  Result,
  METHOD_NOT_ALLOWED,
  NOT_FOUND,
} from './endpoint_router';

export const router = new EndpointRouter();

router.addEndpoint(endpoints.list, async (params: CollectionParams) => {
  const recipeId = Number.parseInt(params.recipeId);
  const allIngredients = await RecipeIngredientRelationModel.fetchIngredientsForRecipe(recipeId);
  return {
    status: 200,
    response: allIngredients
  };
});

router.addEndpoint(endpoints.create, async (params: CollectionParams, req: QuantifiedIngredient) => {
  const recipe = await RecipeModel.fetchRecipeById(Number.parseInt(params.recipeId));
  if (!recipe) {
    return NOT_FOUND;
  }
  const newIngredient = await RecipeIngredientRelationModel.newModel(req);
  recipe.ingredients.push(newIngredient);
  await recipe.save();
  return {
    status: 200,
    response: newIngredient,
  };
});

router.addEndpoint(endpoints.set, async (params: CollectionParams, req: QuantifiedIngredient[]) => {
  const recipe = await RecipeModel.fetchRecipeById(Number.parseInt(params.recipeId));
  if (!recipe) {
    return NOT_FOUND;
  }
  const newIngredients = await RecipeIngredientRelationModel.newModels(req);
  recipe.ingredients = newIngredients;
  await recipe.save();
  return {
    status: 200,
    response: newIngredients,
  };
});

router.addEndpoint(endpoints.get, async (params: SingletonParams) => {
  const ingredient = await RecipeIngredientRelationModel.findOne({where: {
    recipe: {id: Number.parseInt(params.recipeId)},
    index: Number.parseInt(params.ingredientIndex),
  }});
  return !ingredient ? NOT_FOUND : {
    status: 200,
    response: ingredient,
  }
});

router.addEndpoint(endpoints.update, async (params: SingletonParams, req: QuantifiedIngredient) => {
  const index = Number.parseInt(params.ingredientIndex);
  const recipe = await RecipeModel.fetchRecipeById(Number.parseInt(params.recipeId));
  if (!recipe || recipe.ingredients.length <= index) {
    return NOT_FOUND;
  }
  const newIngredient = await RecipeIngredientRelationModel.newModel(req);
  recipe.ingredients[index] = newIngredient;
  await recipe.save();
  return {
    status: 200,
    response: newIngredient,
  };
});

for (let endpoint of endpoints.methodNotAllowed) {
  router.addEndpoint(endpoint, async () => {
    return METHOD_NOT_ALLOWED;
  });
}
