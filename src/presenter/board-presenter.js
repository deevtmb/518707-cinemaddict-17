import {render, remove, RenderPosition} from '../framework/render.js';
import {sortFilmsByRating, sortFilmsByDate, sortFilmsByCommentsAmount} from '../utils/common.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmsView from '../view/no-films-view.js';
import FilmPresenter from './film-presenter.js';
import PopupPresenter from './popup-presenter.js';
import {SortType, UpdateType, PopupState, UserAction, FilterType, ExtraFilmTitle} from '../utils/const.js';
import {filter} from '../utils/filter.js';

const FILMS_PER_RENDER_AMOUNT = 5;
const FILMS_LIST_EXTRA_AMOUNT = 2;

export default class BoardPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;

  #sortComponent = null;
  #showMoreButtonComponent = null;
  #noFilmsComponent = null;
  #filmsComponent = new FilmsView();

  #isExtraFilmsList = true;
  #mainFilmsListComponent = new FilmsListView();
  #topRatedFilmsListComponent = new FilmsListView(this.#isExtraFilmsList, ExtraFilmTitle.TOP_RATED);
  #topCommentedFilmsListComponent = new FilmsListView(this.#isExtraFilmsList, ExtraFilmTitle.MOST_COMMENTED);

  #popupContainer = document.querySelector('body');

  #renderedFilmsCount = FILMS_PER_RENDER_AMOUNT;
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.ALL;
  #popupPresenter = null;
  #mainFilmPresenter = new Map();
  #topRatedFilmPresenter = new Map();
  #topCommentedFilmPresenter = new Map();

  constructor (boardContainer, filmsModel, filterModel, commentsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;

    this.#popupPresenter = new PopupPresenter(
      this.#popupContainer,
      this.#handleViewAction,
      this.#commentsModel
    );

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  get films () {
    this.#currentFilterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#currentFilterType](films);

    switch (this.#currentSortType) {
      case SortType.RATING:
        return filteredFilms.sort(sortFilmsByRating);
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsByDate);
    }
    return filteredFilms;
  }

  init = () => {
    this.#renderMainBoard();
    this.#renderExtraFilms();
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
        this.#clearMainBoard();
        this.#renderMainBoard();
        this.#updateFilmData(data);
        break;
      case UpdateType.MAJOR:
        this.#clearMainBoard({resetRenderedFilmsCount: true});
        this.#renderMainBoard();
        break;
    }
  };

  #handleShowMoreButtonClick = () => {
    const filmsAmount = this.films.length;
    const currentRenderFilmsAmount = Math.min(filmsAmount, this.#renderedFilmsCount + FILMS_PER_RENDER_AMOUNT);
    const films = this.films.slice(this.#renderedFilmsCount, currentRenderFilmsAmount);

    this.#renderFilmsList(films);
    this.#renderedFilmsCount = currentRenderFilmsAmount;

    if (filmsAmount <= this.#renderedFilmsCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #updateFilmData = (film) => {
    if (this.#mainFilmPresenter.get(film.id)){
      this.#mainFilmPresenter.get(film.id).init(film);
    }
    if (this.#popupPresenter.state === PopupState.OPEN && film.id === this.#popupPresenter.filmId) {
      this.#popupPresenter.init(film);
    }
    if (this.#topRatedFilmPresenter.get(film.id) || this.#topCommentedFilmPresenter.get(film.id)){
      this.#renderExtraFilms();
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearMainBoard({resetRenderedFilmsCount: true});
    this.#renderMainBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#boardContainer);
  };

  #renderPopup = (film) => {
    this.#popupPresenter.init(film);
  };

  #renderFilmCard = (film, filmsListContainer, filmPresenterMap) => {
    const filmPresenter = new FilmPresenter(
      filmsListContainer,
      this.#handleViewAction,
      () => this.#renderPopup(film)
    );

    filmPresenter.init(film);
    filmPresenterMap.set(film.id, filmPresenter);
  };

  #renderFilms = (films, filmsListComponent, filmPresenterMap) => {
    films.forEach((film) => this.#renderFilmCard(film, filmsListComponent, filmPresenterMap));
  };

  #renderFilmsList = (
    films,
    filmsListComponent = this.#mainFilmsListComponent,
    filmPresenterMap = this.#mainFilmPresenter,
    renderPosition = RenderPosition.AFTERBEGIN
  ) => {
    const filmsListContainer = filmsListComponent.element.querySelector('.films-list__container');
    render(filmsListComponent, this.#filmsComponent.element, renderPosition);
    this.#renderFilms(films, filmsListContainer, filmPresenterMap);
  };

  #renderNoFilms = () => {
    this.#noFilmsComponent = new NoFilmsView(this.#currentFilterType);
    render(this.#noFilmsComponent, this.#mainFilmsListComponent.element);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    render(this.#showMoreButtonComponent, this.#mainFilmsListComponent.element);
  };

  #clearFilmPresenter = (filmPresenter) => {
    filmPresenter.forEach((presenter) => presenter.destroy());
    filmPresenter.clear();
  };

  #renderExtraFilms = () => {
    const topRatedFilms = [...this.films].sort(sortFilmsByRating);
    const topCommentedFilms = [...this.films].sort(sortFilmsByCommentsAmount);

    if (topRatedFilms.some((film) => film.filmInfo.totalRating)){
      this.#clearFilmPresenter(this.#topRatedFilmPresenter);

      this.#renderFilmsList(
        topRatedFilms.slice(0, FILMS_LIST_EXTRA_AMOUNT),
        this.#topRatedFilmsListComponent,
        this.#topRatedFilmPresenter,
        RenderPosition.BEFOREEND
      );
    }

    if (topCommentedFilms.some((film) => film.comments.length)) {
      this.#clearFilmPresenter(this.#topCommentedFilmPresenter);

      this.#renderFilmsList(
        topCommentedFilms.slice(0, FILMS_LIST_EXTRA_AMOUNT),
        this.#topCommentedFilmsListComponent,
        this.#topCommentedFilmPresenter,
        RenderPosition.BEFOREEND
      );
    }
  };

  #renderMainBoard = () => {
    const films = this.films;
    const filmsAmount = this.films.length;

    if (this.films.length){
      this.#renderSort();
    }

    render(this.#filmsComponent, this.#boardContainer);

    if (!this.films.length) {
      this.#renderNoFilms();
      return;
    }

    this.#renderFilmsList(
      films.slice(0, Math.min(filmsAmount, this.#renderedFilmsCount)),
      this.#mainFilmsListComponent,
      this.#mainFilmPresenter
    );

    if (filmsAmount > this.#renderedFilmsCount) {
      this.#renderShowMoreButton();
    }
  };

  #clearMainBoard = ({resetRenderedFilmsCount = false} = {}) => {
    this.#clearFilmPresenter(this.#mainFilmPresenter);

    remove(this.#sortComponent);
    remove(this.#showMoreButtonComponent);
    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if (resetRenderedFilmsCount) {
      this.#renderedFilmsCount = FILMS_PER_RENDER_AMOUNT;
    }
  };
}
