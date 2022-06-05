import {render, replace, remove} from '../framework/render.js';
import {UpdateType, UserAction} from '../utils/const.js';
import FilmCardView from '../view/film-card-view.js';

export default class FilmPresenter {
  #filmListContainer = null;
  #filmCardComponent = null;
  #changeData = null;
  #film = null;
  #popupCallback = null;

  constructor (filmListContainer, changeData, popupCallback) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#popupCallback = popupCallback;
  }

  init = (film) => {
    this.#film = film;
    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(this.#film);
    this.#filmCardComponent.setClickHandler(this.#popupCallback);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCardComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmCardComponent === null) {
      render(this.#filmCardComponent, this.#filmListContainer);
      return;
    }

    if (this.#filmListContainer.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  };

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        film: this.#film,
        presenter: this,
      }
    );
  };

  #handleHistoryClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        film: this.#film,
        presenter: this,
      }
    );
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        film: this.#film,
        presenter: this,
      }
    );
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };

  setAbortingChange = () => {
    const elem = this.#filmCardComponent.element.querySelector('.film-card__controls');
    this.#filmCardComponent.shakeElement(elem);
  };
}
