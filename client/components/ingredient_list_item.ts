import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { QuantifiedIngredient, isSameQuantifiedIngredient } from '../../shared/entities/recipe';

const IngredientListItemProps = Vue.extend({
  props: {
    initialIngredient: Object,
    // Currently does nothing, needs to be implemented
    editable: Boolean,
  },
});

@Component
export default class IngredientListItemComponent extends IngredientListItemProps {
  // Data
  currentIngredient: QuantifiedIngredient = this.initialIngredient;

  // Computed
  get hasChanged(): boolean {
    return isSameQuantifiedIngredient(this.initialIngredient, this.currentIngredient);
  }

  // Methods
  quantityToString(): string {
    const i = this.currentIngredient
    let result = '';
    result += i.quantity.amount;
    if (i.quantity.amountDenominator !== 1) {
      result += `/${i.quantity.amountDenominator}`
    }
    if (i.quantity.modifiers.length > 0) {
      result += ' '
      result += i.quantity.modifiers.join(', ')
    }
    if (i.quantity.unit.length > 0) {
      result += ' '
      result += i.quantity.unit;
    }
    return result;
  }

  ingredientToString(): string {
    const i = this.currentIngredient
    let result = '';
    result += this.quantityToString();
    result += ' - ';
    result += i.ingredient.name;
    return result;
  }

  // Hooks
  render(): VNode {
    const elements: (VNode|string)[] = [];

    elements.push(this.ingredientToString());

    return this.$createElement('li', {
      class: {
        'ingredient-list-item': true,
        'has-changed': this.hasChanged,
      }
    }, elements);
  }
}
