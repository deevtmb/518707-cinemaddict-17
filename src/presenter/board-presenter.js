import {render, remove, createElement} from '../framework/render.js';
import {updateItem} from '../utils/common.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmsView from '../view/no-films-view.js';
import FilmPresenter from './film-presenter.js';
import PopupPresenter from './popup-presenter.js';

const FILMS_PER_RENDER_AMOUNT = 5;
const POPUP_HIDDEN_STATE = 'HIDDEN';

export default class BoardPresenter {
  #boardContainer = null;
  #filmsModel = null;

  #sortComponent = new SortView();
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #noFilmsComponent = new NoFilmsView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #films = [];
  #renderedFilmsCount = FILMS_PER_RENDER_AMOUNT;
  #popupPresenter = new Map();
  #filmPresenter = new Map();
  #filmsListContainerElement = createElement('<div class="films-list__container"></div>');

  constructor (boardContainer, filmsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.films];
    this.#renderBoard();
  };

  #onFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
    if (this.#popupPresenter.get(updatedFilm.id).state !== POPUP_HIDDEN_STATE) {
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

  #renderSort = () => {
    render(this.#sortComponent, this.#boardContainer);
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
    this.#renderFilms(0, Math.min(FILMS_PER_RENDER_AMOUNT, this.#films.length));

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
