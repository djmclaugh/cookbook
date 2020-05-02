import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { Recipe } from '../../shared/entities/recipe';

import { deleteRecipe } from '../services/recipe_service';

const RecipeCardProps = Vue.extend({
  props: {
    r: Object,
  },
});

@Component
export default class RecipeCardComponent extends RecipeCardProps {
  // Data
  // No Data

  // Computed
  get recipe(): Recipe {
    return this.r as Recipe;
  }

  get headerElement(): VNode {
    const elements: VNode[] = [];

    elements.push(this.$createElement('router-link', {
      props: {
        to: '/recipes/' + this.recipe.id,
      }
    }, [
      this.$createElement('h3', this.recipe.title),
    ]));
    elements.push(this.$createElement('button', {
      on: {
        click: this.onDeleteClick
      }
    }, 'Delete'));

    return this.$createElement('div', {
      class: {
        'recipe-header': true,
      }
    }, elements);
  }

  // Methods
  async onDeleteClick(event: any) {
    event.target.disabled = true;
    try {
      await deleteRecipe(this.recipe);
    } catch(e) {
      event.target.disabled = false;
      this.$emit('error', this.recipe, e);
      throw e;
    }
    this.$emit('delete', this.recipe);
  }

  // Hooks
  render(): VNode {
    const elements: VNode[] = [];

    elements.push(this.headerElement);
    elements.push(this.$createElement('p', 'This is one tasty recipe you won\'t forget!'));

    return this.$createElement('div', {
      class: {
        'recipe-card': true,
      }
    }, elements);
  }
}
