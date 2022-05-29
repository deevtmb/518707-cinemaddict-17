import {EMOTIONS, DateFormat} from '../utils/const.js';
import {getFormatedDate, getFormatedRuntime} from '../utils/common.js';
import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import he from 'he';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const createPopupTemplate = (film, comments) => {
  const {
    ageRating,
    poster,
    title,
    alternativeTitle,
    totalRating,
    director,
    writers,
    actors,
    genre,
    runtime,
    release,
    description
  } = film.filmInfo;
  const {watchlist, alreadyWatched, favorite} = film.userDetails;

  const filmComments = comments.filter((comment) => film.comments.includes(comment.id));

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="${title}">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${getFormatedDate(release.date, DateFormat.POPUP_RELEASE_DATE)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${getFormatedRuntime(runtime)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genre.length > 1 ? 'Genres' : 'Genre'}</td>
                  <td class="film-details__cell">
                    ${genre.map((it) => `<span class="film-details__genre">${it}</span>`).join('')}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlist ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button film-details__control-button--watched ${alreadyWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite ${favorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmComments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${filmComments.length === 0 ? '' : filmComments.map((filmComment) => `<li class="film-details__comment">
                  <span class="film-details__comment-emoji">
                    <img src="./images/emoji/${filmComment.emotion}.png" width="55" height="55" alt="emoji-${filmComment.emotion}">
                  </span>
                  <div>
                    <p class="film-details__comment-text">${he.encode(filmComment.comment)}</p>
                    <p class="film-details__comment-info">
                      <span class="film-details__comment-author">${filmComment.author}</span>
                      <span class="film-details__comment-day">${dayjs().to(filmComment.date)}</span>
                      <button class="film-details__comment-delete">Delete</button>
                    </p>
                  </div>
                </li>`).join('')}
            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
                <img class="visually-hidden" src="" width="55" height="55">
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${EMOTIONS.map((emoji) => `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
                  <label class="film-details__emoji-label" for="emoji-${emoji}">
                    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji-${emoji}">
                  </label>`).join('')}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class PopupView extends AbstractView {
  #film = null;
  #comments = null;
  #scrolTopValue = 0;

  constructor (film, comments) {
    super();
    this.#film = film;
    this.#comments = comments;
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupTemplate(this.#film, this.#comments);
  }

  get scrollTopValue () {
    return this.#scrolTopValue;
  }

  setClosePopupButtonHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn')
      .addEventListener('click', this.#closePopupButtonHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
  };

  setHistoryClickHandler = (callback) => {
    this._callback.historyClick = callback;
    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#historyClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  setDeleteCommentButtonHandler = (callback) => {
    this._callback.deleteComment = callback;
    this.element.querySelector('.film-details__comments-list')
      .addEventListener('click', this.#deleteCommentButtonHandler);
  };

  #deleteCommentButtonHandler = (evt) => {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    evt.preventDefault();
    this._callback.deleteComment(evt.target);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #historyClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.historyClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  #closePopupButtonHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #emojiChangeHandler = (evt) => {
    if (evt.target.tagName !== 'LABEL' && evt.target.tagName !== 'IMG') {
      return;
    }

    const commentEmoji = this.element.querySelector('.film-details__add-emoji-label img');
    commentEmoji.src = evt.target.tagName === 'IMG' ? evt.target.src : evt.target.firstElementChild.src;
    commentEmoji.alt = evt.target.tagName === 'IMG' ? evt.target.alt : evt.target.firstElementChild.alt;
    commentEmoji.classList.remove('visually-hidden');
  };

  #scrollPopupHandler = () => {
    this.#scrolTopValue = +this.element.scrollTop.toFixed();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiChangeHandler);
    this.element.addEventListener('scroll', this.#scrollPopupHandler);
  };
}
