import {createElement} from '../render.js';

const createFilmsListElement = () => ('<section class="films-list"></section>');

export default class FilmsListView {
  getTemplate() {
    return createFilmsListElement();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }
}
