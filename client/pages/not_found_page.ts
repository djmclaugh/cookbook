import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

const NotFoundPageProps = Vue.extend({
  // No props
});

@Component
export default class NotFoundPage extends NotFoundPageProps {
  // Data
  // No Data

  // Computed
  // No Computed

  // Methods
  // No Methods

  // Hooks
  render(): VNode {
    return this.$createElement('div', '404 - not found');
  }
}
