import {createElement} from '../render.js';

const createFilmsListElement = () => ('<section class="films-list"></section>');

export default class FilmsListView {
  #element;

  get #template() {
    return createFilmsListElement();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.#template);
    }

    return this.#element;
  }
}
