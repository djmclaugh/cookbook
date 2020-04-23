import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

import { Endpoint, listRecipes, getRecipe, createRecipe } from '../../shared/api';
import { Recipe, RecipeDraft } from '../../shared/recipe';

export const router: Router = new Router();
router.use(bodyParser());

// The types E(P|REQ|RES) stands for "extended params|request|response". They are needed to ensure
// covariance/contravariance.
function addEndpoint<P, REQ, RES, EP extends P, EREQ extends REQ, ERES extends RES>(
  endpoint: Endpoint<EP, EREQ, RES>,
  getResponse: (params: P, request: REQ) => ERES
): void {
  router[endpoint.verb](endpoint.path, (ctx, next) => {
    let sanitizedRequest;
    try {
      sanitizedRequest = endpoint.sanitizeRequest(ctx.request.body);
    } catch(e) {
      ctx.throw(400, 'Bad request: ' + e.message);
      return;
    }
    ctx.response.body = getResponse(ctx.params, sanitizedRequest);
  });
}

addEndpoint(listRecipes, () => {
  return [{
    id: 123,
    title: 'test',
  }];
});

addEndpoint(getRecipe, (params: { recipeId: string }) => {
  return {
    id: Number.parseInt(params.recipeId),
    title: 'recipe ' + params.recipeId,
  };
});

addEndpoint(createRecipe, (params: undefined, request: RecipeDraft) => {
  return {
   id: Math.floor(Math.random() * 1000),
   title: request.title,
  };
});
