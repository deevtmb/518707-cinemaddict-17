import {createElement} from '../render.js';

const createFilmsElement = () => ('<section class="films"></section>');

export default class FilmsView {
  getTemplate() {
    return createFilmsElement();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }
}
