import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

import { router as recipeRouter } from './recipe_routes';
import { router as recipeIngredientsRouter } from './recipe_ingredients_routes';

export const router: Router = new Router({
  prefix: '/api',
});
router.use(bodyParser());
router.use(recipeRouter.routes());
router.use(recipeIngredientsRouter.routes());
