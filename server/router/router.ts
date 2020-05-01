import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

import { Endpoint, recipeEndpoints } from '../../shared/api';
import { QuantifiedIngredient, Recipe, RecipeDraft } from '../../shared/recipe';

import IngredientModel from '../db/ingredient_model';
import RecipeIngredientRelationModel from '../db/recipe_ingredient_relation_model';
import RecipeModel from '../db/recipe_model';

interface Result<T> {
  status: number,
  response?: T,
  errorMessage?: string,
}

const NO_CONTENT: Result<any> = { status: 204 }
const NOT_FOUND: Result<any> = { status: 404 }
const METHOD_NOT_ALLOWED: Result<any> = { status: 405}
const NOT_IMPLEMENTED: Result<any> = { status: 501 }

export const router: Router = new Router({
  prefix: '/api',
});
router.use(bodyParser());

// The types E(P|REQ|RES) stand for "extended params|request|response". They are needed to ensure
// covariance/contravariance.
function addEndpoint<P, REQ, RES, EP extends P, EREQ extends REQ, ERES extends RES>(
  endpoint: Endpoint<EP, EREQ, RES>,
  getResult: (params: P, request: REQ) => Promise<Result<ERES>>
): void {
  router[endpoint.verb](endpoint.path, async (ctx, next) => {
    let sanitizedRequest: EREQ;
    try {
      sanitizedRequest = endpoint.sanitizeRequest(ctx.request.body, 'request');
    } catch(e) {
      ctx.throw(400, 'Bad request: ' + e.message);
      return;
    }
    const result = await getResult(ctx.params, sanitizedRequest);
    if (result.status >= 200 && result.status < 300) {
      ctx.response.status = result.status;
      if (result.response) {
        // Response object should be of the correct type, but it might have additional properties
        // that should not be included in the repsonse. Sanitizing the response will guarantee that
        // only the desired propeties are returned.
        try {
          ctx.response.body = endpoint.sanitizeResponse(result.response, 'response');
        } catch (e) {
          console.log('Error encountered while trying to send response:');
          console.log(result.response);
          throw e;
        }
      }
    } else {
      if (result.errorMessage) {
        ctx.throw(result.status, result.errorMessage);
      } else {
        ctx.throw(result.status);
      }
    }
  });
}

addEndpoint(recipeEndpoints.list, async () => {
  const allRecipes = await RecipeModel.fetchAllRecipes();
  return {
    status: 200,
    response: allRecipes
  };
});

addEndpoint(recipeEndpoints.create, async (params: undefined, request: RecipeDraft) => {
  if (await RecipeModel.doesRecipeWithTitleExist(request.title)) {
    return {
      status: 409,
      errorMessage: `Recipe with title "${ request.title }" already exists.`
    };
  }
  const newRecipe = new RecipeModel();
  newRecipe.title = request.title;
  await newRecipe.save();
  return {
    status: 200,
    response: newRecipe,
  };
});

addEndpoint(recipeEndpoints.get, async (params: { recipeId: string }) => {
  const recipe = await RecipeModel.fetchRecipeById(Number.parseInt(params.recipeId));
  return !recipe ? NOT_FOUND : {
    status: 200,
    response: recipe,
  }
});

addEndpoint(recipeEndpoints.update, async (params: { recipeId: string }, request: RecipeDraft) => {
  const recipe = await RecipeModel.findOne(Number.parseInt(params.recipeId));
  if (!recipe) {
    return NOT_FOUND;
  }
  // Only title can be updated for now
  recipe.title = request.title;
  await recipe.save();
  return {
    status: 200,
    response: recipe,
  };
});

addEndpoint(recipeEndpoints.delete, async (params: { recipeId: string }) => {
  const recipe = await RecipeModel.findOne(Number.parseInt(params.recipeId));
  if (!recipe) {
    return NOT_FOUND;
  }
  await recipe.remove();
  return NO_CONTENT;
});

for (let endpoint of recipeEndpoints.methodNotAllowed) {
  addEndpoint(endpoint, async () => {
    return METHOD_NOT_ALLOWED;
  });
}
