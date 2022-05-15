import {render, replace, remove} from '../framework/render.js';
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
    this.#filmCardComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#filmCardComponent.setHistoryClickHandler(this.#onHistoryClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#onFavoriteClick);

    if (prevFilmCardComponent === null) {
      render(this.#filmCardComponent, this.#filmListContainer);
      return;
    }

    if (this.#filmListContainer.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  };

  #onWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#changeData(this.#film);
  };

  #onHistoryClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#changeData(this.#film);
  };

  #onFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#changeData(this.#film);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };
}
