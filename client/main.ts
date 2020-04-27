import Vue from 'vue';
import VueRouter from 'vue-router';

import NotFoundPage from './pages/not_found_page';
import LandingPage from './pages/landing_page';
import RecipePage from './pages/recipe_page';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: LandingPage },
    { path: '/recipes/:recipeId', component: RecipePage },
    { path: '*', component: NotFoundPage },
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
