import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { Recipe } from '../../shared/recipe';

import { getRecipe } from '../services/recipe_service';

const RecipePageProps = Vue.extend({
  // No props
});

@Component
export default class RecipePageComponent extends RecipePageProps {
  // Data
  recipe: Recipe|null = null;
  error: Error|null = null;

  // Computed
  get recipeId(): number {
    return Number.parseInt(this.$route.params.recipeId);
  }

  // Methods
  async fetchRecipe() {
    try {
      this.recipe = await getRecipe(this.recipeId);
    } catch(e) {
      this.error = e;
      throw e;
    }
    this.error = null;
  }

  // Hooks
  created() {
    this.fetchRecipe();
  }

  render(): VNode {
    const elements: VNode[] = [];

    if (this.error) {
      elements.push(this.$createElement('p', this.error.message));
    } else if (!this.recipe) {
      elements.push(this.$createElement('p', 'Loading...'));
    } else {
      elements.push(this.$createElement('h2', this.recipe.title));
    }

    return this.$createElement('div', elements);
  }
}
