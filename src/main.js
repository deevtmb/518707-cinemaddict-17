import ProfilePresenter from './presenter/profile-presenter.js';
import PopupPresenter from './presenter/popup-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';

import FilmsModel from './model/films-model.js';

import {getRandomProfileRating} from './mock/profile-rating.js';
const profileRating = getRandomProfileRating();

const filmsModel = new FilmsModel().getFilms();

const siteBodyElement = document.querySelector('body');
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

const profilePresenter = new ProfilePresenter();
const boardPresenter = new BoardPresenter();
const popupPresenter = new PopupPresenter();

profilePresenter.init(siteHeaderElement, profileRating);
boardPresenter.init(siteMainElement, filmsModel);
popupPresenter.init(siteBodyElement, filmsModel[0]);
