import {render, remove, replace} from '../framework/render.js';
import {PopupState, UpdateType, UserAction} from '../utils/const.js';
import PopupView from '../view/popup-view.js';

export default class PopupPresenter {
  #popupContainer = null;
  #popupComponent = null;

  #film = null;
  #filmId = null;
  #prevFilmId = null;
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

  init = async (film) => {
    if (this.#film) {
      this.#prevFilmId = this.#film.id;
    }

    this.#film = film;
    this.#filmId = film.id;
    await this.#commentsModel.init(film);
    this.#comments = this.#commentsModel.comments;

    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(this.#film, this.#comments);

    this.#popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
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

    if (this.#prevFilmId === this.#film.id) {
      this.#popupComponent.element.scrollTop = prevPopupComponent.scrollTopValue;
    }
  };

  #deleteComment = (target) => {
    const index = [...target.closest('.film-details__comments-list').children].findIndex((elem) => elem === target.closest('.film-details__comment'));
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {
        film: this.#film,
        comment: this.#comments[index],
        index: index,
      }
    );
  };

  #addComment = (evt) => {
    const commentText = this.#popupComponent.element.querySelector('textarea');
    const commentEmoji = this.#popupComponent.element.querySelector('.film-details__emoji-item:checked');
    if ((evt.metaKey || evt.ctrlKey) && evt.key === 'Enter') {
      evt.preventDefault();

      if (commentText.value && commentEmoji) {
        this.#changeData(
          UserAction.ADD_COMMENT,
          UpdateType.PATCH,
          {
            film: this.#film,
            comment: {
              comment: commentText.value,
              emotion: commentEmoji.value,
            }
          }
        );
      }
    }
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      this.#film
    );
  };

  #handleHistoryClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      this.#film
    );
  };

  #handleFavoriteClick = () => {
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
