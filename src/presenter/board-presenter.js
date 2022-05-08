import {render, createElement} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmsView from '../view/no-films-view.js';

const FILMS_PER_RENDER_AMOUNT = 5;

export default class BoardPresenter {
  #boardContainer = null;
  #filmsModel = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #films = [];
  #renderedFilmsCount = FILMS_PER_RENDER_AMOUNT;
  #filmsListContainerElement = createElement('<div class="films-list__container"></div>');


  constructor (boardContainer, filmsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.films];

    this.#renderBoard();
  };

  #onShowMoreButtonClick = () => {
    this.#films
      .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_PER_RENDER_AMOUNT)
      .forEach((film) => this.#renderFilmCard(film));
    this.#renderedFilmsCount += FILMS_PER_RENDER_AMOUNT;

    if (this.#films.length <= this.#renderedFilmsCount) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

  #renderFilmCard = (film) => {
    const filmComponent = new FilmCardView(film);
    const popupComponent = new PopupView(film);
    const popupContainerElement = document.querySelector('body');
    const popupCloseButtonElement = popupComponent.element.querySelector('.film-details__close-btn');

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closePopup();
      }
    };

    const openPopup = () => {
      if (popupContainerElement.querySelector('.film-details')) {
        popupContainerElement.querySelector('.film-details').remove();
      }
      popupContainerElement.classList.add('hide-overflow');
      popupContainerElement.appendChild(popupComponent.element);
      popupComponent.setClosePopupButtonHandler(closePopup);
      document.addEventListener('keydown', onEscKeyDown);
    };

    function closePopup () {
      popupContainerElement.classList.remove('hide-overflow');
      popupContainerElement.removeChild(popupComponent.element);
      popupCloseButtonElement.removeEventListener('click', closePopup);
      document.removeEventListener('keydown', onEscKeyDown);
    }

    filmComponent.setClickHandler(openPopup);

    render(filmComponent, this.#filmsListContainerElement);
  };

  #renderBoard = () => {
    render(new FilterView(), this.#boardContainer);
    render(new SortView(), this.#boardContainer);
    render(this.#filmsComponent, this.#boardContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    this.#filmsListComponent.element.appendChild(this.#filmsListContainerElement);

    if (!this.#films.length) {
      render(new NoFilmsView(), this.#filmsListComponent.element);
    }

    for (let i = 0; i < Math.min(FILMS_PER_RENDER_AMOUNT, this.#films.length); i++) {
      this.#renderFilmCard(this.#films[i]);
    }

    if (this.#films.length > this.#renderedFilmsCount) {
      render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
      this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClick);
    }
  };
}
