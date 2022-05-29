import ProfilePresenter from './presenter/profile-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-model.js';
import {getRandomProfileRating} from './mock/profile-rating.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const commentsModel = new CommentsModel();
const profilePresenter = new ProfilePresenter();
const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, filterModel, commentsModel);

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

filterPresenter.init();

profilePresenter.init(siteHeaderElement, getRandomProfileRating());
boardPresenter.init();
