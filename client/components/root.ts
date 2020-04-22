import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

const RootProps = Vue.extend({
  // No props
});

@Component
export default class RootComponent extends RootProps {
  // Data
  // No data

  // Computed
  // No computed

  // Methods
  // No methods

  // Hooks
  render(): VNode {
    return this.$createElement('span', 'Welcome!');
  }
}
