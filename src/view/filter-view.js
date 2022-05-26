import AbstractView from '../framework/view/abstract-view.js';
import {getFilteredFilms} from '../mock/filters.js';
import {FilterType} from '../utils/const.js';

const createFilterTemplate = (films) => {
  const filteredFilms = getFilteredFilms(films);

  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active" data-filter-type="${FilterType.ALL}">All movies</a>
      <a href="#watchlist" class="main-navigation__item" data-filter-type="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${filteredFilms.watchlist.length}</span></a>
      <a href="#history" class="main-navigation__item" data-filter-type="${FilterType.HISTORY}">History <span class="main-navigation__item-count">${filteredFilms.history.length}</span></a>
      <a href="#favorites" class="main-navigation__item" data-filter-type="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count">${filteredFilms.favorite.length}</span></a>
    </nav>`
  );
};

export default class FilterView extends AbstractView {
  #films = null;

  constructor (films) {
    super();
    this.#films = films;
  }

  get template() {
    return createFilterTemplate(this.#films);
  }

  setFilterChangeHandler = (callback) => {
    this._callback.filterChange = callback;
    this.element.addEventListener('click', this.#filterChangeHandler);
  };

  #filterChangeHandler = (evt) => {
    if (evt.target.tagName !== 'SPAN' && evt.target.tagName !== 'A') {
      return;
    }
    const targetElement = evt.target.tagName === 'A' ? evt.target : evt.target.parentElement;
    evt.preventDefault();
    this._callback.filterChange(targetElement.dataset.filterType);
  };
}
