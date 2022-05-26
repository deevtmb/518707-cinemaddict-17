import {RenderPosition ,render, remove, createElement} from '../framework/render.js';
import {updateItem, sortFilmsByRating, sortFilmsByDate} from '../utils/common.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmsView from '../view/no-films-view.js';
import FilmPresenter from './film-presenter.js';
import PopupPresenter from './popup-presenter.js';
import {FilterType, SortType} from '../utils/const.js';

const FILMS_PER_RENDER_AMOUNT = 5;

export default class BoardPresenter {
  #boardContainer = null;
  #filmsModel = null;

  #filterComponent = null;
  #sortComponent = new SortView();
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #noFilmsComponent = new NoFilmsView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #popupContainer = document.querySelector('body');

  #films = [];
  #sourcedFilms = [];
  #renderedFilmsCount = FILMS_PER_RENDER_AMOUNT;
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.ALL;
  #popupPresenter = null;
  #filmPresenter = new Map();
  #filmsListContainerElement = createElement('<div class="films-list__container"></div>');

  constructor (boardContainer, filmsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#popupPresenter = new PopupPresenter(this.#popupContainer, this.#onFilmChange);
  }

  init = () => {
    this.#sourcedFilms = [...this.#filmsModel.films];
    this.#films = [...this.#filmsModel.films];
    this.#renderBoard();
  };

  #onFilmChange = (updatedFilm) => {
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
    this.#films = updateItem(this.#films, updatedFilm);
    this.#renderFilter(this.#sourcedFilms);

    if (document.querySelector('.film-details') && this.#popupPresenter.filmId === updatedFilm.id) {
      this.#popupPresenter.init(updatedFilm);
    }

    if (this.#currentFilterType !== FilterType.ALL) {
      this.#onFilterTypeChange(this.#currentFilterType);
      return;
    }
    if (this.#filmPresenter.get(updatedFilm.id)) {
      this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
    }
  };

  #onShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_PER_RENDER_AMOUNT);
    this.#renderedFilmsCount += FILMS_PER_RENDER_AMOUNT;

    if (this.#films.length <= this.#renderedFilmsCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #filterFilms = (filterType) => {
    this.#films = [...this.#sourcedFilms];
    this.#currentFilterType = filterType;

    switch (filterType) {
      case FilterType.WATCHLIST:
        return this.#films.filter((film) => film.userDetails.watchlist);
      case FilterType.HISTORY:
        return this.#films.filter((film) => film.userDetails.alreadyWatched);
      case FilterType.FAVORITES:
        return this.#films.filter((film) => film.userDetails.favorite);
      default:
        return [...this.#sourcedFilms];
    }
  };

  #onFilterTypeChange = (filterType) => {
    this.#films = this.#filterFilms(filterType);
    this.#filterComponent.element.querySelector('.main-navigation__item--active').classList.remove('main-navigation__item--active');
    this.#filterComponent.element.querySelector(`a[data-filter-type=${filterType}]`).classList.add('main-navigation__item--active');

    if (this.#currentSortType !== SortType.DEFAULT) {
      this.#sortFilms(this.#currentSortType);
    }

    this.#clearFilmsList();
    this.#renderFilmsList();
  };

  #renderFilter = (films) => {
    if (this.#filterComponent) {
      remove(this.#filterComponent);
    }
    this.#filterComponent = new FilterView(films);
    render(this.#filterComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
    this.#filterComponent.setFilterChangeHandler(this.#onFilterTypeChange);
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.RATING:
        this.#films.sort(sortFilmsByRating);
        break;
      case SortType.DATE:
        this.#films.sort(sortFilmsByDate);
        break;
      default:
        this.#films = [...this.#sourcedFilms];
    }
    this.#currentSortType = sortType;
  };

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortFilms(sortType);
    this.#clearFilmsList();
    this.#renderFilmsList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#boardContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#onSortTypeChange);
  };

  #renderFilmCard = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsListContainerElement, this.#onFilmChange, () => this.#popupPresenter.init(film));
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (from, to) => {
    this.#films.slice(from, to).forEach((film) => this.#renderFilmCard(film));
  };

  #renderFilmsList = () => {
    this.#filmsListComponent.element.appendChild(this.#filmsListContainerElement);
    this.#renderFilms(0, Math.min(this.#renderedFilmsCount, this.#films.length));

    if (this.#films.length > this.#renderedFilmsCount) {
      this.#renderShowMoreButton();
    }
  };

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmsCount = FILMS_PER_RENDER_AMOUNT;
    remove(this.#showMoreButtonComponent);
  };

  #renderNoFilms = () => {
    render(this.#noFilmsComponent, this.#filmsListComponent.element);
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClick);
  };

  #renderBoard = () => {
    this.#renderFilter(this.#sourcedFilms);

    if (this.#films.length){
      this.#renderSort();
    }
    render(this.#filmsComponent, this.#boardContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);

    if (!this.#films.length) {
      this.#renderNoFilms();
      return;
    }

    this.#renderFilmsList();
  };
}
