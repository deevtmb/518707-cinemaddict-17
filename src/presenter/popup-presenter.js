import {render, remove, replace} from '../framework/render.js';
import {PopupState, UpdateType} from '../utils/const.js';
import PopupView from '../view/popup-view.js';

export default class PopupPresenter {
  #popupContainer = null;
  #popupComponent = null;
  #film = null;
  #changeData = null;
  #state = PopupState.HIDDEN;
  #filmId = null;

  constructor (popupContainer, changeData) {
    this.#popupContainer = popupContainer;
    this.#changeData = changeData;
  }

  get state () {
    return this.#state;
  }

  get filmId () {
    return this.#filmId;
  }

  init = (film) => {
    this.#film = film;
    this.#filmId = film.id;

    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(this.#film);

    this.#popupComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#popupComponent.setHistoryClickHandler(this.#onHistoryClick);
    this.#popupComponent.setFavoriteClickHandler(this.#onFavoriteClick);
    this.#popupComponent.setClosePopupButtonHandler(this.closePopup);
    document.addEventListener('keydown', this.#escKeyDownHandler);

    if (this.#state === PopupState.HIDDEN) {
      this.#popupContainer.classList.add('hide-overflow');
      render(this.#popupComponent, this.#popupContainer);
      this.#state = PopupState.OPEN;
      return;
    }

    replace(this.#popupComponent, prevPopupComponent);
    this.#popupComponent.element.scrollTop = prevPopupComponent.scrollTopValue;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.closePopup();
    }
  };

  #onWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#changeData(UpdateType.MINOR, this.#film);
  };

  #onHistoryClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#changeData(UpdateType.MINOR, this.#film);
  };

  #onFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#changeData(UpdateType.MINOR, this.#film);
  };

  closePopup = () => {
    if (this.#state !== PopupState.HIDDEN) {
      this.#popupContainer.classList.remove('hide-overflow');
      remove(this.#popupComponent);
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#state = PopupState.HIDDEN;
    }
  };
}
