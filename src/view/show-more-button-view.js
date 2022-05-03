import {createElement} from '../render.js';

const createShowMoreButtonTemplate = () => ('<button class="films-list__show-more">Show more</button>');

export default class ShowMoreButtonView {
  #element;

  get #template() {
    return createShowMoreButtonTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.#template);
    }

    return this.#element;
  }
}
