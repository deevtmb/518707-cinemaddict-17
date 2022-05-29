import {render, remove} from '../framework/render.js';
import {sortFilmsByRating, sortFilmsByDate} from '../utils/common.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmsView from '../view/no-films-view.js';
import FilmPresenter from './film-presenter.js';
import PopupPresenter from './popup-presenter.js';
import {SortType, UpdateType, PopupState, UserAction} from '../utils/const.js';
import {filter} from '../utils/filter.js';

const FILMS_PER_RENDER_AMOUNT = 5;

export default class BoardPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;

  #sortComponent = null;
  #showMoreButtonComponent = null;
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #noFilmsComponent = new NoFilmsView();
  #popupContainer = document.querySelector('body');

  #renderedFilmsCount = FILMS_PER_RENDER_AMOUNT;
  #currentSortType = SortType.DEFAULT;
  #popupPresenter = null;
  #filmPresenter = new Map();
  #filmsListContainerElement = this.#filmsListComponent.element.querySelector('.films-list__container');

  constructor (boardContainer, filmsModel, filterModel, commentsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;

    this.#popupPresenter = new PopupPresenter(this.#popupContainer, this.#handleViewAction, this.#commentsModel);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  get films () {
    const currentFilterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[currentFilterType](films);

    switch (this.#currentSortType) {
      case SortType.RATING:
        return filteredFilms.sort(sortFilmsByRating);
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsByDate);
    }
    return filteredFilms;
  }

  init = () => {
    this.#renderBoard();
  };

  #handleViewAction = (userAction, updateType, update) => {
    switch (userAction) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#updateFilmData(data);
        break;
      case UpdateType.MINOR:
        this.#updateFilmData(data);
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard(true);
        this.#renderBoard();
        break;
    }
  };

  #handleShowMoreButtonClick = () => {
    const filmsAmount = this.films.length;
    const currentRenderFilmsAmount = Math.min(filmsAmount, this.#renderedFilmsCount + FILMS_PER_RENDER_AMOUNT);
    const films = this.films.slice(this.#renderedFilmsCount, currentRenderFilmsAmount);

    this.#renderFilms(films);
    this.#renderedFilmsCount = currentRenderFilmsAmount;

    if (filmsAmount <= this.#renderedFilmsCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #updateFilmData = (film) => {
    if (this.#filmPresenter.get(film.id)){
      this.#filmPresenter.get(film.id).init(film);
    }
    if (this.#popupPresenter.state === PopupState.OPEN && film.id === this.#popupPresenter.filmId) {
      this.#popupPresenter.init(film);
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard(true);
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#boardContainer);
  };

  #renderPopup = (film) => {
    this.#popupPresenter.init(film);
  };

  #renderFilmCard = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsListContainerElement, this.#handleViewAction, () => this.#renderPopup(film));
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilmCard(film));
  };

  #renderNoFilms = () => {
    render(this.#noFilmsComponent, this.#filmsListComponent.element);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
  };

  #renderBoard = () => {
    const films = this.films;
    const filmsAmount = this.films.length;

    if (this.films.length){
      this.#renderSort();
    }
    render(this.#filmsComponent, this.#boardContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);

    if (!this.films.length) {
      this.#renderNoFilms();
      return;
    }

    this.#renderFilms(films.slice(0, Math.min(filmsAmount, this.#renderedFilmsCount)));

    if (filmsAmount > this.#renderedFilmsCount) {
      this.#renderShowMoreButton();
    }
  };

  #clearBoard = (resetRenderedFilmsCount = false) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#noFilmsComponent);

    if (resetRenderedFilmsCount) {
      this.#renderedFilmsCount = FILMS_PER_RENDER_AMOUNT;
    }
  };
}
