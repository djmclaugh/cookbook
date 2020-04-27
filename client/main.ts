import Vue from 'vue';
import VueRouter from 'vue-router';

import NotFoundPageComponent from './components/not_found_page';
import RootComponent from './components/root';
import RecipePageComponent from './components/recipe_page';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: RootComponent },
    { path: '/recipes/:recipeId', component: RecipePageComponent },
    { path: '*', component: NotFoundPageComponent },
  ],
});

const v = new Vue({
  el: '#app',
  router: router,
  render: function(createElement) {
    return createElement('router-view');
  },
});

if (!v) {
  console.log('Error while bootstrapping Vue');
}
