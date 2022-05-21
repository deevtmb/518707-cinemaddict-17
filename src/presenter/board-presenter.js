import {render, remove, createElement} from '../framework/render.js';
import {updateItem, sortFilmsByRating, sortFilmsByDate} from '../utils/common.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmsView from '../view/no-films-view.js';
import FilmPresenter from './film-presenter.js';
import PopupPresenter from './popup-presenter.js';
import {SortType, PopupState} from '../utils/const.js';

const FILMS_PER_RENDER_AMOUNT = 5;

export default class BoardPresenter {
  #boardContainer = null;
  #filmsModel = null;

  #sortComponent = new SortView();
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #noFilmsComponent = new NoFilmsView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #films = [];
  #sourcedFilms = [];
  #renderedFilmsCount = FILMS_PER_RENDER_AMOUNT;
  #currentSortType = SortType.DEFAULT;
  #popupPresenter = new Map();
  #filmPresenter = new Map();
  #filmsListContainerElement = createElement('<div class="films-list__container"></div>');

  constructor (boardContainer, filmsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#sourcedFilms = [...this.#filmsModel.films];
    this.#films = [...this.#filmsModel.films];
    this.#renderBoard();
  };

  #onFilmChange = (updatedFilm) => {
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
    this.#films = updateItem(this.#films, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
    if (this.#popupPresenter.get(updatedFilm.id).state !== PopupState.HIDDEN) {
      this.#popupPresenter.get(updatedFilm.id).init(updatedFilm);
    }
  };

  #onShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_PER_RENDER_AMOUNT);
    this.#renderedFilmsCount += FILMS_PER_RENDER_AMOUNT;

    if (this.#films.length <= this.#renderedFilmsCount) {
      remove(this.#showMoreButtonComponent);
    }
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

  #onChangeState = () => {
    this.#popupPresenter.forEach((presenter) => presenter.closePopup());
  };

  #renderFilmCard = (film) => {
    const popupPresenter = new PopupPresenter(document.querySelector('body'), this.#onFilmChange, this.#onChangeState);
    const filmPresenter = new FilmPresenter(this.#filmsListContainerElement, this.#onFilmChange, () => popupPresenter.init(film));

    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
    this.#popupPresenter.set(film.id, popupPresenter);
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
