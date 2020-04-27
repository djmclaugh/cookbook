import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { Recipe } from '../../shared/recipe';

import { listRecipes, createRecipe } from '../services/recipe_service';
import RecipeCardComponent from '../components/recipe_card';

const LandingPageProps = Vue.extend({
  // No props
});

@Component({
  components: {
    recipe: RecipeCardComponent,
  },
})
export default class LandingPage extends LandingPageProps {
  // Data
  recipes: Recipe[]|null = null;

  // Computed
  get headerElement(): VNode {
    const elements: (VNode|string)[] = [];
    if (this.recipes) {
      elements.push(`Found ${this.recipes.length} recipe(s) - `);
      elements.push(this.$createElement('button', {
        on: {
          click: this.createNewRecipe
        },
      }, 'Create New Recipe'));
    } else {
      elements.push('Loading recipes...');
    }
    return this.$createElement('h2', elements);
  }

  get recipeElements(): VNode[] {
    if (!this.recipes) {
      return [];
    }
    return this.recipes.map((r) => {
      return this.$createElement('recipe', {
        key: r.id,
        props: {
          recipe: r,
        },
        on: {
          delete: this.onRecipeDelete,
          // Error most likely occured because of out of date data. Refetch the recipes.
          error: this.fetchRecipes,
        },
      });
    });
  }

  // Methods
  nextAvailableTitle(): string {
    let candidate = 'New Recipe';
    if (this.recipes === null) {
      return candidate;
    }
    if (!this.recipes.find((r) => r.title === candidate)) {
      return candidate;
    }
    let iteration = 2;
    while(this.recipes.find((r) => r.title === (candidate + ' ' + iteration))) {
      ++iteration;
    }
    return candidate + ' ' + iteration;
  }

  fetchRecipes(): void {
    listRecipes().then((recipes) => {
      this.recipes = recipes;
    });
  }

  async createNewRecipe(event: any) {
    event.target.disabled = true;
    const newRecipe = await createRecipe({ title: this.nextAvailableTitle() });
    event.target.disabled = false;
    this.recipes!.unshift(newRecipe);
  }

  onRecipeDelete(recipe: Recipe) {
    const index: number = this.recipes!.indexOf(recipe);
    if (index !== -1) {
      this.recipes!.splice(index, 1);
    }
  }

  // Hooks
  created() {
    this.fetchRecipes();
  }

  render(): VNode {
    const recipeContainer = this.$createElement('div', {
      class: {
        'recipe-container': true,
      }
    }, this.recipeElements);
    return this.$createElement('div', [this.headerElement, recipeContainer]);
  }
}
