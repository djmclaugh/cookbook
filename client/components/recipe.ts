import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { Recipe, isRecipe } from '../../shared/recipe';

const RecipeProps = Vue.extend({
  props: {
    recipe: {
      validator: isRecipe,
    },
  },
});

@Component
export default class RecipeComponent extends RecipeProps {
  // Data
  // No Data

  // Computed
  // No computed

  // Methods
  // No methods

  // Hooks
  render(): VNode {
    return this.$createElement('div', {
      class: {
        'recipe-card': true,
      }
    }, this.recipe.title);
  }
}
