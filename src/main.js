import ProfilePresenter from './presenter/profile-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';

import FilmsModel from './model/films-model.js';

import {getRandomProfileRating} from './mock/profile-rating.js';
const profileRating = getRandomProfileRating();

const filmsModel = new FilmsModel().films;

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

const profilePresenter = new ProfilePresenter();
const boardPresenter = new BoardPresenter();

profilePresenter.init(siteHeaderElement, profileRating);
boardPresenter.init(siteMainElement, filmsModel);
