import ProfilePresenter from './presenter/profile-presenter.js';
import PopupPresenter from './presenter/popup-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';

const siteBodyElement = document.querySelector('body');
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

const profilePresenter = new ProfilePresenter();
const boardPresenter = new BoardPresenter();
const popupPresenter = new PopupPresenter();

profilePresenter.init(siteHeaderElement);
boardPresenter.init(siteMainElement);
popupPresenter.init(siteBodyElement);
