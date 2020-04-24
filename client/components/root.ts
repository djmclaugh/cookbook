import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { recipeEndpoints } from '../../shared/api';
import { Recipe } from '../../shared/recipe';

import { simpleCall } from '../api_service';

const RootProps = Vue.extend({
  // No props
});

@Component
export default class RootComponent extends RootProps {
  // Data
  recipes: Recipe[]|null = null;

  // Computed
  // No computed

  // Methods
  // No methods

  // Hooks
  created() : void {
    simpleCall(recipeEndpoints.list).then((recipes: Recipe[]) => {
      this.recipes = recipes;
    });
  }

  render(): VNode {
    if (this.recipes) {
      return this.$createElement('span', `Found ${this.recipes.length} recipe(s)`);
    } else {
      return this.$createElement('span', 'Loading recipes...');
    }
  }
}
