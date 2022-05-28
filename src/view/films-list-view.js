import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListElement = () => ('<section class="films-list"><div class="films-list__container"></div></section>');

export default class FilmsListView extends AbstractView {
  get template() {
    return createFilmsListElement();
  }
}
