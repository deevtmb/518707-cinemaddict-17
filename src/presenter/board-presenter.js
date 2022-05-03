import {render, createElement} from '../render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

export default class BoardPresenter {
  filmsComponent = new FilmsView();
  filmsListComponent = new FilmsListView();
  filmsListContainerElement = createElement('<div class="films-list__container"></div>');

  init(boardContainer, filmsModel) {
    this.boardContainer = boardContainer;

    render(new FilterView(), this.boardContainer);
    render(new SortView(), this.boardContainer);
    render(this.filmsComponent, this.boardContainer);
    render(this.filmsListComponent, this.filmsComponent.element);
    this.filmsListComponent.element.appendChild(this.filmsListContainerElement);

    for (let i = 0; i < filmsModel.length; i++) {
      this.#renderFilmCard(filmsModel[i]);
    }

    render(new ShowMoreButtonView(), this.filmsListComponent.element);

  }

  #renderFilmCard (film) {
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
      popupCloseButtonElement.addEventListener('click', closePopup);
      document.addEventListener('keydown', onEscKeyDown);
    };

    function closePopup () {
      popupContainerElement.classList.remove('hide-overflow');
      popupContainerElement.removeChild(popupComponent.element);
      popupCloseButtonElement.removeEventListener('click', closePopup);
      document.removeEventListener('keydown', onEscKeyDown);
    }

    filmComponent.element.querySelector('.film-card__link').addEventListener('click', openPopup);

    render(filmComponent, this.filmsListContainerElement);
  }
}
