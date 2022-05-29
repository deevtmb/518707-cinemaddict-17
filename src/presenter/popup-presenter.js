import {render, remove, replace} from '../framework/render.js';
import {PopupState, UpdateType, UserAction} from '../utils/const.js';
import PopupView from '../view/popup-view.js';

export default class PopupPresenter {
  #popupContainer = null;
  #popupComponent = null;

  #film = null;
  #filmId = null;
  #comments = null;
  #commentsModel = null;
  #changeData = null;
  #state = PopupState.HIDDEN;

  constructor (popupContainer, changeData, commentsModel) {
    this.#popupContainer = popupContainer;
    this.#changeData = changeData;
    this.#commentsModel = commentsModel;
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
    this.#comments = this.#commentsModel.comments;

    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(this.#film, this.#comments);

    this.#popupComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#popupComponent.setHistoryClickHandler(this.#onHistoryClick);
    this.#popupComponent.setFavoriteClickHandler(this.#onFavoriteClick);
    this.#popupComponent.setClosePopupButtonHandler(this.#closePopup);
    this.#popupComponent.setDeleteCommentButtonHandler(this.#deleteComment);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.addEventListener('keydown', this.#addComment);

    if (this.#state === PopupState.HIDDEN) {
      this.#popupContainer.classList.add('hide-overflow');
      render(this.#popupComponent, this.#popupContainer);
      this.#state = PopupState.OPEN;
      return;
    }

    replace(this.#popupComponent, prevPopupComponent);
    this.#popupComponent.element.scrollTop = prevPopupComponent.scrollTopValue;
  };

  #deleteComment = (target) => {
    const index = [...target.closest('.film-details__comments-list').children].findIndex((elem) => elem === target.closest('.film-details__comment'));
    this.#film.comments.splice(index, 1);
    target.closest('.film-details__comment').remove();
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      this.#film
    );
  };

  #addComment = (evt) => {
    if ((evt.metaKey || evt.ctrlKey) && evt.key === 'Enter') {
      evt.preventDefault();
      this.#changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        {
          film: this.#film,
          comment: {
            id: -1,
            author: 'Author',
            comment: this.#popupComponent.element.querySelector('textarea').value,
            date: new Date(),
            emotion: this.#popupComponent.element.querySelector('.film-details__emoji-item:checked').value,
          }
        }
      );
    }
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #onWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      this.#film
    );
  };

  #onHistoryClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      this.#film
    );
  };

  #onFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      this.#film
    );
  };

  #closePopup = () => {
    if (this.#state !== PopupState.HIDDEN) {
      this.#popupContainer.classList.remove('hide-overflow');
      remove(this.#popupComponent);
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#state = PopupState.HIDDEN;
    }
  };
}
