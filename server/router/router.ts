import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

import { Endpoint, recipeEndpoints } from '../../shared/api';
import { Recipe, RecipeDraft } from '../../shared/recipe';

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

// The types E(P|REQ|RES) stands for "extended params|request|response". They are needed to ensure
// covariance/contravariance.
function addEndpoint<P, REQ, RES, EP extends P, EREQ extends REQ, ERES extends RES>(
  endpoint: Endpoint<EP, EREQ, RES>,
  getResult: (params: P, request: REQ) => Promise<Result<ERES>>
): void {
  router[endpoint.verb](endpoint.path, async (ctx, next) => {
    let sanitizedRequest;
    try {
      sanitizedRequest = endpoint.sanitizeRequest(ctx.request.body);
    } catch(e) {
      ctx.throw(400, 'Bad request: ' + e.message);
      return;
    }
    const result = await getResult(ctx.params, sanitizedRequest);
    if (result.status >= 200 && result.status < 300) {
      ctx.response.status = result.status;
      if (result.response) {
        // Response object should be of the correct type, but it might have additional properties
        // that should not be included in the repsonse. Sanitizing the response will guarentee that
        // only the desired propeties are returned.
        ctx.response.body = endpoint.sanitizeResponse(result.response);
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
  const allRecipes = await RecipeModel.find();
  return {
    status: 200,
    response: allRecipes
  };
});

addEndpoint(recipeEndpoints.create, async (params: undefined, request: RecipeDraft) => {
  const recipeWithSameName = await RecipeModel.findOne({title: request.title});
  if (recipeWithSameName) {
    return {
      status: 409,
      errorMessage: `Recipe with title "${ request.title }" already exists.`
    };
  }
  const newRecipe = new RecipeModel();
  Object.assign(newRecipe, request);
  await newRecipe.save();
  return {
    status: 200,
    response: newRecipe,
  };
});

addEndpoint(recipeEndpoints.get, async (params: { recipeId: string }) => {
  const recipe = await RecipeModel.findOne(Number.parseInt(params.recipeId));
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
  Object.assign(recipe, request);
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
