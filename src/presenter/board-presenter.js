import {render, createElement} from '../render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmCardView from '../view/film-card-view.js';
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
    render(this.filmsListComponent, this.filmsComponent.getElement());
    this.filmsListComponent.getElement().appendChild(this.filmsListContainerElement);

    for (let i = 0; i < filmsModel.length; i++) {
      render(new FilmCardView(filmsModel[i]), this.filmsListContainerElement);
    }

    render(new ShowMoreButtonView(), this.filmsListComponent.getElement());

  }
}
