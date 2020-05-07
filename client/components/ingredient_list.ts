import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { QuantifiedIngredient } from '../../shared/entities/recipe';

import IngredientListItemComponent from './ingredient_list_item';

const RecipeCardProps = Vue.extend({
  props: {
    recipeId: Number,
    list: Array,
  },
});

@Component({
  components: {
    ingredientListItem: IngredientListItemComponent,
  },
})
export default class RecipeCardComponent extends RecipeCardProps {
  // Data
  isEditing: boolean = false;

  // Computed
  get ingredientList(): QuantifiedIngredient[] {
    return this.list as QuantifiedIngredient[];
  }

  // Methods
  createListElement(): VNode {
    const items: VNode[] = [];

    for (let ingredient of this.ingredientList) {
      items.push(this.$createElement('ingredientListItem', {
        props: {
          initialIngredient: ingredient,
          editable: this.isEditing,
        },
      }));
    }

    return this.$createElement('ul', {
      class: {
        'ingredients-list': true,
      }
    }, items);
  }

  // Hooks
  render(): VNode {
    const header: VNode = this.$createElement('h3', 'Ingredients');

    return this.$createElement('div', {
      class: {
        'ingredients-section': true,
      }
    }, [header, this.createListElement()]);
  }
}
