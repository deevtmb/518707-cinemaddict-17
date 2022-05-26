import ProfilePresenter from './presenter/profile-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilmsModel from './model/films-model.js';
import {getRandomProfileRating} from './mock/profile-rating.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

const filmsModel = new FilmsModel();
const profilePresenter = new ProfilePresenter();
const boardPresenter = new BoardPresenter(siteMainElement, filmsModel);

profilePresenter.init(siteHeaderElement, getRandomProfileRating());
boardPresenter.init();
