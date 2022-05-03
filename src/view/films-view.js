import {createElement} from '../render.js';

const createFilmsElement = () => ('<section class="films"></section>');

export default class FilmsView {
  #element;

  get #template() {
    return createFilmsElement();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.#template);
    }

    return this.#element;
  }
}
