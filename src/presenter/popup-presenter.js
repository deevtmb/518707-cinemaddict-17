import PopupView from '../view/popup-view.js';
import {render, remove, replace} from '../framework/render.js';
import {PopupState} from '../utils/const.js';

export default class PopupPresenter {
  #popupContainer = null;
  #popupComponent = null;
  #film = null;
  #changeData = null;
  #changeState = null;

  #state = PopupState.HIDDEN;

  constructor (popupContainer, changeData, changeState) {
    this.#popupContainer = popupContainer;
    this.#changeData = changeData;
    this.#changeState = changeState;
  }

  get state () {
    return this.#state;
  }

  init = (film) => {
    this.#film = film;

    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(this.#film);

    this.#popupComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#popupComponent.setHistoryClickHandler(this.#onHistoryClick);
    this.#popupComponent.setFavoriteClickHandler(this.#onFavoriteClick);
    this.#popupComponent.setClosePopupButtonHandler(this.closePopup);
    document.addEventListener('keydown', this.#escKeyDownHandler);

    if (this.#state === PopupState.HIDDEN) {
      this.#changeState();
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

  closePopup = () => {
    if (this.#state !== PopupState.HIDDEN) {
      this.#popupContainer.classList.remove('hide-overflow');
      remove(this.#popupComponent);
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#state = PopupState.HIDDEN;
    }
  };
}
