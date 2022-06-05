import {render, remove, RenderPosition} from '../framework/render.js';
import {sortFilmsByRating, sortFilmsByDate, sortFilmsByCommentsAmount} from '../utils/common.js';
import {SortType, UpdateType, PopupState, UserAction, FilterType, ExtraFilmTitle} from '../utils/const.js';
import {filter} from '../utils/filter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmsView from '../view/no-films-view.js';
import ProfileView from '../view/profile-view.js';
import LoadingView from '../view/loading-view.js';
import FilmsTotalView from '../view/films-total-view.js';
import FilmPresenter from './film-presenter.js';
import PopupPresenter from './popup-presenter.js';

const FILMS_PER_RENDER_AMOUNT = 5;
const FILMS_LIST_EXTRA_AMOUNT = 2;

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;

  #profileComponent = null;
  #sortComponent = null;
  #showMoreButtonComponent = null;
  #noFilmsComponent = null;
  #filmsTotalComponent = null;
  #filmsComponent = new FilmsView();
  #loadingComponent = new LoadingView();

  #isExtraFilmsList = true;
  #isLoading = true;
  #allFilms = [];
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  #mainFilmsListComponent = new FilmsListView();
  #topRatedFilmsListComponent = new FilmsListView(this.#isExtraFilmsList, ExtraFilmTitle.TOP_RATED);
  #topCommentedFilmsListComponent = new FilmsListView(this.#isExtraFilmsList, ExtraFilmTitle.MOST_COMMENTED);

  #popupContainer = document.querySelector('body');
  #profileContainer = document.querySelector('.header');
  #filmsTotalContainer = document.querySelector('.footer__statistics');

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
    this.#allFilms = this.#filmsModel.films;
    if (this.#currentFilterType !== this.#filterModel.filter) {
      this.#currentSortType = SortType.DEFAULT;
    }

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
  };

  #handleViewAction = async (userAction, updateType, update) => {
    switch (userAction) {
      case UserAction.UPDATE_FILM:
        try {
          await this.#filmsModel.updateFilm(updateType, update.film);
        } catch (err) {
          update.presenter.setAbortingChange();
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#popupPresenter.setDeletingComment(update.comments);
        try {
          await this.#commentsModel.deleteComment(updateType, update);
        } catch (err) {
          this.#popupPresenter.setAbortingDelete(update.comments, update.index);
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#popupPresenter.setPostingComment();
        this.#uiBlocker.block();
        try {
          await this.#commentsModel.addComment(updateType, update);
          this.#uiBlocker.unblock();
        } catch (err) {
          this.#popupPresenter.setAbortingPost();
        }
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#renderProfile();
        this.#updateFilmData(data);
        break;
      case UpdateType.MINOR:
        this.#renderProfile();
        this.#clearMainBoard();
        this.#renderMainBoard();
        this.#updateFilmData(data);
        break;
      case UpdateType.MAJOR:
        this.#clearMainBoard({resetRenderedFilmsCount: true});
        this.#renderMainBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderProfile();
        this.#renderMainBoard();
        this.#renderExtraFilms();
        this.#renderFilmsTotal();
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

  #renderProfile = () => {
    if (this.#profileComponent) {
      remove(this.#profileComponent);
    }
    this.#profileComponent = new ProfileView(this.films);
    render(this.#profileComponent, this.#profileContainer);
  };

  #renderFilmsTotal = () => {
    this.#filmsTotalComponent = new FilmsTotalView(this.films);
    render(this.#filmsTotalComponent, this.#filmsTotalContainer);
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

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsComponent.element);
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
    const topRatedFilms = [...this.#allFilms].sort(sortFilmsByRating);
    const topCommentedFilms = [...this.#allFilms].sort(sortFilmsByCommentsAmount);

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
    if (this.films.length){
      this.#renderSort();
    }

    render(this.#filmsComponent, this.#boardContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const films = this.films;
    const filmsAmount = this.films.length;

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
    remove(this.#loadingComponent);
    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if (resetRenderedFilmsCount) {
      this.#renderedFilmsCount = FILMS_PER_RENDER_AMOUNT;
    }
  };
}
